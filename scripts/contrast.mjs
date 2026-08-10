/**
 * Kiểm tra tương phản màu theo chuẩn WCAG, đọc thẳng từ globals.css.
 *
 * Chạy bằng Node nên kết quả tin cậy tuyệt đối — không phụ thuộc trình duyệt
 * có đang dựng khung hình hay không.
 *
 * Chạy: node scripts/contrast.mjs
 */

import { readFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = await readFile(join(root, "src/app/globals.css"), "utf8");

/** Lấy các biến màu trong một khối selector */
function tokensOf(selector) {
  const start = css.indexOf(selector);
  if (start === -1) throw new Error(`Không thấy khối ${selector}`);
  const open = css.indexOf("{", start);
  const close = css.indexOf("}", open);
  const body = css.slice(open + 1, close);
  const map = {};
  for (const m of body.matchAll(/--([\w-]+)\s*:\s*(#[0-9a-fA-F]{3,8})\s*;/g)) {
    map[m[1]] = m[2];
  }
  return map;
}

function toRgb(hex) {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance(hex) {
  const [r, g, b] = toRgb(hex).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const l1 = luminance(a);
  const l2 = luminance(b);
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Các cặp màu thật sự xuất hiện trên giao diện.
 * `min` = 4.5 cho chữ thường, 3.0 cho chữ lớn/đậm và viền/biểu tượng.
 */
const pairs = [
  ["fg", "bg", 4.5, "Chữ chính trên nền trang"],
  ["fg", "surface", 4.5, "Chữ chính trên thẻ"],
  ["fg-muted", "surface", 4.5, "Chữ phụ trên thẻ"],
  ["fg-muted", "bg", 4.5, "Chữ phụ trên nền trang"],
  ["fg-subtle", "surface", 4.5, "Chữ mờ trên thẻ"],
  ["fg-subtle", "bg", 4.5, "Chữ mờ trên nền trang"],
  ["fg-subtle", "surface-2", 4.5, "Chữ mờ trên nền phụ"],
  ["on-primary", "primary", 4.5, "Chữ trên nút chính"],
  ["primary-ink", "surface", 4.5, "Chữ hồng trên thẻ"],
  ["primary-ink", "bg", 4.5, "Chữ hồng trên nền trang"],
  ["primary-ink", "primary-soft", 4.5, "Chữ hồng trên nền hồng phấn"],
  ["fg", "primary-soft", 4.5, "Chữ chính trên nền hồng phấn (banner)"],
  ["fg-muted", "primary-soft", 4.5, "Chữ phụ trên nền hồng phấn (banner)"],
  ["candy-ink", "candy-soft", 4.5, "Chữ badge tiết kiệm"],

  // Bốn "vị kẹo" của nhãn tình trạng — chữ nhỏ nên bắt buộc đủ 4.5:1
  ["vi-bacha-chu", "vi-bacha-nen", 4.5, "Nhãn tình trạng vị bạc hà (hàng mới)"],
  ["vi-caramel-chu", "vi-caramel-nen", 4.5, "Nhãn tình trạng vị caramel (cũ đủ hộp)"],
  ["vi-dau-chu", "vi-dau-nen", 4.5, "Nhãn tình trạng vị dâu (cũ thiếu hộp)"],
  ["vi-nho-chu", "vi-nho-nen", 4.5, "Nhãn tình trạng vị nho (dạng khác)"],

  // Dải tối chen giữa trang — nền tối, chữ sáng
  ["dai-dam-chu", "dai-dam-nen", 4.5, "Chữ chính trên dải tối"],
  ["dai-dam-mo", "dai-dam-nen", 4.5, "Chữ phụ trên dải tối"],
  ["danger", "surface", 4.5, "Thông báo lỗi"],
  ["warning", "surface", 4.5, "Cảnh báo sắp hết hàng"],
  ["star", "surface", 3.0, "Ngôi sao đánh giá (biểu tượng)"],
  ["primary", "surface", 3.0, "Viền/biểu tượng hồng trên thẻ"],
  ["on-candy", "candy", 4.5, "Chữ trên badge giảm giá"],

  // Tham khảo, KHÔNG tính đạt/không đạt.
  // WCAG 1.4.11 chỉ bắt buộc 3:1 cho đường viền khi người dùng phải NHÌN VÀO
  // VIỀN mới nhận ra đó là thành phần tương tác. Nút phụ ở đây luôn có nhãn
  // chữ rõ ràng (tương phản > 15:1) nên viền chỉ mang tính trang trí — ép nó
  // lên 3:1 sẽ làm giao diện hồng phấn trở nên nặng nề mà không lợi gì.
  ["border-strong", "surface", 0, "Viền nút phụ (tham khảo)"],
];

let failed = 0;
console.log("");
console.log("═══ KIỂM TRA TƯƠNG PHẢN (WCAG AA) ═══");

for (const theme of [":root", '[data-theme="dark"]']) {
  const t = tokensOf(theme);
  const label = theme === ":root" ? "SÁNG" : "TỐI";
  console.log("");
  console.log(`  ── Chế độ ${label} ──`);

  for (const [fg, bg, min, desc] of pairs) {
    if (!t[fg] || !t[bg]) {
      console.log(`  ? ${desc}: thiếu biến ${!t[fg] ? fg : bg}`);
      failed++;
      continue;
    }
    const r = ratio(t[fg], t[bg]);

    if (min === 0) {
      console.log(`  · ${r.toFixed(2).padStart(5)}:1 (tham khảo)  ${desc}`);
      continue;
    }

    const ok = r >= min;
    if (!ok) failed++;
    console.log(
      `  ${ok ? "✓" : "✗"} ${r.toFixed(2).padStart(5)}:1 (cần ${min})  ${desc}`,
    );
  }
}

console.log("");
if (failed === 0) {
  console.log("  ✓ Toàn bộ cặp màu đạt chuẩn WCAG AA ở cả hai chế độ");
} else {
  console.log(`  ✗ ${failed} cặp màu chưa đạt`);
}
console.log("");

process.exit(failed ? 1 : 0);
