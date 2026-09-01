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

Đúng bộ đang chạy trong `src/app/globals.css`, không thêm màu mới. Hồng phấn là chủ đạo.

| Vai trò | Hex |
|---|---|
| Mực — viền, tóc | `#3c1428` |
| Hồng đậm — giày, cụm WASD, chữ KẸO | `#c2185b` |
| Hồng phấn — áo, nền phím (chủ đạo) | `#ff9bc3` |
| Hồng nhạt — quần, viên kẹo, nền khối tròn | `#ffe9f1` |
| Trắng — da, thân bàn phím, đế giày | `#ffffff` |

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
