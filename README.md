# GEO Research Lab — Cloudflare 기반 SEO·GEO 연구 블로그

**Astro + Cloudflare Workers Static Assets** 기반으로 구축된 생성형 엔진 최적화(GEO) 및 검색 아키텍처 연구 블로그입니다.

## 주요 SEO · GEO 아키텍처

- **Cloudflare 엣지 콘텐츠 협상 (`src/worker.ts`):** `Accept: text/markdown` 헤더로 요청하는 AI 에이전트에게 정적 `.md` 원문을 반환하고 `Content-Signal` 및 `Vary: Accept` 헤더를 부여합니다.
- **AI 디스커버리 표준 엔드포인트:**
  - `/llms.txt`: 카테고리별 연구 노트 인덱스
  - `/llms-full.txt`: 전체 연구 코퍼스 통합 Markdown
  - `/posts/<slug>.md`: 개별 글의 정적 Markdown 원문
- **구조화 데이터 (JSON-LD):** `ScholarlyArticle`(논문), `Review`/`Book`(도서), `TechArticle`(연구 단상), `FAQPage`, `BreadcrumbList`, `Person` 스키마 자동 생성
- **검색엔진 & AI 크롤러 환영 (`robots.txt`, `sitemap-index.xml`, `rss.xml`):** Googlebot, Yeti(Naver), bingbot, OAI-SearchBot, GPTBot, ClaudeBot, PerplexityBot 등 명시적 허용

## 로컬 실행

```bash
# Astro 개발 서버
npm run dev

# 프로덕션 빌드
npm run build

# Cloudflare Workers 엣지 환경 로컬 프리뷰
npm run preview:cf
```

## 새 글 작성 방법

`src/content/posts/` 폴더에 `.md` 또는 `.mdx` 파일을 추가합니다.

```yaml
---
title: "문서 제목"
description: "검색 결과 및 메타 설명 (120~160자 권장)"
category: "paper" # paper | book | insight
publishedAt: "2026-11-15"
tags: ["GEO", "RAG"]
tldr: "핵심 결론 1~2문장"
keyTakeaways:
  - "인용 가능한 핵심 명제 1"
  - "인용 가능한 핵심 명제 2"
source: # 선택사항 (논문/도서 리뷰 시)
  title: "원문 제목"
  authors: ["Author 1", "Author 2"]
  year: 2024
  venueOrPublisher: "학회 또는 출판사"
  url: "https://arxiv.org/abs/..."
faq: # 선택사항 (FAQPage JSON-LD 자동 생성)
  - question: "자주 묻는 질문?"
    answer: "명확하고 간결한 답변."
---
```

## Cloudflare 배포 및 커스텀 도메인 연결

1. [src/config/site.ts](src/config/site.ts) 및 [astro.config.mjs](astro.config.mjs)의 도메인(`https://geo-research.example.com`)을 실제 도메인으로 변경합니다(또는 빌드 시 `SITE_URL=https://your-domain.com` 환경변수 설정).
2. Cloudflare 인증 후 배포합니다:
   ```bash
   npx wrangler login
   npm run deploy
   ```
3. 배포 후 **Google Search Console**, **네이버 서치어드바이저**, **Bing Webmaster Tools**에 `/sitemap-index.xml`과 `/rss.xml`을 제출하세요.
