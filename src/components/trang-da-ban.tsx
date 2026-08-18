import Link from "next/link";
import {
  getCategory,
  replacementsFor,
  toCard,
  type SoldProduct,
} from "@/lib/products";
import { formatVND } from "@/lib/format";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-art";
import { ArrowRightIcon, PhoneIcon } from "@/components/icons";

/**
 * Trang cho món ĐÃ BÁN.
 *
 * Thay cho trang 404. Khách tới đây qua một link cũ trên Zalo, Facebook hoặc
 * từ kết quả Google — họ đang quan tâm đúng món này, nên việc cần làm là nói
 * thật rằng nó bán rồi và đưa ngay mấy món tương tự, chứ không phải quẳng ra
 * một trang lỗi.
 *
 * Ảnh để mờ và xám: nhìn là hiểu ngay món không còn, không cần đọc chữ.
 */
export function TrangDaBan({ product }: { product: SoldProduct }) {
  const category = getCategory(product.danhMuc);
  const thayThe = replacementsFor(product, 4);

  const banLuc = new Date(product.banLuc).toLocaleDateString("vi-VN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Tất cả sản phẩm", href: "/danh-muc/" },
          ...(category
            ? [{ label: category.name, href: `/danh-muc/${category.slug}/` }]
            : []),
          { label: product.ten },
        ]}
      />

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-surface p-8">
          <div className="mx-auto aspect-square w-full max-w-md opacity-45 grayscale">
            <ProductMedia product={product} sizes="(min-width: 1024px) 30rem, 90vw" />
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-[-8deg] rounded-2xl border-2 border-fg bg-bg px-6 py-3 font-display text-2xl font-extrabold uppercase tracking-wider text-fg">
            Đã bán
          </span>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-fg-subtle">
            {product.hang}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
            {product.ten}
          </h1>

          <p className="mt-5 text-lg text-fg-muted">
            Món này <strong className="font-semibold text-fg">đã bán rồi</strong>
            {product.gia > 0 && (
              <>
                {" "}
                — giá lúc bán là {formatVND(product.gia)}
                {product.donViGia ? ` / ${product.donViGia}` : ""}
              </>
            )}
            .
          </p>
          <p className="mt-1 text-sm text-fg-subtle">Gỡ khỏi bảng hàng ngày {banLuc}</p>

          <div className="mt-7 rounded-2xl border border-border bg-surface-2 p-5">
            <p className="text-[0.95rem] leading-relaxed text-fg-muted">
              Hàng cũ mỗi món chỉ có một chiếc, bán xong là hết. Nhưng tụi mình
              nhập hàng liên tục — nhắn cho tụi mình biết bạn đang tìm{" "}
              <strong className="font-semibold text-fg">{product.ten}</strong>,
              có hàng về là báo bạn đầu tiên.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={site.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center gap-2.5 rounded-full bg-primary px-7 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                Nhắn Zalo tìm món này
                <ArrowRightIcon width={19} height={19} />
              </a>
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-13 items-center gap-2.5 rounded-full border border-border-strong px-7 text-base font-semibold text-fg transition-colors hover:bg-surface-2"
              >
                <PhoneIcon width={19} height={19} />
                {site.contact.phone}
              </a>
            </div>
          </div>

          {category && (
            <Link
              href={`/danh-muc/${category.slug}/`}
              className="mt-6 inline-flex items-center gap-2 font-semibold text-primary-ink underline underline-offset-4"
            >
              Xem tất cả {category.name.toLowerCase()} đang có
              <ArrowRightIcon width={17} height={17} />
            </Link>
          )}
        </div>
      </div>

      {thayThe.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            Món tương tự đang còn hàng
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {thayThe.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
