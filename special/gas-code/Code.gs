// ═══════════════════════════════════════════════════════════════════
//  ★ 기존 고객 특별가(3차) 복제본 GAS — 기존(2차)과 물리적으로 완전 분리 ★
//  아래 3개 상수만 새 값으로 교체. 나머지 로직은 2차와 100% 동일.
// ═══════════════════════════════════════════════════════════════════

// (1) 새로 복사한 스프레드시트 ID — 기존 2차 시트(1lgAsrt…)와 다른 ID여야 함!
var SPREADSHEET_ID    = 'PASTE_NEW_SPREADSHEET_ID_HERE';

// (2) 결제요청 알림톡 — 10만원 결제링크가 본문에 박힌 신규 카카오 템플릿 ID
//     ⚠️ 기존 템플릿(…YswDmAiR0ae)은 15만원 링크이므로 절대 재사용 금지.
//     SOLAPI/카카오 콘솔에서 10만원 링크로 새 템플릿 등록·승인 후 그 ID 입력.
var TEMPLATE_PAYMENT  = 'PASTE_NEW_PAYMENT_TEMPLATE_ID_HERE';

// (3) 작업완료 알림톡 — 발행 URL 변수만 쓰고 가격 무관 → 기존 템플릿 그대로 재사용 OK.
var TEMPLATE_COMPLETE = 'KA01TP2605150533203936iNKdKqNSyV';

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
  return ContentService.createTextOutput(JSON.stringify({ status: 'ok' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var action = payload.action;
    var result;

    if (action === 'checkAccess') {
      var access = checkAccess();
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
