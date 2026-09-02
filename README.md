# 네이버 블로그 제작 요청 앱

## 개요

고방 블로그 마케팅 서비스의 **신청 폼 + 랜딩페이지**. 이벤트 기간 중 고시원/원룸 지점주가 블로그 글 작성을 신청하는 앱. repo `gobangMkt/blog_request`.

## 폼 구성

루트 `index.html`은 `15만원-여름특가/`로 리다이렉트한다. 상품별로 독립 폴더 + 독립 GAS 프로젝트로 운영된다.

| 폴더 | 상품 | 성격 | 비고 |
|------|------|------|------|
| `10만원-CRM판매/` | 원장님 전용 10만원 (정가 15만 · 5만원 할인) | 기존 원장님 전용 | **서명 링크 발급제** (아래) |
| `15만원-여름특가/` | 여름특가 15만원 (정가 30만 · 50%) | 신규 포함 | landing(React CDN) + 신청폼 |

- `10만원-CRM판매/form.html`: 신청 폼 본체. `index.html`은 쿼리를 보존한 채 `form.html`로 보내는 리다이렉트 스텁.
- 상세(상품·실적 소개) 랜딩: https://landing-two-tau-94.vercel.app/

## 코어

### 공통 핵심 기능 (두 상품 동일)
- **신청 폼**: 지점 URL 입력 → OG 정보 자동 조회 → 키워드 중복 체크 → 동의 후 제출
- **백엔드**(`gas-code/Code.gs`): 구글 시트(신청 내역/완료 내역) 기록, 알림톡 발송, 중복 체크

### 상품별 차이

| 상품 | 전용 기능 |
|------|-----------|
| `10만원-CRM판매/` | **서명 링크 발급제** — 마감일을 URL에 담되 위조 불가하게 HMAC 서명. 운영자가 발급 페이지에서 날짜를 고르면 서명 붙은 신청 링크 생성, 날짜 조작 시 서버가 거부. **결제완료일 입력 시 행 노랑 하이라이트 + 신청 후 N일(기본 5일) 미결제 시 리마인드 알림톡 1회 자동발송**(설정 시트 7행에서 N 조정) |
| `15만원-여름특가/` | **상세 랜딩 별도 보유** — React CDN 랜딩(`landing/`), 발급제 없이 일반 공개 신청 |

### 서명 링크 동작 (10만원 폼 전용)
- `from`(YYYYMMDD) + 서버 비밀키로 `sig`(HMAC-SHA256 16자) 생성. 비밀키는 스크립트 속성에 자동 생성·보관(코드/깃 비노출)
- 개인 마감 = 발급일 자정 + 5일
- `checkAccess`·`submitForm`이 진입 시 `verifyLink`로 서명·기간을 **서버에서 재검증** → URL 날짜 조작으로 마감 우회 불가
- 발급은 운영자 토큰(스크립트 속성 `INBOX_TOKEN`)이 있어야 가능 → 무인증 발급 차단

### 기술 스택
- 신청 폼: 순수 HTML + Vanilla JS (빌드 없음)
- 랜딩: React 18 (CDN) + Babel Standalone (브라우저 컴파일)
- 백엔드: Google Apps Script (GAS) + 구글 시트
- 폰트: Pretendard

### 데이터 흐름
```
신청 폼 → GAS API (checkAccess / checkPlaceUrl / fetchPlaceInfo / checkKeyword / submitForm)
       → 구글 시트(신청 내역 + 완료 내역) 기록 → 완료 내역 H열 드롭박스로 알림톡 발송 관리
운영자 → 발급 페이지(?gen) → genLink(토큰) → 서명 링크 생성 → 원장에게 전달
```

## 실행 / 배포

### 로컬 개발
```bash
# 신청 폼: 해당 폴더의 form.html 또는 index.html을 브라우저/Live Server로 열기
# 랜딩(15만원): cd 15만원-여름특가/landing && node server.js  → http://localhost:5500
```

### 배포 (폼별)
| 대상 | 방법 |
|------|------|
| 신청 폼 | `git push origin main` → GitHub Pages 자동 반영 (수 분) |
| GAS | `cd <폼>/gas-code` → `clasp push --force` → `clasp deploy --deploymentId <운영ID> -d "<설명>"` (exec URL 유지) |
| 랜딩 | `cd 15만원-여름특가/landing && npx vercel --prod` |

### 시크릿 / 설정 (값은 GAS 스크립트 속성에 귀속 — 본 문서 미기재)
- `LINK_SECRET`: 서명 비밀키. 최초 발급/검증 시 자동 생성됨. 운영자 설정 불필요.
- `INBOX_TOKEN`: 발급 페이지 + 신청관리(인박스) 공용 운영자 토큰. **스크립트 속성에 직접 설정.**
- `GAS_URL`: 각 폼 `form.html`/`index.html`에 박힌 exec URL. GAS 재배포 시 deploymentId 유지하면 갱신 불필요.

## 운영자 — 신청 링크 발급법 (10만원 폼)
1. `<10만원 폼 GAS exec URL>?gen` 접속 (즐겨찾기 권장)
2. 운영자 토큰(`INBOX_TOKEN`) + 시작 날짜 입력 → "링크 생성"
3. 생성된 링크 복사 → 원장에게 전달 (그 날부터 5일 유효)

## 배포링크
| 대상 | URL |
|------|-----|
| 신청 폼(루트→15만원) | https://gobangmkt.github.io/blog_request/ |
| 10만원 폼 | https://gobangmkt.github.io/blog_request/10만원-CRM판매/ |
| 상세 랜딩 | https://landing-two-tau-94.vercel.app/ |
| GitHub repo | https://github.com/gobangMkt/blog_request |
