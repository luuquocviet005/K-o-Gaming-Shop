# Giao diện web

- Thông tin shop (SĐT, địa chỉ, link, STK, quy tắc ship, backend chatbot): chỉ
  ở `src/lib/site.ts`. Lint chặn viết cứng ở chỗ khác.
- Màu thương hiệu: nguồn duy nhất `src/app/globals.css`; script sinh ảnh đọc
  qua `scripts/lib/mau.mjs`.
- Ảnh chia sẻ link (Zalo/Facebook): `ANH_CHIA_SE` trong `site.ts`, sinh bằng
  `scripts/tao-anh-bia.mjs`. Đổi ảnh thì TĂNG SỐ trong tên file — Facebook nhớ
  ảnh theo đường dẫn.
- Ảnh sản phẩm mang `?v=<băm nội dung>` (sync-sheet gắn, xem bang-hang-sheet.md).
  `_nho.webp` (`banThuNho`) và `chia-se.jpg` (`anhChiaSeSanPham`) mượn ?v của
  ảnh bìa. Tự ghép đường dẫn ảnh ở chỗ khác thì giữ nguyên phần ?v, không thì
  khách lại thấy ảnh cũ sau khi thay ảnh.
- Món đã bán vẫn có trang ("đã bán" + gợi ý món tương tự), link cũ không 404.
- Trang 404 khai `metadata` ở `src/app/global-not-found.tsx`.

## Nút nổi
- Di động: MỘT nút tròn 🍬, bấm bung Chat AI / Zalo / Messenger ("Hỏi về món
  này" trên trang sản phẩm, đặt sát ngón tay vì chủ shop rep Messenger nhanh
  nhất). Đừng thêm nút nổi riêng — nhiều nút chồng nhau che nút "Thêm vào giỏ".
- Máy tính: nút "Chat tư vấn Kẹo AI".

## Liên hệ và đánh giá
- `DoLienHe` đếm lượt bấm nút liên hệ (GA4) bằng một bộ lắng nghe ở cấp trang —
  nút mới tự được đếm.
- `site.contact.reviewUrl` mở thẳng khung chấm sao Google Maps; placeid suy ra
  từ `mapUrl` — đổi ghim thì lấy lại cả hai. Có ở chân trang và `/lien-he`.

## Danh mục
- Góc ảnh thẻ sản phẩm: trái là loại hàng (`tenDanhMuc` = `short` của danh
  mục chính, gắn trong `toCard`), phải là tình trạng. Nhiều món tên chỉ là
  mã/tên riêng ("Crimson", "X83") nên khách không biết đó là pad hay phím —
  đừng bỏ nhãn loại. Shop chỉ bán ở Đà Nẵng nên thẻ không ghi địa điểm và
  trang danh sách không có bộ lọc địa điểm.
- Chuột, bàn phím, tai nghe, pad chuột, phụ kiện. Hình vẽ/icon switch, ghế, tay
  cầm, màn hình vẫn giữ trong kho hình dùng chung dù chưa dùng.
