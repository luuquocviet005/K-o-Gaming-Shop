/**
 * Kiểm tra → commit → push, trong một lệnh.
 *
 *   npm run push                    (tự đặt lời nhắn theo ngày giờ)
 *   npm run push -- "Sửa giá chuột"  (lời nhắn tự đặt)
 *
 * VÌ SAO PHẢI KIỂM TRA TRƯỚC KHI PUSH:
 * Nhánh main nối thẳng với Hostinger — push xong là website thật deploy lại.
 * Nếu bản build hỏng hoặc có link chết mà vẫn push, khách vào keogaminggear.com
 * sẽ thấy trang lỗi. Nên mọi bước dưới đây phải qua hết thì mới được push.
 */

import { spawnSync } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function run(cmd, args, { quiet = false } = {}) {
  // Trên Windows chỉ `npm` mới cần shell (nó là file .cmd). Không được bật
  // shell cho `git`: shell sẽ cắt lời nhắn commit có dấu cách thành nhiều
  // tham số, khiến "Sửa giá chuột" biến thành 3 đối số rời rạc.
  const needsShell = process.platform === "win32" && cmd === "npm";
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: quiet ? "pipe" : "inherit",
    shell: needsShell,
    encoding: "utf8",
  });
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

function step(label, cmd, args) {
  process.stdout.write(`  ${label} … `);
  const { code, out } = run(cmd, args, { quiet: true });
  if (code !== 0) {
    console.log("HỎNG\n");
    console.log(out);
    console.error(`✗ Dừng lại: bước "${label}" không qua. KHÔNG push gì cả.`);
    console.error("  Sửa xong rồi chạy lại `npm run push`.\n");
    process.exit(1);
  }
  console.log("đạt");
}

console.log("");
console.log("═══ KIỂM TRA TRƯỚC KHI PUSH ═══");

// Có gì để push không?
const { out: status } = run("git", ["status", "--porcelain"], { quiet: true });
const { out: ahead } = run("git", ["rev-list", "--count", "origin/main..main"], {
  quiet: true,
});

if (!status.trim() && Number(ahead.trim()) === 0) {
  console.log("");
  console.log("  Không có thay đổi nào. Mọi thứ đã đồng bộ với GitHub.");
  console.log("");
  process.exit(0);
}

step("Kiểm tra kiểu dữ liệu", "npm", ["run", "typecheck"]);
step("Kiểm tra code (lint)", "npm", ["run", "lint"]);
step("Build trang tĩnh", "npm", ["run", "build"]);
step("Quét link chết + SEO + tương phản", "npm", ["run", "check"]);

console.log("");
console.log("═══ ĐẨY LÊN GITHUB ═══");

const custom = process.argv.slice(2).join(" ").trim();
const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
const message = custom || `Cập nhật nội dung website — ${now}`;

if (status.trim()) {
  if (run("git", ["add", "-A"]).code !== 0) process.exit(1);
  if (run("git", ["commit", "-m", message]).code !== 0) process.exit(1);
  console.log(`  ✓ Đã commit: ${message}`);
} else {
  console.log("  · Không có thay đổi mới, chỉ đẩy commit đang chờ");
}

if (run("git", ["push", "origin", "main"]).code !== 0) {
  console.error("");
  console.error("✗ Push thất bại. Thường do chưa đăng nhập GitHub.");
  console.error("  Chạy `git push origin main` một lần trong terminal để đăng nhập.");
  console.error("");
  process.exit(1);
}

console.log("");
console.log("  ✓ Đã đẩy lên https://github.com/luuquocviet005/K-o-Gaming-Shop");
console.log("  → Hostinger sẽ tự deploy lại. Theo dõi ở hPanel > Triển khai.");
console.log("");
