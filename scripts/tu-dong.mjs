/**
 * Chạy ngầm: nạp ảnh mới -> đồng bộ Sheet -> kiểm tra -> đưa lên web.
 *
 * Do Windows gọi định kỳ, không có ai ngồi xem màn hình. Vì vậy:
 *   - Thoát ngay nếu không có gì mới (nhờ bộ nhớ đệm, mất ~0.1 giây)
 *   - Mọi kết quả ghi vào "BAO CAO.txt" trong thư mục ảnh
 *   - Không bao giờ để lỗi làm hỏng web: mọi bước đều qua cổng kiểm tra
 *
 * Thư mục ảnh khai báo ở sync.config.json > thuMucAnh
 */

import { spawnSync } from "node:child_process";
import { readFile, appendFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(join(root, "sync.config.json"), "utf8"));
const thuMucAnh = config.thuMucAnh;

const luc = () =>
  new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

async function ghiNhatKy(dong) {
  if (!thuMucAnh || !existsSync(thuMucAnh)) return;
  try {
    await appendFile(join(thuMucAnh, "BAO CAO.txt"), `\r\n${dong}\r\n`, "utf8");
  } catch {
    /* không ghi được thì thôi, không được để việc này làm hỏng cả tiến trình */
  }
}

function chay(args) {
  const r = spawnSync(process.execPath, args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  return { ma: r.status ?? 1, ra: (r.stdout ?? "") + (r.stderr ?? "") };
}

if (!thuMucAnh) {
  console.error("Chưa khai báo thuMucAnh trong sync.config.json");
  process.exit(1);
}

if (!existsSync(thuMucAnh)) {
  console.error(`Không thấy thư mục ảnh: ${thuMucAnh}`);
  process.exit(1);
}

// 1. Nạp ảnh. Bộ nhớ đệm lo phần "không có gì mới thì thoát nhanh".
const napAnh = chay([join(root, "scripts", "nap-anh.mjs"), thuMucAnh]);
console.log(napAnh.ra);

const khongCoGiMoi = napAnh.ra.includes("Không có ảnh nào mới");

// 2. Đồng bộ bảng hàng (Sheet có thể đã đổi kể cả khi ảnh không đổi)
const dongBo = chay([join(root, "scripts", "sync-sheet.mjs")]);
if (dongBo.ma !== 0) {
  await ghiNhatKy(`[${luc()}] ✗ Không đọc được Google Sheet — bỏ qua lượt này.`);
  process.exit(0); // không phải lỗi của người dùng, lượt sau thử lại
}

// 3. Kiểm tra rồi đẩy lên. push.mjs tự thoát sớm nếu không có gì thay đổi.
const day = chay([join(root, "scripts", "push.mjs"), "Tự động cập nhật ảnh sản phẩm"]);
console.log(day.ra);

if (day.ra.includes("Không có thay đổi nào")) {
  // Im lặng — đây là trạng thái bình thường của phần lớn các lượt chạy
  process.exit(0);
}

if (day.ma !== 0) {
  await ghiNhatKy(
    `[${luc()}] ✗ ĐƯA LÊN WEB THẤT BẠI. Ảnh đã nén xong nhưng chưa lên web.\r\n` +
      `Mở thư mục dự án rồi chạy "Tai anh len web.bat" để xem lỗi cụ thể.`,
  );
  process.exit(1);
}

await ghiNhatKy(
  `[${luc()}] ✓ Đã đưa lên web thành công.` +
    (khongCoGiMoi ? " (chỉ cập nhật bảng hàng, ảnh không đổi)" : ""),
);
