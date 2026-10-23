# Ảnh món đã bán bị gán nhầm sang món đang bán — claude, 23/10/2026

**Nhánh / PR:** `claude/sua-khop-anh-hang-da-ban`

## Đã làm
- `scripts/nap-anh.mjs`, vòng so khớp thư mục ảnh ↔ sản phẩm, sửa hai lỗi:
  1. Trước đây chỉ hỏi kho đã bán khi kho đang bán không có gì. Thư mục ảnh
     của món đã bán (còn nằm trong `Ảnh gear`) liền nhận món đang bán nào trùng
     60% chữ: "Logitech G304 x Superlight" (đã bán) → ảnh của "G502 x Plus";
     "ATK X1 Air +" (bán sáng 23/10) → ảnh của "X1 Ultimate v2". Giờ món đã
     bán khớp chắc hơn thì thắng.
  2. Hai thư mục cùng trỏ một món thì thư mục tới trước theo chữ cái giữ món,
     nên thư mục ĐÚNG "ATK X1 Ultimate V2" (100%) bị gạt vì "trùng đích".
     Giờ khớp cả lượt trước rồi xử lý từ điểm cao xuống thấp.
- Chạy thử trên thư mục ảnh thật: G502 nhận lại đúng 5 tấm của nó, G304 vào
  danh sách đã bán. X1 Ultimate v2 đã tự lành từ lượt 11:52 vì chủ shop xoá
  thư mục X1 Air+.

- Tự dọn ảnh gốc của món đã bán (chủ shop chọn): `nap-anh.mjs` CHUYỂN (không
  xoá) thư mục/ảnh rời/zip sang `Ảnh gear/_Đã bán/<đường dẫn cũ>` khi tên KHÍT
  với món đã bán, món đã bán từ 7 ngày, và đang chạy trên đúng `thuMucAnh` của
  `sync.config.json`. Trùng tên thì thêm " (2)". Không đủ điều kiện thì
  BAO CAO.txt ghi lý do (chưa đủ ngày / tên chưa khít + tên nên đổi thành).
- `_Đã bán` bị bỏ qua ở cả `nap-anh.mjs` và `lib/giai-nen.mjs`; hằng số dùng
  chung `THU_MUC_DA_BAN` ở `lib/da-ban.mjs`.
- Đã thử trên cây thư mục giả lập: chuyển đúng thư mục/ảnh rời/zip, xử lý trùng
  tên, giữ lại món < 7 ngày và tên chưa khít, không chuyển khi chạy trên thư
  mục lẻ, bước giải nén không đụng `_Đã bán`.

## Còn dở / cần chủ shop quyết
- `_Đã bán` không tự xoá — chủ shop tự xoá khi cần chỗ. Muốn tự xoá sau
  30–60 ngày thì làm thêm.
- Lượt đầu với dữ liệu 23/10 sẽ chỉ chuyển "Mchose G3 V2". "Pulsar Tenz" cần
  đổi tên thành "Pulsar Tenz ( đen )" mới được dọn.

## AI sau cần biết
- Phanh "lượt đọc Sheet hỏng" của việc dọn nằm ở điều kiện 7 ngày, không viết
  riêng: món bị đọc nhầm là vừa bán mang ngày hôm nay, và lượt có tab lỗi thì
  sync-sheet không ghi kho đã bán. Đừng hạ ngưỡng 7 ngày xuống 0.
- Không commit ảnh G502 nạp thử: để lượt 15 phút trên máy shop tự nạp, tránh
  hai bên cùng sửa `public/products/` gây xung đột rebase.
- Ngưỡng khớp mờ 60% ở `scripts/lib/khop-ten.mjs` vẫn để nguyên: quét toàn bộ
  `Ảnh gear` chỉ có 2 cặp khớp mờ — "IQUINIX EZ60" → IQUNIX EZ60 (gõ sai, đúng)
  và G304 (đã sửa bằng ưu tiên kho đã bán).
