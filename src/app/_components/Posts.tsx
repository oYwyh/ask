'use client'

import PostCard from "@/app/_components/PostCard";
import { TPost, TPostStatuses, TPostTypes, TReplies, TReply, TUser } from "@/types/index.types";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer';

export default function Posts({ type, userId, status }: { type: TPostTypes, userId?: TUser['id'], status?: TPostStatuses }) {

    const fetchPosts = async ({ pageParam = 1 }) => {
        const response = await fetch(`/api/posts?type=${type}&userId=${userId}&status=${status}&pageParam=${pageParam}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    };

    const { data: posts, isLoading: isPostsLoading } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => await fetchPosts({ pageParam: 1 }),
    })
    if (!posts) return;

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                {isPostsLoading ? (
                    <>
                        Loading
                    </>
                ) : (
                    <>
                        {posts?.data.map(({ post, replies, user }: { post: TPost, replies: TReplies, user: TUser }) => {
                            return (
                                <PostCard user={user} post={post} replies={replies} />
                            )
                        })}
                    </>
                )
                }
            </div>
        </div>
    )
}