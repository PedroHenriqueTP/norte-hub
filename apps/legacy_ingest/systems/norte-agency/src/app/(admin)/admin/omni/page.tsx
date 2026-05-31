import React from "react";
import { NorteDropZone } from "@/components/shared/NorteDropZone";

export default function OmniPortalPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Omni-Drop Portal</h1>
        <p className="text-slate-400 max-w-xl">
          Arraste qualquer documento, ficha de treino ou nota fiscal. 
          O Córtex Neural classificará a intenção e orquestrará as ações nos Hubs do Polvo Norte.
        </p>
      </div>
      <NorteDropZone />
    </div>
  );
}
