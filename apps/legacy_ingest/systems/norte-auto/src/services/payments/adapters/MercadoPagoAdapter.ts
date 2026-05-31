import { IPaymentProvider, PaymentIntentResult, TaxRate } from "../interfaces/IPaymentProvider";

export class MercadoPagoAdapter implements IPaymentProvider {
    name = "MercadoPago";

    async createPaymentSession(userId: string, priceId: string, currency: string): Promise<PaymentIntentResult> {
        console.log(`[MercadoPago] Creating preference for user ${userId}, price ${priceId}`);

        // Mock API Call to MercadoPago
        return {
            success: true,
            transactionId: `mp_${Math.random().toString(36).substring(7)}`,
            status: 'pending',
            amount: 100, // fetch from priceId
            currency: currency,
            checkoutUrl: "https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=..."
        };
    }

    async getTaxRates(countryCode: string): Promise<TaxRate[]> {
        if (countryCode === 'BR') {
            return [{ id: 'iss', percentage: 5.0, inclusive: true, description: 'ISSQN' }];
        }
        return [];
    }
}
