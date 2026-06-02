import React from 'react';
import { Folder } from 'lucide-react';

interface FolderCardProps {
  name: string;
  onClick: () => void;
}

export function FolderCard({ name, onClick }: FolderCardProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-3 p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] active:bg-white/[0.08] transition-all duration-300 backdrop-blur-md text-left w-full group"
    >
      <div className="p-2.5 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
        <Folder className="w-6 h-6 text-emerald-400" />
      </div>
      <span className="text-sm font-medium text-white/90 truncate">
        {name}
      </span>
    </button>
  );
}
