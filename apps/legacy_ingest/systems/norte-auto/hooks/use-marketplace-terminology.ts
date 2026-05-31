type Terminology = {
    taxIdLabel: string;
    paymentMethods: string[];
    currency: string;
    taxLabel: string;
};

const TERMS: Record<string, Terminology> = {
    BR: {
        taxIdLabel: 'CPF/CNPJ',
        paymentMethods: ['Boleto', 'Pix', 'Cartão Parcelado'],
        currency: 'BRL',
        taxLabel: 'ICMS/IPI',
    },
    US: {
        taxIdLabel: 'SSN/EIN',
        paymentMethods: ['Credit Card', 'ACH', 'PayPal'],
        currency: 'USD',
        taxLabel: 'Sales Tax',
    },
    EU: {
        taxIdLabel: 'VAT Number',
        paymentMethods: ['SEPA Transfer', 'Credit Card'],
        currency: 'EUR',
        taxLabel: 'VAT (OSS)',
    },
    // Default
    DEFAULT: {
        taxIdLabel: 'Tax ID',
        paymentMethods: ['Credit Card'],
        currency: 'USD',
        taxLabel: 'Tax',
    }
};

export function useMarketplaceTerminology(region: string = 'BR') {
    return TERMS[region] || TERMS.DEFAULT;
}
