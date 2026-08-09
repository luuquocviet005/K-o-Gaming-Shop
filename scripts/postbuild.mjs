/**
 * Chạy sau `next build`.
 * 1. Copy deploy/.htaccess vào out/ (Next không copy file ẩn từ public/ một
 *    cách chắc chắn trên mọi nền tảng, nên làm thủ công cho an toàn).
 * 2. In ra tóm tắt để biết cần upload gì lên Hostinger.
 */

import { copyFile, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");

if (!existsSync(out)) {
  console.error("✗ Không thấy thư mục out/. `next build` đã chạy xong chưa?");
  process.exit(1);
}

await copyFile(join(root, "deploy", ".htaccess"), join(out, ".htaccess"));

async function dirSize(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(full) : (await stat(full)).size;
  }
  return total;
}

const bytes = await dirSize(out);
const mb = (bytes / 1024 / 1024).toFixed(2);

console.log("");
console.log("  ✓ Đã copy .htaccess vào out/");
console.log(`  ✓ Trang tĩnh sẵn sàng: out/  (${mb} MB)`);
console.log("");
console.log("  Deploy lên Hostinger: upload TOÀN BỘ nội dung bên trong out/");
console.log("  vào thư mục public_html/ (không upload cả thư mục out).");
console.log("");
