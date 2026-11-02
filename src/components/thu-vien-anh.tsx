"use client";

import {
  type PointerEvent as SuKienTro,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import type { Product } from "@/lib/products";
import { ProductMedia } from "@/components/product-art";
import { useMonDangXem } from "@/components/phan-loai";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CloseIcon,
  MinusIcon,
  PlusIcon,
  RefreshIcon,
} from "@/components/icons";

const ZOOM_MAX = 5;
/** Mức phóng khi bấm vào ảnh đang ở cỡ vừa khung */
const ZOOM_BAM = 2.5;
const GOC = { z: 1, x: 0, y: 0 };

/** Giữ ảnh không bị kéo lệch quá mép của chính nó */
function kepMep(img: HTMLImageElement | null, c: typeof GOC) {
  const maxX = img ? (img.offsetWidth * (c.z - 1)) / 2 : 0;
  const maxY = img ? (img.offsetHeight * (c.z - 1)) / 2 : 0;
  return {
    z: c.z,
    x: Math.min(Math.max(c.x, -maxX), maxX),
    y: Math.min(Math.max(c.y, -maxY), maxY),
  };
}

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
 * Trong khung phóng to khách tự chỉnh mức phóng (1x tới 5x) bằng thanh trượt,
 * nút +/-, con lăn chuột, hai ngón tay, hoặc bấm vào chỗ muốn soi; đang phóng
 * thì kéo để di ảnh. Vuốt chuyển ảnh chỉ chạy khi ảnh về cỡ vừa khung, nếu
 * không thì kéo để soi lại thành chuyển sang ảnh khác.
 *
 * Khung phóng to được ĐƯA THẲNG RA <body> bằng portal, không nằm lại chỗ này
 * trong cây trang. Lý do: một lớp phủ toàn màn hình nằm sâu trong trang chỉ
 * cần một tổ tiên bất kỳ có transform/filter/contain là bị nhốt lại, và nội
 * dung phía sau sẽ đè lên trên. Ra thẳng <body> thì không tổ tiên nào nhốt
 * được nữa — không phải canh z-index với từng thành phần khác trong trang.
 */
export function ThuVienAnh({ product }: { product: Product }) {
  const mon = useMonDangXem(product);
  // Đổi phân loại = bộ ảnh khác: dựng lại từ đầu để dải ảnh về tấm 1, khỏi
  // kẹt ở tấm thứ 4 của màu cũ mà màu mới chỉ có 2 tấm.
  return <ThuVienAnhNoi key={mon.loai?.id ?? ""} product={mon} />;
}

function ThuVienAnhNoi({ product }: { product: Product }) {
  const anhs = product.anhs ?? (product.anh ? [product.anh] : []);
  const rangRef = useRef<HTMLDivElement>(null);
  /** Điểm chạm đầu tiên trong khung phóng to, để nhận ra cú vuốt ngang.
   *  null = đang chạm hai ngón (chụm phóng), không tính là vuốt. */
  const chamX = useRef<number | null>(null);
  const [chiSo, setChiSo] = useState(0);
  const [phongTo, setPhongTo] = useState<number | null>(null);
  /** Mức phóng z và độ dời x/y (px màn hình) của ảnh trong khung phóng to */
  const [zoom, setZoom] = useState(GOC);
  const anhRef = useRef<HTMLImageElement>(null);
  /** Các ngón/chuột đang ấn trên ảnh, để kéo và chụm hai ngón */
  const conTro = useRef(new Map<number, { x: number; y: number }>());

  // Máy chủ không có <body> để bắn portal vào, nên chờ mount xong mới dựng
  const [daMount, setDaMount] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDaMount(true);
  }, []);

  const dong = useCallback(() => {
    setPhongTo(null);
    setZoom(GOC);
  }, []);

  /**
   * Đặt mức phóng mới, giữ yên điểm (cx, cy) — tính từ tâm ảnh, px màn hình —
   * để chỗ khách đang soi không trượt đi. Ảnh không được kéo lệch quá mép.
   */
  const datZoom = useCallback(
    (zMoi: number | ((z: number) => number), cx = 0, cy = 0) => {
      setZoom((cu) => {
        const z = Math.min(
          Math.max(typeof zMoi === "function" ? zMoi(cu.z) : zMoi, 1),
          ZOOM_MAX,
        );
        return kepMep(anhRef.current, {
          z,
          x: cx - ((cx - cu.x) * z) / cu.z,
          y: cy - ((cy - cu.y) * z) / cu.z,
        });
      });
    },
    [],
  );

  const dangPhong = zoom.z > 1.001;

  const [dangKeo, setDangKeo] = useState(false);

  /** Toạ độ con trỏ tính từ tâm ảnh lúc chưa dời (tâm hiện tại trừ độ dời) */
  function tuTam(clientX: number, clientY: number) {
    const r = anhRef.current?.getBoundingClientRect();
    if (!r) return [0, 0] as const;
    return [
      clientX - (r.left + r.width / 2 - zoom.x),
      clientY - (r.top + r.height / 2 - zoom.y),
    ] as const;
  }

  function thaTay(e: SuKienTro) {
    conTro.current.delete(e.pointerId);
    if (conTro.current.size === 0) setDangKeo(false);
  }

  const chuyen = useCallback(
    (buoc: -1 | 1) => {
      setZoom(GOC);
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
      else if (e.key === "+" || e.key === "=") datZoom((z) => z + 0.5);
      else if (e.key === "-") datZoom((z) => z - 0.5);
      else if (e.key === "0") setZoom(GOC);
    }
    window.addEventListener("keydown", onKey);
    // Khoá cuộn nền, nếu không thì cuộn chuột làm trang dưới chạy theo
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [phongTo, dong, chuyen, datZoom]);

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

        {/* Hai mũi tên chỉ hiện từ màn hình vừa trở lên. Trên điện thoại chúng
            đè lên chính tấm ảnh (ảnh rộng gần kín khung), mà vuốt ngang đã
            chuyển ảnh được rồi — dải chấm bên dưới báo đang ở tấm nào. */}
        {nhieuAnh && (
          <>
            <button
              type="button"
              onClick={() => truot(-1)}
              aria-label="Xem ảnh trước"
              className="absolute left-3 top-1/2 hidden size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-surface/90 text-fg backdrop-blur transition-colors hover:bg-surface sm:grid"
            >
              <ChevronLeftIcon width={20} height={20} />
            </button>
            <button
              type="button"
              onClick={() => truot(1)}
              aria-label="Xem ảnh tiếp theo"
              className="absolute right-3 top-1/2 hidden size-11 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-surface/90 text-fg backdrop-blur transition-colors hover:bg-surface sm:grid"
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
            // Vuốt ngang để chuyển ảnh — trên điện thoại đó là thao tác tự nhiên nhất
            onTouchStart={(e) => {
              chamX.current =
                e.touches.length === 1 ? e.touches[0].clientX : null;
            }}
            onTouchEnd={(e) => {
              if (chamX.current === null || dangPhong) return;
              const dx = e.changedTouches[0].clientX - chamX.current;
              if (nhieuAnh && Math.abs(dx) > 50) chuyen(dx < 0 ? 1 : -1);
            }}
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
              ref={anhRef}
              src={anhs[phongTo]}
              alt={`${product.hang} ${product.ten} — ảnh ${phongTo + 1} trên ${anhs.length}`}
              width={1400}
              height={1400}
              draggable={false}
              style={{
                transform: `translate(${zoom.x}px, ${zoom.y}px) scale(${zoom.z})`,
              }}
              // Đang kéo/chụm thì ảnh bám theo tay ngay, không có độ trễ
              className={`relative max-h-[70vh] w-auto max-w-full touch-none select-none object-contain sm:max-h-[85vh] ${
                dangKeo ? "" : "transition-transform duration-150"
              } ${dangPhong ? "cursor-grab active:cursor-grabbing" : "cursor-zoom-in"}`}
              onClick={(e) => {
                if (!dangPhong)
                  datZoom(ZOOM_BAM, ...tuTam(e.clientX, e.clientY));
              }}
              onDoubleClick={() => setZoom(GOC)}
              onWheel={(e) =>
                datZoom(
                  (z) => z * (e.deltaY < 0 ? 1.2 : 1 / 1.2),
                  ...tuTam(e.clientX, e.clientY),
                )
              }
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                conTro.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
                setDangKeo(true);
              }}
              onPointerMove={(e) => {
                const ds = conTro.current;
                const cu = ds.get(e.pointerId);
                if (!cu) return;
                if (ds.size === 2) {
                  // Chụm hai ngón: khoảng cách hai ngón đổi bao nhiêu lần thì phóng bấy nhiêu
                  const khac = [...ds.values()].find((d) => d !== cu)!;
                  const truoc = Math.hypot(cu.x - khac.x, cu.y - khac.y);
                  const sau = Math.hypot(
                    e.clientX - khac.x,
                    e.clientY - khac.y,
                  );
                  if (truoc > 0)
                    datZoom(
                      (z) => (z * sau) / truoc,
                      ...tuTam(
                        (e.clientX + khac.x) / 2,
                        (e.clientY + khac.y) / 2,
                      ),
                    );
                } else if (dangPhong) {
                  const dx = e.clientX - cu.x;
                  const dy = e.clientY - cu.y;
                  setZoom((c) =>
                    kepMep(anhRef.current, {
                      z: c.z,
                      x: c.x + dx,
                      y: c.y + dy,
                    }),
                  );
                }
                ds.set(e.pointerId, { x: e.clientX, y: e.clientY });
              }}
              onPointerUp={thaTay}
              onPointerCancel={thaTay}
            />

            {/* Bảng chỉnh mức phóng: khách tự chọn mức nào cũng được, không cố định sẵn */}
            <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-bg p-1 text-fg">
              <button
                type="button"
                onClick={() => datZoom((z) => z - 0.5)}
                disabled={!dangPhong}
                aria-label="Thu nhỏ"
                className="grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-40"
              >
                <MinusIcon width={18} height={18} />
              </button>
              <input
                type="range"
                min={1}
                max={ZOOM_MAX}
                step={0.1}
                value={zoom.z}
                onChange={(e) => datZoom(Number(e.target.value))}
                aria-label="Mức phóng to"
                aria-valuetext={`${Math.round(zoom.z * 100)}%`}
                className="w-20 cursor-pointer accent-primary sm:w-32"
              />
              <button
                type="button"
                onClick={() => datZoom((z) => z + 0.5)}
                disabled={zoom.z >= ZOOM_MAX}
                aria-label="Phóng to"
                className="grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-40"
              >
                <PlusIcon width={18} height={18} />
              </button>
              <span className="w-11 text-center text-xs font-semibold tabular-nums">
                {Math.round(zoom.z * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom(GOC)}
                disabled={!dangPhong}
                aria-label="Về cỡ vừa khung"
                className="grid size-9 cursor-pointer place-items-center rounded-full transition-colors hover:bg-surface-2 disabled:cursor-default disabled:opacity-40"
              >
                <RefreshIcon width={16} height={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={dong}
              aria-label="Đóng ảnh phóng to"
              autoFocus
              className="absolute right-4 top-4 grid size-12 cursor-pointer place-items-center rounded-full bg-bg text-fg transition-transform hover:scale-105"
            >
              <CloseIcon width={22} height={22} />
            </button>

            {/*
              Nút chuyển ảnh. Điện thoại: gom xuống thanh dưới cùng, hai bên
              số thứ tự — đặt giữa hai mép thì đè lên ảnh, che mất đúng chỗ
              khách cần soi. Màn hình rộng: ảnh không chạm tới mép nên để hai
              bên như thường lệ.
            */}
            {nhieuAnh && (
              <div className="pointer-events-none absolute inset-x-0 bottom-5 flex items-center justify-center gap-3 sm:inset-x-4 sm:inset-y-0 sm:justify-between">
                <button
                  type="button"
                  onClick={() => chuyen(-1)}
                  aria-label="Ảnh trước"
                  className="pointer-events-auto grid size-12 cursor-pointer place-items-center rounded-full bg-bg text-fg transition-transform hover:scale-105"
                >
                  <ChevronLeftIcon width={24} height={24} />
                </button>
                <p className="rounded-full bg-bg px-4 py-1.5 text-sm font-semibold text-fg sm:absolute sm:bottom-5 sm:left-1/2 sm:-translate-x-1/2">
                  {phongTo + 1} / {anhs.length}
                </p>
                <button
                  type="button"
                  onClick={() => chuyen(1)}
                  aria-label="Ảnh tiếp theo"
                  className="pointer-events-auto grid size-12 cursor-pointer place-items-center rounded-full bg-bg text-fg transition-transform hover:scale-105"
                >
                  <ChevronRightIcon width={24} height={24} />
                </button>
              </div>
            )}
          </div>,
          document.body,
        )}
    </>
  );
}
