import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import {
  Header,
  Footer,
  formatPrice,
  woodSpeciesName,
  formatDate,
} from '@/components/layout';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const product = await api.getProductBySlug(params.slug);
    return {
      title: product.name,
      description: product.description?.slice(0, 160) ?? product.name,
    };
  } catch {
    return { title: 'Sản phẩm' };
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  let product;
  try {
    product = await api.getProductBySlug(params.slug);
  } catch {
    notFound();
  }

  const related = product.categoryId
    ? await api
        .listProducts({ categoryId: product.categoryId, limit: 4 })
        .catch(() => null)
    : null;

  return (
    <>
      <Header />

      <main className="max-w-container mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-label-sm text-ink-faint uppercase tracking-wider mb-10">
          <Link href="/" className="hover:text-mahogany transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2 text-gold">/</span>
          <Link href="/products" className="hover:text-mahogany transition-colors">
            Sản phẩm
          </Link>
          <span className="mx-2 text-gold">/</span>
          <span className="text-walnut">{product.name}</span>
        </nav>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* Image — full-bleed with cloud watermark */}
          <div className="cloud-watermark relative bg-rice-dim rounded overflow-hidden aspect-square">
            {product.images.length > 0 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-8xl">
                🪵
              </div>
            )}
            {product.isOneOfAKind && (
              <span className="img-caption">✦ Độc bản</span>
            )}
          </div>

          {/* Info */}
          <div className="py-4">
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="chip-wood">
                {woodSpeciesName(product.woodSpecies)}
              </span>
              {product.isFeatured && (
                <span className="chip-wood !text-gold">
                  Tuyển chọn
                </span>
              )}
            </div>

            <h1 className="font-serif font-bold text-headline-md text-walnut-dark mb-4 leading-tight">
              {product.name}
            </h1>

            <p className="font-sans font-semibold text-2xl text-walnut mb-8">
              {formatPrice(product.price.amount, product.price.currency)}
            </p>

            {product.description && (
              <p className="text-body-lg text-ink-soft leading-relaxed mb-8 border-l-2 border-gold/50 pl-5">
                {product.description}
              </p>
            )}

            {/* Info table — subtle double line */}
            <div className="border-double-line rounded p-6 mb-8 divide-y divide-walnut/10 bg-rice">
              {product.artisan && (
                <div className="flex justify-between py-3 text-body-md">
                  <span className="text-ink-faint">Nghệ nhân</span>
                  <span className="font-medium text-walnut">{product.artisan}</span>
                </div>
              )}
              {product.craftsmanship && (
                <div className="flex justify-between py-3 text-body-md">
                  <span className="text-ink-faint">Kỹ thuật</span>
                  <span className="font-medium text-walnut">{product.craftsmanship}</span>
                </div>
              )}
              {product.finishType && (
                <div className="flex justify-between py-3 text-body-md">
                  <span className="text-ink-faint">Hoàn thiện</span>
                  <span className="font-medium text-walnut">{product.finishType}</span>
                </div>
              )}
              {product.dimensions && (
                <div className="flex justify-between py-3 text-body-md">
                  <span className="text-ink-faint">Kích thước</span>
                  <span className="font-medium text-walnut">
                    {product.dimensions.lengthCm} × {product.dimensions.widthCm}{' '}
                    × {product.dimensions.heightCm} cm
                  </span>
                </div>
              )}
              {product.weightKg != null && (
                <div className="flex justify-between py-3 text-body-md">
                  <span className="text-ink-faint">Cân nặng</span>
                  <span className="font-medium text-walnut">{product.weightKg} kg</span>
                </div>
              )}
              <div className="flex justify-between py-3 text-body-md">
                <span className="text-ink-faint">Tình trạng</span>
                {product.stockQuantity > 0 ? (
                  <span className="font-medium text-mahogany">
                    Còn hàng ({product.stockQuantity})
                  </span>
                ) : (
                  <span className="font-medium text-error">Liên hệ đặt làm</span>
                )}
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-wrap gap-4">
              <a
                href="tel:0987654321"
                className="btn-gold"
              >
                Liên hệ đặt hàng
              </a>
              {product.category && (
                <Link
                  href={`/categories/${product.category.slug}`}
                  className="btn-ghost"
                >
                  Xem danh mục
                </Link>
              )}
            </div>

            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-8">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="chip-wood !bg-rice-dim"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-label-sm text-ink-faint mt-8">
              Cập nhật: {formatDate(product.updatedAt)}
            </p>
          </div>
        </div>

        {/* Related products */}
        {related && related.data.length > 1 && (
          <section className="mt-24">
            <div className="flex items-center gap-6 mb-12">
              <p className="section-label !after:hidden">Cùng bộ sưu tập</p>
              <div className="flex-1 h-px bg-gold/40" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
              {related.data
                .filter((p) => p.id !== product.id)
                .slice(0, 4)
                .map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.slug}`}
                    className="card-frameless"
                  >
                    <div className="cloud-watermark aspect-square bg-rice-dim rounded overflow-hidden">
                      {p.images.length > 0 ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="card-image w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">
                          🪵
                        </div>
                      )}
                    </div>
                    <div className="pt-3">
                      <h3 className="font-serif text-headline-sm font-semibold text-walnut-dark line-clamp-1 group-hover:text-walnut transition-colors">
                        {p.name}
                      </h3>
                      <p className="font-sans font-semibold text-body-md text-walnut mt-1">
                        {formatPrice(p.price.amount, p.price.currency)}
                      </p>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
