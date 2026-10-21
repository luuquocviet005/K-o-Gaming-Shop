<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kẹo Gaming Shop — luật chung cho mọi AI (Claude Code, Antigravity, …)

File này là nguồn luật DUY NHẤT. `CLAUDE.md` nhúng nó, `.agents/rules/` của
Antigravity chỉ trỏ về đây. Muốn đổi luật thì sửa ở đây, đừng chép sang chỗ khác.

## Đọc trước khi làm

1. Đọc 3 file mới nhất trong `docs/ban-giao/` (xếp theo tên — tên bắt đầu bằng
   ngày). Đó là việc AI kia vừa làm và những gì còn dở.
2. `git fetch origin main` rồi làm trên bản mới nhất. Bot ảnh 15 phút và GitHub
   Actions (bảng hàng, 20 phút) commit lên `main` liên tục.

## Dự án là gì

- Web bán hàng tĩnh keogaminggear.com: Next.js 16, `output: "export"`, không có
  server. Push lên `main` = Hostinger tự kéo về và deploy web thật.
- Backend chatbot + đội AI marketing nằm ở dự án RIÊNG `ai-marketing-town`
  (Render: keo-gaming-agent-town.onrender.com). Repo này chỉ có phần giao diện
  `src/components/ai-chatbox.tsx` gọi sang đó.
- Thông tin shop (SĐT, địa chỉ, link, quy tắc ship, địa chỉ backend chatbot):
  chỉ ở `src/lib/site.ts`. Không viết cứng ở component.
- Hàng hoá: `src/data/*.json` sinh ra từ Google Sheet — KHÔNG sửa tay.
- Viết code, chú thích, tên biến, lời nhắn commit bằng tiếng Việt như code sẵn
  có. Chú thích giải thích "vì sao", nhất là các bài học từ sự cố đã gặp.

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
   ```
   (`build` đã gồm sinh ảnh thu nhỏ + postbuild; `check` = link chết, SEO,
   tương phản màu). Hỏng bước nào thì sửa, không push.
2. Viết sổ bàn giao (dưới đây), commit cùng code.
3. Push nhánh riêng, mở Pull Request vào `main`. Chủ shop xem rồi merge.

## Sổ bàn giao — `docs/ban-giao/`

Mỗi lần xong một việc (hoặc phải dừng giữa chừng) thì tạo MỘT FILE MỚI, không
viết nối vào file cũ — hai AI cùng nối vào một file là sinh xung đột Git, mà
xung đột thì lượt ảnh tự động dừng luôn.

Tên file: `YYYY-MM-DD-<ai>-<viec>.md`, ví dụ `2026-10-21-claude-sua-chatbox.md`.
Mẫu ở `docs/ban-giao/README.md`. Viết ngắn: đã làm gì, file nào, còn dở gì,
điều AI sau cần biết. Lịch sử chi tiết đã có trong git log, không chép lại.
