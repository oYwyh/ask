'use client'

import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import { TPost, TReplies, TReply, TTables, TUser } from "@/types/index.types";
import Image from "next/image";
import LatestReply from "@/app/_components/LatestReply";
import Actions from "@/app/_components/Actions";
import { useQuery } from "@tanstack/react-query";

export default function CardContent({ user, context, table, replies }: { user: TUser, context: TPost | TReply, table: TTables, replies?: TReplies }) {
    const [open, setOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = context.images ? context.images.split(',') : [];
    const date = typeof context.createdAt === 'string' ? new Date(context.createdAt) : context.createdAt;

    // Format the date
    const createdAt = new Intl.DateTimeFormat('en-US', {
        day: 'numeric',
        month: 'long',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
    }).format(date);

    const { data: currentUser } = useQuery({
        queryKey: ['user'],
        queryFn: () => fetch('/api/user').then(res => res.json()),
    })

    if (!currentUser) return <p>Loading...</p>


    return (
        <>
            <div className="flex justify-between w-full">
                <div className="flex flex-row gap-3 items-center">
                    <div>
                        <Image
                            src="/pfp.png"
                            width={30}
                            height={30}
                            alt="pfp"
                        />
                    </div>
                    <div className="flex flex-col gap-1/2">
                        <p className="text-sm font-bold">{user.firstname} {user.lastname}</p>
                        <p className="text-xs text-gray-500 font-medium">{createdAt as string}</p>
                    </div>
                </div>
                {currentUser.id == user.id && (
                    <Actions id={context.id} table={table} />
                )}
            </div>
            <div className="flex flex-col gap-2">
                <p className="text-md">{context.content}</p>
                <div className="flex flex-row gap-2">
                    {images.map((image, index) => (
                        <Image
                            key={index}
                            src={`${process.env.NEXT_PUBLIC_R2_FILES_URL}/${image}`}
                            width={200}
                            height={200}
                            alt="image"
                            className="shadow rounded-lg cursor-pointer"
                            onClick={() => {
                                setCurrentIndex(index);
                                setOpen(true);
                            }}
                        />
                    ))}
                </div>
            </div>
            <Lightbox
                open={open}
                close={() => setOpen(false)}
                counter={{ container: { style: { top: "unset", bottom: 0 } } }}
                slides={images.map(image => ({
                    src: `${process.env.NEXT_PUBLIC_R2_FILES_URL}/${image}`,
                    alt: "image"
                }))}
                plugins={[Zoom, Counter, Fullscreen]}
                index={currentIndex}
            />
        </>
    )
}