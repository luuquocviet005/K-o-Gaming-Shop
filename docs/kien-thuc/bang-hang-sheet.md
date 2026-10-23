# Bảng hàng: Google Sheet → web

- Sheet (ai có link đều xem được) → `scripts/sync-sheet.mjs` → `src/data/products.json`
  + `src/data/da-ban.json`. KHÔNG sửa tay hai file JSON.
- Chạy ở hai nơi: GitHub Actions `dong-bo-sheet.yml` (20 phút, build thử trước
  khi commit) và lượt ảnh 15 phút trên máy shop.
- `sync.config.json`: mỗi tab Sheet = một danh mục. Tên tab phải TRÙNG TUYỆT
  ĐỐI; tab khai mà không có trong Sheet thì sync dừng — kéo theo cả Actions và
  lượt ảnh. Bỏ tab khỏi Sheet thì bỏ luôn ở đây.

## Bẫy đã gặp
- Tải tab bằng `/export?format=csv` theo gid, KHÔNG dùng gviz: gviz trả rỗng
  cho ô sai kiểu → hàng còn mà bị treo "Đã bán hết".
- Cùng hãng + tên ở nhiều tab = chủ shop cố ý xếp vào nhiều danh mục: ghi thêm
  danh mục vào cùng một món, đừng bỏ bản sau.
- Cột "Địa điểm" bị bỏ qua, luôn là Đà Nẵng.
- `da-ban.json` PHẢI commit cùng `products.json`: bán xong chủ shop xoá dòng
  khỏi Sheet, kho đã bán giữ trang "món này đã bán" để link cũ không 404.
- Ngừng bán cả danh mục (không phải bán được) thì gỡ các món đó khỏi
  `da-ban.json` rồi chạy lại sync; script tự dọn thư mục ảnh mồ côi.
- Thư mục ảnh mồ côi chỉ xoá khi lượt sync đọc được TẤT CẢ các tab.
