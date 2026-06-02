'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { io, Socket } from 'socket.io-client';

export interface CloudFile {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  tenantId?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
  summary?: string | null;
  tags?: string | null;
}

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';

export function useCloudStorage(type: 'systems' | 'personal') {
  const { data: session } = useSession();
  const [files, setFiles] = useState<CloudFile[]>([]);
  const [currentPath, setCurrentPath] = useState<string>('');
  const [storageUsed, setStorageUsed] = useState<number>(0);
  const [storageLimit] = useState<number>(10 * 1024 * 1024 * 1024);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [searchResults, setSearchResults] = useState<CloudFile[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const socketRef = useRef<Socket | null>(null);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchFilesAndUsage = useCallback(async () => {
    if (!session?.accessToken) return;
    setIsLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const prefix = type === 'systems' ? 'systems' : 'personal';
      const [filesRes, usageRes] = await Promise.all([
        fetch(`${apiUrl}/api/${prefix}/norte-cloud/files?path=${encodeURIComponent(currentPath)}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        }),
        fetch(`${apiUrl}/api/${prefix}/norte-cloud/storage/usage`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        })
      ]);
      if (filesRes.ok) setFiles(await filesRes.json());
      if (usageRes.ok) {
        const usageData = await usageRes.json();
        setStorageUsed(usageData.bytesUsed || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [session, type, currentPath]);

  const searchFiles = useCallback(
    (query: string) => {
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      if (!query.trim()) {
        setSearchResults(null);
        setIsSearching(false);
        return;
      }
      setIsSearching(true);
      searchDebounceRef.current = setTimeout(async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
          const prefix = type === 'systems' ? 'systems' : 'personal';
          const res = await fetch(
            `${apiUrl}/api/${prefix}/norte-cloud/search?q=${encodeURIComponent(query)}`,
            { headers: { Authorization: `Bearer ${(session as any)?.accessToken}` } }
          );
          if (res.ok) setSearchResults(await res.json());
        } catch (err) {
          console.error(err);
        } finally {
          setIsSearching(false);
        }
      }, 300);
    },
    [session, type]
  );

  const uploadFile = async (file: File) => {
    if (!session?.accessToken) return;
    setUploadProgress(0);
    try {
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev === null || prev >= 90) { clearInterval(interval); return prev; }
          return prev + 10;
        });
      }, 100);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      clearInterval(interval);
      setUploadProgress(100);
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const prefix = type === 'systems' ? 'systems' : 'personal';
      const res = await fetch(`${apiUrl}/api/${prefix}/norte-cloud/files`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.accessToken}` },
        body: JSON.stringify({
          name: file.name,
          mimeType: file.type || 'application/octet-stream',
          size: file.size,
          url: `https://storage.norte.systems/cloud/${Date.now()}-${file.name}`,
          path: currentPath
        })
      });
      if (!res.ok) throw new Error('Failed to register file');
      await fetchFilesAndUsage();
    } catch (err) {
      console.error(err);
    } finally {
      setTimeout(() => setUploadProgress(null), 500);
    }
  };

  const deleteFile = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333';
      const prefix = type === 'systems' ? 'systems' : 'personal';
      const res = await fetch(`${apiUrl}/api/${prefix}/norte-cloud/files/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.accessToken}` }
      });
      if (res.ok) await fetchFilesAndUsage();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchFilesAndUsage(); }, [fetchFilesAndUsage]);

  useEffect(() => {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    const socketInstance = io(SOCKET_URL, { path: '/ws/files', transports: ['websocket', 'polling'] });
    socketInstance.on('connect', () => socketInstance.emit('joinUserFilesChannel', { userId }));
    socketInstance.on('files:created', (newFile: CloudFile) => {
      if (newFile.path === currentPath) {
        setFiles((prev) => prev.some((f) => f.id === newFile.id) ? prev : [newFile, ...prev]);
        setStorageUsed((prev) => prev + newFile.size);
      }
    });
    socketInstance.on('files:deleted', (payload: { id: string }) => {
      setFiles((prev) => {
        const hit = prev.find((f) => f.id === payload.id);
        if (hit) setStorageUsed((u) => Math.max(0, u - hit.size));
        return prev.filter((f) => f.id !== payload.id);
      });
    });
    socketInstance.on('files:updated', (updatedFile: CloudFile) => {
      if (updatedFile.path === currentPath)
        setFiles((prev) => prev.map((f) => (f.id === updatedFile.id ? updatedFile : f)));
    });
    socketRef.current = socketInstance;
    return () => { socketInstance.disconnect(); };
  }, [session, currentPath]);

  const folders = Array.from(
    new Set(
      files
        .filter((f) => f.path.startsWith(currentPath + '/'))
        .map((f) => f.path.slice(currentPath ? currentPath.length + 1 : 0).split('/')[0])
        .filter((n) => n.length > 0)
    )
  );

  const navigateToFolder = (name: string) =>
    setCurrentPath((prev) => (prev ? `${prev}/${name}` : name));

  const navigateUp = () =>
    setCurrentPath((prev) => {
      const segs = prev.split('/');
      segs.pop();
      return segs.join('/');
    });

  return {
    files: files.filter((f) => f.path === currentPath),
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
  };
}
