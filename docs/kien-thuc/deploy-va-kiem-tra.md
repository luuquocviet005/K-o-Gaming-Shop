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
- Hostinger có lúc KHÔNG build lại sau khi merge vào `main` (bản xem thử của PR
  vẫn build được, GitHub không ghi gì). Merge xong phải tự kiểm tra web thật có
  code mới — `version.txt` chỉ đổi khi push.mjs chạy, không dùng để đo bản
  merge từ PR. Kẹt thì chủ shop vào hPanel bấm deploy lại.
- Lỗi React #418 (hydration) chỉ xuất hiện khi HTML và JS đến từ HAI bản dựng
  khác nhau (vài phút đang deploy, hoặc dựng lại `out/` khi tab cũ còn mở).
  Đo lại bằng tab MỚI sau khi deploy xong hẳn trước khi sửa gì.
- hostinger[bot] có thể nâng `next` trong package.json mà không sửa lock →
  `npm ci` hỏng. Sửa bằng `npm install` (không sửa lock bằng tay).
- Trên cloud, build đôi khi hỏng ở next/font ("Cannot read properties of null
  (reading '1')") do proxy cắt cụt CSS Google Fonts — chạy lại là qua.
- `serve` trên máy báo 404 các file `__next.*.__PAGE__.txt`; web thật trả 200.

## Khoá nút Merge (ruleset)
- Ruleset "Khoa main khi kiem tra do" trên `main`: "Require status checks to
  pass" với check `kiem-tra`; KHÔNG bật "up to date" (bot commit liên tục) và
  KHÔNG bật "Require a pull request".
- Bypass list: Repository admin (chủ shop + lượt ảnh máy shop, đẩy bằng tài
  khoản chủ shop) và app Hostinger. Bot GitHub Actions KHÔNG thêm vào bypass
  được — bot bảng hàng đẩy bằng `DONG_BO_TOKEN` (xem bang-hang-sheet.md).
- Bot nào mới cần đẩy thẳng `main` thì phải tính chuyện bypass trước khi bật.
