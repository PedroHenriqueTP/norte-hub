import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Video } from "lucide-react";

interface ScheduleWidgetProps {
    events?: Array<{
        id: string;
        title: string;
        type: 'deadline' | 'allocation' | 'meeting';
        time: Date | string;
        location?: string;
        isOnline?: boolean;
    }>;
}

export function ScheduleWidget({ events = [] }: ScheduleWidgetProps) {
    return (
        <Card className="h-full border-slate-200 shadow-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                    <Calendar className="h-5 w-5 text-violet-600" />
                    Sua Agenda
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {events.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-slate-500 text-sm">Nenhum compromisso hoje.</p>
                            <p className="text-xs text-slate-400 mt-1">Aproveite para organizar seus jobs.</p>
                        </div>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                                <div className={`p-2 rounded-full ${event.type === 'meeting' ? 'bg-blue-100 text-blue-600' :
                                        event.type === 'deadline' ? 'bg-orange-100 text-orange-600' :
                                            'bg-green-100 text-green-600'
                                    }`}>
                                    <Clock size={16} />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm text-slate-900">{event.title}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <Clock size={12} /> {event.time instanceof Date ? event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : event.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <div className="mt-4 text-center">
                    <button className="text-xs font-semibold text-violet-600 hover:text-violet-800">
                        Ver Agenda Completa
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
