"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { formatGia, formatVND, moTaTonKho } from "@/lib/format";
import { site } from "@/lib/site";
import { useCart } from "@/lib/cart";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { InfoIcon, MinusIcon, PhoneIcon, PlusIcon } from "@/components/icons";

/**
 * Khối chọn mua.
 *
 * Không có phần chọn phiên bản như shop hàng mới, vì đây là hàng cũ — mỗi
 * dòng trong Sheet là MỘT món cụ thể với tình trạng riêng, không phải một mẫu
 * có nhiều biến thể.
 */
export function ProductPurchase({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  const hetHang = product.soLuong <= 0;
  const chuaCoGia = product.gia === 0;
  const tonKho = moTaTonKho(product);
  const tongTien = product.gia * qty;

  function buyNow() {
    addItem(product.id, qty);
    router.push("/gio-hang/");
  }

  return (
    <div className="mt-6">
      <div className="flex flex-wrap items-baseline gap-3">
        <span className="font-display text-4xl font-extrabold tracking-tight text-fg">
          {formatGia(product)}
        </span>
        {product.donViGia && (
          <span className="text-sm text-fg-muted">
            giá cho 1 {product.donViGia}
          </span>
        )}
      </div>

      {/* Sheet ghi khoảng giá thì nói thẳng là giá còn tuỳ, đừng để khách đoán */}
      {product.ghiChuGia && (
        <p className="mt-3 flex gap-2.5 rounded-2xl bg-surface-2 px-4 py-3 text-sm text-fg-muted">
          <InfoIcon width={18} height={18} className="mt-px shrink-0 text-candy-ink" />
          <span>
            Giá ghi trong bảng hàng là{" "}
            <strong className="font-semibold text-fg">{product.ghiChuGia}</strong> — mức
            cuối tuỳ tình trạng và phụ kiện đi kèm, nhắn tin để chốt chính xác.
          </span>
        </p>
      )}

      {/* Ghi chú tình trạng — đặt ngay dưới giá vì đây là thứ quyết định mua hay không */}
      {product.note && (
        <div className="mt-4 rounded-2xl border border-candy/30 bg-candy-soft px-4 py-3.5">
          <p className="text-xs font-bold uppercase tracking-wider text-candy-ink">
            Tình trạng thực tế
          </p>
          <p className="mt-1.5 whitespace-pre-line text-[0.95rem] leading-relaxed text-fg">
            {product.note}
          </p>
        </div>
      )}

      <div className="mt-7 flex flex-wrap items-center gap-5">
        {!hetHang && !chuaCoGia && (
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
                onClick={() => setQty((q) => Math.min(product.soLuong, q + 1))}
                disabled={qty >= product.soLuong}
                aria-label="Tăng số lượng"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 disabled:cursor-not-allowed disabled:opacity-35"
              >
                <PlusIcon width={18} height={18} />
              </button>
            </div>
          </div>
        )}

        <div className={hetHang || chuaCoGia ? "" : "pt-8"}>
          <p
            className={`text-sm font-semibold ${
              tonKho.mau === "het"
                ? "text-danger"
                : tonKho.mau === "sapHet"
                  ? "text-candy-ink"
                  : "text-primary-ink"
            }`}
          >
            {tonKho.chu}
          </p>
          {qty > 1 && (
            <p className="mt-1 text-sm text-fg-muted">
              Tạm tính:{" "}
              <strong className="font-semibold text-fg">{formatVND(tongTien)}</strong>
            </p>
          )}
        </div>
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {hetHang ? (
          <p className="rounded-2xl bg-surface-2 px-6 py-4 text-sm text-fg-muted">
            Món này đã bán. Nhắn{" "}
            <a
              href={site.social.zalo}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-ink underline"
            >
              Zalo
            </a>{" "}
            hoặc{" "}
            <a
              href={site.social.messenger}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary-ink underline"
            >
              Messenger
            </a>{" "}
            để tụi mình báo khi có hàng tương tự.
          </p>
        ) : chuaCoGia ? (
          <a
            href={site.social.zalo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
          >
            <PhoneIcon width={20} height={20} />
            Nhắn hỏi giá
          </a>
        ) : (
          <>
            <AddToCartButton
              productId={product.id}
              quantity={qty}
              productName={product.ten}
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
    </div>
  );
}
