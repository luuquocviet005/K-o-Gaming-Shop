# Sửa 3 lỗi kỹ thuật từ audit SEO — javis, 2026-11-06

**Nhánh / PR:** `javis/seo-ky-thuat`

## Đã làm
- `next.config.ts`: thêm `redirects()` 301 từ `www.keogaminggear.com` về bản không www.
  Chế độ máy chủ không đọc `deploy/.htaccess` nên phải khai ở đây.
- `san-pham/[slug]/page.tsx`: món có `giaToiDa` lớn hơn `gia` khai `AggregateOffer`
  (lowPrice, highPrice) để khớp khoảng giá hiện trên trang.
- `merchant-feed.xml/route.ts`: thêm `g:google_product_category` theo danh mục.

## Còn dở / cần kiểm
- Sau merge: `curl -I https://www.keogaminggear.com/` phải ra 301.
- Tên danh mục Google viết bằng chữ, chưa đối chiếu với bảng phân loại chính thức. Merchant Center báo lỗi thì sửa bảng `DANH_MUC_GOOGLE`.
- Feed vẫn khai một giá `gia` cho món nhiều mức giá.

## AI sau cần biết
- Không bật freeship 1 triệu trên Merchant Center dù báo cáo audit gợi ý.
