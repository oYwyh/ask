'use client'

import PostCard from "@/app/_components/PostCard";
import Posts from "@/app/_components/Posts";
import { Button } from "@/components/ui/button";
import { TPost, TPostStatuses, TUser } from "@/types/index.types";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Image from "next/image"
import { useEffect, useState } from "react";

export default function StudentProfile() {
    const [status, setStatus] = useState<TPostStatuses>('all');

    const { data: user } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetch('/api/user').then(res => res.json())
    })

    const queryClient = useQueryClient()

    useEffect(() => {
        queryClient.invalidateQueries({ queryKey: ['posts'] })
    }, [status])

    return (
        <div className="flex flex-row gap-10 py-5 px-10">
            <div>
                <Image
                    src="/pfp.png"
                    width={50}
                    height={50}
                    alt="pfp"
                />
            </div>
            <div className="flex flex-col gap-8 w-full">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col-gap-1">
                        <p>{user?.firstname} {user?.lastname}</p>
                    </div>
                    <div className="flex flex-row gap-2">
                        <Button
                            variant={'outline'}
                            className="border border-black text-black bg-transparent rounded-full text-xs py-1 px-2 h-fit"
                            onClick={() => setStatus('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={'outline'}
                            className="border border-green-400 text-green-400 bg-transparent rounded-full text-xs py-1 px-2 h-fit"
                            onClick={() => setStatus('approved')}
                        >
                            Approved
                        </Button>
                        <Button
                            variant={'outline'}
                            className="border border-blue-400 text-blue-400 bg-transparent rounded-full text-xs py-1 px-2 h-fit"
                            onClick={() => setStatus('pending')}
                        >
                            Pending
                        </Button>
                        <Button
                            variant={'outline'}
                            className="border border-red-400 text-red-400 bg-transparent rounded-full text-xs py-1 px-2 h-fit"
                            onClick={() => setStatus('rejected')}
                        >
                            Rejected
                        </Button>
                    </div>
                </div>
                <Posts type={'question'} userId={user?.id} status={status} />
            </div>
        </div >
    )
}