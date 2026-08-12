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

/** Giữ khớp với HANG_TRONG trong src/lib/products.ts */
const HANG_TRONG = "Không rõ hãng";

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

/** CSV thô của từng tab, để bắt lỗi tab ma ở dưới */
const csvTheoTab = new Map();

async function taiTab(tab) {
  const url = `https://docs.google.com/spreadsheets/d/${config.sheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(tab)}`;
  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) throw new Error(`Tab "${tab}": HTTP ${res.status}`);
  const text = await res.text();
  if (text.trimStart().startsWith("<"))
    throw new Error(`Tab "${tab}": Sheet đang riêng tư, không đọc được`);
  csvTheoTab.set(tab, text);
  return toRecords(parseCsv(text));
}

/**
 * BẮT "TAB MA".
 *
 * Khi tên tab không tồn tại, Google KHÔNG báo lỗi — nó trả về HTTP 200 kèm dữ
 * liệu của tab ĐẦU TIÊN trong Sheet. Hậu quả: đổi tên một tab mà quên sửa
 * sync.config.json thì toàn bộ hàng của tab đầu tiên bị nhân đôi sang danh mục
 * sai, bộ khử trùng lặp gạt hết đi, và danh mục đó lặng lẽ biến mất khỏi web.
 * Đã xảy ra thật với tab "Đồ lặt vật" sau khi nó được đổi tên thành "Phụ kiện".
 *
 * Cách bắt: hai tab khác tên mà trả về CSV giống hệt nhau thì chắc chắn có ít
 * nhất một cái không còn tồn tại.
 */
function timTabMa() {
  const theoNoiDung = new Map();
  for (const [tab, csv] of csvTheoTab) {
    if (!theoNoiDung.has(csv)) theoNoiDung.set(csv, []);
    theoNoiDung.get(csv).push(tab);
  }
  return [...theoNoiDung.values()].filter((nhom) => nhom.length > 1);
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
/** slug sản phẩm -> danh sách ảnh trong public/products/<slug>/ */
const anhTheoThuMuc = new Map();

try {
  const muc = await readdir(join(root, "public", "products"), { withFileTypes: true });

  fileAnh = muc
    .filter((m) => m.isFile() && /\.(jpe?g|png|webp|avif|gif)$/i.test(m.name))
    .map((m) => m.name);

  // Thư mục con = một sản phẩm nhiều ảnh, do scripts/nap-anh.mjs tạo ra
  for (const m of muc) {
    if (!m.isDirectory()) continue;
    const trong = (await readdir(join(root, "public", "products", m.name)))
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, "vi", { numeric: true }));
    if (trong.length) {
      anhTheoThuMuc.set(
        m.name,
        trong.map((f) => `/products/${m.name}/${encodeURIComponent(f)}`),
      );
    }
  }
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

    let hang = coTieuDeHang ? layO(row, "hang") : layO(row, cotHangDauTien);

    // Ô thương hiệu điền trùng tên cột ("Hãng") là dấu vết dòng tiêu đề bị
    // chép nhầm xuống ô dữ liệu — coi như chưa điền, và báo để chủ shop sửa.
    if (boDau(hang) === "hang" || boDau(hang) === "ten san pham") {
      canhBao.push(
        `⚠ "${ten}" (${cauHinh.tab}): ô Hãng đang ghi "${hang}" — nhập đúng tên hãng vào Sheet.`,
      );
      hang = "";
    }

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

    // Thư mục ảnh riêng của sản phẩm được ưu tiên hơn mọi cách tìm ảnh khác
    const boAnh = anhTheoThuMuc.get(slug);
    if (boAnh) anh = boAnh[0];

    sanPham.push({
      id: slug,
      slug,
      ten,
      hang: hang || HANG_TRONG,
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
      ...(boAnh && boAnh.length > 1 ? { anhs: boAnh } : {}),
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

/**
 * Thư mục ảnh không còn sản phẩm nào tương ứng.
 *
 * Xảy ra khi món hàng bị đổi tên hoặc gỡ khỏi Sheet sau khi đã có ảnh. Ảnh
 * mồ côi vẫn nằm trong kho mã và bị đẩy lên máy chủ, nên phải báo để dọn —
 * script KHÔNG tự xoá, vì có thể chỉ là đổi tên tạm và ảnh sẽ dùng lại.
 */
const boSlug = new Set(sanPham.map((p) => p.slug));
for (const slug of anhTheoThuMuc.keys()) {
  if (!boSlug.has(slug)) {
    canhBao.push(
      `⚠ Ảnh mồ côi: public/products/${slug}/ không còn sản phẩm nào dùng — xoá thư mục này nếu không cần nữa.`,
    );
  }
}

// ── Chốt chặn an toàn ───────────────────────────────────────────────────
const tabMa = timTabMa();
if (tabMa.length > 0) {
  console.error("");
  console.error("✗ TÊN TAB TRONG sync.config.json KHÔNG KHỚP VỚI SHEET.");
  console.error("  GIỮ NGUYÊN dữ liệu cũ, không ghi đè.");
  console.error("");
  for (const nhom of tabMa) {
    console.error(`  Các tab sau trả về dữ liệu GIỐNG HỆT nhau: ${nhom.map((t) => `"${t}"`).join(", ")}`);
  }
  console.error("");
  console.error("  Google trả về tab đầu tiên khi không tìm thấy tên tab, nên đây gần");
  console.error("  như chắc chắn là có tab đã bị đổi tên hoặc xoá trong Sheet.");
  console.error("  Mở sync.config.json, sửa ô \"tab\" cho khớp đúng tên trong Sheet.");
  console.error("");
  process.exit(1);
}

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
