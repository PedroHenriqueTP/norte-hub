import React from "react";
import { NorteCommandCenter } from "@/components/intelligence/NorteCommandCenter";

export default function IntelligenceHubPage() {
  return (
    <div className="p-8 w-full min-h-screen bg-slate-900 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <NorteCommandCenter />
    </div>
  );
}
