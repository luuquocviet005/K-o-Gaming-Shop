/**
 * Chạy tay: chủ tiệm kéo thả thư mục ảnh vào "Tai anh len web.bat".
 *
 * Khác bản chạy ngầm ở chỗ có người đang ngồi xem, nên in thẳng mọi thứ ra màn
 * hình thay vì ghi vào file nhật ký.
 *
 * Điểm chung quan trọng: cùng dùng một khoá với bản chạy ngầm, nhờ vậy lượt tự
 * động 15 phút không nhảy vào giữa lúc đang chạy tay và làm hỏng repo.
 */

import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { giuKhoa } from "./lib/khoa.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const thuMuc = process.argv.slice(2);

if (thuMuc.length === 0) {
  console.error("Chưa có thư mục nào. Kéo thư mục ảnh thả lên file .bat.");
  process.exit(1);
}

if (!giuKhoa()) {
  console.error("");
  console.error("  Đang có một lượt nạp ảnh khác chạy dở (có thể là lượt tự");
  console.error("  động 15 phút). Chờ nó xong rồi thử lại — thường chỉ vài");
  console.error("  chục giây.");
  process.exit(1);
}

/** Chạy một bước; hỏng thì dừng cả tiến trình ngay tại đó */
function buoc(so, tenBuoc, args) {
  console.log(`\n  [${so}/3] ${tenBuoc}`);
  const r = spawnSync(process.execPath, args, { cwd: root, stdio: "inherit" });
  if (r.status !== 0) {
    console.error("\n  ════════════════════════════════════════════════");
    console.error("    CÓ LỖI — đọc phần ở trên để biết lý do.");
    console.error("    Chưa có gì được đưa lên web.");
    console.error("  ════════════════════════════════════════════════\n");
    process.exit(1);
  }
}

buoc(1, "Nén ảnh và gắn vào sản phẩm…", [
  join(root, "scripts", "nap-anh.mjs"),
  ...thuMuc,
]);
buoc(2, "Cập nhật dữ liệu từ Google Sheet…", [
  join(root, "scripts", "sync-sheet.mjs"),
]);
buoc(3, "Kiểm tra và đưa lên web…", [
  join(root, "scripts", "push.mjs"),
  "Cập nhật ảnh sản phẩm",
]);

console.log("\n  ════════════════════════════════════════════════");
console.log("    XONG. Vài phút nữa ảnh sẽ hiện trên web.");
console.log("  ════════════════════════════════════════════════\n");
