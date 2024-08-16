import { z } from "zod";

export const postSchema = z.object({
    content: z.string().min(1, 'Content is required').max(255, 'Content is too long'),
})

export type TPostSchema = z.infer<typeof postSchema>