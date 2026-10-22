# Gắn link đánh giá Google Maps lên web — claude, 22/10/2026

**Nhánh:** `claude/wonderful-davinci-prmikl`

## Đã làm
- `site.contact.reviewUrl` trong `src/lib/site.ts`: link mở thẳng khung chấm
  sao của ghim "Kẹo Gaming Gear". Chủ shop đã bấm thử, chạy được.
- Chân trang (mục Liên hệ): dòng "Mua rồi? Đánh giá shop trên Google".
- Trang `/lien-he`: thêm ô "Đánh giá".

## AI sau cần biết
- placeid suy ra từ mã địa điểm trong `mapUrl`. Đổi ghim Maps thì lấy lại cả hai.
- Chủ shop chọn KHÔNG làm tự động hoá đơn hàng / CRM lúc này (thấy quá nặng).
  Đừng đề xuất lại trừ khi chủ shop hỏi.
