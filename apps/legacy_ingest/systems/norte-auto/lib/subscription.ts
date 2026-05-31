import { auth } from "@/auth";
import db from "@/lib/db";

const DAY_IN_MS = 86_400_000;

export async function checkSubscription() {
    const session = await auth();

    if (!session?.user) {
        return false;
    }

    const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: {
            subscriptionStatus: true,
            subscriptionEndDate: true,
            stripeCustomerId: true,
            stripePriceId: true,
        },
    });

    if (!user) {
        return false;
    }

    const isValid =
        user.stripePriceId &&
        user.subscriptionEndDate &&
        user.subscriptionEndDate.getTime() + DAY_IN_MS > Date.now();

    return !!isValid;
}
