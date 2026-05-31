import { create } from 'zustand';

export type NetworkMetric = {
  time: string;
  latency: number; // ms
  jitter: number; // ms
  packetLoss: number; // %
};

export type ClickEvent = {
  id: string;
  timestamp: number;
  element: string; // e.g. 'map_open', 'quiz_start'
  x: number;
  y: number;
};

interface TelemetryState {
  networkHistory: NetworkMetric[];
  clickEvents: ClickEvent[];
  addNetworkMetric: (metric: NetworkMetric) => void;
  trackClick: (element: string, x: number, y: number) => void;
}

export const useTelemetryStore = create<TelemetryState>((set) => ({
  networkHistory: [],
  clickEvents: [],
  addNetworkMetric: (metric) => set((state) => {
    const newHistory = [...state.networkHistory, metric];
    // Keep only last 20 ticks for live graph performance
    if (newHistory.length > 20) newHistory.shift();
    return { networkHistory: newHistory };
  }),
  trackClick: (element, x, y) => set((state) => ({
    clickEvents: [
      ...state.clickEvents,
      {
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
        element,
        x,
        y,
      }
    ]
  })),
}));
