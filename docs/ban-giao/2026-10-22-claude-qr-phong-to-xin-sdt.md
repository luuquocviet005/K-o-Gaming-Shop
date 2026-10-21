# QR bấm phóng to + bot xin SĐT trước khi chốt — claude, 22/10/2026

**Nhánh:** `claude/new-session-0krr96`

## Đã làm
- `ai-chatbox.tsx`: bấm ảnh QR trong khung chat thì phóng to toàn màn hình
  (bấm nền, nút Đóng hoặc Esc để tắt).

## Còn dở — CẦN CHỦ SHOP LÀM
- Sửa prompt bot "xin SĐT kèm lý do trước khi gửi STK / chốt đơn" thuộc repo
  ai-marketing-town (`server/chatbot.js`), phiên này không có quyền push repo đó.
  Bản vá sẵn ở `docs/ban-giao/backend/2026-10-22-xin-sdt-truoc-khi-chot.patch`.
  Áp: `git apply <file.patch>` trong repo ai-marketing-town rồi push.

## AI sau cần biết
- Chưa thử với giao diện thật; mới qua typecheck/lint/build/check.
