import { ImageIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

type TUploadButton = {
    images: string[],
    setImages: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages?: number,
    maxImageSize?: number,
}

export default function UploadButton({
    images,
    setImages,
    maxImages = 5,
    maxImageSize = 5 * 1024 * 1024,
}: TUploadButton) {
    const [error, setError] = useState<string>('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImages([]);
        const files = event.target.files;
        if (!files) return;

        const validFiles: string[] = [];
        for (const file of Array.from(files)) {
            if (images.length + validFiles.length >= maxImages) {
                setError(`You can only upload up to ${maxImages} images.`);
                break;
            }

            if (file.size > maxImageSize) {
                setError(`File ${file.name} is too large. Max size is 5MB.`);
                continue;
            }

            validFiles.push(URL.createObjectURL(file));
        }

        setImages(prevImages => [...prevImages, ...validFiles]);
    };

    return (
        <div className="space-y-4">
            <label className="flex flex-row gap-1 w-fit cursor-pointer bg-blue-500 bg-opacity-30 text-[#0D6EFD] px-4 py-2 rounded-md shadow-md transition-all hover:bg-opacity-100 hover:text-white">
                <ImageIcon />
                Images
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    disabled={images.length >= maxImages}
                />
            </label>

            <div className="grid grid-cols-3 gap-4">
                {images.map((src, index) => (
                    <div key={index} className="relative">
                        <Image
                            src={src}
                            alt={`Upload Preview ${index + 1}`}
                            className="rounded-md shadow-md"
                            width={90}
                            height={90}
                        />
                    </div>
                ))}
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            {images.length >= maxImages && (
                <p className="text-red-500 text-sm">You have reached the maximum number of images.</p>
            )}
        </div>
    );
}
