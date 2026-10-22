# Telegram chỉ báo khi có SĐT + vì sao QR vẫn hiện — claude, 22/10/2026

## Đã làm
- ai-marketing-town PR #9: Telegram chỉ rung khi khách đã có SĐT; xin ảnh /
  hỏi tình trạng chưa có SĐT không tạo phiếu "CẦN CHỦ SHOP" nữa.
- `GET /api/public/chat-config` trả thêm `version` = commit Render đang chạy.

## AI sau cần biết
- Render KHÔNG tự deploy khi merge (mọi bản đều bấm tay). QR vẫn hiện sau PR #8
  vì bot vẫn chạy bản 01:09 sáng 22/10. Merge xong phải nhờ chủ shop bấm
  Manual Deploy → Deploy latest commit, rồi tự kiểm tra trường `version`.
- Thử bot thật thì gửi ÍT tin: mỗi tin có SĐT sẽ rung điện thoại chủ shop.
