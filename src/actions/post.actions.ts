'use server'

import { validateRequest } from "@/lib/auth"
import db from "@/lib/db/drizzle"
import { postTable } from "@/lib/db/schema"
import { TPostSchema } from "@/types/post.types"
import { redirect } from "next/navigation"

export async function post(data: TPostSchema & { images?: string[] }) {

    const { user } = await validateRequest()

    if (!user) return redirect('/')

    const postValues: TPostSchema & { userId: string, images?: string } = {
        content: data.content,
        userId: user.id
    }

    if (data.images) {
        postValues.images = data.images.join(',')
    }

    // TODO: Implement
    await db.insert(postTable).values(postValues)

    return {
        success: true
    };
}