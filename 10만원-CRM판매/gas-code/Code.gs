var SPREADSHEET_ID    = '1lgAsrtoeqv1-g3Nh3D21zTyuGLdAZuP5jSXxftlIxh0';
var TEMPLATE_PAYMENT  = 'KA01TP260515054842407YswDmAiR0ae';
var TEMPLATE_COMPLETE = 'KA01TP2605150533203936iNKdKqNSyV';
var FORM_BASE_URL     = 'https://gobangmkt.github.io/blog_request/10만원-CRM판매/';
var LINK_TTL_DAYS     = 5; // 발급일 + 5일이 개인별 마감

// ── 서명 링크 (URL 위조 방지) ───────────────────────────────────────
// 비밀키는 스크립트 속성에 1회 자동 생성·보관 → 코드/깃에 노출되지 않음.
function getLinkSecret() {
  var props = PropertiesService.getScriptProperties();
  var s = props.getProperty('LINK_SECRET');
  if (!s) {
    s = Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '');
    props.setProperty('LINK_SECRET', s);
  }
  return s;
}

// from(YYYYMMDD) → 서명 16자 (base64url)
function makeSig(from) {
  var raw = Utilities.computeHmacSha256Signature(String(from), getLinkSecret());
  return Utilities.base64EncodeWebSafe(raw).replace(/[=]+$/, '').slice(0, 16);
}

// 발급일 자정 + LINK_TTL_DAYS = 개인 마감 (form.html과 동일 기준, Asia/Seoul)
function linkEndDate(from) {
  var y = parseInt(from.slice(0, 4), 10), mo = parseInt(from.slice(4, 6), 10), d = parseInt(from.slice(6, 8), 10);
  return new Date(new Date(y, mo - 1, d, 0, 0, 0, 0).getTime() + LINK_TTL_DAYS * 86400000);
}

// 서명·기간 검증 — 서버 최종 방어선. from/sig는 클라가 조작해도 여기서 막힘.
function verifyLink(from, sig) {
  from = String(from || '');
  if (!/^\d{8}$/.test(from))            return { ok: false, reason: '유효하지 않은 링크예요' };
  if (sig !== makeSig(from))            return { ok: false, reason: '유효하지 않은 링크예요' };
  if (new Date() > linkEndDate(from))   return { ok: false, reason: '신청 기간이 마감되었어요' };
  return { ok: true };
}

function getSettings() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var s = ss.getSheetByName('설정');
  var data = s.getRange(1, 1, 6, 2).getValues();
  return {
    active:       String(data[0][1]).trim(),
    startDate:    data[1][1] ? new Date(data[1][1]) : null,
    endDate:      data[2][1] ? new Date(data[2][1]) : null,
    maxCount:     data[3][1] ? parseInt(data[3][1]) : null,
    keywordDays:  data[4][1] ? parseInt(data[4][1]) : 90,
    notifyEmails: data[5]
      ? String(data[5][1] || '').split(/[,\s]+/).filter(function(x){ return x; }).join(',')
      : ''
  };
}

// [신청 내역] 시트에서 신청 기간(startDate~endDate) 내 신청 건수만 카운트.
// A열 = 신청 일시. 기간 미설정 시에는 전체 건수(기존 동작) 반환.
function countApplicationsInPeriod(cfg) {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('신청 내역');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return 0;

  var periodStart = null, periodEnd = null;
  if (cfg.startDate) { periodStart = new Date(cfg.startDate); periodStart.setHours(0, 0, 0, 0); }
  if (cfg.endDate)   { periodEnd   = new Date(cfg.endDate);   periodEnd.setHours(23, 59, 59, 999); }
  if (!periodStart && !periodEnd) return Math.max(0, lastRow - 1);

  var dates = sheet.getRange(2, 1, lastRow - 1, 1).getValues();
  var count = 0;
  for (var i = 0; i < dates.length; i++) {
    if (!dates[i][0]) continue;
    var rowDate = new Date(dates[i][0]);
    if (periodStart && rowDate < periodStart) continue;
    if (periodEnd   && rowDate > periodEnd)   continue;
    count++;
  }
  return count;
}

function checkAccess() {
  var cfg = getSettings();
  var now = new Date();

  if (cfg.active !== 'ON') return { ok: false, reason: '신청을 받지 않고 있어요' };

  if (cfg.startDate) {
    cfg.startDate.setHours(0,0,0,0);
    if (now < cfg.startDate) {
      var diff = Math.ceil((cfg.startDate - now) / 86400000);
      return { ok: false, reason: diff + '일 후 신청 가능합니다' };
    }
  }

  if (cfg.endDate) {
    cfg.endDate.setHours(23,59,59,999);
    if (now > cfg.endDate) return { ok: false, reason: '신청 기간이 마감되었어요' };
  }

  if (cfg.maxCount !== null) {
    var count = countApplicationsInPeriod(cfg);
    if (count >= cfg.maxCount) return { ok: false, reason: '신청 인원이 마감되었어요' };
  }

  return { ok: true };
}

function doGet(e) {
  if (e && e.parameter && e.parameter.gen !== undefined) {
    return renderLinkGenerator();
  }
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

// 서명 링크 발급 (운영자 토큰 필요) — 무인증 발급을 막아 서명 방어를 유지한다.
function genLink(token, from) {
  if (!checkInboxToken_(token)) return { ok: false, reason: 'unauthorized' };
  from = String(from || '');
  if (!/^\d{8}$/.test(from)) return { ok: false, reason: 'invalid_date' };
  var link = encodeURI(FORM_BASE_URL) + '?from=' + from + '&sig=' + makeSig(from);
  var end  = Utilities.formatDate(linkEndDate(from), 'Asia/Seoul', 'yyyy.MM.dd');
  logGenLink_(from, link, end);
  return { ok: true, link: link, end: end };
}

// 발급 이력 누적 — 스크립트 속성에 JSON 배열로 보관(최신순, 최대 300건). 시트 불필요, ?gen 페이지에서 바로 조회.
function logGenLink_(from, link, end) {
  try {
    var props = PropertiesService.getScriptProperties();
    var arr = JSON.parse(props.getProperty('GEN_LOG') || '[]');
    var now = new Date();
    arr.unshift({
      date: Utilities.formatDate(now, 'Asia/Seoul', 'yyyy.MM.dd'),
      time: Utilities.formatDate(now, 'Asia/Seoul', 'HH:mm'),
      from: from,
      end:  end,
      link: link
    });
    if (arr.length > 300) arr = arr.slice(0, 300);
    props.setProperty('GEN_LOG', JSON.stringify(arr));
  } catch (e) {}
}

function getGenLog_() {
  try {
    return JSON.parse(PropertiesService.getScriptProperties().getProperty('GEN_LOG') || '[]');
  } catch (e) { return []; }
}

// 운영자용 발급 페이지 — 웹앱 URL 뒤에 ?gen 을 붙여 접속. 토큰+날짜 입력 시 genLink 호출.
function renderLinkGenerator() {
  var SELF = ScriptApp.getService().getUrl();
  var h =
  '<!doctype html><html lang="ko"><head><meta charset="utf-8">' +
  '<meta name="viewport" content="width=device-width,initial-scale=1"><title>신청 링크 발급</title><style>' +
  '*{box-sizing:border-box;margin:0;padding:0}' +
  'body{font-family:-apple-system,"Segoe UI",sans-serif;background:#F2F4F6;color:#191F28;padding:34px 18px;line-height:1.5}' +
  '.wrap{max-width:520px;margin:0 auto}h1{font-size:20px;font-weight:800;margin-bottom:6px}' +
  '.desc{font-size:14px;color:#8B95A1;margin-bottom:22px;word-break:keep-all}' +
  'label{display:block;font-size:13px;font-weight:700;color:#4A5568;margin:0 0 7px}' +
  'input{width:100%;padding:13px 14px;border:1.5px solid #E5E8EB;border-radius:10px;font-size:15px;font-family:inherit;margin-bottom:14px}' +
  'button{width:100%;border:none;border-radius:10px;font-size:15px;font-weight:700;cursor:pointer;font-family:inherit;padding:14px;background:#3182F6;color:#fff}' +
  '.card{background:#fff;border:1px solid #E5E8EB;border-radius:14px;padding:20px;margin-top:20px}' +
  '.lbl{font-size:12px;font-weight:700;color:#8B95A1;letter-spacing:.4px;margin-bottom:10px}' +
  '.link{font-size:13px;word-break:break-all;background:#F8FAFF;border:1px solid #D0E2FF;border-radius:9px;padding:12px 14px;color:#1B6CF2;margin-bottom:12px}' +
  '.copy{background:#00A0B0;margin-top:2px}.meta{font-size:13px;color:#8B95A1;margin-top:12px;text-align:center}' +
  '.err{color:#D92B2B;font-size:14px;font-weight:600;margin-top:16px}' +
  '.toast{position:fixed;left:50%;bottom:28px;transform:translateX(-50%);background:#191F28;color:#fff;font-size:14px;padding:11px 20px;border-radius:999px;opacity:0;transition:opacity .2s}.toast.on{opacity:1}' +
  '.hist-h{font-size:14px;font-weight:800;color:#191F28;margin:36px 0 14px;padding-top:24px;border-top:1px solid #E5E8EB}' +
  '.hist-day{margin-bottom:18px}' +
  '.hist-date{font-size:12px;font-weight:700;color:#8B95A1;margin-bottom:9px}.hist-date b{color:#3182F6;font-weight:700;margin-left:5px}' +
  '.hist-item{background:#fff;border:1px solid #E5E8EB;border-radius:10px;padding:11px 13px;margin-bottom:8px}' +
  '.hist-link{font-size:12px;word-break:break-all;color:#1B6CF2;line-height:1.45}' +
  '.hist-meta{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-top:9px}' +
  '.hist-meta .hm{font-size:12px;color:#8B95A1}' +
  '.hist-copy{width:auto;padding:6px 13px;font-size:12px;background:#F2F4F6;color:#4A5568}' +
  '.hist-empty{font-size:13px;color:#B0B8C1;text-align:center;padding:22px 0}' +
  '</style></head><body><div class="wrap">' +
  '<h1>신청 링크 발급</h1>' +
  '<div class="desc">운영자 토큰과 날짜를 입력하면 위조 방지 서명이 붙은 신청 링크가 생성돼요. 받는 분이 주소의 날짜를 바꿔도 서명이 맞지 않아 신청되지 않습니다.</div>' +
  '<label>운영자 토큰</label><input type="password" id="tk" placeholder="발급 토큰" autocomplete="off">' +
  '<label>시작 날짜 (이 날부터 5일간 유효)</label><input type="date" id="dt">' +
  '<button onclick="g()" id="gb">링크 생성</button>' +
  '<div id="out"></div>' +
  '<div id="hist"></div>' +
  '<div class="toast" id="toast">복사됐어요</div></div><script>' +
  'var SELF=' + JSON.stringify(SELF) + ';' +
  'var LOG=' + JSON.stringify(getGenLog_()) + ';' +
  '(function(){var d=new Date();document.getElementById("dt").value=d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");' +
  'var s=sessionStorage.getItem("gentk");if(s)document.getElementById("tk").value=s;renderHist();})();' +
  'function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}' +
  'function showToast(){var e=document.getElementById("toast");e.classList.add("on");setTimeout(function(){e.classList.remove("on");},1400);}' +
  'function renderHist(){var h=document.getElementById("hist");if(!LOG.length){h.innerHTML="";return;}' +
  'var groups={},order=[];LOG.forEach(function(it){if(!groups[it.date]){groups[it.date]=[];order.push(it.date);}groups[it.date].push(it);});' +
  'var html="<div class=\\"hist-h\\">발급 이력 ("+LOG.length+")</div>";' +
  'order.forEach(function(d){html+="<div class=\\"hist-day\\"><div class=\\"hist-date\\">"+esc(d)+"<b>"+groups[d].length+"건</b></div>";' +
  'groups[d].forEach(function(it){html+="<div class=\\"hist-item\\"><div class=\\"hist-link\\">"+esc(it.link)+"</div>"+' +
  '"<div class=\\"hist-meta\\"><span class=\\"hm\\">"+esc(it.time||"")+" 발급 · 마감 "+esc(it.end)+"</span>"+' +
  '"<button class=\\"hist-copy\\">복사</button></div></div>";});html+="</div>";});h.innerHTML=html;}' +
  'document.getElementById("hist").addEventListener("click",function(e){var b=e.target.closest&&e.target.closest(".hist-copy");if(!b)return;' +
  'var lk=b.closest(".hist-item").querySelector(".hist-link").innerText;navigator.clipboard.writeText(lk).then(showToast);});' +
  'function g(){var tk=document.getElementById("tk").value.trim();var v=document.getElementById("dt").value;' +
  'if(!tk){alert("토큰을 입력하세요");return;}if(!v){alert("날짜를 선택하세요");return;}' +
  'sessionStorage.setItem("gentk",tk);var b=document.getElementById("gb");b.disabled=true;b.textContent="생성 중...";' +
  'fetch(SELF,{method:"POST",body:JSON.stringify({action:"genLink",token:tk,from:v.replace(/-/g,"")})}).then(function(r){return r.json();}).then(function(d){' +
  'b.disabled=false;b.textContent="링크 생성";var o=document.getElementById("out");' +
  'if(!d.ok){o.innerHTML="<div class=\\"err\\">"+(d.reason==="unauthorized"?"토큰이 올바르지 않습니다.":"날짜가 올바르지 않습니다.")+"</div>";return;}' +
  'o.innerHTML="<div class=\\"card\\"><div class=\\"lbl\\">발급된 신청 링크</div><div class=\\"link\\" id=\\"lnk\\">"+d.link+"</div>"+' +
  '"<button class=\\"copy\\" onclick=\\"cp()\\">링크 복사</button><div class=\\"meta\\">마감 "+d.end+" · 발급일 +5일</div></div>";' +
  'var n=new Date(),p=function(x){return String(x).padStart(2,"0");};' +
  'LOG.unshift({date:n.getFullYear()+"."+p(n.getMonth()+1)+"."+p(n.getDate()),time:p(n.getHours())+":"+p(n.getMinutes()),from:v.replace(/-/g,""),end:d.end,link:d.link});renderHist();' +
  '}).catch(function(){b.disabled=false;b.textContent="링크 생성";alert("오류가 발생했어요");});}' +
  'function cp(){var t=document.getElementById("lnk").innerText;navigator.clipboard.writeText(t).then(showToast);}' +
  '</script></body></html>';
  return HtmlService.createHtmlOutput(h).setTitle('신청 링크 발급')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var result;

    if (action === 'checkAccess') {
      var link = verifyLink(payload.from, payload.sig);
      var access = link.ok ? checkAccess() : link;
      var cfg = getSettings();
      var currentCount = countApplicationsInPeriod(cfg);
      result = {
        ok: access.ok,
        reason: access.reason || '',
        startDate: cfg.startDate ? Utilities.formatDate(cfg.startDate, 'Asia/Seoul', 'yyyy.MM.dd') : '',
        endDate: cfg.endDate ? Utilities.formatDate(cfg.endDate, 'Asia/Seoul', 'yyyy.MM.dd') : '',
        maxCount: cfg.maxCount || 0,
        currentCount: currentCount
      };
    } else if (action === 'checkKeyword') {
      result = checkKeyword(payload.keyword);
    } else if (action === 'fetchPlaceInfo') {
      result = fetchPlaceInfo(payload.url);
    } else if (action === 'checkPlaceUrl') {
      result = checkPlaceUrl(payload.url);
    } else if (action === 'submitForm') {
      result = submitForm(payload);
    } else if (action === 'genLink') {
      result = genLink(payload.token, payload.from);
    } else if (action === 'listRequests') {
      result = listRequests(payload.token);
    } else if (action === 'sendPaymentLink') {
      result = sendPaymentLink(payload.token, payload.row);
    } else if (action === 'setPaymentDate') {
      result = setPaymentDate(payload.token, payload.row, payload.date);
    } else {
      result = { error: 'Unknown action: ' + action };
    }
  } catch (err) {
    result = { error: err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function checkPlaceUrl(url) {
  if (!url) return { available: true };
  var cfg = getSettings();
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('신청 내역');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { available: true };
  var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  var normalizedInput = url.trim().toLowerCase();

  var periodStart = null, periodEnd = null;
  if (cfg.startDate) { periodStart = new Date(cfg.startDate); periodStart.setHours(0, 0, 0, 0); }
  if (cfg.endDate)   { periodEnd   = new Date(cfg.endDate);   periodEnd.setHours(23, 59, 59, 999); }

  for (var i = 0; i < data.length; i++) {
    var rowUrl = String(data[i][4]).trim().toLowerCase();
    if (rowUrl !== normalizedInput) continue;
    if (!periodStart && !periodEnd) return { available: false };
    var rowDate = new Date(data[i][0]);
    var inPeriod = true;
    if (periodStart && rowDate < periodStart) inPeriod = false;
    if (periodEnd   && rowDate > periodEnd)   inPeriod = false;
    if (inPeriod) return { available: false };
  }
  return { available: true };
}

function checkKeyword(keyword) {
  if (!keyword || keyword.trim() === '') return { available: true };
  var normalizedInput = keyword.trim().replace(/\s+/g, '');
  var cfg = getSettings();
  var limitDays = cfg.keywordDays || 90;
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('완료 내역');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return { available: true };
  var data = sheet.getRange(2, 1, lastRow - 1, 7).getValues();
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  for (var i = 0; i < data.length; i++) {
    if (!data[i][6]) continue;
    var completedDate = new Date(data[i][6]);
    var normalizedStored = String(data[i][4]).trim().replace(/\s+/g, '');
    if (normalizedStored === normalizedInput) {
      completedDate.setHours(0, 0, 0, 0);
      var diffDays = Math.floor((today - completedDate) / (1000 * 60 * 60 * 24));
      if (diffDays < limitDays) {
        return { available: false, remainingDays: limitDays - diffDays };
      }
    }
  }
  return { available: true };
}

function fetchPlaceInfo(url) {
  try {
    var response = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    var html = response.getContentText('UTF-8');
    var result = { deposit: '', monthly: '', walking: '', ogTitle: '', ogDesc: '', ogImage: '' };

    var ogTitleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (!ogTitleMatch) ogTitleMatch = html.match(/<meta\s+content="([^"]+)"\s+property="og:title"/i);
    if (ogTitleMatch) {
      result.ogTitle = ogTitleMatch[1];
      var mMatch = ogTitleMatch[1].match(/월\s+([0-9~,]+)/);
      if (mMatch) result.monthly = mMatch[1] + '만원';
      var dMatch = ogTitleMatch[1].match(/보\s+([0-9~,]+)/);
      if (dMatch) result.deposit = dMatch[1] + '만원';
    }

    var ogDescMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
    if (!ogDescMatch) ogDescMatch = html.match(/<meta\s+content="([^"]+)"\s+property="og:description"/i);
    if (ogDescMatch) {
      result.ogDesc = ogDescMatch[1];
      var wMatch = ogDescMatch[1].match(/([가-힣]+역\s+도보\s+[0-9]+분)/);
      if (wMatch) result.walking = wMatch[1];
    }

    var ogImgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/i);
    if (!ogImgMatch) ogImgMatch = html.match(/<meta\s+content="([^"]+)"\s+property="og:image"/i);
    if (ogImgMatch) result.ogImage = ogImgMatch[1];

    return result;
  } catch(e) {
    return { error: true, msg: e.toString() };
  }
}

function submitForm(formData) {
  // 서버 최종 방어선 — URL 조작으로 마감을 우회해도 여기서 거부된다.
  var link = verifyLink(formData.from, formData.sig);
  if (!link.ok) return { success: false, reason: link.reason };
  var access = checkAccess();
  if (!access.ok) return { success: false, reason: access.reason };

  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);

  var urlCheck = checkPlaceUrl(formData.placeUrl);
  if (!urlCheck.available) return { success: false, reason: 'duplicate_url' };

  var sheet = ss.getSheetByName('신청 내역');
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['신청일시', '결제완료일', '신청자', '전화번호', '지점 URL', '키워드1', '키워드2', '키워드3', '강조 내용', '보증금', '월세', '도보정보', '작성 타입', '상태']);
    sheet.getRange(1, 1, 1, 14).setFontWeight('bold').setBackground('#f0f0f0');
  }
  var now = new Date();
  sheet.appendRow([now, '', formData.name, formData.phone, formData.placeUrl, formData.keyword1, formData.keyword2 || '', formData.keyword3 || '', formData.description, formData.deposit || '', formData.monthly || '', formData.walking || '', formData.templateType || 'A', '신청완료']);

  var doneSheet = ss.getSheetByName('완료 내역');
  if (doneSheet) {
    // D-day(A), 신청자(B), 전화번호(C), 지점URL(D), 장악키워드(E), 블로그URL(F), 완료일(G), 발송상태(H), 발송시간(I)
    doneSheet.appendRow(['', formData.name || '', formData.phone || '', formData.placeUrl || '', '', '', '', '', '']);
    // 체크박스 서식 잔재를 덮어쓰기 위해 명시적으로 setValue
    doneSheet.getRange(doneSheet.getLastRow(), 8).setValue('발송대기');
  }

  // 결제 요청 알림톡
  try {
    sendAlimtalk(formData.phone, TEMPLATE_PAYMENT, { '#{신청자}': formData.name || '' });
  } catch(alimErr) {
    Logger.log('결제 요청 알림톡 실패: ' + alimErr);
  }

  // 신청 접수 이메일 알림
  try {
    var NOTIFY_EMAIL = 'archoit94@neoflat.net';
    var subject = '[고방 블로그] 새 신청 접수 — ' + formData.name + ' / ' + (formData.keyword1 || '');
    var body = [
      '새로운 블로그 신청이 접수됐어요.',
      '',
      '신청일시: ' + Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm'),
      '이름: ' + formData.name,
      '전화번호: ' + formData.phone,
      '지점 URL: ' + formData.placeUrl,
      '키워드: ' + [formData.keyword1, formData.keyword2, formData.keyword3].filter(Boolean).join(' / '),
      '작성 타입: ' + (formData.templateType || 'A') + '타입',
      '',
      '▶ 신청 내역 확인: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID,
    ].join('\n');
    MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
  } catch(mailErr) {}

  return { success: true };
}

// SOLAPI HMAC-SHA256 인증 헤더 생성
function getSolapiAuthHeader() {
  var props     = PropertiesService.getScriptProperties();
  var apiKey    = props.getProperty('SOLAPI_API_KEY');
  var apiSecret = props.getProperty('SOLAPI_API_SECRET');
  var date      = Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');
  var salt      = Utilities.getUuid();
  var signature = Utilities.computeHmacSha256Signature(date + salt, apiSecret)
    .map(function(b) { return ('0' + (b & 0xFF).toString(16)).slice(-2); })
    .join('');
  return 'HMAC-SHA256 apiKey=' + apiKey + ', date=' + date + ', salt=' + salt + ', signature=' + signature;
}

// [신청 내역] 시트에서 지점 URL로 행 찾아 주황색으로 표시
function highlightRequestRowByUrl(ss, targetUrl) {
  if (!targetUrl || targetUrl.trim() === '') return;
  var requestSheet = ss.getSheetByName('신청 내역');
  if (!requestSheet) return;
  var lastRow = requestSheet.getLastRow();
  if (lastRow < 2) return;
  var data = requestSheet.getRange(2, 5, lastRow - 1, 1).getValues();
  var normalizedTarget = String(targetUrl).trim().toLowerCase();
  for (var i = 0; i < data.length; i++) {
    var rowUrl = String(data[i][0]).trim().toLowerCase();
    if (rowUrl === normalizedTarget) {
      var range = requestSheet.getRange(i + 2, 1, 1, requestSheet.getLastColumn());
      range.setBackground('#ff9900');
      return;
    }
  }
}

// 알림톡 발송
function sendAlimtalk(to, templateId, variables) {
  var pfId    = PropertiesService.getScriptProperties().getProperty('SOLAPI_PF_ID');
  var payload = {
    message: {
      to: String(to).replace(/[^0-9]/g, ''),
      kakaoOptions: { pfId: pfId, templateId: templateId, variables: variables }
    }
  };
  var res = UrlFetchApp.fetch('https://api.solapi.com/messages/v4/send', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: getSolapiAuthHeader() },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });
  Logger.log('알림톡 응답: ' + res.getContentText());
  return res;
}

// 설치형 트리거 등록 — 코드 붙여넣기 후 최초 1회 실행
function setupTrigger() {
  ScriptApp.getProjectTriggers().forEach(function(t) {
    if (t.getHandlerFunction() === 'onSheetEdit') ScriptApp.deleteTrigger(t);
  });
  ScriptApp.newTrigger('onSheetEdit')
    .forSpreadsheet(SpreadsheetApp.openById(SPREADSHEET_ID))
    .onEdit()
    .create();
}

// 설치형 onEdit 핸들러
function onSheetEdit(e) {
  var sheet     = e.range.getSheet();
  var sheetName = sheet.getName();
  var col       = e.range.getColumn();
  var row       = e.range.getRow();

  // 신청 내역 B열(결제완료일) → 완료 내역 A열(D-day) 자동 계산 + 팀원 알림메일
  // (CS앱 setPaymentDate와 공용 — applyBlogPaymentComplete_)
  if (sheetName === '신청 내역' && col === 2 && row >= 2) {
    var paymentDate = e.range.getValue();
    if (!paymentDate) return;
    applyBlogPaymentComplete_(e.source, sheet, row, paymentDate);
  }

  // 완료 내역 H열(발송 드롭박스) → 작업완료 알림톡 발송 + [신청 내역] 주황색 표시
  if (sheetName === '완료 내역' && col === 8 && row >= 2) {
    var currentValue = String(e.range.getValue()).trim();
    if (currentValue !== '발송하기') return;

    var rowData  = sheet.getRange(row, 1, 1, 8).getValues()[0];
    var phone    = String(rowData[2]).replace(/[^0-9]/g, '');
    var keyword  = String(rowData[4] || '').trim();
    var blogUrl  = String(rowData[5] || '').trim();
    var completeDate = rowData[6];
    var placeUrl2 = String(rowData[3] || '');

    // 조건 확인: E(키워드), F(블로그URL), G(완료일) 모두 필수
    if (!keyword || !blogUrl || !completeDate) {
      e.range.setValue('발송대기');
      return;
    }

    var iCell = sheet.getRange(row, 9).getValue();
    if (iCell) {
      e.range.setValue('발송완료');
      return;
    }

    try {
      sendAlimtalk(phone, TEMPLATE_COMPLETE, {
        '#{지점URL}':    placeUrl2,
        '#{장악키워드}': keyword,
        '#{블로그URL}':  blogUrl
      });
      sheet.getRange(row, 9).setValue(Utilities.formatDate(new Date(), 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss'));
      sheet.getRange(row, 8).setValue('발송완료');
      highlightRequestRowByUrl(e.source, placeUrl2);
    } catch(err) {
      Logger.log('작업완료 알림톡 실패: ' + err);
      e.range.setValue('발송대기');
    }
  }
}

function testAuth() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log(ss.getName());
}

// 마이그레이션: H열(true/false) → "발송대기"/"발송완료"로 변환
function migrateToDropdown() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('완료 내역');
  var lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log('완료 내역 데이터 없음');
    return;
  }

  for (var i = 2; i <= lastRow; i++) {
    var hValue = sheet.getRange(i, 8).getValue();
    var newValue = hValue === true ? '발송완료' : '발송대기';
    sheet.getRange(i, 8).setValue(newValue);
  }

  Logger.log('마이그레이션 완료: ' + (lastRow - 1) + '개 행 변환됨');
}

// H열에 드롭박스 + 조건부 색상 설정
function setupH_Dropdown() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('완료 내역');
  var range = sheet.getRange(2, 8, 1000, 1);

  // 체크박스 포함 기존 유효성 검사 완전 제거 후 재설정
  range.clearDataValidations();

  var rule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['발송대기', '발송하기'], false)
    .build();
  range.setDataValidation(rule);

  // 기존 조건부 서식 중 H열 외 규칙은 유지, H열 규칙만 교체
  var existing = sheet.getConditionalFormatRules().filter(function(r) {
    return r.getRanges().every(function(rng) { return rng.getColumn() !== 8; });
  });

  var newRules = [
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('발송대기')
      .setBackground('#F5F5F5').setFontColor('#9E9E9E')
      .setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('발송하기')
      .setBackground('#FFF8E1').setFontColor('#F57F17')
      .setRanges([range]).build(),
    SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo('발송완료')
      .setBackground('#E8F5E9').setFontColor('#388E3C')
      .setRanges([range]).build()
  ];

  sheet.setConditionalFormatRules(existing.concat(newRules));
  Logger.log('H열 드롭박스 + 색상 설정 완료');
}

// E+F+G 모두 채워진 기존 행 → 발송완료로 일괄 변경
function fixCompletedRows() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('완료 내역');
  var lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  var count = 0;
  for (var i = 2; i <= lastRow; i++) {
    var rowData = sheet.getRange(i, 1, 1, 8).getValues()[0];
    var keyword      = String(rowData[4] || '').trim();
    var blogUrl      = String(rowData[5] || '').trim();
    var completeDate = rowData[6];
    var currentH     = String(rowData[7] || '').trim();

    if (keyword && blogUrl && completeDate && currentH !== '발송완료') {
      sheet.getRange(i, 8).setValue('발송완료');
      count++;
    }
  }
  Logger.log('fixCompletedRows 완료: ' + count + '개 행 → 발송완료');
}

// H열 FALSE 값 정리 (마이그레이션 완료 후 남은 불필요한 값 제거)
function cleanupH_Column() {
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('완료 내역');
  var lastRow = sheet.getLastRow();

  if (lastRow < 2) {
    Logger.log('완료 내역 데이터 없음');
    return;
  }

  for (var i = 2; i <= lastRow; i++) {
    var hValue = sheet.getRange(i, 8).getValue();
    if (hValue === false || hValue === 'FALSE') {
      sheet.getRange(i, 8).clearContent();
      sheet.getRange(i, 8).setValue('발송대기');
    }
  }

  Logger.log('H열 정리 완료: FALSE 값을 "발송대기"로 변환');
}

/* ═══════════════════════════════════════════════════════════
   CS 도움앱 — 신규 요청 인박스 중계 (listRequests / sendPaymentLink / setPaymentDate)
   신청 내역(14열): A신청일시 B결제완료일 C신청자 D전화번호 E지점URL
                    F키워드1 G키워드2 H키워드3 I강조 J보증금 K월세 L도보 M작성타입 N상태
   공유 토큰(Script Property INBOX_TOKEN) 검증. 전화번호(D)는 응답에서 제외.
═══════════════════════════════════════════════════════════ */

function checkInboxToken_(token) {
  var t = PropertiesService.getScriptProperties().getProperty('INBOX_TOKEN');
  return !!t && token === t;
}

function fmtDateTime_(v) {
  if (!v) return '';
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Seoul', 'yyyy-MM-dd HH:mm');
  return String(v);
}
function fmtDate_(v) {
  if (!v) return '';
  if (v instanceof Date) return Utilities.formatDate(v, 'Asia/Seoul', 'yyyy-MM-dd');
  return String(v);
}

// 신청 내역(14열) → 전화번호(D,4번째) 제외 목록. 결제완료일(B)로 paid 판정.
function listRequests(token) {
  if (!checkInboxToken_(token)) return { error: 'unauthorized' };
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('신청 내역');
  var lastRow = sheet.getLastRow();
  var items = [];
  if (lastRow >= 2) {
    var data = sheet.getRange(2, 1, lastRow - 1, 14).getValues();
    for (var i = 0; i < data.length; i++) {
      var r = data[i];
      if (!String(r[3] || '').trim()) continue; // 전화번호(D) 빈 행=공지 등 → 제외
      var paidVal = r[1]; // B 결제완료일
      items.push({
        row: i + 2,
        신청일시: fmtDateTime_(r[0]),
        paid: !!paidVal,
        paidDate: fmtDate_(paidVal),
        paidDateISO: fmtDate_(paidVal),
        신청자: String(r[2] || ''),
        // 전화번호 r[3] 제외(PII)
        지점URL: String(r[4] || ''),
        키워드1: String(r[5] || ''),
        키워드2: String(r[6] || ''),
        키워드3: String(r[7] || ''),
        강조내용: String(r[8] || ''),
        작성타입: String(r[12] || ''),
        상태: String(r[13] || '')
      });
    }
  }
  return { sheetUrl: 'https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID, items: items };
}

// 결제요청 알림톡 발송 + 상태(N,14)='결제링크발송'. 이미 발송 기록 있으면 가드.
function sendPaymentLink(token, row) {
  if (!checkInboxToken_(token)) return { error: 'unauthorized' };
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('신청 내역');
  if (row < 2 || row > sheet.getLastRow()) return { error: 'invalid_row' };

  var rowData = sheet.getRange(row, 1, 1, 14).getValues()[0];
  if (String(rowData[13] || '').indexOf('결제링크발송') >= 0) {
    return { ok: true, already: true };
  }
  var phone = String(rowData[3] || '');
  var name = String(rowData[2] || '');
  if (!phone) return { error: 'no_phone' };
  try {
    sendAlimtalk(phone, TEMPLATE_PAYMENT, { '#{신청자}': name });
    sheet.getRange(row, 14).setValue('결제링크발송');
    return { ok: true };
  } catch (e) {
    return { error: String(e) };
  }
}

// 결제완료일(B) 기입/취소. 프로그래밍 setValue는 onEdit 미발동 → 후속작업 직접 호출.
function setPaymentDate(token, row, date) {
  if (!checkInboxToken_(token)) return { error: 'unauthorized' };
  var ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  var sheet = ss.getSheetByName('신청 내역');
  if (row < 2 || row > sheet.getLastRow()) return { error: 'invalid_row' };

  if (!date) {
    sheet.getRange(row, 2).clearContent(); // 취소(clear) — 후속 알림 없음
    return { ok: true };
  }
  var d = new Date(date); // 'yyyy-MM-dd'
  sheet.getRange(row, 2).setValue(d);
  try {
    applyBlogPaymentComplete_(ss, sheet, row, d);
  } catch (e) {
    Logger.log('결제완료 후속작업 실패: ' + e);
  }
  return { ok: true };
}

// onSheetEdit 신청내역 B열 로직과 공용: 완료내역 D-day 갱신 + 팀원 알림메일.
function applyBlogPaymentComplete_(ss, sheet, row, paymentDate) {
  var dDay = new Date(paymentDate);
  dDay.setDate(dDay.getDate() + 7);
  var placeUrl = sheet.getRange(row, 5).getValue();
  if (placeUrl) {
    var doneSheet = ss.getSheetByName('완료 내역');
    if (doneSheet) {
      var lastRow = doneSheet.getLastRow();
      if (lastRow >= 2) {
        var doneUrls = doneSheet.getRange(2, 4, lastRow - 1, 1).getValues();
        var normalizedUrl = String(placeUrl).trim().toLowerCase();
        for (var i = 0; i < doneUrls.length; i++) {
          if (String(doneUrls[i][0]).trim().toLowerCase() === normalizedUrl) {
            doneSheet.getRange(i + 2, 1).setValue(dDay);
            break;
          }
        }
      }
    }
  }
  try {
    var notifyTo = getSettings().notifyEmails;
    if (notifyTo) {
      var rowData = sheet.getRange(row, 1, 1, 14).getValues()[0];
      var name = String(rowData[2] || '');
      var phone = String(rowData[3] || '');
      var url = String(rowData[4] || '');
      var subject = '[고방 블로그] 결제완료 — ' + name;
      var body = [
        '결제가 완료됐어요.',
        '',
        '결제완료일: ' + Utilities.formatDate(new Date(paymentDate), 'Asia/Seoul', 'yyyy-MM-dd'),
        '신청자: ' + name,
        '전화번호: ' + phone,
        '지점 URL: ' + url,
        '키워드1: ' + String(rowData[5] || ''),
        '키워드2: ' + String(rowData[6] || ''),
        '키워드3: ' + String(rowData[7] || ''),
        '강조 내용: ' + String(rowData[8] || ''),
        '작성 타입: ' + (String(rowData[12] || 'A')) + '타입',
        '',
        '▶ 신청 내역 확인: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID,
      ].join('\n');
      MailApp.sendEmail(notifyTo, subject, body);
    }
  } catch (mailErr) {}
}
