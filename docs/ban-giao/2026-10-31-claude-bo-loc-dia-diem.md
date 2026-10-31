# Bỏ bộ lọc địa điểm

- Shop chỉ bán ở Đà Nẵng: bỏ nhóm lọc "Hàng đang ở" trong
  `src/components/product-browser.tsx`, bỏ `diaDiem` khỏi `CardProduct`.
- Trang sản phẩm và trang chủ vẫn ghi "Hàng đang ở Đà Nẵng" (lấy từ Sheet).
- Hostinger không build lại sau khi merge thay đổi góc ảnh thẻ sản phẩm; GitHub
  không có tín hiệu deploy nào. Đã ghi bẫy vào `docs/kien-thuc/deploy-va-kiem-tra.md`.
