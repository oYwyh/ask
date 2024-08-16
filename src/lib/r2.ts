'use server'

import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { validateRequest } from './auth'

const S3 = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
})

import crypto from 'crypto'
import { imageTypes } from '@/lib/constants'

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')

const maxFileSize = 5 * 1024 * 1024 // 5MB

export async function getPresigndUrl({
    key,
    type,
    size,
    checkSum,
    userId,
}: {
    key: string | '',
    type: string,
    size: number,
    checkSum?: string,
    userId?: string,
}) {
    const { user } = await validateRequest()
    if (!user) throw new Error('Unauthorized')
    if (size > maxFileSize) throw new Error('File size too large')
    if (!userId) userId = user.id


    if (!imageTypes.includes(type)) throw new Error('Unsupported file type')

    const fileName = generateFileName() + `-${key}`;

    const putObjectCommand = new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME || '',
        Key: fileName,
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checkSum ? checkSum : undefined,
        Metadata: {
            userId: userId
        }
    })

    const signedUrl = await getSignedUrl(S3, putObjectCommand, { expiresIn: 3600 })

    return {
        success: {
            url: signedUrl,
            fileName,
        }
    }
}

// export async function deleteFile({ name, s3 = false, table, id }: { name: string, s3: boolean, table?: keyof typeof tablesMap, id?: number }) {
//     console.log(name, s3, table, id)
//     const { user } = await validateRequest()
//     if (!user) throw new Error('Unauthorized')

//     if (s3) {
//         const deleteObjectCommand = new DeleteObjectCommand({
//             Bucket: process.env.R2_BUCKET_NAME || '',
//             Key: name
//         });

//         try {
//             await S3.send(deleteObjectCommand);
//         } catch (error) {
//             console.error(`Error deleting file from S3: ${name}`, error);
//             // Handle S3 deletion error (e.g., logging, retrying, etc.)
//         }
//     }

//     try {
//         if (table && id) {
//             deleteAction(id, table)
//         }
//     } catch (error) {
//         console.error(`Error deleting file from database: ${name}`, error);
//     }
// }