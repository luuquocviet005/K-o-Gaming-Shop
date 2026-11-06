# SEO nội dung theo audit — javis, 2026-11-06

**Nhánh / PR:** `javis/seo-noi-dung`

## Đã làm
- Chữ danh mục: `src/lib/tu-van-danh-muc.ts` (meta + khối tư vấn 5 danh mục), hiện dưới lưới ở `danh-muc/[slug]/page.tsx`.
- H1 trang sản phẩm và alt ảnh thẻ dùng `tieuDeSanPham()`, có hãng và loại.
- HSTS ở `next.config.ts` và `deploy/.htaccess`.

## Cố ý chưa làm
- `lastmod` sitemap: dữ liệu sản phẩm không có ngày cập nhật thật, không bịa ngày.
- Nén `anh-chia-se-2.png` (296 KB) và schema Organization/WebSite, hoàn trả, vận chuyển: để PR sau.
- Email gmail trong meta trang Liên hệ: cần chủ shop chọn email của shop.
- Freeship 1 triệu trên Merchant Center: ngược quyết định đã chốt.

## AI sau cần biết
- Chữ tư vấn danh mục lấy từ bản nháp chủ shop duyệt ở `exports/seo-audit/chu-danh-muc-nhap.md` (trong Second Brain).
