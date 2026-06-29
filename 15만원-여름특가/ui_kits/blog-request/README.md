# UI Kit — Blog Request (블로그 작성 신청서)

A faithful recreation of the production "블로그 작성 신청서" form used by **neoflatMKT** to collect Naver-blog content requests from gobang.kr branch owners.

## Files

- `index.html` — entrypoint; mounts the full clickable prototype
- `data.js` — mock backend (`window.GobangAPI`) mirroring the real Apps Script endpoints (`checkAccess`, `fetchPlaceInfo`, `checkPlaceUrl`, `checkKeyword`, `submitForm`)
- `components.jsx` — primitives: `Header`, `StatusBanner`, `Section`, `NoticeCard`, `Field`, `TextInput`, `Textarea`, `Feedback`, `KwItem`, `OgCard`, `TemplateCard`, `AgreeRow`, `PrimaryButton`, `CancelButton`, `Modal`, `Spinner`, `IconCircle`
- `screens.jsx` — composed states: `LoadingScreen`, `OffScreen`, `FormScreen`, `SuccessScreen`, top-level `App`

## Source of truth

Everything visual is derived from the production codebase mounted at `3.네이버 블로그 제작 요청 앱/`:
- `client/styles.css` — token-level visual values
- `client/index.html` — DOM structure of every section
- `client/app.js` — validation timing, debounce intervals, state transitions
- `client/serverApi.js` — endpoint shape

All color, type, spacing, radius, and timing values are pulled from `colors_and_type.css` at the project root.

## Interactions implemented

- Phone input auto-formats to `010-0000-0000` and shows valid/invalid border tint
- Place URL: regex check → debounced "이미 신청된 지점" remote check → OG card with editable 보증금/월세/도보 fields
- Keyword fields: per-field debounced availability check with checking / valid / invalid states (numbered circle changes color in lockstep)
- Template A/B selector with help modal containing example links
- Agreement checkbox with custom check mark
- Final-confirm bottom-sheet modal with summary, then a success screen
- Sticky bottom CTA disables until all required fields are valid

## What's intentionally fake

- All network calls resolve via `setTimeout` with canned responses
- `place/8888` and `place/9999` simulate already-submitted branches
- `강남고시원 / 서초고시원 / 마포원룸` simulate taken keywords
- Photos in the OG card are a CSS gradient placeholder — the real product pulls from gobang.kr/uceo.kr

## How to extend

To swap the mock backend for a real one, replace the `window.GobangAPI` shim in `data.js` with `fetch()` calls. Component contracts don't change.
