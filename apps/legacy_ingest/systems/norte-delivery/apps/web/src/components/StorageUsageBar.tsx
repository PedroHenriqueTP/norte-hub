import React from 'react';

interface StorageUsageBarProps {
  used: number;
  limit: number;
}

export function StorageUsageBar({ used, limit }: StorageUsageBarProps) {
  const percentage = Math.min(100, Math.round((used / limit) * 100)) || 0;

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full p-4 rounded-xl border border-white/5 bg-black/40 backdrop-blur-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-white/60 uppercase tracking-wider font-semibold">Armazenamento</span>
        <span className="text-xs font-mono text-emerald-400 font-semibold">
          {formatSize(used)} / {formatSize(limit)} ({percentage}%)
        </span>
      </div>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
