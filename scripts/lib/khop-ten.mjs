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
 */
function tuKhoa(s) {
  return boDau(s)
    .replace(/([a-z])(\d)/g, "$1 $2")
    .replace(/(\d)([a-z])/g, "$1 $2")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((t) => t.length > 0);
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

/**
 * Tìm sản phẩm khớp nhất.
 *
 * Trả về { sanPham, diem, roRang }. `roRang` là false khi có nhiều sản phẩm
 * cùng điểm cao — lúc đó KHÔNG tự gán, vì gán nhầm ảnh sang món khác còn tệ
 * hơn là không có ảnh.
 */
export function timSanPham(tenThuMuc, danhSach) {
  const tu = tuKhoa(tenThuMuc);
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

  // Có hai ứng viên cùng điểm cao nhất -> mơ hồ, để người quyết
  const dongDiem = cham.filter((c) => c.diem === tot.diem);
  if (dongDiem.length > 1) {
    return { sanPham: null, diem: tot.diem, roRang: false, ungVien: dongDiem.slice(0, 3) };
  }

  return { sanPham: tot.sanPham, diem: tot.diem, roRang: true, ungVien: [] };
}
