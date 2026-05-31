import { Worker } from 'bullmq';
import connection from '@/lib/redis';

// Mock function to simulate API calls
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

console.log('🚀 Starting Background Workers...');

// 1. Inventory Sync Worker
// Rate Limit: 10 requests per second (Mercado Livre typical limit)
const inventoryWorker = new Worker('inventory-sync-queue', async (job) => {
    console.log(`[Inventory] Processing job ${job.id} for user ${job.data.userId}`);

    // Simulate API call to update stock
    await sleep(500);

    console.log(`[Inventory] Job ${job.id} completed.`);
}, {
    connection,
    limiter: {
        max: 10,
        duration: 1000,
    }
});

// 2. Order Import Worker
const orderWorker = new Worker('order-import-queue', async (job) => {
    console.log(`[Order] Importing order ${job.data.orderId} from ${job.data.platform}`);

    // Simulate fetching order details and saving to DB
    await sleep(1000);

    console.log(`[Order] Imported successfully.`);
}, {
    connection,
    limiter: {
        max: 5, // Stricter limit for heavy order imports
        duration: 1000
    }
});

// 3. Email Notification Worker
const emailWorker = new Worker('email-notification-queue', async (job) => {
    console.log(`[Email] Sending email to ${job.data.email}`);
    await sleep(200);
}, { connection });

// Error handling
inventoryWorker.on('failed', (job, err) => {
    console.error(`[Inventory] Job ${job?.id} failed: ${err.message}`);
});
