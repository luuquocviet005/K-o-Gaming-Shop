import Link from "next/link";
import type { CardProduct } from "@/lib/products";
import { formatGia, moTaTonKho } from "@/lib/format";
import { ProductMedia } from "@/components/product-art";
import { ConditionBadge } from "@/components/condition-badge";
import { AddToCartButton } from "@/components/add-to-cart-button";

/** Ghi chú có nhắc bảo hành còn hạn thì nổi lên thành tem trên ảnh. Chỉ đọc chữ có sẵn, không suy ra ngày. */
function conBaoHanh(note?: string) {
  return !!note && /bảo hành/i.test(note) && !/hết bảo hành|không bảo hành/i.test(note);
}

/**
 * Thẻ sản phẩm kiểu "tem dán": giá, tình trạng và bảo hành là ba con tem dán
 * nghiêng lên ảnh, thay cho khung phiếu cũ.
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
  const baoHanh = conBaoHanh(product.note);

  return (
    <article className="group relative flex flex-col rounded-xl border-2 border-fg bg-surface shadow-[3px_4px_0_0_var(--border-strong)] transition-transform duration-200 hover:-translate-y-1">
      <div className="relative">
        <div className="relative aspect-square overflow-hidden rounded-t-[0.85rem] bg-surface-2 p-5">
          <div className="h-full w-full transition-transform duration-300 ease-out group-hover:scale-[1.04]">
            <ProductMedia product={product} priority={priority} nho />
          </div>

          {product.tenDanhMuc && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-surface/90 px-2.5 py-0.5 font-mono text-xs font-semibold text-fg-muted">
              {product.tenDanhMuc}
            </span>
          )}

          {hetHang && (
            <div className="absolute inset-0 grid place-items-center bg-surface/70">
              <span className="rotate-[-6deg] rounded-[3px] border-2 border-fg px-4 py-1.5 font-mono text-sm font-semibold uppercase tracking-wider text-fg">
                Đã bán hết
              </span>
            </div>
          )}
        </div>

        {/* Tem tình trạng: dán góc phải trên, nghiêng ngược chiều tem giá */}
        <span
          className="tem-dan pointer-events-none absolute -top-2 right-2 z-10 shadow-sm"
          style={{ "--goc": "3deg" } as React.CSSProperties}
        >
          <ConditionBadge tinhTrang={product.tinhTrang} nhom={product.nhomTinhTrang} />
        </span>

        {baoHanh && (
          <span
            className="tem-dan pointer-events-none absolute bottom-3 left-2 z-10 rounded-full bg-vi-bacha-nen px-2.5 py-1 font-mono text-xs font-bold text-vi-bacha-chu shadow-sm ring-2 ring-surface"
            style={{ "--goc": "-5deg" } as React.CSSProperties}
          >
            Còn bảo hành
          </span>
        )}

        {/* Tem giá: hồng đậm, đè lên mép dưới ảnh */}
        <p
          className={`tem-dan pointer-events-none absolute -bottom-4 right-3 z-10 rounded-lg bg-primary max-w-[calc(100%-1rem)] text-right font-mono font-bold leading-tight text-on-primary shadow-md ${product.giaToiDa && product.giaToiDa !== product.gia ? "px-2 py-1 text-xs sm:text-base" : "px-3 py-1.5 text-sm sm:text-lg"}`}
          style={{ "--goc": "-3deg" } as React.CSSProperties}
        >
          {formatGia(product)}
        </p>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-7">
        {/* Hãng nằm TRONG h3 (một dòng nhỏ phía trên tên) để tiêu đề đứng đầu khối
            nội dung của nó, không bị đo là "dính vào khối phía trên". */}
        <h3 className="text-base font-semibold leading-snug text-fg">
          <span className="mb-1 block font-mono text-xs font-semibold uppercase tracking-wider text-fg-subtle">
            {product.hang}
          </span>
          <Link
            href={`/san-pham/${product.slug}/`}
            className="line-clamp-2x after:absolute after:inset-0 after:rounded-2xl after:content-['']"
          >
            {product.ten}
          </Link>
        </h3>

        {/* Ghi chú kiểm hàng thật: với hàng cũ đây là thứ quyết định mua hay không */}
        {product.note && (
          <p className="rounded-lg bg-candy-soft px-2.5 py-1.5 text-sm leading-snug text-fg-muted">
            <span className="mr-1 font-mono text-xs font-semibold uppercase text-candy-ink">
              Lưu ý
            </span>
            <span className="line-clamp-2x">{product.note}</span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-2 pt-2">
          <p
            className={`whitespace-nowrap font-mono text-xs font-semibold ${
              tonKho.mau === "het"
                ? "text-fg-subtle"
                : tonKho.mau === "sapHet"
                  ? "text-candy-ink"
                  : "text-fg-muted"
            }`}
          >
            {tonKho.chu}
          </p>

          {/* Món nhiều phân loại phải chọn màu trước — không cho thêm thẳng từ thẻ.
              Nhãn nằm DƯỚI lớp link của thẻ nên bấm vào vẫn mở trang chọn màu. */}
          {product.soPhanLoai ? (
            <span className="shrink-0 whitespace-nowrap rounded-full border-2 border-fg px-2.5 py-1 font-mono text-xs font-semibold text-fg-muted">
              {product.soPhanLoai} phân loại
            </span>
          ) : !hetHang && (
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
