export type Category = 'Utilitários' | 'Roupas' | 'Casa' | 'Naturais';

export interface Product {
    id: string;
    title: string;
    shortDescription: string;
    price: number;
    category: Category;
    imageUrl: string;
    inStock: boolean;
    isFeatured?: boolean;
}
