# Tab "Kịch bản" có nội dung + sửa QR sai + khách xin ảnh — claude, 22/10/2026

## Đã làm
- Sheet kho hàng: tạo tab **Kịch bản** với 22 dòng (QUY TẮC + HỎI ĐÁP: xin ảnh,
  ship/COD/freeship, bảo hành, đổi trả, thu cũ, tư vấn chuột/phím HE...).
- Repo ai-marketing-town (`server/chatbot.js`, nhánh `claude/kich-ban-xin-anh-qr`):
  - Lỗi QR hiện khi khách chỉ xin ảnh: SĐT shop 0904505592 chứa STK 904505592
    nên bot tưởng đang đưa STK. Đã chặn bằng `(?<!\d)`.
  - Khách xin ảnh/video: gắn link Zalo + Messenger và báo Telegram "CẦN CHỦ
    SHOP" (kể cả chưa có SĐT); bot không được hứa "shop gửi ảnh qua Zalo".

## AI sau cần biết
- Chưa thử bot thật sau deploy; nhắn thử "cho xin ảnh wt80he" trên web.
- Nội dung tab Kịch bản chủ shop sửa trực tiếp trong Sheet, bot đọc lại sau ~1 phút.
