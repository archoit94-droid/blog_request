/* global React */
const { useState: useStateB } = React;

// ──────────────────────────────────────────────────────────────
// VARIANT B — Bold Editorial (큰 타이포 + 풀블리드 컬러 블록)
// 1. 미친 프로모션 → 2. 왜 미쳤나 → 3. 가격 공개 → 4. 프로세스 → 5. FAQ
// ──────────────────────────────────────────────────────────────
function VariantB() {
  return (
    <div style={{ background: '#fff' }}>
      <LandingNav variant="B" />

      {/* 1. HERO — 검정 풀블리드, "미쳤다" 임팩트 */}
      <section style={{
        background: '#0F1115', color: '#fff',
        padding: '100px 0 110px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -160, top: -100,
          width: 520, height: 520, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,224,102,0.18) 0%, transparent 65%)',
        }} />
        <div className="container" style={{ position: 'relative', textAlign: 'center', maxWidth: 920, margin: '0 auto' }}>
          <div style={{
            display: 'inline-block', fontSize: 13, fontWeight: 800,
            background: '#FFE066', color: '#1A1A1A',
            padding: '8px 16px', borderRadius: 100, marginBottom: 32,
            letterSpacing: '0.5px',
          }}>
            🚨 5/1 ~ 5/31 · 30건 한정 · BETA OPEN
          </div>
          <h1 style={{
            fontSize: 96, fontWeight: 900, lineHeight: 1.0,
            letterSpacing: '-3.5px', wordBreak: 'keep-all',
            marginBottom: 32,
          }}>
            저희가<br />
            <span style={{ color: '#FFE066' }}>미쳤습니다.</span>
          </h1>
          <p style={{
            fontSize: 22, lineHeight: 1.6, opacity: 0.85,
            maxWidth: 640, wordBreak: 'keep-all', margin: '0 auto 44px',
          }}>
            5월 한 달, 딱 한 번. 월 17만 명이 보는 고방 공식 블로그에<br />
            내 지점 포스팅을 <strong style={{ color: '#FFE066' }}>67% 할인</strong>된 가격으로 올려드려요.
          </p>
          <a href="#cta" className="btn btn-lg"
             style={{ background: '#FFE066', color: '#1A1A1A', fontWeight: 800 }}>
            지금 신청하기 →
          </a>
        </div>
      </section>

      {/* 2. WHY — 왜 미친건지 (채널 가치 강조) */}
      <section id="why" style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 72, maxWidth: 760 }}>
            <span className="eyebrow">왜 미친 가격인가요</span>
            <h2 className="section-h" style={{ fontSize: 56 }}>
              아무 블로그가 아니에요.<br />
              <span className="accent">시장가 100만 원+</span>짜리 채널입니다.
            </h2>
          </div>

          {/* Connected reasoning chain — 숫자들이 하나의 이야기로 연결됨 */}
          <div style={{
            background: '#fff', borderRadius: 24, padding: '48px 48px',
            border: '1px solid var(--border-input)', marginBottom: 48,
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg-3)', letterSpacing: '0.5px', marginBottom: 28 }}>
              왜 시장가가 100만 원인지, 숫자로 보여드릴게요.
            </div>

            {/* Step 1 */}
            <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'center', paddingBottom: 32 }} className="b-chain-row">
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--fg-3)', letterSpacing: '1px', marginBottom: 8 }}>STEP 1</div>
                <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--primary-400)', letterSpacing: '-2px', lineHeight: 1 }}>17~18<span style={{ fontSize: 28 }}>만</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginTop: 6 }}>월 방문자</div>
              </div>
              <div style={{ borderLeft: '3px solid var(--primary-100)', paddingLeft: 28 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                  매달 17~18만 명, 매일 4,500명 이상이<br />고방 블로그를 봅니다.
                </div>
              </div>
            </div>

            {/* arrow */}
            <div style={{ paddingLeft: 60, color: 'var(--primary-300)', fontSize: 28, marginBottom: 8, lineHeight: 1 }}>↓</div>
            <div style={{ paddingLeft: 60, fontSize: 13, color: 'var(--fg-3)', marginBottom: 24, fontWeight: 600, letterSpacing: '0.3px' }}>
              그게 가능한 이유는?
            </div>

            {/* Step 2 */}
            <div style={{
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'center',
              paddingTop: 32, paddingBottom: 32, borderTop: '1px solid var(--border-divider)',
            }} className="b-chain-row">
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--fg-3)', letterSpacing: '1px', marginBottom: 8 }}>STEP 2</div>
                <div style={{ fontSize: 56, fontWeight: 900, color: 'var(--primary-400)', letterSpacing: '-2px', lineHeight: 1 }}>최적화 <span style={{ fontSize: 38 }}>2+</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginTop: 6 }}>네이버 블로그 등급</div>
              </div>
              <div style={{ borderLeft: '3px solid var(--primary-100)', paddingLeft: 28 }}>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--fg-1)', lineHeight: 1.5, wordBreak: 'keep-all', marginBottom: 8 }}>
                  국내 블로그 <strong style={{ color: 'var(--primary-400)' }}>상위 2.8%</strong>인 최적화 2+ 등급.
                </div>
                <div style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.6, wordBreak: 'keep-all' }}>
                  검색 노출 알고리즘에서 가장 유리한 등급이라, 글을 올리면 자연스럽게 상위에 노출돼요.
                </div>
              </div>
            </div>

            {/* arrow */}
            <div style={{ paddingLeft: 60, color: 'var(--primary-300)', fontSize: 28, marginBottom: 8, lineHeight: 1 }}>↓</div>
            <div style={{ paddingLeft: 60, fontSize: 13, color: 'var(--fg-3)', marginBottom: 24, fontWeight: 600, letterSpacing: '0.3px' }}>
              게다가 1인주거 검색에 특화된 채널이고,
            </div>

            {/* Step 3 — punchline */}
            <div style={{
              display: 'grid', gridTemplateColumns: '180px 1fr', gap: 32, alignItems: 'center',
              paddingTop: 32, borderTop: '1px solid var(--border-divider)',
            }} className="b-chain-row">
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#D14000', letterSpacing: '1px', marginBottom: 8 }}>그래서 결론</div>
                <div style={{ fontSize: 56, fontWeight: 900, color: '#D14000', letterSpacing: '-2px', lineHeight: 1 }}>100<span style={{ fontSize: 28 }}>만 원+</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg-2)', marginTop: 6 }}>이 채널의 시장가</div>
              </div>
              <div style={{
                background: '#FFF1E5', padding: '20px 24px', borderRadius: 12,
                borderLeft: '3px solid #D14000',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--fg-1)', lineHeight: 1.5, wordBreak: 'keep-all' }}>
                  이 정도 채널에 마케팅 한 번 하려면<br />
                  보통 <span style={{ color: '#D14000' }}>최소 100만 원</span>이 듭니다.
                </div>
              </div>
            </div>
          </div>

          {/* market-price comparison — VERTICAL BAR CHART, dramatic */}
          <div style={{
            background: '#0F1115', color: '#fff',
            borderRadius: 24, padding: '56px 48px 48px',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#FFE066', letterSpacing: '0.5px', marginBottom: 18 }}>
              가격 비교
            </div>
            <h3 style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.3, letterSpacing: '-0.8px', marginBottom: 56, wordBreak: 'keep-all' }}>
              한 눈에 봐도<br />
              <span style={{ color: '#FFE066' }}>10배 차이</span>가 납니다.
            </h3>

            {/* Vertical bars */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24,
              alignItems: 'end', minHeight: 480, paddingBottom: 12,
            }} className="b-vbar-grid">
              {[
                {
                  label: '숨고 평균 견적',
                  sub: '일반 블로거 채널',
                  price: '30만 원~',
                  height: 144,  // 30만 / 100만 * 480 = 144
                  color: 'rgba(255,255,255,0.18)',
                  textColor: 'rgba(255,255,255,0.65)',
                  priceColor: '#fff',
                },
                {
                  label: '시장가',
                  sub: '최적화 2+ · 월 17만+ 채널',
                  price: '100만 원+',
                  height: 480,  // tallest, full height
                  color: '#fff',
                  textColor: '#fff',
                  priceColor: '#fff',
                  big: true,
                },
                {
                  label: '고방 Beta 이벤트가',
                  sub: '5/1~5/31 · 30건 한정',
                  price: '10만 원',
                  height: 48,  // 10만 / 100만 * 480 = 48 — very short, dramatic
                  color: '#FFE066',
                  textColor: '#FFE066',
                  priceColor: '#FFE066',
                  ours: true,
                },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  {/* top label (only for ours — call it out) */}
                  {b.ours && (
                    <div style={{
                      background: '#FFE066', color: '#1A1A1A',
                      fontSize: 12, fontWeight: 800, letterSpacing: '0.3px',
                      padding: '6px 14px', borderRadius: 100, marginBottom: 12,
                      whiteSpace: 'nowrap',
                    }}>
                      ⚡ 이걸 이 가격에
                    </div>
                  )}
                  {/* price label above bar */}
                  <div style={{
                    fontSize: b.big ? 32 : (b.ours ? 36 : 22),
                    fontWeight: 900, color: b.priceColor,
                    letterSpacing: '-0.8px', lineHeight: 1, marginBottom: 14,
                    textShadow: b.ours ? '0 0 24px rgba(255,224,102,0.4)' : 'none',
                  }}>
                    {b.price}
                  </div>
                  {/* the bar itself */}
                  <div style={{
                    width: '100%', maxWidth: 180,
                    height: b.height, background: b.color,
                    borderRadius: '8px 8px 0 0',
                    boxShadow: b.ours ? '0 0 32px rgba(255,224,102,0.35)' : 'none',
                    display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
                    paddingTop: b.big ? 16 : 0, position: 'relative',
                  }}>
                    {b.big && (
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#0F1115', letterSpacing: '0.5px' }}>
                        시장 평균
                      </div>
                    )}
                  </div>
                  {/* x-axis label */}
                  <div style={{
                    paddingTop: 16, paddingBottom: 4, textAlign: 'center',
                    borderTop: '2px solid rgba(255,255,255,0.15)',
                    width: '100%', marginTop: 0,
                  }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: b.textColor, marginBottom: 4, wordBreak: 'keep-all' }}>{b.label}</div>
                    <div style={{ fontSize: 11, opacity: 0.55, lineHeight: 1.4, wordBreak: 'keep-all' }}>{b.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* punchline below chart */}
            <div style={{
              marginTop: 36, padding: '20px 24px',
              background: '#FFE066', color: '#1A1A1A',
              borderRadius: 14, textAlign: 'center',
              fontSize: 18, fontWeight: 800, letterSpacing: '-0.3px',
              wordBreak: 'keep-all',
            }}>
              💸 시장가 100만 원 채널을, 1/10 가격에 테스트하는 거예요.
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRICE REVEAL — 풀블리드 컬러로 임팩트 */}
      <section id="price" style={{
        background: 'var(--primary-400)', color: '#fff',
        padding: '120px 0', position: 'relative', overflow: 'hidden',
      }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative' }}>
          <div style={{
            display: 'inline-block', fontSize: 13, fontWeight: 800,
            background: 'rgba(255,255,255,0.18)', padding: '7px 16px',
            borderRadius: 100, marginBottom: 28, letterSpacing: '0.3px',
          }}>5월 한 달, 딱 한 번</div>

          <h2 style={{
            fontSize: 56, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1.5px',
            wordBreak: 'keep-all', marginBottom: 56,
          }}>
            그걸 저희는<br />
            <span style={{ color: '#FFE066' }}>이 가격에</span> 드립니다.
          </h2>

          {/* big price */}
          <div style={{
            display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
            background: 'rgba(0,0,0,0.18)', borderRadius: 24,
            padding: '40px 64px', marginBottom: 28,
          }}>
            <div style={{
              fontSize: 16, opacity: 0.75, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
            }}>
              정가
              <span style={{ fontSize: 24, fontWeight: 700, textDecoration: 'line-through' }}>300,000원</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#FFE066', marginBottom: 10, letterSpacing: '0.5px' }}>
              ⚡ Beta 이벤트가 (67% OFF)
            </div>
            <div style={{
              fontSize: 120, fontWeight: 900, color: '#FFE066',
              letterSpacing: '-4px', lineHeight: 0.95,
            }}>
              100,000<span style={{ fontSize: 48 }}>원</span>
            </div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 12 }}>VAT 별도 · 1건 기준</div>
          </div>

          <div style={{
            background: '#FFE066', color: '#1A1A1A',
            display: 'inline-block',
            padding: '14px 24px', borderRadius: 100,
            fontSize: 16, fontWeight: 800, letterSpacing: '-0.2px',
            wordBreak: 'keep-all',
          }}>
            💸 시장가 100만 원 채널을 1/10 가격에
          </div>

          {/* what's included */}
          <div style={{
            marginTop: 56, padding: 32, background: 'rgba(255,255,255,0.08)',
            borderRadius: 20, maxWidth: 720, margin: '56px auto 0',
            textAlign: 'left',
          }}>
            <div style={{ fontSize: 13, fontWeight: 800, opacity: 0.9, letterSpacing: '0.5px', marginBottom: 16 }}>
              포함 사항
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { t: '블로그 포스팅 1건', d: '고방 공식 블로그 발행' },
                { t: '템플릿 직접 선택', d: 'A타입 / B타입' },
                { t: '키워드 직접 제출', d: '1~3개 키워드' },
                { t: '강조 포인트 반영', d: '원하는 내용 자유 추가' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                  <span style={{ color: '#FFE066', fontSize: 18, lineHeight: 1.4 }}>✓</span>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 2 }}>{f.t}</div>
                    <div style={{ fontSize: 13, opacity: 0.85 }}>{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROCESS */}
      <section id="process" style={{ padding: '120px 0' }}>
        <div className="container">
          <div style={{ marginBottom: 56, textAlign: 'center' }}>
            <span className="eyebrow">진행 방식</span>
            <h2 className="section-h" style={{ fontSize: 44 }}>신청부터 발행까지<span className="accent">.</span></h2>
          </div>

          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4,
            background: 'var(--border-divider)', border: '1px solid var(--border-divider)',
            borderRadius: 20, overflow: 'hidden',
          }} className="b-process-grid">
            {[
              { n: '01', t: '구매 / 신청', d: '키워드·강조 내용 입력' },
              { n: '02', t: '대상자 선정', d: '내부 검토 → 알림톡' },
              { n: '03', t: '결제', d: '10만 원 (VAT 별도)' },
              { n: '04', t: '작성 · 발행', d: '1~2주 내 발행' },
              { n: '05', t: '결과 안내', d: '카카오 알림톡' },
            ].map((s, i) => (
              <div key={i} style={{ background: '#fff', padding: '32px 24px' }}>
                <div style={{
                  fontSize: 13, fontWeight: 800, color: 'var(--primary-400)',
                  letterSpacing: '0.5px', marginBottom: 16,
                }}>STEP {s.n}</div>
                <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: 'var(--fg-1)' }}>{s.t}</h3>
                <p style={{ fontSize: 13, color: 'var(--fg-3)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FAQ */}
      <section id="faq" style={{ background: 'var(--bg-app)', padding: '120px 0' }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <h2 className="section-h" style={{ fontSize: 44, marginBottom: 50 }}>
            자주 묻는 질문<span className="accent">.</span>
          </h2>
          <div style={{ background: '#fff', borderRadius: 16, padding: '8px 28px' }}>
            <FaqItem defaultOpen
              q="이벤트 가격이 끝나면 얼마인가요?"
              a="<strong>5/31 자정까지</strong> 10만 원 (VAT 별도) 이며, 6/1부터 정가 30만 원으로 돌아갑니다. 5월 안에도 30건 마감 시 신청 종료." />
            <FaqItem
              q="블로그 상품만 단독 구매 가능한가요?"
              a="네, Beta 기간 중 <strong>단독 구매 가능</strong>. 기존엔 고방 광고상품 6개월 이용 시에만 가능했어요." />
            <FaqItem
              q="키워드와 템플릿은 누가 정하나요?"
              a="<strong>사장님이 직접 정하세요.</strong> A/B 템플릿 선택, 키워드 1~3개 입력, 강조 포인트 자유 입력 가능합니다." />
            <FaqItem
              q="수정(A/S)은 가능한가요?"
              a="발행 전 1회 보장 (※ 정책 확정 전 — 변경될 수 있어요)." />
            <FaqItem
              q="정말 30건만 받나요?"
              a="네, Beta 단계라 품질 보장을 위해 <strong>5월 한 달 30건만 선착순</strong>으로 받습니다." />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" style={{ background: '#0F1115', color: '#fff', padding: '110px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#FFE066', marginBottom: 16 }}>
            5/1 ~ 5/31 · 30건 한정
          </div>
          <h2 style={{
            fontSize: 56, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-1.5px',
            wordBreak: 'keep-all', marginBottom: 40,
          }}>
            10만 원으로<br />검증된 채널 테스트.
          </h2>
          <a href="../ui_kits/blog-request/index.html" target="_blank"
             className="btn btn-lg"
             style={{ background: '#FFE066', color: '#1A1A1A', padding: '20px 44px', fontSize: 18, fontWeight: 800 }}>
            지금 신청하기 →
          </a>
        </div>
      </section>

      <LandingFooter />
      <style>{`
        @media (max-width: 860px) {
          .b-process-grid { grid-template-columns: 1fr 1fr !important; }
          .b-chain-row { grid-template-columns: 1fr !important; gap: 16px !important; }
          .b-vbar-grid { gap: 12px !important; }
        }
        @media (max-width: 540px) {
          .b-vbar-grid div[style*="font-size: 36"] { font-size: 24px !important; }
          .b-vbar-grid div[style*="font-size: 32"] { font-size: 22px !important; }
        }
        @media (max-width: 640px) {
          section h1 { font-size: 56px !important; }
          #why h2 { font-size: 32px !important; }
          #price h2 { font-size: 32px !important; }
          #price div[style*="font-size: 120"] { font-size: 72px !important; }
          #price div[style*="padding: 40px 64px"] { padding: 32px 28px !important; }
          #process h2, #faq h2 { font-size: 28px !important; }
          #cta h2 { font-size: 32px !important; }
          .b-process-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

window.VariantB = VariantB;
