/**
 * Kho dữ liệu sản phẩm.
 *
 * ĐỔI SANG SẢN PHẨM THẬT:
 *   1. Sửa / thêm object trong mảng `products` bên dưới.
 *   2. Ảnh thật: bỏ file vào `public/products/`, rồi set `image: "/products/ten-file.jpg"`.
 *      Nếu bỏ trống `image`, site tự vẽ minh hoạ vector theo danh mục + màu của sản phẩm.
 *   3. `slug` là đường dẫn (/san-pham/<slug>/) — không dùng dấu tiếng Việt, không khoảng trắng.
 */

export type CategorySlug =
  | "chuot"
  | "ban-phim"
  | "tai-nghe"
  | "ghe-gaming"
  | "tay-cam"
  | "man-hinh";

export type VariantOption = {
  id: string;
  name: string;
  /** Cộng thêm vào giá gốc (VNĐ). 0 = không đổi giá. */
  priceDelta: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  price: number;
  /** Giá gạch ngang. Bỏ trống nếu không giảm giá. */
  oldPrice?: number;
  rating: number;
  reviews: number;
  /** % người mua đánh giá tích cực */
  positive: number;
  sold: number;
  stock: number;
  isNew?: boolean;
  isHot?: boolean;
  /** Mã màu dùng cho minh hoạ vector khi chưa có ảnh thật */
  accent: string;
  image?: string;
  summary: string;
  description: string;
  highlights: string[];
  specs: { label: string; value: string }[];
  variantLabel?: string;
  variants?: VariantOption[];
};

/**
 * Bản rút gọn của Product, chỉ chứa những trường mà thẻ sản phẩm cần.
 *
 * Vì sao cần: `<ProductCard>` và `<ProductBrowser>` chạy phía trình duyệt, nên
 * mọi thứ truyền vào chúng đều bị serialize vào HTML. Truyền cả object đầy đủ
 * (mô tả dài, thông số, highlight) làm trang /danh-muc/ phình lên ~287KB. Dùng
 * bản rút gọn kéo xuống còn một phần nhỏ mà giao diện không đổi.
 */
export type CardProduct = Pick<
  Product,
  | "id"
  | "slug"
  | "name"
  | "brand"
  | "category"
  | "price"
  | "oldPrice"
  | "rating"
  | "sold"
  | "stock"
  | "isNew"
  | "isHot"
  | "accent"
  | "image"
> & { firstVariantId?: string };

export function toCard(p: Product): CardProduct {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    brand: p.brand,
    category: p.category,
    price: p.price,
    oldPrice: p.oldPrice,
    rating: p.rating,
    sold: p.sold,
    stock: p.stock,
    isNew: p.isNew,
    isHot: p.isHot,
    accent: p.accent,
    image: p.image,
    firstVariantId: p.variants?.[0]?.id,
  };
}

export type Category = {
  slug: CategorySlug;
  name: string;
  short: string;
  blurb: string;
};

export const categories: Category[] = [
  {
    slug: "chuot",
    name: "Chuột gaming",
    short: "Chuột",
    blurb: "Siêu nhẹ, sensor flagship, độ trễ gần như bằng không.",
  },
  {
    slug: "ban-phim",
    name: "Bàn phím cơ",
    short: "Bàn phím",
    blurb: "Hot-swap, gasket mount, switch cho cả game thủ lẫn dân gõ.",
  },
  {
    slug: "tai-nghe",
    name: "Tai nghe gaming",
    short: "Tai nghe",
    blurb: "Âm thanh vòm định vị chuẩn, mic khử ồn, đeo cả ngày không mỏi.",
  },
  {
    slug: "ghe-gaming",
    name: "Ghế gaming",
    short: "Ghế",
    blurb: "Tựa lưng công thái học, ngồi stream 8 tiếng vẫn thoải mái.",
  },
  {
    slug: "tay-cam",
    name: "Tay cầm chơi game",
    short: "Tay cầm",
    blurb: "Hall effect chống drift, kết nối đa nền tảng PC / console / mobile.",
  },
  {
    slug: "man-hinh",
    name: "Màn hình gaming",
    short: "Màn hình",
    blurb: "Tần số quét cao, phản hồi 1ms, màu chuẩn cho cả chơi lẫn làm.",
  },
];

export const products: Product[] = [
  // ─────────────────────────────── CHUỘT ───────────────────────────────
  {
    id: "m-01",
    slug: "logitech-g-pro-x-superlight-2",
    name: "Logitech G Pro X Superlight 2",
    brand: "Logitech G",
    category: "chuot",
    price: 3_190_000,
    oldPrice: 3_890_000,
    rating: 4.9,
    reviews: 412,
    positive: 97,
    sold: 1240,
    stock: 18,
    isHot: true,
    accent: "#111827",
    summary: "60g, sensor HERO 2 32K DPI, pin 95 giờ — chuẩn mực của chuột thi đấu.",
    description:
      "Phiên bản kế nhiệm của con chuột được nhiều tuyển thủ FPS chuyên nghiệp sử dụng nhất. Trọng lượng chỉ 60g nhưng khung vẫn cứng, không ọp ẹp. Sensor HERO 2 lên tới 32.000 DPI cùng switch quang LIGHTFORCE cho phản hồi tức thì mà vẫn giữ được cảm giác click cơ học quen thuộc. Pin dùng liên tục tới 95 giờ, sạc USB-C.",
    highlights: [
      "Trọng lượng 60g, vỏ nguyên khối không lỗ tổ ong",
      "Sensor HERO 2: 32.000 DPI, 888 IPS",
      "Switch lai quang – cơ LIGHTFORCE, 100 triệu lần nhấn",
      "Pin 95 giờ, sạc nhanh USB-C, hỗ trợ sạc không dây POWERPLAY",
    ],
    specs: [
      { label: "Kết nối", value: "LIGHTSPEED 2.4GHz không dây" },
      { label: "Sensor", value: "HERO 2, tối đa 32.000 DPI" },
      { label: "Trọng lượng", value: "60 g" },
      { label: "Thời lượng pin", value: "95 giờ" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
      { id: "hong", name: "Hồng", priceDelta: 100_000 },
    ],
  },
  {
    id: "m-02",
    slug: "razer-viper-v3-pro",
    name: "Razer Viper V3 Pro",
    brand: "Razer",
    category: "chuot",
    price: 3_490_000,
    oldPrice: 3_990_000,
    rating: 4.8,
    reviews: 328,
    positive: 96,
    sold: 890,
    stock: 12,
    isHot: true,
    accent: "#1f2937",
    summary:
      "Chuột không dây 54g, sensor Focus Pro 35K, polling 8000Hz, dáng đối xứng chuẩn thi đấu esports.",
    description:
      "Viper V3 Pro nhẹ 54g, dùng sensor Focus Pro 35K Gen-2 và switch quang thế hệ 3. Polling rate 8000Hz qua HyperPolling Wireless Dongle giúp con trỏ mượt hơn rõ rệt trên màn hình tần số quét cao.",
    highlights: [
      "Chỉ 54g — một trong những chuột không dây nhẹ nhất",
      "Sensor Focus Pro 35K Gen-2",
      "Polling rate 8000Hz với dongle HyperPolling",
      "Pin tới 95 giờ ở chế độ 1000Hz",
    ],
    specs: [
      { label: "Kết nối", value: "HyperSpeed Wireless / USB-C" },
      { label: "Sensor", value: "Focus Pro 35K Gen-2" },
      { label: "Trọng lượng", value: "54 g" },
      { label: "Polling rate", value: "Tối đa 8000 Hz" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "m-03",
    slug: "razer-deathadder-v3-pro",
    name: "Razer DeathAdder V3 Pro",
    brand: "Razer",
    category: "chuot",
    price: 2_690_000,
    oldPrice: 3_290_000,
    rating: 4.8,
    reviews: 502,
    positive: 95,
    sold: 1580,
    stock: 24,
    accent: "#0f172a",
    summary: "Dáng ergonomic huyền thoại, 63g, ôm tay cực tốt cho tay to.",
    description:
      "DeathAdder là dòng chuột ergonomic bán chạy nhất mọi thời đại của Razer. Bản V3 Pro giảm còn 63g, bỏ đèn RGB để tối ưu pin, giữ nguyên phần lưng cong ôm lòng bàn tay đặc trưng.",
    highlights: [
      "Thiết kế ergonomic thuận tay phải, hợp palm grip",
      "63g, sensor Focus Pro 30K",
      "Pin 90 giờ",
      "Switch quang Gen-3, 90 triệu lần nhấn",
    ],
    specs: [
      { label: "Kết nối", value: "HyperSpeed Wireless / USB-C" },
      { label: "Sensor", value: "Focus Pro 30K" },
      { label: "Trọng lượng", value: "63 g" },
      { label: "Kiểu cầm", value: "Palm / Hybrid" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "m-04",
    slug: "logitech-g502-x-plus",
    name: "Logitech G502 X Plus",
    brand: "Logitech G",
    category: "chuot",
    price: 2_290_000,
    oldPrice: 2_890_000,
    rating: 4.7,
    reviews: 674,
    positive: 94,
    sold: 2100,
    stock: 30,
    accent: "#334155",
    summary: "13 nút lập trình, con lăn siêu tốc, RGB LIGHTSYNC — vua MMO/MOBA.",
    description:
      "G502 X Plus giữ lại DNA của dòng G502 kinh điển: 13 nút có thể gán macro, con lăn kim loại chuyển hai chế độ (nấc và tự do), thêm dải LED LIGHTSYNC 8 vùng. Phù hợp game MOBA, MMO và cả công việc cần nhiều phím tắt.",
    highlights: [
      "13 nút lập trình được",
      "Con lăn hai chế độ HYPERSCROLL",
      "Sensor HERO 25K",
      "RGB LIGHTSYNC 8 vùng",
    ],
    specs: [
      { label: "Kết nối", value: "LIGHTSPEED không dây" },
      { label: "Sensor", value: "HERO 25K" },
      { label: "Trọng lượng", value: "106 g" },
      { label: "Số nút", value: "13" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "m-05",
    slug: "pulsar-x2v2-mini",
    name: "Pulsar X2V2 Mini",
    brand: "Pulsar",
    category: "chuot",
    price: 1_890_000,
    rating: 4.7,
    reviews: 156,
    positive: 95,
    sold: 420,
    stock: 15,
    isNew: true,
    accent: "#dc2626",
    summary: "51g, size nhỏ cho claw/fingertip grip, giá dễ chịu.",
    description:
      "X2V2 Mini là lựa chọn được cộng đồng FPS đánh giá rất cao trong tầm giá. Vỏ nhám nhẹ tay, size mini hợp người tay nhỏ hoặc cầm kiểu claw. Sensor PAW3395 cho tracking chính xác trên hầu hết mọi pad.",
    highlights: [
      "51g, size mini (114 × 58 mm)",
      "Sensor PAW3395",
      "Switch Kailh GM 8.0",
      "Chân chuột PTFE 100% nguyên chất",
    ],
    specs: [
      { label: "Kết nối", value: "2.4GHz không dây / USB-C" },
      { label: "Sensor", value: "PixArt PAW3395" },
      { label: "Trọng lượng", value: "51 g" },
      { label: "Kích thước", value: "Mini" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "do", name: "Đỏ", priceDelta: 0 },
      { id: "xanh", name: "Xanh mint", priceDelta: 0 },
    ],
  },
  {
    id: "m-06",
    slug: "corsair-m75-air",
    name: "Corsair M75 Air",
    brand: "Corsair",
    category: "chuot",
    price: 2_190_000,
    oldPrice: 2_590_000,
    rating: 4.6,
    reviews: 198,
    positive: 92,
    sold: 530,
    stock: 9,
    accent: "#f8fafc",
    summary: "60g, thân thiện cả tay trái tay phải, pin 100 giờ.",
    description:
      "M75 Air nhắm tới người chơi FPS muốn một con chuột nhẹ nhưng không bị 'rỗng'. Thiết kế đối xứng, chỉ 2 nút phụ để giảm nhầm lẫn khi thi đấu.",
    highlights: [
      "60g, thiết kế đối xứng",
      "Sensor Marksman 26K",
      "Pin lên tới 100 giờ",
      "Switch quang học Corsair",
    ],
    specs: [
      { label: "Kết nối", value: "SLIPSTREAM 2.4GHz / Bluetooth" },
      { label: "Sensor", value: "Marksman 26K" },
      { label: "Trọng lượng", value: "60 g" },
      { label: "Thời lượng pin", value: "100 giờ" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "trang", name: "Trắng", priceDelta: 0 },
      { id: "den", name: "Đen", priceDelta: 0 },
    ],
  },

  // ────────────────────────────── BÀN PHÍM ──────────────────────────────
  {
    id: "k-01",
    slug: "keychron-q1-pro",
    name: "Keychron Q1 Pro",
    brand: "Keychron",
    category: "ban-phim",
    price: 4_590_000,
    oldPrice: 5_290_000,
    rating: 4.9,
    reviews: 287,
    positive: 98,
    sold: 640,
    stock: 11,
    isHot: true,
    accent: "#475569",
    summary: "Khung nhôm CNC, gasket mount, hot-swap, QMK/VIA — gõ như custom.",
    description:
      "Q1 Pro là bàn phím 75% khung nhôm nguyên khối, gasket mount cùng nhiều lớp tiêu âm cho tiếng gõ trầm, đầm. Hỗ trợ hot-swap nên đổi switch không cần hàn, và tuỳ biến toàn bộ layout bằng QMK/VIA. Kết nối Bluetooth 5.1 cho tới 3 thiết bị.",
    highlights: [
      "Khung nhôm CNC 1.6kg, gasket mount",
      "Hot-swap 3 chân & 5 chân, không cần hàn",
      "QMK/VIA — remap mọi phím, lưu ngay trên phím",
      "Bluetooth 5.1 kết nối 3 thiết bị + USB-C",
    ],
    specs: [
      { label: "Layout", value: "75% (82 phím)" },
      { label: "Kết cấu", value: "Gasket mount, khung nhôm" },
      { label: "Kết nối", value: "Bluetooth 5.1 / USB-C" },
      { label: "Keycap", value: "PBT double-shot OSA profile" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variantLabel: "Loại switch",
    variants: [
      { id: "red", name: "Red (linear, êm)", priceDelta: 0 },
      { id: "brown", name: "Brown (tactile, khấc nhẹ)", priceDelta: 0 },
      { id: "banana", name: "Banana (tactile đầm)", priceDelta: 150_000 },
    ],
  },
  {
    id: "k-02",
    slug: "wooting-60he-plus",
    name: "Wooting 60HE+",
    brand: "Wooting",
    category: "ban-phim",
    price: 5_290_000,
    rating: 4.9,
    reviews: 174,
    positive: 99,
    sold: 310,
    stock: 6,
    isNew: true,
    isHot: true,
    accent: "#0f172a",
    summary: "Switch từ tính, chỉnh điểm nhận phím 0.1–4.0mm, Rapid Trigger.",
    description:
      "Bàn phím analog dùng switch Hall effect Lekker. Bạn tự đặt điểm nhận phím từ 0.1mm tới 4.0mm và bật Rapid Trigger — reset phím ngay khi nhả, cực lợi trong các game FPS cần strafe liên tục. Đây là bàn phím được rất nhiều tuyển thủ Valorant/CS2 chuyển sang dùng.",
    highlights: [
      "Switch Hall effect Lekker — không tiếp điểm cơ học, bền hơn",
      "Rapid Trigger + điểm nhận phím tuỳ chỉnh 0.1–4.0mm",
      "Nhập liệu analog như tay cầm (đi bộ / chạy theo lực nhấn)",
      "Độ trễ thuộc nhóm thấp nhất thị trường",
    ],
    specs: [
      { label: "Layout", value: "60%" },
      { label: "Switch", value: "Lekker Linear45 (Hall effect)" },
      { label: "Kết nối", value: "USB-C" },
      { label: "Tính năng", value: "Rapid Trigger, analog input" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
  },
  {
    id: "k-03",
    slug: "akko-mod007b-v3",
    name: "Akko MOD007B V3",
    brand: "Akko",
    category: "ban-phim",
    price: 2_490_000,
    oldPrice: 2_990_000,
    rating: 4.7,
    reviews: 356,
    positive: 94,
    sold: 980,
    stock: 22,
    accent: "#8b5cf6",
    summary: "75% gasket, hot-swap, tiếng gõ 'thocky' ngon trong tầm giá.",
    description:
      "MOD007B V3 là lựa chọn quốc dân cho người mới bước vào bàn phím custom: đã lube sẵn, có foam tiêu âm, gasket mount và hot-swap — tất cả ở mức giá dưới 3 triệu.",
    highlights: [
      "Gasket mount + 3 lớp foam tiêu âm",
      "Hot-swap 5 chân",
      "Switch đã lube sẵn từ nhà máy",
      "Keycap PBT Cherry profile",
    ],
    specs: [
      { label: "Layout", value: "75%" },
      { label: "Kết nối", value: "Bluetooth 5.0 / 2.4GHz / USB-C" },
      { label: "Keycap", value: "PBT double-shot Cherry profile" },
      { label: "Pin", value: "3600 mAh" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variantLabel: "Loại switch",
    variants: [
      { id: "cs-jelly", name: "CS Jelly Pink (linear)", priceDelta: 0 },
      { id: "cs-crystal", name: "CS Crystal (linear trong)", priceDelta: 0 },
      { id: "cs-lavender", name: "CS Lavender (tactile)", priceDelta: 0 },
    ],
  },
  {
    id: "k-04",
    slug: "razer-huntsman-v3-pro-tkl",
    name: "Razer Huntsman V3 Pro TKL",
    brand: "Razer",
    category: "ban-phim",
    price: 4_890_000,
    oldPrice: 5_490_000,
    rating: 4.8,
    reviews: 212,
    positive: 95,
    sold: 470,
    stock: 8,
    accent: "#111827",
    summary: "Switch quang analog, Rapid Trigger, kê tay da — bản TKL.",
    description:
      "Huntsman V3 Pro dùng switch quang analog thế hệ 2 với điểm nhận phím chỉnh được từ 0.1 tới 4.0mm và Rapid Trigger. Vỏ nhôm, keycap PBT doubleshot, kèm kê tay bọc da từ tính.",
    highlights: [
      "Switch quang analog Gen-2, Rapid Trigger",
      "Điểm nhận phím tuỳ chỉnh 0.1–4.0mm",
      "Vỏ nhôm, keycap PBT doubleshot",
      "Kê tay bọc da nam châm đi kèm",
    ],
    specs: [
      { label: "Layout", value: "TKL (87 phím)" },
      { label: "Switch", value: "Razer Analog Optical Gen-2" },
      { label: "Kết nối", value: "USB-C tháo rời" },
      { label: "Polling rate", value: "8000 Hz" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    id: "k-05",
    slug: "logitech-g-pro-x-tkl-lightspeed",
    name: "Logitech G Pro X TKL Lightspeed",
    brand: "Logitech G",
    category: "ban-phim",
    price: 3_990_000,
    oldPrice: 4_690_000,
    rating: 4.7,
    reviews: 189,
    positive: 93,
    sold: 520,
    stock: 14,
    accent: "#1e293b",
    summary:
      "Bàn phím cơ TKL không dây LIGHTSPEED, pin 50 giờ, có núm xoay âm lượng — gọn để mang đi thi đấu.",
    description:
      "Bàn phím TKL không dây được thiết kế cho tuyển thủ: nhỏ gọn, cáp rời, có khoá vận chuyển và pin 50 giờ. Nút media riêng và núm xoay âm lượng ở góc phải.",
    highlights: [
      "LIGHTSPEED không dây, pin 50 giờ",
      "Layout TKL gọn, dễ mang theo",
      "Núm xoay âm lượng + phím media riêng",
      "Keycap PBT, RGB LIGHTSYNC từng phím",
    ],
    specs: [
      { label: "Layout", value: "TKL" },
      { label: "Kết nối", value: "LIGHTSPEED / Bluetooth / USB-C" },
      { label: "Switch", value: "GX Tactile / Linear / Clicky" },
      { label: "Pin", value: "50 giờ" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Loại switch",
    variants: [
      { id: "linear", name: "GX Linear", priceDelta: 0 },
      { id: "tactile", name: "GX Tactile", priceDelta: 0 },
      { id: "clicky", name: "GX Clicky", priceDelta: 0 },
    ],
  },
  {
    id: "k-06",
    slug: "leopold-fc750r-pd",
    name: "Leopold FC750R PD",
    brand: "Leopold",
    category: "ban-phim",
    price: 2_990_000,
    rating: 4.8,
    reviews: 143,
    positive: 96,
    sold: 380,
    stock: 7,
    accent: "#f1f5f9",
    summary: "Keycap PBT dày, build chắc nịch, huyền thoại của dân gõ.",
    description:
      "FC750R nổi tiếng nhờ chất lượng hoàn thiện và bộ keycap PBT dye-sub dày dặn, dùng nhiều năm không bóng. Không RGB, không phần mềm — chỉ tập trung vào cảm giác gõ.",
    highlights: [
      "Keycap PBT dye-sub dày, không bóng theo thời gian",
      "Switch Cherry MX chính hãng Đức",
      "Vỏ dày, gõ chắc tay, gần như không flex",
      "DIP switch đổi layout ngay trên phím",
    ],
    specs: [
      { label: "Layout", value: "TKL" },
      { label: "Switch", value: "Cherry MX" },
      { label: "Keycap", value: "PBT dye-sub" },
      { label: "Kết nối", value: "USB-C tháo rời" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variantLabel: "Loại switch",
    variants: [
      { id: "mx-red", name: "Cherry MX Red", priceDelta: 0 },
      { id: "mx-brown", name: "Cherry MX Brown", priceDelta: 0 },
      { id: "mx-silent", name: "Cherry MX Silent Red", priceDelta: 200_000 },
    ],
  },

  // ────────────────────────────── TAI NGHE ──────────────────────────────
  {
    id: "h-01",
    slug: "steelseries-arctis-nova-pro-wireless",
    name: "SteelSeries Arctis Nova Pro Wireless",
    brand: "SteelSeries",
    category: "tai-nghe",
    price: 8_490_000,
    oldPrice: 9_990_000,
    rating: 4.9,
    reviews: 264,
    positive: 97,
    sold: 410,
    stock: 5,
    isHot: true,
    accent: "#0f172a",
    summary: "Base station DAC, 2 pin đổi nóng, chống ồn chủ động — flagship thật sự.",
    description:
      "Nova Pro Wireless đi kèm base station tích hợp DAC/AMP, cho phép kết nối đồng thời PC và console rồi chuyển qua lại bằng một nút. Hệ thống hai viên pin đổi nóng nghĩa là bạn không bao giờ phải dừng chơi để sạc. Chống ồn chủ động 4 mic.",
    highlights: [
      "Base station DAC/AMP, chuyển nguồn phát tức thì",
      "Hai viên pin đổi nóng — dùng vô tận",
      "Chống ồn chủ động 4 micro",
      "Driver Neodymium 40mm, Hi-Res chứng nhận",
    ],
    specs: [
      { label: "Kết nối", value: "2.4GHz + Bluetooth 5.0 đồng thời" },
      { label: "Driver", value: "40 mm Neodymium" },
      { label: "Micro", value: "ClearCast Gen 2, khử ồn AI" },
      { label: "Pin", value: "2 × 22 giờ, đổi nóng" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "h-02",
    slug: "razer-blackshark-v2-pro",
    name: "Razer BlackShark V2 Pro (2023)",
    brand: "Razer",
    category: "tai-nghe",
    price: 4_490_000,
    oldPrice: 5_290_000,
    rating: 4.8,
    reviews: 391,
    positive: 96,
    sold: 870,
    stock: 16,
    isHot: true,
    accent: "#1f2937",
    summary: "Định vị bước chân cực chuẩn, nhẹ 320g, pin 70 giờ.",
    description:
      "Được thiết kế riêng cho FPS: driver TriForce Titanium 50mm tách rõ ba dải tần giúp nghe bước chân và tiếng thay đạn rất rõ. Đệm tai memory foam bọc vải mát, đeo lâu không bí.",
    highlights: [
      "Driver TriForce Titanium 50mm",
      "Mic HyperClear Super Wideband tháo rời",
      "Pin 70 giờ",
      "320g, đệm tai vải thoáng khí",
    ],
    specs: [
      { label: "Kết nối", value: "HyperSpeed 2.4GHz / Bluetooth" },
      { label: "Driver", value: "50 mm TriForce Titanium" },
      { label: "Trọng lượng", value: "320 g" },
      { label: "Pin", value: "70 giờ" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "h-03",
    slug: "hyperx-cloud-iii-wireless",
    name: "HyperX Cloud III Wireless",
    brand: "HyperX",
    category: "tai-nghe",
    price: 2_990_000,
    oldPrice: 3_590_000,
    rating: 4.8,
    reviews: 518,
    positive: 95,
    sold: 1420,
    stock: 27,
    accent: "#dc2626",
    summary: "Pin 120 giờ, đệm memory foam huyền thoại — êm nhất tầm giá.",
    description:
      "Dòng Cloud nổi tiếng nhờ độ êm khi đeo lâu, và Cloud III giữ nguyên điều đó. Pin 120 giờ là con số hiếm có. Driver 53mm góc nghiêng cho âm trường rộng hơn thế hệ trước.",
    highlights: [
      "Pin lên tới 120 giờ",
      "Đệm tai memory foam bọc da, khung nhôm",
      "Driver 53mm đặt nghiêng",
      "Mic 10mm có đèn báo tắt tiếng",
    ],
    specs: [
      { label: "Kết nối", value: "2.4GHz không dây / USB-C" },
      { label: "Driver", value: "53 mm góc nghiêng" },
      { label: "Pin", value: "120 giờ" },
      { label: "Trọng lượng", value: "340 g" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den-do", name: "Đen – Đỏ", priceDelta: 0 },
      { id: "den", name: "Đen tuyền", priceDelta: 0 },
    ],
  },
  {
    id: "h-04",
    slug: "logitech-g-pro-x-2-lightspeed",
    name: "Logitech G Pro X 2 Lightspeed",
    brand: "Logitech G",
    category: "tai-nghe",
    price: 4_990_000,
    oldPrice: 5_690_000,
    rating: 4.7,
    reviews: 236,
    positive: 93,
    sold: 490,
    stock: 10,
    accent: "#0f172a",
    summary: "Driver graphene 50mm, khung kim loại, 3 chế độ kết nối.",
    description:
      "Bản nâng cấp của tai nghe được nhiều đội tuyển sử dụng. Driver graphene cho dải cao chi tiết mà không chói. Kết nối được cả LIGHTSPEED, Bluetooth và jack 3.5mm.",
    highlights: [
      "Driver graphene 50mm",
      "3 chế độ: LIGHTSPEED / Bluetooth / 3.5mm",
      "Khung kim loại, đệm da + nhung đi kèm",
      "Pin 50 giờ",
    ],
    specs: [
      { label: "Kết nối", value: "LIGHTSPEED / Bluetooth / 3.5mm" },
      { label: "Driver", value: "50 mm graphene" },
      { label: "Pin", value: "50 giờ" },
      { label: "Trọng lượng", value: "345 g" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den", name: "Đen", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
      { id: "hong", name: "Hồng", priceDelta: 0 },
    ],
  },
  {
    id: "h-05",
    slug: "corsair-hs80-max",
    name: "Corsair HS80 Max Wireless",
    brand: "Corsair",
    category: "tai-nghe",
    price: 3_490_000,
    rating: 4.6,
    reviews: 167,
    positive: 91,
    sold: 350,
    stock: 13,
    accent: "#64748b",
    summary: "Dolby Atmos, khung nhôm, mic broadcast chất lượng cao.",
    description:
      "HS80 Max hỗ trợ Dolby Atmos cho âm thanh vòm, mic omnidirectional cho chất giọng dày và rõ khi stream. Khung nhôm với dải đỡ đầu tự điều chỉnh.",
    highlights: [
      "Dolby Atmos âm thanh vòm",
      "Mic omnidirectional chuẩn broadcast",
      "Khung nhôm, dải đỡ đầu tự chỉnh",
      "Kết nối SLIPSTREAM + Bluetooth",
    ],
    specs: [
      { label: "Kết nối", value: "SLIPSTREAM 2.4GHz / Bluetooth" },
      { label: "Driver", value: "50 mm Neodymium" },
      { label: "Pin", value: "65 giờ" },
      { label: "Âm thanh vòm", value: "Dolby Atmos" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "xam", name: "Xám thép", priceDelta: 0 },
      { id: "trang", name: "Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "h-06",
    slug: "sony-inzone-h9",
    name: "Sony INZONE H9",
    brand: "Sony",
    category: "tai-nghe",
    price: 5_490_000,
    oldPrice: 6_490_000,
    rating: 4.6,
    reviews: 121,
    positive: 90,
    sold: 220,
    stock: 4,
    accent: "#e2e8f0",
    summary: "Chống ồn chủ động của Sony, 360 Spatial Sound, đệm siêu êm.",
    description:
      "INZONE H9 mang công nghệ chống ồn từ dòng WH-1000X sang tai nghe gaming. 360 Spatial Sound for Gaming định vị âm thanh trong không gian 3D. Đệm tai polyurethane mềm, đeo rất nhẹ đầu.",
    highlights: [
      "Chống ồn chủ động công nghệ Sony",
      "360 Spatial Sound for Gaming",
      "Pin 32 giờ (bật ANC)",
      "Tối ưu riêng cho PlayStation 5",
    ],
    specs: [
      { label: "Kết nối", value: "2.4GHz / Bluetooth 5.2" },
      { label: "Driver", value: "40 mm" },
      { label: "Chống ồn", value: "ANC chủ động" },
      { label: "Pin", value: "32 giờ (ANC bật)" },
      { label: "Bảo hành", value: "12 tháng chính hãng" },
    ],
  },

  // ──────────────────────────── GHẾ GAMING ────────────────────────────
  {
    id: "c-01",
    slug: "secretlab-titan-evo-2024",
    name: "Secretlab TITAN Evo 2024",
    brand: "Secretlab",
    category: "ghe-gaming",
    price: 14_900_000,
    oldPrice: 17_900_000,
    rating: 4.9,
    reviews: 342,
    positive: 97,
    sold: 280,
    stock: 6,
    isHot: true,
    accent: "#111827",
    summary: "Tựa lưng thắt lưng tích hợp 4 chiều, mút lạnh đúc — ghế gaming tốt nhất hiện tại.",
    description:
      "TITAN Evo được đánh giá là ghế gaming hoàn thiện nhất trên thị trường. Hệ thống nâng đỡ thắt lưng 4 chiều nằm bên trong lưng ghế (không phải gối rời), mút lạnh đúc giữ form nhiều năm, kê tay CloudSwap 4D nam châm đổi được.",
    highlights: [
      "Nâng đỡ thắt lưng 4 chiều tích hợp trong lưng ghế",
      "Mút lạnh đúc nguyên khối, không xẹp",
      "Kê tay CloudSwap 4D gắn nam châm",
      "Ngả lưng 165°, khung thép nguyên khối",
    ],
    specs: [
      { label: "Chiều cao phù hợp", value: "160 – 189 cm" },
      { label: "Tải trọng", value: "130 kg" },
      { label: "Chất liệu", value: "NEO Hybrid Leatherette / SoftWeave Plus" },
      { label: "Ngả lưng", value: "85° – 165°" },
      { label: "Bảo hành", value: "5 năm mở rộng" },
    ],
    variantLabel: "Chất liệu & màu",
    variants: [
      { id: "leather-black", name: "Da NEO – Đen Stealth", priceDelta: 0 },
      { id: "softweave-green", name: "Vải SoftWeave – Xanh lá", priceDelta: 900_000 },
      { id: "softweave-ash", name: "Vải SoftWeave – Xám Ash", priceDelta: 900_000 },
    ],
  },
  {
    id: "c-02",
    slug: "corsair-tc100-relaxed",
    name: "Corsair TC100 Relaxed",
    brand: "Corsair",
    category: "ghe-gaming",
    price: 5_490_000,
    oldPrice: 6_990_000,
    rating: 4.6,
    reviews: 214,
    positive: 91,
    sold: 460,
    stock: 12,
    accent: "#334155",
    summary:
      "Ghế gaming lưng cao thoáng khí, ngả 160°, kê tay 4D, kèm gối cổ và gối lưng — giá vừa túi tiền.",
    description:
      "TC100 Relaxed dùng lưng ghế cao và đệm ngồi dày, phù hợp người dùng phổ thông muốn ghế gaming tốt mà không phải chi quá nhiều. Bản vải mềm thoáng, hợp khí hậu nóng ẩm.",
    highlights: [
      "Ngả lưng tới 160°",
      "Đệm ngồi dày, gối cổ + gối lưng đi kèm",
      "Kê tay 4D",
      "Piston khí hạng 4",
    ],
    specs: [
      { label: "Chiều cao phù hợp", value: "165 – 185 cm" },
      { label: "Tải trọng", value: "120 kg" },
      { label: "Ngả lưng", value: "90° – 160°" },
      { label: "Kê tay", value: "4D" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
    variantLabel: "Chất liệu",
    variants: [
      { id: "vai", name: "Vải thoáng khí", priceDelta: 0 },
      { id: "da", name: "Da PU", priceDelta: 300_000 },
    ],
  },
  {
    id: "c-03",
    slug: "e-dra-hercules-ec367",
    name: "E-Dra Hercules EC367",
    brand: "E-Dra",
    category: "ghe-gaming",
    price: 3_290_000,
    oldPrice: 3_990_000,
    rating: 4.4,
    reviews: 486,
    positive: 88,
    sold: 1150,
    stock: 20,
    accent: "#dc2626",
    summary: "Lựa chọn quốc dân dưới 4 triệu, lắp đặt dễ, bảo hành tại Việt Nam.",
    description:
      "Mẫu ghế bán chạy nhất của E-Dra tại Việt Nam. Khung thép, đệm mút đúc, ngả 180° và có kê chân rút. Ưu điểm lớn nhất là hệ thống bảo hành ngay trong nước.",
    highlights: [
      "Ngả lưng 180°, có kê chân rút",
      "Khung thép, đệm mút đúc",
      "Tải trọng 130kg",
      "Bảo hành và thay thế linh kiện tại Việt Nam",
    ],
    specs: [
      { label: "Chiều cao phù hợp", value: "160 – 185 cm" },
      { label: "Tải trọng", value: "130 kg" },
      { label: "Ngả lưng", value: "90° – 180°" },
      { label: "Chất liệu", value: "Da PU cao cấp" },
      { label: "Bảo hành", value: "24 tháng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den-do", name: "Đen – Đỏ", priceDelta: 0 },
      { id: "den-xanh", name: "Đen – Xanh", priceDelta: 0 },
      { id: "den-trang", name: "Đen – Trắng", priceDelta: 0 },
    ],
  },
  {
    id: "c-04",
    slug: "warrior-flash-series-wgc207",
    name: "Warrior Flash Series WGC207",
    brand: "Warrior",
    category: "ghe-gaming",
    price: 2_690_000,
    rating: 4.3,
    reviews: 312,
    positive: 86,
    sold: 780,
    stock: 18,
    accent: "#f59e0b",
    summary:
      "Ghế gaming phổ thông gọn nhẹ, ngả 155°, bánh xe êm không xước sàn — hợp phòng nhỏ và bàn học.",
    description:
      "Bản Flash Series có kích thước gọn hơn ghế gaming truyền thống, phù hợp phòng nhỏ hoặc người dùng dưới 1m75. Vẫn đầy đủ ngả lưng, kê tay và bánh xe êm.",
    highlights: [
      "Kích thước gọn, hợp phòng nhỏ",
      "Ngả lưng 155°",
      "Bánh xe nylon êm, không xước sàn",
      "Lắp đặt trong 20 phút",
    ],
    specs: [
      { label: "Chiều cao phù hợp", value: "155 – 175 cm" },
      { label: "Tải trọng", value: "110 kg" },
      { label: "Ngả lưng", value: "90° – 155°" },
      { label: "Kê tay", value: "2D" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "den-xam", name: "Đen – Xám", priceDelta: 0 },
      { id: "den-cam", name: "Đen – Cam", priceDelta: 0 },
    ],
  },
  {
    id: "c-05",
    slug: "dxracer-craft-series",
    name: "DXRacer Craft Series",
    brand: "DXRacer",
    category: "ghe-gaming",
    price: 8_990_000,
    oldPrice: 10_490_000,
    rating: 4.7,
    reviews: 128,
    positive: 93,
    sold: 190,
    stock: 5,
    accent: "#0ea5e9",
    summary: "Thương hiệu ghế gaming lâu đời nhất, khung chắc, hoàn thiện tốt.",
    description:
      "DXRacer là hãng đã định hình khái niệm ghế gaming. Dòng Craft dùng da microfiber mềm, khung thép dày và cơ cấu ngả có khoá nhiều nấc.",
    highlights: [
      "Da microfiber mềm, thoáng hơn da PU thường",
      "Khung thép dày, tải trọng 120kg",
      "Kê tay 4D nhôm",
      "Cơ cấu ngả khoá nhiều nấc",
    ],
    specs: [
      { label: "Chiều cao phù hợp", value: "165 – 190 cm" },
      { label: "Tải trọng", value: "120 kg" },
      { label: "Chất liệu", value: "Da microfiber" },
      { label: "Kê tay", value: "4D nhôm" },
      { label: "Bảo hành", value: "36 tháng" },
    ],
  },
  {
    id: "c-06",
    slug: "andaseat-kaiser-4",
    name: "AndaSeat Kaiser 4",
    brand: "AndaSeat",
    category: "ghe-gaming",
    price: 11_490_000,
    oldPrice: 13_490_000,
    rating: 4.7,
    reviews: 96,
    positive: 92,
    sold: 140,
    stock: 3,
    isNew: true,
    accent: "#7c3aed",
    summary: "Tựa lưng magnetic, đệm gel làm mát, dành cho người ngồi lâu.",
    description:
      "Kaiser 4 tập trung vào người ngồi 8–10 tiếng/ngày: đệm ngồi có lớp gel làm mát, gối lưng nam châm chỉnh cao thấp, và lưng ghế rộng hơn mức trung bình.",
    highlights: [
      "Đệm ngồi gel làm mát",
      "Gối lưng nam châm chỉnh được độ cao",
      "Kê tay 5D",
      "Lưng ghế rộng, hợp người vai to",
    ],
    specs: [
      { label: "Chiều cao phù hợp", value: "170 – 195 cm" },
      { label: "Tải trọng", value: "150 kg" },
      { label: "Ngả lưng", value: "90° – 160°" },
      { label: "Kê tay", value: "5D" },
      { label: "Bảo hành", value: "5 năm" },
    ],
  },

  // ───────────────────────────── TAY CẦM ─────────────────────────────
  {
    id: "g-01",
    slug: "sony-dualsense-edge",
    name: "Sony DualSense Edge",
    brand: "Sony",
    category: "tay-cam",
    price: 5_490_000,
    oldPrice: 5_990_000,
    rating: 4.7,
    reviews: 218,
    positive: 92,
    sold: 340,
    stock: 7,
    isHot: true,
    accent: "#f8fafc",
    summary: "Tay cầm pro của PS5: analog thay được, nút back, lưu 4 profile.",
    description:
      "DualSense Edge cho phép thay module cần analog khi bị drift, gắn nút back, đổi nắp cần và lưu tới 4 profile cài đặt. Vẫn giữ nguyên phản hồi xúc giác và cò thích ứng đặc trưng của DualSense.",
    highlights: [
      "Module cần analog thay thế được — hết lo drift",
      "Nút back tháo lắp, 2 kiểu",
      "Lưu 4 profile, chuyển nhanh trong game",
      "Phản hồi xúc giác + cò thích ứng",
    ],
    specs: [
      { label: "Nền tảng", value: "PlayStation 5, PC" },
      { label: "Kết nối", value: "Bluetooth / USB-C" },
      { label: "Pin", value: "~6 giờ" },
      { label: "Phụ kiện", value: "Hộp đựng, 3 cặp nắp cần, 2 kiểu nút back" },
      { label: "Bảo hành", value: "12 tháng chính hãng" },
    ],
  },
  {
    id: "g-02",
    slug: "xbox-wireless-controller",
    name: "Xbox Wireless Controller",
    brand: "Microsoft",
    category: "tay-cam",
    price: 1_590_000,
    oldPrice: 1_890_000,
    rating: 4.8,
    reviews: 764,
    positive: 96,
    sold: 2340,
    stock: 35,
    isHot: true,
    accent: "#16a34a",
    summary: "Tương thích tốt nhất với PC, cầm êm, bền — lựa chọn an toàn nhất.",
    description:
      "Tay cầm Xbox là chuẩn mực tương thích trên PC: cắm là chạy, gần như mọi game đều nhận. Grip nhám ở lưng và cò, D-pad dạng đĩa lai, có jack 3.5mm cắm tai nghe.",
    highlights: [
      "Tương thích PC gần như tuyệt đối",
      "Bluetooth kết nối PC / điện thoại / tablet",
      "Grip nhám ở lưng và cò",
      "Jack 3.5mm cắm tai nghe trực tiếp",
    ],
    specs: [
      { label: "Nền tảng", value: "Xbox, PC, Android, iOS" },
      { label: "Kết nối", value: "Bluetooth / Xbox Wireless / USB-C" },
      { label: "Nguồn", value: "2 pin AA hoặc pin sạc rời" },
      { label: "Trọng lượng", value: "287 g" },
      { label: "Bảo hành", value: "12 tháng chính hãng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "carbon", name: "Carbon Black", priceDelta: 0 },
      { id: "robot", name: "Robot White", priceDelta: 0 },
      { id: "velocity", name: "Velocity Green", priceDelta: 100_000 },
      { id: "pulse", name: "Pulse Red", priceDelta: 100_000 },
    ],
  },
  {
    id: "g-03",
    slug: "8bitdo-ultimate-2c",
    name: "8BitDo Ultimate 2C Wireless",
    brand: "8BitDo",
    category: "tay-cam",
    price: 890_000,
    rating: 4.6,
    reviews: 412,
    positive: 93,
    sold: 1080,
    stock: 26,
    accent: "#22c55e",
    summary: "Cần analog Hall effect chống drift, giá chưa tới 1 triệu.",
    description:
      "Tay cầm giá rẻ nhưng đã dùng cần analog Hall effect — công nghệ chống drift thường chỉ có ở tay cầm đắt tiền. Kèm phần mềm remap nút và chỉnh vùng chết.",
    highlights: [
      "Cần analog Hall effect — không bị drift",
      "Pin 25 giờ",
      "Phần mềm remap nút, chỉnh vùng chết",
      "Hai nút back sau lưng",
    ],
    specs: [
      { label: "Nền tảng", value: "PC (Windows), Android, Steam Deck" },
      { label: "Kết nối", value: "2.4GHz / Bluetooth / USB-C" },
      { label: "Cần analog", value: "Hall effect" },
      { label: "Pin", value: "25 giờ" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
    variantLabel: "Màu sắc",
    variants: [
      { id: "trang", name: "Trắng", priceDelta: 0 },
      { id: "tim", name: "Tím", priceDelta: 0 },
      { id: "xanh", name: "Xanh mint", priceDelta: 0 },
    ],
  },
  {
    id: "g-04",
    slug: "flydigi-apex-4",
    name: "Flydigi Apex 4",
    brand: "Flydigi",
    category: "tay-cam",
    price: 1_690_000,
    oldPrice: 1_990_000,
    rating: 4.5,
    reviews: 187,
    positive: 89,
    sold: 420,
    stock: 14,
    accent: "#3b82f6",
    summary: "Đa nền tảng, 6 nút back, hỗ trợ giả lập bàn phím chuột cho mobile.",
    description:
      "Apex 4 là lựa chọn được cộng đồng game mobile ưa chuộng nhờ chế độ giả lập phím chuột, cho phép chơi game mobile bằng tay cầm. Có tới 6 nút back và mô-tơ rung tuyến tính.",
    highlights: [
      "6 nút back lập trình được",
      "Giả lập bàn phím chuột cho game mobile",
      "Mô-tơ rung tuyến tính",
      "Cần analog Hall effect",
    ],
    specs: [
      { label: "Nền tảng", value: "PC, Android, iOS, Switch" },
      { label: "Kết nối", value: "2.4GHz / Bluetooth / USB-C" },
      { label: "Nút back", value: "6" },
      { label: "Pin", value: "20 giờ" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
  },
  {
    id: "g-05",
    slug: "razer-wolverine-v3-pro",
    name: "Razer Wolverine V3 Pro",
    brand: "Razer",
    category: "tay-cam",
    price: 5_990_000,
    rating: 4.6,
    reviews: 84,
    positive: 90,
    sold: 130,
    stock: 4,
    isNew: true,
    accent: "#111827",
    summary: "Tay cầm thi đấu: nút mecha-tactile, 8 nút phụ, polling 1000Hz.",
    description:
      "Wolverine V3 Pro dùng nút mecha-tactile phản hồi nhanh hơn nút cao su thường, cùng 8 nút phụ có thể remap. Cò có khoá hành trình ngắn cho game bắn súng.",
    highlights: [
      "Nút mặt mecha-tactile phản hồi nhanh",
      "8 nút phụ remap được",
      "Cò khoá hành trình ngắn",
      "Polling rate 1000Hz không dây",
    ],
    specs: [
      { label: "Nền tảng", value: "Xbox Series X|S, PC" },
      { label: "Kết nối", value: "HyperSpeed 2.4GHz / USB-C" },
      { label: "Nút phụ", value: "8" },
      { label: "Pin", value: "20 giờ" },
      { label: "Bảo hành", value: "12 tháng chính hãng" },
    ],
  },
  {
    id: "g-06",
    slug: "gamesir-g7-se",
    name: "GameSir G7 SE",
    brand: "GameSir",
    category: "tay-cam",
    price: 1_090_000,
    oldPrice: 1_390_000,
    rating: 4.6,
    reviews: 296,
    positive: 92,
    sold: 690,
    stock: 21,
    accent: "#f1f5f9",
    summary: "Có dây, Hall effect cả cần lẫn cò, mặt trước vẽ được.",
    description:
      "G7 SE dùng cả cần analog và cò Hall effect nên gần như không bao giờ bị drift hay lệch cò. Mặt trước tháo ra được và có thể vẽ lên bằng bút lông.",
    highlights: [
      "Cần + cò đều Hall effect",
      "Mặt trước tháo rời, vẽ được bằng bút lông",
      "Có dây — độ trễ thấp nhất, không lo hết pin",
      "Hai nút back",
    ],
    specs: [
      { label: "Nền tảng", value: "Xbox, PC" },
      { label: "Kết nối", value: "USB-C có dây (cáp 3m)" },
      { label: "Cần analog", value: "Hall effect" },
      { label: "Cò", value: "Hall effect, có khoá hành trình" },
      { label: "Bảo hành", value: "12 tháng" },
    ],
  },

  // ──────────────────────────── MÀN HÌNH ────────────────────────────
  {
    id: "d-01",
    slug: "lg-ultragear-27gr93u",
    name: "LG UltraGear 27GR93U 4K 144Hz",
    brand: "LG",
    category: "man-hinh",
    price: 14_490_000,
    oldPrice: 17_990_000,
    rating: 4.8,
    reviews: 176,
    positive: 95,
    sold: 240,
    stock: 6,
    isHot: true,
    accent: "#0f172a",
    summary: '27" 4K 144Hz Nano IPS 1ms — vừa chơi vừa làm đều tuyệt.',
    description:
      'Màn hình 27 inch độ phân giải 4K với tần số quét 144Hz, tấm nền Nano IPS phủ 98% DCI-P3. Đây là điểm cân bằng hiếm có giữa game và công việc cần màu chuẩn. Hỗ trợ HDMI 2.1 đầy đủ cho PS5/Xbox Series X ở 4K 120Hz.',
    highlights: [
      "4K (3840 × 2160) @ 144Hz",
      "Nano IPS, 98% DCI-P3, 1ms GtG",
      "HDMI 2.1 — PS5/Xbox 4K 120Hz",
      "G-SYNC Compatible & FreeSync Premium",
    ],
    specs: [
      { label: "Kích thước", value: '27 inch' },
      { label: "Độ phân giải", value: "3840 × 2160 (4K UHD)" },
      { label: "Tần số quét", value: "144 Hz" },
      { label: "Tấm nền", value: "Nano IPS, 1ms GtG" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    id: "d-02",
    slug: "asus-rog-swift-pg27aqdm",
    name: "ASUS ROG Swift PG27AQDM OLED",
    brand: "ASUS ROG",
    category: "man-hinh",
    price: 21_990_000,
    oldPrice: 25_990_000,
    rating: 4.9,
    reviews: 92,
    positive: 97,
    sold: 110,
    stock: 3,
    isNew: true,
    accent: "#1e1b4b",
    summary: '27" OLED 240Hz 0.03ms — màu đen tuyệt đối, chuyển động sắc như dao.',
    description:
      'Tấm nền OLED 27 inch 1440p chạy 240Hz với thời gian phản hồi 0.03ms. Độ tương phản gần như vô hạn khiến cảnh tối trong game hiện rõ chiều sâu mà LCD không thể tái tạo. Có tản nhiệt riêng và lớp phủ chống burn-in.',
    highlights: [
      "OLED 1440p @ 240Hz, 0.03ms GtG",
      "Độ tương phản 1.500.000:1, đen tuyệt đối",
      "99% DCI-P3, chứng nhận HDR True Black 400",
      "Bảo hành burn-in 3 năm",
    ],
    specs: [
      { label: "Kích thước", value: '26.5 inch' },
      { label: "Độ phân giải", value: "2560 × 1440 (QHD)" },
      { label: "Tần số quét", value: "240 Hz" },
      { label: "Tấm nền", value: "OLED, 0.03ms GtG" },
      { label: "Bảo hành", value: "36 tháng, gồm burn-in" },
    ],
  },
  {
    id: "d-03",
    slug: "gigabyte-m27q-x",
    name: "Gigabyte M27Q X 240Hz",
    brand: "Gigabyte",
    category: "man-hinh",
    price: 8_990_000,
    oldPrice: 10_990_000,
    rating: 4.7,
    reviews: 234,
    positive: 93,
    sold: 380,
    stock: 11,
    accent: "#f97316",
    summary: '27" QHD 240Hz IPS, có KVM tích hợp — hiệu năng trên giá tốt nhất.',
    description:
      'M27Q X là lựa chọn được nhiều người khuyên nhất trong tầm 9 triệu: QHD 240Hz tấm nền IPS, thêm KVM switch cho phép dùng một bộ phím chuột cho hai máy tính.',
    highlights: [
      "QHD (2560 × 1440) @ 240Hz",
      "Tấm nền IPS, 1ms MPRT",
      "KVM switch tích hợp",
      "USB-C 65W xuất hình + sạc laptop",
    ],
    specs: [
      { label: "Kích thước", value: '27 inch' },
      { label: "Độ phân giải", value: "2560 × 1440 (QHD)" },
      { label: "Tần số quét", value: "240 Hz" },
      { label: "Cổng", value: "2×HDMI 2.0, DP 1.4, USB-C 65W" },
      { label: "Bảo hành", value: "36 tháng chính hãng" },
    ],
  },
  {
    id: "d-04",
    slug: "samsung-odyssey-g5-34",
    name: "Samsung Odyssey G5 34″ Ultrawide",
    brand: "Samsung",
    category: "man-hinh",
    price: 9_490_000,
    oldPrice: 11_490_000,
    rating: 4.6,
    reviews: 158,
    positive: 90,
    sold: 260,
    stock: 8,
    accent: "#1e293b",
    summary: '34" cong 21:9 165Hz — tầm nhìn rộng cho game nhập vai và sim.',
    description:
      'Màn hình ultrawide 34 inch tỉ lệ 21:9, độ cong 1000R ôm trọn tầm mắt. Rất hợp game nhập vai, đua xe, mô phỏng bay và cả làm việc chia nhiều cửa sổ.',
    highlights: [
      "Ultrawide 21:9, độ cong 1000R",
      "WQHD (3440 × 1440) @ 165Hz",
      "HDR10, 300 nits",
      "FreeSync Premium",
    ],
    specs: [
      { label: "Kích thước", value: '34 inch cong' },
      { label: "Độ phân giải", value: "3440 × 1440 (UWQHD)" },
      { label: "Tần số quét", value: "165 Hz" },
      { label: "Tấm nền", value: "VA, 1ms MPRT" },
      { label: "Bảo hành", value: "24 tháng chính hãng" },
    ],
  },
  {
    id: "d-05",
    slug: "viewsonic-xg2431",
    name: "ViewSonic XG2431 240Hz",
    brand: "ViewSonic",
    category: "man-hinh",
    price: 6_490_000,
    rating: 4.7,
    reviews: 121,
    positive: 92,
    sold: 210,
    stock: 9,
    accent: "#0284c7",
    summary: '24" 1080p 240Hz với backlight strobing chuẩn — độ rõ chuyển động top đầu.',
    description:
      'XG2431 nổi tiếng trong cộng đồng FPS nhờ tính năng PureXP (backlight strobing) được hiệu chỉnh rất tốt, cho độ rõ chuyển động vượt trội so với các màn 240Hz cùng giá.',
    highlights: [
      "1080p @ 240Hz, IPS",
      "PureXP backlight strobing hiệu chỉnh sẵn",
      "Kích thước 24\" — chuẩn thi đấu",
      "Chân đế xoay dọc, chỉnh cao thấp đầy đủ",
    ],
    specs: [
      { label: "Kích thước", value: '24 inch' },
      { label: "Độ phân giải", value: "1920 × 1080 (FHD)" },
      { label: "Tần số quét", value: "240 Hz" },
      { label: "Tấm nền", value: "IPS, 0.5ms MPRT" },
      { label: "Bảo hành", value: "36 tháng chính hãng" },
    ],
  },
  {
    id: "d-06",
    slug: "aoc-24g2sp",
    name: "AOC 24G2SP 165Hz",
    brand: "AOC",
    category: "man-hinh",
    price: 3_290_000,
    oldPrice: 3_990_000,
    rating: 4.6,
    reviews: 642,
    positive: 91,
    sold: 1560,
    stock: 28,
    accent: "#dc2626",
    summary: '24" IPS 165Hz dưới 3,5 triệu — màn hình gaming đáng mua nhất cho người mới.',
    description:
      'Mẫu màn hình gaming bán chạy nhất phân khúc phổ thông nhiều năm liền. Tấm nền IPS màu đẹp, 165Hz mượt, chân đế chỉnh được đầy đủ — hiếm thấy ở tầm giá này.',
    highlights: [
      "IPS 1080p @ 165Hz",
      "Chân đế chỉnh cao thấp, xoay dọc",
      "FreeSync Premium",
      "Viền mỏng 3 cạnh, dễ ghép nhiều màn",
    ],
    specs: [
      { label: "Kích thước", value: '23.8 inch' },
      { label: "Độ phân giải", value: "1920 × 1080 (FHD)" },
      { label: "Tần số quét", value: "165 Hz" },
      { label: "Tấm nền", value: "IPS, 1ms MPRT" },
      { label: "Bảo hành", value: "36 tháng chính hãng" },
    ],
  },
];

// ─────────────────────────── Hàm truy vấn ───────────────────────────

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function productsByCategory(slug: CategorySlug): Product[] {
  return products.filter((p) => p.category === slug);
}

export function countByCategory(slug: CategorySlug): number {
  return productsByCategory(slug).length;
}

/** Sản phẩm đang giảm giá, sắp xếp theo % giảm nhiều nhất */
export function saleProducts(limit = 8): Product[] {
  return products
    .filter((p) => p.oldPrice)
    .sort((a, b) => discountPercent(b) - discountPercent(a))
    .slice(0, limit);
}

export function hotProducts(limit = 8): Product[] {
  return products.filter((p) => p.isHot).slice(0, limit);
}

export function newProducts(limit = 8): Product[] {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export function bestSellers(limit = 8): Product[] {
  return [...products].sort((a, b) => b.sold - a.sold).slice(0, limit);
}

/** Sản phẩm cùng danh mục, loại trừ chính nó */
export function relatedProducts(product: Product, limit = 4): Product[] {
  return products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, limit);
}

export function discountPercent(product: Pick<Product, "price" | "oldPrice">): number {
  if (!product.oldPrice) return 0;
  return Math.round((1 - product.price / product.oldPrice) * 100);
}
