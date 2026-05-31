import { Queue } from 'bullmq';
import connection from '@/lib/redis';

export const inventoryQueue = new Queue('inventory-sync-queue', { connection });
export const orderQueue = new Queue('order-import-queue', { connection });
export const emailQueue = new Queue('email-notification-queue', { connection });
