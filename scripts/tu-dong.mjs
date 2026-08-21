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
import { giuKhoa } from "./lib/khoa.mjs";

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

// Chủ tiệm đang tự tay chạy thì nhường — lượt sau (15 phút nữa) làm cũng được
if (!giuKhoa()) {
  console.log("Đang có một lượt chạy khác — bỏ qua lượt này.");
  process.exit(0);
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

/*
 * push.mjs đã tự hỏi web thật xem đã cập nhật chưa. Chép đúng kết luận đó vào
 * nhật ký thay vì tự suy đoán lần nữa.
 *
 * Trước đây chỗ này canh workflow FTP trên GitHub — một con đường đã cố ý tắt
 * — nên mỗi ngày đẻ ra một dòng báo động giả, phải có riêng một bộ chặn để
 * khỏi rác file. Hỏi thẳng web thật thì không cần chặn gì cả: nó chỉ kêu đúng
 * lúc có chuyện.
 */
const webDaLen = day.ra.includes("Web thật đã cập nhật");
const webChuaLen = day.ra.includes("web thật vẫn chưa đổi");

if (webChuaLen) {
  await ghiNhatKy(
    `[${luc()}] ⚠ Đã đẩy lên GitHub nhưng WEB THẬT CHƯA CẬP NHẬT.\r\n` +
      `   Code không mất đi đâu, nhưng khách vẫn đang thấy bản cũ.\r\n` +
      `   Vào hPanel > Triển khai xem lần deploy gần nhất có lỗi không.`,
  );
} else {
  await ghiNhatKy(
    `[${luc()}] ✓ Đã đưa lên GitHub thành công.` +
      (webDaLen ? " Web thật đã cập nhật." : "") +
      (khongCoGiMoi ? " (chỉ cập nhật bảng hàng, ảnh không đổi)" : ""),
  );
}
