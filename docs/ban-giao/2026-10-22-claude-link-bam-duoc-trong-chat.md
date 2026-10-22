# Link trong khung chat bấm được + bot luôn gửi link khi hỏi tình trạng — claude, 22/10/2026

## Đã làm
- `ai-chatbox.tsx`: link http(s) trong câu trả lời của bot thành link bấm được
  (mở tab mới). Tin của khách giữ dạng chữ.
- Repo `ai-marketing-town` (`server/chatbot.js`): khách hỏi tình trạng mà AI quên
  gửi link thì code tự gắn link Zalo + Messenger vào cuối câu trả lời. Thử bot
  thật 22/10 thì AI chỉ báo giá rồi thôi, nên không trông vào prompt nữa.

## AI sau cần biết
- Bộ nhận câu hỏi tình trạng là regex `HOI_TINH_TRANG` trong chatbot.js
  (tình trạng, trầy, xước, móp, ngoại hình, còn mới, lỗi gì; có dấu lẫn không dấu).
