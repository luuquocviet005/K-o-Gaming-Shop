# Cài plugin xem video cho Claude Code — claude, 2026-10-23

**Nhánh / PR:** `claude/charming-babbage-n6cyxo`

## Đã làm
- Thêm `.claude/settings.json`: khai báo marketplace
  `jordanrendric/claude-video-vision` và bật plugin `claude-video-vision`.
  Để trong repo (không phải cài riêng từng máy) vì phiên Claude Code trên
  cloud bị xoá sau mỗi lần dùng — mở phiên mới là plugin tự có lại.

## Còn dở / cần chủ shop quyết
- Plugin cần `ffmpeg` (máy cloud có sẵn) và Node >= 24 cho MCP server
  (cloud đang Node 22, chỉ báo cảnh báo). Muốn nghe được tiếng trong video
  thì chạy `/claude-video-vision:setup-video-vision` để chọn Gemini API /
  OpenAI API (cần khoá API) hoặc Whisper chạy máy.

## AI sau cần biết
- Plugin chỉ tác động Claude Code, không đụng tới build web. Antigravity
  không đọc file này.
