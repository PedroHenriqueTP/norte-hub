export interface TaxRate {
    id: string;
    percentage: number;
    inclusive: boolean;
    description?: string;
}

export interface PaymentIntentResult {
    success: boolean;
    transactionId?: string;
    status: string;
    amount: number;
    currency: string;
    checkoutUrl?: string; // For redirect based flows (Stripe checkout, MercadoPago pref)
    qrCode?: string; // For PIX
    qrCodeBase64?: string; // For PIX image
}

export interface IPaymentProvider {
    name: string;

    /**
     * Creates a checkout session or payment preference
     */
    createPaymentSession(userId: string, priceId: string, currency: string): Promise<PaymentIntentResult>;

    /**
     * Process a direct one-time payment if supported (usually server-side charge, requires token)
     * For this context, we'll assume a session/redirect flow for most.
     */
    // processOneTimePayment(userId: string, amount: number, token: string): Promise<PaymentIntentResult>;

    getTaxRates(countryCode: string): Promise<TaxRate[]>;
}
