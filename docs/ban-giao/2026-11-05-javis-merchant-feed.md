# Nguồn cấp sản phẩm Google Merchant Center (/merchant-feed.xml) - javis, 2026-11-05

**Nhánh / PR:** `javis/merchant-feed`

## Đã làm
- Thêm `src/app/merchant-feed.xml/route.ts` sinh tệp `/merchant-feed.xml` chuẩn RSS 2.0 cho Google Merchant Center lúc build.
- Chỉ xuất các món còn hàng, có giá và đã có ảnh thật `.webp` (67/68 món, tạm bỏ qua món chưa có ảnh); khớp giá, tình trạng và mô tả với JSON-LD trên trang sản phẩm.
- Cập nhật ghi chú ở `docs/kien-thuc/giao-dien.md`.

## Còn dở / cần chủ shop quyết
- Dán đường dẫn `https://keogaminggear.com/merchant-feed.xml` vào mục Thêm nguồn sản phẩm trong Google Merchant Center.
- Nạp ảnh cho tai nghe `ATK N9 Ultra` để món này tự vào tệp trong lần build sau.

## AI sau cần biết
- Không đổi `g:image_link` sang `chia-se.jpg` vì Google Merchant Center từ chối ảnh có chèn chữ/giá.
