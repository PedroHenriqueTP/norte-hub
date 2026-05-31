import { notFound } from "next/navigation";
import { fetchProductById } from "@/lib/product-actions";
import ProductForm from "../product-form";

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const { id } = await params;
    const product = await fetchProductById(id);

    if (!product) {
        notFound();
    }

    // Convert Decimal to number/string for client component if needed, 
    // but for simplicity passing as is (React Server Components serialize Decimals often as string or need helper)
    // Let's ensure simple type compatibility
    const serializedProduct = {
        ...product,
        price: product.price.toString(),
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Editar Produto</h1>
                <p className="text-muted-foreground">Atualize as informações do seu produto.</p>
            </div>
            <ProductForm product={serializedProduct} />
        </div>
    );
}
