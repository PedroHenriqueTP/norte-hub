import React from "react";
import { NorteStudio } from "@/components/shared/NorteStudio";

export default function SaaSStudioPage() {
  return (
    <div className="p-8 w-full min-h-screen bg-slate-950 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
          Norte SaaS Maker
        </h1>
        <p className="text-slate-400 mt-1">Crie, audite e publique sua própria plataforma com o Norte Studio.</p>
      </div>
      <NorteStudio />
    </div>
  );
}
