# 네이버 블로그 제작 요청 앱 — CLAUDE.md

## 프로젝트 개요

고방 블로그 마케팅 서비스의 신청 폼 + 랜딩페이지.  
이벤트 기간 중 고시원/원룸 지점주가 블로그 글 작성을 신청하는 앱.

---

## ⚠️ 폼 분화 (2026-06-30)

루트 `index.html`은 `15만원-여름특가/`로 리다이렉트. 상품별 독립 폴더 + **독립 GAS 프로젝트**:
- `10만원-CRM판매/` — 원장 전용 10만원(정가15만·5만원할인). **서명 링크 발급제**. scriptId `1NHD3a…`, exec `AKfycbz20Sjj…`(@6)
- `15만원-여름특가/` — 여름특가 15만원. 아래 GAS API의 GAS_URL(`AKfycbygEz…`)은 이 계열 기준

### 10만원 폼 — 서명 링크 절대 규칙
- 마감 = `from`(YYYYMMDD)+5일. 서버 비밀키 HMAC `sig`로 서명. `verifyLink`가 `checkAccess`·`submitForm`에서 서명·기간 재검증 → **클라(form.html) 검증만 믿지 말 것. 마감 우회 방지의 핵심은 서버 게이트.**
- 발급 = `genLink`(운영자 토큰 `INBOX_TOKEN` 필요) + `?gen` 발급 페이지. `LINK_SECRET`은 스크립트 속성 자동 생성 — **코드 하드코딩 금지(공개 repo).**
- `FORM_BASE_URL`은 반드시 `…/blog_request/10만원-CRM판매/` (루트로 두면 15만원으로 튕김). 한글 경로 `encodeURI`.

---

## 배포

| 대상 | URL | 방법 |
|------|-----|------|
| 신청 폼 | https://gobangmkt.github.io/blog_request/ | GitHub Pages (main 브랜치 push 시 자동) |
| 랜딩페이지 | https://landing-two-tau-94.vercel.app | Vercel (`landing/` 폴더 기준) |

- **랜딩 재배포**: `cd landing && npx vercel --prod`
- **신청 폼 배포**: `git push origin main` 하면 자동 반영 (수 분 소요)

---

## 주요 파일

```
index.html          신청 폼 (메인 페이지)
landing/
  index.html        랜딩페이지 (React CDN + Babel Standalone, 빌드 불필요)
  shared.jsx        공용 컴포넌트
  variant-a.jsx     현재 사용 중인 랜딩 variant
  colors_and_type.css  디자인 토큰
  vercel.json       Vercel 정적 배포 설정
gas-code/Code.gs    Google Apps Script 서버 코드
```

---

## 기술 스택

- **신청 폼**: 순수 HTML + Vanilla JS (프레임워크 없음)
- **랜딩**: React 18 (CDN) + Babel Standalone (브라우저 컴파일, 빌드 없음)
- **백엔드**: Google Apps Script (GAS)
- **폰트**: Pretendard (Google Fonts CDN)

---

## ⚠️ 충돌 발생 시 행동 규칙

아래 "GAS 절대 규칙" 또는 "커스텀 토글 체크박스 구조"와 **충돌하는 수정 요청**이 들어올 경우:

1. **즉시 작업을 멈추고** 사용자에게 다음 형식으로 확인을 요청할 것:

   > ⚠️ 요청하신 작업이 기존 핵심 로직과 충돌합니다.  
   > 충돌 내용: `[충돌하는 규칙 이름]` — [구체적으로 무엇이 달라지는지 한 줄 설명]  
   > 어떻게 처리할까요?  
   > A) 기존 규칙을 유지하고 다른 방법을 찾는다  
   > B) 기존 규칙을 이번 요청에 맞게 변경한다 (CLAUDE.md도 함께 업데이트)

2. 사용자가 **B를 선택**한 경우에만 변경 진행 + CLAUDE.md 해당 규칙도 동시에 업데이트
3. 사용자가 **A를 선택**하거나 답변이 불명확한 경우 → 기존 규칙 유지

> 이 확인 없이 핵심 규칙을 임의로 변경하는 것은 금지.

---

## ⚠️ GAS 절대 규칙 — 건드리면 안 되는 로직

### 1. checkKeyword — 완료 내역 기준 중복 체크
- **반드시 `완료 내역` 시트**에서 읽어야 함 (`신청 내역` 아님)
- col G = 완료일, col E = 장악 키워드
- 완료일 기준으로 `keywordDays`(설정 시트) 이내면 사용 불가
- `신청 내역`의 키워드는 체크 대상 아님 (제한 없음)

### 2. 완료 내역 시트 컬럼 구조 (절대 변경 금지)
| 열 | 내용 |
|----|------|
| A | D-day (신청 내역 결제완료일+7일, onSheetEdit 자동 계산) |
| B | 신청자 (신청 시 자동 기록) |
| C | 전화번호 (신청 시 자동 기록) |
| D | 지점 URL (신청 시 자동 기록) |
| E | 장악 키워드 (수동 입력) |
| F | 블로그 URL (수동 입력) |
| G | 완료일 (수동 입력) |
| H | 발송 드롭박스 — `발송대기` / `발송하기` / `발송완료` 3가지 상태 |
| I | 발송시간 (발송완료 시 자동 기록 — 이후 재발송 방지용) |

**H열 발송 로직:**
- 신청 접수 시 → `발송대기` 자동 설정
- `발송하기` 선택 시 → E+F+G 모두 입력된 경우에만 알림톡 발송 후 `발송완료`로 자동 변경
- E+F+G 미입력 시 → `발송대기`로 자동 복귀
- I열(발송시간) 기록 후 → 재선택해도 재발송 안 됨 (중복 방지)
- 색상: 발송대기(회색) / 발송하기(노랑) / 발송완료(초록)

**H열 관련 GAS 유지보수 함수:**
- `setupH_Dropdown()` — 드롭박스 + 조건부 색상 설정 (배포 불필요, 직접 실행)
- `fixCompletedRows()` — E+F+G 채워진 행 일괄 발송완료 처리
- `cleanupH_Column()` — FALSE 잔재 값 → 발송대기로 정리

### 3. submitForm → 완료 내역 기록 규칙
- 신청 접수 시 완료 내역에 `['', name, phone, placeUrl, '', '', '', '발송대기', '']` 형태로 추가
- B(신청자), C(전화번호), D(지점URL)는 신청 시 자동 기록
- E(장악 키워드), F(블로그URL), G(완료일)는 **빈칸** — 수동 입력 영역
- A(D-day)는 `onEdit` 트리거로 자동 계산: 신청 내역 B열(결제완료일) 입력 시 결제완료일 + 7일
- H(발송대기)는 appendRow 후 `setValue('발송대기')` 명시 호출 필수 (체크박스 서식 잔재 방지)
- 절대 장악 키워드나 완료일을 자동으로 채워 넣지 말 것

---

## GAS API

```js
var GAS_URL = 'https://script.google.com/macros/s/AKfycbygEzqWKlYa1EgStmNY1wxvIL23TDSPec1YMAAOnkPEIu1CcpwkyOfCDph5-RHSAnuD/exec';
```

### API actions
| action | 설명 |
|--------|------|
| `checkAccess` | 서명(from·sig) + 이벤트 기간/마감 검증 + 상태 배너 데이터 반환 |
| `genLink` | (운영자 토큰) 시작일로 서명 신청 링크 발급 — 발급 페이지(`?gen`)가 호출 |
| `checkPlaceUrl` | 지점 URL 중복 신청 여부 확인 |
| `fetchPlaceInfo` | 지점 URL로 OG 정보(이미지·제목·설명) 가져오기 |
| `checkKeyword` | 키워드 사용 가능 여부 + 남은 일수 확인 |
| `submitForm` | 최종 신청 데이터 제출 |

> GAS 재배포 시 `index.html`의 `GAS_URL` 변수 업데이트 필요

---

## 신청 폼 주요 구조 (index.html)

### 화면 상태
- `loadingScreen` — 초기 로딩 (현재는 즉시 숨김)
- `offScreen` — 이벤트 마감/접근 불가 시 표시
- `form-area` — 메인 폼 (기본 표시)
- `successScreen` — 신청 접수 완료 화면
- `modalOverlay` — 최종 확인 모달 (개인정보 동의 포함)
- `templateModal` — 템플릿 유형 안내 모달

### 로딩 전략
`checkAccess`를 백그라운드에서 호출. 폼은 즉시 노출.  
접근 불가 판정 시 폼 숨기고 `offScreen` 표시.  
(GAS 콜드 스타트 지연 방지를 위해 이 방식 사용)

### 동의 항목 (3개 모두 체크해야 제출 가능)
1. `agreeToggle` — 노출 순위 변동 가능성 동의
2. `agreeToggle2` — 대상자 선정 후 결제 완료 시 작업 시작 동의
3. `privacyAgree` — 개인정보 수집 동의 (최종 확인 모달 안에 위치)

### 최종 확인 모달
- 입력 내용 요약 표시
- 개인정보 수집 동의 (접기/펼치기)
- `privacyAgree` 체크해야 "동의하고 신청 완료하기" 버튼 활성화

### 키워드 힌트
사용 불가 키워드 입력 시:  
`"00일 뒤 사용 가능해요"` + `"다른 키워드를 사용해보세요. 예) 강남고시원, 강남원룸텔 등"`

---

## 커스텀 토글 체크박스 구조

폼 전체에서 사용하는 체크박스 패턴:

```html
<div class="toggle-wrap">
  <input type="checkbox" id="someToggle" class="toggle-input">
  <span class="toggle-slider"></span>
</div>
```

> 일반 `<input type="checkbox">` 단독 사용 시 시각적 체크 표시가 안 됨.  
> 반드시 `toggle-input` + `toggle-slider` 조합으로 사용할 것.

---

## 로컬 개발

```bash
# 랜딩페이지
cd landing
node server.js      # 또는 "시작 5500.bat" 더블클릭
# → http://localhost:5500

# 신청 폼 (index.html)
# 브라우저에서 직접 파일 열기 또는 Live Server 사용
```
