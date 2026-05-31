import { useTelemetryStore } from '../store/useTelemetryStore';

export class TelemetryService {
  private static intervalId: NodeJS.Timeout | null = null;

  static start() {
    if (this.intervalId) return;

    this.intervalId = setInterval(() => {
      const store = useTelemetryStore.getState();
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
      
      // Simulate 5G metrics
      // Latency usually between 10ms - 25ms, occasionally spikes
      const baseLatency = 12 + Math.random() * 8;
      const spike = Math.random() > 0.9 ? Math.random() * 20 : 0;
      
      // Jitter
      const jitter = 1 + Math.random() * 3;
      
      // Packet Loss
      const packetLoss = Math.random() > 0.95 ? Math.random() * 0.5 : 0;

      store.addNetworkMetric({
        time: timeStr,
        latency: parseFloat((baseLatency + spike).toFixed(1)),
        jitter: parseFloat(jitter.toFixed(1)),
        packetLoss: parseFloat(packetLoss.toFixed(2)),
      });
    }, 1500); // update every 1.5s
  }

  static stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}
