# Sửa README cho khớp cách deploy thật - javis, 2026-11-01

**Nhánh / PR:** `javis/sua-readme-deploy`

## Đã làm
- `README.md`: bỏ hướng dẫn cũ "web tĩnh, upload `out/`, đừng build trên Hostinger". Viết lại mục 3 (đưa code lên: chủ shop dùng `npm run push`, AI qua PR) và mục 4 (Hostinger tự kéo `main` và build ở chế độ máy chủ, bản xem thử theo PR, cách kiểm tra web đã nhận bản mới, workflow FTP chỉ là dự phòng đang tắt).
- Sửa mô tả `npm run build`, `npm run push`, vài dòng cây thư mục cho đúng.
- `docs/kien-thuc/deploy-va-kiem-tra.md`: thêm dòng nhắc đổi cách deploy thì sửa cả README.

## Còn dở / cần chủ shop quyết
- Mục 6 README (thanh toán online, "cần nâng cấp lên VPS") chưa rà lại, vì web đã chạy chế độ máy chủ trên Hostinger. Để khi nào làm thanh toán thì xem.

## AI sau cần biết
- `next.config.ts` vẫn để `output: "export"` nhưng Hostinger chạy chế độ máy chủ; nguồn sự thật về deploy là `docs/kien-thuc/deploy-va-kiem-tra.md`.
