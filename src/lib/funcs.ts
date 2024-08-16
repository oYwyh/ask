import { UseFormReturn } from "react-hook-form";

export const normalizeDataFields = (data: any) => {
    Object.entries(data).forEach(([key, value]) => {
        if (typeof value === 'string') {
            data[key] = value.toLowerCase();
        }
    });
};

export const handleError = (form: UseFormReturn<any>, error: Record<string, string>) => {
    for (const [field, message] of Object.entries(error)) {
        form.setError(field, {
            type: "server",
            message: message,
        });
    }
};

export async function blobUrlToFile(blobUrl: string): Promise<File> {
    const response = await fetch(blobUrl);
    const blob = await response.blob();
    const fileName = blobUrl.split('/').pop() || 'image';
    return new File([blob], fileName, { type: blob.type });
}

export async function uploadFileWithProgress(url: string, file: File, onProgress: (progress: number) => void) {
    return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', url);

        xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
                const progress = (event.loaded / event.total);
                onProgress(progress); // Send normalized progress (0 to 1)
            }
        };

        xhr.onload = () => {
            if (xhr.status === 200) {
                onProgress(1); // Ensure progress is marked as complete (1 or 100%)
                resolve();
            } else {
                reject(new Error('Failed to upload file.'));
            }
        };

        xhr.onerror = () => reject(new Error('An error occurred during the upload.'));
        xhr.send(file);
    });
}
