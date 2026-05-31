import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || !session?.user.email) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { priceId } = await req.json();
        const user = await db.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user) {
            return new NextResponse("User not found", { status: 404 });
        }

        let customerId = user.stripeCustomerId;

        // Create Stripe Customer if not exists
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: user.email,
                name: user.name || "OmniSync User",
                metadata: {
                    userId: user.id
                }
            });
            customerId = customer.id;
            await db.user.update({
                where: { id: user.id },
                data: { stripeCustomerId: customerId }
            });
        }

        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            customer: customerId,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
            metadata: {
                userId: user.id
            }
        });

        return NextResponse.json({ url: checkoutSession.url });
    } catch (error) {
        console.error("[STRIPE_CHECKOUT]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
