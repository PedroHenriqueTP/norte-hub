export interface IMarketplaceAdapter {
    name: string;

    // Auth
    authenticate(config: any): Promise<void>;

    // Product Sync
    syncProducts(userId: string): Promise<void>;
    exportProduct(userId: string, productId: string): Promise<void>;
    updateStock(userId: string, sku: string, quantity: number): Promise<void>;

    // Order Sync
    syncOrders(userId: string): Promise<void>;
}
