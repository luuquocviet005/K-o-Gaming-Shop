/** Chỉ những trường cần để vẽ / hiện ảnh — nhận được cả Product lẫn CardProduct */
type Displayable = {
  ten: string;
  danhMuc: string;
  mau: string;
  anh?: string;
};

/**
 * Minh hoạ vector cho sản phẩm CHƯA có ảnh thật.
 * Vẽ theo danh mục, tô bằng `product.accent` nên mỗi sản phẩm một sắc thái riêng.
 *
 * Có ảnh thật rồi? Đặt file vào `public/products/` và set `image` trong
 * `src/lib/products.ts` — component <ProductMedia> sẽ tự ưu tiên ảnh.
 */

function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const num = parseInt(full, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((num >> 16) & 255) + amount);
  const g = clamp(((num >> 8) & 255) + amount);
  const b = clamp((num & 255) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

type ArtProps = { accent: string; light: string; dark: string };

const shapes: Record<string, (p: ArtProps) => React.ReactElement> = {
  chuot: ({ accent, light, dark }) => (
    <>
      <path
        d="M100 34c19 0 32 14 32 34v50c0 22-13 36-32 36s-32-14-32-36V68c0-20 13-34 32-34Z"
        fill={accent}
      />
      <path d="M100 34c19 0 32 14 32 34v10H100V34Z" fill={light} opacity="0.55" />
      <path d="M100 36v42" stroke={dark} strokeWidth="2.5" opacity="0.5" />
      <rect x="95" y="52" width="10" height="20" rx="5" fill={dark} opacity="0.75" />
      <rect x="96.5" y="56" width="7" height="12" rx="3.5" fill={light} opacity="0.6" />
      <path
        d="M68 84h64"
        stroke={light}
        strokeWidth="2"
        opacity="0.35"
        strokeLinecap="round"
      />
    </>
  ),

  "ban-phim": ({ accent, light, dark }) => (
    <>
      <rect x="24" y="66" width="152" height="70" rx="12" fill={accent} />
      <rect x="24" y="66" width="152" height="10" rx="5" fill={light} opacity="0.4" />
      <g fill={light} opacity="0.85">
        {Array.from({ length: 4 }).map((_, row) =>
          Array.from({ length: 11 }).map((_, col) => (
            <rect
              key={`${row}-${col}`}
              x={35 + col * 12.4}
              y={80 + row * 12.6}
              width={10}
              height={10}
              rx={2.6}
            />
          )),
        )}
      </g>
      <rect x="72" y="130.8" width="56" height="0" rx="2" fill={dark} />
      <rect x="24" y="128" width="152" height="8" rx="4" fill={dark} opacity="0.35" />
    </>
  ),

  "tai-nghe": ({ accent, light, dark }) => (
    <>
      <path
        d="M46 112V96a54 54 0 0 1 108 0v16"
        stroke={accent}
        strokeWidth="15"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M46 106V96a54 54 0 0 1 108 0v10"
        stroke={light}
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
        opacity="0.45"
      />
      <rect x="30" y="100" width="32" height="52" rx="15" fill={accent} />
      <rect x="138" y="100" width="32" height="52" rx="15" fill={accent} />
      <rect x="38" y="108" width="16" height="36" rx="8" fill={dark} opacity="0.55" />
      <rect x="146" y="108" width="16" height="36" rx="8" fill={dark} opacity="0.55" />
      <path
        d="M62 138c14 0 20 8 20 18"
        stroke={dark}
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="84" cy="158" r="6" fill={light} />
    </>
  ),

  "ghe-gaming": ({ accent, light, dark }) => (
    <>
      <path d="M64 28h72a10 10 0 0 1 10 10v70H54V38a10 10 0 0 1 10-10Z" fill={accent} />
      <rect x="70" y="40" width="60" height="56" rx="8" fill={light} opacity="0.35" />
      <path d="M50 108h100a8 8 0 0 1 8 8v10a10 10 0 0 1-10 10H52a10 10 0 0 1-10-10v-10a8 8 0 0 1 8-8Z" fill={dark} />
      <path d="M96 136v24" stroke={dark} strokeWidth="9" strokeLinecap="round" />
      <path
        d="M64 176h64"
        stroke={dark}
        strokeWidth="9"
        strokeLinecap="round"
        opacity="0.85"
      />
      <circle cx="64" cy="178" r="6" fill={accent} />
      <circle cx="128" cy="178" r="6" fill={accent} />
    </>
  ),

  "tay-cam": ({ accent, light, dark }) => (
    <>
      <path
        d="M68 68h64c22 0 38 20 34 42l-5 26c-3 15-21 20-31 8l-11-14H84l-11 14c-10 12-28 7-31-8l-5-26c-4-22 12-42 34-42Z"
        fill={accent}
      />
      <path
        d="M68 68h64c15 0 27 9 32 22H36c5-13 17-22 32-22Z"
        fill={light}
        opacity="0.4"
      />
      <path d="M64 104v18M55 113h18" stroke={dark} strokeWidth="7" strokeLinecap="round" />
      <circle cx="134" cy="104" r="7" fill={dark} />
      <circle cx="150" cy="118" r="7" fill={dark} />
      <circle cx="90" cy="132" r="11" fill={dark} opacity="0.85" />
      <circle cx="90" cy="132" r="5" fill={light} opacity="0.5" />
    </>
  ),

  "man-hinh": ({ accent, light, dark }) => (
    <>
      <rect x="18" y="42" width="164" height="96" rx="10" fill={dark} />
      <rect x="26" y="50" width="148" height="80" rx="5" fill={accent} />
      <rect x="26" y="50" width="148" height="34" rx="5" fill={light} opacity="0.35" />
      <path d="M92 138h16v20H92z" fill={dark} />
      <rect x="62" y="156" width="76" height="10" rx="5" fill={dark} />
    </>
  ),

  "switch-he": ({ accent, light, dark }) => (
    <>
      {/* Đế switch */}
      <path d="M52 96h96l14 66H38l14-66Z" fill={accent} />
      <path d="M52 96h96l3 14H49l3-14Z" fill={light} opacity="0.45" />
      {/* Thân trên */}
      <rect x="66" y="40" width="68" height="58" rx="8" fill={light} />
      {/* Trục chữ thập */}
      <path d="M100 52v34M83 69h34" stroke={dark} strokeWidth="11" strokeLinecap="round" />
      {/* Chân cắm */}
      <rect x="76" y="162" width="10" height="14" rx="4" fill={dark} opacity="0.8" />
      <rect x="114" y="162" width="10" height="14" rx="4" fill={dark} opacity="0.8" />
    </>
  ),

  "do-lat-vat": ({ accent, light, dark }) => (
    <>
      <path d="M100 34 168 62v76l-68 28-68-28V62l68-28Z" fill={accent} />
      <path d="M32 62l68 28 68-28-68-28-68 28Z" fill={light} opacity="0.5" />
      <path d="M100 90v76" stroke={dark} strokeWidth="3" opacity="0.35" />
      <path d="M32 62v76l68 28" fill="none" stroke={dark} strokeWidth="3" opacity="0.25" />
      {/* Dải băng dán thùng */}
      <path d="M78 44v30l22 9 22-9V44l-22-9-22 9Z" fill={dark} opacity="0.25" />
    </>
  ),
};

export function ProductArt({
  danhMuc,
  mau,
  className,
}: {
  danhMuc: string;
  mau: string;
  className?: string;
}) {
  // Danh mục mới thêm trong Sheet mà chưa có hình riêng thì vẽ kiểu thùng đồ
  const draw = shapes[danhMuc] ?? shapes["do-lat-vat"];
  const props: ArtProps = {
    accent: mau,
    light: shade(mau, 70),
    dark: shade(mau, -45),
  };

  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {/* Bóng đổ mềm giúp sản phẩm không bị "dán phẳng" lên nền */}
      <ellipse cx="100" cy="176" rx="58" ry="9" fill="var(--fg)" opacity="0.09" />
      {draw(props)}
    </svg>
  );
}

/**
 * Khung ảnh sản phẩm: dùng ảnh thật nếu có, không thì vẽ minh hoạ.
 * Luôn giữ tỉ lệ vuông để không gây layout shift (CLS).
 */
export function ProductMedia({
  product,
  className = "",
  sizes = "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw",
  priority = false,
}: {
  product: Displayable;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (product.anh) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- static export, ảnh đã tối ưu sẵn
      <img
        src={product.anh}
        alt={product.ten}
        width={600}
        height={600}
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        className={`h-full w-full object-contain ${className}`}
      />
    );
  }
  return (
    <ProductArt
      danhMuc={product.danhMuc}
      mau={product.mau}
      className={`h-full w-full ${className}`}
    />
  );
}
