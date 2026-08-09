import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Logo chữ + biểu tượng viên kẹo.
 * THAY LOGO THẬT: bỏ file vào `public/logo.svg` rồi thay khối <span> biểu tượng
 * bên dưới bằng <img src="/logo.svg" alt="" width={40} height={40} />.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — về trang chủ`}
      className={`group inline-flex shrink-0 items-center gap-2.5 ${className}`}
    >
      <span className="relative grid size-10 place-items-center rounded-2xl bg-primary text-on-primary shadow-[0_6px_16px_-6px_rgba(22,163,74,0.8)] transition-transform duration-200 group-hover:-rotate-6">
        <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
          {/* Viên kẹo: thân bo tròn + hai cánh xoắn hai bên */}
          <path
            d="M2.5 8.5 6 12l-3.5 3.5a.6.6 0 0 1-1-.45v-6.1a.6.6 0 0 1 1-.45Z"
            fill="currentColor"
          />
          <path
            d="M21.5 8.5 18 12l3.5 3.5a.6.6 0 0 0 1-.45v-6.1a.6.6 0 0 0-1-.45Z"
            fill="currentColor"
          />
          <rect x="6" y="6.5" width="12" height="11" rx="5.5" fill="currentColor" />
          <path
            d="M9.6 10.2c1.6-1.1 3.2-1.1 4.8 0"
            stroke="var(--primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M9.6 13.6c1.6-1.1 3.2-1.1 4.8 0"
            stroke="var(--primary)"
            strokeWidth="1.6"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.05rem] font-extrabold tracking-tight text-fg">
          KẸO
          <span className="ml-1 text-primary-ink">GAMING</span>
        </span>
        <span className="mt-0.5 text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-fg-subtle">
          Shop
        </span>
      </span>
    </Link>
  );
}
