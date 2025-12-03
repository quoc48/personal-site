import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date(),
    thumbnail: z.string(),
    tags: z.array(z.string()).optional(),
    featured: z.boolean().default(false),
    // Future: video and image slider support
    video: z.string().optional(),
    beforeAfterImages: z.object({
      before: z.string(),
      after: z.string(),
    }).optional(),
  }),
});

export const collections = {
  projects,
};
