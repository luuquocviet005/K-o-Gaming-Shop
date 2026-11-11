# Bàn giao bù đợt làm lại giao diện + rào chắn sổ bàn giao — javis, 2026-11-11

**Nhánh / PR:** `javis/ban-giao-giao-dien-va-rao-chan`

Năm PR #63 đến #67 (09 đến 11/11) đã lên web mà không có file bàn giao. File
này ghi bù, tóm tắt từ mô tả của từng PR.

## Đã làm ở năm PR đó
- **#63 Làm lại giao diện "Bàn soi hàng màu hồng"**: hồng pastel làm nền, mực
  đậm cho chữ và viền, bóng đổ cứng, "Phiếu tình trạng" ở trang sản phẩm. Font
  Bricolage Grotesque, Be Vietnam Pro, IBM Plex Mono. Bỏ `bang-chuyen`,
  `rac-keo`, nhãn pill, dải chữ chạy, hiệu ứng nhún nảy. Thêm `PRODUCT.md`,
  `DESIGN.md`, `.impeccable/design.json`. Câu chữ cho khách, tiêu đề SEO,
  metadata, dữ liệu không đổi.
- **#64 Sửa sót sau khi soát 150 trang** (1440px và 390px, sáng và tối): hết
  tràn ngang ở trang sản phẩm nhiều ảnh, hai nút mua mỗi nút một hàng trên điện
  thoại, tên món trang chủ nằm trên giá, viền hồng mảnh đổi sang viền mực.
- **#65 Trang chủ trên điện thoại**: ba thẻ hero thành xấp polaroid nghiêng,
  danh mục thành một ô lớn "Chuột gaming" và lưới 2x2.
- **#66 Hiệu ứng**: dấu đóng mộc ở nhãn tình trạng, chip bay vào giỏ, xáo xấp
  polaroid mỗi 4,5 giây (chỉ điện thoại). Tách `TheBan` ra
  `src/components/ban-xap.tsx`. Tất cả tắt khi máy bật giảm chuyển động.
- **#67 Nút liên hệ máy tính**: hai ô Nhắn Zalo / Nhắn Messenger riêng phía
  trên nút chat, đầu khung chat bỏ hai nút nhỏ trên máy tính. Đã ghi ở
  `docs/kien-thuc/chatbot.md`.

## Đã làm ở PR này
- `scripts/kiem-tra-ghi-chu.mjs`: PR sửa file ngoài `docs/` mà không thêm file
  mới `docs/ban-giao/YYYY-MM-DD-<ai>-<viec>.md` thì đỏ. PR chỉ sửa
  `package.json` / lock được miễn. `[bo-qua-ghi-chu]` bỏ qua cả hai kiểm tra.
- `docs/kien-thuc/giao-dien.md`: trỏ sang `DESIGN.md` và `PRODUCT.md`; sửa dòng
  ghi "KHÔNG khai `hasMerchantReturnPolicy`" vì code đã khai từ PR #61; thêm
  hai ô liên hệ máy tính.

## Còn dở / cần chủ shop quyết
Các mục dưới đây chép từ phần "chưa kiểm" của các PR, phiên này chưa kiểm lại:
- Giỏ hàng khi có món chưa xem bằng ảnh chụp.
- Bay vào giỏ và xáo xấp polaroid chưa xem bằng mắt trên điện thoại thật.
- Nút chat nổi che đáy khối tóm tắt giỏ hàng trên màn laptop thấp.
- Giá dạng khoảng vẫn hai dòng trên điện thoại hẹp.
- Hai ô liên hệ máy tính (#67) chưa chụp bản 390px, chưa kiểm cỡ màn giữa `lg`
  và điện thoại.
- Phiếu chưa có ngày kiểm và độ mòn vì Sheet chưa có cột. Không bịa.

## AI sau cần biết
- Làm giao diện thì đọc `DESIGN.md` trước. Mục "Don't" ở đó là thứ đã thử và bỏ.
- `docs/kien-thuc/giao-dien.md` đã 121 dòng: lần sửa tới nên tách phần SEO ra
  ghi chú riêng.
