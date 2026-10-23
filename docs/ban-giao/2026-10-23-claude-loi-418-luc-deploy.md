# Lỗi React #418 chỉ xuất hiện lúc deploy — claude, 23/10/2026

**Nhánh / PR:** `claude/ghi-chu-loi-418`

## Đã làm
- Đính chính `2026-10-23-claude-gop-nut-noi.md`: lỗi #418 (hydration) KHÔNG phải
  lỗi code có sẵn. Đo bằng tab mới tinh mỗi lần (công cụ đọc console chỉ ghi lần
  tải đầu của mỗi tab): web thật 0/3, bản dựng sạch trên máy 0/4, kể cả món
  nhiều phân loại (A9 Mini Ultimate +).
- Lỗi chỉ gặp khi HTML và JavaScript đến từ HAI bản dựng khác nhau: vài phút
  Hostinger đang deploy, hoặc trên máy khi dựng lại `out/` lúc tab cũ còn mở.
  React tự dựng lại phía trình duyệt, khách không thấy gì khác.

## AI sau cần biết
- Gặp #418 thì đo lại bằng tab MỚI sau khi deploy xong hẳn, trước khi sửa gì.
  Lần "bỏ ô phân loại → hết lỗi" hôm nay là trùng hợp, đừng tin một lần đo.
- HTML trên Hostinger không bị CDN lưu đệm (`x-hcdn-cache-status: DYNAMIC`).
