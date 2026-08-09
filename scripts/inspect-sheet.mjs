/**
 * Soi cấu trúc Google Sheet trước khi viết phần ánh xạ dữ liệu.
 *
 *   node scripts/inspect-sheet.mjs "<link Google Sheet>"
 *
 * In ra: tên các cột, số dòng, và vài dòng đầu — đủ để biết Sheet đang tổ
 * chức thế nào mà không phải đoán.
 *
 * Link nhận được cả 3 dạng:
 *   - Link chia sẻ thường:  https://docs.google.com/spreadsheets/d/<ID>/edit#gid=0
 *   - Link "Xuất bản lên web" dạng CSV
 *   - Link CSV trực tiếp
 */

import { parseCsv, toRecords } from "./lib/csv.mjs";

/** Đổi mọi kiểu link Google Sheet thành link tải CSV */
export function toCsvUrl(input) {
  const url = input.trim();

  if (url.includes("output=csv") || url.includes("tqx=out:csv")) return url;

  const id = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)?.[1];
  if (!id) {
    throw new Error(
      "Không nhận ra link Google Sheet. Cần dạng https://docs.google.com/spreadsheets/d/<ID>/...",
    );
  }

  const gid = url.match(/[#&?]gid=([0-9]+)/)?.[1] ?? "0";
  // Điểm cuối gviz đọc được sheet đã bật "Bất kỳ ai có đường liên kết"
  return `https://docs.google.com/spreadsheets/d/${id}/gviz/tq?tqx=out:csv&gid=${gid}`;
}

const input = process.argv[2];
if (!input) {
  console.error("Thiếu link. Dùng: node scripts/inspect-sheet.mjs \"<link>\"");
  process.exit(1);
}

const csvUrl = toCsvUrl(input);
console.log("");
console.log("Đang tải:", csvUrl);

const res = await fetch(csvUrl, { redirect: "follow" });
if (!res.ok) {
  console.error(`✗ Tải thất bại: HTTP ${res.status} ${res.statusText}`);
  console.error("");
  console.error("  Thường do Sheet chưa mở quyền xem. Trong Google Sheets:");
  console.error("  Chia sẻ > Người có quyền truy cập chung >");
  console.error("  'Bất kỳ ai có đường liên kết' > Người xem");
  process.exit(1);
}

const text = await res.text();

if (text.trimStart().startsWith("<")) {
  console.error("✗ Google trả về trang HTML thay vì dữ liệu — Sheet đang ở chế độ riêng tư.");
  console.error("  Mở quyền: Chia sẻ > 'Bất kỳ ai có đường liên kết' > Người xem");
  process.exit(1);
}

const rows = parseCsv(text);
const { headers, keys, records } = toRecords(rows);

console.log("");
console.log("═══ CẤU TRÚC SHEET ═══");
console.log(`  Số dòng dữ liệu : ${records.length}`);
console.log(`  Số cột          : ${headers.length}`);
console.log("");
console.log("  Các cột:");
headers.forEach((h, i) => {
  const filled = records.filter((r) => (r[keys[i]] ?? "") !== "").length;
  console.log(
    `    ${String(i + 1).padStart(2)}. "${h}"  →  khoá: ${keys[i] || "(bỏ qua)"}  · có dữ liệu ${filled}/${records.length} dòng`,
  );
});

console.log("");
console.log("  3 dòng đầu:");
records.slice(0, 3).forEach((r) => {
  console.log("");
  console.log(`    ── Dòng ${r.__dong} ──`);
  for (const k of keys) {
    if (!k) continue;
    const v = r[k] ?? "";
    console.log(`      ${k}: ${v.length > 90 ? v.slice(0, 90) + "…" : v}`);
  }
});

// Đếm giá trị của các cột trông giống phân loại — thứ cần biết nhất
console.log("");
console.log("  Giá trị lặp lại theo cột (dấu hiệu cột phân loại):");
for (const k of keys) {
  if (!k) continue;
  const vals = records.map((r) => r[k]).filter(Boolean);
  const uniq = [...new Set(vals)];
  if (uniq.length > 1 && uniq.length <= 15 && vals.length > uniq.length) {
    console.log(`    ${k} → ${uniq.length} giá trị: ${uniq.join(" | ")}`);
  }
}
console.log("");
