import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { SITE } from '../config/site';
import { getPublishedPosts } from '../utils/posts';

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts();
  return rss({
    title: SITE.title,
    description: SITE.description,
    site: site?.toString() || SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishedAt,
      description: post.data.tldr || post.data.description,
      link: `/posts/${post.id}/`,
      categories: [SITE.categories[post.data.category].label, ...post.data.tags],
    })),
    customData: `<language>ko-kr</language>`,
  });
};
