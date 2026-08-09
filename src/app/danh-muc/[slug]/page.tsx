import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  countByCategory,
  getCategory,
  productsByCategory,
  toCard,
  type CategorySlug,
} from "@/lib/products";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductBrowser } from "@/components/product-browser";
import { categoryIcons } from "@/components/icons";

// Static export cần biết trước mọi đường dẫn động sẽ được sinh ra
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/danh-muc/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return { title: "Không tìm thấy danh mục" };
  return {
    title: category.name,
    description: `${category.name} chính hãng tại KẸO GAMING SHOP. ${category.blurb}`,
  };
}

export default async function CategoryPage(props: PageProps<"/danh-muc/[slug]">) {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsByCategory(slug as CategorySlug).map(toCard);
  const Icon = categoryIcons[category.slug];

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Tất cả sản phẩm", href: "/danh-muc/" },
          { label: category.name },
        ]}
      />

      <header className="mt-6 flex flex-wrap items-center gap-5">
        <span className="grid size-16 shrink-0 place-items-center rounded-3xl bg-primary-soft text-primary-ink">
          <Icon width={30} height={30} />
        </span>
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            {category.name}
          </h1>
          <p className="mt-1.5 max-w-2xl text-fg-muted">{category.blurb}</p>
        </div>
      </header>

      <nav aria-label="Đổi danh mục" className="mt-6">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <li>
            <Link
              href="/danh-muc/"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-full border border-border bg-surface px-5 text-sm font-semibold text-fg-muted transition-colors duration-200 hover:border-primary hover:text-primary-ink"
            >
              Tất cả
            </Link>
          </li>
          {categories.map((c) => {
            const CatIcon = categoryIcons[c.slug];
            const active = c.slug === category.slug;
            return (
              <li key={c.slug}>
                <Link
                  href={`/danh-muc/${c.slug}/`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full px-5 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-primary text-on-primary"
                      : "border border-border bg-surface text-fg-muted hover:border-primary hover:text-primary-ink"
                  }`}
                >
                  <CatIcon width={17} height={17} />
                  {c.short}
                  <span
                    className={active ? "text-xs opacity-80" : "text-xs text-fg-subtle"}
                  >
                    {countByCategory(c.slug)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <ProductBrowser items={items} />
    </div>
  );
}
