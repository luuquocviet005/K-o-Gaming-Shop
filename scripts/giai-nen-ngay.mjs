/**
 * Giải nén NGAY mọi file .zip trong thư mục ảnh, khỏi chờ lượt tự động 5 phút.
 *
 *   Bấm đúp "Giai nen zip ngay.bat"
 *
 * Cùng một bước với lượt tự động (xem scripts/lib/giai-nen.mjs), cùng khoá,
 * nên bấm đúng lúc lượt tự động đang chạy cũng không sao.
 */

import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { giuKhoa } from "./lib/khoa.mjs";
import { giaiNenHet, baoCaoGiaiNen } from "./lib/giai-nen.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(join(root, "sync.config.json"), "utf8"));
const thuMucAnh = process.argv[2] ?? config.thuMucAnh;

if (!thuMucAnh || !existsSync(thuMucAnh)) {
  console.error(`  ✗ Không thấy thư mục ảnh: ${thuMucAnh ?? "(chưa khai báo trong sync.config.json)"}`);
  process.exit(1);
}

if (!giuKhoa()) {
  console.error("  Đang có một lượt nạp ảnh khác chạy dở. Chờ vài chục giây rồi thử lại.");
  process.exit(1);
}

const danhMuc = JSON.parse(
  await readFile(join(root, "src", "data", "products.json"), "utf8"),
).danhMuc;
const kq = await giaiNenHet(thuMucAnh, danhMuc);
const dong = baoCaoGiaiNen(kq, thuMucAnh);

console.log("");
if (dong.length) for (const d of dong) console.log(`  ${d}`);
else console.log("  Không có file .zip nào cần giải nén.");
console.log("");
console.log("  (File vừa tải xong chưa tới 30 giây thì để lượt sau, phòng còn đang tải dở.)");
console.log("");
if (kq.loi.length) process.exit(1);
