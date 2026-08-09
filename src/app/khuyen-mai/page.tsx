import type { Metadata } from "next";
import { discountPercent, products, toCard } from "@/lib/products";
import { formatVND } from "@/lib/format";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductBrowser } from "@/components/product-browser";
import { TagIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Khuyến mãi",
  description:
    "Toàn bộ gaming gear đang giảm giá tại KẸO GAMING SHOP — giảm tới 30%, số lượng có hạn.",
};

export default function SalePage() {
  const items = products.filter((p) => p.oldPrice);
  const maxOff = Math.max(...items.map(discountPercent));
  const totalSaving = items.reduce(
    (sum, p) => sum + (p.oldPrice! - p.price),
    0,
  );

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Khuyến mãi" }]} />

      <header className="mt-6 overflow-hidden rounded-[2rem] bg-primary px-7 py-9 sm:px-10">
        <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-ink">
          <TagIcon width={15} height={15} />
          Đang giảm giá
        </span>
        <h1 className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
          {items.length} sản phẩm giảm tới {maxOff}%
        </h1>
        <p className="mt-3 max-w-xl text-sm text-white sm:text-base">
          Tổng mức tiết kiệm nếu gom hết:{" "}
          <strong className="font-bold text-white">{formatVND(totalSaving)}</strong>.
          Nhập mã{" "}
          <strong className="rounded-lg bg-white px-2 py-0.5 font-mono font-bold text-primary-ink">
            KEO10
          </strong>{" "}
          ở giỏ hàng để giảm thêm 10%.
        </p>
      </header>

      <ProductBrowser items={items.map(toCard)} />
    </div>
  );
}
