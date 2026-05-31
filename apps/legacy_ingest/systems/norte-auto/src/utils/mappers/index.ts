export function mapRemoteProductToLocal(remote: any, platform: string) {
    // Basic normalization logic
    switch (platform) {
        case 'mercadolivre':
            return {
                name: remote.title,
                price: remote.price,
                stock: remote.available_quantity,
                sku: remote.id, // ML uses ID often as SKU if not defined
                images: JSON.stringify(remote.pictures?.map((p: any) => p.url) || [])
            };
        case 'amazon':
            return {
                name: remote.AttributeSets[0].Title,
                price: remote.AttributeSets[0].ListPrice?.Amount,
                stock: 0, // Amazon doesn't send stock in search results usually
                sku: remote.ASIN,
                images: JSON.stringify([remote.AttributeSets[0].SmallImage?.URL])
            };
        // ... others
        default:
            return {
                name: remote.name || 'Unknown',
                price: remote.price || 0,
                stock: remote.stock || 0,
                sku: remote.sku || '',
                images: '[]'
            };
    }
}

export function mapRemoteOrderToLocal(remote: any, platform: string) {
    // Basic normalization
    switch (platform) {
        case 'mercadolivre':
            return {
                orderId: remote.id.toString(),
                total: remote.total_amount,
                status: remote.status,
                customer: remote.buyer?.nickname,
                platform: 'MercadoLivre'
            };
        // ... others
        default:
            return {
                orderId: remote.id || '0',
                total: remote.total || 0,
                status: remote.status || 'pending',
                customer: 'Unknown',
                platform: platform
            };
    }
}
