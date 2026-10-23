# Câu chào chatbox + sửa package-lock lệch Next — claude, 23/10/2026

## Đã làm
- `ai-chatbox.tsx`: câu chào thêm "Nếu bạn cần thêm bất kỳ thông tin nào thì
  nhắn trực tiếp cho chủ shop qua Messenger hoặc Zalo (nút ở đầu khung chat)".
  Câu chào nằm cứng ở web; `greeting` trong cấu hình bot (ai-marketing-town)
  KHÔNG được web dùng.
- `package-lock.json`: hostinger[bot] (commit 2b52314, 23/10) nâng next lên
  16.4.1 trong package.json mà không sửa lock → `npm ci` hỏng. Chạy
  `npm install` để sinh lại, chỉ đổi các gói next 16.4.0 → 16.4.1.

## AI sau cần biết
- Trên cloud, `npm run build` đôi khi hỏng ở next/font ("Cannot read
  properties of null (reading '1')" trong loader.js) do proxy cắt cụt CSS
  Google Fonts — chạy lại build là qua, không phải lỗi code.
