# Sửa viền ô kênh liên hệ bị cắt ở màn 320px - javis, 2026-11-11

**Nhánh / PR:** `javis/sua-vien-o-lien-he-320`

## Đã kiểm sau PR #69
Giả lập iPhone 13, iPhone SE, iPad Mini (nhân WebKit của Playwright) và Pixel 7,
Galaxy S9+ (Chrome) trên web thật: trang chủ, sản phẩm, danh mục, giỏ hàng, liên
hệ, chính sách đều không kéo lệch ngang được. Vẫn chưa thử điện thoại thật.

## Đã sửa
- Trang Liên hệ ở 320px: các ô kênh rộng hơn màn 25px nên viền phải bị cắt
  (trang không lệch nhờ `overflow-x: clip` của PR #69). Nguyên nhân: lưới dùng
  cột ngầm `auto`, bị chữ dài không ngắt được (email) nới ra. Thêm `grid-cols-1`
  (= `minmax(0, 1fr)`) cho lưới ngoài và danh sách kênh, `break-words` cho giá trị
  kênh trong `src/app/lien-he/page.tsx`.
- Đo trên bản build: 320px (WebKit và Chrome), 390px, 768px, 1440px đều không còn
  phần tử nào vượt mép.

## Còn dở
- Chưa xem trên điện thoại thật.

## AI sau cần biết
- `overflow-x: clip` ở `html`/`body` giấu luôn phần tràn, nên đo tràn phải đếm
  phần tử có `getBoundingClientRect().right` vượt `clientWidth`, không chỉ so
  `scrollWidth`.
