# 2026-11-05 · Javis · Thống nhất tên shop "Kẹo Gaming Gear"

**Đã làm**
- `site.name` đổi từ "KẸO GAMING SHOP" sang "Kẹo Gaming Gear" cho khớp tên miền và hồ sơ Google Business. Mọi tiêu đề trang (`... | Kẹo Gaming Gear`), thẻ chia sẻ, footer, `/llms.txt` đổi theo.
- JSON-LD Store: `alternateName` giờ là tên cũ "Kẹo Gaming Shop".
- Thay tên gõ cứng ở mô tả trang chính sách, danh mục, giỏ hàng, trang 404 và khung chat AI (lời chào, nhãn, câu dự phòng).
- Từ khoá layout thêm "kẹo gaming gear".

**Cố ý KHÔNG làm**
- Không khai `hasMerchantReturnPolicy` / `shippingDetails` vào JSON-LD sản phẩm: đổi trả chỉ khi mô tả sai (3 ngày), phí ship không cố định, schema không diễn đạt đúng được. Khai trong cài đặt Google Merchant Center thay vào đó.

**Còn dở**
- Tab Kịch bản trên Google Sheet (bot Fanpage/Telegram của ai-marketing-town) vẫn xưng tên cũ.
- Chủ shop đăng ký Google Merchant Center.
