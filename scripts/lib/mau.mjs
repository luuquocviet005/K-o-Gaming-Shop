/**
 * Đọc bảng màu thẳng từ src/app/globals.css.
 *
 * globals.css là NGUỒN DUY NHẤT cho màu thương hiệu. Trước đây mỗi script sinh
 * ảnh tự chép lại mã màu vào hằng số riêng, nên đổi màu trong CSS thì ảnh chia
 * sẻ và bộ logo vẫn giữ màu cũ — sai lặng lẽ, chỉ lộ ra khi khách nhìn thấy.
 *
 * Tự kiểm tra: node scripts/lib/mau.mjs
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const css = await readFile(join(root, "src/app/globals.css"), "utf8");

/** Lấy toàn bộ biến màu trong một khối selector (":root" hoặc '[data-theme="dark"]') */
export function tokensOf(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Không thấy khối ${selector} trong globals.css`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);
  const map = {};
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    map[m[1]] = m[2];
  }
  return map;
}

/** Một biến màu, ví dụ bien("primary") -> "#c2185b". Thiếu biến thì ném lỗi
 *  ngay chứ không trả undefined — ảnh sinh ra với màu `undefined` là màu đen. */
export function bien(ten, selector = ":root") {
  const hex = tokensOf(selector)[ten];
  if (!hex) throw new Error(`globals.css ${selector} không có --${ten}`);
  return hex;
}

/** "#c2185b" -> [194, 24, 91] */
export function toRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Dạng sharp cần: bien("bg") -> { r, g, b } */
export function rgbSharp(ten, selector = ":root") {
  const [r, g, b] = toRgb(bien(ten, selector));
  return { r, g, b };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const { strict: assert } = await import("node:assert");
  const sang = tokensOf(":root");
  const toi = tokensOf('[data-theme="dark"]');
  assert.ok(Object.keys(sang).length > 20, "khối :root phải có đủ biến màu");
  assert.ok(toi.primary && toi.primary !== sang.primary, "chế độ tối phải có --primary riêng");
  assert.deepEqual(toRgb("#c2185b"), [194, 24, 91]);
  assert.deepEqual(toRgb("#fff"), [255, 255, 255]);
  assert.deepEqual(rgbSharp("bg"), { r: 253, g: 247, b: 249 });
  assert.equal(bien("primary"), sang.primary);
  assert.throws(() => bien("khong-ton-tai"), /không có --khong-ton-tai/);
  assert.throws(() => tokensOf(":khong-co-khoi-nay"), /Không thấy khối/);
  console.log("✓ mau.mjs: đọc globals.css đúng (%d biến sáng, %d biến tối)",
    Object.keys(sang).length, Object.keys(toi).length);
}
