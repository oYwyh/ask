'use client'

import PostCard from "@/app/_components/PostCard";
import { TPost, TPostStatuses, TPostTypes, TUser } from "@/types/index.types";
import { useInfiniteQuery, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react";
import { useInView } from 'react-intersection-observer';

export default function Posts({ type, userId, status }: { type: TPostTypes, userId?: TUser['id'], status?: TPostStatuses }) {
    const queryClient = useQueryClient()

    const fetchPosts = async ({ pageParam = 1 }) => {
        const response = await fetch(`/api/posts?type=${type}&userId=${userId}&status=${status}&pageParam=${pageParam}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    };

    const {
        data: posts,
        isLoading: isPostsLoading,
        fetchNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['posts'],
        queryFn: fetchPosts,
        initialPageParam: 0,
        getNextPageParam: (lastPage) => lastPage.nextPage,
    })

    const { ref, inView } = useInView();

    useEffect(() => {
        if (inView) {
            fetchNextPage();
        }
    }, [inView]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                {isPostsLoading ? (
                    <>
                        Loading
                    </>
                ) : (
                    <>
                        {posts?.pages.map((page: any) => {
                            return (
                                <>
                                    {
                                        page.data.map(({ post, user }: { post: TPost, user: TUser }) => {
                                            return (
                                                <PostCard user={user} post={post} />
                                            )
                                        })
                                    }
                                </>
                            )
                        })}
                    </>
                )}
            </div>
            <div ref={ref}>{isFetchingNextPage && 'Loading...'}</div>
        </div>
    )
}