import { Progress } from "@/components/ui/progress"

export default function ProgressBar({ progress }: { progress: number }) {
    return (
        <div className="mt-2">
            <Progress value={progress} />
            <p className="text-sm mt-1">{Math.round(progress)}%</p>
        </div>
    )
}