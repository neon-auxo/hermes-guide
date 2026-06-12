# 헤르메스 쉽게 따라하기 — 설계 문서

**날짜:** 2026-06-12  
**상태:** 승인됨

---

## 1. 목적 및 대상

- **목적:** 헤르메스(Hermes by Nous Research) 설치 및 사용법을 완전 초보자도 따라할 수 있는 한국어 가이드 사이트 제공
- **대상:** iOS(macOS) 사용자 기본, Windows 사용자를 위한 코멘트 병행
- **운영 방식:** 공개 열람, 인증 없음, 콘텐츠 지속 업데이트 예정

---

## 2. 기술 스택

| 항목 | 선택 | 이유 |
|------|------|------|
| 프레임워크 | Next.js 16 (App Router) | OpenClaw 참조 소스와 동일, SSG 정적 생성 |
| 스타일링 | Tailwind CSS v4 | OpenClaw와 동일 |
| 콘텐츠 | MDX + next-mdx-remote | 파일 하나 = 페이지 하나, 유지보수 쉬움 |
| UI 컴포넌트 | shadcn/ui | OpenClaw 소스 재사용 가능 |
| 코드 하이라이팅 | shiki + rehype-pretty-code | 터미널 명령어 가독성 |
| 테마 | next-themes | 다크/라이트/시스템 3가지 모드 |
| 배포 | Vercel | 정적 사이트 최적, 무료 티어 가능 |
| 언어 | TypeScript | |
| 인증 | 없음 | 공개 열람 |
| DB | 없음 | MDX 파일 기반 정적 콘텐츠 |

---

## 3. 레이아웃 구조

**A. 사이드바 + 본문 (docs 스타일)**

```
[상단 헤더]  🪬 헤르메스 가이드          [☀️🌙💻 테마 토글]
─────────────────────────────────────────────────────
[좌측 사이드바 고정]    |  [우측 본문 스크롤]
                        |
  시작하기              |  # 헤르메스란?
  ├─ 헤르메스란?  ◀     |
  ├─ 다른 도구 비교      |  본문 MDX 콘텐츠...
  └─ 개념 소개          |
                        |  <TerminalBlock>
  사전 준비             |  $ curl -fsSL ...
  ├─ Slack 설정         |  </TerminalBlock>
  ├─ API 키 발급        |
  └─ 유의사항           |  ← 이전    다음 →
                        |
  설치하기
  ├─ curl 설치 & CLI
  ├─ 온보딩 & Slack 연결
  └─ 모델 설정

  GUI 설치
```

- 모바일: 사이드바 드로어로 전환
- 현재 페이지 사이드바에서 하이라이트

---

## 4. 사이트 페이지 구성 (v1 범위)

### 홈 `/`
- 히어로 섹션: 제목, 한 줄 소개, "시작하기" 버튼
- 챕터 카드 그리드: 각 주요 섹션으로 바로가기

### `/guide/what-is-hermes`
헤르메스란 무엇인지 — Nous Research가 만든 AI 에이전트 프레임워크 개요

### `/guide/comparison`
헤르메스 vs OpenClaw vs Claude Code vs ChatGPT — 목적과 차이 비교표 포함

### `/guide/concepts`
간략한 구성 요소 및 핵심 개념 (Agent, Tool, MCP, Skill 등)

### `/guide/prerequisites/` (그룹 헤더 — 페이지 없음)

#### `/guide/prerequisites/slack-setup`
Slack 워크스페이스 생성, 앱 생성, Bot Token 발급 방법 (스크린샷 설명 포함)

#### `/guide/prerequisites/api-keys`
상용 LLM API 키 발급: Anthropic(Claude), OpenAI(GPT) — 발급 위치, 관리 방법, 비용 주의사항

#### `/guide/prerequisites/cautions`
설치 전 유의사항: API 키 노출 방지, 비용 관리, macOS 보안 설정

### `/guide/install/` (그룹 헤더 — 페이지 없음)

#### `/guide/install/curl`
curl 명령어로 헤르메스 CLI 설치, 실행 확인

#### `/guide/install/onboarding`
`hermes onboarding` 실행, Slack 워크스페이스 연결 절차

#### `/guide/install/model-setup`
사용할 LLM 모델 선택 및 API 키 입력 방법

### `/guide/gui`
헤르메스 GUI(웹 인터페이스) 설치 및 접속 방법

---

## 5. MDX 커스텀 컴포넌트

| 컴포넌트 | 용도 |
|----------|------|
| `<Callout type="info">` | 일반 정보 강조 (파란 박스) |
| `<Callout type="warning">` | 주의/경고 (노란 박스) |
| `<Callout type="tip">` | 팁 (초록 박스) |
| `<TerminalBlock title="...">` | 코드 블록 + 복사 버튼 + 제목 |
| `<WindowsNote>` | 윈도우 사용자 전용 코멘트 박스 |
| `<StepList>` | 번호 있는 절차 단계 목록 |

---

## 6. 콘텐츠 파일 구조

```
content/
└── guide/
    ├── what-is-hermes.mdx
    ├── comparison.mdx
    ├── concepts.mdx
    ├── prerequisites/
    │   ├── slack-setup.mdx
    │   ├── api-keys.mdx
    │   └── cautions.mdx
    └── install/
        ├── curl.mdx
        ├── onboarding.mdx
        ├── model-setup.mdx
        └── gui.mdx
```

**frontmatter 규칙:**
```yaml
---
title: "헤르메스란?"
description: "Nous Research의 AI 에이전트 프레임워크"
order: 1
group: "시작하기"
---
```

---

## 7. 디자인 방향

- **컬러 테마:** 다크 퍼플 기본 (보라+남색 계열), 라이트 모드 지원
- **테마 토글:** 다크 / 라이트 / 시스템 3가지 전환
- **코드 블록:** 다크 배경, 보라/파랑 구문 강조
- **특수 박스:** Callout, WindowsNote 구분 색상으로 시각적 분리

---

## 8. 범위 밖 (v1 제외)

- 검색 기능
- 댓글/피드백
- 다국어(영어) 지원
- 로그인/인증
- 진도 추적
