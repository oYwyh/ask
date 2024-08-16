'use client'

import { reply } from "@/actions/reply.actions";
import ProgressBar from "@/app/_components/ProgressBar";
import UploadButton from "@/app/_components/UploadButton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import FormField from "@/components/ui/FormField";
import { blobUrlToFile } from "@/lib/funcs";
import { getPresigndUrl } from "@/lib/r2";
import { TPost } from "@/types/index.types";
import { replySchema, TReplySchema } from "@/types/reply.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { Send } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function ReplyForm({ postId }: { postId: TPost['id'] }) {
    const [images, setImages] = useState<string[]>([])
    const [uploadProgress, setUploadProgress] = useState(0)

    const queryClient = useQueryClient();

    const form = useForm<TReplySchema>({
        resolver: zodResolver(replySchema)
    })

    const onSubmit = async (data: TReplySchema & { images?: string[] }) => {
        const files = await Promise.all(images.map(blobUrlToFile));

        let totalSize = files.reduce((acc, file) => acc + file.size, 0);
        let uploadedSize = 0;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            // Get the signed URL for the file
            const response = await getPresigndUrl({
                key: file.name,
                type: file.type,
                size: file.size,
            });

            const { url, fileName } = response.success;

            // Upload the file
            await fetch(url, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            // Update uploaded size
            uploadedSize += file.size;

            // Update progress
            setUploadProgress((uploadedSize / totalSize) * 100);

            // Store the uploaded file's name to include in the data
            data.images = [...(data.images || []), fileName];
        }

        const result = await reply(data, postId)

        if (result.success) {
            form.resetField('content')
            queryClient.invalidateQueries({ queryKey: ['post'] })
            setImages([])
            setUploadProgress(0)
        }
    }

    return (
        <div className="bg-[#F8F9FA] shadow-lg p-3 rounded-xl w-full">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField form={form} name="content" textarea label='' placeholder="Reply Here..." />
                    <UploadButton images={images} setImages={setImages} />
                    {uploadProgress > 0 && <ProgressBar progress={uploadProgress} />}
                    <Button type="submit" className="p-2 px-3 flex flex-row gap-2 bg-green-700 transition-all hover:bg-green-800">
                        <Send size={18} />
                        Send
                    </Button>
                </form>
            </Form>
        </div>
    )
}