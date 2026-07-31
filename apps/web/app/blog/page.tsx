import Link from 'next/link';
import { api } from '@/lib/api';
import { Header, Footer, formatDate } from '@/components/layout';

export const metadata = {
  title: 'Tinh hoa - Kiến thức đồ gỗ mỹ nghệ',
  description:
    'Kiến thức về đồ gỗ mỹ nghệ: cách phân biệt gỗ thật giả, ý nghĩa phong thủy, cách bảo quản sản phẩm gỗ.',
};

export default async function BlogPage() {
  const result = await api.listPublishedPosts(1, 20);

  return (
    <>
      <Header />

      <main className="max-w-container mx-auto px-4 md:px-8 py-12">
        <p className="section-label !after:hidden mb-3">Tinh hoa</p>
        <h1 className="font-serif text-headline-md font-bold text-walnut-dark mb-4">
          Kiến thức đồ gỗ
        </h1>
        <p className="text-body-lg text-ink-soft mb-12 max-w-2xl">
          Chia sẻ kiến thức về gỗ quý, phong thủy và cách chăm sóc đồ gỗ mỹ
          nghệ — từ những nghệ nhân nhiều đời giữ lửa làng nghề
        </p>

        {result.data.length === 0 ? (
          <div className="border-double-line rounded p-16 text-center">
            <p className="text-5xl mb-4">📖</p>
            <h2 className="font-serif text-headline-sm font-semibold text-walnut-dark">
              Chưa có bài viết
            </h2>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {result.data.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.slug}`}
                className="group bg-rice rounded overflow-hidden shadow-heritage hover:shadow-heritage-lg transition-shadow flex flex-col"
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
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-label-sm text-ink-faint uppercase tracking-wider">
                    {post.publishedAt ? formatDate(post.publishedAt) : ''}
                    {post.author ? ` • ${post.author}` : ''}
                  </p>
                  <h2 className="font-serif text-headline-sm font-semibold text-walnut-dark group-hover:text-walnut transition-colors mt-2 line-clamp-2">
                    {post.title}
                  </h2>
                  {post.excerpt && (
                    <p className="text-body-md text-ink-soft mt-2 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 mt-4">
                    {post.tags.map((tag) => (
                      <span key={tag} className="chip-wood !bg-rice-dim">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
