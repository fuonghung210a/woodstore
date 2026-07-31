import Link from 'next/link';
import { api, Category } from '@/lib/api';

const WOOD_SPECIES_VI: Record<string, string> = {
  HUONG: 'Gỗ hương',
  TRAC: 'Gỗ trắc',
  MUN: 'Gỗ mun',
  GO_DO: 'Gỗ gõ đỏ',
  CAM_LAI: 'Gỗ cẩm lai',
  SON_TA: 'Gỗ sơn ta',
  THONG: 'Gỗ thông',
  SUAN: 'Gỗ xoan',
  KHAC: 'Khác',
};

export function formatPrice(amount: number, currency = 'VND'): string {
  if (currency === 'VND') {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(
    amount,
  );
}

export function woodSpeciesName(species: string): string {
  return WOOD_SPECIES_VI[species] ?? species;
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export async function Header() {
  let categories: Category[] = [];
  try {
    categories = await api.listCategories();
  } catch {
    // Backend chưa chạy — hiển thị header không có categories
  }

  return (
    <header className="sticky top-0 z-50 bg-rice/95 backdrop-blur-sm border-b border-walnut/10">
      <div className="max-w-container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        {/* Brand — serif + gold accent */}
        <Link href="/" className="flex items-baseline gap-2 group">
          <span className="font-serif text-2xl font-bold text-walnut-dark group-hover:text-walnut transition-colors">
            Heritage Artistry
          </span>
          <span className="hidden md:inline text-label-sm text-gold uppercase tracking-widest">
            — Woodcraft
          </span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/products"
            className="text-label-md uppercase tracking-wider text-walnut hover:text-gold transition-colors"
          >
            Sản phẩm
          </Link>
          <div className="relative group">
            <button className="text-label-md uppercase tracking-wider text-walnut hover:text-gold transition-colors">
              Danh mục
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 hidden group-hover:block">
              <div className="bg-rice border border-gold/40 shadow-heritage-lg rounded min-w-[220px] py-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="block px-5 py-2.5 text-body-md text-ink hover:text-mahogany hover:bg-rice-dim transition-colors"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <Link
            href="/blog"
            className="text-label-md uppercase tracking-wider text-walnut hover:text-gold transition-colors"
          >
            Tinh hoa
          </Link>
        </nav>

        <Link href="/products" className="btn-gold !px-5 !py-2.5">
          Khám phá
        </Link>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="bg-walnut-dark text-rice/90">
      {/* Cloud divider */}
      <div className="cloud-divider bg-rice" />

      <div className="max-w-container mx-auto px-4 md:px-8 py-14 grid md:grid-cols-3 gap-10">
        <div>
          <h3 className="font-serif text-2xl font-bold text-rice mb-3">
            Heritage Artistry
          </h3>
          <p className="text-body-md text-rice/70 leading-relaxed">
            Đồ gỗ mỹ nghệ thủ công Việt Nam. Mỗi sản phẩm là một tác phẩm
            được chế tác bởi những nghệ nhân tâm huyết.
          </p>
        </div>
        <div>
          <h4 className="section-label !text-gold mb-4 !after:bg-gold/30">
            Danh mục
          </h4>
          <ul className="text-body-md space-y-2.5 text-rice/70">
            <li>Tượng phong thủy</li>
            <li>Tượng Phật &amp; Linh vật</li>
            <li>Đồ thờ cúng</li>
            <li>Vòng tay &amp; Chuỗi hạt</li>
          </ul>
        </div>
        <div>
          <h4 className="section-label !text-gold mb-4 !after:bg-gold/30">
            Liên hệ
          </h4>
          <ul className="text-body-md space-y-2.5 text-rice/70">
            <li>📍 Làng nghề truyền thống</li>
            <li>📞 0987 654 321</li>
            <li>✉️ hello@heritage.vn</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-rice/10 py-5 text-center text-label-sm text-rice/50 uppercase tracking-wider">
        © {new Date().getFullYear()} Heritage Artistry — Đồ gỗ mỹ nghệ thủ công
      </div>
    </footer>
  );
}
