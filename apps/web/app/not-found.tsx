import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-rice flex items-center justify-center">
      <div className="text-center px-4">
        <p className="text-8xl mb-6">🪵</p>
        <h1 className="font-serif text-headline-md font-bold text-walnut-dark mb-3">
          Không tìm thấy trang
        </h1>
        <p className="text-body-md text-ink-soft mb-10">
          Trang bạn tìm kiếm không tồn tại hoặc đã bị xoá
        </p>
        <Link href="/" className="btn-gold">
          Về trang chủ
        </Link>
      </div>
    </main>
  );
}
