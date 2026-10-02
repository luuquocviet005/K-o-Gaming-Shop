import type { Metadata } from "next";
import { site, ANH_CHIA_SE } from "@/lib/site";
import { KhungTrang, viewportChung } from "./khung-trang";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),

  /*
   * Thẻ canonical: nói cho Google biết đâu là địa chỉ CHÍNH THỨC của trang.
   *
   * Cần vì máy chủ trả về cùng một nội dung ở cả keogaminggear.com lẫn
   * www.keogaminggear.com. Không có thẻ này thì Google coi đó là hai trang web
   * khác nhau, chia đôi uy tín giữa hai bản và tự chọn bản nào hiện ra —
   * đã thấy cả hai bản cùng xuất hiện trong kết quả tìm kiếm.
   *
   * Mỗi trang tự khai canonical riêng trong generateMetadata. KHÔNG khai ở đây
   * một lần cho tất cả, vì trang con sẽ thừa hưởng và cùng trỏ về trang chủ.
   */
  alternates: { canonical: "/" },
  /*
   * Tiêu đề trang chủ mở đầu bằng "Gaming Gear Đà Nẵng" — đúng cụm khách gõ
   * vào Google. Tiêu đề là tín hiệu mạnh nhất để Google khớp trang với từ khoá;
   * tên shop để cuối vì ai tìm đúng tên shop thì đằng nào cũng ra.
   * Giữ ≤ 70 ký tự (scripts/audit.mjs kiểm tra), dài hơn Google cắt mất.
   */
  title: {
    default: `Gaming Gear Đà Nẵng — Chuột, Bàn Phím Cũ & Mới | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "gaming gear Đà Nẵng",
    "gear Đà Nẵng",
    "chuột gaming Đà Nẵng",
    "bàn phím cơ Đà Nẵng",
    "gaming gear",
    "chuột gaming",
    "bàn phím cơ",
    "tai nghe gaming",
    "ghế gaming",
    "tay cầm chơi game",
    "màn hình gaming",
    "kẹo gaming shop",
  ],
  /*
   * Thẻ xem trước khi dán link vào Zalo / Messenger / Facebook.
   *
   * Ảnh mặc định dùng cho trang chủ và các trang không gắn với một món cụ thể.
   * Trang sản phẩm và trang danh mục tự đè lên bằng ảnh thật của hàng — xem
   * generateMetadata ở san-pham/[slug] và danh-muc/[slug].
   *
   * Thiếu ảnh thì Zalo/Facebook hiện một ô xám trống, khách lướt qua luôn.
   */
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    images: [
      {
        url: ANH_CHIA_SE,
        width: 1200,
        height: 630,
        alt: `${site.name} — ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [ANH_CHIA_SE],
  },
  robots: { index: true, follow: true },
};

export const viewport = viewportChung;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <KhungTrang>{children}</KhungTrang>;
}
