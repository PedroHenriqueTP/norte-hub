import { IMarketplaceAdapter } from "../interfaces/IMarketplaceAdapter";
import crypto from 'crypto';

export class ShopeeAdapter implements IMarketplaceAdapter {
    name = "Shopee";

    private signRequest(path: string, body: string, secret: string): string {
        return crypto.createHmac('sha256', secret).update(path + body).digest('hex');
    }

    async authenticate(config: any): Promise<void> {
        console.log(`[Shopee] Computing HMAC signature for auth...`);
    }

    async syncProducts(userId: string): Promise<void> {
        console.log(`[Shopee] Syncing products...`);
    }

    async exportProduct(userId: string, productId: string): Promise<void> {
        console.log(`[Shopee] Creating item...`);
    }

    async updateStock(userId: string, sku: string, quantity: number): Promise<void> {
        console.log(`[Shopee] Updating stock...`);
    }

    async syncOrders(userId: string): Promise<void> {
        console.log(`[Shopee] Getting order list...`);
    }
}
