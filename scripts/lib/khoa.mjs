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
 * Dấu hiệu "cha đã giữ khoá rồi" truyền xuống tiến trình con qua biến môi
 * trường (spawnSync mặc định cho con thừa hưởng process.env).
 *
 * Cần thứ này vì tu-dong/thu-cong giữ khoá rồi mới gọi push.mjs — mà push.mjs
 * nay cũng tự giành khoá. Không có cờ này thì nó thấy khoá của chính cha mình
 * và tưởng đang có lượt khác chạy, thành ra tự chặn mình.
 */
const CO_KHOA = "KEO_DANG_GIU_KHOA";

/**
 * Giành khoá. Trả về true nếu giành được, false nếu lượt khác đang chạy.
 * Khoá tự trả lại khi tiến trình kết thúc, kể cả khi bị Ctrl+C hay bị tắt.
 */
export function giuKhoa() {
  // Cha đã giữ — coi như có khoá, và KHÔNG đăng ký dọn dẹp: xoá ở đây là cướp
  // khoá khỏi tay cha, đúng lúc cha còn đang chạy dở.
  if (process.env[CO_KHOA] === "1") return true;

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

  process.env[CO_KHOA] = "1";
  return true;
}
