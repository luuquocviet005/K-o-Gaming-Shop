# Rào chắn cứng: CI cho PR, luật lint riêng, dọn chú thích lịch sử — claude, 23/10/2026

**Nhánh / PR:** `claude/wonderful-pascal-ad9c4k`

## Đã làm
- `.github/workflows/kiem-tra-pr.yml`: mọi PR vào `main` chạy typecheck, lint,
  build, check. Không chạy khi push thẳng `main` (bot ảnh / bảng hàng đã tự
  kiểm tra trước khi đẩy).
- `eslint/luat-shop.mjs` (nối vào `eslint.config.mjs`), hai luật:
  - `shop/khong-chu-thich-lich-su`: chú thích có ngày dd/mm/yyyy hoặc
    yyyy-mm-dd, "trước đây", "PR #n", "commit <mã>" → lỗi.
  - `shop/khong-viet-cung-lien-he`: SĐT, `tel:`, link zalo.me / m.me /
    facebook.com / tiktok.com/@, email trong `src/` ngoài `site.ts` → lỗi.
    Số mẫu ở placeholder của `contact-form.tsx` được tắt luật tại dòng đó.
- AGENTS.md: bỏ câu "chú thích ghi bài học từ sự cố", thay bằng mục "Chú thích
  trong code" và mục "Rào chắn cứng". Tự merge chỉ khi "Kiểm tra PR" xanh.
- Viết lại ~40 chú thích kể lịch sử trong `src/` và `scripts/` thành quy tắc +
  lý do (giữ nguyên ý cảnh báo, bỏ ngày, tên lần sự cố, số PR). Chuyển chú
  thích "Ô nhập tự cao lên…" trong `ai-chatbox.tsx` về đúng effect của nó (nó
  đang nằm nhầm trên effect phím Esc).

## Còn dở / cần chủ shop quyết
- Workflow chỉ CHẠY, chưa CHẶN nút Merge. Muốn chặn hẳn: GitHub → Settings →
  Rules → Rulesets → New branch ruleset cho `main`, bật "Require status checks
  to pass" chọn `kiem-tra`, và thêm Repository admin + GitHub Actions vào
  Bypass list (không thì bot ảnh và bot bảng hàng push thẳng `main` bị chặn).
- Tách `src/components/ai-chatbox.tsx` (~700 dòng) chưa làm.

## AI sau cần biết
- Lịch sử sự cố cũ vẫn còn nguyên trong git log và các file bàn giao trước.
- Thêm luật mới: viết vào `eslint/luat-shop.mjs`, ghi một dòng vào mục "Rào
  chắn cứng" của AGENTS.md.
