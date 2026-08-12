/**
 * Bộ icon SVG dạng nét (stroke) — KHÔNG dùng emoji làm icon.
 * Mọi icon kế thừa `currentColor` nên tự đổi màu theo light/dark.
 * Icon mang nghĩa phải kèm `title`; icon trang trí để mặc định (aria-hidden).
 */

type IconProps = React.SVGProps<SVGSVGElement> & {
  /** Có title = icon được đọc bởi trình đọc màn hình */
  title?: string;
};

function Svg({ title, children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      width={20}
      height={20}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

export const SearchIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" />
  </Svg>
);

export const CartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6 8h12l-1 11.2a2 2 0 0 1-2 1.8H9a2 2 0 0 1-2-1.8L6 8Z" />
    <path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </Svg>
);

export const HeartIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 20s-7-4.4-7-9.2A4 4 0 0 1 12 8a4 4 0 0 1 7 2.8C19 15.6 12 20 12 20Z" />
  </Svg>
);

export const UserIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="8.5" r="3.5" />
    <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
  </Svg>
);

export const SunIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4" />
  </Svg>
);

export const MoonIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
  </Svg>
);

export const MenuIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Svg>
);

export const CloseIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 6 12 12M18 6 6 18" />
  </Svg>
);

export const ChevronLeftIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m14 6-6 6 6 6" />
  </Svg>
);

export const ChevronRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m10 6 6 6-6 6" />
  </Svg>
);

export const ChevronDownIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m6 9 6 6 6-6" />
  </Svg>
);

export const ArrowRightIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </Svg>
);

export const StarIcon = ({ filled = false, ...p }: IconProps & { filled?: boolean }) => (
  <Svg {...p} fill={filled ? "currentColor" : "none"}>
    <path d="m12 4 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4L4.2 9.7l5.4-.8L12 4Z" />
  </Svg>
);

export const PlusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 5v14M5 12h14" />
  </Svg>
);

export const MinusIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 12h14" />
  </Svg>
);

export const CheckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </Svg>
);

export const TrashIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4 7h16M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7M6.5 7l.8 12.1A2 2 0 0 0 9.3 21h5.4a2 2 0 0 0 2-1.9L17.5 7" />
  </Svg>
);

export const TruckIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M3 7.5A1.5 1.5 0 0 1 4.5 6H14v10H3V7.5Z" />
    <path d="M14 10h3.6l3.4 3.2V16h-7v-6Z" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17.5" cy="18" r="2" />
  </Svg>
);

export const ShieldIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 19 6v5.5c0 4.3-2.9 7.6-7 9-4.1-1.4-7-4.7-7-9V6l7-2.5Z" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
);

export const RefreshIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M20 11a8 8 0 0 0-14-4.5L4 9" />
    <path d="M4 13a8 8 0 0 0 14 4.5L20 15" />
    <path d="M4 5v4h4M20 19v-4h-4" />
  </Svg>
);

export const SparkIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M13 3 5.5 13.5H11L10 21l7.5-10.5H12L13 3Z" />
  </Svg>
);

export const TagIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M11.5 3.5H20v8.5l-8.6 8.6a1.5 1.5 0 0 1-2.1 0l-6.4-6.4a1.5 1.5 0 0 1 0-2.1l8.6-8.6Z" />
    <circle cx="16" cy="8" r="1.4" />
  </Svg>
);

export const PhoneIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M6.5 4h3l1.4 3.6-2 1.4a11.5 11.5 0 0 0 5.1 5.1l1.4-2L19 13.5v3a2.5 2.5 0 0 1-2.7 2.5A14.5 14.5 0 0 1 4 6.7 2.5 2.5 0 0 1 6.5 4Z" />
  </Svg>
);

export const MailIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
    <path d="m4 8 8 5 8-5" />
  </Svg>
);

export const MapPinIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s6.5-5.6 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.4" r="2.4" />
  </Svg>
);

export const ClockIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 1.8" />
  </Svg>
);

export const SlidersIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M5 6h14M5 12h14M5 18h14" />
    <circle cx="9" cy="6" r="2" />
    <circle cx="15" cy="12" r="2" />
    <circle cx="8" cy="18" r="2" />
  </Svg>
);

export const GridIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="4" y="4" width="7" height="7" rx="2" />
    <rect x="13" y="4" width="7" height="7" rx="2" />
    <rect x="4" y="13" width="7" height="7" rx="2" />
    <rect x="13" y="13" width="7" height="7" rx="2" />
  </Svg>
);

// ── Icon danh mục ────────────────────────────────────────────────────

export const MouseIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="7" y="3" width="10" height="18" rx="5" />
    <path d="M12 7v3.5" />
  </Svg>
);

export const KeyboardIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="6.5" width="19" height="11" rx="2.5" />
    <path d="M6.5 10h.01M9.5 10h.01M12.5 10h.01M15.5 10h.01M18 10h.01M8 14h8" />
  </Svg>
);

export const HeadphonesIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M4.5 15v-2.5a7.5 7.5 0 0 1 15 0V15" />
    <rect x="2.8" y="13.5" width="4" height="6.5" rx="2" />
    <rect x="17.2" y="13.5" width="4" height="6.5" rx="2" />
  </Svg>
);

export const ChairIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M7 4.5A2.5 2.5 0 0 1 9.5 2h5A2.5 2.5 0 0 1 17 4.5V12H7V4.5Z" />
    <path d="M5.5 12h13v2.5a2 2 0 0 1-2 2h-9a2 2 0 0 1-2-2V12Z" />
    <path d="M12 16.5V21M8.5 21h7" />
  </Svg>
);

export const GamepadIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M8 8h8a5 5 0 0 1 4.6 7l-.9 2.1a2.2 2.2 0 0 1-3.7.6L15 16H9l-1 1.7a2.2 2.2 0 0 1-3.7-.6L3.4 15A5 5 0 0 1 8 8Z" />
    <path d="M7.5 11.5v2M6.5 12.5h2M16 11.5h.01M17.5 13h.01" />
  </Svg>
);

export const MonitorIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="4" width="19" height="12.5" rx="2.5" />
    <path d="M9 20h6M12 16.5V20" />
  </Svg>
);

export const SwitchIcon = (p: IconProps) => (
  <Svg {...p}>
    {/* Switch bàn phím nhìn nghiêng: thân + trục chữ thập + chân */}
    <path d="M6.5 10.5h11l1.5 8H5l1.5-8Z" />
    <rect x="9" y="4.5" width="6" height="6" rx="1.5" />
    <path d="M12 5.5v4M10.5 7.5h3" />
  </Svg>
);

export const MousepadIcon = (p: IconProps) => (
  <Svg {...p}>
    {/* Tấm pad nhìn chếch, có con chuột nhỏ đặt lên để phân biệt với ô vuông */}
    <rect x="2.5" y="6" width="19" height="12" rx="2" />
    <rect x="13" y="9" width="5" height="7.5" rx="2.5" />
    <path d="M15.5 11v1.8" />
  </Svg>
);

export const BoxIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 3.5 20 7v10l-8 3.5L4 17V7l8-3.5Z" />
    <path d="m4 7 8 3.5L20 7M12 10.5V20" />
  </Svg>
);

export const MapIcon = (p: IconProps) => (
  <Svg {...p}>
    <path d="M12 21s6.5-5.6 6.5-10.4A6.5 6.5 0 0 0 5.5 10.6C5.5 15.4 12 21 12 21Z" />
    <circle cx="12" cy="10.4" r="2.4" />
  </Svg>
);

export const InfoIcon = (p: IconProps) => (
  <Svg {...p}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5.5M12 7.8h.01" />
  </Svg>
);

// ── Mạng xã hội (dạng đặc, đúng hình thương hiệu) ──────────────────

export const FacebookIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M13.5 21v-7.3h2.5l.4-2.9h-2.9V8.9c0-.8.2-1.4 1.4-1.4h1.6V4.9c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.1H7.8v2.9h2.5V21h3.2Z" />
  </Svg>
);

export const InstagramIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="16.9" cy="7.1" r="1" fill="currentColor" />
  </Svg>
);

export const YoutubeIcon = (p: IconProps) => (
  <Svg {...p}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
    <path d="m10.5 9.5 4.5 2.5-4.5 2.5v-5Z" fill="currentColor" stroke="none" />
  </Svg>
);

export const ZaloIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    {/* Bong bóng chat + chữ Z */}
    <path d="M12 3.2c5 0 9 3.2 9 7.3 0 4-4 7.3-9 7.3-.9 0-1.8-.1-2.6-.3l-4 2.3a.5.5 0 0 1-.7-.6l.9-3A6.8 6.8 0 0 1 3 10.5c0-4.1 4-7.3 9-7.3Z" />
    <path
      d="M8.6 8.2h5.1L9 13.5h5"
      stroke="var(--surface)"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />
  </Svg>
);

export const TiktokIcon = (p: IconProps) => (
  <Svg {...p} fill="currentColor" stroke="none">
    <path d="M15.8 3h-2.7v12.1a2.3 2.3 0 1 1-1.9-2.3v-2.7a5 5 0 1 0 4.6 5V9.4a6.4 6.4 0 0 0 3.7 1.2V7.9a3.7 3.7 0 0 1-3.7-3.7V3Z" />
  </Svg>
);

/**
 * Khoá icon (khai báo trong sync.config.json) -> component.
 * Thêm tab mới trong Sheet thì chọn một khoá ở đây, hoặc dùng "do-khac".
 */
const bangIcon: Record<string, (p: IconProps) => React.ReactElement> = {
  chuot: MouseIcon,
  "ban-phim": KeyboardIcon,
  "tai-nghe": HeadphonesIcon,
  "pad-chuot": MousepadIcon,
  switch: SwitchIcon,
  "do-khac": BoxIcon,
  ghe: ChairIcon,
  "tay-cam": GamepadIcon,
  "man-hinh": MonitorIcon,
};

/**
 * Icon của một danh mục.
 *
 * Là component ổn định chứ không phải hàm trả về component — trả về component
 * ngay trong lúc render sẽ tạo kiểu (type) mới mỗi lần, khiến React tháo và
 * dựng lại phần tử thay vì cập nhật nó.
 */
export function CategoryIcon({
  khoa,
  ...props
}: IconProps & { khoa: string }) {
  const Icon = bangIcon[khoa] ?? BoxIcon;
  return <Icon {...props} />;
}
