import { getCollection, type CollectionEntry } from 'astro:content';
import { SITE } from '../config/site';

export type PostEntry = CollectionEntry<'posts'>;

export async function getPublishedPosts(): Promise<PostEntry[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort(
    (a, b) => b.data.publishedAt.valueOf() - a.data.publishedAt.valueOf()
  );
}

export function formatDateKo(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function estimateReadingMinutes(body: string | undefined): number {
  if (!body) return 1;
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_`>\[\]()]/g, ' ');
  const charCount = plain.replace(/\s+/g, '').length;
  // 한국어 + 영문 혼합 기술 문서 평균 읽기 속도 약 500자/분 기준
  return Math.max(1, Math.ceil(charCount / 500));
}

export function stripMdxImports(body: string | undefined): string {
  if (!body) return '';
  return body
    .replace(/^import\s.+?from\s+['"].+?['"];?\s*$/gm, '')
    .trim();
}

export function buildPostMarkdown(post: PostEntry, siteUrl: string): string {
  const { data } = post;
  const categoryLabel = SITE.categories[data.category].label;
  const canonicalUrl = new URL(`/posts/${post.id}/`, siteUrl).toString();
  const lines: string[] = [
    `# ${data.title}`,
    '',
    `- **URL**: ${canonicalUrl}`,
    `- **Category**: ${categoryLabel} (${data.category})`,
    `- **Published**: ${data.publishedAt.toISOString().split('T')[0]}`,
  ];

  if (data.updatedAt) {
    lines.push(`- **Updated**: ${data.updatedAt.toISOString().split('T')[0]}`);
  }
  if (data.tags.length > 0) {
    lines.push(`- **Tags**: ${data.tags.join(', ')}`);
  }

  lines.push('', `> ${data.description}`);

  if (data.tldr) {
    lines.push('', '## TL;DR', '', data.tldr);
  }

  if (data.keyTakeaways.length > 0) {
    lines.push('', '## Key Takeaways', '');
    for (const item of data.keyTakeaways) {
      lines.push(`- ${item}`);
    }
  }

  if (data.source) {
    const s = data.source;
    lines.push('', '## Primary Source', '');
    lines.push(`- **Title**: ${s.title}`);
    lines.push(`- **Authors**: ${s.authors.join(', ')}`);
    lines.push(`- **Year**: ${s.year}`);
    if (s.venueOrPublisher) lines.push(`- **Venue / Publisher**: ${s.venueOrPublisher}`);
    if (s.doi) lines.push(`- **DOI**: ${s.doi}`);
    if (s.isbn) lines.push(`- **ISBN**: ${s.isbn}`);
    if (s.url) lines.push(`- **Link**: ${s.url}`);
  }

  lines.push('', '---', '', stripMdxImports(post.body));

  if (data.faq.length > 0) {
    lines.push('', '## FAQ', '');
    for (const item of data.faq) {
      lines.push(`### ${item.question}`, '', item.answer, '');
    }
  }

  return lines.join('\n').trim() + '\n';
}
