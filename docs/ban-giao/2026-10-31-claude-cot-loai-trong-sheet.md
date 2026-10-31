# Cột "Loại" trong Sheet

- `scripts/sync-sheet.mjs` đọc cột tuỳ chọn "Loại" (tab nào cũng được) thành
  `loaiHang`. Thẻ sản phẩm hiện nó ở góc trái ảnh thay tên danh mục; ô tìm
  kiếm tìm theo nó. Trống thì vẫn hiện tên danh mục như cũ.
- Phiên này không có công cụ sửa Google Sheet: cột chưa được thêm vào Sheet.
  Chủ shop thêm tiêu đề "Loại" ở tab Phụ kiện và điền (Keycap, Feet chuột, Đế
  sạc, Stream deck, Dây led…), lượt đồng bộ 20 phút sẽ tự đưa lên web.
