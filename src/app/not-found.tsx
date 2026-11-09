import Link from "next/link";
import { hangNoiBat, toCard } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { ArrowRightIcon } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="container-page py-16 lg:py-24">
      <div className="mx-auto max-w-xl text-center">
        {/* eslint-disable-next-line @next/next/no-img-element -- static export */}
        <img src="/mascot.png" alt="" width={551} height={1200} className="mx-auto mb-4 h-40 w-auto" />
        <p className="tem-dan mx-auto inline-block rounded-xl border-4 border-primary-ink px-6 py-2 font-mono text-6xl font-extrabold tracking-widest text-primary-ink sm:text-7xl" style={{ "--goc": "-4deg" } as React.CSSProperties}>
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
            className="nut-nhan inline-flex h-14 items-center gap-2.5 rounded-xl bg-primary px-8 text-base font-semibold text-on-primary hover:bg-primary-hover"
          >
            Về trang chủ
            <ArrowRightIcon width={20} height={20} />
          </Link>
          <Link
            href="/danh-muc/"
            className="inline-flex h-14 items-center rounded-xl border-2 border-fg bg-surface px-8 text-base font-semibold text-fg transition-colors hover:bg-primary-soft"
          >
            Xem tất cả sản phẩm
          </Link>
        </div>
      </div>

      <section className="mt-16">
        <h2 className="font-display text-xl font-extrabold tracking-tight text-fg">
          Món đáng chú ý
        </h2>
        <div className="mt-6 grid grid-cols-2 items-start gap-4 lg:grid-cols-4">
          {hangNoiBat(4).map(toCard).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
