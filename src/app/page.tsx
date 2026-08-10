import Link from "next/link";
import {
  categories,
  hangDocNhat,
  hangMoi,
  hangNoiBat,
  products,
  tatCaDiaDiem,
  tatCaHang,
  toCard,
} from "@/lib/products";
import { formatGia } from "@/lib/format";
import { site } from "@/lib/site";
import { ProductCard } from "@/components/product-card";
import { ProductMedia } from "@/components/product-art";
import { ConditionBadge } from "@/components/condition-badge";
import { RacKeo } from "@/components/rac-keo";
import {
  ArrowRightIcon,
  CheckIcon,
  CategoryIcon,
  InfoIcon,
  MapPinIcon,
  PhoneIcon,
  SparkIcon,
} from "@/components/icons";

const hero = hangNoiBat(1)[0];

/**
 * Cam kết ghi ở đây phải ĐÚNG với thứ shop thật sự làm được.
 * Phần lớn hàng là đồ cũ nên không thể hứa "tem bảo hành hãng" hay
 * "đổi mới không hỏi lý do" như shop bán hàng nguyên seal.
 */
const camKet = [
  {
    title: "Nói đúng tình trạng",
    text: "Trầy chỗ nào, thiếu gì, còn bảo hành tới bao giờ — ghi thẳng lên trang sản phẩm",
  },
  {
    title: "Cho test trước khi trả tiền",
    text: "Gặp trực tiếp ở Đà Nẵng hoặc Sài Gòn, dùng thử ưng mới lấy",
  },
  {
    title: "Hàng có sẵn trong tay",
    text: "Không phải đặt trước, không ôm cọc — chốt là giao",
  },
  {
    title: "Hỗ trợ sau khi mua",
    text: "Lỗi do mô tả sai thì tụi mình chịu trách nhiệm",
  },
];

export default function HomePage() {
  const noiBat = hangNoiBat(8);
  const moi = hangMoi(4);
  const docNhat = hangDocNhat(4);
  const soHang = tatCaHang().length;
  const diaDiem = tatCaDiaDiem();

  return (
    <>
      {/* ───────────────────────────── HERO ───────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Chấm kẹo rắc nền, mờ dần xuống dưới để không đụng phần chữ */}
        <div
          aria-hidden="true"
          className="cham-keo pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent_75%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-32 size-[26rem] rounded-full bg-candy/10 blur-3xl"
        />
        <RacKeo className="hidden lg:block" />

        <div className="container-page relative grid items-center gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:py-20">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary-soft px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary-ink">
              <SparkIcon width={15} height={15} />
              Gear cũ &amp; mới · {diaDiem.join(" · ")}
            </span>

            <h1 className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-[4.2rem]">
              Gear ngon,
              <br />
              <span className="text-primary-ink">giá thật.</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              Chuột, bàn phím, tai nghe và switch — phần lớn là hàng đã qua sử
              dụng. Món nào trầy, món nào thiếu hộp, món nào còn bảo hành, tụi
              mình ghi rõ trên từng sản phẩm.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/danh-muc/"
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                Xem toàn bộ {products.length} món
                <ArrowRightIcon width={20} height={20} />
              </Link>
              <a
                href={site.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-14 items-center gap-2.5 rounded-full border border-border-strong bg-surface px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
              >
                <PhoneIcon width={19} height={19} />
                Nhắn Zalo
              </a>
            </div>

            {/* Số liệu lấy thẳng từ bảng hàng, không phải con số tự nghĩ ra */}
            <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
              {[
                { k: String(products.length), v: "Món đang có sẵn" },
                { k: String(soHang), v: "Hãng khác nhau" },
                { k: String(categories.length), v: "Nhóm sản phẩm" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-display text-2xl font-extrabold text-fg">{s.k}</dt>
                  <dd className="mt-0.5 text-sm text-fg-muted">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {hero && (
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <Link
                href={`/san-pham/${hero.slug}/`}
                className="group block overflow-hidden rounded-[2.25rem] border border-border bg-surface p-7 shadow-[0_30px_80px_-40px_rgba(60,20,40,0.55)] transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-fg-subtle">
                      {hero.hang}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-extrabold leading-tight text-fg">
                      {hero.ten}
                    </h2>
                  </div>
                  <ConditionBadge
                    tinhTrang={hero.tinhTrang}
                    nhom={hero.nhomTinhTrang}
                  />
                </div>

                <div className="relative mx-auto my-4 aspect-square w-full max-w-[19rem] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105">
                  <ProductMedia product={hero} priority sizes="380px" />
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="inline-flex items-center gap-1.5 text-sm text-fg-muted">
                      <MapPinIcon width={15} height={15} />
                      {hero.diaDiem}
                    </p>
                    <p className="mt-1 font-display text-3xl font-extrabold tracking-tight text-fg">
                      {formatGia(hero)}
                    </p>
                  </div>
                  <span className="inline-flex h-12 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-on-primary transition-colors group-hover:bg-primary-hover">
                    Xem chi tiết
                    <ArrowRightIcon width={17} height={17} />
                  </span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ───────────────────────── CAM KẾT ───────────────────────── */}
      <section aria-label="Cam kết của cửa hàng" className="container-page">
        <ul className="grid gap-3 rounded-[1.75rem] border border-border bg-surface p-4 sm:grid-cols-2 lg:grid-cols-4">
          {camKet.map(({ title, text }) => (
            <li key={title} className="flex items-start gap-3.5 rounded-2xl p-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-ink">
                <CheckIcon width={21} height={21} />
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
          title="Đang bán"
          subtitle="Bấm vào nhóm bạn quan tâm"
          href="/danh-muc/"
        />

        <ul className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => {
            return (
              <li key={c.slug}>
                {/* Thẻ danh mục tạo hình hũ kẹo: nắp vằn ở trên, thân bo tròn */}
                <Link
                  href={`/danh-muc/${c.slug}/`}
                  className="group relative flex h-full flex-col items-center gap-3 overflow-hidden rounded-[1.5rem] border border-border bg-surface p-5 pt-7 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-[0_18px_40px_-24px_rgba(60,20,40,0.45)]"
                >
                  <span
                    aria-hidden="true"
                    className="nap-hu absolute inset-x-0 top-0 h-2.5 bg-primary-soft"
                  />
                  <span className="grid size-14 place-items-center rounded-full bg-primary-soft text-primary-ink transition-colors duration-300 group-hover:bg-primary group-hover:text-on-primary">
                    <CategoryIcon khoa={c.icon} width={26} height={26} />
                  </span>
                  <span className="text-sm font-bold leading-tight text-fg">
                    {c.short}
                  </span>
                  <span className="-mt-1.5 text-xs text-fg-subtle">
                    {c.soLuong} món
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ───────────────── LỜI NHẮC VỀ HÀNG CŨ ───────────────── */}
      <section className="container-page mt-20">
        <div className="cham-keo relative overflow-hidden rounded-[2rem] border border-border bg-primary-soft px-7 py-9 sm:px-12 sm:py-12">
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-on-primary">
                <InfoIcon width={15} height={15} />
                Đọc trước khi mua
              </span>
              <h2 className="mt-4 font-display text-3xl font-extrabold leading-[1.1] tracking-tight text-fg sm:text-4xl">
                Phần lớn ở đây là hàng đã qua sử dụng
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-fg-muted sm:text-base">
                Nghĩa là giá mềm hơn hàng mới khá nhiều, đổi lại món nào cũng có
                lịch sử riêng. Tụi mình ghi rõ tình trạng từng món — trầy ở đâu,
                thiếu gì, còn bảo hành hãng tới khi nào. Không giấu để bán cho
                nhanh.
              </p>
              <Link
                href="/chinh-sach/"
                className="mt-7 inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-bold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                Xem chính sách mua bán
                <ArrowRightIcon width={20} height={20} />
              </Link>
            </div>

            <ul className="grid gap-2.5">
              {[
                "Hàng cũ · đủ hộp — còn hộp và phụ kiện",
                "Hàng cũ · không hộp — chỉ có sản phẩm",
                "Mới, nguyên seal — chưa bóc",
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-center gap-3 rounded-2xl bg-surface p-4 text-sm font-medium text-fg"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-full bg-primary text-on-primary">
                    <CheckIcon width={16} height={16} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────────────────────── NỔI BẬT ───────────────────────── */}
      <section className="container-page mt-20">
        <SectionHead
          title="Đáng chú ý"
          subtitle="Món tốt nhất mỗi nhóm"
          href="/danh-muc/"
        />
        <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {noiBat.map((p, i) => (
            <ProductCard key={p.id} product={toCard(p)} priority={i < 4} />
          ))}
        </div>
      </section>

      {/* ───────────────────────── HÀNG MỚI ───────────────────────── */}
      {moi.length > 0 && (
        <section className="container-page mt-20">
          <SectionHead
            title="Hàng mới, chưa qua sử dụng"
            subtitle="Nguyên seal hoặc mới bóc, chưa dùng"
          />
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {moi.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      {/* ───────────────────── CHỈ CÒN 1 CHIẾC ───────────────────── */}
      {docNhat.length > 0 && (
        <section className="container-page mt-20">
          <SectionHead
            title="Chỉ còn một chiếc"
            subtitle="Bán rồi là hết, không có con thứ hai"
          />
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {docNhat.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      {/* ───────────────────────── CTA CUỐI ───────────────────────── */}
      <section className="container-page mt-20">
        <div className="grid items-center gap-8 rounded-[2rem] border border-border bg-surface p-8 sm:p-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
              Chưa thấy món cần?
              <br />
              Nhắn tụi mình.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-fg-muted sm:text-base">
              Bảng hàng đổi liên tục, có món về rồi chưa kịp lên web. Nói tên
              món và tầm giá bạn muốn, có hàng tụi mình báo ngay.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href={site.contact.phoneHref}
                className="inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-8 text-base font-semibold text-on-primary transition-all duration-200 hover:bg-primary-hover active:scale-[0.97]"
              >
                <PhoneIcon width={20} height={20} />
                Gọi {site.contact.phone}
              </a>
              <Link
                href="/lien-he/"
                className="inline-flex h-14 items-center rounded-full border border-border-strong bg-bg px-8 text-base font-semibold text-fg transition-all duration-200 hover:border-primary hover:text-primary-ink active:scale-[0.97]"
              >
                Cách liên hệ khác
              </Link>
            </div>
          </div>

          <ul className="grid gap-3">
            {[
              `Hàng nằm ở ${diaDiem.join(" và ")} — hẹn gặp test trực tiếp được`,
              "Nhận tìm hộ món cụ thể theo yêu cầu",
              "Thu lại gear cũ của bạn nếu còn dùng được",
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
        {/* Gạch sọc kẹo thay cho gạch ngang trơn */}
        <span
          aria-hidden="true"
          className="gach-keo mt-2 block h-1.5 w-16 rounded-full"
        />
        {subtitle && (
          <p className="mt-2 text-sm text-fg-muted sm:text-base">{subtitle}</p>
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
