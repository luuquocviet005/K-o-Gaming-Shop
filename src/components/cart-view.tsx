"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/lib/cart";
import { formatVND } from "@/lib/format";
import { site } from "@/lib/site";
import { ProductMedia } from "@/components/product-art";
import {
  ArrowRightIcon,
  CartIcon,
  CheckIcon,
  CloseIcon,
  MinusIcon,
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  TruckIcon,
} from "@/components/icons";

export function CartView() {
  const { ready, lines, itemCount, subtotal, total, setQuantity, removeItem, clear } =
    useCart();

  const [copied, setCopied] = useState(false);

  // Trước khi đọc xong localStorage, giữ chỗ bằng khung xám để tránh nháy layout
  if (!ready) {
    return (
      <div className="mt-8 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-32 animate-pulse rounded-[1.5rem] border border-border bg-surface-2"
            />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-[1.5rem] border border-border bg-surface-2" />
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-10 rounded-[2rem] border border-dashed border-border-strong bg-surface p-12 text-center sm:p-16">
        <span className="mx-auto grid size-20 place-items-center rounded-full bg-primary-soft text-primary-ink">
          <CartIcon width={34} height={34} />
        </span>
        <h2 className="mt-6 font-display text-2xl font-extrabold text-fg">
          Giỏ hàng đang trống
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-fg-muted">
          Chưa có món nào cả. Ghé xem những sản phẩm được anh em chốt đơn nhiều
          nhất nhé.
        </p>
        <Link
          href="/danh-muc/"
          className="mt-8 inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
        >
          Bắt đầu mua sắm
          <ArrowRightIcon width={20} height={20} />
        </Link>
      </div>
    );
  }

  /** Soạn nội dung đơn hàng để khách gửi qua Zalo / đọc qua điện thoại */
  const orderText = [
    `Đơn hàng từ ${site.name}`,
    "",
    ...lines.map(
      (l, i) =>
        `${i + 1}. ${l.product.hang} ${l.product.ten}${l.product.tinhTrang ? ` (${l.product.tinhTrang})` : ""} × ${l.quantity} — ${formatVND(l.lineTotal)}`,
    ),
    "",
    `TỔNG TIỀN HÀNG: ${formatVND(total)}`,
    `(Chuyển khoản đủ thì shop chịu ship. ${site.shipping.ghiChuCod})`,
  ].join("\n");

  async function copyOrder() {
    try {
      await navigator.clipboard.writeText(orderText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.6fr_1fr]">
      {/* ── Danh sách sản phẩm ── */}
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-fg-muted">
            <strong className="font-semibold text-fg">{itemCount}</strong> sản phẩm
          </p>
          <button
            type="button"
            onClick={clear}
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 text-sm font-semibold text-fg-muted transition-colors hover:text-danger"
          >
            <TrashIcon width={16} height={16} />
            Xoá tất cả
          </button>
        </div>

        <ul className="mt-3 flex flex-col gap-3">
          {lines.map((l) => (
            <li
              key={l.key}
              className="flex gap-4 rounded-[1.5rem] border border-border bg-surface p-4"
            >
              <Link
                href={`/san-pham/${l.product.slug}/`}
                className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl bg-surface-2 p-2 transition-transform duration-300 hover:scale-105 sm:size-28"
                aria-label={`Xem ${l.product.ten}`}
              >
                <ProductMedia product={l.product} sizes="112px" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
                      {l.product.hang}
                    </p>
                    <h2 className="mt-0.5 text-[0.95rem] font-semibold leading-snug text-fg">
                      <Link
                        href={`/san-pham/${l.product.slug}/`}
                        className="line-clamp-2x transition-colors hover:text-primary-ink"
                      >
                        {l.product.ten}
                      </Link>
                    </h2>
                    {l.product.tinhTrang && (
                      <p className="mt-1 text-sm text-fg-muted">
                        {l.product.tinhTrang} · {l.product.diaDiem}
                      </p>
                    )}
                    {l.product.note && (
                      <p className="mt-1 text-xs text-candy-ink">{l.product.note}</p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(l.key)}
                    aria-label={`Xoá ${l.product.ten} khỏi giỏ hàng`}
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg-subtle transition-colors hover:bg-surface-2 hover:text-danger"
                  >
                    <CloseIcon width={18} height={18} />
                  </button>
                </div>

                <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                  <div className="inline-flex items-center gap-1 rounded-full border border-border p-0.5">
                    <button
                      type="button"
                      onClick={() => setQuantity(l.key, l.quantity - 1)}
                      aria-label={`Giảm số lượng ${l.product.ten}`}
                      className="grid size-10 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2"
                    >
                      <MinusIcon width={17} height={17} />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold text-fg">
                      {l.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(l.key, l.quantity + 1)}
                      disabled={l.quantity >= l.product.soLuong}
                      aria-label={`Tăng số lượng ${l.product.ten}`}
                      className="grid size-10 cursor-pointer place-items-center rounded-full bg-primary text-on-primary transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <PlusIcon width={17} height={17} />
                    </button>
                  </div>

                  <div className="text-right">
                    {l.quantity > 1 && (
                      <p className="text-xs text-fg-subtle">
                        {formatVND(l.unitPrice)} × {l.quantity}
                      </p>
                    )}
                    <p className="font-display text-lg font-extrabold text-fg">
                      {formatVND(l.lineTotal)}
                    </p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/danh-muc/"
          className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-primary-ink transition-opacity hover:opacity-75"
        >
          <ArrowRightIcon width={17} height={17} className="rotate-180" />
          Tiếp tục mua sắm
        </Link>
      </div>

      {/* ── Tóm tắt đơn ── */}
      <aside className="rounded-[1.75rem] border border-border bg-surface p-6 lg:sticky lg:top-28">
        <h2 className="font-display text-lg font-extrabold text-fg">
          Tóm tắt đơn hàng
        </h2>

        {/* Các dòng tiền.
            Không có dòng "phí vận chuyển" vì phí tuỳ nhà xe và tuỳ tỉnh —
            ghi một con số ở đây rồi thu khác là tự đẩy mình vào thế khó. */}
        <dl className="mt-5 space-y-3 border-t border-border pt-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-fg-muted">
              Tiền hàng ({itemCount} món)
            </dt>
            <dd className="font-semibold text-fg">{formatVND(subtotal)}</dd>
          </div>

          <div className="flex items-baseline justify-between gap-4 border-t border-border pt-4">
            <dt className="font-display text-base font-bold text-fg">Tổng cộng</dt>
            <dd className="font-display text-2xl font-extrabold text-fg">
              {formatVND(total)}
            </dd>
          </div>
        </dl>

        <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-primary-soft p-3.5 text-xs leading-relaxed text-primary-ink">
          <TruckIcon width={17} height={17} className="mt-px shrink-0" />
          <span>
            <strong className="font-semibold">Chuyển khoản đủ thì shop chịu ship.</strong>{" "}
            {site.shipping.ghiChuCod}
          </span>
        </p>

        {/* Đặt hàng — gửi qua Zalo hoặc gọi điện, không cần cổng thanh toán */}
        <div className="mt-6 space-y-2.5">
          <a
            href={site.social.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-14 w-full items-center justify-center gap-2.5 rounded-full bg-primary px-6 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.98]"
          >
            Đặt hàng qua Zalo · {formatVND(total)}
          </a>

          <a
            href={site.contact.phoneHref}
            className="flex h-13 w-full items-center justify-center gap-2.5 rounded-full border border-border-strong bg-bg px-6 py-3.5 text-sm font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.98]"
          >
            <PhoneIcon width={18} height={18} />
            Gọi đặt hàng {site.contact.phone}
          </a>

          <button
            type="button"
            onClick={copyOrder}
            className="flex h-13 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full px-6 py-3.5 text-sm font-semibold text-fg-muted transition-colors hover:text-fg"
          >
            {copied ? (
              <>
                <CheckIcon width={18} height={18} className="text-primary-ink" />
                Đã sao chép đơn hàng
              </>
            ) : (
              "Sao chép nội dung đơn hàng"
            )}
          </button>
          <span role="status" aria-live="polite" className="sr-only">
            {copied ? "Đã sao chép nội dung đơn hàng vào bộ nhớ tạm" : ""}
          </span>
        </div>

        <p className="mt-4 text-center text-xs leading-relaxed text-fg-subtle">
          Nhắn tin hoặc gọi để chốt đơn — tụi mình xác nhận tồn kho và thời gian
          giao trước khi bạn thanh toán.
        </p>
      </aside>
    </div>
  );
}
