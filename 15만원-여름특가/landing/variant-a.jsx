/* global React */
const { useState: useStateA, useEffect: useEffectA } = React;

// ════════════════════════════════════════════════════════════════
//  고방 블로그 — "U사장님 특가" 랜딩
//  팔레트: 밝은 중립 베이스 + 틸(U 브랜드) 악센트 + 딥틸 대비 밴드 2곳
//  상시 판매 · 정가 300,000 → 50% → 150,000 (VAT 별도)
// ════════════════════════════════════════════════════════════════

const APPLY_URL = 'https://gobangmkt.github.io/blog_request/';
const ASK_URL   = 'https://u-ceo.channel.io/workflows/828761';

// ── SVG 아이콘 ────────────────────────────────────────────────────
const Ic = {
  check: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  arrow: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>),
  doc: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M14 3v5h5M8.5 13h7M8.5 16.5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  layers: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M12 3 3 8l9 5 9-5-9-5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M3 13l9 5 9-5M3 16.5l9 5 9-5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>),
  target: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/></svg>),
  spark: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  bell: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M13.7 21a2 2 0 0 1-3.4 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  bolt: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>),
  users: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><circle cx="9" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 20c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 5.2A3.2 3.2 0 0 1 18 11M21 20c0-2.6-1.6-4.6-4-5.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  chart: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M4 19V5M4 19h16M8 16v-4M12 16V8M16 16v-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>),
  pin: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="12" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.8"/></svg>),
  chat: (p) => (<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" {...p}><path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 20l1.4-6.4A8 8 0 1 1 21 11.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>),
};

function Pill({ children, style }) {
  return <span className="v2-pill" style={style}>{children}</span>;
}

function Eyebrow({ children, dark }) {
  return (
    <span className="v2-eyebrow" style={{
      color: dark ? 'var(--accBr)' : 'var(--accD)',
      borderColor: dark ? 'rgba(99,222,226,.42)' : 'rgba(13,124,131,.34)',
      background: dark ? 'rgba(99,222,226,.10)' : 'rgba(13,124,131,.07)',
    }}>{children}</span>
  );
}

// ── 네비 (상단 고정 — CTA 항상 노출) ───────────────────────────────
function V2Nav() {
  const [solid, setSolid] = useStateA(false);
  useEffectA(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav className={'v2-nav' + (solid ? ' is-solid' : '')}>
      <div className="v2-container v2-nav-inner">
        <a href="#top" className="v2-nav-logo">
          <img src="assets/U_ALF.png" alt="고방" />
          <span className="v2-nav-name">고방 블로그</span>
          <Pill style={{ fontSize: 11, padding: '3px 9px' }}>U사장님 특가</Pill>
        </a>
        <a href={APPLY_URL} target="_blank" rel="noopener" className="v2-cta v2-cta-sm">
          15만원 신청 <Ic.arrow style={{ marginLeft: 2 }} />
        </a>
      </div>
    </nav>
  );
}

// ── FAQ ──────────────────────────────────────────────────────────
function V2Faq({ q, a, open: o }) {
  const [open, setOpen] = useStateA(!!o);
  return (
    <div className="v2-faq">
      <button className="v2-faq-q" onClick={() => setOpen(!open)} aria-expanded={open}>
        <span className="v2-faq-mark">Q</span>
        <span className="v2-faq-text">{q}</span>
        <span className={'v2-faq-plus' + (open ? ' is-open' : '')} aria-hidden>+</span>
      </button>
      <div className="v2-faq-a" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="v2-faq-a-inner"><div dangerouslySetInnerHTML={{ __html: a }} /></div>
      </div>
    </div>
  );
}

// ── 네이버 검색 노출 목업 ─────────────────────────────────────────
function SearchProof() {
  const rows = [
    { ours: true,  title: '합정역 도보 5분 · 신축 고시원 후기', date: '2일 전' },
    { ours: false, title: '마포구 고시원 추천 BEST 5', date: '5일 전' },
    { ours: false, title: '월세 40만원대 1인실 고시원', date: '1주 전' },
  ];
  return (
    <div className="v2-search">
      <div className="v2-search-bar">
        <span className="v2-naver">NAVER</span>
        <span className="v2-search-kw">마포구고시원</span>
      </div>
      <div className="v2-search-tab">VIEW</div>
      {rows.map((r, i) => (
        <div key={i} className="v2-search-row" style={{ borderBottom: i < 2 ? '1px solid #EEF1F5' : 'none' }}>
          {r.ours && <span className="v2-search-ours">상위노출</span>}
          <div>
            <div className="v2-search-title" style={{ color: r.ours ? 'var(--accD)' : '#1B2330', fontWeight: r.ours ? 800 : 600 }}>{r.title}</div>
            <div className="v2-search-meta">blog.naver.com · {r.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
function VariantA() {
  const benefits = [
    { I: Ic.doc,    t: '고방 공식 블로그 정식 발행', d: '월 17만 명이 보는 공식 블로그에 내 지점 포스팅이 그대로 올라가요.' },
    { I: Ic.layers, t: '템플릿 직접 선택',          d: 'A타입(설명형) / B타입(후기형) 중 원하는 방식을 직접 골라요.' },
    { I: Ic.target, t: '키워드 1~3개 직접 제출',     d: '노리고 싶은 지역·유형 키워드를 직접 입력해요.' },
    { I: Ic.spark,  t: '강조 포인트 반영',          d: '꼭 들어갔으면 하는 내용을 자유롭게 추가할 수 있어요.' },
    { I: Ic.bell,   t: '발행 URL 알림톡 발송',      d: '완료되면 카카오 알림톡으로 발행 링크를 바로 전달해요.' },
    { I: Ic.bolt,   t: '결제 후 1주 내 발행',        d: '선정 안내·결제 후 영업일 7일 내 빠르게 진행돼요.' },
  ];
  const proofs = [
    { I: Ic.users, n: '17~18만', l: '월 방문자', s: '일 평균 4,500명+' },
    { I: Ic.chart, n: '최적화 2+', l: '네이버 블로그 지수', s: '전체 상위 2.8%' },
    { I: Ic.pin,   n: '1인주거', l: '특화 채널', s: '고시원·셰어하우스 상위권' },
  ];
  const steps = [
    { n: 1, t: '신청',       d: '신청 폼에서 지점 정보 · 키워드 · 강조 내용 입력', tag: '사장님' },
    { n: 2, t: '대상자 선정', d: '내부 검토 후 알림톡으로 결제 안내', tag: '고방' },
    { n: 3, t: '결제',       d: '안내받은 토스 결제링크로 결제 — 150,000원 (VAT 별도)', tag: '사장님' },
    { n: 4, t: '작성 · 발행', d: '결제 후 영업일 7일 내 작성 → 공식 블로그 발행', tag: '고방' },
    { n: 5, t: '결과 안내',   d: '발행 URL을 카카오 알림톡으로 발송', tag: '완료' },
  ];

  return (
    <div className="v2" id="top">
      <V2Nav />

      {/* ─── HERO (라이트) ─── */}
      <header className="v2-hero">
        <div className="v2-hero-glow" aria-hidden />
        <div className="v2-container v2-hero-inner">
          <div className="v2-hero-logo v2-up d1">
            <img src="assets/U_ALF.png" alt="고방" />
          </div>

          <div className="v2-hero-tags v2-up d1">
            <span className="v2-tag"><i className="v2-dot" aria-hidden />U사장님 특가</span>
          </div>

          <h1 className="v2-h1 v2-up d2">
            정가 30만원,<br />
            지금 <span className="v2-acc">딱 반값</span>.
          </h1>

          <p className="v2-hero-sub v2-up d3">
            월 <b>17만 명</b>이 보는 고방 공식 블로그에 <b className="v2-acc">정식 발행</b>.
          </p>

          <div className="v2-hero-price v2-up d4">
            <div className="v2-hp-top">
              <span className="v2-hp-off">50% OFF</span>
              <span className="v2-hp-orig">300,000원</span>
            </div>
            <div className="v2-hp-now"><em className="num">150,000</em><span className="v2-hp-won">원</span></div>
            <span className="v2-hp-vat">VAT 별도 · 1건 단독 신청</span>
          </div>

          <div className="v2-strip v2-up d6">
            {[['50%', '할인율'], ['17만+', '월 방문자'], ['최적화 2+', '블로그 지수'], ['7일 내', '발행']].map((s, i) => (
              <div key={i} className="v2-strip-cell">
                <div className="v2-strip-n">{s[0]}</div>
                <div className="v2-strip-l">{s[1]}</div>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* ─── TRUST ─── */}
      <section className="v2-sec v2-light" id="why">
        <div className="v2-container">
          <div className="v2-head">
            <Eyebrow>어떤 채널인가요</Eyebrow>
            <h2 className="v2-h2">아무 블로그가 아니에요.<br /><span className="v2-acc">고방 공식 블로그</span>에 실립니다.</h2>
            <p className="v2-sub">1인주거 검색에 최적화된 채널. 숫자로 확인하세요.</p>
          </div>
          <div className="v2-proof-grid">
            {proofs.map((p, i) => (
              <div key={i} className="v2-proof-card">
                <span className="v2-proof-ic"><p.I /></span>
                <div className="v2-proof-n">{p.n}</div>
                <div className="v2-proof-l">{p.l}</div>
                <div className="v2-proof-s">{p.s}</div>
              </div>
            ))}
          </div>
          <div className="v2-proof-search">
            <div className="v2-ps-copy">
              <Eyebrow>실제 노출</Eyebrow>
              <h3 className="v2-h3">신청한 키워드, <span className="v2-acc">블로그탭 상단</span>을 노려요.</h3>
              <p className="v2-sub" style={{ marginTop: 14 }}>
                고방 블로그는 관련 키워드 대부분에서 상위권에 노출돼요. 내 지점 글도 같은 자리를 노립니다.
              </p>
              <ul className="v2-ticks">
                {['키워드 1~3개 직접 지정', '상위노출 중인 키워드만 작성', '발행 후 URL 알림톡 전달'].map((t, i) => (
                  <li key={i}><span className="v2-tick"><Ic.check /></span>{t}</li>
                ))}
              </ul>
            </div>
            <div className="v2-ps-mock"><SearchProof /></div>
          </div>
        </div>
      </section>

      {/* ─── VALUE ─── */}
      <section className="v2-sec v2-tint" id="value">
        <div className="v2-container">
          <div className="v2-head">
            <Eyebrow>15만원에 포함</Eyebrow>
            <h2 className="v2-h2">추가 비용 없이,<br />신청부터 발행까지 한 번에.</h2>
          </div>
          <div className="v2-ben-grid">
            {benefits.map((b, i) => (
              <div key={i} className="v2-ben-card">
                <span className="v2-ben-ic"><b.I /></span>
                <div className="v2-ben-t">{b.t}</div>
                <div className="v2-ben-d">{b.d}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICE (다크 밴드) ─── */}
      <section className="v2-sec v2-dark v2-price-sec" id="price">
        <div className="v2-container">
          <div className="v2-head">
            <Eyebrow dark>U사장님 전용 특가</Eyebrow>
            <h2 className="v2-h2 v2-on-dark">일반 블로그 마케팅 30만원~,<br />고방은 <span className="v2-acc-d">15만원</span>.</h2>
          </div>
          <div className="v2-price-card">
            <div className="v2-pc-top">
              <span className="v2-pc-orig">정가 <s>300,000원</s></span>
              <Pill>50% OFF</Pill>
            </div>
            <div className="v2-pc-arrow" aria-hidden>↓</div>
            <div className="v2-pc-label">U사장님 특가가</div>
            <div className="v2-pc-now"><em className="num">150,000</em><span className="v2-pc-won">원</span></div>
            <div className="v2-pc-vat">VAT 별도 · 1건 기준</div>
            <div className="v2-pc-note">
              <span className="v2-tick"><Ic.check /></span>
              일반 블로그 마케팅 대비 <b>15만원 절약</b> — 채널 품질은 그 이상이에요.
            </div>
          </div>
          <div className="v2-compare">
            {[
              ['가격', '30만원~', '15만원'],
              ['채널 트래픽', '미보장', '월 17만+'],
              ['블로그 등급', '일반', '최적화 2+'],
              ['키워드 선택', '제한적', '1~3개 직접'],
              ['발행 기간', '2~4주+', '7일 내'],
              ['결과 알림', '없음', '카카오 알림톡'],
            ].map((r, i) => (
              <div key={i} className="v2-cmp-row">
                <span className="v2-cmp-l">{r[0]}</span>
                <span className="v2-cmp-normal">{r[1]}</span>
                <span className="v2-cmp-gobang">{r[2]}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS ─── */}
      <section className="v2-sec v2-light" id="process">
        <div className="v2-container" style={{ maxWidth: 760 }}>
          <div className="v2-head"><Eyebrow>진행 방식</Eyebrow><h2 className="v2-h2">신청부터 발행까지</h2></div>
          <div className="v2-steps">
            {steps.map((s, i) => (
              <div key={i} className="v2-step">
                <div className="v2-step-n num">{s.n}</div>
                <div className="v2-step-line" style={{ display: i === steps.length - 1 ? 'none' : 'block' }} aria-hidden />
                <div className="v2-step-body">
                  <div className="v2-step-head">
                    <h3>{s.t}</h3>
                    <span className="v2-step-tag">{s.tag}</span>
                  </div>
                  <p>{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="v2-sec v2-tint" id="faq">
        <div className="v2-container" style={{ maxWidth: 760 }}>
          <div className="v2-head"><Eyebrow>자주 묻는 질문</Eyebrow><h2 className="v2-h2">신청 전에 확인해 주세요</h2></div>
          <div className="v2-faq-box">
            <V2Faq open q="작성 후 알림을 주나요?"
              a="네, 작성이 완료되면 <strong>신청 시 입력한 번호로 카카오톡 알림</strong>이 발송돼요. 발행된 포스팅 URL도 함께 전달돼요." />
            <V2Faq q="작성한 블로그는 어디에 노출되나요?"
              a="신청하신 키워드 기준으로 <strong>네이버 블로그탭 상위 진입을 목표</strong>로 작성해요. 네이버 알고리즘 특성상 순위·유지 기간은 변동될 수 있어요." />
            <V2Faq q="고방 광고 6개월 상품 없이도 신청할 수 있나요?"
              a="네, <strong>U사장님 특가는 단건 단독 구매</strong>가 가능해요. 6개월 상품 이용 여부와 무관하게 1건만 가볍게 신청할 수 있어요." />
            <V2Faq q="원하는 키워드로 쓸 수 있나요?"
              a="네, 키워드는 <strong>1~3개 직접 입력</strong>해요. 단, 현재 고방 블로그가 상위노출 중인 키워드에 한하며, 최근 사용된 키워드는 사용이 제한될 수 있어요. 자세한 건 <strong>신청서에서 확인</strong>돼요." />
            <V2Faq q="여러 번 신청할 수 있나요?"
              a="<strong>고방에 등록된 지점당 1회</strong> 신청 가능해요." />
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA (다크 밴드) ─── */}
      <section className="v2-sec v2-dark v2-final" id="cta">
        <div className="v2-container v2-final-inner">
          <span className="v2-final-period">U사장님 특가</span>
          <h2 className="v2-final-h">정가 30만원짜리 포스팅,<br /><span className="v2-acc-d">지금은 15만원</span>이에요.</h2>
          <a href={APPLY_URL} target="_blank" rel="noopener" className="v2-cta v2-cta-lg">
            지금 신청하기 <Ic.arrow style={{ marginLeft: 4 }} />
          </a>
          <a href={ASK_URL} target="_blank" rel="noopener" className="v2-ask">
            <Ic.chat style={{ fontSize: 18 }} /> 채널톡으로 문의하기
          </a>
        </div>
      </section>

      <footer className="v2-foot">
        <div className="v2-container">
          <div className="v2-foot-brand">
            <img src="assets/U_ALF.png" alt="고방" />
            <span>고방 · neoflatMKT</span>
          </div>
          <p>고방 공식 블로그 U사장님 특가 페이지 · gobang.kr · u-ceo.kr</p>
          <div className="v2-foot-copy">© 2026 neoflatMKT. All rights reserved.</div>
        </div>
      </footer>

      {/* 전면 고정 플로팅 CTA */}
      <div className="v2-fab-wrap">
        <span className="v2-fab-note">기존 원장님도 OK</span>
        <a href={APPLY_URL} target="_blank" rel="noopener" className="v2-fab">
          1분 만에 신청하기 <Ic.arrow style={{ marginLeft: 4 }} />
        </a>
      </div>

      <V2Styles />
    </div>
  );
}

function V2Styles() {
  return (
    <style>{`
    .v2 {
      --acc:#2C6FE3;        /* 로열 블루 악센트(밝은 배경 위) */
      --accD:#1A47A0;       /* 딥 블루 — 밝은 배경 텍스트 */
      --accBr:#84B4FF;      /* 밝은 블루 — 다크 배경 위 */
      --gold:#C8902B;       /* 골드 악센트(밝은 배경 위) */
      --goldBr:#F2C863;     /* 밝은 골드 — 다크 배경 위 */
      --blue:#2C6FE3;       /* 로열 블루 */
      --blueD:#1A47A0;      /* 딥 블루 — 밝은 배경 텍스트 */
      --blueBr:#84B4FF;     /* 밝은 블루 — 다크 배경 위 */
      --dark:#0B2E63;       /* 네이비 다크 밴드 */
      --dark2:#123A7C;
      --tint:#EEF4FD;       /* 옅은 블루 틴트 섹션 */
      --paper:#FFFFFF;
      --ink:#13203A;        /* 본문/제목 (밝은 배경) — 네이비 잉크 */
      --ink2:#56627A;       /* 보조 텍스트 */
      --onD:#F2F6FF;        /* 다크 위 텍스트 */
      --onD2:#AFC4E6;       /* 다크 위 보조 */
      --line:#E6ECF5;
      font-family:'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
      background:var(--paper); color:var(--ink);
      -webkit-font-smoothing:antialiased; overflow-x:hidden;
    }
    .v2 .num { font-family:'Playfair Display', Georgia, serif; font-feature-settings:'tnum'; }
    .v2-container { width:100%; max-width:1080px; margin:0 auto; padding:0 24px; }
    .v2 b, .v2 strong { font-weight:800; }
    .v2-acc { color:var(--accD); font-weight:inherit; }
    .v2-acc-d { color:var(--accBr); }

    .v2-pill {
      display:inline-flex; align-items:center;
      font-size:13px; font-weight:800; letter-spacing:.2px;
      color:var(--accD); padding:5px 13px; border-radius:999px;
      background:rgba(44,111,227,.12); border:1px solid rgba(44,111,227,.26);
    }
    .v2-eyebrow {
      display:inline-block; font-size:14px; font-weight:800; letter-spacing:.3px;
      padding:7px 15px; border-radius:999px; border:1px solid; margin-bottom:18px;
    }

    /* CTA — 플로팅 알약 */
    .v2-cta {
      display:inline-flex; align-items:center; justify-content:center;
      font-weight:800; border-radius:999px; text-decoration:none; white-space:nowrap;
      color:#fff; background:linear-gradient(135deg,#2C6FE3 0%,#1A47A0 100%);
      box-shadow:0 10px 26px rgba(27,71,160,.34), 0 2px 6px rgba(27,71,160,.20);
      transition:transform .16s cubic-bezier(.16,1,.3,1), box-shadow .16s;
    }
    .v2-cta:hover { transform:translateY(-3px); box-shadow:0 20px 42px rgba(27,71,160,.44), 0 4px 12px rgba(27,71,160,.26); }
    .v2-cta:active { transform:translateY(-1px); }
    .v2-cta-sm { font-size:14px; padding:11px 21px; }
    .v2-cta-lg { font-size:19px; padding:20px 46px; }
    .v2-cta svg { font-size:1.05em; }

    /* 히어로 플로팅 CTA — 더 크게, 둥둥 뜨는 글로우 */
    .v2-cta-float {
      font-size:20px; padding:22px 54px; gap:8px;
      box-shadow:0 16px 38px rgba(27,71,160,.40), 0 4px 12px rgba(27,71,160,.24);
      animation:v2float 3.4s ease-in-out infinite;
    }
    .v2-cta-float:hover { animation-play-state:paused; }
    @keyframes v2float { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-7px); } }

    /* 전면 고정 플로팅 CTA */
    .v2-fab-wrap {
      position:fixed; left:50%; bottom:26px; transform:translateX(-50%); z-index:90;
      display:flex; flex-direction:column; align-items:center; gap:9px;
      animation:v2fab 3.6s ease-in-out infinite;
    }
    .v2-fab-wrap:hover { animation-play-state:paused; }
    .v2-fab-note {
      font-size:13px; font-weight:800; color:#9A6B12; letter-spacing:-.2px;
      background:#fff; padding:6px 15px; border-radius:999px;
      border:1px solid rgba(200,144,43,.32); box-shadow:0 6px 16px rgba(27,71,160,.14);
    }
    .v2-fab {
      display:inline-flex; align-items:center; gap:6px; justify-content:center;
      font-size:18px; font-weight:800; color:#fff; letter-spacing:-.2px; text-decoration:none; white-space:nowrap;
      padding:17px 38px; border-radius:999px;
      background:linear-gradient(135deg,#2C6FE3 0%,#1A47A0 100%);
      box-shadow:0 18px 44px rgba(27,71,160,.46), 0 4px 12px rgba(27,71,160,.30);
    }
    .v2-fab svg { font-size:1.05em; }
    .v2-fab-price {
      font-size:13px; font-weight:900; color:#fff; margin-right:4px;
      background:linear-gradient(135deg,#D9A431,#C8902B); padding:3px 10px; border-radius:999px;
    }
    @keyframes v2fab { 0%,100%{ transform:translateX(-50%) translateY(0); } 50%{ transform:translateX(-50%) translateY(-6px); } }

    /* nav (라이트 히어로 위 → 다크 텍스트) */
    .v2-nav { position:sticky; top:0; z-index:80; transition:background .25s, box-shadow .25s, border-color .25s; background:transparent; border-bottom:1px solid transparent; }
    .v2-nav.is-solid { background:rgba(255,255,255,.9); backdrop-filter:blur(12px); -webkit-backdrop-filter:blur(12px); border-bottom:1px solid var(--line); box-shadow:0 4px 20px rgba(16,37,43,.06); }
    .v2-nav-inner { display:flex; align-items:center; justify-content:space-between; height:64px; }
    .v2-nav-logo { display:flex; align-items:center; gap:9px; color:var(--ink); font-size:17px; font-weight:800; }
    .v2-nav-logo img { height:28px; width:auto; }

    /* hero — 밝은 베이스 */
    .v2-hero {
      position:relative; overflow:hidden; text-align:center;
      background:linear-gradient(180deg,#E7F0FD 0%,#F3F8FE 56%,#FFFFFF 100%);
      padding:74px 0 92px; margin-top:-64px; padding-top:128px;
    }
    .v2-hero-glow {
      position:absolute; left:50%; top:-220px; width:820px; height:580px; transform:translateX(-50%);
      background:radial-gradient(60% 100% at 38% 50%, rgba(44,111,227,.14) 0%, rgba(44,111,227,0) 60%),
                 radial-gradient(60% 100% at 66% 46%, rgba(37,99,201,.12) 0%, rgba(37,99,201,0) 62%);
      pointer-events:none;
    }
    .v2-hero-inner { position:relative; z-index:1; max-width:840px; }
    .v2-hero-logo { margin:0 0 18px; }
    .v2-hero-logo img { height:58px; width:auto; filter:drop-shadow(0 10px 22px rgba(27,71,160,.24)); }
    .v2-hero-tags { display:flex; gap:10px; justify-content:center; flex-wrap:wrap; margin-bottom:24px; }
    .v2-tag {
      display:inline-flex; align-items:center; gap:9px;
      font-size:16px; font-weight:800; letter-spacing:-.2px; color:var(--accD);
      padding:10px 20px; border-radius:999px;
      background:#fff; border:1px solid var(--line); box-shadow:0 6px 16px rgba(27,71,160,.10);
    }
    .v2-tag-gold { color:#9A6B12; background:rgba(200,144,43,.12); border-color:rgba(200,144,43,.34); box-shadow:0 6px 16px rgba(200,144,43,.14); }
    .v2-dot { display:inline-block; width:8px; height:8px; border-radius:50%; background:var(--gold); box-shadow:0 0 0 3px rgba(200,144,43,.18); }
    .v2-cta-pill {
      display:inline-flex; align-items:center; gap:7px;
      font-size:13.5px; font-weight:800; color:var(--accD);
      padding:9px 18px; border-radius:999px;
      background:#fff; border:1px solid var(--line); box-shadow:0 6px 16px rgba(27,71,160,.10);
    }
    .v2-cta-pill .v2-star { color:var(--gold); font-size:1.05em; }
    .v2-h1 { font-size:62px; font-weight:900; line-height:1.1; letter-spacing:-2px; color:var(--ink); word-break:keep-all; margin:6px 0 18px; }
    .v2-strike { color:#93A6A8; text-decoration:line-through; text-decoration-color:rgba(44,111,227,.55); text-decoration-thickness:3px; }
    .v2-hero-sub { font-size:25px; line-height:1.5; color:var(--ink2); font-weight:600; word-break:keep-all; }
    .v2-hero-sub b { color:var(--ink); }

    .v2-hero-price {
      display:inline-flex; flex-direction:column; align-items:center; gap:10px;
      margin:30px auto 4px; padding:28px 52px; border-radius:24px;
      background:#fff; border:1px solid var(--line); box-shadow:0 16px 44px rgba(27,71,160,.12);
    }
    .v2-hp-top { display:inline-flex; align-items:center; gap:12px; }
    .v2-hp-off { font-size:18px; font-weight:900; color:#fff; background:linear-gradient(135deg,#D9A431,#C8902B); padding:7px 16px; border-radius:999px; box-shadow:0 6px 14px rgba(200,144,43,.32); }
    .v2-hp-orig { font-size:24px; color:#9AAAAC; text-decoration:line-through; text-decoration-thickness:2px; font-weight:600; }
    .v2-hp-now { display:inline-flex; align-items:baseline; gap:4px; line-height:1; }
    .v2-hp-now .num { font-size:78px; font-weight:900; line-height:.95; letter-spacing:-3px; color:var(--accD); }
    .v2-hp-won { font-size:36px; font-weight:900; color:var(--accD); }
    .v2-hp-vat { font-size:17px; color:var(--ink2); font-weight:600; }

    .v2-hero-cta { margin-top:32px; display:flex; flex-direction:column; align-items:center; gap:13px; }
    .v2-hero-note { font-size:14px; color:var(--ink2); }

    .v2-strip {
      display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin:50px auto 0; max-width:680px;
    }
    .v2-strip-cell { background:#fff; border:1px solid var(--line); border-radius:18px; padding:26px 10px; box-shadow:0 4px 14px rgba(16,37,43,.04); }
    .v2-strip-n { font-size:30px; font-weight:900; color:var(--accD); letter-spacing:-.5px; }
    .v2-strip-l { font-size:17px; color:var(--ink2); margin-top:8px; font-weight:600; }

    /* sections */
    .v2-sec { padding:100px 0; position:relative; }
    .v2-light { background:var(--paper); }
    .v2-tint { background:var(--tint); }
    .v2-dark { background:linear-gradient(150deg,#0E3370 0%,#0B2A5C 55%,#102A55 100%); color:var(--onD); }
    .v2-head { text-align:center; max-width:720px; margin:0 auto 54px; }
    .v2-h2 { font-size:38px; font-weight:900; line-height:1.24; letter-spacing:-1.1px; word-break:keep-all; color:var(--ink); }
    .v2-on-dark { color:var(--onD); }
    .v2-h3 { font-size:26px; font-weight:900; letter-spacing:-.7px; line-height:1.32; word-break:keep-all; color:var(--ink); }
    .v2-sub { margin-top:15px; font-size:18px; line-height:1.65; color:var(--ink2); word-break:keep-all; }
    .v2-dark .v2-sub { color:var(--onD2); }

    /* proof cards */
    .v2-proof-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; margin-bottom:22px; }
    .v2-proof-card { background:var(--paper); border:1px solid var(--line); border-radius:20px; padding:32px 26px; box-shadow:0 8px 24px rgba(16,37,43,.05); transition:transform .16s, box-shadow .16s; }
    .v2-proof-card:hover { transform:translateY(-4px); box-shadow:0 16px 38px rgba(16,37,43,.1); }
    .v2-proof-ic { display:inline-flex; width:48px; height:48px; align-items:center; justify-content:center; font-size:24px; color:var(--acc); background:rgba(44,111,227,.1); border-radius:13px; margin-bottom:16px; }
    .v2-proof-n { font-size:36px; font-weight:900; letter-spacing:-1px; color:var(--accD); line-height:1.05; }
    .v2-proof-l { font-size:18px; font-weight:800; margin-top:10px; color:var(--ink); }
    .v2-proof-s { font-size:15px; color:var(--ink2); margin-top:6px; }

    .v2-proof-search { display:grid; grid-template-columns:1fr 380px; gap:44px; align-items:center; margin-top:34px; padding:42px; background:var(--paper); border:1px solid var(--line); border-radius:24px; box-shadow:0 10px 30px rgba(16,37,43,.05); }
    .v2-ticks { list-style:none; margin:22px 0 0; padding:0; display:flex; flex-direction:column; gap:12px; }
    .v2-ticks li { display:flex; align-items:center; gap:11px; font-size:17px; font-weight:600; color:var(--ink); }
    .v2-tick { display:inline-flex; width:24px; height:24px; align-items:center; justify-content:center; font-size:14px; color:#fff; background:var(--acc); border-radius:50%; flex-shrink:0; }

    /* search mock */
    .v2-search { background:#fff; border:1px solid #E9EDF2; border-radius:16px; padding:18px; box-shadow:0 14px 38px rgba(16,37,43,.1); }
    .v2-search-bar { display:flex; align-items:center; gap:8px; margin-bottom:14px; }
    .v2-naver { font-size:21px; font-weight:900; color:#03C75A; letter-spacing:-1px; }
    .v2-search-kw { flex:1; height:32px; background:#F4F6F8; border-radius:7px; display:flex; align-items:center; padding:0 11px; font-size:13px; font-weight:700; color:#1B2330; }
    .v2-search-tab { font-size:11px; font-weight:800; color:#8A93A0; margin-bottom:6px; }
    .v2-search-row { display:flex; align-items:center; gap:9px; padding:11px 0; }
    .v2-search-ours { font-size:10px; font-weight:900; background:var(--acc); color:#fff; padding:3px 7px; border-radius:5px; flex-shrink:0; }
    .v2-search-title { font-size:13px; line-height:1.35; }
    .v2-search-meta { font-size:11px; color:#9AA3AE; margin-top:3px; }

    /* benefits */
    .v2-ben-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:18px; }
    .v2-ben-card { background:var(--paper); border:1px solid var(--line); border-radius:18px; padding:30px 26px; transition:transform .16s, box-shadow .16s; }
    .v2-ben-card:hover { transform:translateY(-3px); box-shadow:0 14px 34px rgba(16,37,43,.08); }
    .v2-ben-ic { display:inline-flex; width:46px; height:46px; align-items:center; justify-content:center; font-size:23px; color:var(--blue); background:rgba(37,99,201,.1); border-radius:12px; margin-bottom:16px; }
    .v2-ben-t { font-size:19px; font-weight:800; color:var(--ink); line-height:1.35; word-break:keep-all; }
    .v2-ben-d { font-size:15px; color:var(--ink2); line-height:1.65; margin-top:10px; word-break:keep-all; }

    /* price */
    .v2-price-card { position:relative; max-width:520px; margin:0 auto; text-align:center; background:#fff; border-radius:26px; padding:44px 40px; box-shadow:0 24px 56px rgba(0,0,0,.26); }
    .v2-pc-top { display:flex; align-items:center; justify-content:center; gap:12px; flex-wrap:wrap; }
    .v2-pc-orig { font-size:19px; color:var(--ink2); font-weight:600; }
    .v2-pc-orig s { font-size:23px; font-weight:700; }
    .v2-pc-arrow { font-size:24px; color:var(--acc); margin:8px 0; }
    .v2-pc-label { font-size:17px; font-weight:800; color:var(--accD); letter-spacing:.4px; margin-bottom:4px; }
    .v2-pc-now { display:inline-flex; align-items:baseline; justify-content:center; }
    .v2-pc-now .num { font-size:88px; font-weight:900; line-height:1; letter-spacing:-3px; background:linear-gradient(125deg,#2C6FE3 0%,#1E54B5 45%,#1A47A0 100%); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
    .v2-pc-won { font-size:32px; font-weight:900; color:var(--blueD); margin-left:4px; }
    .v2-pc-vat { font-size:16px; color:var(--ink2); margin-top:12px; }
    .v2-pc-note { display:flex; align-items:center; gap:11px; text-align:left; margin-top:22px; padding:16px 20px; background:var(--tint); border-radius:14px; font-size:16px; color:var(--ink); line-height:1.6; word-break:keep-all; }

    .v2-compare { max-width:520px; margin:30px auto 0; background:rgba(255,255,255,.06); border:1px solid rgba(132,180,255,.22); border-radius:18px; overflow:hidden; }
    .v2-cmp-row { display:grid; grid-template-columns:1fr 100px 110px; align-items:center; padding:14px 22px; border-bottom:1px solid rgba(255,255,255,.08); }
    .v2-cmp-row:last-child { border-bottom:none; }
    .v2-cmp-l { font-size:15px; color:var(--onD2); font-weight:600; }
    .v2-cmp-normal { font-size:14px; color:var(--onD2); text-align:center; text-decoration:line-through; opacity:.65; }
    .v2-cmp-gobang { font-size:15px; font-weight:800; color:var(--accBr); text-align:center; }

    /* process */
    .v2-steps { display:flex; flex-direction:column; }
    .v2-step { position:relative; display:grid; grid-template-columns:54px 1fr; gap:20px; padding-bottom:26px; }
    .v2-step-n { width:46px; height:46px; border-radius:50%; background:var(--blue); color:#fff; display:flex; align-items:center; justify-content:center; font-size:20px; font-weight:800; flex-shrink:0; z-index:1; box-shadow:0 6px 16px rgba(18,90,150,.28); }
    .v2-step-line { position:absolute; left:23px; top:46px; bottom:0; width:2px; background:linear-gradient(180deg,var(--blue),rgba(44,111,227,.18)); }
    .v2-step-body { padding-top:4px; }
    .v2-step-head { display:flex; align-items:center; gap:10px; margin-bottom:7px; flex-wrap:wrap; }
    .v2-step-head h3 { font-size:21px; font-weight:800; color:var(--ink); }
    .v2-step-tag { font-size:13px; font-weight:800; color:var(--accD); background:rgba(44,111,227,.12); padding:3px 11px; border-radius:999px; }
    .v2-step-body p { font-size:16px; color:var(--ink2); line-height:1.6; word-break:keep-all; }

    /* faq */
    .v2-faq-box { background:#fff; border:1px solid var(--line); border-radius:20px; padding:4px 26px; box-shadow:0 8px 24px rgba(16,37,43,.05); }
    .v2-faq { border-bottom:1px solid var(--line); }
    .v2-faq:last-child { border-bottom:none; }
    .v2-faq-q { width:100%; display:flex; align-items:flex-start; gap:12px; text-align:left; padding:22px 0; font-size:18px; font-weight:700; color:var(--ink); }
    .v2-faq-mark { flex-shrink:0; font-size:13px; font-weight:900; color:var(--accD); background:rgba(44,111,227,.12); padding:3px 9px; border-radius:7px; margin-top:1px; }
    .v2-faq-text { flex:1; word-break:keep-all; }
    .v2-faq-plus { flex-shrink:0; font-size:24px; color:var(--acc); transition:transform .2s; line-height:1; }
    .v2-faq-plus.is-open { transform:rotate(45deg); }
    .v2-faq-a { display:grid; grid-template-rows:0fr; transition:grid-template-rows .28s ease; }
    .v2-faq-a-inner { overflow:hidden; }
    .v2-faq-a-inner > div { padding:0 0 22px 34px; font-size:16px; color:var(--ink2); line-height:1.7; word-break:keep-all; }

    /* final */
    .v2-final-inner { position:relative; z-index:1; text-align:center; display:flex; flex-direction:column; align-items:center; }
    .v2-final-period { font-size:15px; font-weight:800; letter-spacing:.5px; color:var(--accBr); }
    .v2-final-h { font-size:40px; font-weight:900; line-height:1.26; letter-spacing:-1px; color:var(--onD); word-break:keep-all; margin:16px 0 30px; }
    .v2-ask { display:inline-flex; align-items:center; gap:8px; margin-top:18px; color:var(--onD2); font-size:16px; font-weight:600; }
    .v2-ask:hover { color:var(--onD); }

    /* footer */
    .v2-foot { background:#08203F; color:var(--onD2); padding:48px 0 104px; border-top:1px solid rgba(132,180,255,.12); }
    .v2-foot-brand { display:flex; align-items:center; gap:10px; margin-bottom:14px; }
    .v2-foot-brand img { height:26px; }
    .v2-foot-brand span { font-size:15px; font-weight:800; color:var(--onD); }
    .v2-foot p { font-size:15px; line-height:1.7; max-width:520px; }
    .v2-foot-copy { margin-top:22px; font-size:13px; color:#5E7B7E; }

    /* animation */
    @keyframes v2up { from{opacity:0; transform:translateY(24px);} to{opacity:1; transform:translateY(0);} }
    .v2-up { opacity:0; animation:v2up .6s cubic-bezier(.16,1,.3,1) forwards; }
    .v2-up.d1{animation-delay:.05s}.v2-up.d2{animation-delay:.14s}.v2-up.d3{animation-delay:.24s}
    .v2-up.d4{animation-delay:.34s}.v2-up.d5{animation-delay:.46s}.v2-up.d6{animation-delay:.58s}

    /* responsive */
    @media (max-width:860px){
      .v2-proof-search { grid-template-columns:1fr; gap:30px; padding:28px; }
      .v2-ps-mock { display:flex; justify-content:center; }
      .v2-proof-grid { grid-template-columns:1fr; }
      .v2-ben-grid { grid-template-columns:1fr 1fr; }
    }
    @media (max-width:640px){
      .v2-container { padding:0 18px; }
      .v2-sec { padding:64px 0; }
      .v2-hero { padding-top:120px; padding-bottom:64px; }
      .v2-h1 { font-size:38px; letter-spacing:-1.2px; }
      .v2-hero-sub { font-size:19px; }
      .v2-tag { font-size:14px; padding:9px 16px; }
      .v2-hero-price { padding:22px 26px; }
      .v2-hp-now .num { font-size:54px; } .v2-hp-won { font-size:26px; }
      .v2-hp-orig { font-size:19px; } .v2-hp-off { font-size:15px; } .v2-hp-vat { font-size:15px; }
      .v2-strip { grid-template-columns:1fr 1fr; gap:10px; }
      .v2-strip-n { font-size:25px; } .v2-strip-l { font-size:15px; }
      .v2-h2 { font-size:27px; letter-spacing:-.6px; }
      .v2-h3 { font-size:21px; }
      .v2-sub { font-size:16px; }
      .v2-ben-grid { grid-template-columns:1fr; }
      .v2-price-card { padding:34px 22px; }
      .v2-pc-now .num { font-size:60px; } .v2-pc-won { font-size:25px; }
      .v2-cmp-row { grid-template-columns:1fr 78px 86px; padding:12px 16px; }
      .v2-final-h { font-size:27px; }
      .v2-nav-name { display:none; }
      .v2-fab-wrap { left:16px; right:16px; bottom:16px; transform:none; animation:v2fabM 3.6s ease-in-out infinite; }
      .v2-fab { width:100%; padding:16px 0; font-size:16px; }
      @keyframes v2fabM { 0%,100%{ transform:translateY(0); } 50%{ transform:translateY(-5px); } }
    }
    @media (prefers-reduced-motion:reduce){ .v2-up { opacity:1; animation:none; } }
    `}</style>
  );
}

Object.assign(window, { VariantA });
