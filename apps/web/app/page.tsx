import Link from 'next/link';
import { api } from '@/lib/api';
import { Header, Footer, formatDate } from '@/components/layout';
import { ProductGrid } from '@/components/product-card';

export const metadata = {
  title: 'Đồ gỗ mỹ nghệ thủ công - Tượng phong thủy, đồ thờ cúng',
  description:
    'Heritage Artistry - cửa hàng đồ gỗ mỹ nghệ thủ công: tượng phong thủy gỗ hương, tượng Phật, đồ thờ cúng, vòng tay trầm hương. Chế tác bởi nghệ nhân lành nghề.',
};

export default async function HomePage() {
  let homepage;
  let latestPosts;
  try {
    [homepage, latestPosts] = await Promise.all([
      api.getHomepage(),
      api.listPublishedPosts(1, 3),
    ]);
  } catch {
    return (
      <>
        <Header />
        <main className="max-w-container mx-auto px-4 py-20 text-center">
          <h1 className="font-serif text-headline-md font-bold text-walnut-dark">
            Backend chưa hoạt động
          </h1>
          <p className="mt-4 text-ink-soft">
            Vui lòng khởi động product service trên cổng 3001 rồi tải lại trang.
          </p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      {/* Hero — walnut dark + gold accents */}
      <section className="bg-walnut-dark text-rice relative overflow-hidden">
        {/* Subtle cloud motif at low opacity */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 120' fill='none'%3E%3Cpath d='M30 60c0-10 8-18 18-18s18 8 18 18c-10 3-18 10-18 20-8-3-14-8-18-20zM120 50c0-8 6-14 14-14s14 6 14 14c-8 2-14 8-14 15-6-2-10-7-14-15zM190 70c0-9 7-16 16-16' stroke='%23D4AF37' stroke-width='2'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 120px',
          }}
        />

        <div className="max-w-container mx-auto px-4 md:px-8 py-24 md:py-32 text-center relative">
          <p className="text-label-sm text-gold uppercase tracking-[0.2em] mb-6">
            ✦ Tinh hoa làng nghề Việt ✦
          </p>
          <h1 className="font-serif font-bold text-display-mobile md:text-display-lg text-rice mb-6">
            Đồ gỗ mỹ nghệ thủ công
          </h1>
          <p className="text-body-lg text-rice/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Từ bàn tay các nghệ nhân làng nghề — tượng phong thủy, đồ thờ
            cúng và những món quà mang hồn Việt
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/products" className="btn-gold">
              Khám phá sản phẩm
            </Link>
            <Link href="/blog" className="btn-ghost !border-gold/60 !text-rice hover:!bg-gold/10">
              Đọc tinh hoa
            </Link>
          </div>
        </div>
      </section>

      {/* Categories — double-line border */}
      <section className="max-w-container mx-auto px-4 md:px-8 py-20">
        <div className="flex items-center gap-6 mb-10">
          <p className="section-label !after:hidden">Danh mục</p>
          <div className="flex-1 h-px bg-gold/40" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {homepage.categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="border-double-line rounded p-5 text-center bg-rice hover:bg-rice-dim transition-colors group"
            >
              <span className="text-3xl block mb-3">🪵</span>
              <span className="font-serif text-body-md font-semibold text-walnut-dark group-hover:text-mahogany transition-colors">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured — rice-dim section */}
      <section className="bg-rice-dim/60 py-20">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label !after:hidden mb-3">Tuyển chọn</p>
              <h2 className="font-serif text-headline-md font-bold text-walnut-dark">
                Sản phẩm nổi bật
              </h2>
            </div>
            <Link
              href="/products"
              className="enquire-link hidden md:inline-flex"
            >
              Xem tất cả →
            </Link>
          </div>
          <ProductGrid products={homepage.featuredProducts} />
          <div className="md:hidden text-center mt-6">
            <Link href="/products" className="btn-ghost">
              Xem tất cả
            </Link>
          </div>
        </div>
      </section>

      {/* Newest */}
      <section className="max-w-container mx-auto px-4 md:px-8 py-20">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="section-label !after:hidden mb-3">Mới nhất</p>
            <h2 className="font-serif text-headline-md font-bold text-walnut-dark">
              Sản phẩm mới về
            </h2>
          </div>
          <Link href="/products" className="enquire-link hidden md:inline-flex">
            Xem tất cả →
          </Link>
        </div>
        <ProductGrid products={homepage.newestProducts} />
        <div className="md:hidden text-center mt-6">
          <Link href="/products" className="btn-ghost">
            Xem tất cả
          </Link>
        </div>
      </section>

      {/* Blog preview */}
      <section className="bg-rice-dim/60 py-20">
        <div className="max-w-container mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="section-label !after:hidden mb-3">Tinh hoa</p>
              <h2 className="font-serif text-headline-md font-bold text-walnut-dark">
                Kiến thức đồ gỗ
              </h2>
            </div>
            <Link href="/blog" className="enquire-link hidden md:inline-flex">
              Xem tất cả →
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.data.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-rice rounded overflow-hidden shadow-heritage hover:shadow-heritage-lg transition-shadow"
              >
                <div className="aspect-video bg-rice-dim flex items-center justify-center overflow-hidden relative">
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="card-image w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">📖</span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-label-sm text-ink-faint uppercase tracking-wider">
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                    {post.author ? ` • ${post.author}` : ''}
                  </p>
                  <h3 className="font-serif text-headline-sm font-semibold text-walnut-dark mt-2 line-clamp-2 group-hover:text-walnut transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-body-md text-ink-soft mt-2 line-clamp-2">
                      {post.excerpt}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
