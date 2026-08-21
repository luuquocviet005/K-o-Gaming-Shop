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

/**
 * Danh sách món ĐÃ BÁN.
 *
 * Bán xong thì món rời khỏi bảng hàng, nhưng thư mục ảnh vẫn nằm nguyên trong
 * "Ảnh gear" — và trước đây lượt nào cũng báo "KHÔNG khớp — CẦN BẠN SỬA" cho
 * đúng những thư mục đó, 15 phút một lần, vĩnh viễn. Chủ tiệm không sửa được
 * vì có gì sai đâu mà sửa. Báo động giả kiểu này lặp mãi thì tới lúc hỏng thật
 * cũng bị lướt qua, nên phải tách riêng ra và nói đúng bản chất.
 */
const daBan = await (async () => {
  try {
    const f = await readFile(join(root, "src", "data", "da-ban.json"), "utf8");
    return JSON.parse(f).daBan ?? [];
  } catch {
    return []; // chưa bán món nào, hoặc file chưa có — không phải lỗi
  }
})();

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
 * Duyệt cây thư mục, trả về danh sách sản phẩm { ten, danhMuc, files }.
 *
 * Nhận cả BA cách sắp xếp mà người dùng thật hay dùng lẫn lộn:
 *
 *   Chuột/                          <- thư mục danh mục, đi tiếp vào trong
 *     ├── Finalmouse Tarik/         <- thư mục riêng = 1 sản phẩm nhiều ảnh
 *     │     └── *.jpg
 *     ├── Pulsar Tenz.zip           <- file nén    = 1 sản phẩm nhiều ảnh
 *     └── Aula SC311.jpg            <- ẢNH RỜI     = 1 sản phẩm 1 ảnh
 *
 * Điểm mấu chốt: thư mục vừa có ảnh rời VỪA có thư mục con thì nó là thư mục
 * chứa, không phải một sản phẩm. Mỗi ảnh rời trong đó là một sản phẩm riêng,
 * lấy tên từ TÊN FILE. Bản trước gộp cả thư mục thành một sản phẩm rồi bỏ
 * qua mọi thứ bên trong.
 */
async function timSanPhamTrongCay(duongDan, danhMuc = null, sau = 0) {
  if (sau > 5) return []; // chặn thư mục lồng quá sâu hoặc lối tắt vòng lặp

  // File nén: CHƯA giải nén vội, chỉ ghi nhận. Giải nén là việc nặng, để dành
  // tới lúc biết chắc bộ ảnh có thay đổi (xem phần lấy vân tay bên dưới).
  if (/\.zip$/i.test(duongDan)) {
    return [{ ten: basename(duongDan).replace(/\.zip$/i, ""), danhMuc, zip: duongDan }];
  }

  const muc = await readdir(duongDan, { withFileTypes: true });
  const anhRoi = muc.filter((m) => m.isFile() && DUOI_ANH.test(m.name));
  const zipCon = muc.filter((m) => m.isFile() && /\.zip$/i.test(m.name));
  const thuMucCon = muc.filter((m) => m.isDirectory());

  // Chỉ toàn ảnh, không có gì khác -> cả thư mục là một sản phẩm
  if (anhRoi.length > 0 && zipCon.length === 0 && thuMucCon.length === 0) {
    return [
      {
        ten: basename(duongDan),
        danhMuc,
        files: anhRoi.map((m) => join(duongDan, m.name)),
      },
    ];
  }

  const ketQua = [];

  // Ảnh rời nằm cạnh thư mục con: mỗi tấm là một sản phẩm, tên lấy từ tên file
  for (const a of anhRoi) {
    ketQua.push({
      ten: a.name.replace(/\.[^.]+$/, ""),
      danhMuc,
      files: [join(duongDan, a.name)],
    });
  }

  for (const z of zipCon) {
    ketQua.push({
      ten: z.name.replace(/\.zip$/i, ""),
      danhMuc,
      zip: join(duongDan, z.name),
    });
  }

  for (const t of thuMucCon) {
    // Thư mục này có phải tên một danh mục không? Nếu có thì truyền xuống dưới
    const dmCon = nhanDangDanhMuc(t.name) ?? danhMuc;
    ketQua.push(...(await timSanPhamTrongCay(join(duongDan, t.name), dmCon, sau + 1)));
  }

  return ketQua;
}

/**
 * Sắp thứ tự ảnh: tấm trùng tên thư mục lên đầu làm ảnh bìa, còn lại theo
 * tên file. Người chụp thường đặt tên tấm đẹp nhất theo tên sản phẩm.
 */
function sapAnh(duongDanAnh, tenSanPham) {
  const goc = boDau(tenSanPham).replace(/[^a-z0-9]/g, "");
  const chuan = (p) =>
    boDau(basename(p).replace(/\.[^.]+$/, "")).replace(/[^a-z0-9]/g, "");

  return [...duongDanAnh].sort((a, b) => {
    const la = chuan(a) === goc;
    const lb = chuan(b) === goc;
    if (la !== lb) return la ? -1 : 1;
    return basename(a).localeCompare(basename(b), "vi", { numeric: true });
  });
}

/**
 * Bộ nhớ đệm: sản phẩm nào đã nén từ bộ ảnh nào.
 *
 * Không có nó thì mỗi lần chạy lại nén toàn bộ ~280MB ảnh — chấp nhận được
 * khi bấm tay, nhưng tác vụ chạy ngầm 15 phút/lần sẽ đốt CPU cả ngày.
 * Dấu vân tay gồm tên file + dung lượng + thời điểm sửa, đủ để biết bộ ảnh
 * nguồn có thay đổi hay không.
 */
const duongDanCache = join(root, ".cache-anh.json");
let cache = {};
try {
  cache = JSON.parse(await readFile(duongDanCache, "utf8"));
} catch {
  /* lần đầu chạy */
}
const cacheMoi = {};

async function vanTay(duongDanNguon) {
  const phan = [];
  for (const p of [...duongDanNguon].sort()) {
    const s = await stat(p);
    phan.push(`${basename(p)}:${s.size}:${Math.round(s.mtimeMs)}`);
  }
  return phan.join("|");
}

const khop = [];
const boQua = [];
const khongKhop = [];
/** Thư mục ảnh của món ĐÃ BÁN — không phải lỗi, xem phần in kết quả bên dưới */
const cuaHangDaBan = [];
/** slug sản phẩm -> tên thư mục đã dùng, để bắt hai thư mục cùng trỏ một món */
const daNhan = new Map();
let tongAnh = 0;
let tongGoc = 0;
let tongNen = 0;

for (const vao of duongDanVao) {
  if (!existsSync(vao)) {
    console.error(`  ✗ Không thấy: ${vao}`);
    continue;
  }

  const dsSanPham = await timSanPhamTrongCay(
    vao,
    nhanDangDanhMuc(basename(vao)) ?? null,
  );
  if (dsSanPham.length === 0) {
    console.error(`  ✗ Không thấy ảnh nào trong: ${vao}`);
    continue;
  }

  for (const { ten, danhMuc, files: duongDanAnh, zip } of dsSanPham) {
    // Ảnh nằm trong thư mục danh mục thì chỉ đối chiếu trong danh mục đó —
    // không thể gán nhầm ảnh chuột sang một cái bàn phím trùng tên
    const ungVienSanPham = danhMuc
      ? sanPham.filter((p) => p.danhMuc === danhMuc.slug)
      : sanPham;

    const ketQua = timSanPham(ten, ungVienSanPham);

    if (!ketQua.sanPham) {
      // Không có trong bảng hàng — thử xem có phải món đã bán không, trước
      // khi kết luận là chủ tiệm đặt sai tên.
      const ungVienDaBan = danhMuc
        ? daBan.filter((p) => p.danhMuc === danhMuc.slug)
        : daBan;
      const kqDaBan = timSanPham(ten, ungVienDaBan);

      if (kqDaBan.sanPham) {
        cuaHangDaBan.push({ ten, sanPham: kqDaBan.sanPham });
        continue;
      }

      khongKhop.push({
        ten,
        danhMuc,
        ungVien: ketQua.ungVien,
        diem: ketQua.diem,
      });
      continue;
    }

    const p = ketQua.sanPham;

    /**
     * Hai thư mục cùng khớp một sản phẩm.
     *
     * Xảy ra khi bạn có hai món cùng model nhưng bảng hàng chỉ ghi một dòng
     * (ví dụ "ATK Rs6" và "ATK Rs6 Aspas" đều khớp món "ATK RS6"). Nếu cứ ghi
     * đè thì bộ ảnh nạp trước biến mất lặng lẽ — mất dữ liệu mà không ai biết.
     */
    if (daNhan.has(p.slug)) {
      khongKhop.push({
        ten,
        danhMuc,
        trung: { voi: daNhan.get(p.slug), sanPham: p },
        ungVien: [],
        diem: ketQua.diem,
      });
      continue;
    }
    daNhan.set(p.slug, ten);

    /**
     * Lấy vân tay TRƯỚC khi giải nén.
     *
     * Với file nén thì vân tay lấy từ chính file .zip. Nếu lấy từ ảnh đã giải
     * nén thì vô dụng: mỗi lần chạy giải ra thư mục tạm mới, thời điểm sửa
     * file luôn khác nên vân tay luôn đổi, bộ nhớ đệm không bao giờ ăn.
     */
    const vt = await vanTay(zip ? [zip] : duongDanAnh);
    cacheMoi[p.slug] = vt;
    const dichCu = join(thuMucDich, p.slug);
    if (cache[p.slug] === vt && existsSync(dichCu)) {
      boQua.push({ ten, sanPham: p });
      continue;
    }

    // Tới đây mới chắc là cần xử lý — giờ mới bung file nén ra
    let duongDanThat = duongDanAnh;
    if (zip) {
      const d = await giaiNen(zip);
      if (!d) continue;
      duongDanThat = (await readdir(d))
        .filter((f) => DUOI_ANH.test(f))
        .map((f) => join(d, f));
    }

    const files = sapAnh(duongDanThat, ten);

    // Xoá ảnh cũ của món này rồi ghi lại từ đầu — tránh còn sót ảnh đã bỏ
    const dich = join(thuMucDich, p.slug);
    await rm(dich, { recursive: true, force: true });
    await mkdir(dich, { recursive: true });

    const daGhi = [];
    for (let i = 0; i < files.length; i++) {
      const nguon = files[i];
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
        console.error(`  ✗ Lỗi khi xử lý ${basename(files[i])}: ${e.message}`);
      }
    }

    if (daGhi.length > 0) {
      khop.push({ ten, sanPham: p, so: daGhi.length, diem: ketQua.diem, danhMuc });
    }
  }
}

// ───────────────────────────── Báo cáo ─────────────────────────────
// Gom vào một chỗ để vừa in ra màn hình, vừa ghi thành file nhật ký đặt ngay
// trong thư mục ảnh — tác vụ chạy ngầm không có màn hình để đọc.
const dong = [];
const ghi = (s = "") => dong.push(s);

const luc = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
ghi("═══ NẠP ẢNH SẢN PHẨM ═══");
ghi(`Chạy lúc: ${luc}`);

if (khop.length) {
  ghi("");
  ghi(`✓ Đã nạp ảnh cho ${khop.length} sản phẩm (${tongAnh} tấm):`);
  for (const k of khop) {
    const chac = k.diem === 1 ? "" : `  (khớp ${Math.round(k.diem * 100)}%)`;
    const dm = k.danhMuc ? `[${k.danhMuc.short}] ` : "";
    ghi(`    ${dm}${k.ten}  →  ${k.sanPham.hang} ${k.sanPham.ten} · ${k.so} tấm${chac}`);
  }
  const mbGoc = (tongGoc / 1024 / 1024).toFixed(1);
  const mbNen = (tongNen / 1024 / 1024).toFixed(1);
  ghi("");
  ghi(`Dung lượng: ${mbGoc} MB → ${mbNen} MB (nhẹ hơn ${Math.round(tongGoc / tongNen)} lần)`);
}

if (boQua.length) {
  ghi("");
  ghi(`· ${boQua.length} sản phẩm đã có ảnh từ trước, không đổi — bỏ qua.`);
}

if (cuaHangDaBan.length) {
  ghi("");
  ghi(`· ${cuaHangDaBan.length} thư mục là của món ĐÃ BÁN — bỏ qua, không cần làm gì:`);
  for (const k of cuaHangDaBan) {
    ghi(`    "${k.ten}"  →  ${k.sanPham.hang} ${k.sanPham.ten} (bán ${k.sanPham.banLuc ?? "trước đây"})`);
  }
  ghi("  Ảnh của những món này vẫn còn trên web cho trang 'đã bán'. Muốn cho");
  ghi("  gọn thì cứ dọn thư mục đi, web không đổi gì.");
}

if (khongKhop.length) {
  ghi("");
  ghi(`⚠ ${khongKhop.length} thư mục KHÔNG khớp được với sản phẩm nào — CẦN BẠN SỬA:`);
  for (const k of khongKhop) {
    ghi("");
    if (k.trung) {
      ghi(`    "${k.ten}"`);
      ghi(`      Trùng đích với "${k.trung.voi}" — cả hai đều khớp món`);
      ghi(`      ${k.trung.sanPham.hang} ${k.trung.sanPham.ten}`);
      ghi("      → Bảng hàng chỉ có MỘT dòng cho model này. Nếu bạn có hai");
      ghi("        chiếc khác nhau, thêm một dòng nữa vào Sheet với tên phân");
      ghi("        biệt rõ (ví dụ 'RS6' và 'RS6 Aspas').");
      continue;
    }
    const dm = k.danhMuc ? ` (đang tìm trong danh mục ${k.danhMuc.name})` : "";
    ghi(`    "${k.ten}"${dm}`);
    if (k.ungVien.length) {
      ghi("      Gần giống nhất:");
      for (const u of k.ungVien) {
        ghi(`        ${u.sanPham.hang} ${u.sanPham.ten}  (${Math.round(u.diem * 100)}%)`);
        ghi(`           mã:  ${u.sanPham.slug}`);
      }
      ghi("      → Đổi tên thư mục/file nén thành đúng dòng 'mã:' ở trên là");
      ghi("        chắc chắn khớp, kể cả khi hai món trùng tên nhau.");
    } else {
      ghi("      → Không có món nào gần giống. Kiểm tra lại tên thư mục,");
      ghi("        hoặc món này chưa có trong Google Sheet.");
    }
  }
}

// Thư mục của món đã bán KHÔNG tính vào đây: không nạp tấm ảnh nào từ chúng,
// nên "không có ảnh nào mới" vẫn đúng — và tu-dong.mjs dựa vào đúng câu này
// để biết lượt chạy có gì mới hay không.
if (khop.length === 0 && khongKhop.length === 0) {
  ghi("");
  ghi("Không có ảnh nào mới. Mọi thứ đã cập nhật.");
}

console.log("");
for (const d of dong) console.log(d ? `  ${d}` : "");
console.log("");

// Dọn ảnh giải nén tạm — không để rác lại trong ổ đĩa
if (daDungTam) await rm(thuMucTam, { recursive: true, force: true });

await writeFile(duongDanCache, JSON.stringify(cacheMoi, null, 2) + "\n", "utf8");

/**
 * Nhật ký đặt ngay cạnh ảnh của người dùng.
 *
 * Tác vụ chạy ngầm không hiện cửa sổ nào, nên đây là cách duy nhất để biết
 * lần chạy vừa rồi có món nào lỗi. Đặt trong thư mục ảnh chứ không phải
 * trong dự án, vì đó là nơi người dùng thật sự mở ra xem.
 */
const goc = duongDanVao.find((p) => existsSync(p) && !/\.zip$/i.test(p));
if (goc) {
  try {
    await writeFile(join(goc, "BAO CAO.txt"), dong.join("\r\n") + "\r\n", "utf8");
  } catch {
    /* thư mục chỉ đọc — bỏ qua, đã in ra màn hình rồi */
  }
}

// Không khớp được món nào VÀ cũng chẳng có gì mới -> coi là hỏng
if (khop.length === 0 && boQua.length === 0) process.exit(1);
