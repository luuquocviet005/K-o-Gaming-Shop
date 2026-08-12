"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/products";
import { ProductMedia } from "@/components/product-art";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
} from "@/components/icons";

/**
 * Thư viện ảnh sản phẩm — trượt ngang, bấm vào để phóng to.
 *
 * Dải ảnh dùng cuộn ngang thật (`overflow-x-auto` + `scroll-snap`) chứ không
 * phải carousel dựng bằng JavaScript. Nhờ vậy vuốt trên điện thoại mượt như
 * mọi ứng dụng khác, cuộn được bằng bàn phím và con lăn chuột, và JavaScript
 * hỏng thì vẫn xem được đủ ảnh.
 *
 * Khung phóng to quan trọng với hàng cũ: khách cần soi kỹ vết trầy trước khi
 * quyết định, ảnh nhỏ trong khung thẻ không đủ.
 *
 * Khung phóng to được ĐƯA THẲNG RA <body> bằng portal, không nằm lại chỗ này
 * trong cây trang. Lý do: một lớp phủ toàn màn hình nằm sâu trong trang chỉ
 * cần một tổ tiên bất kỳ có transform/filter/contain là bị nhốt lại, và nội
 * dung phía sau sẽ đè lên trên. Ra thẳng <body> thì không tổ tiên nào nhốt
 * được nữa — không phải canh z-index với từng thành phần khác trong trang.
 */
export function ThuVienAnh({ product }: { product: Product }) {
  const anhs = product.anhs ?? (product.anh ? [product.anh] : []);
  const rangRef = useRef<HTMLDivElement>(null);
  const [chiSo, setChiSo] = useState(0);
  const [phongTo, setPhongTo] = useState<number | null>(null);

  // Máy chủ không có <body> để bắn portal vào, nên chờ mount xong mới dựng
  const [daMount, setDaMount] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaMount(true);
  }, []);

  const dong = useCallback(() => setPhongTo(null), []);

  const chuyen = useCallback(
    (buoc: -1 | 1) => {
      setPhongTo((i) =>
        i === null ? i : (i + buoc + anhs.length) % anhs.length,
      );
    },
    [anhs.length],
  );

  // Phím tắt khi đang mở khung phóng to
  useEffect(() => {
    if (phongTo === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dong();
      else if (e.key === "ArrowLeft") chuyen(-1);
      else if (e.key === "ArrowRight") chuyen(1);
    }
    window.addEventListener("keydown", onKey);
    // Khoá cuộn nền, nếu không thì cuộn chuột làm trang dưới chạy theo
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [phongTo, dong, chuyen]);

  // Chưa có ảnh thật thì vẽ hình minh hoạ như cũ
  if (anhs.length === 0) {
    return (
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-8">
        <div className="mx-auto aspect-square w-full max-w-md">
          <ProductMedia
            product={product}
            priority
            sizes="(min-width: 1024px) 30rem, 90vw"
          />
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
    <>
      <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface">
        <div
          ref={rangRef}
          onScroll={khiCuon}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
        >
          {anhs.map((src, i) => (
            <div
              key={src}
              className="w-full shrink-0 snap-center bg-surface-2 p-6"
            >
              <button
                type="button"
                onClick={() => setPhongTo(i)}
                aria-label={`Phóng to ảnh ${i + 1} trên ${anhs.length}`}
                className="mx-auto block aspect-square w-full max-w-md cursor-zoom-in"
              >
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
              </button>
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

      <p className="mt-2 text-center text-xs text-fg-subtle">
        Bấm vào ảnh để phóng to
      </p>

      {/* ─────────────── Khung phóng to ─────────────── */}
      {phongTo !== null &&
        daMount &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={`Ảnh phóng to: ${product.hang} ${product.ten}`}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-[var(--nen-phong-to)] p-4 backdrop-blur-sm"
          >
            {/* Bấm ra nền để đóng — nút phủ kín phía sau ảnh */}
            <button
              type="button"
              aria-label="Đóng ảnh phóng to"
              onClick={dong}
              className="absolute inset-0 cursor-zoom-out"
            />

            {/* eslint-disable-next-line @next/next/no-img-element -- trang tĩnh, ảnh đã nén sẵn */}
            <img
              src={anhs[phongTo]}
              alt={`${product.hang} ${product.ten} — ảnh ${phongTo + 1} trên ${anhs.length}`}
              width={1400}
              height={1400}
              className="relative max-h-[85vh] w-auto max-w-full object-contain"
            />

            <button
              type="button"
              onClick={dong}
              aria-label="Đóng ảnh phóng to"
              autoFocus
              className="absolute right-4 top-4 grid size-12 cursor-pointer place-items-center rounded-full bg-bg text-fg transition-transform hover:scale-105"
            >
              <CloseIcon width={22} height={22} />
            </button>

            {nhieuAnh && (
              <>
                <button
                  type="button"
                  onClick={() => chuyen(-1)}
                  aria-label="Ảnh trước"
                  className="absolute left-4 top-1/2 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-bg text-fg transition-transform hover:scale-105"
                >
                  <ChevronLeftIcon width={24} height={24} />
                </button>
                <button
                  type="button"
                  onClick={() => chuyen(1)}
                  aria-label="Ảnh tiếp theo"
                  className="absolute right-4 top-1/2 grid size-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full bg-bg text-fg transition-transform hover:scale-105"
                >
                  <ChevronRightIcon width={24} height={24} />
                </button>

                <p className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-bg px-4 py-1.5 text-sm font-semibold text-fg">
                  {phongTo + 1} / {anhs.length}
                </p>
              </>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
