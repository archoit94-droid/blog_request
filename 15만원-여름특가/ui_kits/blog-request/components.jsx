/* global React */
// Primitive components for the Blog Request UI kit.
// All visual values come from ../../colors_and_type.css custom props.

const { useState, useEffect, useRef } = React;

// ──────────────────────────────────────────────────────────────────
// Spinner — pure CSS donut. 12 / 16 / 20px sizes.
// ──────────────────────────────────────────────────────────────────
function Spinner({ size = 16 }) {
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: '2px solid var(--border-default)',
        borderTopColor: 'var(--primary-400)',
        borderRadius: '50%',
        animation: 'gbSpin 0.7s linear infinite',
        flexShrink: 0,
      }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────
// IconCircle — emoji-in-pastel-circle, used on status screens.
// ──────────────────────────────────────────────────────────────────
function IconCircle({ children, size = 56, bg = 'var(--bg-app)', fontSize = 24 }) {
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: bg, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize, lineHeight: 1, marginBottom: 16,
      }}
    >
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Header — page title + subtitle, white sheet with hairline.
// ──────────────────────────────────────────────────────────────────
function Header({ title, subtitle }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      padding: '20px 20px 0',
      borderBottom: '1px solid var(--border-divider)',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', paddingBottom: 20 }}>
        <h1 className="t-h1">{title}</h1>
        {subtitle && (
          <p style={{ fontSize: 14, color: 'var(--fg-3)', marginTop: 4 }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// StatusBanner — 신청 기간 row + urgency pill.
// ──────────────────────────────────────────────────────────────────
function StatusBanner({ startDate, endDate, remaining }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      padding: '14px 20px',
      borderBottom: '1px solid var(--border-divider)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {(startDate || endDate) && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--fg-3)' }}>신청 기간</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg-1)', textAlign: 'right' }}>
              {startDate || '~'} ~ {endDate || '상시'}
            </span>
          </div>
        )}
        {remaining != null && remaining <= 20 && (
          <div style={{
            fontSize: 14, fontWeight: 600, color: 'var(--error-strong)',
            background: 'var(--error-bg)', borderRadius: 8,
            padding: '10px 14px', lineHeight: 1.5,
          }}>
            ⚡ 남은 신청 가능 횟수 <strong style={{ color: 'var(--error-strong)' }}>{remaining}개</strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Section — white sheet, top eyebrow.
// ──────────────────────────────────────────────────────────────────
function Section({ title, children, style }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      marginTop: 8, padding: '20px 20px 16px',
      ...style,
    }}>
      {title && <div className="t-section-eyebrow" style={{ marginBottom: 16, display: 'block' }}>{title}</div>}
      {children}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// NoticeCard — info-tinted card with `·` bulleted list.
// ──────────────────────────────────────────────────────────────────
function NoticeCard({ items }) {
  return (
    <div style={{
      background: 'var(--bg-info)',
      border: '1.5px solid var(--border-info)',
      borderRadius: 10, padding: '14px 16px',
    }}>
      <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8, margin: 0, padding: 0 }}>
        {items.map((it, i) => (
          <li key={i} style={{
            fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.6,
            paddingLeft: 16, position: 'relative',
          }}>
            <span style={{
              position: 'absolute', left: 4, color: 'var(--primary-400)', fontWeight: 700,
            }}>·</span>
            <span dangerouslySetInnerHTML={{ __html: it }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// Field — label + input + feedback wrapper.
// ──────────────────────────────────────────────────────────────────
function Field({ label, children, helper }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <div className="t-label" style={{ marginBottom: 8 }}>{label}</div>}
      {children}
      {helper && (
        <div style={{ fontSize: 12, color: 'var(--fg-4)', marginTop: 6 }}>{helper}</div>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// TextInput — base input. state ∈ '', 'valid', 'invalid'.
// ──────────────────────────────────────────────────────────────────
function TextInput({ value, onChange, state = '', placeholder, type = 'text', maxLength, ...rest }) {
  const borderColor =
    state === 'valid'   ? 'var(--state-valid)'   :
    state === 'invalid' ? 'var(--state-invalid)' :
    'var(--border-default)';
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      autoComplete="off"
      style={{
        width: '100%', padding: '14px 16px',
        border: `1.5px solid ${borderColor}`,
        borderRadius: 10, fontSize: 15,
        fontFamily: 'inherit', color: 'var(--fg-1)',
        background: '#fff', outline: 'none',
        transition: 'border-color 0.15s',
        WebkitAppearance: 'none', boxSizing: 'border-box',
      }}
      onFocus={(e) => {
        if (state === '') e.target.style.borderColor = 'var(--primary-400)';
      }}
      onBlur={(e) => { e.target.style.borderColor = borderColor; }}
      {...rest}
    />
  );
}

function Textarea({ value, onChange, placeholder, maxLength }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      style={{
        width: '100%', padding: '14px 16px',
        border: '1.5px solid var(--border-default)',
        borderRadius: 10, fontSize: 15, lineHeight: 1.6,
        fontFamily: 'inherit', color: 'var(--fg-1)',
        background: '#fff', outline: 'none',
        transition: 'border-color 0.15s',
        resize: 'none', height: 100, boxSizing: 'border-box',
      }}
      onFocus={(e) => { e.target.style.borderColor = 'var(--primary-400)'; }}
      onBlur={(e) => { e.target.style.borderColor = 'var(--border-default)'; }}
    />
  );
}

// ──────────────────────────────────────────────────────────────────
// Feedback — inline ok/err/checking.
// ──────────────────────────────────────────────────────────────────
function Feedback({ kind, children }) {
  if (!kind) return <div style={{ minHeight: 16, marginTop: 6 }} />;
  const color = kind === 'ok' ? 'var(--success)' : kind === 'error' ? 'var(--error)' : 'var(--fg-3)';
  return (
    <div style={{
      fontSize: 12, marginTop: 6, minHeight: 16,
      display: 'flex', alignItems: 'center', gap: 6, color,
    }}>
      {kind === 'checking' && <Spinner size={12} />}
      <span>{children}</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// KwItem — numbered keyword input row.
// ──────────────────────────────────────────────────────────────────
function KwItem({ index, value, onChange, state, feedback, placeholder }) {
  const numState =
    state === 'valid'   ? { bg: 'var(--success-bg)', fg: 'var(--success)' } :
    state === 'invalid' ? { bg: 'var(--error-bg)',   fg: 'var(--error)'   } :
    state === 'active'  ? { bg: 'var(--primary-100)', fg: 'var(--primary-400)' } :
    { bg: 'var(--bg-app)', fg: 'var(--fg-3)' };
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: numState.bg, color: numState.fg,
        fontSize: 13, fontWeight: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, marginTop: 13,
      }}>{index}</div>
      <div style={{ flex: 1 }}>
        <TextInput
          value={value}
          onChange={onChange}
          state={state === 'valid' ? 'valid' : state === 'invalid' ? 'invalid' : ''}
          placeholder={placeholder}
        />
        <Feedback kind={feedback?.kind}>{feedback?.msg}</Feedback>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// OgCard — fetched branch preview + editable info-fields.
// ──────────────────────────────────────────────────────────────────
function OgCard({ url, info, loading, onInfoChange }) {
  if (!url) return null;
  return (
    <div style={{
      marginTop: 12,
      border: '1.5px solid var(--border-default)',
      borderRadius: 10, overflow: 'hidden',
    }}>
      {loading && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          height: 60, gap: 8, color: 'var(--fg-3)', fontSize: 13,
        }}>
          <Spinner size={16} />지점 정보 불러오는 중...
        </div>
      )}
      {!loading && (
        <>
          <a href={url} target="_blank" rel="noopener" style={{ display: 'flex', textDecoration: 'none', color: 'inherit' }}>
            <div style={{
              width: 90, minHeight: 90, flexShrink: 0,
              background: 'linear-gradient(135deg,#d4c8b0 0%,#a89a7a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 11, opacity: 0.85,
            }}>place photo</div>
            <div style={{ flex: 1, padding: '12px 14px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 4 }}>
              <div style={{ fontSize: 11, color: 'var(--fg-4)' }}>gobang.kr</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg-1)', lineHeight: 1.4 }}>{info.ogTitle}</div>
              <div style={{
                fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.4,
                display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
              }}>{info.ogDesc}</div>
            </div>
          </a>
          <div style={{ padding: '14px 16px', background: 'var(--bg-info)', borderTop: '1px solid var(--border-default)' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--primary-400)', marginBottom: 10 }}>
              ✦ 지점 정보 (사실과 다를 경우 직접 수정해 주세요)
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <SmallInput label="보증금" value={info.deposit} onChange={(v) => onInfoChange({ ...info, deposit: v })} placeholder="예: 50만원" />
              <SmallInput label="월세"  value={info.monthly} onChange={(v) => onInfoChange({ ...info, monthly: v })} placeholder="예: 40만원" />
            </div>
            <div style={{ marginTop: 10 }}>
              <SmallInput label="도보 정보" value={info.walking} onChange={(v) => onInfoChange({ ...info, walking: v })} placeholder="예: 강남역 도보 5분" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function SmallInput({ label, value, onChange, placeholder }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg-3)', marginBottom: 4 }}>{label}</div>
      <input
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '10px 12px', fontSize: 14,
          border: '1.5px solid var(--border-default)', borderRadius: 8,
          background: '#fff', color: 'var(--fg-1)', fontFamily: 'inherit',
          outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// TemplateCard
// ──────────────────────────────────────────────────────────────────
function TemplateCard({ type, title, desc, selected, onSelect, onHelp }) {
  return (
    <div
      onClick={onSelect}
      style={{
        border: `2px solid ${selected ? 'var(--primary-400)' : 'var(--border-default)'}`,
        borderRadius: 12, padding: '16px 14px', cursor: 'pointer',
        transition: 'border-color 0.15s, background 0.15s',
        background: selected ? 'var(--primary-50)' : '#fff',
      }}
    >
      <div style={{
        fontSize: 11, fontWeight: 700,
        color: selected ? '#fff' : 'var(--primary-400)',
        background: selected ? 'var(--primary-400)' : 'var(--primary-100)',
        borderRadius: 6, padding: '2px 8px', display: 'inline-block', marginBottom: 8,
      }}>{type}타입</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--fg-1)', marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: desc }} />
      <span
        onClick={(e) => { e.stopPropagation(); onHelp(); }}
        style={{
          display: 'inline-block', fontSize: 12, color: 'var(--primary-400)',
          marginTop: 10, textDecoration: 'underline', fontWeight: 500, cursor: 'pointer',
        }}
      >항목 설명 보기</span>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────
// AgreeRow — checkbox + tinted info row.
// ──────────────────────────────────────────────────────────────────
function AgreeRow({ checked, onChange, children }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      background: 'var(--bg-info)',
      border: '1.5px solid var(--border-info)',
      borderRadius: 10, padding: '14px 16px',
    }}>
      <span style={{ position: 'relative', width: 22, height: 22, flexShrink: 0, marginTop: 1 }}>
        <input
          type="checkbox" checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          style={{ opacity: 0, width: 0, height: 0, position: 'absolute' }}
        />
        <span style={{
          position: 'absolute', inset: 0,
          background: checked ? 'var(--primary-400)' : '#fff',
          border: `2px solid ${checked ? 'var(--primary-400)' : 'var(--border-strong)'}`,
          borderRadius: 5, transition: 'background 0.15s, border-color 0.15s',
        }}>
          <span style={{
            content: '""', position: 'absolute',
            width: 5, height: 10, left: 6, top: 2,
            borderRight: `2.5px solid ${checked ? '#fff' : 'transparent'}`,
            borderBottom: `2.5px solid ${checked ? '#fff' : 'transparent'}`,
            transform: 'rotate(45deg)',
            transition: 'border-color 0.15s',
          }} />
        </span>
      </span>
      <span style={{
        fontSize: 14, color: 'var(--fg-2)', lineHeight: 1.5, flex: 1,
        letterSpacing: '-0.3px', wordBreak: 'keep-all',
      }}>{children}</span>
    </label>
  );
}

// ──────────────────────────────────────────────────────────────────
// PrimaryButton / CancelButton
// ──────────────────────────────────────────────────────────────────
function PrimaryButton({ disabled, children, onClick, type = 'button', style }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{
        width: '100%', padding: 15,
        background: disabled ? 'var(--border-default)' : (hover ? 'var(--primary-500)' : 'var(--primary-400)'),
        color: disabled ? 'var(--fg-4)' : '#fff',
        border: 'none', borderRadius: 10,
        fontSize: 16, fontWeight: 700, fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background 0.15s', ...style,
      }}
    >{children}</button>
  );
}

function CancelButton({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', padding: 15,
      background: 'var(--bg-app)', color: 'var(--gray-600)',
      border: 'none', borderRadius: 10,
      fontSize: 16, fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer',
    }}>{children}</button>
  );
}

// ──────────────────────────────────────────────────────────────────
// Modal — bottom sheet with scrim. open prop.
// ──────────────────────────────────────────────────────────────────
function Modal({ open, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'var(--surface-overlay)',
      zIndex: 100, display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff', borderRadius: '20px 20px 0 0',
        padding: '28px 24px 32px', width: '100%', maxWidth: 480,
        animation: 'gbSlideUp 0.2s ease',
      }}>{children}</div>
    </div>
  );
}

Object.assign(window, {
  Spinner, IconCircle, Header, StatusBanner, Section, NoticeCard,
  Field, TextInput, Textarea, Feedback, KwItem, OgCard, SmallInput,
  TemplateCard, AgreeRow, PrimaryButton, CancelButton, Modal,
});
