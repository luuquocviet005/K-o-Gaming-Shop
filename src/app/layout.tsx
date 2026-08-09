import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { themeInitScript } from "@/components/theme-toggle";

// Font được tải về lúc build và self-host -> không gọi ra Google khi người dùng
// truy cập (nhanh hơn, không lộ IP người dùng cho bên thứ ba).
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "gaming gear",
    "chuột gaming",
    "bàn phím cơ",
    "tai nghe gaming",
    "ghế gaming",
    "tay cầm chơi game",
    "màn hình gaming",
    "kẹo gaming shop",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  // Không đặt maximumScale/userScalable — người dùng phải luôn phóng to được
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eaefec" },
    { media: "(prefers-color-scheme: dark)", color: "#080d0a" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Đặt theme trước khi trang vẽ, tránh nháy sáng khi đang ở chế độ tối */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className={`${inter.variable} ${sora.variable} antialiased`}>
        <a
          href="#noi-dung"
          className="sr-only-focusable left-4 top-4 z-[100] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
        >
          Bỏ qua, tới nội dung chính
        </a>

        <CartProvider>
          <Header />
          <main id="noi-dung">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
