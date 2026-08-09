import type { CardProduct, Product } from "@/lib/products";

/** Định dạng tiền Việt: 3190000 -> "3.190.000₫" */
export function formatVND(amount: number): string {
  return `${Math.round(amount).toLocaleString("vi-VN")}₫`;
}

/**
 * Hiển thị giá của một sản phẩm, xử lý cả 3 trường hợp có thật trong Sheet:
 *   - Giá thường          -> "1.200.000₫"
 *   - Khoảng giá          -> "1.300.000₫ – 1.500.000₫"
 *   - Chưa điền giá       -> "Liên hệ"
 * Switch bán lẻ có thêm đuôi "/ cái".
 */
export function formatGia(p: Pick<Product, "gia" | "giaToiDa" | "donViGia">): string {
  if (!p.gia) return "Liên hệ";
  const duoi = p.donViGia ? ` / ${p.donViGia}` : "";
  if (p.giaToiDa && p.giaToiDa !== p.gia) {
    return `${formatVND(p.gia)} – ${formatVND(p.giaToiDa)}${duoi}`;
  }
  return `${formatVND(p.gia)}${duoi}`;
}

/** Rút gọn số lượng lớn: 1240 -> "1,2k" */
export function formatCount(n: number): string {
  if (n < 1000) return String(n);
  return `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")}k`;
}

/** Câu mô tả tồn kho, dùng chung cho thẻ sản phẩm và trang chi tiết */
export function moTaTonKho(p: Pick<CardProduct, "soLuong">): {
  chu: string;
  mau: "het" | "sapHet" | "con";
} {
  if (p.soLuong <= 0) return { chu: "Đã bán hết", mau: "het" };
  if (p.soLuong === 1) return { chu: "Chỉ còn 1 chiếc", mau: "sapHet" };
  if (p.soLuong <= 3) return { chu: `Còn ${p.soLuong} chiếc`, mau: "sapHet" };
  return { chu: `Còn ${p.soLuong} chiếc`, mau: "con" };
}
