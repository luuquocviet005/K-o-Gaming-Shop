"use client";

import { useRef, useState } from "react";
import type { Product } from "@/lib/products";
import { ProductMedia } from "@/components/product-art";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

/**
 * Thư viện ảnh sản phẩm — trượt ngang.
 *
 * Dùng cuộn ngang thật (`overflow-x-auto` + `scroll-snap`) chứ không phải
 * carousel dựng bằng JavaScript. Nhờ vậy:
 *   - Vuốt trên điện thoại mượt như mọi ứng dụng khác, không phải bắt chước
 *   - Cuộn được bằng bàn phím và bằng con lăn chuột
 *   - JavaScript hỏng thì vẫn xem được đủ ảnh
 *
 * Hai nút mũi tên chỉ là lối tắt cho chuột, không phải cơ chế duy nhất.
 */
export function ThuVienAnh({ product }: { product: Product }) {
  const anhs = product.anhs ?? (product.anh ? [product.anh] : []);
  const rangRef = useRef<HTMLDivElement>(null);
  const [chiSo, setChiSo] = useState(0);

  // Chưa có ảnh thật thì vẽ hình minh hoạ như cũ
  if (anhs.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-8">
        <div className="mx-auto aspect-square w-full max-w-md">
          <ProductMedia product={product} priority sizes="(min-width: 1024px) 30rem, 90vw" />
        </div>
        <p className="mt-2 text-center text-xs text-fg-subtle">
          Chưa có ảnh thật — nhắn tụi mình để xem ảnh chụp món này
        </p>
      </div>
    );
  }

  function truot(huong: -1 | 1) {
    const el = rangRef.current;
    if (!el) return;
    el.scrollBy({ left: huong * el.clientWidth, behavior: "smooth" });
  }

  /** Cuộn tới đâu thì chấm nào sáng — tính từ vị trí cuộn thật */
  function khiCuon() {
    const el = rangRef.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    setChiSo(Math.min(Math.max(i, 0), anhs.length - 1));
  }

  const nhieuAnh = anhs.length > 1;

  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface">
      <div
        ref={rangRef}
        onScroll={khiCuon}
        className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
      >
        {anhs.map((src, i) => (
          <div key={src} className="w-full shrink-0 snap-center bg-surface-2 p-6">
            <div className="mx-auto aspect-square w-full max-w-md">
              {/* eslint-disable-next-line @next/next/no-img-element -- trang tĩnh, ảnh đã nén sẵn */}
              <img
                src={src}
                alt={`${product.hang} ${product.ten} — ảnh ${i + 1} trên ${anhs.length}`}
                width={1400}
                height={1400}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {nhieuAnh && (
        <>
          <button
            type="button"
            onClick={() => truot(-1)}
            aria-label="Xem ảnh trước"
            className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-surface/90 text-fg backdrop-blur transition-colors hover:bg-surface"
          >
            <ChevronLeftIcon width={20} height={20} />
          </button>
          <button
            type="button"
            onClick={() => truot(1)}
            aria-label="Xem ảnh tiếp theo"
            className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-surface/90 text-fg backdrop-blur transition-colors hover:bg-surface"
          >
            <ChevronRightIcon width={20} height={20} />
          </button>

          <div className="absolute inset-x-0 bottom-3 flex items-center justify-center gap-1.5">
            {anhs.map((src, i) => (
              <span
                key={src}
                aria-hidden="true"
                className={`h-1.5 rounded-full transition-all duration-200 ${
                  i === chiSo ? "w-5 bg-primary" : "w-1.5 bg-fg/25"
                }`}
              />
            ))}
          </div>

          <p role="status" aria-live="polite" className="sr-only">
            Ảnh {chiSo + 1} trên {anhs.length}
          </p>
        </>
      )}
    </div>
  );
}
