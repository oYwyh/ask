

import CardContent from "@/app/_components/CardContent";
import { TPost, TUser } from "@/types/index.types";
import Image from "next/image";

export default function ReplyCard({ user, reply }: { user: TUser, reply: TPost }) {
    return (
        <div className="flex flex-col gap-2 bg-[#F8F9FA] shadow-2xl p-3 rounded-xl w-full">
            <CardContent user={user} table="reply" context={reply} />

        </div>
    )
}