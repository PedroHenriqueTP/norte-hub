import React from "react";
import { StudentDashboardEditor } from "@/components/infohub/StudentDashboard";

export default function InfoHubDesignerPage() {
  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Norte InfoHub Designer
        </h1>
        <p className="text-slate-400 mt-1">
          Construa a Área de Membros arrastando os módulos. Acesso tokenizado via Neon DB.
        </p>
      </div>
      <StudentDashboardEditor infoproductId="demo-curso-gastronomia" />
    </div>
  );
}
