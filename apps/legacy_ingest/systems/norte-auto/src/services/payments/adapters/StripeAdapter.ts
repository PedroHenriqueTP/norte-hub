import { IPaymentProvider, PaymentIntentResult, TaxRate } from "../interfaces/IPaymentProvider";
import { stripe } from "@/lib/stripe";

export class StripeAdapter implements IPaymentProvider {
    name = "Stripe";

    async createPaymentSession(userId: string, priceId: string, currency: string): Promise<PaymentIntentResult> {
        try {
            // Reusing the logic from our route, but abstracted
            const session = await stripe.checkout.sessions.create({
                mode: "subscription", // Or payment for one-time
                // We need customer ID here, usually fetched from DB via userId
                // For simplicity in this adapter, we assume the caller handles customer creation or we'd fetch it here.
                // To keep it pure, let's assume we pass a customer ID or we fetch user.
                // Let's rely on the metadata or a passed customer ID. 
                // However, the interface asks for userId.
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?canceled=true`,
                metadata: {
                    userId: userId
                }
            });

            return {
                success: true,
                transactionId: session.id,
                status: 'pending',
                amount: 0, // Dynamic based on price
                currency: currency,
                checkoutUrl: session.url as string
            };

        } catch (error) {
            console.error("StripeAdapter Error", error);
            throw error;
        }
    }

    async getTaxRates(countryCode: string): Promise<TaxRate[]> {
        // Mock implementation or fetch from Stripe Tax
        if (countryCode === 'US') {
            return [{ id: 'tax_us', percentage: 8.5, inclusive: false, description: 'Sales Tax' }];
        }
        return [];
    }
}
