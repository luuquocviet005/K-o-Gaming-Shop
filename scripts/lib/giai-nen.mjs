/**
 * Giải nén mọi file .zip trong thư mục ảnh rồi XOÁ file .zip.
 *
 * Tải ảnh từ Google Drive về thì Drive tự đóng gói thành .zip. nap-anh đọc
 * thẳng được file .zip, nhưng chủ tiệm muốn mở ảnh ra xem thì phải giải nén
 * tay từng cái — 20 file một lần là quá phiền. Bước này chạy đầu mỗi lượt tự
 * động (cùng khoá với nap-anh) nên không bao giờ giải nén đúng lúc nap-anh
 * đang đọc file đó.
 *
 * Giải nén ra đâu — giữ ĐÚNG cách nap-anh hiểu file .zip trước giờ:
 *
 *   Bàn phím/Akko M1 V5 HE.zip      ->  Bàn phím/Akko M1 V5 HE/*.jpg
 *     (zip nằm trong thư mục danh mục = 1 món, nên thành thư mục riêng)
 *
 *   Chuột/ATK F1 Leviatan/1.zip     ->  Chuột/ATK F1 Leviatan/*.jpg
 *     (zip nằm trong thư mục của một món = thêm ảnh cho món đó, nên đổ thẳng
 *      vào; tạo thư mục con "1/" thì nap-anh lại hiểu "1" là một món khác)
 *
 * Mọi file bên trong zip được đổ phẳng, bỏ hết thư mục lồng bên trong — nap-anh
 * vốn cũng đổ phẳng ảnh trong zip như vậy, nên ảnh lên web y hệt như trước.
 *
 * An toàn:
 *   - Chỉ xoá .zip sau khi MỌI file đã ghi xong. Lỗi giữa chừng thì giữ .zip,
 *     lượt sau làm lại.
 *   - Không bao giờ ghi đè: trùng tên mà khác nội dung thì đặt "tên (2).jpg",
 *     trùng hệt thì bỏ qua (nên làm lại một zip dở dang không đẻ ra ảnh đôi).
 *   - File đang tải dở thì chưa đọc được (zip chưa có phần mục lục ở cuối)
 *     hoặc vừa mới sửa — để lượt sau.
 */

import { readdir, readFile, writeFile, rename, rm, stat, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, basename, dirname, extname } from "node:path";
import { unzipSync } from "fflate";
import { boDau } from "./normalize.mjs";

/** Sửa chưa tới chừng này thì có thể còn đang tải/chép — chờ lượt sau */
const CHO_ON_DINH_MS = 30 * 1000;
const DUOI_TAM = ".dang-giai-nen";

/**
 * Tên thư mục lấy từ tên file zip, bỏ đuôi Google Drive tự gắn:
 *   "Akko M1 V5 HE-20260814T115012Z-1-001.zip" -> "Akko M1 V5 HE"
 * Zip quá lớn Drive chia thành -001, -002… — cùng tên nên gộp về một thư mục.
 */
export function tenTuZip(tenFile) {
  return (
    tenFile
      .replace(/\.zip$/i, "")
      .replace(/-\d{8}T\d{6}Z(-\d+)?-\d{3}$/, "")
      .replace(/[. ]+$/, "") || "Ảnh giải nén"
  );
}

/** Tên file an toàn cho Windows, chỉ lấy phần tên (chặn luôn "../" trong zip) */
function tenAnToan(duongDanTrong) {
  const ten = duongDanTrong.split(/[\\/]/).pop() ?? "";
  return ten.replace(/[<>:"|?*\x00-\x1f]/g, "_").replace(/[. ]+$/, "");
}

/** tenThu("a.jpg", 2) -> "a (2).jpg" */
function tenThu(ten, i) {
  const duoi = extname(ten);
  return `${ten.slice(0, ten.length - duoi.length)} (${i})${duoi}`;
}

/** Thư mục chứa nhiều món (gốc hoặc thư mục danh mục) — cùng luật với nap-anh */
function laThuMucChua(ten, sau, danhMuc) {
  if (sau === 0) return true;
  const can = boDau(ten).replace(/[^a-z0-9]/g, "");
  return danhMuc.some(
    (d) =>
      boDau(d.name).replace(/[^a-z0-9]/g, "") === can ||
      boDau(d.short).replace(/[^a-z0-9]/g, "") === can ||
      d.slug.replace(/[^a-z0-9]/g, "") === can,
  );
}

/** Tìm mọi file .zip, kèm thông tin thư mục chứa nó có phải thư mục danh mục không */
async function timZip(thuMuc, danhMuc, sau = 0, ketQua = []) {
  if (sau > 5) return ketQua;
  let muc;
  try {
    muc = await readdir(thuMuc, { withFileTypes: true });
  } catch {
    return ketQua;
  }
  const chua = laThuMucChua(basename(thuMuc), sau, danhMuc);
  for (const m of muc) {
    const p = join(thuMuc, m.name);
    if (m.isDirectory()) await timZip(p, danhMuc, sau + 1, ketQua);
    else if (m.isFile() && /\.zip$/i.test(m.name)) ketQua.push({ zip: p, trongThuMucChua: chua });
  }
  return ketQua;
}

async function giaiNenMot({ zip, trongThuMucChua }) {
  const s = await stat(zip);
  if (Date.now() - s.mtimeMs < CHO_ON_DINH_MS) return { trangThai: "cho" };

  let muc;
  try {
    muc = unzipSync(new Uint8Array(await readFile(zip)));
  } catch (e) {
    return { trangThai: "loi", lyDo: `file nén hỏng hoặc chưa tải xong (${e.message})` };
  }

  const files = Object.entries(muc).filter(
    ([ten, nd]) => !ten.endsWith("/") && !ten.endsWith("\\") && nd.length > 0,
  );
  if (files.length === 0) return { trangThai: "loi", lyDo: "file nén rỗng" };

  const dich = trongThuMucChua
    ? join(dirname(zip), tenTuZip(basename(zip)))
    : dirname(zip);
  await mkdir(dich, { recursive: true });

  // Tên đã dùng trong lượt này (không phân biệt hoa thường, như Windows)
  const daDung = new Set();
  let soMoi = 0;
  for (const [duongDanTrong, noiDung] of files) {
    const goc = tenAnToan(duongDanTrong);
    if (!goc) continue;
    const buf = Buffer.from(noiDung);

    // Thử "a.jpg", "a (2).jpg", "a (3).jpg"… Gặp tên trống thì ghi vào đó;
    // gặp file đã có mà nội dung y hệt thì file này giải nén từ lượt trước rồi.
    let ten = null;
    for (let i = 1; ; i++) {
      const thu = i === 1 ? goc : tenThu(goc, i);
      if (daDung.has(thu.toLowerCase())) continue;
      const p = join(dich, thu);
      if (!existsSync(p)) {
        ten = thu;
        break;
      }
      const cu = await readFile(p).catch(() => null);
      if (cu && cu.equals(buf)) {
        daDung.add(thu.toLowerCase());
        break;
      }
    }
    if (!ten) continue;

    // Ghi ra tên tạm rồi đổi tên: cúp điện giữa chừng không để lại ảnh cụt
    const cuoi = join(dich, ten);
    await writeFile(cuoi + DUOI_TAM, buf);
    await rename(cuoi + DUOI_TAM, cuoi);
    daDung.add(ten.toLowerCase());
    soMoi++;
  }

  await rm(zip);
  return { trangThai: "xong", dich, soFile: soMoi };
}

/**
 * Giải nén hết .zip trong thư mục ảnh. Trả về { daGiai, loi } để in/ghi nhật ký.
 * Không bao giờ ném lỗi — hỏng một file thì bỏ qua file đó, làm tiếp file khác.
 */
export async function giaiNenHet(thuMucAnh, danhMuc) {
  const daGiai = [];
  const loi = [];
  // Không biết đâu là thư mục danh mục thì không biết giải nén ra đâu cho đúng
  // (đổ nhầm 20 bộ ảnh vào chung thư mục "Bàn phím" là hỏng). Để nguyên .zip —
  // nap-anh vẫn đọc thẳng được .zip như trước.
  if (danhMuc.length === 0) return { daGiai, loi };
  for (const z of await timZip(thuMucAnh, danhMuc)) {
    try {
      const kq = await giaiNenMot(z);
      if (kq.trangThai === "xong") daGiai.push({ zip: z.zip, dich: kq.dich, soFile: kq.soFile });
      else if (kq.trangThai === "loi") loi.push({ zip: z.zip, lyDo: kq.lyDo });
    } catch (e) {
      loi.push({ zip: z.zip, lyDo: e.message });
    }
  }
  return { daGiai, loi };
}

/** Các dòng báo cáo, đường dẫn tính từ thư mục ảnh cho dễ đọc */
export function baoCaoGiaiNen({ daGiai, loi }, thuMucAnh) {
  const tuong = (p) => p.slice(thuMucAnh.length).replace(/^[\\/]/, "") || basename(p);
  const dong = [];
  if (daGiai.length) {
    dong.push(`✓ Đã giải nén và xoá ${daGiai.length} file .zip:`);
    for (const d of daGiai) dong.push(`    ${tuong(d.zip)}  →  ${tuong(d.dich)}\\ (${d.soFile} file)`);
  }
  if (loi.length) {
    dong.push(`✗ ${loi.length} file .zip KHÔNG giải nén được — vẫn giữ nguyên, lượt sau thử lại:`);
    for (const l of loi) dong.push(`    ${tuong(l.zip)}: ${l.lyDo}`);
  }
  return dong;
}
