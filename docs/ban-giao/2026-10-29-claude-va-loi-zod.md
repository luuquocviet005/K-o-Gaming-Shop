# Vá lỗ hổng zod (Hostinger) — claude, 2026-10-29

**Nhánh / PR:** claude/hostinger-errors-fix-gatijb

## Đã làm
- `zod` 4.4.3 -> 4.6.7 (CVE-2023-54404, cạn bộ nhớ khi kiểm tra dữ liệu). zod chỉ là
  phụ thuộc gián tiếp của eslint-config-next (công cụ lúc lint), không chạy trên web.
- Chỉ đổi `package-lock.json`. `npm audit` còn 0 lỗ hổng.
- Đã chạy đủ: typecheck, lint, build (124 trang), check — đều qua.

## Còn dở / cần chủ shop quyết
- Không còn.

## AI sau cần biết
- Hostinger quét lỗ hổng định kỳ và `next build` từ 16.4.0 sẽ tự dừng nếu `next` dính
  lỗ hổng đã biết (SecurityFatalError). Thấy Hostinger báo `next` thì nâng ngay,
  đừng để dồn. Hiện `next` và `eslint-config-next` ghim chính xác 16.4.1.
- PR bot Hostinger mở (nâng thiếu lockfile) thì đóng, tự làm bản đủ lockfile.
