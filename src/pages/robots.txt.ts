import type { APIRoute } from 'astro';
import { SITE } from '../config/site';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || SITE.url;
  const sitemapUrl = new URL('/sitemap-index.xml', siteUrl).toString();
  const llmsUrl = new URL('/llms.txt', siteUrl).toString();

  const content = [
    '# Traditional Search Engines & AI Search / Answer Crawlers Welcome',
    'User-agent: *',
    'Allow: /',
    '',
    '# Major Search Engines (Google, Naver, Bing, Daum)',
    'User-agent: Googlebot',
    'Allow: /',
    'User-agent: Yeti',
    'Allow: /',
    'User-agent: bingbot',
    'Allow: /',
    'User-agent: Daumoa',
    'Allow: /',
    '',
    '# AI Search & Generative Engine Crawlers',
    'User-agent: OAI-SearchBot',
    'Allow: /',
    'User-agent: ChatGPT-User',
    'Allow: /',
    'User-agent: GPTBot',
    'Allow: /',
    'User-agent: ClaudeBot',
    'Allow: /',
    'User-agent: Claude-SearchBot',
    'Allow: /',
    'User-agent: PerplexityBot',
    'Allow: /',
    'User-agent: Google-Extended',
    'Allow: /',
    'User-agent: Applebot-Extended',
    'Allow: /',
    '',
    `Sitemap: ${sitemapUrl}`,
    `# LLMs Index: ${llmsUrl}`,
    '',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
