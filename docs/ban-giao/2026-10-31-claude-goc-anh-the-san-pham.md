# Sắp lại góc ảnh thẻ sản phẩm

- Chủ shop yêu cầu: nhãn loại hàng (Pad chuột, Bàn phím…) lên góc trái ảnh,
  tình trạng sang góc phải, bỏ chữ "Đà Nẵng" (shop chỉ bán ở Đà Nẵng), dòng
  tên hãng trả lại như cũ.
- Hai nhãn nằm chung một hàng flex-wrap: thẻ hẹp + tình trạng dài thì tình
  trạng xuống dòng thay vì đè nhãn loại.
- File: `src/components/product-card.tsx`, `docs/kien-thuc/giao-dien.md`.
- Bộ lọc địa điểm trong `product-browser.tsx` vẫn giữ nguyên.
