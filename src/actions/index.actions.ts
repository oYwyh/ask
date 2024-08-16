'use server'

import { tablesMap } from "@/constants/index.constants";
import db from "@/lib/db/drizzle";
import { TTables } from "@/types/index.types";
import { sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function deleteAction(id: string | number, table: TTables) {
    const tableDefinition = tablesMap[table];

    if (!tableDefinition) {
        throw new Error("Invalid table name");
    }

    const deleted = await db.delete(tableDefinition).where(sql`${tableDefinition.id} = ${id}`);

    if (deleted) {
        return {
            success: true
        }
    } else {
        throw new Error("Deletion failed");
    }
}