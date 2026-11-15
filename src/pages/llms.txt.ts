import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getPublishedPosts } from '../utils/posts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || SITE.url;
  const posts = await getPublishedPosts();

  const grouped = {
    paper: posts.filter((p) => p.data.category === 'paper'),
    book: posts.filter((p) => p.data.category === 'book'),
    insight: posts.filter((p) => p.data.category === 'insight'),
  };

  const lines: string[] = [
    `# ${SITE.title}`,
    '',
    `> ${SITE.description}`,
    '',
    `이 사이트는 ${SITE.author.name}이(가) 운영하는 생성형 엔진 최적화(GEO) 및 검색 아키텍처 연구 블로그입니다. 모든 글은 HTML과 함께 정적 Markdown(\`.md\`)으로도 제공됩니다.`,
    '',
    `- 전체 코퍼스 (Full Corpus): ${new URL('/llms-full.txt', siteUrl).toString()}`,
    `- 사이트맵 (Sitemap): ${new URL('/sitemap-index.xml', siteUrl).toString()}`,
    `- RSS 피드: ${new URL('/rss.xml', siteUrl).toString()}`,
    '',
  ];

  (Object.keys(grouped) as Array<keyof typeof grouped>).forEach((cat) => {
    const items = grouped[cat];
    if (items.length === 0) return;
    const catInfo = SITE.categories[cat];
    lines.push(`## ${catInfo.label} (${cat})`, '', catInfo.description, '');
    for (const post of items) {
      const mdUrl = new URL(`/posts/${post.id}.md`, siteUrl).toString();
      const summary = post.data.tldr || post.data.description;
      lines.push(`- [${post.data.title}](${mdUrl}): ${summary}`);
    }
    lines.push('');
  });

  return new Response(lines.join('\n').trim() + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
