/**
 * Chạy sau `next build`.
 *
 * Dự án hỗ trợ HAI chế độ deploy, và script này tự nhận ra mình đang ở chế độ nào:
 *
 *   A. TĨNH (mặc định — next.config.ts đặt output: "export")
 *      `next build` sinh ra out/. Dùng cho Hostinger Shared Hosting:
 *      upload nội dung out/ vào public_html/. Không cần Node trên máy chủ.
 *
 *   B. MÁY CHỦ (khi nền tảng deploy tự ghi đè cấu hình)
 *      Hostinger Deployment, Vercel, Netlify… nhận diện đây là Next.js rồi
 *      build ở chế độ máy chủ: có .next, KHÔNG có out/. Nền tảng tự chạy ứng
 *      dụng bằng Node. Trường hợp này build vẫn HỢP LỆ — không được báo lỗi,
 *      nếu không sẽ làm hỏng cả lượt deploy đang thành công.
 */

import { copyFile, readdir, readFile, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");
const nextDir = join(root, ".next");

/** Chế độ B: nền tảng đã build ở chế độ máy chủ và sẽ tự phục vụ ứng dụng */
async function reportServerMode() {
  console.log("");
  console.log("  ℹ Không thấy out/, nhưng .next/ đã được tạo.");
  console.log("");
  console.log("    Nền tảng deploy đang build ở CHẾ ĐỘ MÁY CHỦ và bỏ qua");
  console.log('    `output: "export"`. Đây không phải lỗi — nền tảng sẽ tự chạy');
  console.log("    ứng dụng bằng Node, không cần thư mục out/.");
  console.log("");
  console.log(`    Node.js : ${process.version}`);
  console.log(`    Hệ điều hành : ${process.platform}`);

  const envKeys = Object.keys(process.env)
    .filter((k) => /^(NEXT_|VERCEL|NETLIFY|CF_PAGES|HOSTINGER|H_|BUILD_|DEPLOY)/i.test(k))
    .sort();
  console.log(
    `    Biến môi trường liên quan: ${envKeys.length ? envKeys.join(", ") : "không có"}`,
  );

  try {
    const entries = await readdir(nextDir, { withFileTypes: true });
    console.log(
      `    Nội dung .next/: ${entries.map((e) => e.name).sort().join(", ")}`,
    );
  } catch {
    /* không đọc được thì bỏ qua */
  }

  console.log("");
  console.log("    Muốn bản TĨNH để upload thủ công lên public_html/,");
  console.log("    chạy trên máy của bạn (Node >= 20.9):  npm run build");
  console.log("");
}

/** Không có cả out/ lẫn .next/ nghĩa là build thật sự hỏng */
function reportBroken() {
  console.error("");
  console.error("  ✗ Build hỏng: không có out/ lẫn .next/.");
  console.error(`    Node.js : ${process.version}`);
  console.error(`    Thư mục dự án : ${root}`);
  console.error(`    Thư mục hiện tại : ${process.cwd()}`);
  console.error("");
  console.error("    Kiểm tra: build có chạy đúng thư mục chứa package.json không,");
  console.error("    và Node có đạt phiên bản >= 20.9 không.");
  console.error("");
}

if (!existsSync(out)) {
  if (existsSync(nextDir)) {
    await reportServerMode();
    process.exit(0); // Build hợp lệ — để nền tảng deploy chạy tiếp
  }
  reportBroken();
  process.exit(1);
}

// ─────────────── Từ đây trở xuống là chế độ TĨNH ───────────────

await copyFile(join(root, "deploy", ".htaccess"), join(out, ".htaccess"));

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

// Lỗi deploy phổ biến nhất: upload cả thư mục out thay vì nội dung bên trong.
if (!existsSync(join(out, "index.html"))) {
  console.error("");
  console.error("  ✗ Không thấy out/index.html — trang chủ sẽ bị 404 sau khi deploy.");
  console.error("");
  process.exit(1);
}

async function dirSize(dir) {
  let total = 0;
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    total += entry.isDirectory() ? await dirSize(full) : (await stat(full)).size;
  }
  return total;
}

const mb = ((await dirSize(out)) / 1024 / 1024).toFixed(2);

console.log("");
console.log(`  ✓ Đã đặt tiêu đề riêng cho ${patched} bản HTML của trang 404`);
console.log("  ✓ Đã copy .htaccess vào out/");
console.log("  ✓ Có out/index.html ở gốc");
console.log(`  ✓ Trang tĩnh sẵn sàng: out/  (${mb} MB)`);
console.log("");
console.log("  Deploy lên Hostinger: upload TOÀN BỘ nội dung bên trong out/");
console.log("  vào thư mục public_html/ (không upload cả thư mục out).");
console.log("");
