import { IPaymentProvider, PaymentIntentResult, TaxRate } from "../interfaces/IPaymentProvider";

export class AsystemsAdapter implements IPaymentProvider {
    name = "Asystems";

    async createPaymentSession(userId: string, priceId: string, currency: string): Promise<PaymentIntentResult> {
        console.log(`[Asystems] Generating PIX/Boleto for user ${userId}`);

        // Mock Asystems API Response
        return {
            success: true,
            transactionId: `asystems_${Math.random().toString(36).substring(7)}`,
            status: 'pending',
            amount: 97.00,
            currency: 'BRL',
            qrCode: "00020126580014BR.GOV.BCB.PIX0114...",
            qrCodeBase64: "data:image/png;base64,..."
        };
    }

    async getTaxRates(countryCode: string): Promise<TaxRate[]> {
        // Asystems usually handles billing for BR services directly
        return [];
    }
}

