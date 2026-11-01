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
