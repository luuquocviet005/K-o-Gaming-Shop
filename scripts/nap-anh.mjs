/**
 * Nạp ảnh sản phẩm hàng loạt từ một thư mục.
 *
 *   Kéo thư mục thả lên "Tai anh len web.bat"
 *   hoặc:  node scripts/nap-anh.mjs "D:\đường\dẫn\Ảnh gear"
 *
 * Cấu trúc thư mục: MỖI SẢN PHẨM MỘT THƯ MỤC, muốn lồng bao nhiêu tầng cũng
 * được. Thư mục nào chứa ảnh trực tiếp thì được coi là một sản phẩm.
 *
 *   Ảnh gear/                        Ảnh gear/
 *     ├── Finalmouse Tarik/            ├── Chuột/
 *     │     ├── ...jpg                 │     ├── Finalmouse Tarik/
 *     └── Razer Viper v3 pro/          │     │     └── ...jpg
 *           └── ...jpg                 │     └── Razer Viper v3 pro.zip
 *                                      └── Bàn phím/
 *   (phẳng — vẫn chạy)                       └── ATK Hex80/
 *                                                  └── ...jpg
 *                                      (chia theo danh mục — nên dùng)
 *
 * Chia theo danh mục còn được lợi: tên thư mục cha khớp với một danh mục trên
 * web thì script CHỈ đối chiếu trong danh mục đó, nên không thể gán nhầm ảnh
 * chuột sang bàn phím.
 *
 * Ảnh gốc từ điện thoại nặng ~3MB, 4096px. Script nén xuống ~1400px định dạng
 * webp (còn khoảng 60–120KB, nhẹ hơn 30–50 lần) rồi mới đưa vào web. Ảnh gốc
 * KHÔNG bao giờ vào Git — nếu vào thì kho mã phình vĩnh viễn vì Git giữ cả
 * lịch sử, không xoá đi được.
 */

import { mkdir, readdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { tmpdir } from "node:os";
import sharp from "sharp";
import { unzipSync } from "fflate";
import { timSanPham } from "./lib/khop-ten.mjs";
import { boDau } from "./lib/normalize.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const thuMucDich = join(root, "public", "products");

const DUOI_ANH = /\.(jpe?g|png|webp|avif|heic|heif)$/i;
const RONG_TOI_DA = 1400;
const CHAT_LUONG = 82;

const duongDanVao = process.argv.slice(2).filter(Boolean);

if (duongDanVao.length === 0) {
  console.error("");
  console.error("  Chưa có thư mục nào.");
  console.error("  Kéo thư mục ảnh thả lên file 'Tai anh len web.bat',");
  console.error('  hoặc chạy:  node scripts/nap-anh.mjs "D:\\đường\\dẫn\\Ảnh gear"');
  console.error("");
  process.exit(1);
}

// Bảng hàng phải có trước thì mới biết ảnh thuộc về món nào
const duLieu = JSON.parse(
  await readFile(join(root, "src", "data", "products.json"), "utf8"),
);
const sanPham = duLieu.sanPham;

/** Thư mục tạm chứa ảnh giải nén — xoá sau khi chạy xong */
const thuMucTam = join(tmpdir(), `keo-anh-${Date.now()}`);
let daDungTam = false;

/**
 * Giải nén file .zip ra thư mục tạm.
 *
 * Tải ảnh từ Google Photos về luôn được đóng gói thành .zip, nên bắt người
 * dùng giải nén tay mỗi lần là thừa. Ảnh giải nén chỉ nằm ở thư mục tạm của
 * hệ điều hành, không đụng vào thư mục gốc của người dùng.
 *
 * Trả về thư mục chứa ảnh: nếu bên trong zip có đúng một thư mục bọc ngoài
 * thì lấy thư mục đó (giữ đúng tên sản phẩm), ngược lại lấy tên file zip.
 */
async function giaiNen(duongDanZip) {
  const ten = basename(duongDanZip).replace(/\.zip$/i, "");
  const dich = join(thuMucTam, ten);
  await mkdir(dich, { recursive: true });
  daDungTam = true;

  const buf = await readFile(duongDanZip);
  const muc = unzipSync(new Uint8Array(buf));

  let soAnh = 0;
  for (const [duongDanTrong, noiDung] of Object.entries(muc)) {
    if (noiDung.length === 0) continue; // mục thư mục, không phải file
    const tenFile = basename(duongDanTrong);
    if (!DUOI_ANH.test(tenFile)) continue;
    // Đổ phẳng mọi ảnh vào một chỗ — cấu trúc thư mục bên trong zip không quan trọng
    await writeFile(join(dich, tenFile), Buffer.from(noiDung));
    soAnh++;
  }

  if (soAnh === 0) {
    console.error(`  ✗ File nén "${basename(duongDanZip)}" không có ảnh nào bên trong.`);
    return null;
  }
  console.log(`  · Đã giải nén "${basename(duongDanZip)}" — ${soAnh} ảnh`);
  return dich;
}

/** Tên thư mục có phải một danh mục trên web không (bỏ dấu, không phân biệt hoa thường) */
function nhanDangDanhMuc(ten) {
  const can = boDau(ten).replace(/[^a-z0-9]/g, "");
  return (
    duLieu.danhMuc.find(
      (d) =>
        boDau(d.name).replace(/[^a-z0-9]/g, "") === can ||
        boDau(d.short).replace(/[^a-z0-9]/g, "") === can ||
        d.slug.replace(/[^a-z0-9]/g, "") === can,
    ) ?? null
  );
}

/**
 * Duyệt cây thư mục, trả về danh sách { duongDan, danhMuc }.
 *
 * Quy tắc: thư mục nào chứa ảnh TRỰC TIẾP thì đó là một sản phẩm, dừng lại
 * không đi sâu thêm. Thư mục chỉ chứa thư mục con thì đi tiếp — nhờ vậy chia
 * theo danh mục bao nhiêu tầng cũng được.
 *
 * `danhMuc` mang theo từ thư mục cha gần nhất có tên trùng một danh mục.
 */
async function timThuMucSanPham(duongDan, danhMuc = null, sau = 0) {
  if (sau > 5) return []; // chặn thư mục lồng quá sâu hoặc lối tắt vòng lặp

  if (/\.zip$/i.test(duongDan)) {
    const d = await giaiNen(duongDan);
    return d ? [{ duongDan: d, danhMuc }] : [];
  }

  const muc = await readdir(duongDan, { withFileTypes: true });
  if (muc.some((m) => m.isFile() && DUOI_ANH.test(m.name))) {
    return [{ duongDan, danhMuc }];
  }

  const ketQua = [];
  for (const m of muc) {
    const duongDanCon = join(duongDan, m.name);

    // File .zip nằm cạnh các thư mục — Google Photos trả về dạng này
    if (m.isFile() && /\.zip$/i.test(m.name)) {
      const d = await giaiNen(duongDanCon);
      if (d) ketQua.push({ duongDan: d, danhMuc });
      continue;
    }
    if (!m.isDirectory()) continue;

    // Thư mục này có phải tên một danh mục không? Nếu có thì truyền xuống dưới
    const dmCon = nhanDangDanhMuc(m.name) ?? danhMuc;
    ketQua.push(...(await timThuMucSanPham(duongDanCon, dmCon, sau + 1)));
  }
  return ketQua;
}

/**
 * Sắp thứ tự ảnh: tấm trùng tên thư mục lên đầu làm ảnh bìa, còn lại theo
 * tên file. Người chụp thường đặt tên tấm đẹp nhất theo tên sản phẩm.
 */
function sapAnh(tenFile, tenThuMuc) {
  const goc = boDau(tenThuMuc).replace(/[^a-z0-9]/g, "");
  return [...tenFile].sort((a, b) => {
    const la = boDau(a.replace(/\.[^.]+$/, "")).replace(/[^a-z0-9]/g, "") === goc;
    const lb = boDau(b.replace(/\.[^.]+$/, "")).replace(/[^a-z0-9]/g, "") === goc;
    if (la !== lb) return la ? -1 : 1;
    return a.localeCompare(b, "vi", { numeric: true });
  });
}

const khop = [];
const khongKhop = [];
let tongAnh = 0;
let tongGoc = 0;
let tongNen = 0;

for (const vao of duongDanVao) {
  if (!existsSync(vao)) {
    console.error(`  ✗ Không thấy: ${vao}`);
    continue;
  }

  const thuMucs = await timThuMucSanPham(vao);
  if (thuMucs.length === 0) {
    console.error(`  ✗ Không thấy ảnh nào trong: ${vao}`);
    continue;
  }

  for (const { duongDan: tm, danhMuc } of thuMucs) {
    const ten = basename(tm);

    // Ảnh nằm trong thư mục danh mục thì chỉ đối chiếu trong danh mục đó —
    // không thể gán nhầm ảnh chuột sang một cái bàn phím trùng tên
    const ungVienSanPham = danhMuc
      ? sanPham.filter((p) => p.danhMuc === danhMuc.slug)
      : sanPham;

    const ketQua = timSanPham(ten, ungVienSanPham);

    if (!ketQua.sanPham) {
      khongKhop.push({
        ten,
        danhMuc,
        ungVien: ketQua.ungVien,
        diem: ketQua.diem,
      });
      continue;
    }

    const p = ketQua.sanPham;
    const files = sapAnh(
      (await readdir(tm)).filter((f) => DUOI_ANH.test(f)),
      ten,
    );

    // Xoá ảnh cũ của món này rồi ghi lại từ đầu — tránh còn sót ảnh đã bỏ
    const dich = join(thuMucDich, p.slug);
    await rm(dich, { recursive: true, force: true });
    await mkdir(dich, { recursive: true });

    const daGhi = [];
    for (let i = 0; i < files.length; i++) {
      const nguon = join(tm, files[i]);
      const tenMoi = `${String(i + 1).padStart(2, "0")}.webp`;
      try {
        const buf = await sharp(nguon)
          // .rotate() đọc thẻ EXIF — thiếu nó thì ảnh chụp dọc bị nằm ngang
          .rotate()
          .resize({
            width: RONG_TOI_DA,
            height: RONG_TOI_DA,
            fit: "inside",
            withoutEnlargement: true,
          })
          .webp({ quality: CHAT_LUONG })
          .toBuffer();

        await writeFile(join(dich, tenMoi), buf);

        tongGoc += (await stat(nguon)).size;
        tongNen += buf.length;
        tongAnh++;
        daGhi.push(tenMoi);
      } catch (e) {
        console.error(`  ✗ Lỗi khi xử lý ${files[i]}: ${e.message}`);
      }
    }

    if (daGhi.length > 0) {
      khop.push({ ten, sanPham: p, so: daGhi.length, diem: ketQua.diem, danhMuc });
    }
  }
}

// ───────────────────────────── Báo cáo ─────────────────────────────
console.log("");
console.log("═══ NẠP ẢNH SẢN PHẨM ═══");

if (khop.length) {
  console.log("");
  console.log(`  ✓ Đã nạp ảnh cho ${khop.length} sản phẩm (${tongAnh} tấm):`);
  for (const k of khop) {
    const chac = k.diem === 1 ? "" : `  (khớp ${Math.round(k.diem * 100)}%)`;
    const dm = k.danhMuc ? `[${k.danhMuc.short}] ` : "";
    console.log(
      `      ${dm}${k.ten}  →  ${k.sanPham.hang} ${k.sanPham.ten} · ${k.so} tấm${chac}`,
    );
  }
  const mbGoc = (tongGoc / 1024 / 1024).toFixed(1);
  const mbNen = (tongNen / 1024 / 1024).toFixed(1);
  console.log("");
  console.log(`  Dung lượng: ${mbGoc} MB  →  ${mbNen} MB  (nhẹ hơn ${Math.round(tongGoc / tongNen)} lần)`);
}

if (khongKhop.length) {
  console.log("");
  console.log(`  ⚠ ${khongKhop.length} thư mục KHÔNG khớp được với sản phẩm nào:`);
  for (const k of khongKhop) {
    const dm = k.danhMuc ? ` (đang tìm trong danh mục ${k.danhMuc.name})` : "";
    console.log(`      "${k.ten}"${dm}`);
    if (k.ungVien.length) {
      console.log("        Gần giống nhất:");
      for (const u of k.ungVien) {
        console.log(
          `          ${u.sanPham.hang} ${u.sanPham.ten}  (${Math.round(u.diem * 100)}%)`,
        );
        console.log(`             mã:  ${u.sanPham.slug}`);
      }
      console.log("        → Đổi tên thư mục thành đúng dòng 'mã:' ở trên là chắc chắn");
      console.log("          khớp, kể cả khi hai món trùng tên nhau.");
    } else {
      console.log("        → Không có món nào gần giống. Kiểm tra lại tên thư mục.");
    }
  }
}

// Dọn ảnh giải nén tạm — không để rác lại trong ổ đĩa
if (daDungTam) await rm(thuMucTam, { recursive: true, force: true });

if (khop.length === 0) {
  console.log("");
  console.log("  Không nạp được ảnh nào.");
  console.log("");
  process.exit(1);
}

console.log("");
