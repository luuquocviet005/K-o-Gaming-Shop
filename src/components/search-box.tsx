"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { products } from "@/lib/products";
import { formatVND } from "@/lib/format";
import { ProductMedia } from "@/components/product-art";
import { CloseIcon, SearchIcon } from "@/components/icons";

/** Bỏ dấu tiếng Việt để gõ "ban phim" vẫn ra "bàn phím" */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d");
}

const MAX_RESULTS = 6;

/**
 * Tìm kiếm chạy hoàn toàn trên trình duyệt (không cần server).
 * Hỗ trợ điều hướng bằng bàn phím: ↑ ↓ để chọn, Enter để mở, Esc để đóng.
 */
export function SearchBox({
  className = "",
  autoFocus = false,
  onNavigate,
}: {
  className?: string;
  autoFocus?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return products
      .filter((p) =>
        normalize(`${p.name} ${p.brand} ${p.summary}`).includes(q),
      )
      .slice(0, MAX_RESULTS);
  }, [query]);

  useEffect(() => setActive(0), [query]);

  // Bấm ra ngoài thì đóng gợi ý
  useEffect(() => {
    function onPointerDown(e: PointerEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function go(slug: string) {
    setOpen(false);
    setQuery("");
    onNavigate?.();
    router.push(`/san-pham/${slug}/`);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active].slug);
    }
  }

  const showPanel = open && query.trim().length >= 2;

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <div className="relative">
        <SearchIcon
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-fg-subtle"
          width={19}
          height={19}
        />
        <input
          type="search"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Tìm chuột, bàn phím, tai nghe…"
          aria-label="Tìm kiếm sản phẩm"
          aria-expanded={showPanel}
          aria-controls={showPanel ? listId : undefined}
          aria-autocomplete="list"
          role="combobox"
          className="h-12 w-full rounded-full border border-border bg-surface-2 pl-11 pr-11 text-sm text-fg transition-colors duration-200 placeholder:text-fg-subtle focus:border-primary focus:bg-surface focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            aria-label="Xoá từ khoá tìm kiếm"
            className="absolute right-3 top-1/2 grid size-7 -translate-y-1/2 cursor-pointer place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface-3 hover:text-fg"
          >
            <CloseIcon width={16} height={16} />
          </button>
        )}
      </div>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          aria-label="Kết quả tìm kiếm"
          className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 overflow-hidden rounded-3xl border border-border bg-surface p-2 shadow-[0_24px_60px_-24px_rgba(11,21,18,0.5)]"
        >
          {results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-fg-muted">
              Không tìm thấy sản phẩm nào cho “{query.trim()}”.
            </p>
          ) : (
            <ul className="flex flex-col">
              {results.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === active}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(p.slug)}
                    className={`flex w-full cursor-pointer items-center gap-3 rounded-2xl p-2 text-left transition-colors duration-150 ${
                      i === active ? "bg-surface-2" : ""
                    }`}
                  >
                    <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-3 p-1.5">
                      <ProductMedia product={p} sizes="48px" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-fg">
                        {p.name}
                      </span>
                      <span className="block text-xs text-fg-muted">{p.brand}</span>
                    </span>
                    <span className="shrink-0 text-sm font-bold text-primary-ink">
                      {formatVND(p.price)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
