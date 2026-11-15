import type { APIRoute, GetStaticPaths } from 'astro';
import { SITE } from '../../config/site';
import { buildPostMarkdown, getPublishedPosts, type PostEntry } from '../../utils/posts';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getPublishedPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

export const GET: APIRoute = async ({ props, site }) => {
  const { post } = props as { post: PostEntry };
  const siteUrl = site?.toString() || SITE.url;
  const markdown = buildPostMarkdown(post, siteUrl);

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
};
