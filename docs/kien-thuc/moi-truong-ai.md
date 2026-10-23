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
