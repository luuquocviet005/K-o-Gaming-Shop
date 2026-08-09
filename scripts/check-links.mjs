/**
 * Quét bản tĩnh trong out/ và kiểm tra mọi liên kết nội bộ có file thật hay không.
 *
 * Mô phỏng đúng cách Apache trên Hostinger phân giải đường dẫn:
 *   /gio-hang/  ->  out/gio-hang/index.html
 *   /icon.svg   ->  out/icon.svg
 *
 * Chạy: node scripts/check-links.mjs
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, posix } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");

if (!existsSync(out)) {
  console.error("Chưa có out/. Chạy `npm run build` trước.");
  process.exit(1);
}

/** Liệt kê mọi file trong out/, trả về đường dẫn kiểu URL */
async function walk(dir, base = "") {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...(await walk(join(dir, entry.name), rel)));
    else files.push(rel);
  }
  return files;
}

const allFiles = await walk(out);
const fileSet = new Set(allFiles.map((f) => `/${f}`));
const htmlFiles = allFiles.filter((f) => f.endsWith(".html"));

/** Apache phân giải một URL thành file nào? null = 404 */
function resolve(url) {
  if (fileSet.has(url)) return url;
  if (url.endsWith("/") && fileSet.has(`${url}index.html`)) return `${url}index.html`;
  if (!url.endsWith("/") && fileSet.has(`${url}/index.html`)) return `${url}/index.html`;
  if (fileSet.has(`${url}.html`)) return `${url}.html`;
  return null;
}

const broken = [];
const external = new Set();
let checked = 0;

const ATTR = /(?:href|src)\s*=\s*"([^"]+)"/g;

for (const file of htmlFiles) {
  const html = await readFile(join(out, file), "utf8");
  const pageUrl = `/${file.replace(/index\.html$/, "").replace(/\\/g, "/")}`;

  for (const m of html.matchAll(ATTR)) {
    const raw = m[1];

    if (
      !raw ||
      raw.startsWith("#") ||
      raw.startsWith("data:") ||
      raw.startsWith("mailto:") ||
      raw.startsWith("tel:") ||
      raw.startsWith("javascript:")
    )
      continue;

    if (/^https?:\/\//i.test(raw)) {
      external.add(raw.split("#")[0]);
      continue;
    }

    // Bỏ neo và query, giữ phần đường dẫn
    const clean = raw.split("#")[0].split("?")[0];
    if (!clean) continue;

    const abs = clean.startsWith("/")
      ? clean
      : posix.normalize(posix.join(pageUrl, clean));

    checked++;
    if (!resolve(abs)) broken.push({ page: `/${file}`, link: raw, resolved: abs });
  }
}

console.log("");
console.log("═══ KIỂM TRA LIÊN KẾT TRONG out/ ═══");
console.log(`  Số trang HTML quét   : ${htmlFiles.length}`);
console.log(`  Liên kết nội bộ kiểm : ${checked}`);
console.log(`  Liên kết ngoài       : ${external.size}`);
console.log("");

// Các file bắt buộc phải có
const required = [
  "/index.html",
  "/404.html",
  "/.htaccess",
  "/sitemap.xml",
  "/robots.txt",
  "/gio-hang/index.html",
  "/danh-muc/index.html",
  "/lien-he/index.html",
  "/chinh-sach/index.html",
];
const missing = required.filter((f) => !fileSet.has(f));

if (missing.length) {
  console.log("  ✗ THIẾU FILE BẮT BUỘC:");
  missing.forEach((f) => console.log(`      ${f}`));
} else {
  console.log("  ✓ Có đủ file bắt buộc (index, 404, .htaccess, sitemap, robots…)");
}

if (broken.length) {
  console.log("");
  console.log(`  ✗ CÓ ${broken.length} LIÊN KẾT CHẾT:`);
  for (const b of broken.slice(0, 30)) {
    console.log(`      ${b.page}`);
    console.log(`        -> "${b.link}"  (phân giải thành ${b.resolved})`);
  }
} else {
  console.log("  ✓ Không có liên kết nội bộ nào chết");
}

console.log("");
console.log("  Liên kết ra ngoài (cần tự kiểm tra bằng mắt):");
[...external].sort().forEach((u) => console.log(`      ${u}`));
console.log("");

process.exit(broken.length || missing.length ? 1 : 0);
