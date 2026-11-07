# Schema hoàn trả trang sản phẩm — javis, 2026-11-07

**Nhánh / PR:** `javis/schema-hoan-tra`

## Đã làm
- Thêm `hasMerchantReturnPolicy` vào `offers` ở `src/app/san-pham/[slug]/page.tsx`: trả trong 3 ngày, hoàn đủ tiền, shop chịu ship gửi trả (`FreeReturn`).
- Chủ shop chốt 07/11: hàng trả vì lỗi thì shop chịu ship.

## Cố ý chưa làm
- Schema vận chuyển (`shippingDetails`): web cố ý không ghi mức ship cố định, khai 35.000đ sẽ mâu thuẫn chữ trên trang. Giữ ship ở Merchant Center.
- Chưa thêm câu "shop chịu ship gửi trả" vào mục Đổi trả ở `/chinh-sach`: chữ trên web phải để chủ shop duyệt trước.

## AI sau cần biết
- Đổi chính sách trả hàng thì sửa cả ba nơi: `/chinh-sach`, schema này, chính sách trả hàng trên Merchant Center.
