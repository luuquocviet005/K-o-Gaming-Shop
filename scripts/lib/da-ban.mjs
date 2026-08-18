/**
 * Kho lưu trữ hàng đã bán.
 *
 * VÌ SAO CẦN: chủ shop bán xong thì xoá dòng khỏi Google Sheet. Trước đây
 * trang sản phẩm biến mất luôn, đường dẫn trả về 404 — trong khi Google đã
 * lập chỉ mục nó, và mọi link đã gửi cho khách qua Zalo hay đăng lên Facebook
 * vẫn còn đó. Khách bấm vào gặp trang lỗi trắng trơn là mất luôn người đó.
 *
 * Với shop hàng cũ thì đây không phải chuyện hi hữu — nó xảy ra MỖI LẦN bán
 * được hàng.
 *
 * Nên khi một món biến mất khỏi Sheet, giữ lại đủ thông tin để dựng một trang
 * "món này đã bán rồi" kèm gợi ý món tương tự. Khách ở lại xem tiếp, Google
 * giữ được điểm cho đường dẫn đó.
 *
 * Chủ shop KHÔNG phải làm gì thêm: cứ xoá dòng khỏi Sheet như cũ.
 */

import { readFile, writeFile } from "node:fs/promises";

/** Chỉ giữ đủ để dựng trang — không ôm cả `anhs`, `note`, `moTa` cho nhẹ file */
function rutGon(p, banLuc) {
  return {
    slug: p.slug,
    ten: p.ten,
    hang: p.hang,
    danhMuc: p.danhMuc,
    gia: p.gia,
    ...(p.donViGia ? { donViGia: p.donViGia } : {}),
    tinhTrang: p.tinhTrang,
    nhomTinhTrang: p.nhomTinhTrang,
    ...(p.anh ? { anh: p.anh } : {}),
    mau: p.mau,
    banLuc,
  };
}

export async function docKhoDaBan(duongDan) {
  try {
    const j = JSON.parse(await readFile(duongDan, "utf8"));
    return Array.isArray(j.daBan) ? j.daBan : [];
  } catch {
    return []; // lần đầu chạy
  }
}

/**
 * So sánh danh sách cũ với danh sách mới, cập nhật kho lưu trữ.
 *
 * @param {object[]} sanPhamCu   danh sách ở lượt đồng bộ trước
 * @param {object[]} sanPhamMoi  danh sách vừa đọc từ Sheet
 * @param {object[]} khoCu       kho lưu trữ hiện có
 * @returns {{kho: object[], moiBan: object[], quayLai: string[]}}
 */
export function capNhatKho(sanPhamCu, sanPhamMoi, khoCu) {
  const dangBan = new Set(sanPhamMoi.map((p) => p.slug));
  const homNay = new Date().toISOString().slice(0, 10);

  // Món có trong lượt trước mà lượt này không còn -> vừa bán
  const moiBan = sanPhamCu
    .filter((p) => !dangBan.has(p.slug))
    .map((p) => rutGon(p, homNay));

  /*
   * Món quay lại Sheet thì bỏ khỏi kho. Xảy ra khi chủ shop lỡ tay xoá nhầm
   * rồi thêm lại, hoặc khách trả hàng. Không xử lý thì trang "đã bán" và trang
   * bán thật cùng trỏ một đường dẫn.
   */
  const quayLai = khoCu.filter((p) => dangBan.has(p.slug)).map((p) => p.slug);

  const kho = [
    ...khoCu.filter((p) => !dangBan.has(p.slug)),
    ...moiBan.filter((p) => !khoCu.some((c) => c.slug === p.slug)),
  ].sort((a, b) => b.banLuc.localeCompare(a.banLuc));

  return { kho, moiBan, quayLai };
}

/** Ghi kho, trả về true nếu nội dung thật sự đổi */
export async function ghiKho(duongDan, kho) {
  const json = JSON.stringify({ daBan: kho }, null, 2) + "\n";
  let cu = "";
  try {
    cu = await readFile(duongDan, "utf8");
  } catch {
    /* chưa có file */
  }
  if (cu === json) return false;
  await writeFile(duongDan, json, "utf8");
  return true;
}
