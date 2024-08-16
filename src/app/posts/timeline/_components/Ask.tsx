import AskDialog from "@/app/posts/timeline/_components/AskDialog";
import Image from "next/image";

export default function Ask() {
    return (
        <div className="bg-white rounded-lg border border-gray-400 w-full flex flex-row gap-2 p-[1rem]">
            <AskDialog />
            <Image
                src="/pfp.png"
                width={40}
                height={40}
                alt="pfp"
            />
        </div>
    )
}