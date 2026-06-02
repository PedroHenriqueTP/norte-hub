'use client';
import { useState, useEffect } from 'react';

export const LiveTelemetry = () => {
  const [logs, setLogs] = useState(['Initializing Core...', 'Auth Gateway: Standby']);
  
  // Efeito de "Digitando" logs
  useEffect(() => {
    const interval = setInterval(() => {
      const newLog = `> ${new Date().toLocaleTimeString()} - REQ: ${Math.random().toString(36).substring(7)}`;
      setLogs(prev => [newLog, ...prev].slice(0, 5));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-[10px] text-norte-core opacity-70 space-y-1">
      {logs.map((log, i) => <p key={i}>{log}</p>)}
    </div>
  );
};
