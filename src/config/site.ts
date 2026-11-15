export const SITE = {
  title: 'geo-seo',
  subtitle: 'Generative Engine Optimization · 논문 · 도서 · 아키텍처 노트',
  description:
    '생성형 AI 검색(GEO)과 차세대 검색 최적화(SEO)에 관한 학술 논문, 핵심 도서, 그리고 실무 연구 노트를 기록하는 아카이브입니다.',
  url: import.meta.env.SITE_URL || 'https://geo-seo.swookkwon.workers.dev',
  lang: 'ko-KR',
  locale: 'ko_KR',
  author: {
    name: 'Wook',
    role: 'GEO & Search Architecture Researcher',
    bio: '생성형 AI 검색엔진의 인용 메커니즘, 시맨틱 웹 아키텍처, Cloudflare 엣지 기반 콘텐츠 최적화(GEO/SEO)를 연구합니다.',
    url: '/about',
    sameAs: [
      // 추후 GitHub, X(Twitter), LinkedIn, Google Scholar URL을 추가하세요.
    ] as string[],
  },
  // Cloudflare Web Analytics 토큰이 있다면 여기에 입력 (선택사항)
  cloudflareAnalyticsToken: '',
  categories: {
    paper: {
      label: '논문 리뷰',
      description: 'GEO, RAG, 정보검색(IR) 관련 학술 논문의 핵심 가설, 실험 설계, 인용 전략 분석',
    },
    book: {
      label: '도서 노트',
      description: '검색, AI, 지식 그래프, 콘텐츠 전략 관련 도서의 핵심 통찰과 실무 적용점',
    },
    insight: {
      label: '연구 단상',
      description: 'Cloudflare 엣지 아키텍처, 크롤러 거버넌스, 실전 GEO/SEO 실험 기록',
    },
  },
} as const;

export type CategoryKey = keyof typeof SITE.categories;
