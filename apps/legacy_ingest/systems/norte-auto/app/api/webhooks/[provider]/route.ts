import { NextRequest, NextResponse } from "next/server";
import { orderQueue } from "@/lib/queues";
import crypto from 'crypto';

// Dynamic route handler for /api/webhooks/[provider]
export async function POST(req: NextRequest, { params }: { params: { provider: string } }) {
    const { provider } = await params;
    const bodyText = await req.text();

    console.log(`[Webhook] Received event from ${provider}`);

    // 1. Verify Signature (HMAC)
    // In production, fetch the secret from IntegrationConfig based on provider
    // const secret = process.env.WEBHOOK_SECRET; 
    // const signature = req.headers.get('x-signature');
    // const calculated = crypto.createHmac('sha256', secret).update(bodyText).digest('hex');
    // if (signature !== calculated) return new NextResponse("Invalid Signature", { status: 401 });

    // Mock Validation for demo
    if (!req.headers.get('x-test-signature')) {
        // console.warn('Missing signature'); 
        // return new NextResponse("Missing Signature", { status: 401 });
    }

    try {
        // 2. Parse Body (Assumes JSON)
        const body = JSON.parse(bodyText);

        // 3. Dispatch Job (Fire and Forget)
        // Check if it's a "New Order" notification
        if (body.topic === 'orders' || body.type === 'order.created') {
            await orderQueue.add('import-order', {
                platform: provider,
                orderId: body.resource_id || body.data?.id, // Common patterns
                payload: body
            });
            console.log(`[Webhook] Enqueued Import Job for Order from ${provider}`);
        }

        // Always return 200 OK quickly
        return new NextResponse("OK", { status: 200 });

    } catch (error) {
        console.error("[Webhook] Error", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
