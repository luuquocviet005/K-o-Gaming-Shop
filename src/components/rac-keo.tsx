/**
 * Kẹo rắc — hình trang trí nền cho khu hero.
 *
 * Toạ độ đặt tay chứ không sinh ngẫu nhiên: ngẫu nhiên sẽ cho ra kết quả khác
 * nhau giữa lần dựng trên máy chủ và trên trình duyệt, gây lỗi hydrate. Đặt
 * tay còn kiểm soát được khoảng trống, tránh viên kẹo rơi trúng chỗ có chữ.
 *
 * Thuần trang trí nên aria-hidden — trình đọc màn hình bỏ qua hoàn toàn.
 */

type ViKeo = { x: number; y: number; r: number; co: number; mo: number };

const dan: ViKeo[] = [
  { x: 78, y: 14, r: -18, co: 1, mo: 0.5 },
  { x: 91, y: 63, r: 24, co: 0.75, mo: 0.4 },
  { x: 66, y: 88, r: 8, co: 0.6, mo: 0.32 },
  { x: 6, y: 72, r: -34, co: 0.85, mo: 0.36 },
  { x: 22, y: 92, r: 15, co: 0.55, mo: 0.28 },
  { x: 47, y: 8, r: -8, co: 0.5, mo: 0.26 },
];

/** Một viên kẹo: thân bo tròn + hai đầu giấy xoắn */
function Keo({ mau }: { mau: string }) {
  return (
    <svg viewBox="0 0 48 24" width="48" height="24" fill={mau}>
      <path d="M2 5.5 11 12l-9 6.5a1 1 0 0 1-1.6-.8V6.3A1 1 0 0 1 2 5.5Z" />
      <path d="M46 5.5 37 12l9 6.5a1 1 0 0 0 1.6-.8V6.3a1 1 0 0 0-1.6-.8Z" />
      <rect x="11" y="3" width="26" height="18" rx="9" />
    </svg>
  );
}

export function RacKeo({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {dan.map((k, i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${k.x}%`,
            top: `${k.y}%`,
            transform: `translate(-50%, -50%) rotate(${k.r}deg) scale(${k.co})`,
            opacity: k.mo,
          }}
        >
          <Keo mau={i % 2 === 0 ? "var(--primary)" : "var(--candy)"} />
        </span>
      ))}
    </div>
  );
}
