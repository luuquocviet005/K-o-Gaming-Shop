# Chủ shop đã chốt

Đừng đề xuất ngược lại trừ khi chủ shop tự hỏi. Muốn ngày quyết định thì xem
git log / `docs/ban-giao/`.

- Freeship khi chuyển khoản đủ VÀ đơn từ 1 triệu. Dưới mức đó hoặc COD: phí
  ship theo thực tế, không ghi con số cố định trên web. Cọc COD 50.000₫.
- Chỉ bán ở Đà Nẵng; cho khách qua test trực tiếp.
- Mã QR không điền nội dung chuyển khoản.
- KHÔNG làm tự động hoá đơn hàng / CRM lúc này (thấy quá nặng).
- Ngừng bán Switch HE (đã bỏ khỏi Sheet và web).
- Ảnh gốc món đã bán được chuyển sang `_Đã bán`, không xoá.
- Xem video bằng Whisper chạy máy, không dùng khoá API.
- Claude Code được tự merge PR của mình khi kiểm tra xanh — cả repo này lẫn
  ai-marketing-town. Javis OS trên máy shop cũng được tự merge theo cùng điều kiện.
- Kiểm tra bản thật trước (keogaminggear.com, AgentTown trên Render), không tự
  bật localhost. Localhost chỉ để thử code trước khi push.
- Bài Threads viết ngắn như trang @1millioncolors: tên hàng + giá, vào thẳng ý
  chính, không dài dòng.
- Bảo hành 1 tháng (ghi "Bảo hành 1 tháng", không thêm chữ "phần cứng"). Không
  nhận va đập, vào nước, tự sửa/mod, rách tem shop, hao mòn, lỗi đã ghi lúc bán.
  Xử lý: sửa, không được thì đổi món tương đương, không có thì hoàn ĐỦ tiền,
  không trừ khấu hao. Shop chịu phí ship bảo hành cả hai chiều, xử lý 3-7 ngày.
  Bản đầy đủ ở mục Bảo hành của `src/app/chinh-sach/page.tsx`.
