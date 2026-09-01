# Logo KẸO Gaming Gear

Ba hướng logo vẽ lại từ bản phác cậu bé cầm bàn phím. Chọn một hướng, phần còn lại
có thể xoá.

Trang trình bày: `gallery.html` (mở bằng trình duyệt).

## File

| Hướng | Tên | File gốc | Một màu | Đảo (nền tối) | Lockup ngang | Lockup dọc |
|---|---|---|---|---|---|---|
| A | Kẹo Mút | `mark-01-keo-mut.svg` | `-mono.svg` | `-mono-white.svg` | `lockup-h-01.svg` | `lockup-v-01.svg` |
| B | Keycap K | `mark-02-keycap-k.svg` | `-mono.svg` | `-mono-white.svg` | `lockup-h-02.svg` | `lockup-v-02.svg` |
| C | Cậu Bé Kẹo | `mark-03-mascot.svg` | `-mono.svg` | `-mono-white.svg` | `lockup-h-03.svg` | `lockup-v-03.svg` |

Tất cả là SVG, viewBox `0 0 256 256` cho mark. Lockup ngang `0 0 720 200`,
lockup dọc `0 0 420 380`.

## Màu

Đúng bộ đang chạy trong `src/app/globals.css`, không thêm màu mới.

| Vai trò | Hex |
|---|---|
| Mực (viền, chữ) | `#3c1428` |
| Hồng đậm (chính) | `#c2185b` |
| Hồng phấn | `#ff9bc3` |
| Hồng nhạt | `#ffe9f1` |
| Trắng | `#ffffff` |

## Lưu ý khi dùng

- Chữ trong lockup dùng font **Fredoka** (có bộ dấu tiếng Việt). Trước khi gửi
  nhà in phải convert chữ sang path, nếu không máy thiếu font sẽ hiện sai dấu.
- Khoảng trống tối thiểu quanh logo bằng bán kính viên kẹo.
- Nền tối hoặc nền hồng đậm dùng bản `-mono-white.svg`.
- Không kéo méo, không xoay, không đổi màu ngoài bảng trên, không thêm bóng đổ.

## Dựng lại trang trình bày

```
py _build_gallery.py
```

Script đọc các file SVG trong thư mục này và nhúng thẳng vào `gallery.html`.
