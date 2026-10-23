# Lượt nạp ảnh tự động (máy shop, 15 phút)

Task Scheduler trên máy Windows của shop chạy `scripts/tu-dong.mjs` mỗi 15
phút, NGAY TRONG thư mục dự án chính:
1. `git fetch` + `merge --ff-only origin/main` — PR merge xong thì lượt kế
   tiếp tự dùng code mới. Kéo không được thì chạy bằng code cũ, ghi ⚠ vào
   cuối `BAO CAO.txt`.
2. `sync-sheet.mjs` — lấy bảng hàng mới TRƯỚC khi nạp ảnh.
3. `nap-anh.mjs` — đọc thư mục ảnh (`thuMucAnh` trong `sync.config.json`),
   khớp tên thư mục ↔ sản phẩm, nén vào `public/products/`.
4. `push.mjs --chi-anh` — kiểm tra rồi commit đúng phần ảnh/dữ liệu, đẩy `main`,
   hỏi web thật (`public/version.txt`) xem đã nhận bản mới chưa.

`thu-cong.mjs` / "Tai anh len web.bat" chạy cùng dây chuyền cho một thư mục lẻ.

## Bẫy đã gặp
- Khoá `.dang-chay.lock` (`scripts/lib/khoa.mjs`): hai lượt chồng nhau làm kẹt
  rebase, mọi lượt sau chết. AI không chạy `push.mjs`.
- `--chi-anh` chỉ commit `public/products`, `src/data`, `public/version.txt`.
  `git add -A` sẽ cuốn code đang sửa dở lên web — vì thế AI trên máy shop làm
  trong git worktree riêng.
- Rebase dở dang (máy tắt giữa chừng) phải gỡ ĐẦU TIÊN, và cất thay đổi chưa
  commit vào stash trước khi `rebase --abort`.
- Không tự `npm ci` khi package-lock đổi: lượt đó build hỏng, cổng kiểm tra
  chặn đẩy. Gặp thì chạy `npm ci` tay trong thư mục chính.
- Kiểm tra tác vụ còn bật bằng PowerShell `Get-ScheduledTask` (.State), không
  đọc chữ `schtasks` (đổi theo ngôn ngữ Windows).
- HEIC: sharp không đọc được — giải mã qua bộ HEIF của Windows.
- Hỏng một phần cũng không ghi vân tay (cache), không thì tấm hỏng không bao
  giờ được thử lại.

## So khớp tên (`scripts/lib/khop-ten.mjs`)
- Tách chữ dính số ("ATK68RX" = "ATK 68 RX"); dấu "+" là một từ thật.
- Ngưỡng khớp mờ 60%. Khớp cả lượt trước rồi xử lý từ điểm cao xuống — thư mục
  khớp 100% luôn thắng thư mục na ná.
- Món ĐÃ BÁN khớp chắc hơn thì nhận là món đã bán, không cho thư mục ảnh của
  món đã bán giành ảnh của món đang bán tên na ná.
- File ảnh đặt theo tên phân loại ("Đen.jpg", "Hồng 2.jpg") thì vào đúng màu.

## Dọn ảnh gốc món đã bán
`nap-anh.mjs` CHUYỂN (không xoá) sang `Ảnh gear/_Đã bán/<đường dẫn cũ>` khi đủ
ba điều kiện: tên KHÍT món đã bán, đã bán từ 7 ngày, đang chạy trên đúng
`thuMucAnh`. Không đủ thì `BAO CAO.txt` ghi lý do.
- Đừng hạ ngưỡng 7 ngày: đó là phanh cho lượt đọc Sheet hỏng (món bị đọc nhầm
  là "vừa bán" mang ngày hôm nay).
- `_Đã bán` được bỏ qua ở `nap-anh.mjs` và `lib/giai-nen.mjs` (hằng số
  `THU_MUC_DA_BAN` ở `lib/da-ban.mjs`).

## AI trên cloud
- Đừng commit ảnh nạp thử: để lượt 15 phút trên máy shop tự nạp, tránh hai bên
  cùng sửa `public/products/` gây xung đột rebase.

## Còn dở
- `_Đã bán` không tự xoá; chủ shop tự xoá khi cần chỗ.
