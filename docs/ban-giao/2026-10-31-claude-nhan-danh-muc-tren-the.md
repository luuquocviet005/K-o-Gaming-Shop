# Nhãn danh mục trên thẻ sản phẩm

- Khách phản ánh thẻ "ATK Crimson" không biết là món gì. Thẻ sản phẩm giờ có
  nhãn hồng "Pad chuột / Bàn phím / Chuột…" trước tên hãng.
- File: `src/lib/products.ts` (`CardProduct.tenDanhMuc`, gắn trong `toCard`),
  `src/components/product-card.tsx`, ghi chú `docs/kien-thuc/giao-dien.md`.
- Còn dở: món ở danh mục "Phụ kiện" chỉ hiện "Phụ kiện" (feet, keycap, đế sạc…)
  — muốn rõ hơn thì cần thêm cột loại trong Sheet.
