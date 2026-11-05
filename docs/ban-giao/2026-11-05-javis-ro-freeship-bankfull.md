# Ghi rõ điều kiện freeship chỉ khi chuyển khoản đủ - javis, 2026-11-05

**Nhánh / PR:** `javis/ro-quy-tac-freeship-bankfull`

## Đã làm
- Sửa `site.shipping.ghiChu` trong `src/lib/site.ts` (dùng ở giỏ hàng, đơn chép gửi Messenger/Zalo và `/llms.txt`): ghi rõ "Dưới mức đó hoặc ship COD thì phí ship tính theo thực tế" để khách mua COD đơn từ 1 triệu không hiểu nhầm là được freeship.
- Sửa câu trả lời dự phòng khi khách xin STK trong `src/components/ai-chatbox/tra-loi-du-phong.ts`: ghi rõ "(chuyển khoản đủ đơn từ 1.000.000 ₫ được freeship)".
- Cập nhật `docs/kien-thuc/giao-dien.md` và `docs/kien-thuc/chatbot.md`.

## Còn dở / cần chủ shop quyết
- Trong Google Merchant Center, giữ nguyên mức phí vận chuyển cố định 35.000 ₫ và không bật mục "miễn phí vận chuyển cho đơn từ 1.000.000 ₫" vì Merchant Center không tách riêng được đơn chuyển khoản đủ với đơn COD.
