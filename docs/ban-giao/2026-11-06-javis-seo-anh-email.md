# Nén ảnh chia sẻ, đổi email, schema WebSite — javis, 2026-11-06

**Nhánh / PR:** `javis/seo-anh-chia-se-email`

## Đã làm
- Ảnh chia sẻ: `anh-chia-se-2.png` (296 KB) thành `anh-chia-se-3.jpg` (72 KB, vẫn 1200x630). Đổi tên vì Facebook nhớ ảnh theo đường dẫn. `ANH_CHIA_SE` và `scripts/tao-anh-bia.mjs` đã trỏ sang tên mới.
- Email liên hệ đổi sang `keogaminggear@gmail.com` (một chỗ: `site.contact.email`).
- Thêm schema `WebSite` ở `src/app/khung-trang.tsx`, nối với `Store` có sẵn.

## Cố ý chưa làm
- Schema hoàn trả và vận chuyển: chờ soạn nháp chữ cho chủ shop duyệt.
- `lastmod` sitemap: chưa có ngày cập nhật thật.

## AI sau cần biết
- Đổi ảnh chia sẻ lần nữa thì tăng số trong tên file, ở cả `site.ts` và `tao-anh-bia.mjs`.
- Email trong chat AgentTown (repo khác) nếu có ghi thì cần đổi riêng.
