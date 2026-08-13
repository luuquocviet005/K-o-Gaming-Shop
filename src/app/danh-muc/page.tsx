import type { Metadata } from "next";
import Link from "next/link";
import { categories, products, toCard } from "@/lib/products";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductBrowser } from "@/components/product-browser";
import { CategoryIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Toàn bộ gear đang có tại KẸO GAMING SHOP: chuột, bàn phím, tai nghe và switch — hàng cũ lẫn hàng mới, ghi rõ tình trạng từng món.",
  alternates: { canonical: "/danh-muc/" },
};

export default function AllProductsPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Tất cả sản phẩm" }]} />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          Tất cả sản phẩm
        </h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          {products.length} món đang có sẵn. Dùng bộ lọc bên trái để chọn theo
          tình trạng, tầm giá, hãng hoặc khu vực đang giữ hàng.
        </p>
      </header>

      <nav aria-label="Lọc theo danh mục" className="mt-6">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <li>
            <span
              aria-current="page"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-full bg-primary px-5 text-sm font-semibold text-on-primary"
            >
              Tất cả
            </span>
          </li>
          {categories.map((c) => {
            return (
              <li key={c.slug}>
                <Link
                  href={`/danh-muc/${c.slug}/`}
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border border-border bg-surface px-5 text-sm font-semibold text-fg-muted transition-colors duration-200 hover:border-primary hover:text-primary-ink"
                >
                  <CategoryIcon khoa={c.icon} width={17} height={17} />
                  {c.short}
                  <span className="text-xs text-fg-subtle">{c.soLuong}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ProductBrowser items={products.map(toCard)} />
    </div>
  );
}
