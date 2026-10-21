# Mã QR bỏ nội dung chuyển khoản — claude, 21/10/2026

**Nhánh / PR:** `claude/modest-feynman-dmhcxf`

## Đã làm
- `ai-chatbox.tsx`: mã QR trong câu trả lời dự phòng không còn điền nội dung
  chuyển khoản ("Keo Gaming" / "Coc COD Keo Gaming"), chỉ điền số tiền (cọc
  COD) hoặc để trống (bank full). Chủ shop chọn vì không muốn sao kê ghi sẵn
  chữ bán hàng. Backend ai-marketing-town đổi y như vậy (PR #2 bên đó).

## AI sau cần biết
- Bên ai-marketing-town giờ có báo đơn về Telegram (token ở biến môi trường
  TELEGRAM_BOT_TOKEN trên Render) và Render tự deploy khi merge, bỏ qua
  thư mục `data/**`.
