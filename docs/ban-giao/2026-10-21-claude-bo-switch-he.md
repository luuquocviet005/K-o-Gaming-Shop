# Bỏ danh mục Switch HE — claude, 21/10/2026

**Nhánh / PR:** `claude/modest-feynman-dmhcxf`

## Đã làm
- Chủ shop xoá tab "Switch HE" khỏi Google Sheet (ngừng bán). `sync.config.json`
  còn khai tab đó thì sync-sheet.mjs báo "tab không có trong Sheet" và dừng —
  kéo theo GitHub Actions và lượt ảnh 15 phút. Đã bỏ tab khỏi cấu hình.
- Chạy `sync-sheet.mjs` với Sheet thật: 4 món switch bị coi là "đã bán". Đã gỡ
  chúng khỏi `src/data/da-ban.json` (ngừng bán, không phải bán được) rồi chạy
  lại sync — script tự dọn 4 thư mục ảnh mồ côi. Web còn 5 danh mục.
- Câu giới thiệu shop (site.ts, footer, /danh-muc, /chinh-sach) đổi "và
  switch" thành "và phụ kiện".

## AI sau cần biết
- Hình vẽ `switch-he` (product-art.tsx) và icon `switch` (icons.tsx) vẫn giữ
  trong kho hình dùng chung, như icon ghế/tay cầm/màn hình chưa dùng.
- Backend ai-marketing-town cũng bỏ tab Switch HE khỏi danh sách tab đọc.
