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
import { kiemTraDeploy } from "./lib/kiem-tra-deploy.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/**
 * Chạy một lệnh, KHÔNG dùng shell.
 *
 * Vì sao không gọi qua `npm run ...`: trên Windows `npm` là file .cmd, mà
 * Node 24 chặn thực thi .cmd nếu không bật shell (lý do bảo mật). Còn bật
 * shell thì lời nhắn commit có dấu cách lại bị cắt vụn. Nên gọi thẳng từng
 * công cụ bằng chính Node đang chạy — cách này giống nhau trên mọi hệ điều hành.
 */
function run(cmd, args, { quiet = false } = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: quiet ? "pipe" : "inherit",
    encoding: "utf8",
  });
  if (r.error) return { code: 1, out: String(r.error.message) };
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

const node = process.execPath;
const bin = (...p) => join(root, "node_modules", ...p);

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

step("Kiểm tra kiểu dữ liệu", node, [bin("typescript", "bin", "tsc"), "--noEmit"]);
step("Kiểm tra code (lint)", node, [bin("eslint", "bin", "eslint.js")]);
step("Build trang tĩnh", node, [bin("next", "dist", "bin", "next"), "build"]);
step("Chuẩn bị thư mục out/", node, [join(root, "scripts", "postbuild.mjs")]);
step("Quét link chết", node, [join(root, "scripts", "check-links.mjs")]);
step("Kiểm tra SEO", node, [join(root, "scripts", "audit.mjs")]);
step("Kiểm tra tương phản màu", node, [join(root, "scripts", "contrast.mjs")]);

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

/**
 * Kéo bản trên mạng về trước khi đẩy.
 *
 * GitHub Actions tự chạy 20 phút một lần và commit lại bảng hàng, nên rất hay
 * xảy ra chuyện trên mạng đã đi trước trong lúc mình đang làm. Không gộp
 * trước thì push bị từ chối và người dùng phải tự xử lý Git — thứ họ không
 * nên phải biết.
 */
console.log("  · Đồng bộ với bản trên GitHub…");
if (run("git", ["pull", "--rebase", "origin", "main"], { quiet: true }).code !== 0) {
  console.error("");
  console.error("✗ Không gộp được với bản trên GitHub (có thể đang xung đột).");
  console.error("  Chạy `git status` để xem chi tiết.");
  console.error("");
  process.exit(1);
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

/*
 * Báo tình trạng workflow "Build & Deploy lên Hostinger" trên GitHub.
 *
 * CẨN THẬN VỚI CÁCH DIỄN ĐẠT: workflow này KHÔNG phải đường duy nhất đưa code
 * lên web. Hostinger còn tự kéo code về theo cơ chế riêng của nó, và đường đó
 * vẫn chạy tốt kể cả khi workflow FTP hỏng — đã kiểm chứng: workflow hỏng liên
 * tục nhiều ngày mà hàng mới vẫn lên web bình thường.
 *
 * Nên ở đây chỉ nói ĐÚNG thứ quan sát được: workflow đó hỏng. Không được kết
 * luận "web chưa cập nhật" — nói vậy là báo động giả, và báo động giả lặp lại
 * thì lần hỏng thật sẽ bị bỏ qua.
 */
const remote = run("git", ["remote", "get-url", "origin"], { quiet: true }).out;
const deploy = await kiemTraDeploy(remote);

if (deploy && !deploy.ok) {
  console.log("");
  console.log("  ⚠ Workflow FTP trên GitHub đang lỗi (không phải lỗi của lần push này).");
  console.log(`     Lần chạy ${deploy.luc} — kết quả: ${deploy.ketLuan}`);
  console.log("     Hostinger vẫn tự deploy theo đường riêng, nên web vẫn lên hàng.");
  console.log("     Sửa hoặc tắt hẳn workflow này để khỏi nhiễu:");
  console.log(`     ${deploy.url}`);
} else if (deploy) {
  console.log(`  → Đang deploy. Workflow lần trước: ${deploy.ketLuan} (${deploy.luc}).`);
} else {
  console.log("  → Hostinger sẽ tự deploy lại. Theo dõi ở hPanel > Triển khai.");
}
console.log("");
