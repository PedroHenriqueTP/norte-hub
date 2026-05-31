type HubMetricPoint = {
  date: string;
  revenue: number;
  activeUsers: number;
};

export type HubWebhookEvent = {
  service: string;
  eventType: string;
  occurredAt: string;
  revenue: number;
  activeUsers: number;
  actorUserId?: string;
  actorTenantId?: string;
  rawPayload: Record<string, unknown>;
};

type HubSummary = {
  totals: {
    revenue: number;
    activeUsers: number;
    events: number;
    services: number;
  };
  timeline: HubMetricPoint[];
  byService: Array<{
    service: string;
    revenue: number;
    activeUsers: number;
    events: number;
  }>;
  recentEvents: HubWebhookEvent[];
};

const MAX_EVENTS = 1000;

const globalStore = globalThis as unknown as {
  webhookHubEvents?: HubWebhookEvent[];
};

function ensureStore(): HubWebhookEvent[] {
  if (!globalStore.webhookHubEvents) {
    globalStore.webhookHubEvents = [];
  }
  return globalStore.webhookHubEvents;
}

export function registerWebhookEvent(event: HubWebhookEvent): void {
  const events = ensureStore();
  events.unshift(event);
  if (events.length > MAX_EVENTS) {
    events.length = MAX_EVENTS;
  }
}

function dateKey(isoDate: string): string {
  return isoDate.slice(0, 10);
}

export function getHubSummary(lastDays = 14): HubSummary {
  const events = ensureStore();
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - (lastDays - 1));

  const timelineMap = new Map<string, HubMetricPoint>();
  const serviceMap = new Map<string, { revenue: number; activeUsers: number; events: number }>();

  for (let i = 0; i < lastDays; i += 1) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    timelineMap.set(key, { date: key, revenue: 0, activeUsers: 0 });
  }

  let totalRevenue = 0;
  let totalActiveUsers = 0;

  for (const event of events) {
    totalRevenue += event.revenue;
    totalActiveUsers += event.activeUsers;

    const key = dateKey(event.occurredAt);
    const point = timelineMap.get(key);
    if (point) {
      point.revenue += event.revenue;
      point.activeUsers += event.activeUsers;
    }

    const prev = serviceMap.get(event.service) ?? { revenue: 0, activeUsers: 0, events: 0 };
    serviceMap.set(event.service, {
      revenue: prev.revenue + event.revenue,
      activeUsers: prev.activeUsers + event.activeUsers,
      events: prev.events + 1,
    });
  }

  return {
    totals: {
      revenue: totalRevenue,
      activeUsers: totalActiveUsers,
      events: events.length,
      services: serviceMap.size,
    },
    timeline: [...timelineMap.values()],
    byService: [...serviceMap.entries()]
      .map(([service, values]) => ({ service, ...values }))
      .sort((a, b) => b.revenue - a.revenue),
    recentEvents: events.slice(0, 12),
  };
}
