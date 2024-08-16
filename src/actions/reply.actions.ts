'use server'

import { validateRequest } from "@/lib/auth"
import db from "@/lib/db/drizzle"
import { replyTable } from "@/lib/db/schema"
import { TPost, TReply, TUser } from "@/types/index.types"
import { TPostSchema } from "@/types/post.types"
import { TReplySchema } from "@/types/reply.types"
import { redirect } from "next/navigation"

export async function reply(data: TReplySchema & { images?: string[] }, postId: TPost['id']) {

    const { user } = await validateRequest()

    if (!user) return redirect('/')

    const replyValues: TReplySchema & { userId: TUser['id'], postId: TPost['id'], images?: string } = {
        content: data.content,
        userId: user.id,
        postId: postId
    }

    if (data.images) {
        replyValues.images = data.images.join(',')
    }

    // TODO: Implement
    await db.insert(replyTable).values(replyValues)

    return {
        success: true
    };
}