# Gắn phiên bản vào link ảnh — claude, 2026-10-30

**Nhánh / PR:** claude/exciting-turing-ebo9ad

## Đã làm
- `sync-sheet.mjs` gắn `?v=<md5 nội dung, 8 ký tự>` vào mọi `anh`/`anhs` trong
  products.json. `banThuNho` giữ ?v cho `_nho.webp`; `anhChiaSeSanPham` nhận
  cả món (slug + anh) để `chia-se.jpg` mượn ?v của ảnh bìa.
- Không commit `src/data/`: lượt đồng bộ kế tiếp (máy shop / Actions) tự sinh
  link có ?v, tránh xung đột với bot.
- Lý do: chủ shop thay ảnh Viper V3 Pro, web thật đã có ảnh mới nhưng trình
  duyệt vẫn hiện ảnh cũ cùng tên.

## Còn dở / cần chủ shop quyết
- WL Mouse Beast x Pro bán ngày 29/10 → ảnh gốc tự vào `_Đã bán` từ 5/11.
- "Pulsar Tenz", "ATK F1 Leviatan" trong `Ảnh gear/Chuột` không khít tên món đã
  bán nên không tự chuyển — chủ shop tự kéo vào `_Đã bán`.

## AI sau cần biết
- Sau merge kiểm tra products.json trên main đã có `?v=`.
