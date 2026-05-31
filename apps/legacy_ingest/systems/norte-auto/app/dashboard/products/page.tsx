import { fetchProducts } from "@/lib/product-actions";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default async function ProductsPage() {
    const products = await fetchProducts();

    // Serialization: Prisma Decimals need to be converted for Client Components
    // and dates to strings if passing to standard props, though Server Components handle Dates mostly ok.
    // We'll map explicitly to be safe and match the `Product` type in `columns.tsx`
    const formattedProducts = products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        price: p.price.toString(), // Convert Decimal to string
        stock: p.stock,
        images: p.images,
        createdAt: p.createdAt.toISOString()
    }));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
                    <p className="text-muted-foreground">Gerencie seu catálogo unificado.</p>
                </div>
            </div>

            <DataTable columns={columns} data={formattedProducts} />
        </div>
    );
}
