import { boDau } from "./normalize.mjs";

/**
 * Khớp tên thư mục ảnh với sản phẩm trong bảng hàng.
 *
 * Tên thư mục do người đặt tay nên gần như không bao giờ trùng khít với Sheet:
 *   thư mục "Finalmouse Tarik"  ↔  sheet "FinalMouse" + "Tarik ( L )"
 *
 * Cách làm: cắt cả hai bên thành tập từ, rồi tính tỉ lệ từ của THƯ MỤC tìm
 * thấy trong tên sản phẩm. Lấy tỉ lệ theo thư mục chứ không theo sản phẩm, vì
 * tên sản phẩm hay có thêm chi tiết ( L ), ( đen ), ( 3 mode ) mà người ta
 * lười gõ vào tên thư mục.
 */

/**
 * Cắt tên thành tập từ khoá.
 *
 * Tách cả chỗ chữ dính số, vì người đặt tên thư mục và người nhập Sheet hay
 * viết khác nhau ở đúng chỗ đó:
 *   thư mục "ATK68 RX"  ->  atk 68 rx
 *   sheet   "ATK 68RX"  ->  atk 68 rx     (khớp)
 * Không tách thì thành ["atk68","rx"] và ["atk","68rx"] — không trùng từ nào.
 *
 * Dấu "+" là MỘT TỪ THẬT ("plus"), không phải ký tự rác. Với chuột ATK, "A9
 * Mini Ultimate +" và "A9 Mini Ultimate" là hai sản phẩm khác nhau. Bản trước
 * vứt dấu + nên hai tấm ảnh của hai món bị coi là của cùng một món, một tấm bị
 * bỏ luôn (15/9/2026).
 */
function tuKhoa(s) {
  return boDau(s)
    .replace(/\+/g, " plus ")
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((t) => t.length > 0);
}

/** Tên rút gọn để so trùng khít: bỏ dấu, bỏ khoảng trắng/ký hiệu, NHƯNG giữ "+" */
function khoaKhit(s) {
  return boDau(s).replace(/\+/g, "plus").replace(/[^a-z0-9]/g, "");
}

/**
 * Điểm khớp 0–1 giữa tên thư mục và một sản phẩm.
 *
 * Chỉ đếm từ trùng KHÍT. Từng thử đoán cả viết tắt nhưng bỏ, vì viết tắt
 * trong ngành không theo quy luật nào: "Da" là ghép chữ đầu của DeathAdder
 * chứ không phải cắt đầu từ, nên mọi quy tắc máy móc đều đoán trượt và làm
 * tăng nguy cơ gán ảnh sang nhầm món. Thà báo không khớp để người sửa tên.
 */
function chamDiem(tuThuMuc, sanPham) {
  if (tuThuMuc.length === 0) return 0;
  const boSanPham = new Set(tuKhoa(`${sanPham.hang} ${sanPham.ten}`));
  const trung = tuThuMuc.filter((t) => boSanPham.has(t)).length;
  return trung / tuThuMuc.length;
}

/** Số từ tên sản phẩm có mà tên thư mục KHÔNG có */
function soTuThua(tuThuMuc, sanPham) {
  const boThuMuc = new Set(tuThuMuc);
  return new Set(tuKhoa(`${sanPham.hang} ${sanPham.ten}`).filter((t) => !boThuMuc.has(t))).size;
}

/**
 * Tìm sản phẩm khớp nhất.
 *
 * Trả về { sanPham, diem, roRang }. `roRang` là false khi có nhiều sản phẩm
 * cùng điểm cao — lúc đó KHÔNG tự gán, vì gán nhầm ảnh sang món khác còn tệ
 * hơn là không có ảnh.
 */
export function timSanPham(tenThuMuc, danhSach) {
  const ten = String(tenThuMuc ?? "").trim();
  const chac = (p) => ({ sanPham: p, diem: 1, roRang: true, ungVien: [] });

  // Lối thoát 1: đặt tên thư mục đúng bằng mã sản phẩm (dòng "mã:" trong báo
  // cáo, ví dụ "atk-a9-mini-ultimate-2"). Chỉ áp dụng khi tên có dạng mã.
  if (/^[a-z0-9]+(-[a-z0-9]+)*$/.test(ten)) {
    const theoMa = danhSach.find((p) => p.slug === ten);
    if (theoMa) return chac(theoMa);
  }

  // Lối thoát 2: trùng khít tên đầy đủ, KỂ CẢ dấu "+". Với món không có dấu +
  // thì vẫn chấp nhận so với mã như bản trước (món "Không rõ hãng" có mã chỉ
  // gồm tên, không có hãng). Với món CÓ dấu + thì bắt buộc thư mục cũng có +,
  // không thì "A9 Mini Ultimate" bị hút nhầm sang "A9 Mini Ultimate +".
  const khoa = khoaKhit(ten);
  const trungKhit = danhSach.filter(
    (p) =>
      khoaKhit(`${p.hang} ${p.ten}`) === khoa ||
      (!String(p.ten).includes("+") && p.slug.replace(/[^a-z0-9]/g, "") === khoa),
  );
  if (trungKhit.length === 1) return chac(trungKhit[0]);
  if (trungKhit.length > 1) {
    // Cùng một món ghi hai kiểu, ví dụ kho đã bán có cả "V9 Turbo +" lẫn "V9
    // turbo plus": coi + là plus thì hai tên trùng khít nhau. Dùng lại đúng
    // cách chọn của bộ khớp cũ (so với mã) làm trọng tài, để kết quả không
    // lùi so với trước — phép so cũ/mới trên toàn bộ thư mục ảnh đã bắt được
    // đúng chỗ này.
    const maKhongCong = boDau(ten).replace(/[^a-z0-9]/g, "");
    const theoMa = trungKhit.filter((p) => p.slug.replace(/[^a-z0-9]/g, "") === maKhongCong);
    if (theoMa.length === 1) return chac(theoMa[0]);
  }

  const tu = tuKhoa(ten);
  if (tu.length === 0) return { sanPham: null, diem: 0, roRang: false, ungVien: [] };

  const cham = danhSach
    .map((p) => ({ sanPham: p, diem: chamDiem(tu, p) }))
    .sort((a, b) => b.diem - a.diem);

  const tot = cham[0];
  if (!tot || tot.diem < 0.6) {
    // Chỉ gợi ý món có trùng ít nhất một từ — liệt kê món 0% chỉ gây rối
    return {
      sanPham: null,
      diem: tot?.diem ?? 0,
      roRang: false,
      ungVien: cham.filter((c) => c.diem > 0).slice(0, 3),
    };
  }

  const dongDiem = cham.filter((c) => c.diem === tot.diem);
  if (dongDiem.length > 1) {
    /*
     * Nhiều món cùng chứa ĐỦ mọi từ của thư mục. Nếu đúng MỘT món trong đó
     * không có từ nào thừa thì đó là trùng khít — chọn nó. Ví dụ thư mục
     * "ATK Rs6": món "ATK RS6" khít, món "ATK RS6 Aspas" thừa chữ "aspas".
     * Còn lại vẫn mơ hồ thì để người quyết, như trước.
     */
    if (tot.diem === 1) {
      const khit = dongDiem.filter((c) => soTuThua(tu, c.sanPham) === 0);
      if (khit.length === 1) return chac(khit[0].sanPham);
    }
    return { sanPham: null, diem: tot.diem, roRang: false, ungVien: dongDiem.slice(0, 3) };
  }

  return { sanPham: tot.sanPham, diem: tot.diem, roRang: true, ungVien: [] };
}
