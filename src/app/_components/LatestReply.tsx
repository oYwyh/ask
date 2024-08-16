import { Button } from "@/components/ui/button";
import { TPost, TReplies, TReply, TUser } from "@/types/index.types";
import { MessageSquareText } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LatestReply({ replies, postId }: { replies?: TReplies, postId: TPost['id'] }) {
    const router = useRouter();

    const navigateToPost = () => {
        return router.push(`/posts/${postId}`);
    }

    return (
        <div className="flex flex-col gap-4 ">
            <Button
                onClick={() => navigateToPost()}
                className="flex flex-row gap-1 items-center w-fit bg-red-100 rounded-full py-1 px-2 h-fit text-sm text-red-400 hover:bg-red-200 hover:text-red-500"
                variant={'ghost'}
            >
                <MessageSquareText size={18} /> {replies && replies.length > 0 ? replies.length : 0} Replies
            </Button>
            <div className="flex flex-col gap-1 py-2 px-4 shadow-xl border border-gray-300 rounded-lg">
                <p className="text-sm text-gray-500">Latest Reply</p>
                <p className="text-md capitalize">{replies && replies.length > 0 ? replies[0].reply.content : 'None'}</p>
            </div>
        </div>
    )
}