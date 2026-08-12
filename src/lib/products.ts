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
  /** Ghi chú tình trạng thật của món hàng — thông tin quan trọng nhất với đồ cũ */
  note?: string;
  /** Ảnh bìa — cũng là ảnh đầu trong `anhs` khi sản phẩm có nhiều ảnh */
  anh?: string;
  /** Nhiều ảnh cho một món, do scripts/nap-anh.mjs sinh ra. Chỉ có khi ≥ 2 tấm */
  anhs?: string[];
  mau: string;
};

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

/** Hàng mới (New / nguyên seal) */
export function hangMoi(limit?: number): Product[] {
  const ds = products.filter((p) => p.nhomTinhTrang === "moi");
  return limit ? ds.slice(0, limit) : ds;
}

/** Món đắt tiền nhất mỗi danh mục — dùng làm hàng nổi bật trên trang chủ */
export function hangNoiBat(limit = 8): Product[] {
  const theoDanhMuc = new Map<string, Product>();
  for (const p of [...products].sort((a, b) => b.gia - a.gia)) {
    if (!theoDanhMuc.has(p.danhMuc)) theoDanhMuc.set(p.danhMuc, p);
  }
  const dauBang = [...theoDanhMuc.values()];
  const conLai = [...products]
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
  | "diaDiem"
  | "soLuong"
  | "note"
  | "anh"
  | "mau"
>;

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
    diaDiem: p.diaDiem,
    soLuong: p.soLuong,
    note: p.note,
    anh: p.anh,
    mau: p.mau,
  };
}
