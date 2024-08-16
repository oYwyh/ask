import { postTable, replyTable, userTable } from "@/lib/db/schema";

export const tablesMap = {
    user: userTable,
    post: postTable,
    reply: replyTable
};