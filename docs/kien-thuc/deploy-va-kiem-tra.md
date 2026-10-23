# Deploy và kiểm tra

## Đường lên web thật
- Push lên `main` → Hostinger tự kéo code về và build (chạy web ở CHẾ ĐỘ MÁY
  CHỦ, không dùng thư mục `out/`). Bản vá sửa file HTML sau build
  (`postbuild.mjs`) không tới được web thật — khai trong code Next.
- `deploy-hostinger.yml` (FTP) cố ý TẮT, chỉ chạy tay. Bật lại thì phải tắt
  deploy tự động của Hostinger.
- Xác nhận web đã nhận bản mới: `public/version.txt` (push.mjs ghi mốc, rồi hỏi
  lại web thật — `scripts/lib/kiem-tra-deploy.mjs`). HTML trên Hostinger không
  bị CDN lưu đệm.
- Mỗi PR có bản xem thử Hostinger (hostinger[bot] comment link), tự xoá khi đóng PR.

## Bộ kiểm tra
`npm run typecheck && npm run lint && npm run build && npm run check`
(`build` gồm ảnh chia sẻ + postbuild; `check` = link chết, SEO, tương phản màu)
và `node scripts/kiem-tra-ghi-chu.mjs`.
- Workflow `kiem-tra-pr.yml` chạy tất cả cho mọi PR vào `main`. Không chạy khi
  push thẳng `main` (bot đã tự kiểm tra).
- Luật lint riêng ở `eslint/luat-shop.mjs`: cấm chú thích kể lịch sử, cấm viết
  cứng thông tin liên hệ ngoài `site.ts`.

## Bẫy đã gặp
- Lỗi React #418 (hydration) chỉ xuất hiện khi HTML và JS đến từ HAI bản dựng
  khác nhau (vài phút đang deploy, hoặc dựng lại `out/` khi tab cũ còn mở).
  Đo lại bằng tab MỚI sau khi deploy xong hẳn trước khi sửa gì.
- hostinger[bot] có thể nâng `next` trong package.json mà không sửa lock →
  `npm ci` hỏng. Sửa bằng `npm install` (không sửa lock bằng tay).
- Trên cloud, build đôi khi hỏng ở next/font ("Cannot read properties of null
  (reading '1')") do proxy cắt cụt CSS Google Fonts — chạy lại là qua.
- `serve` trên máy báo 404 các file `__next.*.__PAGE__.txt`; web thật trả 200.

## Còn dở
- Workflow chỉ chạy, chưa khoá nút Merge. Muốn khoá: GitHub → Settings → Rules
  → Rulesets cho `main`, "Require status checks" chọn `kiem-tra`, thêm
  Repository admin + GitHub Actions vào Bypass list (không thì bot ảnh và bot
  bảng hàng bị chặn).
