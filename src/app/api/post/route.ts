
import db from '@/lib/db/drizzle';
import { postTable, replyTable, userTable } from '@/lib/db/schema';
import { TPostTypes, TPostStatuses, TPost } from '@/types/index.types';
import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

async function fetchPost(postId: TPost['id']) {

    const [post] = await db.select().from(postTable).where(eq(postTable.id, postId))
        .leftJoin(userTable, eq(postTable.userId, userTable.id))

    const replies = await db.select().from(replyTable).where(eq(replyTable.postId, postId))
        .leftJoin(userTable, eq(replyTable.userId, userTable.id))

    return {
        post, replies
    }
}



export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const postId = searchParams.get('postId');

        if (!postId) throw new Error('No postId provided');

        const res = await fetchPost(Number(postId));

        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.error();
    }
}
