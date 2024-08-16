
import db from '@/lib/db/drizzle';
import { postTable, replyTable, userTable } from '@/lib/db/schema';
import { TPostTypes, TPostStatuses } from '@/types/index.types';
import { and, eq, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { sql } from 'drizzle-orm';

async function fetchPosts(type: TPostTypes, status: TPostStatuses, pageParam: number, userId?: string) {
    const LIMIT = 2;
    const OFFSET = (pageParam - 1) * Number(LIMIT);

    const whereClauses = [
        eq(postTable.type, type)
    ];

    if (status !== 'all') {
        whereClauses.push(eq(postTable.status, status));
    }
    if (userId && userId !== 'undefined') {
        whereClauses.push(eq(postTable.userId, userId));
    }
    // Fetch posts first
    const posts = await db.select({
        post: postTable,
        user: userTable,
    })
        .from(postTable)
        .where(and(...whereClauses))
        .leftJoin(userTable, eq(postTable.userId, userTable.id))

    if (!posts || posts.length === 0) {
        throw new Error("No posts found");
    }

    // Fetch replies along with the users who wrote them
    const postIds = posts.map((post) => post.post.id);
    const conditions = postIds.map(id => eq(replyTable.postId, id));
    const replies = await db.select({
        reply: replyTable,
        user: userTable
    })
        .from(replyTable)
        .leftJoin(userTable, eq(replyTable.userId, userTable.id))
        .where(or(...conditions));

    // Group replies by postId
    const repliesByPostId = replies.reduce((acc: any, { reply, user }) => {
        acc[reply.postId] = acc[reply.postId] || [];
        acc[reply.postId].push({ reply, user });
        return acc;
    }, {});

    // Attach replies to corresponding posts
    const postsWithReplies = posts.map(post => ({
        ...post,
        replies: repliesByPostId[post.post.id] || []
    }));

    return {
        data: postsWithReplies,
        currentPage: pageParam,
        nextPage: OFFSET + LIMIT < posts.length ? Number(pageParam) + 1 : null,
    };
}



export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') as TPostStatuses || 'all';
        const pageParam = searchParams.get('pageParam') || 1;
        const type = searchParams.get('type') as TPostTypes;
        const userId = searchParams.get('userId') || undefined;

        const posts = await fetchPosts(type, status, Number(pageParam), userId);

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.error();
    }
}
