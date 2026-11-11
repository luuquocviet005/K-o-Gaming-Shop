# Kiểm các mục còn treo của đợt giao diện, sửa tràn ngang và nút nổi che giỏ hàng - javis, 2026-11-11

**Nhánh / PR:** `javis/sua-tran-ngang-va-nut-noi-gio-hang`

Kiểm trên web thật bằng Chrome ẩn (giả lập iPhone 13 và các cỡ laptop), không
phải điện thoại thật. Safari iOS chưa thử.

## Đã kiểm, ổn
- Giỏ hàng khi có món: 390px và 1440px, sáng và tối, tổng tiền đúng, không vỡ.
- Bay vào giỏ: chip bay tới icon giỏ rồi tự gỡ sau khoảng 0,7 giây.
- Xáo xấp polaroid: đổi tầng đúng, khoảng 4,5 giây một lần.
- Hai ô liên hệ máy tính: dưới 1024px chỉ có nút tròn, từ 1024px hiện đủ.

## Đã sửa
- Tràn ngang trên điện thoại (trang chủ 5px, trang sản phẩm và danh mục 11px ở
  390px): con dấu `dap-dau` phóng to thò ra mép phải. Thêm `overflow-x: clip`
  cho cả `html` và `body` trong `globals.css` (chỉ đặt ở `html` thì không ăn).
- Cụm nút nổi che ba nút đặt hàng trong khối tóm tắt giỏ ở mọi cỡ laptop: trang
  giỏ hàng giờ dùng nút tròn và menu như di động (`gon` trong
  `ai-chatbox/index.tsx`, `nut-noi.tsx`).

## Còn dở / cần chủ shop quyết
- Giá dạng khoảng vẫn hai dòng trên thẻ sản phẩm ở điện thoại (320 đến 390px).
  Rút thành "từ ..." là đổi câu chữ, cần chủ shop duyệt.
- Phiếu chưa có ngày kiểm và độ mòn vì Sheet chưa có cột.
- Chưa ai xem trên điện thoại thật và Safari.

## AI sau cần biết
- Web thật có bước kiểm bot của Hostinger (trả 403 rồi tự tải lại): script
  Playwright phải chờ trang tải lại xong mới đo.
- Giả lập di động của Chrome giấu tràn ngang (khung nhìn tự nới ra). Muốn đo thì
  dùng viewport thường 390px và so `scrollWidth` với `innerWidth`.
