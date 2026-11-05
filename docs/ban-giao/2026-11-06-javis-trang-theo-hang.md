# Trang theo hãng — javis, 2026-11-06

**Nhánh / PR:** `javis/trang-theo-hang`

## Đã làm
- Thêm `src/app/hang/[slug]/page.tsx`: mỗi hãng một trang, chia khối theo loại hàng.
- `src/lib/products.ts`: `tatCaTrangHang`, `getTrangHang`, `slugHang`, `linkTrangHang`,
  `tenLoaiHang`; chuyển `gioiThieuDanhMuc` thành `gioiThieuNhom` dùng chung.
- Tên hãng trên trang sản phẩm thành link, `/danh-muc/` có dòng "Mua theo hãng",
  sitemap thêm trang hãng đủ ngưỡng.
- Lúc build: 14 trang hãng, 9 trang được index (ATK, Razer, Logitech, HyperX,
  Lamzu, Akko, FGG, IQUNIX, Wooting), 5 trang noindex vì còn dưới 2 món.

## Còn dở / cần chủ shop quyết
- Chưa có trang hãng + loại (`/hang/atk/chuot/`).

## AI sau cần biết
- Luật ngưỡng và noindex ghi ở `docs/kien-thuc/giao-dien.md`, mục "Trang theo hãng".
