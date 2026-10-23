<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kẹo Gaming Shop — luật chung cho mọi AI (Claude Code, Antigravity, …)

File này là nguồn luật DUY NHẤT. `CLAUDE.md` nhúng nó, `.agents/rules/` của
Antigravity chỉ trỏ về đây. Muốn đổi luật thì sửa ở đây, đừng chép sang chỗ khác.

## Đọc trước khi làm

1. Đọc `docs/kien-thuc/README.md` rồi ghi chú của phần sắp sửa (chatbot, nạp
   ảnh, bảng hàng, deploy, giao diện…). Đó là trí nhớ của dự án: cách nó chạy,
   bẫy đã gặp, việc còn dở. Chủ shop đã chốt gì: `docs/kien-thuc/chu-shop-da-chot.md`.
2. Đọc 3 file mới nhất trong `docs/ban-giao/` (xếp theo tên — tên bắt đầu bằng
   ngày). Đó là việc AI kia vừa làm.
3. `git fetch origin main` rồi làm trên bản mới nhất. Bot ảnh 15 phút và GitHub
   Actions (bảng hàng, 20 phút) commit lên `main` liên tục.

## Dự án là gì

- Web bán hàng tĩnh keogaminggear.com: Next.js 16, `output: "export"`, không có
  server. Push lên `main` = Hostinger tự kéo về và deploy web thật.
- Backend chatbot + đội AI marketing nằm ở dự án RIÊNG `ai-marketing-town`
  (Render: keo-gaming-agent-town.onrender.com). Repo này chỉ có phần giao diện
  `src/components/ai-chatbox/` gọi sang đó.
- Thông tin shop (SĐT, địa chỉ, link, quy tắc ship, địa chỉ backend chatbot):
  chỉ ở `src/lib/site.ts`. Không viết cứng ở component (lint chặn).
- Hàng hoá: `src/data/*.json` sinh ra từ Google Sheet — KHÔNG sửa tay.
- Viết code, chú thích, tên biến, lời nhắn commit bằng tiếng Việt như code sẵn
  có.

## Chú thích trong code

- Chỉ ghi điều CÒN ĐÚNG: quy tắc, lý do, hậu quả nếu làm khác ("đừng X vì Y").
  Bài học từ sự cố thì viết thành quy tắc, không kể lại sự cố.
- KHÔNG ghi lịch sử: ngày tháng, "trước đây…", ai quyết lúc nào, số PR, mã
  commit. Những thứ đó vào lời nhắn commit và sổ bàn giao. Để trong code thì
  nó cũ đi mà không ai sửa, và AI sau đọc lời dặn của một lần sửa rồi hiểu
  thành luật vĩnh viễn.
- Ít mà đúng: code tự nói được thì không chú thích. Sửa code thì sửa luôn chú
  thích đi kèm, hoặc xoá nó.

## Rào chắn cứng — luật nào nhắc tới lần 2 thì đưa vào máy

Luật chỉ ghi ở file này là rào chắn mềm, AI có thể quên. Luật đã phải nhắc lại
thì thêm vào `eslint/luat-shop.mjs` (hoặc một bước trong
`.github/workflows/kiem-tra-pr.yml`) để máy tự chặn. Đang có:
- `shop/khong-chu-thich-lich-su`: chặn chú thích có ngày tháng, "trước đây",
  số PR, mã commit.
- `shop/khong-viet-cung-lien-he`: chặn SĐT, link Zalo/Messenger/Facebook/
  TikTok, email viết cứng trong `src/` ngoài `site.ts`.
- Workflow "Kiểm tra PR": mọi PR vào `main` chạy typecheck, lint, build, check.
- `scripts/kiem-tra-ghi-chu.mjs`: PR sửa code một phần mà không sửa ghi chú
  của phần đó trong `docs/kien-thuc/` thì đỏ. Sửa vặt: thêm dòng riêng
  `[bo-qua-ghi-chu]` vào lời nhắn commit.

## Sửa code ở đâu — QUAN TRỌNG

Máy chủ shop chạy lượt nạp ảnh tự động 15 phút (`scripts/tu-dong.mjs`) ngay
trong thư mục dự án chính. Lượt đó build từ những file đang có trong thư mục,
nên code sửa dở ở đây mà làm build hỏng thì ảnh cũng không lên web được.

- **AI chạy trên máy shop (Antigravity):** KHÔNG sửa trong thư mục chính. Tạo
  thư mục làm việc riêng rồi làm trong đó:
  ```
  git worktree add ../keo-gaming-shop-anti -b anti/<ten-viec> origin/main
  cd ../keo-gaming-shop-anti && npm ci
  ```
- **Claude Code trên cloud:** làm trên nhánh `claude/...` được giao.

## Đưa code lên

AI KHÔNG push thẳng lên `main` và KHÔNG chạy `npm run push` / `scripts/push.mjs`
— script đó dành cho chủ shop và dây chuyền ảnh (nó đẩy thẳng `main` và giữ
khoá `.dang-chay.lock` của máy shop). Thay vào đó:

1. Tự chạy đủ các bước kiểm tra mà `push.mjs` chạy:
   ```
   npm run typecheck && npm run lint && npm run build && npm run check
   node scripts/kiem-tra-ghi-chu.mjs
   ```
   (`build` đã gồm sinh ảnh thu nhỏ + postbuild; `check` = link chết, SEO,
   tương phản màu). Hỏng bước nào thì sửa, không push.
2. Cập nhật ghi chú kiến thức của phần vừa sửa (`docs/kien-thuc/`, dưới đây)
   và viết sổ bàn giao, commit cùng code.
3. Push nhánh riêng, mở Pull Request vào `main`. Chủ shop xem rồi merge.
4. **Claude Code: tự merge PR của mình** khi bước 1 qua hết VÀ workflow
   "Kiểm tra PR" trên GitHub đã xanh ở commit mới nhất, không cần hỏi lại
   (chủ shop cho phép 22/10/2026). Workflow đỏ thì sửa tới xanh, không merge.
   Áp dụng cho cả repo `ai-marketing-town`
   — repo đó không có bộ kiểm tra như ở đây, tối thiểu phải `node --check` và
   chạy thử phần vừa sửa. Merge xong thì tự kiểm tra web thật / bot thật đã
   nhận bản mới chưa, rồi báo chủ shop.

## Ghi chú kiến thức — `docs/kien-thuc/`

AI không nhớ gì giữa các phiên; thư mục này là trí nhớ của dự án. Mỗi file
một phần của shop, ghi điều CÒN ĐÚNG. Xong việc thì SỬA ghi chú của phần vừa
làm cho khớp code mới — thêm bẫy vừa gặp, xoá điều hết đúng, cập nhật "còn
dở". Viết lại chứ không nối nhật ký; ghi chú quá ~120 dòng thì tách nhỏ. Mục
lục và luật ở `docs/kien-thuc/README.md`.

## Sổ bàn giao — `docs/ban-giao/`

Mỗi lần xong một việc (hoặc phải dừng giữa chừng) thì tạo MỘT FILE MỚI, không
viết nối vào file cũ — hai AI cùng nối vào một file là sinh xung đột Git, mà
xung đột thì lượt ảnh tự động dừng luôn.

Tên file: `YYYY-MM-DD-<ai>-<viec>.md`, ví dụ `2026-10-21-claude-sua-chatbox.md`.
Mẫu ở `docs/ban-giao/README.md`. Viết ngắn: đã làm gì, file nào, còn dở gì.
Điều AI sau CẦN BIẾT lâu dài thì ghi vào `docs/kien-thuc/`, không chỉ ở đây —
sổ bàn giao cũ không ai đọc lại. Lịch sử chi tiết đã có trong git log, không chép lại.
