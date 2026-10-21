# Sửa khung chat AI + luật đồng bộ hai AI — claude, 21/10/2026

**Nhánh / PR:** `claude/modest-feynman-dmhcxf`

## Đã làm
- `ai-chatbox.tsx` (Antigravity viết, đã lên web trong commit 8055255):
  - Trang sản phẩm trên di động: nút chat đè nút "Hỏi về món này" (Messenger
    + Zalo) → khi đóng, đẩy nút chat lên trên.
  - Trả lời dự phòng (lúc Render không đáp) không còn hứa "đã ghi nhận" /
    "để lại SĐT" — lúc đó không có gì gửi về shop. Giờ chỉ sang Messenger/Zalo/SĐT.
  - Mở khung chat là gọi đánh thức Render; chờ tối đa 40 giây thay vì 25.
  - Tab ẩn danh chặn localStorage không còn làm hỏng mọi tin nhắn.
  - Ô nhập có `aria-label`.
  - Quy tắc cọc COD / freeship và địa chỉ backend chuyển vào `src/lib/site.ts`.
- `push.mjs` có cờ `--chi-anh`: chỉ commit `public/products`, `src/data`,
  `public/version.txt`. `tu-dong.mjs` và `thu-cong.mjs` dùng cờ này → lượt ảnh
  không còn cuốn code đang sửa dở lên web.
- `AGENTS.md` có luật chung; thêm `docs/ban-giao/` và `.agents/rules/`.

## Còn dở / cần chủ shop quyết
- ĐÃ CHỐT (21/10): chuyển khoản đủ, đơn từ 1 triệu thì freeship. Đã sửa
  `site.ts`, trang `/chinh-sach` và ghi chú ở giỏ hàng cho khớp với khung
  chat. Sheet của backend ai-marketing-town cũng phải ghi đúng quy tắc này.
- Backend Render phải cho phép (CORS) tên miền keogaminggear.com — chưa kiểm
  tra được từ repo này.

## AI sau cần biết
- Đọc mục "Sửa code ở đâu" trong `AGENTS.md`: AI trên máy shop làm trong git
  worktree, không làm ở thư mục chính.
