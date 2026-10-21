# Khung chat: trả lời dự phòng có STK + QR, báo đang khởi động — claude, 21/10/2026

**Nhánh / PR:** `claude/modest-feynman-dmhcxf`

## Đã làm
- Chủ shop thử chat: câu đầu rơi vào trả lời dự phòng (Render chưa dậy) và chỉ
  đọc lại quy tắc ship, không đưa STK. Giờ khách xin STK / chọn bank full mà
  máy chủ chưa trả lời thì trình duyệt tự đưa STK VIB + mã QR.
- STK nằm ở `site.nganHang` (`src/lib/site.ts`) — backend ai-marketing-town
  khai cùng tài khoản này, đổi thì đổi cả hai.
- Chờ trả lời tối đa 65 giây (Render miễn phí dậy mất 50–60 giây); quá 8 giây
  thì hiện "Trợ lý đang khởi động…" thay cho "đang tra kho hàng".
- Ô nhập không còn hiện thanh cuộn khi mới có một dòng.

## Còn dở / cần chủ shop quyết
- Bot thật trên Render vẫn chạy code CŨ (vẫn hứa "để em gửi STK ngay") vì
  Render chưa deploy lại sau khi merge ai-marketing-town#1. Cần bấm Manual
  Deploy trên Render.

## AI sau cần biết
- Phiên cloud của Claude bị chặn onrender.com nên chưa test được bot thật.
