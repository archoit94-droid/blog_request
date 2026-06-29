/* global React, GobangAPI */
const { useState, useEffect, useRef, useMemo } = React;

function LoadingScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '40px 20px', textAlign: 'center',
    }}>
      <IconCircle bg="var(--bg-app)" fontSize={20}>⏳</IconCircle>
      <h2 className="t-h2">불러오는 중...</h2>
    </div>
  );
}

function OffScreen({ reason }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '40px 20px', textAlign: 'center',
    }}>
      <IconCircle bg="var(--bg-app)">🔒</IconCircle>
      <h2 className="t-h2" style={{ marginBottom: 8 }}>신청을 받지 않고 있어요</h2>
      <p style={{ fontSize: 14, color: 'var(--fg-3)', lineHeight: 1.6 }}>{reason}</p>
    </div>
  );
}

function SuccessScreen() {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '100vh', padding: '40px 20px', textAlign: 'center',
    }}>
      <IconCircle bg="var(--primary-100)" size={64} fontSize={28}>✅</IconCircle>
      <h2 className="t-h1" style={{ marginBottom: 10 }}>신청이 완료됐어요</h2>
      <p style={{ fontSize: 15, color: 'var(--fg-3)', lineHeight: 1.7 }}>
        작업이 완료되면 입력하신 번호로<br />카카오 알림톡이 발송됩니다.
      </p>
    </div>
  );
}

function formatPhone(value) {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return digits.slice(0, 3) + '-' + digits.slice(3);
  return digits.slice(0, 3) + '-' + digits.slice(3, 7) + '-' + digits.slice(7, 11);
}

function FormScreen({ status, onSubmit }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [phoneState, setPhoneState] = useState('');
  const [phoneFb, setPhoneFb] = useState(null);

  const [placeUrl, setPlaceUrl] = useState('');
  const [urlState, setUrlState] = useState('');
  const [urlFb, setUrlFb] = useState(null);
  const [urlValid, setUrlValid] = useState(false);
  const [ogLoading, setOgLoading] = useState(false);
  const [ogInfo, setOgInfo] = useState({ ogTitle: '', ogDesc: '', deposit: '', monthly: '', walking: '' });

  const [kw, setKw] = useState({ kw1: '', kw2: '', kw3: '' });
  const [kwState, setKwState] = useState({ kw1: '', kw2: '', kw3: '' });
  const [kwFb, setKwFb] = useState({ kw1: null, kw2: null, kw3: null });

  const [template, setTemplate] = useState('A');
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpType, setHelpType] = useState('A');
  const [desc, setDesc] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);

  // Phone
  function onPhoneChange(e) {
    const v = formatPhone(e.target.value);
    setPhone(v);
    if (!v) { setPhoneState(''); setPhoneFb(null); return; }
    if (/^010-\d{4}-\d{4}$/.test(v)) { setPhoneState('valid'); setPhoneFb(null); }
    else { setPhoneState('invalid'); setPhoneFb({ kind: 'error', msg: '010-0000-0000 형식으로 입력해 주세요' }); }
  }

  // URL
  const urlTimer = useRef();
  function onUrlChange(e) {
    const v = e.target.value.trim();
    setPlaceUrl(v);
    setUrlValid(false);
    clearTimeout(urlTimer.current);
    if (!v) { setUrlState(''); setUrlFb(null); setOgLoading(false); return; }
    if (!/^https:\/\/gobang\.kr\/place\/\d+$/.test(v)) {
      setUrlState('invalid');
      setUrlFb({ kind: 'error', msg: 'https://gobang.kr/place/숫자 형식으로 입력해 주세요' });
      return;
    }
    setUrlState('');
    setUrlFb({ kind: 'checking', msg: '확인 중...' });
    setOgLoading(true);
    GobangAPI.fetchPlaceInfo(v).then((info) => {
      setOgInfo(info);
      setOgLoading(false);
    });
    urlTimer.current = setTimeout(() => {
      GobangAPI.checkPlaceUrl(v).then((r) => {
        if (r.available) {
          setUrlState('valid'); setUrlValid(true);
          setUrlFb({ kind: 'ok', msg: '신청 가능한 지점이에요' });
        } else {
          setUrlState('invalid'); setUrlValid(false);
          setUrlFb({ kind: 'error', msg: '이미 신청된 지점이에요. 다른 지점을 선택해 주세요.' });
        }
      });
    }, 600);
  }

  // Keyword check (debounced per-field)
  const kwTimers = useRef({});
  function onKwChange(id, v) {
    setKw(prev => ({ ...prev, [id]: v }));
    setKwState(prev => ({ ...prev, [id]: '' }));
    clearTimeout(kwTimers.current[id]);
    if (!v.trim()) { setKwFb(prev => ({ ...prev, [id]: null })); return; }
    setKwState(prev => ({ ...prev, [id]: 'active' }));
    setKwFb(prev => ({ ...prev, [id]: { kind: 'checking', msg: '확인 중...' } }));
    kwTimers.current[id] = setTimeout(() => {
      GobangAPI.checkKeyword(v.trim()).then((r) => {
        if (r.available) {
          setKwState(prev => ({ ...prev, [id]: 'valid' }));
          setKwFb(prev => ({ ...prev, [id]: { kind: 'ok', msg: '사용 가능한 키워드예요' } }));
        } else {
          setKwState(prev => ({ ...prev, [id]: 'invalid' }));
          setKwFb(prev => ({ ...prev, [id]: { kind: 'error', msg: r.remainingDays + '일 뒤 사용 가능해요. 다른 키워드를 선택해 주세요.' } }));
        }
      });
    }, 500);
  }

  const canSubmit = useMemo(() => (
    name.trim().length >= 2 &&
    /^010-\d{4}-\d{4}$/.test(phone) &&
    urlValid &&
    kw.kw1.trim().length > 0 && kwState.kw1 === 'valid' &&
    (kw.kw2.trim().length === 0 || kwState.kw2 === 'valid') &&
    (kw.kw3.trim().length === 0 || kwState.kw3 === 'valid') &&
    desc.trim().length > 0 && agreed
  ), [name, phone, urlValid, kw, kwState, desc, agreed]);

  function handleSubmit(e) {
    e.preventDefault();
    setConfirmOpen(true);
  }

  function confirmSubmit() {
    setConfirmOpen(false);
    GobangAPI.submitForm({ name, phone, placeUrl, ...kw, desc, template, ...ogInfo })
      .then((r) => { if (r.success) onSubmit(); });
  }

  return (
    <div data-screen-label="01 Form">
      <Header title="블로그 작성 신청서" subtitle="키워드와 지점 정보를 입력해 주세요" />
      {status && <StatusBanner startDate={status.startDate} endDate={status.endDate} remaining={status.maxCount - status.currentCount} />}

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 0 90px' }}>
        <Section style={{ marginTop: 8 }}>
          <NoticeCard items={[
            "사진은 고방에 등록된 지점 사진만 사용됩니다. 사진 추가를 원하실 경우 <a href='https://u-ceo.kr/login' target='_blank' style='color:var(--primary-400);text-decoration:underline'>u-ceo.kr/login</a> 에서 로그인 후 지점 사진을 먼저 추가해 주세요.",
            "작업은 신청 후 <strong>1~2주</strong> 소요됩니다.",
            "신청 완료 후 대상자로 선정되면 <strong>별도 알림문자</strong>가 발송됩니다.",
          ]} />
        </Section>

        <form onSubmit={handleSubmit} noValidate>
          <Section title="신청자 정보">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Field label="이름">
                <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="홍길동" />
              </Field>
              <Field label="전화번호">
                <TextInput value={phone} onChange={onPhoneChange} state={phoneState} placeholder="010-0000-0000" type="tel" maxLength={13} />
                <Feedback kind={phoneFb?.kind}>{phoneFb?.msg}</Feedback>
              </Field>
            </div>
          </Section>

          <Section title="지점 정보">
            <Field label="지점 URL" helper="동일한 지점 URL로는 신청 기간 내 1회만 신청 가능합니다.">
              <TextInput value={placeUrl} onChange={onUrlChange} state={urlState} placeholder="https://gobang.kr/place/8102" type="url" />
              <Feedback kind={urlFb?.kind}>{urlFb?.msg}</Feedback>
              {placeUrl && /^https:\/\/gobang\.kr\/place\/\d+$/.test(placeUrl) && (
                <OgCard url={placeUrl} info={ogInfo} loading={ogLoading} onInfoChange={setOgInfo} />
              )}
            </Field>
          </Section>

          <Section title="키워드 · 최소 1개, 최대 3개">
            <div style={{ background: 'var(--bg-info)', border: '1.5px solid var(--border-info)', borderRadius: 8, padding: '12px 14px', marginBottom: 14 }}>
              <div style={{ fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6 }}>
                · 띄어쓰기는 무시됩니다. <span style={{ color: 'var(--fg-3)' }}>(예: '마포구고시원' = '마포구 고시원')</span>
              </div>
            </div>
            <KwItem index={1} value={kw.kw1} onChange={(e) => onKwChange('kw1', e.target.value)} state={kwState.kw1} feedback={kwFb.kw1} placeholder="예: 마포구고시원" />
            <KwItem index={2} value={kw.kw2} onChange={(e) => onKwChange('kw2', e.target.value)} state={kwState.kw2} feedback={kwFb.kw2} placeholder="선택 사항" />
            <KwItem index={3} value={kw.kw3} onChange={(e) => onKwChange('kw3', e.target.value)} state={kwState.kw3} feedback={kwFb.kw3} placeholder="선택 사항" />
          </Section>

          <Section title="작성 템플릿">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <TemplateCard type="A" title="설명형" desc="지점의 특징과<br>환경을 상세 설명" selected={template === 'A'} onSelect={() => setTemplate('A')} onHelp={() => { setHelpType('A'); setHelpOpen(true); }} />
              <TemplateCard type="B" title="후기형" desc="실제 경험을<br>바탕으로 한 후기" selected={template === 'B'} onSelect={() => setTemplate('B')} onHelp={() => { setHelpType('B'); setHelpOpen(true); }} />
            </div>
          </Section>

          <Section title="추가 정보">
            <Field label="강조하고 싶은 내용">
              <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="주차 가능, 조용한 분위기, 24시간 운영 등 강조할 내용을 적어주세요." maxLength={300} />
              <div style={{ fontSize: 12, color: 'var(--fg-4)', textAlign: 'right', marginTop: 6 }}>
                <span>{desc.length}</span>/300
              </div>
            </Field>
          </Section>

          <Section>
            <AgreeRow checked={agreed} onChange={setAgreed}>
              <span><strong style={{ color: 'var(--fg-1)' }}>네이버 블로그 탭 상단 노출</strong>을 목표로 작성되며, 알고리즘 특성상 <strong style={{ color: 'var(--fg-1)' }}>노출 순위 및 유지 기간은 변동</strong>될 수 있음을 이해했습니다.</span>
            </AgreeRow>
          </Section>

          <div style={{ height: 20 }} />

          <div style={{
            position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
            width: '100%', maxWidth: 480, padding: '12px 20px 16px',
            background: '#fff', borderTop: '1px solid var(--border-divider)',
          }}>
            <PrimaryButton type="submit" disabled={!canSubmit}>신청하기</PrimaryButton>
          </div>
        </form>
      </div>

      <Modal open={helpOpen}>
        <div className="t-h1" style={{ marginBottom: 8 }}>템플릿 유형 안내</div>
        <p style={{ fontSize: 15, color: 'var(--fg-3)', lineHeight: 1.6, marginBottom: 16 }}>블로그 작성 방식을 선택해 주세요</p>
        <div style={{ border: '1.5px solid var(--border-default)', borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
          <div style={{ background: 'var(--bg-info)', padding: '12px 16px', fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: 'var(--primary-400)', borderRadius: 5, padding: '2px 8px' }}>{helpType}타입</span>
            {helpType === 'A' ? '설명형' : '후기형'}
          </div>
          <div style={{ padding: '12px 16px', fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.7 }}>
            {helpType === 'A' ? (
              <><strong>객관적인 어투 + 정보전달 중심</strong>으로, 이 지점이 <strong>왜 좋은지 / 주변 지점 대비 뭐가 강점인지</strong>를 근거 있게 정리해요.</>
            ) : (
              <><strong>살았을 때의 느낌을 간접 체험</strong>하게, "후기형"으로 자연스럽게 풀어줘요. 동선·분위기·생활 체감 포인트를 디테일하게 묘사해요.</>
            )}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid var(--border-default)' }}>
              <a href={helpType === 'A' ? 'https://blog.naver.com/neoflat1116/224260067840' : 'https://blog.naver.com/neoflat1116/224260216013'}
                 target="_blank" rel="noopener"
                 style={{ display: 'inline-block', fontSize: 13, fontWeight: 600, color: 'var(--primary-400)', textDecoration: 'none', background: 'var(--primary-100)', borderRadius: 8, padding: '6px 14px' }}>
                📄 예시 글 보기 →
              </a>
            </div>
          </div>
        </div>
        <CancelButton onClick={() => setHelpOpen(false)}>확인</CancelButton>
      </Modal>

      <Modal open={confirmOpen}>
        <IconCircle bg="var(--bg-app)" size={48} fontSize={22}>📋</IconCircle>
        <div className="t-h1" style={{ marginBottom: 8 }}>입력 내용 최종 확인</div>
        <p style={{ fontSize: 15, color: 'var(--fg-3)', lineHeight: 1.6, marginBottom: 16 }}>
          신청 후에는 내용을 수정할 수 없어요.<br />아래 내용이 맞는지 확인해 주세요.
        </p>
        <div style={{ background: 'var(--bg-info)', border: '1.5px solid var(--border-default)', borderRadius: 10, padding: '14px 16px', marginBottom: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { label: '이름', value: name },
            { label: '전화번호', value: phone },
            { label: '지점 URL', value: placeUrl },
            { label: '키워드', value: [kw.kw1, kw.kw2, kw.kw3].filter(Boolean).join(' / ') },
            { label: '작성 타입', value: template === 'A' ? 'A타입 (설명형)' : 'B타입 (후기형)' },
          ].map((r, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              <span style={{ fontSize: 13, color: 'var(--fg-3)', fontWeight: 500, minWidth: 70, flexShrink: 0 }}>{r.label}</span>
              <span style={{ fontSize: 13, color: 'var(--fg-1)', fontWeight: 600, wordBreak: 'break-all', flex: 1 }}>{r.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <PrimaryButton onClick={confirmSubmit}>신청 완료</PrimaryButton>
          <CancelButton onClick={() => setConfirmOpen(false)}>돌아가기</CancelButton>
        </div>
      </Modal>
    </div>
  );
}

function App() {
  const [phase, setPhase] = useState('loading');
  const [status, setStatus] = useState(null);

  useEffect(() => {
    GobangAPI.checkAccess().then((d) => {
      if (!d.ok) { setPhase('off'); }
      else { setStatus(d); setPhase('form'); }
    });
  }, []);

  if (phase === 'loading') return <LoadingScreen />;
  if (phase === 'off')     return <OffScreen reason="현재 신청 기간이 아닙니다" />;
  if (phase === 'success') return <SuccessScreen />;
  return <FormScreen status={status} onSubmit={() => setPhase('success')} />;
}

Object.assign(window, { LoadingScreen, OffScreen, SuccessScreen, FormScreen, App });
