"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatVND } from "@/lib/format";
import { site } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { MinusIcon, PlusIcon, TruckIcon } from "@/components/icons";

/**
 * Khối chọn mua: phiên bản → số lượng → thêm vào giỏ.
 * Giá hiển thị cập nhật ngay khi đổi phiên bản, để khách không bị bất ngờ
 * ở bước thanh toán.
 */
export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [variantId, setVariantId] = useState(product.variants?.[0]?.id);
  const [qty, setQty] = useState(1);

  const variant = product.variants?.find((v) => v.id === variantId);
  const unitPrice = product.price + (variant?.priceDelta ?? 0);
  const oldUnitPrice = product.oldPrice
    ? product.oldPrice + (variant?.priceDelta ?? 0)
    : undefined;
  const lineTotal = unitPrice * qty;
  const freeShip = lineTotal >= site.shipping.freeThreshold;
  const soldOut = product.stock === 0;

  function buyNow() {
    addItem(product.id, variantId, qty);
    router.push("/gio-hang/");
  }

  return (
    <div className="mt-6">
      {/* Giá */}
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight text-fg">
          {formatVND(unitPrice)}
        </span>
        {oldUnitPrice && (
          <>
            <span className="text-lg text-fg-subtle line-through">
              {formatVND(oldUnitPrice)}
            </span>
            <span className="rounded-full bg-candy-soft px-3 py-1 text-sm font-bold text-candy-ink">
              Tiết kiệm {formatVND(oldUnitPrice - unitPrice)}
            </span>
          </>
        )}
      </div>

      {/* Phiên bản */}
      {product.variants && product.variants.length > 0 && (
        <fieldset className="mt-7">
          <legend className="font-display text-sm font-bold text-fg">
            {product.variantLabel ?? "Phiên bản"}
            <span className="ml-2 font-sans font-medium text-fg-muted">
              {variant?.name}
            </span>
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const selected = v.id === variantId;
              return (
                <label
                  key={v.id}
                  className={`inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border px-5 text-sm font-semibold transition-all duration-200 ${
                    selected
                      ? "border-primary bg-primary-soft text-primary-ink"
                      : "border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg"
                  }`}
                >
                  <input
                    type="radio"
                    name="phien-ban"
                    value={v.id}
                    checked={selected}
                    onChange={() => setVariantId(v.id)}
                    className="sr-only"
                  />
                  {v.name}
                  {v.priceDelta > 0 && (
                    <span className="text-xs font-medium opacity-70">
                      +{formatVND(v.priceDelta)}
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      {/* Số lượng */}
      <div className="mt-7 flex flex-wrap items-center gap-5">
        <div>
          <p id="nhan-so-luong" className="font-display text-sm font-bold text-fg">
            Số lượng
          </p>
          <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              disabled={qty <= 1}
              aria-label="Giảm số lượng"
              className="grid size-11 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <MinusIcon width={18} height={18} />
            </button>
            <output
              aria-labelledby="nhan-so-luong"
              className="min-w-10 text-center font-display text-lg font-bold text-fg"
            >
              {qty}
            </output>
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
              disabled={qty >= product.stock}
              aria-label="Tăng số lượng"
              className="grid size-11 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
            >
              <PlusIcon width={18} height={18} />
            </button>
          </div>
        </div>

        <div className="pt-8">
          {soldOut ? (
            <p className="text-sm font-semibold text-danger">Tạm hết hàng</p>
          ) : product.stock <= 5 ? (
            <p className="text-sm font-semibold text-warning">
              Chỉ còn {product.stock} sản phẩm
            </p>
          ) : (
            <p className="text-sm font-semibold text-primary-ink">
              Còn hàng · giao trong 24 giờ
            </p>
          )}
          {qty > 1 && (
            <p className="mt-1 text-sm text-fg-muted">
              Tạm tính:{" "}
              <strong className="font-semibold text-fg">{formatVND(lineTotal)}</strong>
            </p>
          )}
        </div>
      </div>

      {/* Hành động */}
      <div className="mt-7 flex flex-wrap gap-3">
        {soldOut ? (
          <p className="rounded-2xl bg-surface-2 px-6 py-4 text-sm text-fg-muted">
            Sản phẩm đang hết hàng. Gọi{" "}
            <a
              href={site.contact.phoneHref}
              className="font-semibold text-primary-ink underline"
            >
              {site.contact.phone}
            </a>{" "}
            để được báo khi có hàng lại.
          </p>
        ) : (
          <>
            <AddToCartButton
              productId={product.id}
              variantId={variantId}
              quantity={qty}
              productName={product.name}
              className="flex-1 sm:flex-none"
            />
            <button
              type="button"
              onClick={buyNow}
              className="inline-flex h-14 flex-1 cursor-pointer items-center justify-center rounded-full border border-border-strong bg-surface px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97] sm:flex-none"
            >
              Mua ngay
            </button>
          </>
        )}
      </div>

      {/* Nhắc miễn phí ship — động theo giá trị đơn */}
      <p className="mt-5 inline-flex items-center gap-2.5 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-fg-muted">
        <TruckIcon width={19} height={19} className="shrink-0 text-primary" />
        {freeShip ? (
          <span>
            Đơn này được <strong className="font-semibold text-fg">miễn phí vận chuyển</strong>.
          </span>
        ) : (
          <span>
            Mua thêm{" "}
            <strong className="font-semibold text-fg">
              {formatVND(site.shipping.freeThreshold - lineTotal)}
            </strong>{" "}
            để được miễn phí vận chuyển.
          </span>
        )}
      </p>
    </div>
  );
}
