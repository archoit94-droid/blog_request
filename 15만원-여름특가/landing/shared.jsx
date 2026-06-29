/* global React */
const { useState } = React;

// ─────────────────────────────────────────────────────────────
// Nav — shared across all variations
// ─────────────────────────────────────────────────────────────
function LandingNav({ variant = 'A' }) {
  return (
    <nav className="nav">
      <div className="container nav-inner">
        <a href="#" className="nav-logo">
          <img src="assets/U_ALF.png" alt="고방" style={{ height: 32 }} />
          <span>블로그 마케팅 이벤트</span>
          <span style={{
            fontSize: 11, fontWeight: 800, color: 'var(--primary-400)',
            background: 'var(--primary-100)',
            padding: '2px 8px', borderRadius: 6,
            letterSpacing: '0.3px', marginLeft: 2,
          }}>beta</span>
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {[
            { label: '채널 소개', href: '#why' },
            { label: '가격 확인', href: '#price' },
            { label: '진행 방식', href: '#process' },
            { label: 'FAQ',     href: '#faq' },
          ].map((item, i) => (
            <React.Fragment key={i}>
              {i > 0 && <span style={{ color: 'var(--border-input)', fontSize: 16, userSelect: 'none' }}>|</span>}
              <a href={item.href} className="nav-link-d" style={{
                fontSize: 15, fontWeight: 500, color: 'var(--fg-3)',
                padding: '4px 2px',
              }}>{item.label}</a>
            </React.Fragment>
          ))}
          <a href="https://cutt.ly/ltLb9jgX" target="_blank" className="nav-cta" style={{ marginLeft: 6 }}>신청하기</a>
        </div>
      </div>
      <style>{`@media(max-width:640px){.nav-link-d{display:none}}`}</style>
    </nav>
  );
}

// ─────────────────────────────────────────────────────────────
// SearchMockup — Naver-blog search-result chrome (the "before" picture)
// ─────────────────────────────────────────────────────────────
function NaverSearchMockup({ rank = 1 }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid var(--border-input)',
      borderRadius: 14, padding: '18px 18px 16px', maxWidth: 360,
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#03C75A', letterSpacing: '-1px' }}>NAVER</span>
        <div style={{
          flex: 1, height: 32, background: 'var(--bg-app)', borderRadius: 6,
          display: 'flex', alignItems: 'center', padding: '0 10px',
          fontSize: 12, color: 'var(--fg-1)', fontWeight: 600,
        }}>마포구고시원</div>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginBottom: 8, fontWeight: 600 }}>VIEW</div>
      {[
        { ours: rank === 1, title: '합정역 도보 5분 · 신축 고시원 후기', date: '2일 전' },
        { ours: rank === 2, title: '마포구 고시원 추천 BEST 5', date: '5일 전' },
        { ours: rank === 3, title: '월세 40만원대 1인실 고시원', date: '1주 전' },
      ].map((r, i) => (
        <div key={i} style={{
          padding: '10px 0', borderBottom: i < 2 ? '1px solid var(--border-divider)' : 'none',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          {r.ours && <span style={{
            fontSize: 9, fontWeight: 800, color: '#fff',
            background: 'var(--primary-400)', padding: '2px 6px', borderRadius: 4,
            flexShrink: 0,
          }}>OURS</span>}
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: r.ours ? 'var(--primary-400)' : 'var(--fg-1)', lineHeight: 1.3 }}>{r.title}</div>
            <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 3 }}>blog.naver.com · {r.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ — accordion item
// ─────────────────────────────────────────────────────────────
function FaqItem({ q, a, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div style={{
      borderBottom: '1px solid var(--border-input)',
      padding: '20px 0',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        textAlign: 'left', fontSize: 20, fontWeight: 600, color: 'var(--fg-1)',
        padding: 0,
      }}>
        <span style={{ flex: 1, paddingRight: 16, wordBreak: 'keep-all', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <span style={{
            flexShrink: 0,
            fontSize: 13, fontWeight: 800, color: 'var(--primary-400)',
            background: 'var(--primary-100)',
            padding: '3px 9px', borderRadius: 6,
            marginTop: 2, letterSpacing: '0.5px',
          }}>Q</span>
          <span>{q}</span>
        </span>
        <span style={{
          width: 24, height: 24, flexShrink: 0,
          color: 'var(--primary-400)', fontSize: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.18s',
        }}>＋</span>
      </button>
      {open && (
        <div style={{
          marginTop: 14, fontSize: 17, color: 'var(--fg-2)',
          lineHeight: 1.7, wordBreak: 'keep-all',
        }} dangerouslySetInnerHTML={{ __html: a }} />
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Footer
// ─────────────────────────────────────────────────────────────
function LandingFooter() {
  return (
    <footer style={{
      background: 'var(--bg-app)', padding: '48px 0 36px',
      borderTop: '1px solid var(--border-input)',
    }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <img src="assets/U_ALF.png" alt="고방" style={{ height: 28 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-1)' }}>고방 · neoflatMKT</span>
        </div>
        <p style={{ fontSize: 16, color: 'var(--fg-3)', lineHeight: 1.7, maxWidth: 520 }}>
          고방 공식 블로그 Beta 오픈 이벤트 페이지입니다.<br />
          gobang.kr · u-ceo.kr
        </p>
        <div style={{ marginTop: 24, fontSize: 14, color: 'var(--fg-4)' }}>
          © 2026 neoflatMKT. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

Object.assign(window, { LandingNav, NaverSearchMockup, FaqItem, LandingFooter });
