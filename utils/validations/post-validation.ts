import { z } from 'zod'

export const postSchema = z.object({
  title: z.string().min(7, 'Title should be at least 7 characters long'),
  slug: z.string().min(5, 'Slug should be at least 5 characters long'),
  content: z.string().min(25, 'Content should be at least 25 characters long'),
  summary: z.string().optional(),
  featured_image: z.string().url('Must be a valid URL').optional(),
  featured_image_description: z.string().optional(),
  featured_image_credit: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  tags: z.array(z.number().min(1)).min(1, 'At least one tag is required'),
  featured: z.boolean().optional(),
  language: z.enum(['en', 'de', 'fr']),
  relatedPosts: z.array(z.number()).optional()
})
