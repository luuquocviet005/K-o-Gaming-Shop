# Khung chat: xuống dòng + nhắn tiếp khi đang chờ — claude, 21/10/2026

**Nhánh / PR:** `claude/modest-feynman-dmhcxf`

## Đã làm
- `ai-chatbox.tsx`: ô nhập đổi sang textarea tự cao lên. Máy tính: Enter gửi,
  Shift+Enter xuống dòng. Điện thoại: Enter xuống dòng, bấm "Gửi" để gửi.
- Đang chờ bot trả lời vẫn nhắn tiếp được: tin hiện ngay, gom vào hàng chờ,
  trả lời xong câu trước thì gửi cả cụm còn lại thành một tin.

## Còn dở / cần chủ shop quyết
- Backend (repo ai-marketing-town, cùng tên nhánh) đã sửa xong nhưng CHƯA
  push được: Claude chưa có quyền ghi repo đó. Gồm tab "Kịch bản", sửa QR,
  không hứa gửi STK khi chưa có, bot biết giờ hiện tại.
- Chủ shop sẽ gửi STK / mã QR sau.

## AI sau cần biết
- Chưa thử được với bot thật trên Render (mạng của phiên cloud chặn
  onrender.com); hàng chờ đã thử với máy chủ giả lập trả lời chậm 3 giây.
