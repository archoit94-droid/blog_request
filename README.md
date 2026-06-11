# 네이버 블로그 제작 요청 앱

## 개요

고방 블로그 마케팅 서비스의 **신청 폼 + 랜딩페이지**. 이벤트 기간 중 고시원/원룸 지점주가 블로그 글 작성을 신청하는 앱.

## 코어

### 핵심 기능

- **신청 폼**(`index.html`): 지점 URL 입력 → OG 정보 자동 조회 → 장악 키워드 중복 체크 → 3종 동의 후 제출
- **랜딩페이지**(`landing/`): 서비스 소개 + 신청 폼으로 유입
- **백엔드**(`gas-code/Code.gs`): 구글 시트(신청 내역 / 완료 내역) 기록, 알림톡 발송, 중복 체크

### 기술 스택

- **신청 폼**: 순수 HTML + Vanilla JS (빌드 없음)
- **랜딩**: React 18 (CDN) + Babel Standalone (브라우저 컴파일, 빌드 불필요)
- **백엔드**: Google Apps Script (GAS) + 구글 시트
- **폰트**: Pretendard (Google Fonts CDN)

### 주요 데이터 흐름

```
신청 폼 → GAS API (checkAccess / checkPlaceUrl / fetchPlaceInfo / checkKeyword / submitForm)
       → 구글 시트(신청 내역 + 완료 내역) 기록
       → 완료 내역 H열 발송 드롭박스로 알림톡 발송 관리
```

- 키워드 중복 체크는 **완료 내역 시트** 기준(완료일 + `keywordDays` 이내면 사용 불가)
- 완료 내역 컬럼/발송 로직은 절대 규칙 — 상세는 `CLAUDE.md` 참조

## 실행 / 배포 방법

### 로컬 개발

```bash
# 랜딩페이지
cd landing
node server.js          # 또는 "랜딩페이지 열기.bat"
# → http://localhost:5500

# 신청 폼: index.html을 브라우저에서 직접 열기 또는 Live Server
```

### 배포

| 대상 | 방법 |
|------|------|
| 신청 폼 | `git push origin main` → GitHub Pages 자동 반영 (수 분 소요) |
| 랜딩페이지 | `cd landing && npx vercel --prod` |

### 시크릿 / 설정

- **GAS_URL**: `index.html` 내 `GAS_URL` 변수에 배포 URL 박혀있음. GAS 재배포 시 갱신 필요.
- 시크릿(시트 ID·스크립트 ID)은 GAS 프로젝트에 귀속. 값은 본 문서에 기재하지 않음.

## 배포링크

| 대상 | URL |
|------|-----|
| 신청 폼 | https://gobangmkt.github.io/blog_request/ |
| 랜딩페이지 | https://landing-nf1.vercel.app |
| GitHub repo | https://github.com/gobangMkt/blog_request |
