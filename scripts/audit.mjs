/**
 * Kiểm tra chất lượng bản tĩnh trong out/ trước khi deploy.
 * Soi thẳng file HTML sẽ được upload, không phụ thuộc trình duyệt.
 *
 * Chạy: node scripts/audit.mjs
 */

import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "out");

if (!existsSync(out)) {
  console.error("Chưa có out/. Chạy `npm run build` trước.");
  process.exit(1);
}

async function walk(dir, base = "") {
  const files = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const rel = base ? `${base}/${e.name}` : e.name;
    if (e.isDirectory()) files.push(...(await walk(join(dir, e.name), rel)));
    else if (e.name.endsWith(".html")) files.push(rel);
  }
  return files;
}

const pages = await walk(out);

// Không có trang nào = build hỏng. Không được báo "đạt" trong trường hợp này.
if (pages.length === 0) {
  console.error("✗ out/ không chứa file HTML nào. Build chưa chạy hoặc đã hỏng.");
  process.exit(1);
}

const problems = [];
const titles = new Map();
const descs = new Map();

function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].trim() : null;
}

let jsonLdCount = 0;

for (const page of pages) {
  const html = await readFile(join(out, page), "utf8");
  const url = `/${page.replace(/index\.html$/, "")}`;

  const title = pick(html, /<title>([^<]*)<\/title>/i);
  const desc = pick(html, /<meta name="description" content="([^"]*)"/i);
  const lang = pick(html, /<html[^>]*lang="([^"]*)"/i);
  const viewport = pick(html, /<meta name="viewport" content="([^"]*)"/i);

  if (!title) problems.push(`${url} — thiếu <title>`);
  else {
    if (title.length > 70) problems.push(`${url} — <title> dài ${title.length} ký tự (nên ≤ 70)`);
    titles.set(title, (titles.get(title) ?? 0) + 1);
  }

  if (!desc) problems.push(`${url} — thiếu meta description`);
  else {
    if (desc.length < 50) problems.push(`${url} — description quá ngắn (${desc.length} ký tự)`);
    descs.set(desc, (descs.get(desc) ?? 0) + 1);
  }

  if (lang !== "vi") problems.push(`${url} — lang="${lang}" (phải là "vi")`);
  if (!viewport) problems.push(`${url} — thiếu meta viewport`);
  if (viewport && /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/.test(viewport))
    problems.push(`${url} — viewport chặn phóng to (vi phạm khả năng tiếp cận)`);

  // Ảnh phải có alt
  for (const m of html.matchAll(/<img\b((?:(?!alt=)[^>])*)>/g)) {
    if (!/alt=/.test(m[1])) problems.push(`${url} — có <img> thiếu alt`);
  }

  // Mỗi trang đúng một <h1>
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 === 0 && !page.startsWith("404")) problems.push(`${url} — không có <h1>`);
  if (h1 > 1) problems.push(`${url} — có ${h1} thẻ <h1> (chỉ nên 1)`);

  if (html.includes('type="application/ld+json"')) jsonLdCount++;
}

const dupTitles = [...titles].filter(([, n]) => n > 1);
const dupDescs = [...descs].filter(([, n]) => n > 1);

console.log("");
console.log("═══ AUDIT BẢN TĨNH out/ ═══");
console.log(`  Số trang kiểm tra        : ${pages.length}`);
console.log(`  Trang có dữ liệu JSON-LD : ${jsonLdCount}`);
console.log(`  Tiêu đề trùng nhau       : ${dupTitles.length}`);
console.log(`  Mô tả trùng nhau         : ${dupDescs.length}`);
console.log("");

for (const [t, n] of dupTitles) console.log(`  ⚠ ${n} trang cùng tiêu đề: "${t}"`);
for (const [d, n] of dupDescs)
  console.log(`  ⚠ ${n} trang cùng mô tả: "${d.slice(0, 60)}…"`);

if (problems.length === 0) {
  console.log("  ✓ Không phát hiện vấn đề nào");
} else {
  console.log(`  ✗ ${problems.length} vấn đề:`);
  problems.slice(0, 40).forEach((p) => console.log(`      ${p}`));
  if (problems.length > 40) console.log(`      … và ${problems.length - 40} vấn đề nữa`);
}
console.log("");

process.exit(problems.length ? 1 : 0);
