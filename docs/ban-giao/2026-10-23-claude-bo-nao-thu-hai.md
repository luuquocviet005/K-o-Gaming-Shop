# "Bộ não thứ hai": ghi chú kiến thức theo chủ đề — claude, 23/10/2026

**Nhánh / PR:** `claude/wonderful-pascal-ad9c4k`

## Đã làm
- `docs/kien-thuc/`: README (mục lục + luật) và 7 ghi chú chủ đề — chatbot,
  nạp ảnh, bảng hàng, deploy & kiểm tra, giao diện, môi trường AI, chủ shop
  đã chốt. Gom từ 22 file bàn giao, chỉ giữ điều còn đúng.
- `scripts/kiem-tra-ghi-chu.mjs` + bước đầu tiên trong `kiem-tra-pr.yml`: PR sửa
  code của một phần mà không sửa ghi chú của phần đó → đỏ. Bỏ qua bằng
  dòng riêng `[bo-qua-ghi-chu]` trong lời nhắn commit (nhắc giữa câu không tính). Giao diện chung không bị ép.
- AGENTS.md: bước đọc đầu tiên là ghi chú kiến thức; xong việc phải sửa ghi chú.

## AI sau cần biết
- Bảng đường dẫn → ghi chú nằm trong `PHAN` của `kiem-tra-ghi-chu.mjs`. Thêm
  ghi chú mới cho một phần thì thêm một dòng ở đó và ở `docs/kien-thuc/README.md`.
