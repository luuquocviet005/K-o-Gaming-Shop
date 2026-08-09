/**
 * Đọc Google Sheet -> sinh ra src/data/products.json cho website.
 *
 *   npm run sync
 *
 * Mỗi tab trong Sheet là một danh mục (khai báo ở sync.config.json).
 * Script KHÔNG bao giờ ghi đè bằng dữ liệu rỗng: nếu Sheet tải hỏng hoặc
 * không có sản phẩm nào hợp lệ, nó dừng và giữ nguyên dữ liệu cũ — thà web
 * hiện hàng cũ vài chục phút còn hơn hiện một cửa hàng trống trơn.
 */

import { readFile, writeFile, mkdir, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parseCsv, toRecords } from "./lib/csv.mjs";
import {
  boDau,
  docAnh,
  docGia,
  docSoNguyen,
  docTinhTrang,
  duongDanAnh,
  mauTheoHang,
  slugify,
  timFileAnh,
} from "./lib/normalize.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(await readFile(join(root, "sync.config.json"), "utf8"));
const dichVu = join(root, "src", "data", "products.json");

/** Tên cột trong Sheet -> tên trường. Chấp nhận nhiều cách viết. */
function layO(row, ...tenCot) {
  for (const t of tenCot) {
    const v = row[t];
    if (v !== undefined && String(v).trim() !== "") return String(v).trim();
  }
  return "";
}

async function taiTab(tab) {
  const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Tab "${tab}": HTTP ${res.status}`);
  const text = await res.text();
  if (text.trimStart().startsWith("<"))
    throw new Error(`Tab "${tab}": Sheet đang riêng tư, không đọc được`);
  return toRecords(parseCsv(text));
}

/**
 * Ảnh sản phẩm nằm trong public/products/.
 *
 * Cách nối ảnh với sản phẩm, theo thứ tự ưu tiên:
 *   1. Cột "Ảnh" ghi tên file  -> dùng file đó
 *   2. Cột "Ảnh" ghi link http -> dùng link đó
 *   3. Không ghi gì            -> TỰ TÌM file trùng tên sản phẩm
 *
 * Nhờ bước 3 mà chủ shop chỉ cần tải ảnh lên và đặt tên theo tên món, không
 * phải sửa Sheet. So khớp bỏ qua dấu, hoa thường và ký tự đặc biệt nên
 * "Naga v2 hyperspeed.jpg" khớp với sản phẩm "Naga v2 hyperspeed".
 */
let fileAnh = [];
try {
  fileAnh = (await readdir(join(root, "public", "products")))
    .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f));
} catch {
  /* chưa có thư mục ảnh */
}

const canhBao = [];
const sanPham = [];
const danhMuc = [];
const daThay = new Map(); // khử trùng lặp giữa các tab

for (const cauHinh of config.tabs) {
  let duLieu;
  try {
    duLieu = await taiTab(cauHinh.tab);
  } catch (e) {
    canhBao.push(`✗ ${e.message}`);
    continue;
  }

  const { records, keys } = duLieu;

  // Cột "Hãng" ở tab Bàn phím đang có tiêu đề hỏng (một chuỗi số 1).
  // Dùng cột đầu tiên làm Hãng khi không tìm thấy tiêu đề đúng.
  const cotHangDauTien = keys.find(Boolean);
  const coTieuDeHang = keys.includes("hang");
  if (!coTieuDeHang) {
    canhBao.push(
      `⚠ Tab "${cauHinh.tab}": không thấy cột "Hãng" (tiêu đề đang là "${cotHangDauTien}") — tạm dùng cột đầu tiên.`,
    );
  }

  let demTrongTab = 0;

  for (const row of records) {
    const ten = layO(row, "ten san pham", "ten");
    if (!ten) continue; // dòng trống

    const hang = coTieuDeHang ? layO(row, "hang") : layO(row, cotHangDauTien);

    // Khử trùng lặp: cùng hãng + tên thì chỉ giữ lần xuất hiện đầu
    const khoa = `${boDau(hang)}|${boDau(ten)}`;
    if (daThay.has(khoa)) {
      canhBao.push(
        `⚠ Trùng: "${hang} ${ten}" có ở cả tab "${daThay.get(khoa)}" và "${cauHinh.tab}" — bỏ qua bản sau.`,
      );
      continue;
    }
    daThay.set(khoa, cauHinh.tab);

    const { gia, giaToiDa, ghiChuGia } = docGia(
      layO(row, "gia", "gia 1 cai", "gia ban"),
    );
    const { tinhTrang, nhomTinhTrang } = docTinhTrang(layO(row, "tinh trang"));
    let { anh, canhBao: canhBaoAnh } = docAnh(layO(row, "anh", "hinh anh"), fileAnh);

    // Cột Ảnh không dùng được thì thử tìm file trùng tên sản phẩm
    if (!anh) {
      const tuTim =
        timFileAnh(`${hang} ${ten}`, fileAnh) ?? timFileAnh(ten, fileAnh);
      if (tuTim) {
        anh = duongDanAnh(tuTim);
        canhBaoAnh = undefined;
      }
    }

    if (canhBaoAnh) {
      canhBao.push(`⚠ Ảnh "${ten}" (${cauHinh.tab}): ${canhBaoAnh}`);
    }

    let note = layO(row, "note", "ghi chu");
    if (note.startsWith("#")) {
      // Ô công thức lỗi kiểu #ERROR! / #REF!
      canhBao.push(`⚠ Ghi chú "${ten}" (${cauHinh.tab}): ô lỗi "${note}" — bỏ qua.`);
      note = "";
    }

    if (gia === 0) {
      canhBao.push(`⚠ "${ten}" (${cauHinh.tab}): chưa có giá — web sẽ hiện "Liên hệ".`);
    }

    let slug = slugify(`${hang} ${ten}`) || slugify(ten);
    if (sanPham.some((p) => p.slug === slug)) slug = `${slug}-${sanPham.length + 1}`;

    sanPham.push({
      id: slug,
      slug,
      ten,
      hang: hang || "Không rõ hãng",
      danhMuc: cauHinh.slug,
      gia,
      ...(giaToiDa ? { giaToiDa } : {}),
      ...(ghiChuGia ? { ghiChuGia } : {}),
      ...(cauHinh.donViGia ? { donViGia: cauHinh.donViGia } : {}),
      tinhTrang,
      nhomTinhTrang,
      diaDiem: layO(row, "dia diem", "khu vuc") || "Đà Nẵng",
      soLuong: docSoNguyen(layO(row, "so luong"), 0),
      ...(note ? { note } : {}),
      ...(anh ? { anh } : {}),
      mau: mauTheoHang(hang),
    });

    demTrongTab++;
  }

  // Danh mục rỗng thì không đưa lên web — shop có mục trống trông như bỏ hoang
  if (demTrongTab > 0) {
    danhMuc.push({
      slug: cauHinh.slug,
      name: cauHinh.name,
      short: cauHinh.short,
      icon: cauHinh.icon,
      blurb: cauHinh.blurb,
      ...(cauHinh.donViGia ? { donViGia: cauHinh.donViGia } : {}),
      soLuong: demTrongTab,
    });
  } else {
    canhBao.push(`⚠ Tab "${cauHinh.tab}": không có sản phẩm hợp lệ — ẩn khỏi web.`);
  }
}

// ── Chốt chặn an toàn ───────────────────────────────────────────────────
if (sanPham.length === 0) {
  console.error("");
  console.error("✗ Không đọc được sản phẩm nào. GIỮ NGUYÊN dữ liệu cũ, không ghi đè.");
  canhBao.forEach((c) => console.error(`  ${c}`));
  console.error("");
  process.exit(1);
}

await mkdir(dirname(dichVu), { recursive: true });

const duLieuMoi = { danhMuc, sanPham };
const json = JSON.stringify(duLieuMoi, null, 2) + "\n";

let cu = "";
try {
  cu = await readFile(dichVu, "utf8");
} catch {
  /* lần đầu chạy */
}

const coThayDoi = cu !== json;
if (coThayDoi) await writeFile(dichVu, json, "utf8");

// ── Báo cáo ─────────────────────────────────────────────────────────────
console.log("");
console.log("═══ ĐỒNG BỘ GOOGLE SHEET ═══");
console.log(`  Tổng sản phẩm : ${sanPham.length}`);
for (const d of danhMuc) console.log(`    ${d.name.padEnd(16)} ${d.soLuong}`);

const theoTinhTrang = {};
for (const p of sanPham)
  theoTinhTrang[p.tinhTrang || "(chưa ghi)"] =
    (theoTinhTrang[p.tinhTrang || "(chưa ghi)"] ?? 0) + 1;
console.log("");
console.log("  Theo tình trạng:");
for (const [k, v] of Object.entries(theoTinhTrang).sort((a, b) => b[1] - a[1]))
  console.log(`    ${k.padEnd(24)} ${v}`);

const coAnh = sanPham.filter((p) => p.anh);
const thieuAnh = sanPham.filter((p) => !p.anh);

console.log("");
console.log(`  Có ảnh thật   : ${coAnh.length}/${sanPham.length}`);
console.log(`  Có ghi chú    : ${sanPham.filter((p) => p.note).length}`);

if (thieuAnh.length) {
  console.log("");
  console.log(`  ${thieuAnh.length} món chưa có ảnh. Tải ảnh vào public/products/`);
  console.log("  và đặt tên đúng như dưới đây (đuôi .jpg/.png/.webp đều được):");
  console.log("");
  for (const p of thieuAnh.slice(0, 60)) {
    console.log(`    ${p.hang} ${p.ten}`);
  }
  if (thieuAnh.length > 60) console.log(`    … và ${thieuAnh.length - 60} món nữa`);
}

if (canhBao.length) {
  console.log("");
  console.log(`  ${canhBao.length} điểm cần chú ý trong Sheet:`);
  canhBao.forEach((c) => console.log(`    ${c}`));
}

console.log("");
console.log(coThayDoi ? "  ✓ Đã cập nhật src/data/products.json" : "  · Dữ liệu không đổi");
console.log("");
