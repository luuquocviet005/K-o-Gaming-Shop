import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  discountPercent,
  getCategory,
  getProduct,
  products,
  relatedProducts,
  toCard,
} from "@/lib/products";
import { formatCount, formatVND } from "@/lib/format";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductMedia } from "@/components/product-art";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { Rating } from "@/components/rating";
import { CheckIcon, RefreshIcon, ShieldIcon, TruckIcon } from "@/components/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** Xem ghi chú ở src/app/danh-muc/[slug]/page.tsx về lý do không dùng PageProps */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };
  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: `${product.name} — ${formatVND(product.price)}`,
      description: product.summary,
    },
  };
}

const services = [
  { Icon: ShieldIcon, text: "Chính hãng, có tem & hoá đơn VAT" },
  { Icon: TruckIcon, text: "Giao nhanh 2 giờ nội thành" },
  { Icon: RefreshIcon, text: "Đổi mới trong 7 ngày nếu lỗi hãng" },
];

export default async function ProductPage(props: Props) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.category)!;
  const related = relatedProducts(product, 4);
  const off = discountPercent(product);

  // Dữ liệu có cấu trúc giúp Google hiện giá & sao ngay trên kết quả tìm kiếm
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.summary,
    brand: { "@type": "Brand", name: product.brand },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviews,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "VND",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${site.url}/san-pham/${product.slug}/`,
    },
  };

  return (
    <div className="container-page py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: "Tất cả sản phẩm", href: "/danh-muc/" },
          { label: category.name, href: `/danh-muc/${category.slug}/` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* ── Ảnh ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-8">
            <div className="absolute left-6 top-6 flex flex-col gap-2">
              {off > 0 && (
                <span className="rounded-full bg-candy px-3 py-1.5 text-sm font-bold text-on-candy">
                  -{off}%
                </span>
              )}
              {product.isNew && (
                <span className="rounded-full bg-fg px-3 py-1.5 text-sm font-bold text-bg">
                  MỚI
                </span>
              )}
            </div>

            <div className="mx-auto aspect-square w-full max-w-md">
              <ProductMedia product={product} priority sizes="(min-width: 1024px) 30rem, 90vw" />
            </div>
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-3">
            {services.map(({ Icon, text }) => (
              <li
                key={text}
                className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-3.5 text-xs leading-snug text-fg-muted"
              >
                <Icon width={19} height={19} className="shrink-0 text-primary" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        {/* ── Thông tin & mua ── */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-fg-subtle">
            {product.brand}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
            <Rating value={product.rating} reviews={product.reviews} size="md" />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary-ink">
              <CheckIcon width={14} height={14} />
              {product.positive}% hài lòng
            </span>
            <span className="text-sm text-fg-muted">
              Đã bán {formatCount(product.sold)}
            </span>
          </div>

          <p className="mt-5 text-base leading-relaxed text-fg-muted">
            {product.summary}
          </p>

          <ProductPurchase product={product} />

          {/* Điểm nổi bật */}
          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-fg">Điểm nổi bật</h2>
            <ul className="mt-4 grid gap-2.5">
              {product.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm leading-relaxed text-fg-muted">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-primary-soft text-primary-ink">
                    <CheckIcon width={13} height={13} />
                  </span>
                  {h}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      {/* ── Mô tả & thông số ── */}
      <div className="mt-16 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-[1.75rem] border border-border bg-surface p-7 sm:p-9">
          <h2 className="font-display text-xl font-extrabold text-fg">
            Mô tả chi tiết
          </h2>
          <p className="mt-4 text-[0.95rem] leading-[1.75] text-fg-muted">
            {product.description}
          </p>
        </section>

        <section className="rounded-[1.75rem] border border-border bg-surface p-7 sm:p-9">
          <h2 className="font-display text-xl font-extrabold text-fg">
            Thông số kỹ thuật
          </h2>
          <dl className="mt-4 divide-y divide-border">
            {product.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-6 py-3.5">
                <dt className="text-sm text-fg-muted">{s.label}</dt>
                <dd className="text-right text-sm font-semibold text-fg">
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {/* ── Sản phẩm liên quan ── */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            Có thể bạn cũng thích
          </h2>
          <p className="mt-1.5 text-fg-muted">
            Cùng danh mục {category.name.toLowerCase()}
          </p>
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
