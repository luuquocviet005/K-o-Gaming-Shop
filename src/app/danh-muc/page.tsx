import type { Metadata } from "next";
import Link from "next/link";
import { categories, products, tatCaTrangHang, toCard } from "@/lib/products";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductBrowser } from "@/components/product-browser";
import { CategoryIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Tất cả sản phẩm",
  description:
    "Toàn bộ gear đang có tại Kẹo Gaming Gear: chuột, bàn phím, tai nghe và phụ kiện — hàng cũ lẫn hàng mới, ghi rõ tình trạng từng món.",
  alternates: { canonical: "/danh-muc/" },
};

export default function AllProductsPage() {
  const trangHang = tatCaTrangHang().filter((t) => t.duMon);
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
              className="inline-flex h-11 items-center whitespace-nowrap rounded-lg border-2 border-fg bg-primary px-4 text-sm font-semibold text-on-primary"
            >
              Tất cả
            </span>
          </li>
          {categories.map((c) => {
            return (
              <li key={c.slug}>
                <Link
                  href={`/danh-muc/${c.slug}/`}
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg border-2 border-fg bg-surface px-4 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-primary-soft"
                >
                  <CategoryIcon khoa={c.icon} width={17} height={17} />
                  {c.short}
                  <span className="font-mono text-xs text-fg-subtle">{c.soLuong}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {trangHang.length > 0 && (
        <nav aria-label="Mua theo hãng" className="mt-4">
          <p className="text-sm font-semibold text-fg-muted">Mua theo hãng</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {trangHang.map((t) => (
              <li key={t.slug}>
                <Link
                  href={`/hang/${t.slug}/`}
                  className="inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg border-2 border-fg bg-surface px-4 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-primary-soft"
                >
                  {t.ten}
                  <span className="font-mono text-xs text-fg-subtle">{t.dsMon.length}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <ProductBrowser items={products.map(toCard)} />
    </div>
  );
}
