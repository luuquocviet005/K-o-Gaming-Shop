/**
 * Chạy sau `next build`.
 * 1. Copy deploy/.htaccess vào out/ (Next không copy file ẩn từ public/ một
 *    cách chắc chắn trên mọi nền tảng, nên làm thủ công cho an toàn).
 * 2. In ra tóm tắt để biết cần upload gì lên Hostinger.
 *
 * Nếu không thấy out/, script in ra chẩn đoán chi tiết thay vì chỉ báo lỗi —
 * vì nguyên nhân gần như luôn là môi trường build, không phải mã nguồn.
 */

import { copyFile, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");

async function diagnose() {
  console.error("");
  console.error("  ✗ next build đã chạy xong nhưng KHÔNG sinh ra thư mục out/");
  console.error("");
  console.error("  Thông tin môi trường:");
  console.error(`    Node.js        : ${process.version}`);
  console.error(`    Hệ điều hành   : ${process.platform}`);
  console.error(`    Thư mục dự án  : ${root}`);
  console.error(`    Thư mục hiện tại: ${process.cwd()}`);

  const flags = [
    "VERCEL",
    "NETLIFY",
    "CF_PAGES",
    "RENDER",
    "AWS_AMPLIFY",
    "GITHUB_ACTIONS",
  ].filter((k) => process.env[k]);
  console.error(
    `    Nền tảng nhận diện: ${flags.length ? flags.join(", ") : "không rõ (chạy trực tiếp)"}`,
  );

  try {
    const entries = await readdir(root, { withFileTypes: true });
    const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name);
    console.error(`    Thư mục con    : ${dirs.join(", ")}`);
  } catch {
    console.error("    Không đọc được nội dung thư mục dự án.");
  }

  console.error("");
  console.error("  Nguyên nhân thường gặp:");
  console.error("    1. Nền tảng deploy (Vercel/Netlify/Cloudflare…) tự chèn build");
  console.error("       adapter và bỏ qua `output: \"export\"` trong next.config.ts.");
  console.error("       -> Những nền tảng đó tự deploy, KHÔNG cần out/. Bỏ bước này.");
  console.error("    2. next.config.ts bị ghi đè hoặc thiếu `output: \"export\"`.");
  console.error("    3. Build chạy trong thư mục khác với thư mục chứa package.json.");
  console.error("");
  console.error("  Trang này chỉ cần build tĩnh. Cách chắc chắn nhất là chạy trên");
  console.error("  máy của bạn (Node >= 20.9) rồi upload out/ lên Hostinger:");
  console.error("      npm run build");
  console.error("");
  process.exit(1);
}

if (!existsSync(out)) {
  await diagnose();
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

// Kiểm tra index.html có nằm ở gốc out/ không — đây là lỗi deploy phổ biến
// nhất: upload cả thư mục out thay vì nội dung bên trong nó.
if (!existsSync(join(out, "index.html"))) {
  console.error("");
  console.error("  ✗ Không thấy out/index.html — trang chủ sẽ bị 404 sau khi deploy.");
  console.error("");
  process.exit(1);
}

/**
 * Đặt tiêu đề riêng cho trang 404.
 *
 * Next.js không cho phép export `metadata` từ `not-found.tsx`, nên cả 3 bản
 * HTML của trang 404 đều thừa hưởng tiêu đề mặc định của trang chủ. Trùng
 * tiêu đề như vậy gây nhầm lẫn cho công cụ tìm kiếm, nên sửa trực tiếp trên
 * file đã build.
 */
const NOT_FOUND_TITLE = "Không tìm thấy trang | KẸO GAMING SHOP";
const NOT_FOUND_DESC =
  "Trang bạn tìm không tồn tại hoặc đã được chuyển đi. Xem các sản phẩm gaming gear đang bán chạy tại KẸO GAMING SHOP.";

let patched = 0;
for (const file of ["404.html", "404/index.html", "_not-found/index.html"]) {
  const path = join(out, file);
  if (!existsSync(path)) continue;
  const html = await readFile(path, "utf8");
  const next = html
    .replace(/<title>[^<]*<\/title>/, `<title>${NOT_FOUND_TITLE}</title>`)
    .replace(
      /<meta name="description" content="[^"]*"\/?>/,
      `<meta name="description" content="${NOT_FOUND_DESC}"/>`,
    );
  if (next !== html) {
    await writeFile(path, next, "utf8");
    patched++;
  }
}

const bytes = await dirSize(out);
const mb = (bytes / 1024 / 1024).toFixed(2);

console.log("");
console.log(`  ✓ Đã đặt tiêu đề riêng cho ${patched} bản HTML của trang 404`);
console.log("  ✓ Đã copy .htaccess vào out/");
console.log("  ✓ Có out/index.html ở gốc");
console.log(`  ✓ Trang tĩnh sẵn sàng: out/  (${mb} MB)`);
console.log("");
console.log("  Deploy lên Hostinger: upload TOÀN BỘ nội dung bên trong out/");
console.log("  vào thư mục public_html/ (không upload cả thư mục out).");
console.log("");
