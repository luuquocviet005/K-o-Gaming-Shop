#!/bin/bash
# Chuẩn bị cho plugin claude-video-vision mỗi khi mở phiên Claude Code trên cloud.
# Vì sao cần: máy cloud bị xoá sau mỗi phiên, nên cấu hình plugin, whisper-cli
# (nghe tiếng trong video) và yt-dlp (tải video YouTube) phải cài lại mỗi lần.
# Chủ shop chọn Whisper chạy máy (23/10/2026): miễn phí, không cần khoá API.
set -euo pipefail

# Chỉ chạy trên cloud — máy shop / máy chủ shop không cần và không được đụng.
[ "${CLAUDE_CODE_REMOTE:-}" = "true" ] || exit 0

THU_MUC="$HOME/.claude-video-vision"
mkdir -p "$THU_MUC"

# backend "local" = Whisper chạy máy. large-v3-turbo nghe tiếng Việt tốt hơn
# hẳn small/medium mà vẫn đủ nhanh trên CPU 4 nhân của máy cloud.
if [ ! -f "$THU_MUC/config.json" ]; then
  cat > "$THU_MUC/config.json" <<'JSON'
{
  "backend": "local",
  "whisper_engine": "cpp",
  "whisper_model": "large-v3-turbo"
}
JSON
fi

# Build whisper.cpp mất ~1 phút nên chạy nền, không bắt phiên phải chờ.
# Model (~1,6 GB) plugin tự tải ở lần xem video đầu tiên.
if ! command -v whisper-cli >/dev/null 2>&1; then
  nohup bash -c '
    set -e
    pip install -q yt-dlp || true
    TAM="$(mktemp -d)"
    git clone -q --depth 1 https://github.com/ggml-org/whisper.cpp "$TAM/whisper.cpp"
    cmake -S "$TAM/whisper.cpp" -B "$TAM/build" -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=OFF
    cmake --build "$TAM/build" -j"$(nproc)" --target whisper-cli
    install -m 755 "$TAM/build/bin/whisper-cli" /usr/local/bin/whisper-cli
    rm -rf "$TAM"
    echo "XONG"
  ' > "$THU_MUC/cai-dat.log" 2>&1 < /dev/null &
fi
exit 0
