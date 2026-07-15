# 고방 블로그 — 기존 고객 특별가 (3차)

블로그 상품을 이미 구매한 원장님 대상, **10만원(VAT 별도)·7일 한정** 특별가 랜딩+신청폼 통합 페이지.
2차(15만원, `../index.html` · `../landing/`)와 **데이터·자동화 완전 분리**된 복제본.

## 구조

| 레이어 | 위치 | 비고 |
|---|---|---|
| 프론트 (랜딩+폼+D-day 1페이지) | `special/index.html` | 순수 HTML/JS, 빌드 없음 |
| 백엔드 GAS (복제본) | `special/gas-code/Code.gs` | 2차와 동일 로직, 상수 3개만 교체 |
| 데이터 | **새 구글 시트** (2차 시트 복사본) | 2차 시트와 다른 ID |

## D-day 카운트다운 — 발송 링크 만드는 법

페이지는 URL 파라미터로 마감일을 읽는다. 수신자마다 다른 마감일 가능.

- `?sent=YYYYMMDD` — **발송일 입력 → 자동으로 +7일 마감** (권장, 운영 편함)
  예) `…/special/?sent=20260628` → 7월 5일 23:59 마감
- `?until=YYYYMMDD` — 마감일을 절대값으로 직접 지정
  예) `…/special/?until=20260705`
- 파라미터 없으면 접속일+7일 (fallback — 실제 발송엔 항상 파라미터 포함할 것)
- 마감 24시간 이내 → 카운트다운 빨간색 깜빡임
- 마감 지나면 → 폼 숨김, "이벤트가 마감되었어요" 전체화면

## 배포 체크리스트 (사람이 직접 — 계정 권한 필요)

### 1. 구글 시트 복사
- 기존 2차 시트(`1lgAsrtoeqv1-g3Nh3D21zTyuGLdAZuP5jSXxftlIxh0`)를 **사본 만들기**
- 사본 URL에서 새 시트 ID 복사 → 아래 2번 GAS에 입력
- 시트 내 기존 신청/완료 데이터 행은 삭제(설정·헤더·`완료 내역` H열 드롭다운 서식만 유지)
- `설정` 시트: active=ON, 신청기간/인원은 비워도 됨(마감은 프론트 D-day가 담당)

### 2. GAS 새 프로젝트 배포 (clasp)
- `special/gas-code/Code.gs` 상단 3개 상수 교체:
  - `SPREADSHEET_ID` → 1번에서 만든 새 시트 ID
  - `TEMPLATE_PAYMENT` → 3번에서 만든 10만원 알림톡 템플릿 ID
  - `TEMPLATE_COMPLETE` → 그대로 (재사용)
- `.clasp.json`의 `scriptId` → 새 Apps Script 프로젝트 ID
- Script Properties 설정: `SOLAPI_API_KEY`, `SOLAPI_API_SECRET`, `SOLAPI_PF_ID`, `INBOX_TOKEN`(필요시)
- `clasp push` → 웹앱 배포(`clasp deploy`) → **새 exec URL** 발급
- 최초 1회 `setupTrigger()` 실행(onEdit 트리거 등록), `setupH_Dropdown()` 실행
- 발급된 exec URL → `special/index.html`의 `GAS_URL` 교체

### 3. 카카오 알림톡 템플릿 (결제요청용 · 유일한 시간 소요)
- 기존 결제요청 템플릿은 **15만원 토스 링크가 본문에 하드코딩**됨
- SOLAPI/카카오 비즈메시지에서 **10만원 토스 링크로 새 템플릿 등록 → 검수·승인**(영업일 ~1일)
- 변수는 `#{신청자}` 동일하게. 승인된 템플릿 ID → 2번 `TEMPLATE_PAYMENT`에 입력

### 4. 토스 결제링크 (10만원)
- 토스페이먼츠 → 판매상품 → 새 상품(100,000원) 등록 → 결제링크 발급
- 이 링크를 3번 알림톡 템플릿 본문에 삽입
- 결제완료 알림메일을 받으려면, 이 상품 **웹훅 → 새 GAS doPost URL**로 연결

### 5. GitHub Pages
- 이 폴더는 기존 `blog_request` repo 안 → push만 하면 `gobangmkt.github.io/blog_request/special/` 로 자동 노출
- 기존 루트(`/index.html`) 무영향

## ⚠️ 절대 금지
- 기존 2차 시트(`1lgAsrt…`) · 기존 GAS · 기존 `TEMPLATE_PAYMENT` 수정 금지
- 새 GAS의 `SPREADSHEET_ID`가 기존 시트를 가리키지 않는지 배포 전 반드시 확인
