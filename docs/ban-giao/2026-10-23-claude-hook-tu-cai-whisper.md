# Hook tự cài Whisper cho plugin xem video — claude, 2026-10-23

**Nhánh / PR:** `claude/charming-babbage-n6cyxo`

## Đã làm
- `.claude/hooks/cai-xem-video.sh` + hook SessionStart trong
  `.claude/settings.json`: mỗi phiên Claude Code trên cloud tự ghi cấu hình
  plugin (`~/.claude-video-vision/config.json`: Whisper chạy máy, model
  `large-v3-turbo`) và build `whisper-cli` + cài `yt-dlp` chạy nền (~1 phút,
  log ở `~/.claude-video-vision/cai-dat.log`, xong có dòng `XONG`).
- Chủ shop chọn Whisper (không khoá API) và cho phép thêm hook này.

## Còn dở / cần chủ shop quyết
- Model Whisper (~1,6 GB) plugin tự tải ở lần xem video đầu mỗi phiên.
- MCP server của plugin đòi Node >= 24, cloud đang Node 22 (mới chỉ cảnh
  báo, chưa thử xem video thật).

## AI sau cần biết
- Hook chỉ chạy khi `CLAUDE_CODE_REMOTE=true`; máy shop không bị ảnh hưởng.
- Xem video ngay sau khi mở phiên mà báo thiếu `whisper-cli` thì chờ log
  có `XONG`.
