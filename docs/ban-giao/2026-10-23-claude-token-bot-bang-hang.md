# Bot bảng hàng đẩy bằng token để bật ruleset — claude, 23/10/2026

**Nhánh / PR:** `claude/wonderful-pascal-ad9c4k`

## Đã làm
- Chủ shop bật ruleset khoá `main` khi "Kiểm tra PR" đỏ thì phát hiện bot
  GitHub Actions không thêm vào Bypass list được. `dong-bo-sheet.yml` giờ
  checkout bằng `secrets.DONG_BO_TOKEN` (rơi về token mặc định khi chưa có).
- Ghi vào `docs/kien-thuc/bang-hang-sheet.md` và `deploy-va-kiem-tra.md`.

## Còn dở / cần chủ shop làm
- Tạo fine-grained token, dán vào secret `DONG_BO_TOKEN`, chạy tay workflow
  "Đồng bộ Google Sheet" thấy xanh, RỒI mới bấm Create ruleset.
