# Web đọc kho từ app quản lí hàng trên PC — claude, 2026-11-14

**Nhánh / PR:** web-doc-kho-tu-app, #71

## Đã làm
- `sync-sheet.mjs` đọc CSV từ app kho (`nguonKho` trong `sync.config.json`).
- Thử: products.json/da-ban.json giống hệt bản đọc từ Sheet (72 món).
- Tắt lịch Actions đọc Sheet; chạy tay cần `KHO_TU_SHEET=1`.

## Còn dở / cần chủ shop quyết
- Không.

## AI sau cần biết
- Sheet giờ là bản sao, sửa tay trên Sheet không lên web.
- App kho tắt = web đứng yên (không lỗi trang, chỉ không cập nhật).
