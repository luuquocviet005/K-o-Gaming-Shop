# Sửa khớp nhầm thư mục ảnh Blackwidow - javis, 02/11/2026

**Nhánh / PR:** `javis/khop-anh-blackwidow`

## Đã làm
- Thư mục `Razer Blackwidow v4 75%` (món đã bán 31/10) đạt điểm 1 với cả món đã bán lẫn món đang bán `Razer Blackwidow v4 75% Pro`. Bằng điểm nên nó được gán cho món đang bán và giành chỗ, thư mục `Razer Blackwidow v4 75% Pro` thật bị loại "Trùng đích".
- `timSanPham` (`scripts/lib/khop-ten.mjs`) trả thêm `thua`: số từ tên món có mà tên thư mục không có.
- `scripts/nap-anh.mjs`: bằng điểm thì bên ít `thua` hơn thắng, ở cả chỗ chọn đã bán/đang bán và chỗ xếp thứ tự thư mục.
- Thêm `scripts/kiem-tra-khop-ten.mjs` vào `npm run check`.

## Còn dở / cần chủ shop quyết
- Không có. Lượt nạp ảnh kế tiếp sẽ gán đúng ảnh cho `Razer Blackwidow v4 75% Pro`.

## AI sau cần biết
- Món đang bán và món đã bán cùng khít tên (đăng lại món cũ) thì `thua` bằng nhau, món đang bán vẫn thắng như trước.
