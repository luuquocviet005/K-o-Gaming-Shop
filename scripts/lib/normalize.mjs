/**
 * Chuẩn hoá dữ liệu thô từ Google Sheet thành dữ liệu website dùng được.
 *
 * Sheet là nơi CON NGƯỜI nhập liệu nên cách viết rất tự do — file này chịu
 * trách nhiệm hiểu đúng những cách viết đó thay vì bắt người nhập phải theo
 * khuôn máy móc.
 */

/** Bỏ dấu tiếng Việt, còn lại chữ thường và khoảng trắng */
export function boDau(text) {
  return String(text ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

/** "Razer Viper v3 pro" -> "razer-viper-v3-pro" */
export function slugify(text) {
  return boDau(text)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Đọc một mốc giá đơn lẻ.
 *
 * Sheet dùng lẫn lộn "tr" và "m" cho triệu, "k" cho nghìn, và phần lẻ viết
 * tắt theo thói quen người Việt:
 *   650k     -> 650.000
 *   2tr      -> 2.000.000
 *   1tr2     -> 1.200.000   (phần lẻ "2" hiểu là 200 nghìn)
 *   1tr350   -> 1.350.000
 *   5m7      -> 5.700.000   ("m" cũng là triệu)
 *   10k      -> 10.000
 */
function docMotMocGia(raw) {
  const s = boDau(raw).replace(/[.,\s₫]/g, "");
  if (!s) return null;

  const trieu = s.match(/^(\d+)(?:tr|m)(\d*)$/);
  if (trieu) {
    const nguyen = Number(trieu[1]);
    // Phần lẻ đệm phải cho đủ 3 chữ số: "2" -> 200, "35" -> 350, "350" -> 350
    const le = trieu[2] ? Number(trieu[2].padEnd(3, "0")) : 0;
    return nguyen * 1_000_000 + le * 1_000;
  }

  const nghin = s.match(/^(\d+)k$/);
  if (nghin) return Number(nghin[1]) * 1_000;

  const so = s.match(/^(\d+)$/);
  if (so) {
    const n = Number(so[1]);
    // Số trần dưới 1000 gần như chắc chắn là nghìn (ví dụ "650" = 650k)
    return n < 1000 ? n * 1_000 : n;
  }

  return null;
}

/**
 * Đọc ô giá, kể cả khoảng giá và giá đôi:
 *   "1tr2"        -> { gia: 1200000 }
 *   "5tr8 / 6tr"  -> { gia: 5800000, giaToiDa: 6000000, ghiChuGia: "5tr8 / 6tr" }
 *   "1m3-1m5"     -> { gia: 1300000, giaToiDa: 1500000, ghiChuGia: "1m3-1m5" }
 *   ""            -> { gia: 0 }  (web hiện "Liên hệ")
 */
export function docGia(raw) {
  const text = String(raw ?? "").trim();
  if (!text) return { gia: 0 };

  const phan = text
    .split(/[/–—-]/)
    .map((p) => p.trim())
    .filter(Boolean);

  const mocs = phan.map(docMotMocGia).filter((n) => n !== null && n > 0);

  if (mocs.length === 0) return { gia: 0, ghiChuGia: text };
  if (mocs.length === 1) return { gia: mocs[0] };

  const min = Math.min(...mocs);
  const max = Math.max(...mocs);
  return min === max
    ? { gia: min }
    : { gia: min, giaToiDa: max, ghiChuGia: text };
}

/**
 * Chuẩn hoá tình trạng hàng.
 *
 * Đây là thông tin QUAN TRỌNG NHẤT với shop bán đồ cũ — nói mập mờ là mất
 * khách và mang tiếng. Giá trị lạ được giữ nguyên chữ người bán viết, không
 * ép vào nhóm nào, vì họ hiểu món hàng hơn cái bảng ánh xạ này.
 */
export function docTinhTrang(raw) {
  const text = String(raw ?? "").trim();
  const s = boDau(text).replace(/\s+/g, " ").trim();

  if (!s) return { tinhTrang: "", nhomTinhTrang: "khac" };

  if (s === "newseal" || s === "new seal")
    return { tinhTrang: "Mới, nguyên seal", nhomTinhTrang: "moi" };
  if (s === "new") return { tinhTrang: "Mới", nhomTinhTrang: "moi" };

  if (s.startsWith("2nd")) {
    const con = s.slice(3).trim();
    if (!con) return { tinhTrang: "Cũ", nhomTinhTrang: "cu" };
    if (con === "fullbox") return { tinhTrang: "Cũ · đủ hộp", nhomTinhTrang: "cu" };
    if (con === "nobox" || con === "no box")
      return { tinhTrang: "Cũ · không hộp", nhomTinhTrang: "cu" };
    // Ví dụ "2nd thiếu box giấy" — giữ nguyên chữ gốc của người bán
    return { tinhTrang: `Cũ · ${text.slice(3).trim()}`, nhomTinhTrang: "cu" };
  }

  return { tinhTrang: text, nhomTinhTrang: "khac" };
}

/**
 * Chỉ nhận đường dẫn ảnh thật sự dùng được.
 *
 * Cột "Ảnh" trong Sheet đa phần đang chứa lại TÊN sản phẩm, và có dòng chứa
 * link thư mục Google Drive — Drive chặn nhúng ảnh nên hiển thị sẽ hỏng.
 * Thà không có ảnh (web tự vẽ hình minh hoạ) còn hơn ảnh vỡ.
 */
export function docAnh(raw, danhSachFile = []) {
  const text = String(raw ?? "").trim();
  if (!text) return { anh: undefined };

  // Đường dẫn tuyệt đối sẵn có
  if (text.startsWith("/")) return { anh: text };

  if (/^https?:\/\//i.test(text)) {
    // Link THƯ MỤC Drive thì chịu — không trỏ tới ảnh cụ thể nào
    if (/drive\.google\.com\/drive\/folders/i.test(text)) {
      return { anh: undefined, canhBao: "link thư mục Drive, không phải ảnh" };
    }
    // Link FILE Drive đổi được sang dạng nhúng trực tiếp
    const idDrive = text.match(/drive\.google\.com\/file\/d\/([\w-]+)/)?.[1];
    if (idDrive) return { anh: `https://lh3.googleusercontent.com/d/${idDrive}` };

    if (/\.(jpe?g|png|webp|avif|gif)(\?|$)/i.test(text)) return { anh: text };
    return { anh: undefined, canhBao: "link không trỏ tới file ảnh" };
  }

  // Là tên file: tìm trong public/products/. Chấp nhận ghi thiếu đuôi file.
  const timThay = timFileAnh(text, danhSachFile);
  if (timThay) return { anh: duongDanAnh(timThay) };

  if (/\.(jpe?g|png|webp|avif|gif)$/i.test(text)) {
    return { anh: undefined, canhBao: `chưa có file "${text}" trong public/products/` };
  }

  // Chỉ là chữ (thường là chép lại tên sản phẩm) — không phải ảnh
  return { anh: undefined };
}

/**
 * Đường dẫn ảnh đã mã hoá URL.
 *
 * Tên file thật hay có khoảng trắng và dấu tiếng Việt ("Razer Viper v3 pro.png").
 * Nhét thẳng vào thuộc tính src thì phần lớn trình duyệt tự đoán được, nhưng
 * không phải lúc nào cũng đúng — mã hoá trước cho chắc.
 */
export function duongDanAnh(tenFile) {
  return `/products/${encodeURIComponent(tenFile)}`;
}

/** So khớp tên file bỏ qua dấu, hoa thường, khoảng trắng và ký tự đặc biệt */
function chuanTenFile(s) {
  return boDau(s).replace(/\.[a-z0-9]+$/, "").replace(/[^a-z0-9]+/g, "");
}

export function timFileAnh(ten, danhSachFile) {
  const can = chuanTenFile(ten);
  if (!can) return null;
  return danhSachFile.find((f) => chuanTenFile(f) === can) ?? null;
}

export function docSoNguyen(raw, macDinh = 0) {
  const n = parseInt(String(raw ?? "").replace(/[^\d]/g, ""), 10);
  return Number.isFinite(n) ? n : macDinh;
}

/** Màu cho hình minh hoạ vector — cùng hãng thì cùng màu, trông có hệ thống */
const BANG_MAU = [
  "#c2185b", "#1f2937", "#0f172a", "#7c3aed", "#0ea5e9", "#dc2626",
  "#0d9488", "#b45309", "#4338ca", "#be123c", "#334155", "#15803d",
];

export function mauTheoHang(hang) {
  const s = boDau(hang) || "khac";
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return BANG_MAU[h % BANG_MAU.length];
}
