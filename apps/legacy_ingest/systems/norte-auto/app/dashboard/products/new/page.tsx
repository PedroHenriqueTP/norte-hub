import ProductForm from "../product-form";

export default function NewProductPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Novo Produto</h1>
                <p className="text-muted-foreground">Adicione um item ao seu catálogo.</p>
            </div>
            <ProductForm />
        </div>
    );
}
