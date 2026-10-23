# Gộp nút nổi trên di động thành một nút — claude, 23/10/2026

**Nhánh / PR:** `claude/gop-nut-noi`

## Đã làm
- Trang sản phẩm trên di động từng có 3 nút nổi chồng nhau (chat AI, Zalo,
  "Hỏi về món này"), đè tên món và che nửa nút "Thêm vào giỏ hàng".
- `src/app/san-pham/[slug]/page.tsx`: bỏ thanh nổi Messenger + Zalo (`lg:hidden`).
- `src/components/ai-chatbox.tsx`: di động (dưới `lg`) chỉ còn MỘT nút tròn 🍬;
  bấm bung menu: Chat với Kẹo AI / Nhắn Zalo / Messenger (trang sản phẩm ghi
  "Hỏi về món này", nằm sát ngón tay vì chủ shop rep Messenger nhanh nhất).
  Bấm ra ngoài hoặc Esc thì gập. Máy tính giữ nút "Chat tư vấn Kẹo AI" như cũ.
  Bỏ luôn đoạn đẩy nút chat lên `bottom-[5.5rem]` trên trang sản phẩm.
- Đã xem thử trên khung 375×812: menu bung/gập đúng, mở được khung chat, nút
  "Thêm vào giỏ hàng" không còn bị che. Đủ typecheck/lint/build/check.

## AI sau cần biết
- Lỗi React #418 (hydration) trên trang sản phẩm có SẴN từ trước, cả trên web
  thật bản cũ — không do PR này. Xem sổ bàn giao kế tiếp nếu đã điều tra.
- Xem thử bản dựng của worktree: cấu hình `keo-claude-static` (cổng 4100) trong
  `Claude Code/.claude/launch.json`. Lỗi 404 các file `__next.*.__PAGE__.txt`
  khi chạy `serve` trên máy là do `serve`, web thật trả 200.
