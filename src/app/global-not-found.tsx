import type { Metadata } from "next";
import { KhungTrang, viewportChung } from "./khung-trang";
import NotFound from "./not-found";

/*
 * Trang 404 cho mọi đường dẫn không tồn tại.
 *
 * Vì sao không chỉ dùng not-found.tsx: file đó không được export `metadata`,
 * nên trang 404 thừa hưởng tiêu đề của trang chủ. Đừng vá bằng cách sửa file
 * HTML sau khi build (scripts/postbuild.mjs): Hostinger chạy web ở CHẾ ĐỘ MÁY
 * CHỦ, không dùng thư mục out/, nên bản vá kiểu đó không tới được web thật.
 * Khai ở đây thì đúng ở cả hai chế độ.
 */
export const metadata: Metadata = {
  title: "Không tìm thấy trang | KẸO GAMING SHOP",
  description:
    "Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Xem các sản phẩm gaming gear đang bán chạy tại KẸO GAMING SHOP.",
};

export const viewport = viewportChung;

export default function GlobalNotFound() {
  return (
    <KhungTrang>
      <NotFound />
    </KhungTrang>
  );
}
