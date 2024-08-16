'use client'

import { TPost, TReplies, TReply, TUser } from "@/types/index.types";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Counter from "yet-another-react-lightbox/plugins/counter";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/counter.css";
import Replies from "@/app/_components/Replies";
import { Button } from "@/components/ui/button";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";
import CardContent from "@/app/_components/CardContent";
import LatestReply from "@/app/_components/LatestReply";

export default function PostCard({ user, post, replies }: { user: TUser, post: TPost, replies: TReplies }) {
    return (
        <div className="flex flex-col gap-2 bg-[#F8F9FA] shadow-2xl p-3 rounded-xl w-full">
            <CardContent user={user} context={post} table="post" replies={replies} />
            <div className="mt-5">
                <LatestReply replies={replies} postId={post.id} />
            </div>
        </div>
    )
}