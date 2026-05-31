import { ScreenRecorder } from "@/components/meetings/screen-recorder";
import { Video } from "lucide-react";

export default function MeetingsPage() {
    return (
        <div className="space-y-6 max-w-[1600px] mx-auto h-[calc(100vh-140px)]">
            <div className="flex items-center gap-3 mb-6">
                <div className="h-10 w-10 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">
                    <Video className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Sala de Reuniões & Gravação</h1>
                    <p className="text-slate-500">Grave tutorias, reuniões ou feedback de design.</p>
                </div>
            </div>

            <ScreenRecorder />
        </div>
    );
}
