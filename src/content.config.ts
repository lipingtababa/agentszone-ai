import { defineCollection, reference, z } from 'astro:content';
import { glob } from 'astro/loaders';

const authors = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: 'src/content/authors' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    website: z.string().url().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

const articles = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: 'src/content/articles' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(300),
    author: reference('authors'),
    date: z.coerce.date(),
    tags: z.array(z.string()).min(1).max(5),
    original_url: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const articlesEn = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: 'src/content/articles/en' }),
  schema: z.object({
    title: z.string().max(120),
    description: z.string().max(300),
    author: reference('authors'),
    date: z.coerce.date(),
    tags: z.array(z.string()).min(1).max(5),
    original_url: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

const authorsEn = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: 'src/content/authors/en' }),
  schema: z.object({
    name: z.string(),
    bio: z.string(),
    website: z.string().url().optional(),
    github: z.string().optional(),
    twitter: z.string().optional(),
    avatar: z.string().optional(),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '[^_]*.md', base: 'src/content/events' }),
  schema: z.object({
    number: z.number(),
    title: z.string().max(120),
    description: z.string().max(500),
    date: z.coerce.date(),
    speakers: z.array(z.string()).optional(),
    poster: z.string().optional(),
    tags: z.array(z.string()).min(1).max(5),
  }),
});

export const collections = { articles, articlesEn, authors, authorsEn, events };
