import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import db from "@/lib/db";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        // Logic for one-time payment if applicable, or just generic subscription start
        // Although subscription.created/updated handles most
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        if (!session?.metadata?.userId) {
            return new NextResponse("Webhook Error: No user ID in metadata", { status: 400 });
        }

        await db.user.update({
            where: { id: session.metadata.userId },
            data: {
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                subscriptionStatus: subscription.status,
                subscriptionEndDate: new Date(subscription.current_period_end * 1000),
                plan: 'pro' // Upgrade user
            }
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        // Need to find user by stripeCustomerId if metadata isn't on invoice object properly (it usually propagates but safe to look up)
        await db.user.update({
            where: { stripeCustomerId: subscription.customer as string },
            data: {
                subscriptionStatus: subscription.status,
                subscriptionEndDate: new Date(subscription.current_period_end * 1000),
            }
        });
    }

    if (event.type === 'customer.subscription.deleted') {
        const subscription = event.data.object as Stripe.Subscription;
        await db.user.update({
            where: { stripeSubscriptionId: subscription.id },
            data: {
                subscriptionStatus: 'canceled',
                plan: 'free'
            }
        });
    }

    return new NextResponse(null, { status: 200 });
}
