'use client'

import PostCard from "@/app/_components/PostCard";
import ReplyCard from "@/app/_components/ReplyCard";
import ReplyForm from "@/app/_components/ReplyForm";
import { TPost } from "@/types/index.types";
import { useQuery } from "@tanstack/react-query";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function PostPage({ params: { postId } }: { params: { postId: TPost['id'] } }) {

    const { data, isLoading } = useQuery({
        queryKey: ['post', postId],
        queryFn: async () => {
            const response = await fetch(`/api/post?postId=${postId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        }
    })


    if (isLoading) return <p>Loading...</p>;

    if (!data.post) {
        redirect('/posts/timeline')
        return;
    }

    return (
        <div className="flex flex-col gap-3 p-5">
            <PostCard user={data.post.user} post={data.post.post} replies={data.replies} />
            <div className="flex flex-col gap-2">
                <p className="text-xl font-bold">Replies</p>
                <div className="flex flex-col gap-5">
                    <ReplyForm postId={postId} />
                    {data.replies && data.replies.length > 0 && (
                        <>
                            {data.replies.map((reply: any) => {
                                return (
                                    <ReplyCard key={reply.id} user={reply.user} reply={reply.reply} />
                                )
                            })}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}