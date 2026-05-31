import { auth } from "@/auth";
import { stripe } from "@/lib/stripe";
import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const user = await db.user.findUnique({
            where: { id: session.user.id }
        });

        if (!user || !user.stripeCustomerId) {
            return new NextResponse("No customer found", { status: 400 });
        }

        const stripeSession = await stripe.billingPortal.sessions.create({
            customer: user.stripeCustomerId,
            return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/settings`,
        });

        return NextResponse.json({ url: stripeSession.url });

    } catch (error) {
        console.error("[STRIPE_PORTAL]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
