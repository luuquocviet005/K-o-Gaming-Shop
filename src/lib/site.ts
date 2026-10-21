/** Đơn chuyển khoản đủ từ mức này thì shop freeship — xem `site.shipping` */
const FREESHIP_TU = 1_000_000;

/**
 * Thông tin cửa hàng — SỬA FILE NÀY để thay tên, liên hệ, mạng xã hội.
 * Không hardcode số điện thoại / địa chỉ ở bất kỳ component nào khác.
 */
export const site = {
  name: "KẸO GAMING SHOP",
  shortName: "KẸO",
  tagline: "Gear cũ & mới — nói đúng tình trạng",
  description:
    "Tiệm gaming gear ở Đà Nẵng — chuột, bàn phím, tai nghe và phụ kiện, cũ lẫn mới. Mỗi món ghi rõ tình trạng thật, cho test trước khi trả tiền. Hàng có sẵn tại Đà Nẵng.",

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
    // Ghim "Kẹo Gaming Gear" trên Google Maps — bấm vào địa chỉ là mở chỉ đường.
    mapUrl:
      "https://www.google.com/maps/place/K%E1%BA%B9o+Gaming+Gear/@15.9664034,108.2597601,17z/data=!3m1!4b1!4m6!3m5!1s0x314211d29a23ff35:0x1b74f0c6d9efd3ba!8m2!3d15.9664034!4d108.262335!16s%2Fg%2F11mzzxqtws",
    geo: { latitude: 15.9664034, longitude: 108.2623351 },
  },

  social: {
    facebook: "https://www.facebook.com/Viet.Vit.Dit.Zjt/",
    // Mở thẳng khung chat. Chủ shop trực Messenger thường xuyên hơn Zalo nên
    // các nút liên hệ ưu tiên Messenger, Zalo làm lựa chọn phụ.
    messenger: "https://m.me/Viet.Vit.Dit.Zjt",
    tiktok: "https://www.tiktok.com/@ngotdethuong",
    zalo: "https://zalo.me/0904505592",
  },

  /**
   * Vận chuyển.
   *
   * Chuyển khoản đủ, đơn từ 1 triệu: shop freeship (chủ shop chốt
   * 21/10/2026). Dưới mức đó, hoặc ship COD, khách trả phí ship theo thực tế,
   * shop không cộng thêm.
   *
   * Có NGƯỠNG là cố ý. Chính sách cũ "chuyển khoản đủ thì shop chịu ship"
   * không giới hạn giá trị đơn, bị bỏ ngày 2026-09-04 vì đơn nhỏ thì tiền lãi
   * không đủ bù cước.
   *
   * Ngoài mức freeship, KHÔNG ghi một con số phí ship cố định trên web: cước
   * Grab và cước nhà xe thay đổi theo quãng đường, theo tỉnh, theo từng nhà
   * xe. Thà nói "báo sau" còn hơn ghi một con số rồi thu khác.
   *
   * Khung chat AI dùng chung các số này. Backend ai-marketing-town đọc quy
   * tắc từ Google Sheet — đổi ở đây thì đổi luôn bên Sheet.
   */
  shipping: {
    ghiChu: `Chuyển khoản đủ từ ${FREESHIP_TU / 1_000_000} triệu được freeship. Dưới mức đó phí ship tính theo thực tế, tụi mình báo trước khi gửi.`,
    cocCod: 50_000,
    freeshipChuyenKhoanTu: FREESHIP_TU,
  },

  /**
   * Tài khoản nhận cọc COD / chuyển khoản đủ (chủ shop gửi 21/10/2026).
   * `ma` là mã ngân hàng theo chuẩn VietQR — dùng để vẽ mã QR. Backend chatbot
   * (ai-marketing-town) cũng khai đúng tài khoản này, đổi thì đổi cả hai.
   */
  nganHang: {
    ma: "VIB",
    soTaiKhoan: "904505592",
    chuTaiKhoan: "LUU QUOC VIET",
  },

  /**
   * Khung chat AI (src/components/ai-chatbox.tsx) gọi về backend chạy trên
   * Render — dự án riêng ai-marketing-town, không nằm trong repo này.
   */
  chatbot: {
    api: "https://keo-gaming-agent-town.onrender.com/api/public/chat",
    // Chỉ dùng khi đang chạy web ở máy mình (localhost)
    apiMayNha: "http://localhost:5173/api/public/chat",
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
 * Vẽ lại bằng: node scripts/tao-anh-bia.mjs <ảnh nền>
 *
 * TÊN FILE CÓ SỐ Ở CUỐI, VÀ PHẢI TĂNG SỐ MỖI KHI ĐỔI ẢNH.
 *
 * Facebook nhớ ảnh theo ĐƯỜNG DẪN chứ không theo nội dung file. Ghi đè lên
 * cùng một tên thì dù bấm "Thu thập lại" trong Sharing Debugger, nó vẫn lấy
 * bản đã tải về từ trước — đã dính đúng lỗi này ngày 2026-09-06: máy chủ trả
 * 200, thẻ og trỏ đúng file mới, mà thẻ xem trước vẫn hiện ảnh cũ.
 */
export const ANH_CHIA_SE = "/anh-chia-se-2.png";

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
