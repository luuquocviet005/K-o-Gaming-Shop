import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, productsByCategory, toCard } from "@/lib/products";
import { site, ANH_CHIA_SE, anhDayDu, anhChiaSeSanPham } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductBrowser } from "@/components/product-browser";
import { CategoryIcon } from "@/components/icons";

// Static export cần biết trước mọi đường dẫn động sẽ được sinh ra
export function generateStaticParams() {
  return categories.map((c) => ({ slug: c.slug }));
}

/**
 * Khai báo tường minh thay vì dùng `PageProps<...>` toàn cục.
 * `PageProps` do `next typegen` sinh ra trong `.next/types/` — thư mục này
 * không được commit, nên trên CI (checkout sạch, chạy tsc trước next build)
 * kiểu đó chưa tồn tại và build sẽ hỏng.
 */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) return { title: "Không tìm thấy danh mục" };

  const moTa = `${category.name} tại KẸO GAMING SHOP. ${category.blurb}`;

  // Thẻ xem trước lấy ảnh món đầu tiên trong danh mục — dán link "Chuột" vào
  // Zalo thì khách thấy ngay một con chuột, sát nội dung hơn logo shop.
  const monCoAnh = productsByCategory(slug).find((p) => p.anh);
  const anh = monCoAnh
    ? anhChiaSeSanPham(monCoAnh.slug)
    : anhDayDu(ANH_CHIA_SE);

  return {
    title: category.name,
    description: moTa,
    alternates: { canonical: `/danh-muc/${category.slug}/` },
    openGraph: {
      title: `${category.name} — ${site.name}`,
      description: moTa,
      url: `${site.url}/danh-muc/${category.slug}/`,
      images: [{ url: anh, width: 1200, height: 630, alt: category.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} — ${site.name}`,
      description: moTa,
      images: [anh],
    },
  };
}

export default async function CategoryPage(props: Props) {
  const { slug } = await props.params;
  const category = getCategory(slug);
  if (!category) notFound();

  const items = productsByCategory(slug).map(toCard);

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
          <CategoryIcon khoa={category.icon} width={30} height={30} />
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
                  <CategoryIcon khoa={c.icon} width={17} height={17} />
                  {c.short}
                  <span
                    className={active ? "text-xs opacity-80" : "text-xs text-fg-subtle"}
                  >
                    {c.soLuong}
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
