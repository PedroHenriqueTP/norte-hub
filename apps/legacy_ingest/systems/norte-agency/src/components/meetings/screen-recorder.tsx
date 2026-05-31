"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MonitorPlay, StopCircle, Download, Video, Mic } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ScreenRecorder() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [timer, setTimer] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const videoPreviewRef = useRef<HTMLVideoElement | null>(null);
    const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const startRecording = async () => {
        try {
            // Request screen sharing
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" } as any,
                audio: true // Captures system audio if shared
            });

            // Optional: We could try to get microphone audio here too and mix it, 
            // but for simplicity and stability we'll stick to system/tab audio + video.

            const recorder = new MediaRecorder(displayStream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorderRef.current = recorder;

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    setRecordedChunks((prev) => [...prev, event.data]);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                stopTimer();

                // Stop all tracks to turn off the "sharing" indicator
                displayStream.getTracks().forEach(track => track.stop());
                setStream(null);
            };

            // Handle user clicking "Stop sharing" on the browser UI
            displayStream.getVideoTracks()[0].onended = () => {
                stopRecording();
            };

            recorder.start();
            setStream(displayStream);
            setIsRecording(true);
            setRecordedChunks([]);
            setVideoUrl(null);
            startTimer();

            // Preview the live stream (muted to avoid feedback)
            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = displayStream;
            }

        } catch (err) {
            console.error("Error starting screen recording:", err);
            alert("Não foi possível iniciar a gravação. Verifique as permissões.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    const downloadRecording = () => {
        if (recordedChunks.length === 0) return;

        const blob = new Blob(recordedChunks, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        a.download = `gravacao-meeting-${timestamp}.webm`;
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

    // Timer logic
    const startTimer = () => {
        setTimer(0);
        timerIntervalRef.current = setInterval(() => {
            setTimer(t => t + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Effect to handle final blob creation correctly when 'isRecording' creates new chunk state
    // Actually, onstop handles it, but we need to make sure Chunks are fresh. 
    // The ondataavailable closure might capture old state if not careful.
    // Ideally we use a ref for chunks or functional state update. Functional used above.

    // We need to regenerate the blob URL when chunks change AFTER stop? 
    // No, onstop event happens after last dataavailable. 
    // BUT there is a caveat: `recordedChunks` state inside `onstop` closure will be the INITIAL empty array from when `startRecording` was defined?
    // YES. We need to use a Ref for chunks to be safe inside the event listener or re-bind.
    // Let's fix this using a Ref for chunks to ensure we save everything.

    const chunksRef = useRef<Blob[]>([]);

    const startRecordingSafe = async () => {
        try {
            const displayStream = await navigator.mediaDevices.getDisplayMedia({
                video: { mediaSource: "screen" } as any,
                audio: true
            });

            const recorder = new MediaRecorder(displayStream, {
                mimeType: 'video/webm;codecs=vp9'
            });

            mediaRecorderRef.current = recorder;
            chunksRef.current = []; // Reset chunks

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                    // Also update state for UI feedback if needed, but Ref is source of truth for saving
                    setRecordedChunks([...chunksRef.current]);
                }
            };

            recorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'video/webm' });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                stopTimer();

                displayStream.getTracks().forEach(track => track.stop());
                setStream(null);
                setIsRecording(false);
            };

            displayStream.getVideoTracks()[0].onended = () => {
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
                    mediaRecorderRef.current.stop();
                }
            };

            recorder.start();
            setStream(displayStream);
            setIsRecording(true);
            setVideoUrl(null);
            startTimer();

            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = displayStream;
            }

        } catch (err) {
            console.error("Error:", err);
        }
    }


    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
            <div className="md:col-span-2 space-y-6">
                {/* Main Preview / Player Area */}
                <div className="bg-slate-950 rounded-xl overflow-hidden shadow-2xl border border-slate-800 aspect-video relative flex items-center justify-center group">
                    {!isRecording && !videoUrl && (
                        <div className="text-center space-y-4 p-10">
                            <div className="h-20 w-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                <MonitorPlay className="h-10 w-10 text-violet-500" />
                            </div>
                            <h3 className="text-xl font-medium text-slate-200">Pronto para gravar</h3>
                            <p className="text-slate-500 max-w-sm mx-auto">Compartilhe sua tela inteira, janela ou aba do navegador. O vídeo será processado localmente.</p>
                        </div>
                    )}

                    <video
                        ref={videoPreviewRef}
                        muted
                        autoPlay
                        playsInline
                        className={`w-full h-full object-contain bg-black ${!isRecording ? 'hidden' : ''}`}
                    />

                    {videoUrl && !isRecording && (
                        <video
                            src={videoUrl}
                            controls
                            className="w-full h-full object-contain bg-black"
                        />
                    )}

                    {isRecording && (
                        <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full" />
                            GRAVANDO {formatTime(timer)}
                        </div>
                    )}
                </div>
            </div>

            <div className="space-y-6">
                {/* Controls Card */}
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Video className="h-5 w-5 text-violet-600" />
                            Sala de Controle
                        </CardTitle>
                        <CardDescription>Gerencie sua gravação</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {!isRecording ? (
                            <Button
                                onClick={startRecordingSafe}
                                className="w-full bg-violet-600 hover:bg-violet-700 text-white h-12 text-lg shadow-md transition-all"
                            >
                                <MonitorPlay className="mr-2 h-5 w-5" /> Iniciar Gravação
                            </Button>
                        ) : (
                            <Button
                                onClick={stopRecording}
                                variant="destructive"
                                className="w-full bg-red-600 hover:bg-red-700 text-white h-12 text-lg shadow-md animate-pulse"
                            >
                                <StopCircle className="mr-2 h-5 w-5" /> Parar Gravação
                            </Button>
                        )}

                        {videoUrl && !isRecording && (
                            <Button
                                onClick={downloadRecording}
                                variant="outline"
                                className="w-full border-slate-300 hover:bg-slate-50 text-slate-700 h-12"
                            >
                                <Download className="mr-2 h-4 w-4" /> Baixar Vídeo (.webm)
                            </Button>
                        )}

                        <div className="text-xs text-slate-400 mt-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                            <strong>Nota:</strong> O áudio do sistema só é capturado se você marcar a opção "Compartilhar áudio do sistema" na janela de permissão do navegador.
                        </div>
                    </CardContent>
                </Card>

                {/* Status/History Placeholder (Future Feature) */}
                <Card className="border-slate-200 shadow-sm opacity-60">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm text-slate-500">Histórico Recente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-slate-400 italic">As gravações não são salvas na nuvem automaticamente. Certifique-se de baixar o arquivo.</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
