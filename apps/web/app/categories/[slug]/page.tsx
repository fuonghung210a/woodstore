import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Header, Footer } from '@/components/layout';
import { ProductGrid } from '@/components/product-card';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const categories = await api.listCategories();
    const category = categories.find((c) => c.slug === slug);
    return {
      title: category ? category.name : 'Danh mục',
      description: category?.description ?? undefined,
    };
  } catch {
    return { title: 'Danh mục' };
  }
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Lấy danh sách categories để tìm category theo slug
  const categories = await api.listCategories();
  const category = categories.find((c) => c.slug === slug);

  if (!category) {
    notFound();
  }

  // Lấy sản phẩm thuộc category
  const result = await api.listProducts({ categoryId: category.id, limit: 50 });

  return (
    <>
      <Header />

      <main className="max-w-container mx-auto px-4 md:px-8 py-12">
        <nav className="text-label-sm text-ink-faint uppercase tracking-wider mb-10">
          <Link href="/" className="hover:text-mahogany transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2 text-gold">/</span>
          <span className="text-walnut">{category.name}</span>
        </nav>

        <p className="section-label !after:hidden mb-3">Bộ sưu tập</p>
        <h1 className="font-serif text-headline-md font-bold text-walnut-dark mb-4">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-body-lg text-ink-soft mb-10 max-w-2xl">
            {category.description}
          </p>
        )}

        {result.data.length === 0 ? (
          <div className="border-double-line rounded p-16 text-center">
            <p className="text-5xl mb-4">🪵</p>
            <h2 className="font-serif text-headline-sm font-semibold text-walnut-dark">
              Danh mục chưa có sản phẩm
            </h2>
          </div>
        ) : (
          <>
            <p className="text-label-sm text-ink-faint uppercase tracking-wider mb-8">
              {result.total} tác phẩm
            </p>
            <ProductGrid products={result.data} />
          </>
        )}
      </main>

      <Footer />
    </>
  );
}
