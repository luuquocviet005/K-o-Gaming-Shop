"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties } from "react";
import type { Product } from "@/lib/products";
import { formatGia } from "@/lib/format";
import { ProductMedia } from "@/components/product-art";

/** Vị trí ba món trên "bàn". Điện thoại: chồng thành xấp polaroid; từ sm: xếp lệch ra bàn. */
const banGoc: { cls: string; goc: string }[] = [
  { cls: "left-[25%] top-[9%] w-[50%] z-20 sm:left-[14%] sm:top-[5%] sm:w-[42%] sm:z-10", goc: "-5deg" },
  { cls: "right-[7%] top-[2%] w-[42%] z-10 sm:right-[4%] sm:top-0 sm:w-[34%] sm:z-0", goc: "8deg" },
  { cls: "left-[6%] top-[5%] w-[42%] z-0 sm:left-auto sm:top-auto sm:right-[5%] sm:bottom-0 sm:w-[38%] sm:z-20", goc: "-11deg" },
];

/**
 * Ba món xếp trên "bàn". Trên điện thoại (xấp chồng), vài giây một lần thẻ trên
 * cùng trượt ra rồi chui xuống đáy xấp. Tắt khi bật "giảm chuyển động".
 */
export function BanXap({ items }: { items: Product[] }) {
  const [xauChong, setXauChong] = useState(false); // true khi đang là xấp chồng (< sm)
  const [lech, setLech] = useState(0); // thẻ i có thứ tự chồng (i + lech) % n
  const [rut, setRut] = useState(-1); // thẻ đang trượt ra

  useEffect(() => {
    const mq = matchMedia("(max-width: 639px)");
    const giam = matchMedia("(prefers-reduced-motion: reduce)");
    const cap = () => setXauChong(mq.matches);
    cap();
    mq.addEventListener("change", cap);
    if (!mq.matches || giam.matches || items.length < 2) return () => mq.removeEventListener("change", cap);

    const n = items.length;
    let l = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const t1 = setInterval(() => {
      setRut(items.findIndex((_, i) => (i + l) % n === 0));
      timers.push(
        setTimeout(() => setLech(++l), 350), // đổi tầng lúc thẻ trượt ra xa nhất
        setTimeout(() => setRut(-1), 700),
      );
    }, 4500);
    return () => {
      clearInterval(t1);
      timers.forEach(clearTimeout);
      mq.removeEventListener("change", cap);
    };
  }, [items]);

  return (
    <>
      {items.map((p, i) => {
        const { cls, goc } = banGoc[i];
        // thứ tự chồng: 0 = trên cùng
        const hang = (i + lech) % items.length;
        return (
          <Link
            key={p.id}
            href={`/san-pham/${p.slug}/`}
            className={`animate-rise group absolute block ${cls}`}
            style={{
              animationDelay: `${i * 120}ms`,
              ...(xauChong ? { zIndex: 30 - hang * 10 } : null),
            }}
          >
            <span
              className={`tem-dan block overflow-hidden rounded-2xl border-2 border-fg bg-surface shadow-[5px_6px_0_0_var(--border-strong)] transition-transform duration-200 group-hover:!rotate-0 ${
                rut === i ? "rut-the" : ""
              }`}
              style={{ "--goc": goc } as CSSProperties}
            >
              <span className="block aspect-square p-3 sm:p-4">
                <ProductMedia product={p} priority={i === 0} sizes="260px" nho />
              </span>
              <span className="flex flex-col items-start gap-1 border-t-2 border-dashed border-border-strong px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:gap-2">
                <span className="line-clamp-1 max-w-full text-xs font-bold text-fg sm:text-sm">{p.ten}</span>
                <span className="shrink-0 rounded-md bg-primary px-2 py-0.5 font-mono text-xs font-bold text-on-primary sm:text-sm">
                  {formatGia(p)}
                </span>
              </span>
            </span>
          </Link>
        );
      })}
    </>
  );
}
