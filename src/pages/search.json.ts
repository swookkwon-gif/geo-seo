import type { APIRoute } from 'astro';
import { getPublishedPosts } from '../utils/posts';

export const GET: APIRoute = async () => {
  const posts = await getPublishedPosts();
  const payload = posts.map((post) => ({
    slug: post.id,
    title: post.data.title,
    description: post.data.description,
    tldr: post.data.tldr || '',
    category: post.data.category,
    tags: post.data.tags,
    publishedAt: post.data.publishedAt.toISOString(),
  }));

  return new Response(JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
};
