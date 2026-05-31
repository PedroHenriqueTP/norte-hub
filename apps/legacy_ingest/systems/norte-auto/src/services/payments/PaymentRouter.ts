import { IPaymentProvider } from "./interfaces/IPaymentProvider";
import { StripeAdapter } from "./adapters/StripeAdapter";
import { MercadoPagoAdapter } from "./adapters/MercadoPagoAdapter";
import { AsystemsAdapter } from "./adapters/AsystemsAdapter";

interface UserContext {
    country: string;
    currency: string;
    preferredMethod?: 'card' | 'pix' | 'boleto';
    userId: string;
}

export class PaymentRouter {
    private static stripe = new StripeAdapter();
    private static mercadoPago = new MercadoPagoAdapter();
    private static asystems = new AsystemsAdapter();

    public static selectProvider(context: UserContext): IPaymentProvider {
        const { currency, country, preferredMethod } = context;

        // 1. Check Currency. Non-BRL forces Stripe.
        if (currency !== 'BRL') {
            console.log(`[PaymentRouter] Non-BRL Currency (${currency}). routed to Stripe.`);
            return this.stripe;
        }

        // 2. Check Region (Brazil)
        if (country === 'BR' || currency === 'BRL') {

            // PIX Preference -> Asystems (Lower fee fixed rate)
            if (preferredMethod === 'pix') {
                console.log(`[PaymentRouter] BR/PIX detected. routed to Asystems.`);
                return this.asystems;
            }

            // Card Preference -> Compare logic (Simulated)
            // Example: If user has specific config to prefer local acquirer
            // For now, default Cards in BR to MercadoPago for better approval rates
            console.log(`[PaymentRouter] BR/Card detected. routed to MercadoPago.`);
            return this.mercadoPago;
        }

        // Default fallback
        return this.stripe;
    }

    /**
     * Smart Execution with Fallback
     */
    public static async executePayment(context: UserContext, priceId: string) {
        const provider = this.selectProvider(context);

        try {
            return await provider.createPaymentSession(context.userId, priceId, context.currency);
        } catch (error) {
            console.warn(`[PaymentRouter] Provider ${provider.name} failed. Attempting fallback...`);

            // Fallback Logic
            if (provider.name === 'MercadoPago') {
                console.log(`[PaymentRouter] Fallback to Stripe.`);
                return await this.stripe.createPaymentSession(context.userId, priceId, context.currency);
            }

            throw error; // Re-throw if no fallback available
        }
    }
}

