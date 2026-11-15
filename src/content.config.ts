import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const sourceSchema = z
  .object({
    title: z.string(),
    authors: z.array(z.string()).min(1),
    year: z.number().int(),
    venueOrPublisher: z.string().optional(),
    url: z.string().url().optional(),
    doi: z.string().optional(),
    isbn: z.string().optional(),
  })
  .optional();

const faqItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
});

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['paper', 'book', 'research', 'AI']),
    publishedAt: z.coerce.date(),
    updatedAt: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    tldr: z.string().optional(),
    keyTakeaways: z.array(z.string()).default([]),
    faq: z.array(faqItemSchema).default([]),
    source: sourceSchema,
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts };
