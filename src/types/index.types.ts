export type TRoles = "user" | "admin";
export type TGenders = "male" | "female";
export type TPostTypes = "question" | "announcement";
export type TPostStatuses = "all" | "pending" | "approved" | "rejected";
export type TTables = 'user' | 'post' | 'reply'

export type TUser = {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    phone: string;
    parentPhone: string;
    gender: TGenders;
    region: string;
    year: number;
    role: TRoles,
    password: string;
    createdAt: Date;
    updatedAt: Date;
}

export type TPost = {
    id: number;
    content: string;
    images?: string;
    userId: number;
    type: TPostTypes;
    createdAt: Date;
    updatedAt: Date;
}

export type TReply = {
    id: number;
    content: string;
    images: string;
    postId: number;
    userId: number;
    createdAt: Date;
    updatedAt: Date;
}

export const columnsRegex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^01[0-2,5]{1}[0-9]{8}$/,
}

export type TReplies = { reply: TReply, user: TUser }[]