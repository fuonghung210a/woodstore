import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { Header, Footer, formatDate } from '@/components/layout';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  try {
    const post = await api.getPostBySlug(params.slug);
    return {
      title: post.metaTitle ?? post.title,
      description: post.metaDescription ?? post.excerpt ?? post.title,
    };
  } catch {
    return { title: 'Bài viết' };
  }
}

// Render markdown đơn giản (heading, paragraph, list)
function renderMarkdown(content: string) {
  const blocks = content.split('\n\n');

  return blocks.map((block, i) => {
    const trimmed = block.trim();

    // Heading
    const headingMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      const Tag = (`h${Math.min(level + 1, 4)}`) as keyof JSX.IntrinsicElements;
      return (
        <Tag
          key={i}
          className={`${
            level === 1 ? 'text-2xl' : 'text-xl'
          } font-serif font-bold text-walnut-dark mt-10 mb-4`}
        >
          {text}
        </Tag>
      );
    }

    // Unordered list
    if (trimmed.split('\n').every((line) => /^[-*]\s/.test(line))) {
      return (
        <ul key={i} className="list-disc pl-6 my-5 space-y-2 text-ink-soft leading-relaxed">
          {trimmed.split('\n').map((line, j) => (
            <li key={j}>{line.replace(/^[-*]\s/, '')}</li>
          ))}
        </ul>
      );
    }

    // Ordered list
    if (trimmed.split('\n').every((line) => /^\d+\.\s/.test(line))) {
      return (
        <ol key={i} className="list-decimal pl-6 my-5 space-y-2 text-ink-soft leading-relaxed">
          {trimmed.split('\n').map((line, j) => (
            <li key={j}>{line.replace(/^\d+\.\s/, '')}</li>
          ))}
        </ol>
      );
    }

    // Paragraph
    return (
      <p key={i} className="text-body-lg text-ink-soft leading-relaxed my-5">
        {trimmed}
      </p>
    );
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  let post;
  try {
    post = await api.getPostBySlug(params.slug);
  } catch {
    notFound();
  }

  return (
    <>
      <Header />

      <main className="max-w-3xl mx-auto px-4 md:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-label-sm text-ink-faint uppercase tracking-wider mb-10">
          <Link href="/" className="hover:text-mahogany transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2 text-gold">/</span>
          <Link href="/blog" className="hover:text-mahogany transition-colors">
            Tinh hoa
          </Link>
        </nav>

        <article>
          <h1 className="font-serif font-bold text-headline-md md:text-4xl text-walnut-dark leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-label-sm text-ink-faint mt-5 mb-10">
            {post.author && (
              <span className="bg-rice-dim text-mahogany px-3 py-1 rounded-full">
                ✦ {post.author}
              </span>
            )}
            {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          </div>

          {post.coverImage && (
            <div className="cloud-watermark rounded overflow-hidden mb-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full object-cover"
              />
            </div>
          )}

          <div className="border-l-2 border-gold/30 pl-6">
            {renderMarkdown(post.content)}
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-walnut/10">
              {post.tags.map((tag) => (
                <span key={tag} className="chip-wood">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </main>

      <Footer />
    </>
  );
}
