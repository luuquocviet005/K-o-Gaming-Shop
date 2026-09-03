import Link from "next/link";
import { site } from "@/lib/site";

/**
 * Logo chữ + mascot.
 *
 * Ảnh mascot sinh ra từ `scripts/tao-bo-logo.mjs` — sửa ảnh gốc thì chạy lại
 * script đó kèm `--apply`, đừng sửa tay file trong public/.
 *
 * `alt=""` là cố ý: thẻ <a> bao ngoài đã có aria-label mô tả đủ ("... — về
 * trang chủ"), nên để chữ thay thế cho ảnh nữa thì trình đọc màn hình đọc lặp
 * hai lần cùng một thứ.
 */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — về trang chủ`}
      className={`group inline-flex shrink-0 items-center gap-2 sm:gap-2.5 ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export, ảnh đã tối ưu sẵn */}
      <img
        src="/logo.png"
        alt=""
        width={40}
        height={40}
        // fetchPriority cao vì logo nằm ngay đầu trang, khách thấy nó trước tiên
        fetchPriority="high"
        decoding="async"
        className="size-10 shrink-0 rounded-full transition-transform duration-200 group-hover:-rotate-6"
      />
      {/* Màn dưới 360px chỉ còn viên kẹo — nhét thêm chữ vào là header tràn
          ngang, mà biểu tượng đã đủ nhận diện. Chữ quay lại từ 360px, nên các
          máy phổ biến (375px trở lên) vẫn thấy đủ tên shop. */}
      <span className="hidden flex-col leading-none min-[360px]:flex">
        <span className="font-display text-[0.95rem] font-extrabold leading-tight tracking-tight text-fg sm:text-[1.05rem]">
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
