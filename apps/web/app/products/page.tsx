import Link from 'next/link';
import { api } from '@/lib/api';
import { Header, Footer } from '@/components/layout';
import { ProductGrid } from '@/components/product-card';
import { ProductFilters } from '@/components/product-filters';

export const metadata = {
  title: 'Sản phẩm đồ gỗ mỹ nghệ',
  description:
    'Danh sách sản phẩm đồ gỗ mỹ nghệ: tượng phong thủy, tượng Phật, đồ thờ cúng, vòng tay trầm hương. Lọc theo loại gỗ, khoảng giá.',
};

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    woodSpecies?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const resolvedSearchParams = await searchParams;
  const page = Number(resolvedSearchParams.page) || 1;
  const result = await api.listProducts({
    page,
    limit: 12,
    search: resolvedSearchParams.search,
    woodSpecies: resolvedSearchParams.woodSpecies,
    minPrice: resolvedSearchParams.minPrice ? Number(resolvedSearchParams.minPrice) : undefined,
    maxPrice: resolvedSearchParams.maxPrice ? Number(resolvedSearchParams.maxPrice) : undefined,
  });

  const totalPages = Math.max(1, result.totalPages);

  function buildPageUrl(p: number): string {
    const params = new URLSearchParams();
    if (p > 1) params.set('page', String(p));
    if (resolvedSearchParams.search) params.set('search', resolvedSearchParams.search);
    if (resolvedSearchParams.woodSpecies)
      params.set('woodSpecies', resolvedSearchParams.woodSpecies);
    if (resolvedSearchParams.minPrice) params.set('minPrice', resolvedSearchParams.minPrice);
    if (resolvedSearchParams.maxPrice) params.set('maxPrice', resolvedSearchParams.maxPrice);
    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ''}`;
  }

  return (
    <>
      <Header />

      <main className="max-w-container mx-auto px-4 md:px-8 py-12">
        <p className="section-label !after:hidden mb-3">Bộ sưu tập</p>
        <h1 className="font-serif text-headline-md font-bold text-walnut-dark mb-10">
          Sản phẩm
        </h1>

        <div className="grid md:grid-cols-[280px_1fr] gap-10">
          {/* Filters */}
          <aside className="md:sticky md:top-24 self-start">
            <ProductFilters />
          </aside>

          {/* Products */}
          <div>
            <p className="text-label-sm text-ink-faint uppercase tracking-wider mb-6">
              {result.total} tác phẩm
              {resolvedSearchParams.search
                ? ` — kết quả cho "${resolvedSearchParams.search}"`
                : ''}
            </p>

            {result.data.length === 0 ? (
              <div className="border-double-line rounded p-16 text-center">
                <p className="text-5xl mb-4">🔍</p>
                <h2 className="font-serif text-headline-sm font-semibold text-walnut-dark">
                  Không tìm thấy sản phẩm
                </h2>
                <p className="text-body-md text-ink-soft mt-2">
                  Thử thay đổi từ khoá hoặc bộ lọc
                </p>
              </div>
            ) : (
              <ProductGrid products={result.data} />
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-3 mt-14">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (p) => (
                    <Link
                      key={p}
                      href={buildPageUrl(p)}
                      className={`min-w-10 px-4 py-2 rounded text-label-md transition-colors ${
                        p === page
                          ? 'bg-walnut text-rice'
                          : 'border border-walnut/20 text-walnut hover:border-gold'
                      }`}
                    >
                      {p}
                    </Link>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
