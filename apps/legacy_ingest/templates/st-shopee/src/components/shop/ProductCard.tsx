import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <Link href={`/produto/${product.id}`} className="group block">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-stone-100 mb-4">
                <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {!product.inStock && (
                    <div className="absolute top-2 right-2 bg-stone-900/70 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-sm">
                        Esgotado
                    </div>
                )}
            </div>
            <div className="space-y-1">
                <p className="text-xs text-stone-500 uppercase tracking-wide">{product.category}</p>
                <h3 className="font-medium text-stone-900 group-hover:text-primary transition-colors">
                    {product.title}
                </h3>
                <p className="text-sm font-semibold text-stone-700">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                </p>
            </div>
        </Link>
    );
}
