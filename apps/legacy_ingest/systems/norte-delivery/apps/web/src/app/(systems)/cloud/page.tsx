'use client';

import React, { useState, useRef } from 'react';
import { useCloudStorage } from '../../../hooks/useCloudStorage';
import { StorageUsageBar } from '../../../components/StorageUsageBar';
import { FolderCard } from '../../../components/FolderCard';
import { FileCard } from '../../../components/FileCard';
import { UploadCloud, ArrowLeft, FolderPlus, Home, Sparkles, Search, X, Loader2 } from 'lucide-react';
import { CloudFile } from '../../../hooks/useCloudStorage';

export default function CloudPage() {
  const [cloudType, setCloudType] = useState<'systems' | 'personal'>('systems');
  const {
    files,
    folders,
    currentPath,
    storageUsed,
    storageLimit,
    isLoading,
    uploadProgress,
    searchResults,
    isSearching,
    uploadFile,
    deleteFile,
    searchFiles,
    navigateToFolder,
    navigateUp,
    setCurrentPath
  } = useCloudStorage(cloudType);

  const [isDragging, setIsDragging] = useState(false);
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    searchFiles(val);
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchFiles('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    for (const file of Array.from(e.dataTransfer.files)) await uploadFile(file);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    for (const file of Array.from(e.target.files || [])) await uploadFile(file);
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const placeholder = new File([''], '.keep', { type: 'application/x-keep' });
    const targetPath = currentPath ? `${currentPath}/${newFolderName}` : newFolderName;
    const originalPath = currentPath;
    setCurrentPath(targetPath);
    setTimeout(async () => {
      await uploadFile(placeholder);
      setCurrentPath(originalPath);
    }, 50);
    setNewFolderName('');
    setShowNewFolderModal(false);
  };

  const isInSearchMode = searchQuery.trim().length > 0;

  const getAiMatchType = (file: CloudFile): 'name' | 'ai' | null => {
    if (!isInSearchMode) return null;
    const q = searchQuery.toLowerCase();
    if (file.name.toLowerCase().includes(q)) return 'name';
    if (
      (file.summary && file.summary.toLowerCase().includes(q)) ||
      (file.tags && file.tags.toLowerCase().includes(q))
    ) return 'ai';
    return null;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Norte Cloud <Sparkles className="w-6 h-6 text-emerald-400 animate-pulse" />
          </h1>
          <p className="text-sm text-white/60">
            Gerenciador de arquivos síncrono e unificado da holding Norte
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-xl backdrop-blur-md">
          <button
            onClick={() => setCloudType('systems')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              cloudType === 'systems'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Empresa (B2B)
          </button>
          <button
            onClick={() => setCloudType('personal')}
            className={`px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
              cloudType === 'personal'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Pessoal (B2C)
          </button>
        </div>
      </div>

      <div className="relative">
        <div className={`flex items-center bg-black/40 border rounded-2xl px-4 py-3 gap-3 transition-all duration-300 backdrop-blur-md ${
          isInSearchMode ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/5' : 'border-white/10 hover:border-white/20'
        }`}>
          {isSearching
            ? <Loader2 className="w-5 h-5 text-emerald-400 shrink-0 animate-spin" />
            : <Search className="w-5 h-5 text-white/30 shrink-0" />
          }
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Buscar por nome, resumo gerado pela IA ou tags..."
            className="flex-1 bg-transparent text-sm text-white placeholder-white/25 focus:outline-none"
          />
          {isInSearchMode && (
            <button onClick={clearSearch} className="text-white/30 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {isInSearchMode && (
          <div className="flex items-center gap-1.5 mt-2 px-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs text-emerald-400/80">
              Busca inteligente — pesquisando também em resumos e tags geradas pelo Cortex Neural
            </span>
          </div>
        )}
      </div>

      {isInSearchMode ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40">
              Resultados da Busca
              {!isSearching && searchResults && (
                <span className="ml-2 text-white/20 normal-case tracking-normal font-normal">
                  {searchResults.length} arquivo{searchResults.length !== 1 ? 's' : ''} encontrado{searchResults.length !== 1 ? 's' : ''}
                </span>
              )}
            </h2>
          </div>

          {isSearching ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : searchResults && searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {searchResults.filter((f) => f.name !== '.keep').map((file) => {
                const matchType = getAiMatchType(file);
                return (
                  <div key={file.id} className="relative">
                    {matchType === 'ai' && (
                      <div className="absolute -top-2 -right-2 z-10 flex items-center gap-1 px-2 py-0.5 bg-emerald-500 text-black rounded-full text-[10px] font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/20">
                        <Sparkles className="w-2.5 h-2.5" />
                        Encontrado por IA
                      </div>
                    )}
                    <FileCard file={file} onDelete={deleteFile} />
                  </div>
                );
              })}
            </div>
          ) : searchResults && searchResults.length === 0 ? (
            <div className="text-center py-16 bg-white/[0.01] border border-white/5 rounded-2xl space-y-2">
              <Search className="w-8 h-8 text-white/10 mx-auto" />
              <span className="text-sm text-white/40 block">Nenhum arquivo encontrado para "{searchQuery}"</span>
              <span className="text-xs text-white/20 block">Tente buscar por termos do conteúdo — o Cortex indexa o significado do arquivo</span>
            </div>
          ) : null}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <StorageUsageBar used={storageUsed} limit={storageLimit} />
            </div>
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowNewFolderModal(true)}
                className="flex items-center space-x-2 px-4 py-3 bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-xl transition-all font-medium text-sm"
              >
                <FolderPlus className="w-4 h-4 text-emerald-400" />
                <span>Nova Pasta</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-5 py-3 bg-emerald-500 text-black hover:bg-emerald-400 rounded-xl transition-all font-semibold text-sm shadow-lg shadow-emerald-500/10"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Enviar Arquivo</span>
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
            </div>
          </div>

          <div className="flex items-center space-x-2 text-sm text-white/60">
            <button
              onClick={() => setCurrentPath('')}
              className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
            >
              <Home className="w-4 h-4" />
              <span>Raiz</span>
            </button>
            {currentPath.split('/').filter(Boolean).map((segment, index, arr) => (
              <React.Fragment key={segment}>
                <span className="text-white/20">/</span>
                <button
                  onClick={() => setCurrentPath(arr.slice(0, index + 1).join('/'))}
                  className="hover:text-emerald-400 transition-colors"
                >
                  {segment}
                </button>
              </React.Fragment>
            ))}
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 text-center ${
              isDragging
                ? 'border-emerald-500 bg-emerald-500/[0.04] scale-[1.01]'
                : 'border-white/5 bg-white/[0.01] hover:border-white/10'
            }`}
          >
            {uploadProgress !== null && (
              <div className="absolute inset-0 bg-black/80 rounded-2xl flex flex-col justify-center items-center p-6 backdrop-blur-sm z-10">
                <UploadCloud className="w-12 h-12 text-emerald-400 animate-bounce mb-3" />
                <span className="text-sm font-semibold text-white/90 mb-2">Enviando arquivos...</span>
                <div className="w-64 bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                </div>
                <span className="text-xs text-white/40 mt-2 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Cortex indexará o arquivo em background após o upload
                </span>
              </div>
            )}
            <div className="flex flex-col items-center justify-center space-y-3 pointer-events-none">
              <UploadCloud className="w-12 h-12 text-white/20" />
              <div>
                <span className="text-sm font-semibold text-white/80">Arraste e solte seus arquivos aqui</span>
                <span className="text-xs text-white/40 block mt-1">O Cortex Neural indexará automaticamente após o upload</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white/[0.02] border border-white/5 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {currentPath && (
                <button
                  onClick={navigateUp}
                  className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              )}
              {folders.length > 0 && (
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Pastas</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {folders.map((folder) => (
                      <FolderCard key={folder} name={folder} onClick={() => navigateToFolder(folder)} />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-3">Arquivos</h2>
                {files.filter((f) => f.name !== '.keep').length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {files.filter((f) => f.name !== '.keep').map((file) => (
                      <FileCard key={file.id} file={file} onDelete={deleteFile} />
                    ))}
                  </div>
                ) : (
                  folders.length === 0 && (
                    <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl">
                      <span className="text-sm text-white/40 block">Esta pasta está vazia</span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showNewFolderModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleCreateFolder}
            className="bg-black/95 border border-white/10 p-6 rounded-2xl max-w-sm w-full space-y-4 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-white">Criar Nova Pasta</h3>
            <input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Nome da pasta"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-emerald-500 transition-colors text-sm"
              autoFocus
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewFolderModal(false)}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-emerald-500 text-black hover:bg-emerald-400 rounded-lg transition-colors"
              >
                Criar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
