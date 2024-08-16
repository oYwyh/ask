import Delete from "@/app/_components/Delete"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { TTables } from "@/types/index.types"
import { Ellipsis } from "lucide-react"
import { useState } from "react"


export default function Actions({ id, table }: { id: number, table: TTables }) {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger><Ellipsis /></PopoverTrigger>
                <PopoverContent className="w-fit p-1">
                    <Delete id={id} table={table} setOpen={setOpen} />
                </PopoverContent>
            </Popover>
        </>
    )
}