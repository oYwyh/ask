import Posts from "@/app/_components/Posts";
import Ask from "@/app/posts/timeline/_components/Ask";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function Timeline() {
    return (
        <div className="grid grid-cols-5">
            <div className="col-span-1"></div>
            <div className="flex flex-col gap-0 col-span-3">
                <Ask />
                <div className="flex flex-col gap-0">
                    <div className="flex flex-row gap-3 items-center py-6">
                        <Image
                            src="/pfp.png"
                            width={40}
                            height={40}
                            alt="pfp"
                        />
                        <p className="text-3xl font-medium">Students Questions</p>
                    </div>
                    <Posts type={'question'} status="approved" />
                </div>
            </div>
            <div className="col-span-1"></div>
        </div>
    )
}