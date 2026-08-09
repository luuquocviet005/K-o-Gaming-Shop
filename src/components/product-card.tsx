import Link from "next/link";
import { discountPercent, type CardProduct } from "@/lib/products";
import { formatVND } from "@/lib/format";
import { ProductMedia } from "@/components/product-art";
import { Rating } from "@/components/rating";
import { AddToCartButton } from "@/components/add-to-cart-button";

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
  const off = discountPercent(product);
  const soldOut = product.stock === 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[1.5rem] border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[0_18px_40px_-24px_rgba(11,21,18,0.45)]">
      {/* Khu vực ảnh — tỉ lệ vuông cố định để không nhảy layout khi tải */}
      <div className="relative aspect-square overflow-hidden bg-surface-2 p-5">
        <div className="h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.06]">
          <ProductMedia product={product} priority={priority} />
        </div>

        {/* Nhãn trạng thái */}
        <div className="pointer-events-none absolute left-4 top-4 flex flex-col items-start gap-1.5">
          {off > 0 && (
            <span className="rounded-full bg-candy px-2.5 py-1 text-[0.68rem] font-bold text-white">
              -{off}%
            </span>
          )}
          {product.isNew && (
            <span className="rounded-full bg-fg px-2.5 py-1 text-[0.68rem] font-bold text-bg">
              MỚI
            </span>
          )}
        </div>

        {soldOut && (
          <div className="absolute inset-0 grid place-items-center bg-surface/70 backdrop-blur-[2px]">
            <span className="rounded-full bg-fg px-4 py-2 text-xs font-bold text-bg">
              Tạm hết hàng
            </span>
          </div>
        )}
      </div>

      {/* Nội dung */}
      <div className="flex flex-1 flex-col gap-2 p-4 pt-3.5">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-fg-subtle">
          {product.brand}
        </p>

        <h3 className="text-[0.95rem] font-semibold leading-snug text-fg">
          <Link
            href={`/san-pham/${product.slug}/`}
            className="line-clamp-2x after:absolute after:inset-0 after:content-['']"
          >
            {product.name}
          </Link>
        </h3>

        <Rating value={product.rating} />

        <div className="mt-auto flex items-end justify-between gap-3 pt-2">
          <div className="min-w-0">
            {product.oldPrice && (
              <p className="text-xs text-fg-subtle line-through">
                {formatVND(product.oldPrice)}
              </p>
            )}
            <p className="font-display text-lg font-extrabold tracking-tight text-fg">
              {formatVND(product.price)}
            </p>
          </div>

          {!soldOut && (
            <div className="relative z-10">
              <AddToCartButton
                productId={product.id}
                variantId={product.firstVariantId}
                productName={product.name}
                variant="icon"
              />
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
