/**
 * Khoá: chỉ cho một lượt nạp ảnh chạy tại một thời điểm.
 *
 * Vì sao cần: lượt tự động 15 phút có thể nổ ra đúng lúc chủ tiệm đang kéo thả
 * thư mục vào "Tai anh len web.bat". Hai tiến trình cùng chạy `git rebase` một
 * lúc sẽ để repo kẹt giữa chừng một cuộc rebase dở dang. Đã xảy ra thật.
 *
 * Khoá cũ hơn 30 phút coi như rác của lượt bị tắt máy giữa chừng nên dọn luôn.
 * Không có bước dọn này thì một lần cúp điện sẽ làm chết hẳn chế độ tự động.
 */

import { openSync, closeSync, unlinkSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HAN = 30 * 60 * 1000;
const duongDan = join(
  dirname(dirname(dirname(fileURLToPath(import.meta.url)))),
  ".dang-chay.lock",
);

/**
 * Giành khoá. Trả về true nếu giành được, false nếu lượt khác đang chạy.
 * Khoá tự trả lại khi tiến trình kết thúc, kể cả khi bị Ctrl+C hay bị tắt.
 */
export function giuKhoa() {
  try {
    if (Date.now() - statSync(duongDan).mtimeMs > HAN) unlinkSync(duongDan);
  } catch {
    /* chưa có khoá — bình thường */
  }

  let the;
  try {
    the = openSync(duongDan, "wx"); // "wx" = tạo mới, lỗi ngay nếu đã tồn tại
  } catch {
    return false;
  }

  process.on("exit", () => {
    try {
      closeSync(the);
      unlinkSync(duongDan);
    } catch {
      /* đã dọn rồi thì thôi */
    }
  });
  process.on("SIGINT", () => process.exit(130));
  process.on("SIGTERM", () => process.exit(143));

  return true;
}
