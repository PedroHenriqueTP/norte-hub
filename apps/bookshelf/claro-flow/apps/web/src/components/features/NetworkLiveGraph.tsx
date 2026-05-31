'use client';

import React, { useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTelemetryStore } from '../../store/useTelemetryStore';
import { TelemetryService } from '../../services/TelemetryService';

export const NetworkLiveGraph = () => {
  const data = useTelemetryStore((state) => state.networkHistory);

  useEffect(() => {
    TelemetryService.start();
    return () => TelemetryService.stop();
  }, []);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-xs text-[#8a8f98]">
        Aguardando telemetria...
      </div>
    );
  }

  const currentLatency = data[data.length - 1].latency;

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex justify-between items-center mb-2 px-1">
        <span className="text-[#8a8f98] text-[10px] uppercase tracking-wider">Performance 5G Live</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse"></div>
          <span className="text-white text-xs font-mono font-bold">{currentLatency} ms</span>
        </div>
      </div>
      <div className="flex-1 w-full min-h-[100px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis domain={['auto', 'auto']} hide />
            <Tooltip 
              contentStyle={{ backgroundColor: '#050000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
              itemStyle={{ color: '#ee1d23', fontSize: '12px' }}
              labelStyle={{ color: '#8a8f98', fontSize: '10px' }}
            />
            <Line 
              type="monotone" 
              dataKey="latency" 
              stroke="#ee1d23" 
              strokeWidth={2}
              dot={false}
              isAnimationActive={false} // Disable animation for pure live-streaming feel
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
