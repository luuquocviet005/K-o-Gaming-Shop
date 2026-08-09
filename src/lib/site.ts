/**
 * Thông tin cửa hàng — SỬA FILE NÀY để thay tên, liên hệ, mạng xã hội.
 * Không hardcode số điện thoại / địa chỉ ở bất kỳ component nào khác.
 */
export const site = {
  name: "KẸO GAMING SHOP",
  shortName: "KẸO",
  tagline: "Gaming gear chính hãng — ngọt như kẹo",
  description:
    "KẸO GAMING SHOP — cửa hàng gaming gear chính hãng: chuột, bàn phím cơ, tai nghe, ghế gaming, tay cầm và màn hình. Bảo hành chính hãng, giao hàng toàn quốc, đổi trả 7 ngày.",

  // Đổi thành domain thật sau khi trỏ tên miền trên Hostinger
  url: "https://keogamingshop.com",

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

  /** Phí vận chuyển & ngưỡng miễn phí (đơn vị: VNĐ) */
  shipping: {
    fee: 30_000,
    freeThreshold: 2_000_000,
  },

  /** Mã giảm giá demo — chạy hoàn toàn phía trình duyệt */
  promoCodes: [
    { code: "KEO10", type: "percent" as const, value: 10, label: "Giảm 10%" },
    { code: "KEO50K", type: "amount" as const, value: 50_000, label: "Giảm 50.000₫" },
    { code: "FREESHIP", type: "shipping" as const, value: 0, label: "Miễn phí vận chuyển" },
  ],
} as const;

export type PromoCode = (typeof site.promoCodes)[number];
