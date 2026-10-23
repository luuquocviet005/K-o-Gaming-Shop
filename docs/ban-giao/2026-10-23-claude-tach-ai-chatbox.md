# Tách khung chat AI thành thư mục tính năng — claude, 23/10/2026

**Nhánh / PR:** `claude/wonderful-pascal-ad9c4k`

## Đã làm
- `src/components/ai-chatbox.tsx` (714 dòng) → thư mục `src/components/ai-chatbox/`,
  mỗi file một việc (bản đồ ở đầu `index.tsx`):
  - `may-chu.ts`: gọi backend, đánh thức Render, mã phiên.
  - `tra-loi-du-phong.ts`: STK/QR và câu trả lời tại chỗ khi backend im.
  - `use-tro-chuyen.ts`: tin nhắn, hàng chờ gửi gộp, chữ đang gõ.
  - `khung-chat.tsx`, `nut-noi.tsx`, `qr-phong-to.tsx`: giao diện.
  - `co-link.tsx`: biến link trong câu trả lời thành link bấm được.
- Import giữ nguyên `@/components/ai-chatbox`. Không đổi hành vi.
- Chạy thử bằng Chromium trên bản build: máy tính + di động, gửi tin, hàng chờ
  (2 tin liên tiếp được trả lời đúng thứ tự), chặn backend → câu dự phòng + QR
  cọc 50k, phóng to/đóng QR bằng Esc và nút Đóng, menu di động + Esc, đóng mở
  lại khung chat vẫn giữ tin nhắn và chữ nháp. Không có lỗi JS.

## AI sau cần biết
- Trạng thái chat nằm ở `useTroChuyen` gọi từ `index.tsx`, KHÔNG để trong
  `khung-chat.tsx`: khung chat bị gỡ khỏi trang mỗi lần đóng, để state trong đó
  thì đóng mở lại là mất sạch tin nhắn.
- Lần chạy thử có gửi 2 tin thật tới bot ("cho mình xin stk bank full", "tên
  mình là Test", không có SĐT) — nếu thấy phiên lạ trong nhật ký bot thì là nó.
