import Link from "next/link";
import {
  bestSellers,
  categories,
  countByCategory,
  discountPercent,
  newProducts,
  products,
  saleProducts,
  toCard,
} from "@/lib/products";
import { formatVND } from "@/lib/format";
import { site } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-art";
import { Rating } from "@/components/rating";
import {
  ArrowRightIcon,
  categoryIcons,
  CheckIcon,
  RefreshIcon,
  ShieldIcon,
  SparkIcon,
  TagIcon,
  TruckIcon,
} from "@/components/icons";

const hero = products.find((p) => p.slug === "logitech-g-pro-x-superlight-2")!;
const heroSecondary = products.find((p) => p.slug === "keychron-q1-pro")!;

const trustPoints = [
  {
    Icon: ShieldIcon,
    title: "100% chính hãng",
    text: "Có hoá đơn VAT, tem bảo hành hãng",
  },
  {
    Icon: TruckIcon,
    title: "Giao nhanh 2 giờ",
    text: "Nội thành TP.HCM & Hà Nội",
  },
  {
    Icon: RefreshIcon,
    title: "Đổi trả 7 ngày",
    text: "Lỗi do hãng, đổi mới không hỏi lý do",
  },
  {
    Icon: TagIcon,
    title: "Giá tốt nhất",
    text: "Thấy rẻ hơn ở nơi khác? Chúng tôi hoàn phần chênh",
  },
];

const reviews = [
  {
    name: "Minh Tuấn",
    role: "Streamer · 42k người theo dõi",
    text: "Mua combo chuột + bàn phím ở KẸO, tư vấn rất thật — bạn nhân viên còn khuyên mình đừng mua bản đắt hơn vì không cần. Hiếm shop nào làm vậy.",
    rating: 5,
  },
  {
    name: "Hà Phương",
    role: "Designer",
    text: "Ghế Secretlab giao đúng hẹn, có người lên tận nhà lắp giúp. Ngồi làm 9 tiếng/ngày cả tháng nay lưng đỡ hẳn.",
    rating: 5,
  },
  {
    name: "Đức Anh",
    role: "Sinh viên",
    text: "Đặt màn AOC lúc 10h tối, 9h sáng hôm sau đã có hàng. Đóng gói kỹ, bọc 3 lớp xốp. Giá cũng rẻ hơn chỗ mình hay mua 300k.",
    rating: 5,
  },
];

export default function HomePage() {
  const sale = saleProducts(4);
  const best = bestSellers(8);
  const fresh = newProducts(4);
  const heroOff = discountPercent(hero);

  return (
    <>
      {/* ───────────────────────────── HERO ───────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Quầng sáng nền — thuần trang trí */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-32 size-[26rem] rounded-full bg-candy/10 blur-3xl"
        />

        <div className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-ink">
              <SparkIcon width={15} height={15} />
              Sale tháng này — giảm tới 30%
            </span>

            <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-[4.2rem]">
              Gaming gear
              <br />
              <span className="text-primary-ink">ngọt như kẹo.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              Chuột, bàn phím cơ, tai nghe, ghế và màn hình chính hãng — được
              chọn lọc bởi những người thật sự chơi game, không phải bởi bảng
              tính doanh số.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/danh-muc/"
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                Mua sắm ngay
                <ArrowRightIcon width={20} height={20} />
              </Link>
              <Link
                href="/danh-muc/chuot/"
                className="inline-flex h-14 items-center rounded-full border border-border-strong bg-surface px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
              >
                Xem chuột bán chạy
              </Link>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {[
                { k: "12.000+", v: "Đơn hàng đã giao" },
                { k: "4.9/5", v: "Điểm đánh giá trung bình" },
                { k: "36", v: "Sản phẩm chính hãng" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-extrabold text-fg">
                    {s.k}
                  </dt>
                  <dd className="mt-0.5 text-sm text-fg-muted">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Cụm ảnh sản phẩm nổi bật */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <Link
              href={`/san-pham/${hero.slug}/`}
              className="group block overflow-hidden rounded-[2.25rem] border border-border bg-surface p-7 shadow-[0_30px_80px_-40px_rgba(11,21,18,0.55)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                    {hero.brand}
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-fg">
                    {hero.name}
                  </h2>
                </div>
                {heroOff > 0 && (
                  <span className="shrink-0 rounded-full bg-candy px-3 py-1.5 text-sm font-bold text-white">
                    -{heroOff}%
                  </span>
                )}
              </div>

              <div className="relative mx-auto my-4 aspect-square w-full max-w-[19rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                <ProductMedia product={hero} priority sizes="380px" />
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <Rating value={hero.rating} reviews={hero.reviews} />
                  <p className="mt-1.5 flex items-baseline gap-2">
                    <span className="font-display text-3xl font-extrabold tracking-tight text-fg">
                      {formatVND(hero.price)}
                    </span>
                    {hero.oldPrice && (
                      <span className="text-sm text-fg-subtle line-through">
                        {formatVND(hero.oldPrice)}
                      </span>
                    )}
                  </p>
                </div>
                <span className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition-colors group-hover:bg-primary-hover">
                  Xem chi tiết
                  <ArrowRightIcon width={17} height={17} />
                </span>
              </div>
            </Link>

            {/* Thẻ phụ nổi lên góc — chỉ hiện ở màn lớn để không che nội dung */}
            <Link
              href={`/san-pham/${heroSecondary.slug}/`}
              className="animate-float-slow absolute -bottom-8 -left-10 hidden w-56 items-center gap-3 rounded-3xl border border-border bg-surface p-3 shadow-[0_20px_50px_-25px_rgba(11,21,18,0.6)] transition-transform duration-300 hover:scale-105 xl:flex"
            >
              <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-surface-2 p-1.5">
                <ProductMedia product={heroSecondary} sizes="64px" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-fg">
                  {heroSecondary.name}
                </span>
                <span className="block text-sm font-bold text-primary-ink">
                  {formatVND(heroSecondary.price)}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CAM KẾT ───────────────────────── */}
      <section aria-label="Cam kết của cửa hàng" className="container-page">
        <ul className="grid gap-3 rounded-[1.75rem] border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustPoints.map(({ Icon, title, text }) => (
            <li key={title} className="flex items-start gap-3.5 rounded-2xl p-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-ink">
                <Icon width={21} height={21} />
              </span>
              <span>
                <span className="block text-sm font-bold text-fg">{title}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-fg-muted">
                  {text}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────────────────── DANH MỤC ───────────────────────── */}
      <section className="container-page mt-20">
        <SectionHead
          title="Danh mục sản phẩm"
          subtitle="Chọn đúng thứ bạn cần, không phải lướt qua cả nghìn món"
          href="/danh-muc/"
        />

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((c) => {
            const Icon = categoryIcons[c.slug];
            return (
              <li key={c.slug}>
                <Link
                  href={`/danh-muc/${c.slug}/`}
                  className="group flex h-full flex-col items-center gap-3 rounded-[1.5rem] border border-border bg-surface p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_-24px_rgba(11,21,18,0.45)]"
                >
                  <span className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                    <Icon width={26} height={26} />
                  </span>
                  <span className="text-sm font-bold leading-tight text-fg">
                    {c.short}
                  </span>
                  <span className="-mt-1.5 text-xs text-fg-subtle">
                    {countByCategory(c.slug)} sản phẩm
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ─────────────────── BANNER XẢ KHO (theo ảnh mẫu) ─────────────────── */}
      <section className="container-page mt-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-primary px-7 py-10 sm:px-12 sm:py-14">
          <div
            aria-hidden="true"
            className="absolute -right-16 -top-16 size-72 rounded-full bg-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-24 right-24 size-64 rounded-full bg-white/10"
          />

          <div className="relative grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-ink">
                <TagIcon width={15} height={15} />
                Xả kho cuối mùa
              </span>
              <h2 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl">
                Giảm tới 30%
                <br />
                cho gear tuyển chọn
              </h2>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-white sm:text-base">
                Số lượng có hạn — hết là hết. Nhập mã{" "}
                <strong className="rounded-lg bg-white px-2 py-0.5 font-mono font-bold text-primary-ink">
                  KEO10
                </strong>{" "}
                để giảm thêm 10% ở bước thanh toán.
              </p>
              <Link
                href="/khuyen-mai/"
                className="mt-7 inline-flex h-14 items-center gap-2.5 rounded-full bg-white px-8 text-base font-bold text-primary-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97]"
              >
                Xem hàng giảm giá
                <ArrowRightIcon width={20} height={20} />
              </Link>
            </div>

            <ul className="grid grid-cols-2 gap-3">
              {sale.slice(0, 4).map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/san-pham/${p.slug}/`}
                    className="group flex flex-col gap-2 rounded-3xl bg-white/95 p-3 transition-transform duration-300 hover:-translate-y-1"
                  >
                    <span className="relative block aspect-square overflow-hidden rounded-2xl bg-[#f4f7f5] p-2">
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-candy px-2 py-0.5 text-[0.65rem] font-bold text-white">
                        -{discountPercent(p)}%
                      </span>
                      <span className="block h-full w-full transition-transform duration-500 group-hover:scale-110">
                        <ProductMedia product={p} sizes="180px" />
                      </span>
                    </span>
                    <span className="line-clamp-2x px-1 text-xs font-semibold leading-snug text-[#0b1512]">
                      {p.name}
                    </span>
                    <span className="px-1 pb-1 text-sm font-extrabold text-[#147a3a]">
                      {formatVND(p.price)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── BÁN CHẠY ───────────────────────── */}
      <section className="container-page mt-20">
        <SectionHead
          title="Bán chạy nhất"
          subtitle="Những món được anh em chốt đơn nhiều nhất 30 ngày qua"
          href="/danh-muc/"
        />
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {best.map((p, i) => (
            <ProductCard key={p.id} product={toCard(p)} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* ───────────────────────── HÀNG MỚI ───────────────────────── */}
      {fresh.length > 0 && (
        <section className="container-page mt-20">
          <SectionHead
            title="Mới về kho"
            subtitle="Gear vừa cập bến, số lượng còn ít"
            href="/danh-muc/"
          />
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {fresh.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      {/* ───────────────────────── ĐÁNH GIÁ ───────────────────────── */}
      <section className="container-page mt-20">
        <SectionHead
          title="Khách hàng nói gì"
          subtitle="Đánh giá thật từ người đã mua tại KẸO"
        />
        <ul className="mt-7 grid gap-4 md:grid-cols-3">
          {reviews.map((r) => (
            <li
              key={r.name}
              className="flex flex-col rounded-[1.5rem] border border-border bg-surface p-6"
            >
              <Rating value={r.rating} />
              <p className="mt-4 flex-1 text-sm leading-relaxed text-fg-muted">
                “{r.text}”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <span className="grid size-10 place-items-center rounded-full bg-primary-soft font-display text-sm font-bold text-primary-ink">
                  {r.name.charAt(0)}
                </span>
                <span>
                  <span className="block text-sm font-bold text-fg">{r.name}</span>
                  <span className="block text-xs text-fg-subtle">{r.role}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ───────────────────────── CTA CUỐI ───────────────────────── */}
      <section className="container-page mt-20">
        <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-surface p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
              Chưa biết chọn gì?
              <br />
              Nhắn cho tụi mình.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
              Nói ngân sách và tựa game bạn hay chơi — tụi mình gợi ý đúng món,
              và sẵn sàng khuyên bạn mua rẻ hơn nếu bản đắt không đáng.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                Gọi {site.contact.phone}
              </a>
              <Link
                href="/lien-he/"
                className="inline-flex h-14 items-center rounded-full border border-border-strong bg-bg px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
              >
                Gửi câu hỏi
              </Link>
            </div>
          </div>

          <ul className="grid gap-3">
            {[
              "Tư vấn miễn phí, không ép mua",
              "Bảo hành tại chỗ — không phải gửi về hãng",
              "Hỗ trợ cài đặt phần mềm, chỉnh DPI, đổi switch",
            ].map((t) => (
              <li
                key={t}
                className="flex items-center gap-3 rounded-2xl bg-surface-2 p-4 text-sm font-medium text-fg"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                  <CheckIcon width={16} height={16} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function SectionHead({
  title,
  subtitle,
  href,
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1.5 text-sm text-fg-muted sm:text-base">{subtitle}</p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface px-5 text-sm font-semibold text-fg transition-colors duration-200 hover:border-primary hover:text-primary-ink"
        >
          Xem tất cả
          <ArrowRightIcon width={17} height={17} />
        </Link>
      )}
    </div>
  );
}
