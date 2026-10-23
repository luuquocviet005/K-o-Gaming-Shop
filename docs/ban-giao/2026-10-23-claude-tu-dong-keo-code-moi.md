# Lượt tự động kéo code mới trước khi chạy — claude, 23/10/2026

**Nhánh / PR:** `claude/tu-dong-keo-code-moi`

## Đã làm
- `scripts/tu-dong.mjs`: đầu mỗi lượt `git fetch` + `git merge --ff-only
  origin/main`. Trước đây thư mục chính trên máy shop chỉ kéo code khi
  `push.mjs` có ảnh mới để đẩy — PR #21 merge xong vẫn nằm im trên GitHub, máy
  chạy code cũ. Kéo không được (có commit riêng / file sửa dở đụng nhau) thì
  chạy tiếp bằng code cũ và ghi một dòng ⚠ vào cuối BAO CAO.txt.

## AI sau cần biết
- Merge PR xong thì lượt 15 phút kế tiếp tự dùng code mới; không cần kéo tay.
- Không tự `npm ci` khi package-lock đổi: lượt đó build hỏng, cổng kiểm tra
  chặn đẩy. Gặp thì chạy `npm ci` tay trong thư mục chính.
- Máy shop không có `gh`; mở PR qua API bằng thông tin đăng nhập Git bị bộ phân
  loại của Claude Code chặn. Chủ shop phải bấm link `/pull/new/<nhánh>`.
