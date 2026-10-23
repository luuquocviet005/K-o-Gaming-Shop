# Khung chat AI

Hai nửa ở hai repo:
- **Giao diện** — repo này, `src/components/ai-chatbox/` (bản đồ file ở đầu `index.tsx`).
- **Bộ não** — repo riêng `ai-marketing-town`, file chính `server/chatbot.js`,
  chạy trên Render (`site.chatbot.api` trong `src/lib/site.ts`).

## Chạy thế nào
- Mở khung chat (hoặc mở menu nút nổi trên di động) là gọi đánh thức Render:
  bản miễn phí ngủ sau ~15 phút, dậy mất 50–60 giây. Chờ trả lời tối đa 65
  giây; quá 8 giây thì đổi dòng chờ thành "Trợ lý đang khởi động…".
- Backend không trả lời → trình duyệt tự trả lời (`tra-loi-du-phong.ts`):
  xin STK/bank full/cọc thì đưa STK VIB + mã QR VietQR; còn lại trả lời theo
  danh mục, địa chỉ, món đang xem, giỏ hàng.
- Khách nhắn tiếp khi đang chờ: tin hiện ngay, gom hàng chờ, gửi cả cụm sau.
- Link http(s) trong câu trả lời của bot thành link bấm được. QR bấm để phóng to.
- Câu chào nằm cứng ở `use-tro-chuyen.ts`. `greeting` trong cấu hình bot bên
  ai-marketing-town KHÔNG được web dùng.

## Bẫy đã gặp
- Trạng thái chat phải ở `useTroChuyen` (gọi từ `index.tsx`), không trong
  `khung-chat.tsx`: khung chat bị gỡ khỏi trang mỗi lần đóng.
- Câu trả lời dự phòng KHÔNG được hứa "đã ghi nhận", "để lại SĐT" — lúc đó
  không có gì gửi về shop. Chỉ khách sang Messenger/Zalo/điện thoại.
- Tab ẩn danh chặn localStorage — mã phiên phải có đường dự phòng trong bộ nhớ.
- Mã QR KHÔNG điền nội dung chuyển khoản (chủ shop không muốn sao kê ghi chữ
  bán hàng). Cọc COD điền số tiền, bank full để khách tự nhập.
- STK nằm ở `site.nganHang`; backend khai cùng tài khoản — đổi thì đổi cả hai.
  Quy tắc ship ở `site.shipping`; backend đọc quy tắc từ Sheet — đổi cả hai.
- Backend: SĐT shop 0904505592 chứa STK 904505592, nên regex nhận STK phải có
  `(?<!\d)`, không thì khách xin ảnh cũng bị kèm QR.
- Backend: không tin prompt cho việc bắt buộc. Khách hỏi tình trạng (regex
  `HOI_TINH_TRANG` trong chatbot.js) thì code tự gắn link Zalo + Messenger.

## Backend ai-marketing-town
- Render KHÔNG tự deploy khi merge — chủ shop bấm Manual Deploy → Deploy latest
  commit. Kiểm tra bản đang chạy: `GET /api/public/chat-config` trả `version`
  = commit đang chạy.
- Telegram (`TELEGRAM_BOT_TOKEN` trên Render) chỉ báo khi khách đã có SĐT.
  Thử bot thật thì gửi ÍT tin, và đừng gửi SĐT — mỗi tin có SĐT rung điện
  thoại chủ shop.
- Tab "Kịch bản" trong Sheet kho hàng là QUY TẮC + HỎI ĐÁP cho bot; chủ shop
  sửa trực tiếp, bot đọc lại sau ~1 phút.
- Repo đó không có bộ kiểm tra như ở đây: tối thiểu `node --check` và chạy thử
  phần vừa sửa.

## Còn dở
- Chưa xác nhận CORS của backend cho phép keogaminggear.com từ phía repo này
  (bot thật trả lời được từ bản build chạy ở localhost).
