import type { Viewport } from "next";
import { Baloo_2, Inter } from "next/font/google";
import "./globals.css";
import { site, ANH_CHIA_SE } from "@/lib/site";
import { CartProvider } from "@/lib/cart";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DoLuotKhach } from "@/components/do-luot-khach";
import { DoLienHe } from "@/components/do-lien-he";
import { themeInitScript } from "@/components/theme-toggle";

// Font được tải về lúc build và self-host -> không gọi ra Google khi người dùng
// truy cập (nhanh hơn, không lộ IP người dùng cho bên thứ ba).
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

// Font tiêu đề PHẢI có bộ ký tự "vietnamese". Font chỉ có "latin" sẽ khiến
// mọi chữ có dấu (KẸO, ngọt, như, kẹo) rơi sang font dự phòng của hệ điều
// hành — chữ có dấu và không dấu trông khác hẳn nhau.
//
// Baloo 2 mập và bo tròn, gợi chữ in trên vỏ kẹo — hợp cái tên KẸO hơn font
// vuông vức trước đây, mà vẫn đủ đậm để làm tiêu đề bán hàng.
const baloo = Baloo_2({
  subsets: ["latin", "vietnamese"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

export const viewportChung: Viewport = {
  // Không đặt maximumScale/userScalable — người dùng phải luôn phóng to được
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf7f9" },
    { media: "(prefers-color-scheme: dark)", color: "#140a10" },
  ],
};

/**
 * Khai báo cửa hàng cho Google.
 *
 * Đây là một tiệm có địa chỉ thật, không phải shop online thuần. Khai kiểu
 * `Store` giúp Google hiểu đúng và có cơ sở hiện khung thông tin cửa hàng
 * (tên, địa chỉ, giờ mở cửa, số điện thoại) khi khách tìm theo tên shop —
 * thay vì chỉ một dòng link trơ trọi.
 *
 * `sameAs` nối tới Facebook/TikTok để Google biết mấy trang đó là cùng một
 * cửa hàng, gom uy tín về một mối.
 *
 * `alternateName` khai luôn tên "Kẹo Gaming Gear" — tên miền là
 * keogaminggear.com và hồ sơ Google Business cũng đăng ký tên đó, trong khi
 * trên web mọi chỗ đều ghi "KẸO GAMING SHOP". Không khai thì Google phải tự
 * đoán hai cái tên có phải cùng một tiệm không, và nó hay đoán là KHÔNG —
 * làm chậm bước xác minh hồ sơ doanh nghiệp và chia nhỏ uy tín thương hiệu.
 *
 * Mọi số liệu ở đây lấy từ src/lib/site.ts — không bịa, không ghi thứ shop
 * không làm được.
 */
const jsonLdCuaHang = {
  "@context": "https://schema.org",
  "@type": "Store",
  "@id": `${site.url}/#cua-hang`,
  name: site.name,
  alternateName: "Kẹo Gaming Gear",
  description: site.description,
  url: site.url,
  image: `${site.url}${ANH_CHIA_SE}`,
  telephone: site.contact.phone.replace(/\s/g, ""),
  email: site.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: "Lô 19 B2 124 Khu đô thị công nghệ FPT, phường Hoà Hải",
    addressLocality: "Quận Ngũ Hành Sơn",
    addressRegion: "Đà Nẵng",
    addressCountry: "VN",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "09:00",
      closes: "21:00",
    },
  ],
  currenciesAccepted: "VND",
  sameAs: [site.social.facebook, site.social.tiktok],
};

/**
 * Khung chung của mọi trang: font, menu, chân trang, giỏ hàng, đo lượt khách.
 *
 * Tách riêng vì trang 404 (global-not-found.tsx) không đi qua layout.tsx mà
 * phải tự dựng <html> — dùng chung khung này để 404 trông y hệt trang thường.
 */
export function KhungTrang({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        {/* Đặt theme trước khi trang vẽ, tránh nháy sáng khi đang ở chế độ tối */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCuaHang) }}
        />
      </head>
      <body className={`${inter.variable} ${baloo.variable} antialiased`}>
        <a
          href="#noi-dung"
          className="sr-only-focusable left-4 top-4 z-[100] rounded-full bg-primary px-5 py-3 text-sm font-semibold text-on-primary"
        >
          Bỏ qua, tới nội dung chính
        </a>

        {/* Sọc kẹo trên đỉnh trang — thuần trang trí */}
        <div aria-hidden="true" className="soc-keo h-1.5 w-full" />

        <CartProvider>
          <Header />
          <main id="noi-dung">{children}</main>
          <Footer />
        </CartProvider>

        {/* Đo lượt khách — im lặng hoàn toàn khi site.ga4 còn trống */}
        <DoLuotKhach />
        <DoLienHe />
      </body>
    </html>
  );
}
