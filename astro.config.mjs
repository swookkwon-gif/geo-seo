// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// 커스텀 도메인 연결 시 아래 site URL을 실제 도메인으로 변경하거나 SITE_URL 환경변수를 사용하세요.
const siteUrl = process.env.SITE_URL || 'https://geo-research.example.com';

export default defineConfig({
  site: siteUrl,
  output: 'static',
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404'),
    }),
  ],
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
