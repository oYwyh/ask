'use client'

import { deleteAction } from "@/actions/index.actions"
import { Button } from "@/components/ui/button"
import { TTables } from "@/types/index.types"
import { useQueryClient } from "@tanstack/react-query"
import { revalidatePath } from "next/cache"

export default function Delete({ id, table, setOpen }: { id: number, table: TTables, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const queryClient = useQueryClient()

    const onDelete = async () => {
        const result = await deleteAction(id, table)

        if (result.success) {
            queryClient.invalidateQueries()
            setOpen(false)
        }
    }

    return (
        <>
            <Button
                onClick={onDelete}
                variant={'destructive'}
            >
                Delete
            </Button>
        </>
    )
}