import { IMarketplaceAdapter } from "../interfaces/IMarketplaceAdapter";

export class WoocommerceAdapter implements IMarketplaceAdapter {
    name = "Woocommerce";

    async authenticate(config: any): Promise<void> {
        console.log(`[Woo] Basic Auth with Consumer Key / Secret...`);
    }

    async syncProducts(userId: string): Promise<void> {
        console.log(`[Woo] GET /wp-json/wc/v3/products...`);
    }

    async exportProduct(userId: string, productId: string): Promise<void> {
        console.log(`[Woo] POST /products...`);
    }

    async updateStock(userId: string, sku: string, quantity: number): Promise<void> {
        console.log(`[Woo] PUT /products (update stock_quantity)...`);
    }

    async syncOrders(userId: string): Promise<void> {
        console.log(`[Woo] GET /orders...`);
    }
}
