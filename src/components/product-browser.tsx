"use client";

import { useMemo, useState } from "react";
import type { CardProduct } from "@/lib/products";
import { formatVND } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { CloseIcon, SlidersIcon } from "@/components/icons";

type SortKey = "noi-bat" | "gia-tang" | "gia-giam" | "ten";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "noi-bat", label: "Nổi bật" },
  { key: "gia-tang", label: "Giá thấp → cao" },
  { key: "gia-giam", label: "Giá cao → thấp" },
  { key: "ten", label: "Tên A → Z" },
];

const priceBands = [
  { key: "d0", label: "Dưới 500 nghìn", min: 0, max: 500_000 },
  { key: "d1", label: "500 nghìn – 1 triệu", min: 500_000, max: 1_000_000 },
  { key: "d2", label: "1 – 2 triệu", min: 1_000_000, max: 2_000_000 },
  { key: "d3", label: "Trên 2 triệu", min: 2_000_000, max: Infinity },
];

const nhomTinhTrang = [
  { key: "moi", label: "Hàng mới" },
  { key: "cu", label: "Hàng cũ (2nd)" },
];

/**
 * Các nhóm lọc ngắn (2–4 lựa chọn) không cần cuộn.
 * Trên mobile giãn ra cho dễ chạm, lên desktop siết lại để nhường chỗ cho hãng.
 */
const optionListClass = "mt-2 flex flex-col gap-2 lg:mt-1.5 lg:gap-0.5";

/**
 * Danh sách hãng (tới ~29 hãng) là phần duy nhất có vùng cuộn riêng.
 * Trên desktop nó là flex item co giãn trong cột lọc cao bằng màn hình, nên tự
 * ăn hết chỗ trống còn lại — màn hình càng cao càng hiện nhiều hãng.
 * `min-h-40`: sàn ~5 hãng, để màn laptop thấp không bóp danh sách còn 2–3 dòng;
 * chạm sàn thì cột lọc tự cuộn (`lg:overflow-y-auto`) thay vì cắt cụt.
 * `overscroll-contain`: cuộn hết danh sách thì dừng, không đẩy tiếp cả trang.
 */
const hangListClass =
  "mt-2 flex max-h-80 flex-col gap-2 overflow-y-auto overscroll-contain pr-1 lg:mt-1.5 lg:max-h-none lg:min-h-40 lg:flex-1 lg:gap-0.5";

export function ProductBrowser({ items }: { items: CardProduct[] }) {
  const [sort, setSort] = useState<SortKey>("noi-bat");
  const [hangs, setHangs] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [tinhTrangs, setTinhTrangs] = useState<string[]>([]);
  const [diaDiems, setDiaDiems] = useState<string[]>([]);
  const [conHangThoi, setConHangThoi] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allHangs = useMemo(
    () =>
      [...new Set(items.map((p) => p.hang))].sort((a, b) => a.localeCompare(b, "vi")),
    [items],
  );

  const allDiaDiems = useMemo(
    () =>
      [...new Set(items.map((p) => p.diaDiem))]
        .filter(Boolean)
        .sort((a, b) => a.localeCompare(b, "vi")),
    [items],
  );

  const filtered = useMemo(() => {
    const chosenBands = priceBands.filter((b) => bands.includes(b.key));

    const result = items.filter((p) => {
      if (hangs.length && !hangs.includes(p.hang)) return false;
      if (diaDiems.length && !diaDiems.includes(p.diaDiem)) return false;
      if (tinhTrangs.length && !tinhTrangs.includes(p.nhomTinhTrang)) return false;
      if (conHangThoi && p.soLuong <= 0) return false;
      // Nhiều khoảng giá được chọn = hợp (OR), giống cách các sàn TMĐT làm.
      // Món chưa có giá không thuộc khoảng nào nên bị loại khi đang lọc giá.
      if (chosenBands.length && !chosenBands.some((b) => p.gia >= b.min && p.gia < b.max))
        return false;
      return true;
    });

    switch (sort) {
      case "gia-tang":
        return [...result].sort((a, b) => a.gia - b.gia);
      case "gia-giam":
        return [...result].sort((a, b) => b.gia - a.gia);
      case "ten":
        return [...result].sort((a, b) => a.ten.localeCompare(b.ten, "vi"));
      default:
        // Nổi bật: còn hàng lên trước, rồi tới hàng mới, rồi giá cao
        return [...result].sort(
          (a, b) =>
            Number(b.soLuong > 0) - Number(a.soLuong > 0) ||
            Number(b.nhomTinhTrang === "moi") - Number(a.nhomTinhTrang === "moi") ||
            b.gia - a.gia,
        );
    }
  }, [items, hangs, bands, tinhTrangs, diaDiems, conHangThoi, sort]);

  const activeCount =
    hangs.length + bands.length + tinhTrangs.length + diaDiems.length + (conHangThoi ? 1 : 0);

  const toggle =
    (set: React.Dispatch<React.SetStateAction<string[]>>) => (value: string) =>
      set((prev) =>
        prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
      );

  function clearAll() {
    setHangs([]);
    setBands([]);
    setTinhTrangs([]);
    setDiaDiems([]);
    setConHangThoi(false);
  }

  const giaThapNhat = filtered.filter((p) => p.gia > 0).map((p) => p.gia);

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_1fr] lg:items-start">
      {/* ── Bộ lọc ── */}
      <div className="lg:sticky lg:top-28">
        <button
          type="button"
          onClick={() => setFiltersOpen((v) => !v)}
          aria-expanded={filtersOpen}
          className="flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-2xl border border-border bg-surface px-5 text-sm font-semibold text-fg lg:hidden"
        >
          <span className="inline-flex items-center gap-2">
            <SlidersIcon width={18} height={18} />
            Bộ lọc
          </span>
          {activeCount > 0 && (
            <span className="grid size-6 place-items-center rounded-full bg-primary text-xs font-bold text-on-primary">
              {activeCount}
            </span>
          )}
        </button>

        <div
          className={`${filtersOpen ? "block" : "hidden"} mt-3 space-y-4 rounded-[1.5rem] border border-border bg-surface p-5 lg:mt-0 lg:flex lg:max-h-[calc(100vh-8rem)] lg:flex-col lg:space-y-3 lg:overflow-y-auto`}
        >
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-primary-ink transition-opacity hover:opacity-70"
            >
              <CloseIcon width={14} height={14} />
              Xoá {activeCount} bộ lọc
            </button>
          )}

          <fieldset>
            <legend className="font-display text-sm font-bold text-fg">
              Tình trạng
            </legend>
            <div className={optionListClass}>
              {nhomTinhTrang.map((t) => (
                <Choice
                  key={t.key}
                  checked={tinhTrangs.includes(t.key)}
                  onChange={() => toggle(setTinhTrangs)(t.key)}
                >
                  {t.label}
                </Choice>
              ))}
              <Choice checked={conHangThoi} onChange={() => setConHangThoi((v) => !v)}>
                Chỉ hiện món còn hàng
              </Choice>
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-sm font-bold text-fg">
              Khoảng giá
            </legend>
            <div className={optionListClass}>
              {priceBands.map((b) => (
                <Choice
                  key={b.key}
                  checked={bands.includes(b.key)}
                  onChange={() => toggle(setBands)(b.key)}
                >
                  {b.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          {allDiaDiems.length > 1 && (
            <fieldset>
              <legend className="font-display text-sm font-bold text-fg">
                Hàng đang ở
              </legend>
              <div className={optionListClass}>
                {allDiaDiems.map((d) => (
                  <Choice
                    key={d}
                    checked={diaDiems.includes(d)}
                    onChange={() => toggle(setDiaDiems)(d)}
                  >
                    {d}
                  </Choice>
                ))}
              </div>
            </fieldset>
          )}

          {/*
            Nhóm này dùng div + role="group" thay cho fieldset/legend: trình duyệt
            dựng một hộp ẩn bên trong fieldset nên `flex-1` không truyền được
            chiều cao xuống danh sách con — danh sách hãng sẽ tràn ra ngoài cột
            lọc. role="group" + aria-labelledby cho ra đúng ngữ nghĩa như fieldset.
          */}
          <div
            role="group"
            aria-labelledby="nhan-loc-hang"
            className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
          >
            <p
              id="nhan-loc-hang"
              className="flex items-baseline justify-between gap-2 font-display text-sm font-bold text-fg"
            >
              Hãng
              <span className="font-sans text-xs font-medium text-fg-subtle">
                {allHangs.length} hãng
              </span>
            </p>
            <div className={hangListClass}>
              {allHangs.map((h) => (
                <Choice
                  key={h}
                  checked={hangs.includes(h)}
                  onChange={() => toggle(setHangs)(h)}
                >
                  {h}
                </Choice>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Kết quả ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg-muted" role="status" aria-live="polite">
            <strong className="font-semibold text-fg">{filtered.length}</strong> sản
            phẩm
            {giaThapNhat.length > 0 && (
              <>
                {" · từ "}
                <strong className="font-semibold text-fg">
                  {formatVND(Math.min(...giaThapNhat))}
                </strong>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="sap-xep" className="text-sm text-fg-muted">
              Sắp xếp:
            </label>
            <select
              id="sap-xep"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="h-11 cursor-pointer rounded-full border border-border bg-surface px-4 pr-8 text-sm font-semibold text-fg focus:border-primary focus:outline-none"
            >
              {sortOptions.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-dashed border-border-strong bg-surface p-12 text-center">
            <p className="font-display text-lg font-bold text-fg">
              Không có sản phẩm nào khớp bộ lọc
            </p>
            <p className="mt-2 text-sm text-fg-muted">
              Thử bỏ bớt một vài điều kiện xem sao.
            </p>
            <button
              type="button"
              onClick={clearAll}
              className="mt-6 inline-flex h-12 cursor-pointer items-center rounded-full bg-primary px-7 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
            >
              Xoá tất cả bộ lọc
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 xl:grid-cols-3">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} priority={i < 3} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Choice({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: () => void;
  children: React.ReactNode;
}) {
  return (
    // Mobile giữ đủ 44px cho ngón tay; desktop dùng chuột nên siết còn 32px.
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 py-1 text-sm leading-snug text-fg-muted transition-colors hover:bg-surface-2 has-checked:text-fg lg:min-h-8 lg:gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4.5 shrink-0 cursor-pointer accent-[var(--primary)]"
      />
      {children}
    </label>
  );
}
