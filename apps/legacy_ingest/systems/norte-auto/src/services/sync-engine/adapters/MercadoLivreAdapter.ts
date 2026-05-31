import { IMarketplaceAdapter } from "../interfaces/IMarketplaceAdapter";
import { mapRemoteProductToLocal } from "@/utils/mappers";

export class MercadoLivreAdapter implements IMarketplaceAdapter {
    name = "MercadoLivre";

    async authenticate(config: any): Promise<void> {
        // OAuth2 Refresh Token logic would go here
        console.log(`[ML] Authenticating with Access Token...`);
    }

    async syncProducts(userId: string): Promise<void> {
        console.log(`[ML] Fetching items for user ${userId}...`);
        // Mock API call
        const items = [{ id: 'MLB123', title: 'Produto Teste ML', price: 100, available_quantity: 10 }];

        const mapped = items.map(i => mapRemoteProductToLocal(i, 'mercadolivre'));
        console.log(`[ML] Synced ${mapped.length} products.`);
    }

    async exportProduct(userId: string, productId: string): Promise<void> {
        console.log(`[ML] Exporting product ${productId} to Mercado Livre...`);
    }

    async updateStock(userId: string, sku: string, quantity: number): Promise<void> {
        console.log(`[ML] Updating stock for ${sku} to ${quantity}...`);
    }

    async syncOrders(userId: string): Promise<void> {
        console.log(`[ML] Syncing orders...`);
    }
}
