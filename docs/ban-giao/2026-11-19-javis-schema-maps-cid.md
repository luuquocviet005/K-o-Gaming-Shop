# Thêm link cid Google Maps vào schema Store - javis, 19/11/2026

**Nhánh / PR:** javis/schema-maps-cid

## Đã làm
- `site.ts`: thêm `contact.mapsCidUrl` (cid 1978470873173054394, suy từ mã địa điểm trong `mapUrl`).
- `khung-trang.tsx`: đưa link đó vào `sameAs` của JSON-LD Store.
- Lý do: AI Overview của Google ghép tên Kẹo với ghim Maps của một tiệm khác cùng quận Ngũ Hành Sơn khi tìm "hex80 đà nẵng".

## Còn dở / cần chủ shop quyết
- Hồ sơ Google Business của Kẹo cần được xác minh và có đánh giá; đó mới là cách gỡ nhầm lẫn chính.

## AI sau cần biết
- Đổi ghim Maps thì lấy lại cả `mapUrl`, `mapsCidUrl`, `reviewUrl`.
