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

import { readFile, writeFile, mkdir, readdir, rm } from "node:fs/promises";
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

  // Thư mục con = một sản phẩm nhiều ảnh, do scripts/nap-anh.mjs tạo ra.
  //
  // Bỏ qua "chia-se.jpg": đó là ảnh 1200×630 dành riêng cho thẻ xem trước trên
  // Zalo/Facebook (scripts/anh-chia-se-san-pham.mjs vẽ ra), nằm chung thư mục
  // nhưng KHÔNG phải một tấm ảnh của món. Tính nhầm thì khách mở thư viện ảnh
  // sẽ thấy thừa một tấm bị viền hồng hai bên.
  for (const m of muc) {
    if (!m.isDirectory()) continue;
    const trong = (await readdir(join(root, "public", "products", m.name)))
      .filter((f) => /\.(jpe?g|png|webp|avif|gif)$/i.test(f) && f !== "chia-se.jpg")
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

    /*
     * Cùng hãng + cùng tên xuất hiện ở nhiều tab = chủ shop CỐ Ý xếp món đó
     * vào nhiều danh mục (soundcard vừa thuộc Tai nghe vừa thuộc Phụ kiện).
     *
     * Trước đây bản sau bị bỏ đi kèm một dòng cảnh báo, nghĩa là món đó chỉ
     * hiện ở tab đầu tiên — khách vào danh mục kia thì không thấy, và chủ shop
     * không hề biết. Giờ ghi thêm danh mục vào chính món đã tạo: vẫn một trang
     * sản phẩm, một đường dẫn, nhưng hiện ở đủ mọi danh mục được khai.
     */
    const khoa = `${boDau(hang)}|${boDau(ten)}`;
    const daCo = daThay.get(khoa);
    if (daCo) {
      if (daCo.danhMuc !== cauHinh.slug && !daCo.danhMucKhac?.includes(cauHinh.slug)) {
        (daCo.danhMucKhac ??= []).push(cauHinh.slug);
        demTrongTab++;
      }
      continue;
    }

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

    /*
     * HAI cột nội dung, cố ý tách riêng vì chúng nói hai chuyện khác nhau:
     *
     *   Mô tả  — cấu hình, phụ kiện kèm theo, thông số. Thứ làm khách MUỐN mua.
     *            "Case: Mad60, Switch: Owlab, Stab: Owlab, Foam và Plate: Hyber"
     *
     *   Note   — khuyết điểm, lỗi, thứ khách cần biết trước khi xuống tiền.
     *            "receiver hư, switch silent"
     *
     * Gộp chung một cột thì cấu hình bàn phím bị trưng dưới nhãn "Tình trạng
     * thực tế", đọc như thể cái case Mad60 là một lỗi.
     */
    const docO = (nhan, ...ten) => {
      const v = layO(row, ...ten);
      if (v.startsWith("#")) {
        // Ô công thức lỗi kiểu #ERROR! / #REF!
        canhBao.push(`⚠ ${nhan} "${ten}" (${cauHinh.tab}): ô lỗi "${v}" — bỏ qua.`);
        return "";
      }
      return v;
    };

    const note = docO("Ghi chú", "note", "ghi chu");
    const moTa = docO("Mô tả", "mo ta", "mota", "chi tiet", "cau hinh", "thong tin");

    if (gia === 0) {
      canhBao.push(`⚠ "${ten}" (${cauHinh.tab}): chưa có giá — web sẽ hiện "Liên hệ".`);
    }

    let slug = slugify(`${hang} ${ten}`) || slugify(ten);
    if (sanPham.some((p) => p.slug === slug)) slug = `${slug}-${sanPham.length + 1}`;

    // Thư mục ảnh riêng của sản phẩm được ưu tiên hơn mọi cách tìm ảnh khác
    const boAnh = anhTheoThuMuc.get(slug);
    if (boAnh) anh = boAnh[0];

    const mon = {
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
      ...(moTa ? { moTa } : {}),
      ...(note ? { note } : {}),
      ...(anh ? { anh } : {}),
      ...(boAnh && boAnh.length > 1 ? { anhs: boAnh } : {}),
      mau: mauTheoHang(hang),
    };

    sanPham.push(mon);
    // Giữ tham chiếu tới chính món này để tab sau còn ghi thêm danh mục vào
    daThay.set(khoa, mon);

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
 * Dọn thư mục ảnh không còn sản phẩm nào tương ứng.
 *
 * Sinh ra mỗi khi chủ shop đổi tên hoặc gỡ một món khỏi Sheet: ảnh cũ nằm lại
 * dưới tên slug cũ, không trang nào dùng, nhưng vẫn bị đẩy lên máy chủ.
 *
 * TRƯỚC ĐÂY script chỉ cảnh báo và bắt xoá tay, phòng khi chỉ là đổi tên tạm.
 * Giữ lại thì lợi bất cập hại: chủ shop sửa Sheet liên tục nên danh sách cảnh
 * báo dài ra mãi, và ảnh chết cứ chất đống trên máy chủ. Xoá được an toàn vì
 * ẢNH GỐC KHÔNG NẰM Ở ĐÂY — nó nằm trong thư mục ảnh của chủ shop, và
 * scripts/nap-anh.mjs sẽ tự dựng lại dưới tên slug mới ở lượt chạy kế tiếp.
 * Git cũng còn nguyên lịch sử nếu cần lấy lại.
 *
 * CHỈ xoá khi lượt đồng bộ này đọc được TẤT CẢ các tab. Một tab lỗi mạng làm
 * cả nhóm sản phẩm biến mất khỏi danh sách — xoá lúc đó là xoá nhầm ảnh của
 * hàng vẫn đang bán.
 */
const boSlug = new Set(sanPham.map((p) => p.slug));
const moCoi = [...anhTheoThuMuc.keys()].filter((slug) => !boSlug.has(slug));
const coTabLoi = canhBao.some((c) => c.startsWith("✗"));

if (moCoi.length > 0) {
  if (coTabLoi) {
    canhBao.push(
      `⚠ ${moCoi.length} thư mục ảnh có vẻ mồ côi nhưng lượt này có tab đọc lỗi — KHÔNG xoá, chờ lượt sau cho chắc.`,
    );
  } else {
    for (const slug of moCoi) {
      await rm(join(root, "public", "products", slug), {
        recursive: true,
        force: true,
      });
    }
    canhBao.push(
      `· Đã dọn ${moCoi.length} thư mục ảnh của món đã đổi tên hoặc gỡ khỏi Sheet: ${moCoi.join(", ")}`,
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
