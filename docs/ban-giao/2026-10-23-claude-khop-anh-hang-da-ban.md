# Ảnh món đã bán bị gán nhầm sang món đang bán — claude, 23/10/2026

**Nhánh / PR:** `claude/sua-khop-anh-hang-da-ban`

## Đã làm
- `scripts/nap-anh.mjs`, vòng so khớp thư mục ảnh ↔ sản phẩm, sửa hai lỗi:
  1. Trước đây chỉ hỏi kho đã bán khi kho đang bán không có gì. Thư mục ảnh
     của món đã bán (còn nằm trong `Ảnh gear`) liền nhận món đang bán nào trùng
     60% chữ: "Logitech G304 x Superlight" (đã bán) → ảnh của "G502 x Plus";
     "ATK X1 Air +" (bán sáng 23/10) → ảnh của "X1 Ultimate v2". Giờ món đã
     bán khớp chắc hơn thì thắng.
  2. Hai thư mục cùng trỏ một món thì thư mục tới trước theo chữ cái giữ món,
     nên thư mục ĐÚNG "ATK X1 Ultimate V2" (100%) bị gạt vì "trùng đích".
     Giờ khớp cả lượt trước rồi xử lý từ điểm cao xuống thấp.
- Chạy thử trên thư mục ảnh thật: G502 nhận lại đúng 5 tấm của nó, G304 vào
  danh sách đã bán. X1 Ultimate v2 đã tự lành từ lượt 11:52 vì chủ shop xoá
  thư mục X1 Air+.

## AI sau cần biết
- Không commit ảnh G502 nạp thử: để lượt 15 phút trên máy shop tự nạp, tránh
  hai bên cùng sửa `public/products/` gây xung đột rebase.
- Ngưỡng khớp mờ 60% ở `scripts/lib/khop-ten.mjs` vẫn để nguyên: quét toàn bộ
  `Ảnh gear` chỉ có 2 cặp khớp mờ — "IQUINIX EZ60" → IQUNIX EZ60 (gõ sai, đúng)
  và G304 (đã sửa bằng ưu tiên kho đã bán).
