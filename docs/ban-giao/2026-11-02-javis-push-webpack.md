# Sửa lượt nạp ảnh kẹt ở bước build - javis, 02/11/2026

**Nhánh / PR:** `javis/push-webpack`

## Đã làm
- Từ 18:57 ngày 02/11, `scripts/push.mjs` thất bại ở bước "Build trang tĩnh": Turbopack gục ở PostCSS sau 0.34 giây, 67 bộ ảnh 2000px không lên web.
- Nguyên nhân: `package.json` build bằng `next build --webpack`, còn `push.mjs` gọi thẳng `next build` không kèm cờ. Đã thêm `"--webpack"` vào dòng đó.
- Ghi thêm bẫy vào `docs/kien-thuc/nap-anh.md`.

## Còn dở / cần chủ shop quyết
- Không có. Lượt nạp ảnh 15 phút kế tiếp trên máy shop sẽ tự build và đẩy bộ ảnh đang chờ.

## AI sau cần biết
- Đổi cờ build trong `package.json` thì đổi luôn ở `scripts/push.mjs`.
