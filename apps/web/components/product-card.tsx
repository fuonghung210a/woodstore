import Link from 'next/link';
import { Product } from '@/lib/api';
import { formatPrice, woodSpeciesName } from '@/components/layout';

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="card-frameless"
    >
      {/* Image — full-bleed with cloud watermark */}
      <div className="cloud-watermark aspect-square bg-rice-dim rounded overflow-hidden">
        {product.images.length > 0 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.images[0]}
            alt={product.name}
            className="card-image w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🪵
          </div>
        )}
        {product.isOneOfAKind && (
          <span className="absolute top-3 right-3 z-10 bg-rice/90 text-label-sm text-mahogany uppercase tracking-wider px-3 py-1 rounded-full">
            Độc bản
          </span>
        )}
      </div>

      {/* Frameless content */}
      <div className="pt-4">
        <p className="text-label-sm text-mahogany uppercase tracking-widest">
          {woodSpeciesName(product.woodSpecies)}
        </p>
        <h3 className="font-serif text-headline-sm font-semibold text-walnut-dark mt-1 line-clamp-1 group-hover:text-walnut transition-colors">
          {product.name}
        </h3>
        {product.artisan && (
          <p className="text-label-sm text-ink-faint mt-1">
            {product.artisan}
          </p>
        )}
        <div className="flex items-center justify-between mt-3">
          <span className="font-sans font-semibold text-body-md text-walnut">
            {formatPrice(product.price.amount, product.price.currency)}
          </span>
          <span className="enquire-link">Enquire ✦</span>
        </div>
      </div>
    </Link>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
