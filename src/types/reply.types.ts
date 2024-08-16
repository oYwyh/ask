import { z } from "zod";

export const replySchema = z.object({
    content: z.string().min(1, 'Content is required').max(255, 'Content is too long'),
})

export type TReplySchema = z.infer<typeof replySchema>