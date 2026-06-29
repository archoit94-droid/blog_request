/* global React */
const { useState: useStateC } = React;

// ──────────────────────────────────────────────────────────────
// VARIANT C — Friendly & Conversational (부드러운 톤)
// 1. 미친 프로모션 → 2. 왜 미쳤나 → 3. 가격 공개 → 4. 프로세스 → 5. FAQ
// ──────────────────────────────────────────────────────────────
function VariantC() {
  return (
    <div style={{ background: '#FAFBFC' }}>
      <LandingNav variant="C" />

      {/* 1. HERO — 부드러운 그라디언트, 친근한 카피 */}
      <section style={{
        padding: '90px 0 100px',
        background: 'radial-gradient(circle at 30% 20%, #FFF1E5 0%, transparent 55%), radial-gradient(circle at 75% 75%, #EEF3FF 0%, transparent 55%), #FAFBFC',
        position: 'relative', overflow: 'hidden',
      }}>
        <div className="container center-stack" style={{ maxWidth: 760 }}>
          <span className="eyebrow" style={{ background: '#FFE9D9', color: '#D14000', fontSize: 14 }}>
            🚨 5/1 ~ 5/31 · 30건 한정 · Beta 오픈 이벤트
          </span>
          <h1 style={{
            fontSize: 60, fontWeight: 800, lineHeight: 1.15,
            letterSpacing: '-1.5px', wordBreak: 'keep-all',
            color: 'var(--fg-1)', marginBottom: 24, marginTop: 8,
          }}>
            저희가 <span style={{
              color: 'var(--primary-400)',
              background: 'linear-gradient(180deg, transparent 65%, var(--primary-100) 65%)',
              padding: '0 6px',
            }}>미쳤어요.</span><br />
            5월 딱 한 번이에요.
          </h1>
          <p style={{
            fontSize: 19, color: 'var(--fg-3)', lineHeight: 1.7,
            wordBreak: 'keep-all', marginBottom: 36, maxWidth: 600,
          }}>
            월 17만 명이 보는 고방 공식 블로그에<br />
            <strong style={{ color: 'var(--fg-1)' }}>내 지점 포스팅을 67% 할인된 가격</strong>으로 올려드려요.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#cta" className="btn btn-primary btn-lg">3분 만에 신청하기 →</a>
            <a href="#why" className="btn btn-ghost btn-lg">왜 미쳤는지 보기</a>
          </div>
        </div>
      </section>

      {/* 2. WHY — 채널 가치 (이모지 카드) */}
      <section id="why" style={{ background: '#fff', padding: '90px 0' }}>
        <div className="container">
          <div className="center-stack" style={{ marginBottom: 50 }}>
            <span className="eyebrow">왜 미친 가격인가요</span>
            <h2 className="section-h">아무 블로그가 아니에요. <span className="accent">시장가 100만 원+</span>이에요.</h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16,
            marginBottom: 32,
          }}>
            {[
              { e: '👥', n: '17~18만', l: '월 방문자', sub: '일 4,500명+' },
              { e: '⭐', n: '최적화 2+', l: '네이버 등급', sub: '상위 2.8%' },
              { e: '🏠', n: '1인주거 특화', l: '카테고리', sub: '고시원·셰어하우스' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-info)', borderRadius: 18, padding: '28px 24px',
                border: '1.5px solid var(--primary-300)', textAlign: 'center',
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>{s.e}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: 'var(--primary-400)', letterSpacing: '-0.5px', lineHeight: 1.1, marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', marginBottom: 4 }}>{s.l}</div>
                <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>{s.sub}</div>
              </div>
            ))}
          </div>

          <div style={{
            background: '#FFF8E5', borderRadius: 16, padding: '24px 28px',
            border: '1.5px solid #FFE066', display: 'flex', alignItems: 'flex-start', gap: 14,
          }}>
            <div style={{ fontSize: 24, flexShrink: 0 }}>💡</div>
            <div style={{ fontSize: 15, color: 'var(--fg-1)', lineHeight: 1.7, wordBreak: 'keep-all' }}>
              <strong>참고로요</strong> — 숨고 "블로그 마케팅" 평균 견적이 <strong>30만 원</strong>이고,
              저희 같은 최적화 2+ 채널 시장가는 <strong>100만 원 이상</strong>이에요. 그게 정상이에요.
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRICE REVEAL — 친근한 가격 공개 */}
      <section id="price" style={{ padding: '90px 0' }}>
        <div className="container center-stack" style={{ maxWidth: 720 }}>
          <span className="eyebrow">5월 한 달, 딱 한 번</span>
          <h2 className="section-h" style={{ marginBottom: 40 }}>
            그걸 저희는 <span className="accent">10만 원</span>에 드려요.
          </h2>

          <div style={{
            width: '100%',
            background: '#fff', border: '2px solid var(--primary-400)',
            borderRadius: 28, padding: '48px 40px',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 180, height: 180, borderRadius: '50%',
              background: 'var(--primary-100)',
            }} />
            <div style={{
              position: 'absolute', top: 24, right: 24,
              background: '#D14000', color: '#fff',
              fontSize: 12, fontWeight: 800, letterSpacing: '0.5px',
              padding: '6px 14px', borderRadius: 100, zIndex: 1,
            }}>67% OFF</div>

            <div style={{ position: 'relative', textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: 'var(--fg-3)', fontWeight: 600, marginBottom: 8 }}>
                원래 가격은
              </div>
              <div style={{ fontSize: 24, fontWeight: 700, textDecoration: 'line-through', color: 'var(--fg-3)', marginBottom: 24 }}>
                300,000원
              </div>
              <div style={{ fontSize: 28, marginBottom: 8 }}>👇</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary-400)', letterSpacing: '0.5px', marginBottom: 12 }}>
                Beta 이벤트가
              </div>
              <div style={{
                fontSize: 80, fontWeight: 900, color: 'var(--primary-400)',
                letterSpacing: '-2.5px', lineHeight: 1,
              }}>
                100,000<span style={{ fontSize: 32 }}>원</span>
              </div>
              <div style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 10 }}>VAT 별도 · 1건 기준</div>
            </div>
          </div>

          <div style={{
            marginTop: 24, padding: '16px 24px',
            background: 'var(--bg-info)', borderRadius: 100,
            border: '1.5px solid var(--primary-300)',
            fontSize: 15, color: 'var(--fg-1)', fontWeight: 700,
            wordBreak: 'keep-all', textAlign: 'center',
          }}>
            🎯 시장가 100만 원 채널을 <span style={{ color: 'var(--primary-400)' }}>1/10 가격</span>으로 테스트
          </div>

          {/* what's included */}
          <div style={{
            width: '100%', marginTop: 36,
            background: '#fff', borderRadius: 18, padding: '28px 30px',
            border: '1px solid var(--border-input)',
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-3)', letterSpacing: '0.5px', marginBottom: 16 }}>
              포함 사항
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14 }}>
              {[
                { e: '📝', t: '블로그 포스팅 1건', d: '공식 블로그 발행' },
                { e: '🎨', t: '템플릿 선택', d: 'A타입 / B타입' },
                { e: '🎯', t: '키워드 제출', d: '1~3개 직접 입력' },
                { e: '✨', t: '강조 포인트', d: '원하는 내용 추가' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 22, flexShrink: 0 }}>{f.e}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', marginBottom: 2 }}>{f.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--fg-3)' }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROCESS */}
      <section id="process" style={{ background: '#fff', padding: '90px 0' }}>
        <div className="container">
          <div className="center-stack" style={{ marginBottom: 56 }}>
            <span className="eyebrow">진행 방식</span>
            <h2 className="section-h">신청부터 발행까지, <span className="accent">간단해요</span></h2>
          </div>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16,
          }}>
            {[
              { n: 1, t: '구매 / 신청', d: '키워드·강조 내용 입력', e: '📝' },
              { n: 2, t: '대상자 선정', d: '내부 검토 → 알림톡', e: '✅' },
              { n: 3, t: '결제', d: '10만 원 (VAT 별도)', e: '💳' },
              { n: 4, t: '작성 · 발행', d: '1~2주 내 발행', e: '✏️' },
              { n: 5, t: '결과 안내', d: '카카오 알림톡', e: '🔔' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-info)', borderRadius: 18, padding: '32px 18px 24px',
                border: '1.5px solid var(--primary-300)', textAlign: 'center',
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--primary-400)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800,
                }}>{s.n}</div>
                <div style={{ fontSize: 30, marginTop: 6, marginBottom: 10 }}>{s.e}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--fg-1)', marginBottom: 4, wordBreak: 'keep-all' }}>{s.t}</h3>
                <p style={{ fontSize: 12, color: 'var(--fg-3)', wordBreak: 'keep-all' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" style={{ padding: '90px 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>
          <div className="center-stack" style={{ marginBottom: 50 }}>
            <span className="eyebrow">궁금한 점이 있다면</span>
            <h2 className="section-h">자주 묻는 질문</h2>
          </div>
          <div style={{
            background: '#fff', borderRadius: 20,
            padding: '8px 28px', border: '1.5px solid var(--primary-300)',
          }}>
            <FaqItem defaultOpen
              q="이벤트 가격이 끝나면 얼마인가요?"
              a="<strong>5/31 자정까지</strong> 10만 원 (VAT 별도) 이며, 6/1부터 정가 30만 원으로 돌아가요. 30건 마감 시에도 신청 종료." />
            <FaqItem
              q="단독 구매 가능한가요?"
              a="네, Beta 기간 중 <strong>블로그 상품만 단독 구매 가능</strong>해요." />
            <FaqItem
              q="키워드와 템플릿은 누가 정하나요?"
              a="<strong>사장님이 직접 정하세요.</strong> A/B 템플릿 선택, 키워드 1~3개, 강조 포인트 자유 입력 가능합니다." />
            <FaqItem
              q="수정(A/S)은 가능한가요?"
              a="발행 전 1회 보장 (※ 정책 확정 전 — 변경될 수 있어요)." />
            <FaqItem
              q="정말 30건만 받나요?"
              a="네, Beta 품질 보장을 위해 <strong>5월 30건만 선착순</strong>으로 받아요." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ padding: '90px 0' }}>
        <div className="container">
          <div style={{
            background: '#fff', border: '2px solid var(--primary-400)',
            borderRadius: 28, padding: '60px 48px', textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200, borderRadius: '50%',
              background: 'var(--primary-100)',
            }} />
            <div style={{
              position: 'absolute', bottom: -60, left: -60,
              width: 240, height: 240, borderRadius: '50%',
              background: '#FFE9D9',
            }} />
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 44, marginBottom: 14 }}>🎉</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#D14000', letterSpacing: '0.3px', marginBottom: 14 }}>
                5/1 ~ 5/31 · 30건 한정
              </div>
              <h2 style={{
                fontSize: 36, fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.8px',
                wordBreak: 'keep-all', marginBottom: 32, color: 'var(--fg-1)',
              }}>
                지금 신청하면<br />
                <span style={{ color: 'var(--primary-400)' }}>10만 원</span>으로 검증된 채널 테스트.
              </h2>
              <a href="../ui_kits/blog-request/index.html" target="_blank" className="btn btn-primary btn-lg">
                신청서 작성하러 가기 →
              </a>
            </div>
          </div>
        </div>
      </section>

      <LandingFooter />
      <style>{`
        @media (max-width: 640px) {
          section h1 { font-size: 38px !important; }
          #price h2 { font-size: 26px !important; }
          #price div[style*="font-size: 80"] { font-size: 56px !important; }
          #cta div[style*="border-radius: 28"] { padding: 48px 24px !important; }
          #cta h2 { font-size: 26px !important; }
        }
      `}</style>
    </div>
  );
}

window.VariantC = VariantC;
