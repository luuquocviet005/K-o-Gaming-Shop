/**
 * Thông tin cửa hàng — SỬA FILE NÀY để thay tên, liên hệ, mạng xã hội.
 * Không hardcode số điện thoại / địa chỉ ở bất kỳ component nào khác.
 */
export const site = {
  name: "KẸO GAMING SHOP",
  shortName: "KẸO",
  tagline: "Gear cũ & mới — nói đúng tình trạng",
  description:
    "KẸO GAMING SHOP — chuột, bàn phím, tai nghe và switch, phần lớn là hàng đã qua sử dụng. Mỗi món ghi rõ tình trạng thật, cho test trước khi trả tiền. Hàng ở Đà Nẵng và Sài Gòn.",

  // Tên miền thật trên Hostinger. Dùng cho sitemap.xml, thẻ canonical,
  // thẻ chia sẻ mạng xã hội và dữ liệu có cấu trúc JSON-LD.
  url: "https://keogaminggear.com",

  contact: {
    phone: "0904 505 592",
    phoneHref: "tel:0904505592",
    email: "luuquocviet005@gmail.com",
    address:
      "Lô 19 B2 124 Khu đô thị công nghệ FPT, phường Hoà Hải, quận Ngũ Hành Sơn, TP. Đà Nẵng",
    hours: "09:00 – 21:00, tất cả các ngày trong tuần",
  },

  social: {
    facebook: "https://www.facebook.com/Viet.Vit.Dit.Zjt/",
    tiktok: "https://www.tiktok.com/@ngotdethuong",
    zalo: "https://zalo.me/0904505592",
    messenger: "https://m.me/Viet.Vit.Dit.Zjt",
  },

  /**
   * Vận chuyển.
   *
   * Chuyển khoản đủ tiền trước ("bank full") thì shop chịu phí ship. Còn lại
   * (ship COD) thì khách trả phí theo bảng giá nhà xe — số này thay đổi theo
   * tỉnh và theo nhà xe nên KHÔNG ghi một con số cố định trên web; báo cho
   * khách lúc chốt đơn. Thà nói "báo sau" còn hơn ghi một con số rồi thu khác.
   */
  shipping: {
    dieuKienMienPhi: "chuyển khoản đủ tiền trước",
    ghiChuCod: "Ship COD: khách trả phí nhà xe, tụi mình báo trước khi gửi.",
  },

  /**
   * Mã đo lượt khách của Google Analytics, dạng "G-XXXXXXXXXX".
   *
   * ĐỂ TRỐNG = KHÔNG gắn gì cả: không tải script nào, không đặt cookie nào,
   * trang nhẹ y như cũ. Chỉ khi dán mã thật vào đây thì phần đo mới hoạt động.
   *
   * Lấy mã: analytics.google.com > tạo tài sản cho keogaminggear.com >
   * Quản trị > Luồng dữ liệu > chọn luồng web > copy "Mã đo lường".
   */
  ga4: "G-3LNMP4PFEX",
} as const;

/**
 * Ảnh mặc định của thẻ xem trước khi dán link vào Zalo / Messenger / Facebook.
 * Vẽ lại bằng: node scripts/tao-anh-chia-se.mjs
 */
export const ANH_CHIA_SE = "/anh-chia-se.png";

/**
 * Đổi đường dẫn ảnh trong web thành địa chỉ đầy đủ có tên miền.
 *
 * Zalo và Facebook đọc trang từ máy chủ của họ, KHÔNG phải từ trình duyệt của
 * khách, nên đường dẫn kiểu "/products/abc/01.webp" với họ là vô nghĩa —
 * phải là "https://keogaminggear.com/products/abc/01.webp". Đây là lỗi kinh
 * điển khiến thẻ xem trước mất ảnh.
 */
export function anhDayDu(duongDan: string): string {
  if (/^https?:\/\//i.test(duongDan)) return duongDan;
  return `${site.url}${duongDan.startsWith("/") ? "" : "/"}${duongDan}`;
}

/**
 * Ảnh riêng cho thẻ xem trước của một sản phẩm: /products/<slug>/chia-se.jpg
 *
 * Không dùng thẳng ảnh .webp trên web vì Zalo/Facebook đọc webp không đồng đều
 * và chúng cắt xén ảnh vuông. File này do scripts/anh-chia-se-san-pham.mjs vẽ
 * ra ở bước build nên luôn tồn tại cho mọi món đã có ảnh.
 */
export function anhChiaSeSanPham(slug: string): string {
  return anhDayDu(`/products/${slug}/chia-se.jpg`);
}
