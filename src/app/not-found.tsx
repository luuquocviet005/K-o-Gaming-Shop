import Link from "next/link";
import { hangNoiBat, toCard } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-xl text-center">
        <p className="font-display text-7xl font-extrabold tracking-tight text-primary-ink sm:text-8xl">
          404
        </p>
        <h1 className="mt-4 font-display text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
          Không tìm thấy trang này
        </h1>
        <p className="mt-3 text-fg-muted">
          Có thể đường dẫn đã đổi, hoặc sản phẩm không còn được bán. Thử quay về
          trang chủ hoặc xem những món đang bán chạy bên dưới.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
          >
            Về trang chủ
            <ArrowRightIcon width={20} height={20} />
          </Link>
          <Link
            href="/danh-muc/"
            className="inline-flex h-14 items-center rounded-full border border-border-strong bg-surface px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-fg">
          Món đáng chú ý
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {hangNoiBat(4).map(toCard).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
