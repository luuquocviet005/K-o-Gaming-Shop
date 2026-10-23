import { site } from "@/lib/site";
import { products, getProduct, getSoldProduct } from "@/lib/products";
import { formatGia, formatVND } from "@/lib/format";

/**
 * Mã QR chuyển khoản VietQR — có số tiền thì điền sẵn, không thì khách tự nhập.
 * KHÔNG điền nội dung chuyển khoản: chủ shop không muốn sao kê ghi sẵn chữ
 * "Keo Gaming" / "Coc COD".
 */
function qrChuyenKhoan(soTien: number | null): string {
  const { ma, soTaiKhoan, chuTaiKhoan } = site.nganHang;
  const qs = new URLSearchParams({ accountName: chuTaiKhoan });
  if (soTien) qs.set("amount", String(soTien));
  return `https://img.vietqr.io/image/${ma}-${soTaiKhoan}-compact2.png?${qs}`;
}

/**
 * Khách xin STK / chọn chuyển khoản lúc máy chủ chưa trả lời được.
 *
 * STK là thông tin cố định nên trình duyệt tự đưa ngay, kèm mã QR — khách
 * nhắn "bankfull, cho mình xin stk" mà chỉ nhận lại quy tắc ship thì phải hỏi
 * đi hỏi lại.
 */
export function traLoiChuyenKhoan(userText: string): { text: string; qrUrl: string } | null {
  const q = userText.toLowerCase();
  const xinStk = /stk|số tài khoản|so tai khoan|tài khoản|chuyển khoản|mã qr|\bqr\b/.test(q);
  const bankFull = /bank\s*full/.test(q);
  if (!xinStk && !bankFull) return null;

  const laCoc = /cọc|\bcod\b/.test(q) && !bankFull;
  const { ma, soTaiKhoan, chuTaiKhoan } = site.nganHang;
  const stk = `${ma} – ${soTaiKhoan} – ${chuTaiKhoan}`;
  const text = laCoc
    ? `Dạ STK nhận cọc của shop: ${stk}. Bạn cọc ${formatVND(site.shipping.cocCod)} theo mã QR bên dưới nha, tiền cọc trừ thẳng vào tiền thu hộ COD. Chuyển xong bạn nhắn Messenger hoặc Zalo (nút ở đầu khung chat) gửi ảnh chuyển khoản + Họ tên, SĐT, địa chỉ để shop lên đơn ạ!`
    : `Dạ STK của shop: ${stk}. Bạn quét mã QR bên dưới rồi nhập số tiền đơn hàng nha (đơn từ ${formatVND(site.shipping.freeshipChuyenKhoanTu)} được freeship). Chuyển xong bạn nhắn Messenger hoặc Zalo (nút ở đầu khung chat) gửi ảnh chuyển khoản + Họ tên, SĐT, địa chỉ để shop lên đơn ạ!`;
  return {
    text,
    qrUrl: qrChuyenKhoan(laCoc ? site.shipping.cocCod : null),
  };
}

/**
 * Trả lời dự phòng tức thì ngay trên trình duyệt nếu máy chủ Cloud Render đang khởi động lại.
 * Lúc này KHÔNG có gì được gửi về cho chủ shop — đừng hứa "đã ghi nhận" hay
 * "để lại SĐT", mà chỉ khách sang Messenger/Zalo/điện thoại.
 * Phân biệt TUYỆT ĐỐI danh mục (chuot / ban-phim / tai-nghe / pad-chuot / phu-kien) để không bao giờ lẫn bàn phím vào chuột.
 */
export function buildInstantLocalReply(
  userText: string,
  currentProductSlug: string | null,
  cartTotal: number,
  cartSummary: string,
): string {
  const q = userText.toLowerCase().trim();
  const curProd = currentProductSlug ? getProduct(currentProductSlug) : undefined;
  const curSold = currentProductSlug ? getSoldProduct(currentProductSlug) : undefined;

  // 1. Hỏi về Ship COD / Bank full / Thanh toán / Freeship
  if (/ship\s*cod|bank\s*full|chuyển khoản|thanh toán|freeship|free\s*ship|phí ship|cọc/i.test(q)) {
    return `Dạ, Ship COD bên mình cọc ${formatVND(site.shipping.cocCod)} giúp shop nha, cọc trừ thẳng vào tiền thu hộ COD. Bank full thì đơn từ ${formatVND(site.shipping.freeshipChuyenKhoanTu)} mình freeship, dưới mức đó phí ship tính theo thực tế bưu điện nhưng sẽ rẻ hơn so với COD ạ.`;
  }

  // 2. Hỏi địa chỉ / Đà Nẵng / GDTT / Qua shop test
  if (/địa chỉ|ở đâu|đà nẵng|gdtt|qua test|trực tiếp|giờ mở cửa/i.test(q)) {
    return `Dạ Kẹo Gaming Shop ở tại: ${site.contact.address} (Mở cửa ${site.contact.hours}). Hàng có sẵn tại shop, mời bạn ghé test trực tiếp thoải mái trước khi trả tiền nha! Bạn định ghé khoảng mấy giờ nhắn mình chuẩn bị sẵn đồ nhé.`;
  }

  // 3. Nếu khách đang đứng ở trang 1 sản phẩm cụ thể và hỏi về món đó
  if (curProd && /món này|con này|còn không|còn hàng|giá|chốt|mua/i.test(q)) {
    const giaText = formatGia(curProd);
    if (curProd.soLuong <= 0) {
      return `Dạ mẫu ${curProd.hang} ${curProd.ten} hiện vừa hết hàng rồi ạ. Bạn nhắn Messenger hoặc Zalo cho tụi mình (nút ở đầu khung chat), khi nào có kèo tương tự về shop báo bạn đầu tiên nha!`;
    }
    return `Dạ mẫu ${curProd.hang} ${curProd.ten} (${curProd.tinhTrang}) đang sẵn hàng tại Đà Nẵng, giá ${giaText}${curProd.note ? ` — ${curProd.note}` : ""}. Bạn muốn qua shop test trực tiếp hay chốt Ship COD / Bank full ạ?`;
  }

  if (curSold && /món này|con này|còn không/i.test(q)) {
    return `Dạ mẫu ${curSold.hang} ${curSold.ten} này shop vừa bán mất rồi ạ. Bạn nhắn Messenger hoặc Zalo cho tụi mình (nút ở đầu khung chat), khi nào có kèo lướt tương tự về mình nhắn bạn ngay nha!`;
  }

  // 4. Phân loại đúng Danh mục khách đang hỏi (Chuột vs Bàn phím vs Tai nghe)
  const askingMouse = /chuột|mouse|spl|gpx|viper|deathadder|da v3|da v4|superlight|zowie|pulsar|lamzu|cầm|tay to|tay nhỏ|claw|palm|fingertip/i.test(q);
  const askingKeyboard = /bàn phím|phím|he\b|rapid trigger|switch|keycap|layout|60%|68%|75%|80%|tkl|hex80|rs7|edge60|wooting|aula|akko/i.test(q);
  const askingHeadset = /tai nghe|headset|iem|mic|hyperx|cloud|blackshark|barracuda/i.test(q);

  let pool = products.filter((p) => p.soLuong > 0);
  if (askingMouse && !askingKeyboard) {
    pool = pool.filter((p) => p.danhMuc === "chuot");
  } else if (askingKeyboard && !askingMouse) {
    pool = pool.filter((p) => p.danhMuc === "ban-phim");
  } else if (askingHeadset) {
    pool = pool.filter((p) => p.danhMuc === "tai-nghe");
  }

  if (askingMouse && /tay.*to|tay.*lớn/i.test(q)) {
    pool = pool.filter((p) => !/mini/i.test(p.ten));
  }

  if (askingMouse || askingKeyboard || askingHeadset) {
    const top = pool.slice(0, 5);
    if (top.length > 0) {
      const listStr = top
        .map((p) => `• ${p.hang} ${p.ten} (${p.tinhTrang}): ${formatGia(p)}`)
        .join("\n");
      return `Dạ hiện tại trong danh mục bạn tìm, shop đang sẵn mấy mẫu này phù hợp nè:\n${listStr}\nBạn thích form cầm hay tầm giá khoảng bao nhiêu nhắn mình lọc chuẩn hơn cho bạn nha!`;
    }
  }

  if (cartSummary && /giỏ hàng|chốt đơn/i.test(q)) {
    return `Dạ mình thấy trong giỏ của bạn đang có: ${cartSummary} (Tổng: ${formatVND(cartTotal)}). Bạn muốn chốt đơn này theo hình thức Ship COD hay Bank full ạ?`;
  }

  return `Dạ trợ lý đang bận chút nên chưa trả lời kỹ được câu này ạ. Bạn nhắn Messenger hoặc Zalo (nút ở đầu khung chat) hay gọi ${site.contact.phone} để chủ shop trả lời ngay nha!`;
}
