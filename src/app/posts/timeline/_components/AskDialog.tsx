'use client'

import { post } from "@/actions/post.actions"
import ProgressBar from "@/app/_components/ProgressBar"
import UploadButton from "@/app/_components/UploadButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import FormField from "@/components/ui/FormField"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { blobUrlToFile } from "@/lib/funcs"
import { getPresigndUrl } from "@/lib/r2"
import { postSchema, TPostSchema } from "@/types/post.types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Send } from "lucide-react"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"

export default function AskDialog() {
    const [open, setOpen] = useState(false)
    const [images, setImages] = useState<string[]>([])
    const [uploadProgress, setUploadProgress] = useState(0)

    const form = useForm<TPostSchema>({
        resolver: zodResolver(postSchema)
    })

    const onSubmit = async (data: TPostSchema & { images?: string[] }) => {
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

        // Submit the form data with the uploaded image names
        const result = await post(data);

        if (result.success) {
            // Reset progress
            setUploadProgress(0);
            form.reset();
            setImages([])
            setOpen(false)
        }

    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger className="bg-[#E2E3E5] rounded-full py-[.375rem] px-[.75rem] w-full cursor-pointer text-start text-[#515558]">
                <p>Ask your question here...</p>
            </DialogTrigger>
            <DialogContent className="p-0">
                <DialogHeader className="pt-6 px-3">
                    <DialogTitle>Your Question</DialogTitle>
                </DialogHeader>
                <Separator className="w-full" />
                <div className="flex flex-col gap-2 px-3">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                form={form}
                                name="content"
                                textarea
                                label=""
                                placeholder="Ask Your Question Here"
                            />
                            <UploadButton images={images} setImages={setImages} />
                            {uploadProgress > 0 && <ProgressBar progress={uploadProgress} />}
                            <Button type="submit" className="p-2 px-3 flex flex-row gap-2 bg-green-700 transition-all hover:bg-green-800">
                                <Send size={18} />
                                Send
                            </Button>
                        </form>
                    </Form>
                </div>
                <Separator className="w-full" />
            </DialogContent>
        </Dialog>
    )
}
