import type { Metadata } from 'next';
import { Libre_Caslon_Text, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const libreCaslon = Libre_Caslon_Text({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Heritage Artistry - Đồ gỗ mỹ nghệ thủ công',
    template: '%s | Heritage Artistry',
  },
  description:
    'Cửa hàng đồ gỗ mỹ nghệ thủ công: tượng phong thủy, đồ thờ cúng, vòng tay trầm hương... Chế tác bởi các nghệ nhân lành nghề.',
  keywords: [
    'đồ gỗ mỹ nghệ',
    'tượng phong thủy',
    'gỗ hương',
    'gỗ trắc',
    'vòng tay trầm hương',
    'đồ thờ cúng',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${libreCaslon.variable} ${plusJakarta.variable}`}>
      <body className="bg-rice text-ink font-sans">{children}</body>
    </html>
  );
}
