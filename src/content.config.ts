import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const therapies = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/therapies' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string(),
    durationMinutes: z.number(),
    price: z.number().nullable().optional(),
    icon: z.string(),
    image: image(),
    isActive: z.boolean(),
    orderIndex: z.number(),
  }),
});

const products = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/products' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    description: z.string(),
    price: z.number(),
    image: image().optional(),
    category: z.string(),
    isAvailable: z.boolean(),
    orderIndex: z.number(),
    mercadolibreUrl: z.string().nullable().optional(),
  }),
});

const therapists = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/therapists' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    title: z.string(),
    specialty: z.string(),
    bio: z.string(),
    image: image().optional(),
    isActive: z.boolean(),
    orderIndex: z.number(),
  }),
});

const testimonials = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/testimonials' }),
  schema: ({ image }) => z.object({
    name: z.string(),
    text: z.string(),
    rating: z.number(),
    therapy: z.string(),
    isVisible: z.boolean(),
  }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: '*.mdoc', base: './src/content/blogPosts' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    excerpt: z.string(),
    image: image(),
    author: z.string(),
    publishedAt: z.coerce.date(),
    isPublished: z.boolean(),
  }),
});

export const collections = {
  therapies,
  products,
  therapists,
  testimonials,
  blogPosts,
};
