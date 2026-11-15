import { SITE } from '../config/site';
import type { PostEntry } from './posts';

export function buildWebSiteJsonLd(siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.title,
    description: SITE.description,
    url: siteUrl,
    inLanguage: SITE.lang,
    author: buildPersonJsonLd(siteUrl),
  };
}

export function buildPersonJsonLd(siteUrl: string) {
  const person: Record<string, unknown> = {
    '@type': 'Person',
    name: SITE.author.name,
    jobTitle: SITE.author.role,
    description: SITE.author.bio,
    url: new URL(SITE.author.url, siteUrl).toString(),
  };
  if (SITE.author.sameAs.length > 0) {
    person.sameAs = SITE.author.sameAs;
  }
  return person;
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
  siteUrl: string
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: item.name,
      item: new URL(item.url, siteUrl).toString(),
    })),
  };
}

export function buildPostJsonLd(post: PostEntry, siteUrl: string) {
  const { data } = post;
  const postUrl = new URL(`/posts/${post.id}/`, siteUrl).toString();
  const categoryLabel = SITE.categories[data.category].label;
  const author = buildPersonJsonLd(siteUrl);

  const schemas: Record<string, unknown>[] = [];

  const baseArticle: Record<string, unknown> = {
    '@context': 'https://schema.org',
    headline: data.title,
    description: data.tldr || data.description,
    url: postUrl,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
    inLanguage: SITE.lang,
    datePublished: data.publishedAt.toISOString(),
    dateModified: (data.updatedAt || data.publishedAt).toISOString(),
    author,
    publisher: author,
    keywords: data.tags.join(', '),
    articleSection: categoryLabel,
  };

  if (data.category === 'paper') {
    baseArticle['@type'] = 'ScholarlyArticle';
    if (data.source) {
      baseArticle.citation = {
        '@type': 'ScholarlyArticle',
        name: data.source.title,
        author: data.source.authors.map((name) => ({ '@type': 'Person', name })),
        datePublished: String(data.source.year),
        ...(data.source.url ? { url: data.source.url } : {}),
        ...(data.source.doi ? { identifier: data.source.doi } : {}),
        ...(data.source.venueOrPublisher
          ? { isPartOf: { '@type': 'PublicationEvent', name: data.source.venueOrPublisher } }
          : {}),
      };
    }
  } else if (data.category === 'book' && data.source) {
    baseArticle['@type'] = 'Review';
    baseArticle.itemReviewed = {
      '@type': 'Book',
      name: data.source.title,
      author: data.source.authors.map((name) => ({ '@type': 'Person', name })),
      datePublished: String(data.source.year),
      ...(data.source.isbn ? { isbn: data.source.isbn } : {}),
      ...(data.source.url ? { url: data.source.url } : {}),
      ...(data.source.venueOrPublisher
        ? { publisher: { '@type': 'Organization', name: data.source.venueOrPublisher } }
        : {}),
    };
  } else {
    baseArticle['@type'] = 'TechArticle';
  }

  schemas.push(baseArticle);

  schemas.push(
    buildBreadcrumbJsonLd(
      [
        { name: '홈', url: '/' },
        { name: categoryLabel, url: `/category/${data.category}/` },
        { name: data.title, url: `/posts/${post.id}/` },
      ],
      siteUrl
    )
  );

  if (data.faq.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: data.faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
  }

  return schemas;
}
