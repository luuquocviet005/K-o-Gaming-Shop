import Link from "next/link";
import type { CardProduct } from "@/lib/products";
import { formatGia, moTaTonKho } from "@/lib/format";
import { ProductMedia } from "@/components/product-art";
import { ConditionBadge } from "@/components/condition-badge";
import { AddToCartButton } from "@/components/add-to-cart-button";
import { InfoIcon, MapPinIcon } from "@/components/icons";

/**
 * Thẻ sản phẩm.
 *
 * Cả thẻ là một liên kết (vùng bấm lớn, dễ trúng trên di động) nhưng nút
 * "thêm vào giỏ" nằm CHỒNG LÊN chứ không lồng bên trong <a> — HTML không cho
 * phép lồng nút vào link, và người dùng bàn phím sẽ tab được vào cả hai.
 */
export function ProductCard({
  product,
  priority = false,
}: {
  product: CardProduct;
  priority?: boolean;
}) {
  const hetHang = product.soLuong <= 0;
  const tonKho = moTaTonKho(product);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_rgba(60,20,40,0.45)]">
      <div className="relative aspect-square overflow-hidden bg-surface-2 p-5">
        <div className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
          <ProductMedia product={product} priority={priority} />
        </div>

        {/* Mép giấy gói: răng cưa ngăn giữa khu ảnh và phần chữ */}
        <div
          aria-hidden="true"
          className="rang-cua pointer-events-none absolute inset-x-0 bottom-0 h-3.5"
        />

        <div className="pointer-events-none absolute left-5 top-4 flex flex-col items-start gap-1.5">
          <ConditionBadge tinhTrang={product.tinhTrang} nhom={product.nhomTinhTrang} />
        </div>

        {product.diaDiem && (
          <span className="pointer-events-none absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-surface/85 px-2.5 py-1 text-[0.68rem] font-semibold text-fg-muted backdrop-blur-sm">
            <MapPinIcon width={12} height={12} />
            {product.diaDiem}
          </span>
        )}

        {hetHang && (
          <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-fg px-4 py-2 text-xs font-bold text-bg">
              Đã bán hết
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 pt-3.5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          {product.hang}
        </p>

        <h3 className="text-[0.95rem] font-semibold leading-snug text-fg">
          <Link
            href={`/san-pham/${product.slug}/`}
            className="line-clamp-2x after:absolute after:inset-0 after:content-['']"
          >
            {product.ten}
          </Link>
        </h3>

        {/* Ghi chú tình trạng thật — với hàng cũ đây là thứ quyết định mua hay không */}
        {product.note && (
          <p className="flex gap-1.5 rounded-xl bg-surface-2 px-2.5 py-2 text-xs leading-snug text-fg-muted">
            <InfoIcon width={14} height={14} className="mt-px shrink-0 text-candy-ink" />
            <span className="line-clamp-2x">{product.note}</span>
          </p>
        )}

        <p
          className={`text-xs font-semibold ${
            tonKho.mau === "het"
              ? "text-fg-subtle"
              : tonKho.mau === "sapHet"
                ? "text-candy-ink"
                : "text-fg-muted"
          }`}
        >
          {tonKho.chu}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <p className="min-w-0 font-display text-lg font-extrabold leading-tight tracking-tight text-fg">
            {formatGia(product)}
          </p>

          {!hetHang && (
            <div className="relative z-10">
              <AddToCartButton
                productId={product.id}
                productName={product.ten}
                variant="icon"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
