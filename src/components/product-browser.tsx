"use client";

import { useMemo, useState } from "react";
import type { CardProduct } from "@/lib/products";
import { discountPercent } from "@/lib/products";
import { formatVND } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { CloseIcon, SlidersIcon } from "@/components/icons";

type SortKey = "noi-bat" | "gia-tang" | "gia-giam" | "danh-gia" | "ban-chay";

const sortOptions: { key: SortKey; label: string }[] = [
  { key: "noi-bat", label: "Nổi bật" },
  { key: "ban-chay", label: "Bán chạy" },
  { key: "gia-tang", label: "Giá thấp → cao" },
  { key: "gia-giam", label: "Giá cao → thấp" },
  { key: "danh-gia", label: "Đánh giá cao" },
];

/**
 * Danh sách lựa chọn có vùng cuộn riêng.
 *
 * Danh mục "Tất cả" có tới 18 thương hiệu — để tràn hết ra sẽ kéo cột lọc dài
 * gấp mấy lần khung màn hình, người dùng phải cuộn rất lâu mới tới lưới sản
 * phẩm. Giới hạn chiều cao rồi cho cuộn trong khung giữ cột lọc luôn gọn.
 *
 * `overscroll-contain`: cuộn hết danh sách thì DỪNG, không đẩy tiếp cả trang.
 */
const optionListClass =
  "mt-3 flex max-h-56 flex-col gap-1.5 overflow-y-auto overscroll-contain pr-1";

const priceBands: { key: string; label: string; min: number; max: number }[] = [
  { key: "d1", label: "Dưới 1 triệu", min: 0, max: 1_000_000 },
  { key: "d2", label: "1 – 3 triệu", min: 1_000_000, max: 3_000_000 },
  { key: "d3", label: "3 – 6 triệu", min: 3_000_000, max: 6_000_000 },
  { key: "d4", label: "Trên 6 triệu", min: 6_000_000, max: Infinity },
];

/**
 * Lọc và sắp xếp sản phẩm — chạy hoàn toàn trên trình duyệt.
 * Bộ lọc là các nút bật/tắt (không phải dropdown ẩn) để thấy ngay
 * đang lọc theo gì và bỏ lọc chỉ bằng một cú bấm.
 */
export function ProductBrowser({ items }: { items: CardProduct[] }) {
  const [sort, setSort] = useState<SortKey>("noi-bat");
  const [brands, setBrands] = useState<string[]>([]);
  const [bands, setBands] = useState<string[]>([]);
  const [onlySale, setOnlySale] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allBrands = useMemo(
    () => [...new Set(items.map((p) => p.brand))].sort((a, b) => a.localeCompare(b, "vi")),
    [items],
  );

  const filtered = useMemo(() => {
    const chosen = priceBands.filter((b) => bands.includes(b.key));
    const result = items.filter((p) => {
      if (brands.length && !brands.includes(p.brand)) return false;
      // Nhiều khoảng giá được chọn = hợp (OR), giống cách các sàn TMĐT làm
      if (chosen.length && !chosen.some((b) => p.price >= b.min && p.price < b.max))
        return false;
      if (onlySale && !p.oldPrice) return false;
      return true;
    });

    switch (sort) {
      case "gia-tang":
        return [...result].sort((a, b) => a.price - b.price);
      case "gia-giam":
        return [...result].sort((a, b) => b.price - a.price);
      case "danh-gia":
        return [...result].sort((a, b) => b.rating - a.rating || b.sold - a.sold);
      case "ban-chay":
        return [...result].sort((a, b) => b.sold - a.sold);
      default:
        // Nổi bật: hàng hot trước, rồi tới mức giảm giá sâu nhất
        return [...result].sort(
          (a, b) =>
            Number(!!b.isHot) - Number(!!a.isHot) ||
            discountPercent(b) - discountPercent(a) ||
            b.sold - a.sold,
        );
    }
  }, [items, brands, bands, onlySale, sort]);

  const activeCount = brands.length + bands.length + (onlySale ? 1 : 0);

  function toggleBrand(brand: string) {
    setBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand],
    );
  }

  function toggleBand(key: string) {
    setBands((prev) =>
      prev.includes(key) ? prev.filter((b) => b !== key) : [...prev, key],
    );
  }

  function clearAll() {
    setBrands([]);
    setBands([]);
    setOnlySale(false);
  }

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
          className={`${filtersOpen ? "block" : "hidden"} mt-3 space-y-6 rounded-[1.5rem] border border-border bg-surface p-5 lg:mt-0 lg:block`}
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
              Khoảng giá
            </legend>
            <div className={optionListClass}>
              {priceBands.map((b) => (
                <Choice
                  key={b.key}
                  checked={bands.includes(b.key)}
                  onChange={() => toggleBand(b.key)}
                >
                  {b.label}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="flex items-baseline justify-between gap-2 font-display text-sm font-bold text-fg">
              Thương hiệu
              <span className="font-sans text-xs font-medium text-fg-subtle">
                {allBrands.length} hãng
              </span>
            </legend>
            <div className={optionListClass}>
              {allBrands.map((b) => (
                <Choice
                  key={b}
                  checked={brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                >
                  {b}
                </Choice>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="font-display text-sm font-bold text-fg">
              Khuyến mãi
            </legend>
            <div className="mt-3">
              <Choice
                checked={onlySale}
                onChange={() => setOnlySale((v) => !v)}
              >
                Chỉ hiện hàng đang giảm giá
              </Choice>
            </div>
          </fieldset>
        </div>
      </div>

      {/* ── Kết quả ── */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-fg-muted" role="status" aria-live="polite">
            <strong className="font-semibold text-fg">{filtered.length}</strong> sản
            phẩm
            {filtered.length > 0 && (
              <>
                {" · từ "}
                <strong className="font-semibold text-fg">
                  {formatVND(Math.min(...filtered.map((p) => p.price)))}
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
    <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 text-sm text-fg-muted transition-colors hover:bg-surface-2 has-checked:text-fg">
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
