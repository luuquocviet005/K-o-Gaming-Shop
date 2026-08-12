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
} as const;
