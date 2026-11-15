import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { buildPostMarkdown, getPublishedPosts } from '../utils/posts';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || SITE.url;
  const posts = await getPublishedPosts();

  const header = [
    `# ${SITE.title} — Full Research Corpus`,
    '',
    `> ${SITE.description}`,
    '',
    `Generated: ${new Date().toISOString()}`,
    `Total Articles: ${posts.length}`,
    '',
    '================================================================================',
    '',
  ].join('\n');

  const body = posts
    .map((post) => buildPostMarkdown(post, siteUrl))
    .join('\n================================================================================\n\n');

  return new Response(header + body, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
