# Mascot KẸO Gaming Gear

Vẽ lại từ bản phác cậu bé cầm bàn phím. Giữ nguyên nhân vật và bố cục, chỉ dựng lại
bằng vector: nét dày có phân cấp, tô mảng đặc bằng hồng phấn, và thêm bản cắt tròn
để chạy được ở cỡ favicon.

Trang trình bày: `gallery.html` (mở bằng trình duyệt).

## File

| Dùng cho | Màu | Một màu | Đảo (nền tối) |
|---|---|---|---|
| Dáng đứng đầy đủ — banner, bao bì, standee, sticker | `mascot-full.svg` | `mascot-full-mono.svg` | `mascot-full-mono-white.svg` |
| Khối tròn — avatar, favicon, ô vuông nhỏ | `mascot-badge.svg` | `mascot-badge-mono.svg` | `mascot-badge-mono-white.svg` |

Lockup ghép chữ:

| File | viewBox | Dùng cho |
|---|---|---|
| `lockup-badge-h.svg` | `0 0 660 200` | Header website, chữ ký email |
| `lockup-full-h.svg` | `0 0 640 330` | Banner ngang |
| `lockup-full-v.svg` | `0 0 400 470` | Bao bì, standee, poster dọc |

Mark gốc: `mascot-full.svg` viewBox `0 0 220 500`, `mascot-badge.svg` viewBox `111 19 190 190`.

Thư mục `alt/` là ba hướng logo đề xuất trước đó (Kẹo Mút, Keycap K, badge rút gọn) —
giữ lại để tham khảo, không dùng.

## Màu

`src/app/globals.css` là nguồn duy nhất. `_build_mascot.py` đọc thẳng biến từ đó
(hàm `bien()`), không chép mã hex — đổi màu trong CSS rồi chạy lại là logo theo kịp.

| Vai trò | Biến trong globals.css | Hex |
|---|---|---|
| Mực — viền, tóc | *(riêng của logo, xem bên dưới)* | `#3c1428` |
| Hồng đậm — giày, cụm WASD, chữ KẸO | `--primary` (sáng) | `#c2185b` |
| Hồng phấn — áo, nền phím (chủ đạo) | `--primary-hover` (tối) | `#ff9bc3` |
| Hồng nhạt — quần, viên kẹo, nền khối tròn | `--dai-dam-chu` | `#ffe9f1` |
| Trắng — da, thân bàn phím, đế giày | — | `#ffffff` |

Hai màu lấy từ khối chế độ TỐI chứ không phải `:root`: logo đứng trên nền trắng
của bao bì, cần hồng sáng hơn hồng dùng làm nền nút trên trang.

**Màu mực `#3c1428` là ngoại lệ cố ý** — không có trong globals.css và không nên
đưa vào. Nét vẽ cần nâu mận ấm; dùng `--fg` (`#1c1016`, gần như đen) thì mặt
mascot bị cứng. Đây là màu duy nhất của riêng logo.

## Lưu ý khi dùng

- Chữ trong lockup dùng font **Fredoka** (có bộ dấu tiếng Việt). Trước khi gửi nhà in
  phải convert chữ sang path, không thì máy thiếu font sẽ hiện sai chữ KẸO.
- Dưới 44px đừng dùng dáng đứng đầy đủ — chuyển sang bản cắt tròn.
- Nền tối hoặc nền hồng đậm dùng bản `-mono-white.svg`; in một màu, khắc dấu, thêu áo
  dùng `-mono.svg`.
- Khoảng trống tối thiểu quanh logo bằng đường kính viên kẹo.
- Không kéo méo, không xoay, không đổi màu ngoài bảng trên, không thêm bóng đổ.

## Dựng lại

```
py _build_mascot.py
py _build_gallery.py
```

`_build_mascot.py` sinh toàn bộ SVG (hình vẽ nằm trong code, sửa toạ độ ở đó).
`_build_gallery.py` đọc các SVG vừa sinh và nhúng vào `gallery.html`.
