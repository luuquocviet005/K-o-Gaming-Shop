# Môi trường của các AI

## Claude Code trên cloud
- Mỗi phiên là máy mới tinh: không nhớ gì ngoài repo. Đọc `AGENTS.md`, ghi chú
  kiến thức của phần sắp sửa, và 3 file bàn giao mới nhất.
- Làm trên nhánh `claude/...` được giao, mở PR, tự merge khi "Kiểm tra PR" xanh.
- `.claude/settings.json` bật plugin xem video `claude-video-vision`; hook
  SessionStart `.claude/hooks/cai-xem-video.sh` (chỉ khi
  `CLAUDE_CODE_REMOTE=true`) tự cài Whisper `large-v3-turbo` + yt-dlp chạy nền,
  log ở `~/.claude-video-vision/cai-dat.log` (xong có `XONG`). MCP của plugin
  đòi Node >= 24, cloud đang Node 22. Không dùng plugin thì xem video bằng
  ffmpeg cắt khung hình.
- Chromium có sẵn để chạy thử giao diện thật trên bản build (`out/` +
  `python3 -m http.server`). Đừng `pkill -f` theo chuỗi có trong chính lệnh
  đang chạy — nó giết luôn shell.

## Antigravity trên máy shop
- KHÔNG sửa trong thư mục chính (lượt ảnh 15 phút build từ đó). Làm trong git
  worktree riêng (`../keo-gaming-shop-anti`).
- Máy shop không có `gh`; mở PR qua API bằng thông tin đăng nhập Git bị chặn.
  Chủ shop bấm link `/pull/new/<nhánh>`.
- Luật của Antigravity trỏ về `AGENTS.md` (`.agents/rules/`).

## Javis OS trên máy shop
- Trợ lý tự host ở `D:\javis-os`, dashboard `http://127.0.0.1:7777`, tự chạy
  khi đăng nhập Windows. Não chính là Claude Code (gói Pro của chủ shop), dự
  phòng là Antigravity. Chủ shop nhắn lỗi web vào Javis và Javis sửa luôn.
- Claude trong Javis chạy chế độ tự duyệt mọi lệnh, không ai xem trước — chốt
  chặn duy nhất là bộ kiểm tra và workflow "Kiểm tra PR". Không merge khi chưa xanh.
- Worktree `../keo-gaming-shop-javis`, nhánh `javis/...`, sổ bàn giao tên
  `YYYY-MM-DD-javis-<viec>.md`. Mở và merge PR bằng `gh`
  (`C:\Program Files\GitHub CLI\gh.exe`, đã đăng nhập).
- Javis có Second Brain riêng (`D:\javis-os\brains\`), nhưng trí nhớ CHÍNH THỨC
  của dự án vẫn là `docs/kien-thuc/` — điều cần nhớ lâu thì ghi vào đây.
- Brain "Keo Shop Bot" và tác vụ Windows `KeoShopBot-DongBoHang` (20 phút) là
  chatbot Zalo thử nghiệm của Javis, tách khỏi repo. Bật nó song song với
  chatbot `ai-marketing-town` thì khách nhận hai bot cùng trả lời.

## Javis OS trên laptop chủ shop
- Mỗi máy cài Javis riêng, không chia sẻ trí nhớ: Javis trên laptop không
  thấy gì của Javis trên máy shop. Muốn nó biết dự án thì đọc `AGENTS.md` và
  `docs/kien-thuc/` như mọi AI khác. Chủ shop dặn Javis ở máy này điều gì mà
  máy kia cũng cần thì ghi vào `docs/kien-thuc/`, máy kia `git pull` là có.
- Trên laptop: repo shop clone ở `D:\Kẹo Gaming Gear` (đã `npm ci`),
  `ai-marketing-town` ở `C:\Users\OS\.gemini\antigravity\scratch\ai-marketing-town`,
  Javis ở `C:\Users\OS\.gemini\antigravity\scratch\javis-os`.
- Second Brain của máy shop (`D:\javis-os\brains\`) chỉ sang được laptop bằng
  cách chép tay thư mục đó; điều quan trọng phải nằm trong `docs/kien-thuc/`.
- Laptop không chạy lượt ảnh tự động nên sửa thẳng trong bản clone được,
  nhưng vẫn làm trên nhánh `javis/...`, mở PR, chỉ merge khi "Kiểm tra PR" xanh.
  Trước khi làm: `git fetch origin main` rồi tạo nhánh từ `origin/main`.
- `gh` trên laptop đã cài và đăng nhập tài khoản `luuquocviet005`
  (đã `gh auth setup-git`, nên `git push` không hỏi mật khẩu).
- `agent-browser` (vercel-labs) cài toàn máy trên laptop, skill ở
  `~/.claude/skills/agent-browser`, KHÔNG cài vào repo này. Chrome của nó trỏ
  qua biến `AGENT_BROWSER_EXECUTABLE_PATH`. Mở trang xong chờ 1-2 giây rồi mới
  bấm; trang đổi thì `snapshot -i` lại để lấy mã `@e` mới; "✓ Done" chưa chắc
  đã bấm ăn, phải đọc lại trang kiểm kết quả.
- Không bật "Keo Shop Bot" hay tác vụ đồng bộ hàng trên laptop — thêm một
  bot nữa trả lời khách cùng lúc.

## Skill marketing và file định vị shop
- Laptop chủ shop cài toàn máy 9 skill của `coreyhaines31/marketingskills`
  (product-marketing, copywriting, copy-editing, social, cro, seo-audit, ai-seo,
  schema, site-architecture). Không cài vào repo này.
- Mọi skill đọc `.agents/product-marketing.md` trước khi viết: định vị, khách,
  đối thủ, giọng văn, câu khách hay hỏi. Sửa định vị thì sửa file đó, tăng
  `Document version` và thêm một dòng Changelog cuối file.
- Repo đang công khai: file đó ai cũng đọc được, kể cả đối thủ. Viết về đối
  thủ nhẹ nhàng, đúng sự việc, không dán link Facebook cá nhân.
- Mục ghi "chưa có" (đánh giá Google Maps, số liệu chốt đơn) là để trống có
  chủ ý. Skill không được tự viết lời khen hay con số thay vào.
