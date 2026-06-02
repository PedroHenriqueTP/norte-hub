import React, { useState } from 'react';
import { FileText, Image as ImageIcon, FileAudio, FileVideo, FileCode, File, Trash2, ExternalLink, Sparkles } from 'lucide-react';
import { CloudFile } from '../hooks/useCloudStorage';
import { FileInsightModal } from './FileInsightModal';

interface FileCardProps {
  file: CloudFile;
  onDelete: (id: string) => void;
}

export function FileCard({ file, onDelete }: FileCardProps) {
  const [isInsightOpen, setIsInsightOpen] = useState(false);

  const getIcon = (mime: string) => {
    if (mime.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-emerald-400" />;
    if (mime.startsWith('audio/')) return <FileAudio className="w-8 h-8 text-teal-400" />;
    if (mime.startsWith('video/')) return <FileVideo className="w-8 h-8 text-cyan-400" />;
    if (mime.includes('pdf') || mime.includes('document')) return <FileText className="w-8 h-8 text-indigo-400" />;
    if (mime.includes('sheet') || mime.includes('excel') || mime.includes('csv')) return <FileCode className="w-8 h-8 text-green-400" />;
    return <File className="w-8 h-8 text-white/40" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="group relative flex flex-col p-4 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300 backdrop-blur-md">
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-white/5 rounded-lg group-hover:bg-white/10 transition-colors">
            {getIcon(file.mimeType)}
          </div>
          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsInsightOpen(true)}
              className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-emerald-400 transition-colors"
              title="Análise IA"
            >
              <Sparkles className="w-4 h-4" />
            </button>
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => onDelete(file.id)}
              className="p-1.5 hover:bg-red-500/20 rounded-md text-white/40 hover:text-red-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        <span className="text-sm font-medium text-white/90 truncate mb-1" title={file.name}>
          {file.name}
        </span>
        <span className="text-xs text-white/40 font-mono">
          {formatSize(file.size)}
        </span>
      </div>

      <FileInsightModal
        isOpen={isInsightOpen}
        onClose={() => setIsInsightOpen(false)}
        file={file}
      />
    </>
  );
}
