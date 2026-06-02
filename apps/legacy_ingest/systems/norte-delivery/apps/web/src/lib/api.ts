export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'READY' | 'DELIVERING' | 'COMPLETED' | 'CANCELED';
export type OrderChannel = 'OWN_APP' | 'IFOOD' | 'UBER_EATS' | 'WHATSAPP' | 'POS';

export interface OrderSummary {
  id: string;
  incrementalId?: number;
  table?: string;
  status: OrderStatus;
  channel: OrderChannel;
  customer?: string;
  total: number;
  items: number;
  waitingMinutes: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type TableStage = 'waiting' | 'preparation' | 'served' | 'closing';

export interface TableStatus {
  table: string;
  tableNumber: string;
  status: TableStage;
  openSince: string;
  orders: number;
  total: number;
  comandas: string;
  server: string;
}

const API_BASE_URL =
  process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3333';

const channelLabels: Record<OrderChannel, string> = {
  OWN_APP: 'App Próprio',
  IFOOD: 'iFood',
  UBER_EATS: 'Uber Eats',
  WHATSAPP: 'WhatsApp',
  POS: 'Balcão'
};

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Aguardando confirmaçao',
  CONFIRMED: 'Confirmado',
  PREPARING: 'Na cozinha',
  READY: 'Pronto',
  DELIVERING: 'Saiu para entrega',
  COMPLETED: 'Finalizado',
  CANCELED: 'Cancelado'
};

export const fallbackOrders: OrderSummary[] = [
  {
    id: 'd81f32f0',
    incrementalId: 4491,
    table: 'Mesa 05',
    status: 'PREPARING',
    channel: 'IFOOD',
    customer: 'Mariana Lima',
    total: 128.5,
    items: 3,
    waitingMinutes: 12,
    notes: 'Sem cebola',
    createdAt: '2025-11-27T11:14:00.000Z',
    updatedAt: '2025-11-27T11:26:00.000Z'
  },
  {
    id: '25a8b8cf',
    incrementalId: 4492,
    table: 'Mesa 03',
    status: 'PENDING',
    channel: 'OWN_APP',
    customer: 'Arthur Batista',
    total: 92.2,
    items: 2,
    waitingMinutes: 5,
    notes: 'Cerveja gelada',
    createdAt: '2025-11-27T11:21:00.000Z',
    updatedAt: '2025-11-27T11:21:00.000Z'
  },
  {
    id: 'c6bf28b0',
    incrementalId: 4490,
    table: 'Balcão',
    status: 'READY',
    channel: 'WHATSAPP',
    customer: 'Luciana Prado',
    total: 68.9,
    items: 1,
    waitingMinutes: 22,
    notes: 'Buscar no balcão',
    createdAt: '2025-11-27T10:59:00.000Z',
    updatedAt: '2025-11-27T11:21:00.000Z'
  },
  {
    id: '97fd0ba0',
    incrementalId: 4488,
    table: 'Entrega 02',
    status: 'DELIVERING',
    channel: 'UBER_EATS',
    customer: 'Família Matos',
    total: 154.5,
    items: 5,
    waitingMinutes: 16,
    notes: 'Anotar troco 200',
    createdAt: '2025-11-27T10:48:00.000Z',
    updatedAt: '2025-11-27T11:05:00.000Z'
  },
  {
    id: '38c8e4d0',
    incrementalId: 4489,
    table: 'Mesa 07',
    status: 'CONFIRMED',
    channel: 'POS',
    customer: 'Equipe Reunião',
    total: 212.3,
    items: 6,
    waitingMinutes: 9,
    notes: 'Reunião trimestral',
    createdAt: '2025-11-27T11:17:00.000Z',
    updatedAt: '2025-11-27T11:17:00.000Z'
  }
];

export const fallbackTables: TableStatus[] = [
  {
    table: 'Mesa 05',
    tableNumber: '05',
    status: 'preparation',
    openSince: '11:08',
    orders: 2,
    total: 284.1,
    comandas: 'CMD-548 / CMD-549',
    server: 'Laura'
  },
  {
    table: 'Mesa 03',
    tableNumber: '03',
    status: 'waiting',
    openSince: '11:20',
    orders: 1,
    total: 92.2,
    comandas: 'CMD-551',
    server: 'Renan'
  },
  {
    table: 'Mesa 06',
    tableNumber: '06',
    status: 'served',
    openSince: '10:32',
    orders: 4,
    total: 310.9,
    comandas: 'CMD-530 / CMD-532',
    server: 'Camila'
  },
  {
    table: 'Mesa 04',
    tableNumber: '04',
    status: 'closing',
    openSince: '10:55',
    orders: 3,
    total: 187.4,
    comandas: 'CMD-542',
    server: 'Diego'
  }
];

interface ApiOrder {
  id: string;
  incrementalId?: number;
  status: OrderStatus;
  source: OrderChannel;
  total: string | number;
  items: Array<{ quantity: number }>;
  createdAt: string;
  updatedAt: string;
  customerName?: string;
  notes?: string;
}

function mapApiOrder(order: ApiOrder): OrderSummary {
  const totalValue = typeof order.total === 'string' ? Number(order.total) : order.total;
  const createdAtMs = new Date(order.createdAt).getTime();
  const now = Date.now();
  const waitingMinutes = createdAtMs > 0 ? Math.round((now - createdAtMs) / 60000) : 0;
  return {
    id: order.id,
    incrementalId: order.incrementalId,
    table: 'Balcão',
    status: order.status,
    channel: order.source,
    customer: order.customerName,
    total: Number.isFinite(totalValue) ? totalValue : 0,
    items: order.items.reduce((acc, item) => acc + item.quantity, 0),
    waitingMinutes: Math.max(waitingMinutes, 0),
    notes: order.notes,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}

export async function loadOrders(): Promise<OrderSummary[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/systems/norte-bar/orders`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Falha ao carregar pedidos');
    }
    const payload: ApiOrder[] = await response.json();
    if (!Array.isArray(payload) || payload.length === 0) {
      return fallbackOrders;
    }
    return payload.map(mapApiOrder);
  } catch (error) {
    return fallbackOrders;
  }
}

export async function getDashboardSnapshot() {
  const orders = await loadOrders();
  return {
    orders,
    tables: fallbackTables
  };
}

export function getStatusLabel(status: OrderStatus) {
  return statusLabels[status] ?? status;
}

export function getChannelLabel(channel: OrderChannel) {
  return channelLabels[channel] ?? channel;
}

