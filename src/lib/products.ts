/**
 * Dữ liệu sản phẩm.
 *
 * KHÔNG sửa tay file này để thêm/bớt hàng — nguồn duy nhất là Google Sheet.
 * Sửa Sheet rồi chạy `npm run sync`, hoặc để GitHub Actions tự đồng bộ.
 *
 * Tên trường giữ nguyên tiếng Việt như trong Sheet để đọc code là hiểu ngay
 * nó tương ứng với cột nào, không phải tra bảng dịch qua lại.
 */

import data from "@/data/products.json";
import khoDaBan from "@/data/da-ban.json";
import { formatVND } from "@/lib/format";

/** Nhóm để lọc — chi tiết vẫn hiện nguyên chữ người bán ghi trong `tinhTrang` */
export type NhomTinhTrang = "moi" | "cu" | "khac";

export type Product = {
  id: string;
  slug: string;
  ten: string;
  hang: string;
  danhMuc: string;
  /**
   * Danh mục phụ — món này còn được xếp thêm vào những nhóm nào nữa.
   *
   * Có khi một món thuộc về hai chỗ thật: soundcard vừa là đồ đi kèm tai nghe
   * vừa là phụ kiện. Chủ shop khai nó ở nhiều tab trong Sheet thì nó hiện ở
   * đúng ngần ấy danh mục — nhưng vẫn chỉ có MỘT trang sản phẩm, một đường
   * dẫn, một chỗ để sửa. `danhMuc` ở trên là nhóm chính, dùng cho breadcrumb
   * và dòng "Nhóm" trên trang sản phẩm.
   */
  danhMucKhac?: string[];
  /** Món là gì ("Feet chuột", "Keycap") — cột "Loại" trong Sheet, có thể trống */
  loaiHang?: string;
  /** VNĐ. 0 nghĩa là chưa có giá — hiển thị "Liên hệ" */
  gia: number;
  /** Có khi Sheet ghi khoảng giá ("1m3-1m5") hoặc hai mức ("5tr8 / 6tr") */
  giaToiDa?: number;
  /** Nguyên văn ô giá trong Sheet, để đối chiếu khi giá không đơn trị */
  ghiChuGia?: string;
  /** "cái" với switch bán lẻ — giá là giá một đơn vị */
  donViGia?: string;
  tinhTrang: string;
  nhomTinhTrang: NhomTinhTrang;
  diaDiem: string;
  soLuong: number;
  /**
   * Mô tả món hàng: cấu hình, phụ kiện kèm theo, thông số.
   *
   * Khác `note` ở chỗ đây là thứ làm khách MUỐN mua, còn `note` là khuyết điểm
   * khách CẦN biết. Hai loại hiện ở hai khối riêng trên trang sản phẩm.
   */
  moTa?: string;
  /** Ghi chú tình trạng thật của món hàng — thông tin quan trọng nhất với đồ cũ */
  note?: string;
  /** Ảnh bìa — cũng là ảnh đầu trong `anhs` khi sản phẩm có nhiều ảnh */
  anh?: string;
  /** Nhiều ảnh cho một món, do scripts/nap-anh.mjs sinh ra. Chỉ có khi ≥ 2 tấm */
  anhs?: string[];
  mau: string;
  /**
   * Các phân loại (màu, layout, loại switch…) của cùng một món.
   *
   * Sinh ra khi Sheet có nhiều dòng trùng Hãng + Tên nhưng khác cột "Phân loại".
   * Khi có, các trường gia / soLuong / tinhTrang / anh ở trên là số GỘP để thẻ
   * sản phẩm, bộ lọc và sắp xếp chạy như cũ: giá thấp nhất (giaToiDa = cao
   * nhất), tổng số lượng, ảnh của phân loại đầu tiên có ảnh. Trang sản phẩm thì
   * dùng `apDungPhanLoai` để lấy đúng số liệu của phân loại khách đang chọn.
   */
  phanLoai?: PhanLoai[];
};

/** Một dòng trong Sheet thuộc một sản phẩm có nhiều phân loại */
export type PhanLoai = {
  /** slug của tên phân loại — dùng trong ?loai=, giỏ hàng và tên thư mục ảnh */
  id: string;
  ten: string;
  gia: number;
  giaToiDa?: number;
  ghiChuGia?: string;
  tinhTrang: string;
  nhomTinhTrang: NhomTinhTrang;
  soLuong: number;
  moTa?: string;
  note?: string;
  anh?: string;
  anhs?: string[];
};

/** Sản phẩm sau khi áp số liệu của một phân loại — giữ nguyên kiểu Product */
export type MonDangXem = Product & { loai?: PhanLoai };

/**
 * Trộn số liệu của phân loại `loaiId` vào sản phẩm.
 *
 * Mọi chỗ đang nhận `Product` (thư viện ảnh, khối mua, giỏ hàng) dùng được kết
 * quả này mà không phải biết gì về phân loại. Không có phân loại hoặc id lạ
 * thì trả về chính sản phẩm.
 */
export function apDungPhanLoai(p: Product, loaiId?: string | null): MonDangXem {
  const loai = p.phanLoai?.find((v) => v.id === loaiId);
  if (!loai) return p;
  return {
    ...p,
    gia: loai.gia,
    giaToiDa: loai.giaToiDa,
    ghiChuGia: loai.ghiChuGia,
    tinhTrang: loai.tinhTrang,
    nhomTinhTrang: loai.nhomTinhTrang,
    soLuong: loai.soLuong,
    moTa: loai.moTa ?? p.moTa,
    note: loai.note,
    anh: loai.anh ?? p.anh,
    anhs: loai.anhs ?? (loai.anh ? [loai.anh] : p.anhs),
    loai,
  };
}

/** Phân loại mở sẵn khi vào trang: cái đầu tiên còn hàng, hết cả thì cái đầu */
export function phanLoaiMacDinh(p: Product): PhanLoai | undefined {
  return p.phanLoai?.find((v) => v.soLuong > 0) ?? p.phanLoai?.[0];
}

export type Category = {
  slug: string;
  name: string;
  short: string;
  icon: string;
  blurb: string;
  donViGia?: string;
  soLuong: number;
};

export const products = data.sanPham as Product[];
export const categories = data.danhMuc as Category[];

/**
 * Hàng đã bán — món đã biến mất khỏi Google Sheet.
 *
 * Trang của chúng vẫn còn, chỉ đổi thành "món này đã bán rồi" kèm gợi ý món
 * tương tự. Lý do: Google đã lập chỉ mục những đường dẫn đó, và mọi link chủ
 * shop từng gửi khách qua Zalo hay đăng Facebook vẫn còn sống. Để 404 là ném
 * đi cả khách lẫn điểm SEO mỗi lần bán được hàng.
 *
 * Do scripts/sync-sheet.mjs tự ghi ra, chủ shop không phải làm gì thêm.
 */
export type SoldProduct = Pick<
  Product,
  | "slug"
  | "ten"
  | "hang"
  | "danhMuc"
  | "gia"
  | "donViGia"
  | "tinhTrang"
  | "nhomTinhTrang"
  | "anh"
  | "mau"
> & {
  /** Ngày món này rời khỏi Sheet, dạng YYYY-MM-DD */
  banLuc: string;
};

export const soldProducts = khoDaBan.daBan as SoldProduct[];

export function getSoldProduct(slug: string): SoldProduct | undefined {
  return soldProducts.find((p) => p.slug === slug);
}

/** Món còn bán trong cùng danh mục — để gợi ý thay thế cho hàng đã bán */
export function replacementsFor(sold: SoldProduct, limit = 4): Product[] {
  const cungDanhMuc = products.filter((p) => p.danhMuc === sold.danhMuc);
  const cungHang = cungDanhMuc.filter((p) => p.hang === sold.hang);
  const conLai = cungDanhMuc.filter((p) => p.hang !== sold.hang);
  // Hết món cùng nhóm thì lấy tạm hàng nổi bật, còn hơn để trang trống
  const duPhong = products.filter((p) => p.danhMuc !== sold.danhMuc);
  return [...cungHang, ...conLai, ...duPhong].slice(0, limit);
}

// ─────────────────────────── Truy vấn ───────────────────────────

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsByCategory(slug: string): Product[] {
  return products.filter(
    (p) => p.danhMuc === slug || p.danhMucKhac?.includes(slug),
  );
}

export function countByCategory(slug: string): number {
  return productsByCategory(slug).length;
}

export function relatedProducts(product: Product, limit = 4): Product[] {
  const cungDanhMuc = products.filter(
    (p) => p.danhMuc === product.danhMuc && p.id !== product.id,
  );
  // Ưu tiên cùng hãng, sau đó tới cùng danh mục
  const cungHang = cungDanhMuc.filter((p) => p.hang === product.hang);
  const conLai = cungDanhMuc.filter((p) => p.hang !== product.hang);
  return [...cungHang, ...conLai].slice(0, limit);
}

/** Hàng mới (New / nguyên seal) còn hàng — món mới đã bán xong không đáng khoe */
export function hangMoi(limit?: number): Product[] {
  const ds = products.filter((p) => p.nhomTinhTrang === "moi" && p.soLuong > 0);
  return limit ? ds.slice(0, limit) : ds;
}

/**
 * Món đắt tiền nhất mỗi danh mục — dùng làm hàng nổi bật trên trang chủ.
 *
 * Chỉ lấy món CÒN HÀNG: món đắt nhất thường là món vừa bán xong, và từng nằm
 * chễm chệ ở ảnh lớn đầu trang chủ với nhãn "Đã bán hết".
 */
export function hangNoiBat(limit = 8): Product[] {
  const conHang = products.filter((p) => p.soLuong > 0);
  const theoDanhMuc = new Map<string, Product>();
  for (const p of [...conHang].sort((a, b) => b.gia - a.gia)) {
    if (!theoDanhMuc.has(p.danhMuc)) theoDanhMuc.set(p.danhMuc, p);
  }
  const dauBang = [...theoDanhMuc.values()];
  const conLai = [...conHang]
    .filter((p) => !dauBang.includes(p))
    .sort((a, b) => b.gia - a.gia);
  return [...dauBang, ...conLai].slice(0, limit);
}

/** Hàng còn ít — mỗi món chỉ 1 cái thì mất là hết */
export function hangDocNhat(limit = 8): Product[] {
  return products
    .filter((p) => p.soLuong === 1 && p.gia > 0)
    .sort((a, b) => b.gia - a.gia)
    .slice(0, limit);
}

/** Nhãn dùng khi Sheet bỏ trống ô thương hiệu */
export const HANG_TRONG = "Không rõ hãng";

/**
 * Danh sách hãng THẬT — bỏ nhãn "Không rõ hãng".
 *
 * Nhãn đó có ý nghĩa trên trang sản phẩm (nói thật là chưa biết hãng), nhưng
 * đưa vào băng chuyền hay bộ lọc thì vô nghĩa: nó không phải một thương hiệu.
 */
export function tatCaHang(): string[] {
  return [...new Set(products.map((p) => p.hang))]
    .filter((h) => h && h !== HANG_TRONG)
    .sort((a, b) => a.localeCompare(b, "vi"));
}

export function tatCaDiaDiem(): string[] {
  return [...new Set(products.map((p) => p.diaDiem))].sort((a, b) =>
    a.localeCompare(b, "vi"),
  );
}

/** Còn hàng khi số lượng > 0; Sheet để trống thì coi như còn (chưa kịp cập nhật) */
export function conHang(p: Product): boolean {
  return p.soLuong > 0;
}

// ───────────── Bản rút gọn cho thẻ sản phẩm (component chạy ở trình duyệt) ─────────────

/**
 * `<ProductCard>` và `<ProductBrowser>` chạy phía trình duyệt nên mọi thứ
 * truyền vào chúng đều bị nhúng vào HTML. Dùng bản rút gọn để trang danh mục
 * không phình dung lượng.
 */
export type CardProduct = Pick<
  Product,
  | "id"
  | "slug"
  | "ten"
  | "hang"
  | "danhMuc"
  | "gia"
  | "giaToiDa"
  | "donViGia"
  | "tinhTrang"
  | "nhomTinhTrang"
  | "soLuong"
  | "note"
  | "anh"
  | "mau"
> & {
  /** Có bao nhiêu phân loại — thẻ hiện nhãn "3 phân loại" thay cho nút thêm giỏ */
  soPhanLoai?: number;
  /** Nhãn loại hàng góc ảnh: cột "Loại" trong Sheet, trống thì tên ngắn của danh mục chính */
  tenDanhMuc?: string;
};

export function toCard(p: Product): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    ten: p.ten,
    hang: p.hang,
    danhMuc: p.danhMuc,
    gia: p.gia,
    giaToiDa: p.giaToiDa,
    donViGia: p.donViGia,
    tinhTrang: p.tinhTrang,
    nhomTinhTrang: p.nhomTinhTrang,
    soLuong: p.soLuong,
    note: p.note,
    anh: p.anh,
    mau: p.mau,
    ...(p.phanLoai ? { soPhanLoai: p.phanLoai.length } : {}),
    tenDanhMuc: p.loaiHang || getCategory(p.danhMuc)?.short,
  };
}

/** Tên loại hàng đứng đầu tiêu đề trang sản phẩm — đúng chữ khách gõ ("chuột ATK A9") */
const LOAI_HANG: Record<string, string> = {
  chuot: "Chuột",
  "ban-phim": "Bàn phím",
  "tai-nghe": "Tai nghe",
  "pad-chuot": "Pad chuột",
};

/**
 * Tiêu đề trang sản phẩm cho Google: "Chuột ATK A9 Mini Ultimate + mới".
 *
 * Khách tìm bằng loại hàng + hãng + tên mẫu, thêm "cũ" khi săn hàng lướt —
 * nên cả bốn phải nằm trong tiêu đề. Layout còn nối " | Kẹo Gaming Gear"
 * (18 ký tự), scripts/audit.mjs đòi cả câu ≤ 70, nên phần này ≤ 52: dài quá
 * thì bỏ dần loại hàng rồi tình trạng.
 */
export function tieuDeSanPham(
  p: Pick<Product, "danhMuc" | "hang" | "ten" | "nhomTinhTrang">,
): string {
  const ten = p.ten.replace(/\s+/g, " ").trim();
  const hang = p.hang && !/không rõ/i.test(p.hang) && !ten.toLowerCase().includes(p.hang.toLowerCase()) ? p.hang : "";
  const loai = LOAI_HANG[p.danhMuc] ?? "";
  const tinhTrang = p.nhomTinhTrang === "moi" ? "mới" : p.nhomTinhTrang === "cu" ? "cũ" : "";
  const coLoai = loai && !ten.toLowerCase().startsWith(loai.toLowerCase()) ? loai : "";
  const thu = [
    [coLoai, hang, ten, tinhTrang],
    [hang, ten, tinhTrang],
    [hang, ten],
    [ten],
  ].map((x) => x.filter(Boolean).join(" "));
  return thu.find((t) => t.length <= 52) ?? ten.slice(0, 52);
}

// ─────────────────────────── Trang theo hãng ───────────────────────────

/** Hãng có từ ngần này món còn hàng thì trang /hang/<slug>/ mới cho Google xếp hạng */
export const NGUONG_TRANG_HANG = 2;

export type TrangHang = {
  slug: string;
  ten: string;
  /** Món còn hàng của hãng, mọi danh mục */
  dsMon: Product[];
  /** Đủ NGUONG_TRANG_HANG món còn hàng: vào sitemap và được index */
  duMon: boolean;
};

/** "Endgame Gear" -> "endgame-gear". Gộp luôn các cách viết khác hoa thường trong Sheet */
export function slugHang(hang: string): string {
  return hang
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/gi, "d")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Mọi trang hãng cần dựng.
 *
 * Tính cả hàng đã bán: hãng từng có trang mà bán gần hết thì đường dẫn vẫn
 * sống (Google đã lập chỉ mục), chỉ chuyển sang noindex. Hãng chưa từng có
 * đủ 2 món (còn + đã bán) thì không có trang, tránh trang mỏng.
 */
export function tatCaTrangHang(): TrangHang[] {
  const nhom = new Map<string, { ten: Map<string, number>; dsMon: Product[]; daBan: number }>();
  const lay = (hang: string) => {
    const slug = slugHang(hang);
    if (!slug || hang === HANG_TRONG) return undefined;
    let g = nhom.get(slug);
    if (!g) nhom.set(slug, (g = { ten: new Map(), dsMon: [], daBan: 0 }));
    return g;
  };
  for (const p of products) {
    if (!conHang(p)) continue;
    const g = lay(p.hang);
    if (!g) continue;
    g.dsMon.push(p);
    g.ten.set(p.hang, (g.ten.get(p.hang) ?? 0) + 1);
  }
  for (const p of soldProducts) {
    const g = lay(p.hang);
    if (!g) continue;
    g.daBan++;
    if (!g.ten.size) g.ten.set(p.hang, 0);
  }
  return [...nhom]
    .filter(([, g]) => g.dsMon.length + g.daBan >= NGUONG_TRANG_HANG)
    .map(([slug, g]) => ({
      slug,
      // Cách viết gặp nhiều nhất ở hàng đang bán
      ten: [...g.ten].sort((a, b) => b[1] - a[1])[0][0],
      dsMon: g.dsMon,
      duMon: g.dsMon.length >= NGUONG_TRANG_HANG,
    }))
    .sort((a, b) => b.dsMon.length - a.dsMon.length || a.ten.localeCompare(b.ten, "vi"));
}

export function getTrangHang(slug: string): TrangHang | undefined {
  return tatCaTrangHang().find((t) => t.slug === slug);
}

/** Đường dẫn trang hãng nếu hãng đó có trang đang được index, để trang sản phẩm gắn link */
export function linkTrangHang(hang: string): string | undefined {
  const t = getTrangHang(slugHang(hang));
  return t?.duMon ? `/hang/${t.slug}/` : undefined;
}

/** Tên loại hàng trong tiêu đề trang hãng ("Chuột", "Bàn phím"...) */
export function tenLoaiHang(danhMuc: string): string {
  return LOAI_HANG[danhMuc] ?? getCategory(danhMuc)?.short ?? danhMuc;
}

/**
 * Đoạn giới thiệu dưới tiêu đề trang danh mục và trang hãng — để Google có
 * chữ thật mà hiểu trang. Ghép hoàn toàn từ dữ liệu đang bán nên tự đúng khi
 * Sheet đổi, không ai phải viết tay.
 */
export function gioiThieuNhom(ds: Product[]): string {
  const conHang = ds.filter((p) => p.soLuong > 0 && p.gia > 0);
  if (conHang.length === 0) return "";
  const demHang = new Map<string, number>();
  for (const p of conHang) {
    if (p.hang && !/không rõ/i.test(p.hang)) demHang.set(p.hang, (demHang.get(p.hang) ?? 0) + 1);
  }
  const hangChinh = [...demHang].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([h]) => h);
  const gia = conHang.map((p) => p.gia);
  const thap = Math.min(...gia);
  const cao = Math.max(...gia);
  return [
    `Đang có ${conHang.length} món${hangChinh.length ? ` từ ${hangChinh.join(", ")}` : ""}`,
    thap === cao ? `, giá ${formatVND(thap)}. ` : `, giá từ ${formatVND(thap)} đến ${formatVND(cao)}. `,
    "Ở Đà Nẵng thì qua test trực tiếp, ở tỉnh thì ship COD toàn quốc, tụi mình quay video đúng món trước khi gửi.",
  ].join("");
}
