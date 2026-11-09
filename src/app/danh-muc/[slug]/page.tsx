import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TU_VAN_DANH_MUC } from "@/lib/tu-van-danh-muc";
import { categories, getCategory, gioiThieuNhom, productsByCategory, toCard } from "@/lib/products";
import { site, ANH_CHIA_SE, anhDayDu, anhChiaSeSanPham } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductBrowser } from "@/components/product-browser";
import { CategoryIcon } from "@/components/icons";

// Đường dẫn ngoài generateStaticParams -> 404 ngay, giống hệt bản tĩnh. Thiếu
// dòng này thì ở chế độ máy chủ (Hostinger) slug lạ vẫn được dựng trang rồi
// mới notFound(), và trang 404 mang tiêu đề trang chủ.
export const dynamicParams = false;

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

  const moTa = TU_VAN_DANH_MUC[slug]?.meta ?? `${category.name} tại ${site.name}. ${category.blurb}`;

  // Thẻ xem trước lấy ảnh món đầu tiên trong danh mục — dán link "Chuột" vào
  // Zalo thì khách thấy ngay một con chuột, sát nội dung hơn logo shop.
  const monCoAnh = productsByCategory(slug).find((p) => p.anh);
  const anh = monCoAnh
    ? anhChiaSeSanPham(monCoAnh)
    : anhDayDu(ANH_CHIA_SE);

  return {
    // Thêm "cũ và mới tại Đà Nẵng": đúng cụm khách gõ khi tìm gear quanh đây
    title: `${category.name} cũ và mới tại Đà Nẵng`,
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

  const dsMon = productsByCategory(slug);
  const items = dsMon.map(toCard);
  const gioiThieu = gioiThieuNhom(dsMon);
  const tuVan = TU_VAN_DANH_MUC[slug];

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Tất cả sản phẩm", href: "/danh-muc/" },
          { label: category.name },
        ]}
      />

      {/* Icon đứng cùng dòng với tiêu đề, không bọc trong ô vuông riêng: ô icon trên
          đầu tiêu đề là khuôn thẻ tính năng AI, đọc ra là hàng mẫu chứ không phải shop. */}
      <header className="mt-6">
        <div className="flex items-center gap-3">
          <CategoryIcon
            khoa={category.icon}
            width={30}
            height={30}
            className="shrink-0 text-primary-ink"
          />
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            {category.name}
          </h1>
        </div>
        <p className="mt-2 max-w-[58ch] text-fg-muted">{category.blurb}</p>
        {gioiThieu && <p className="mt-1.5 max-w-[58ch] text-sm text-fg-muted">{gioiThieu}</p>}
      </header>

      <nav aria-label="Đổi danh mục" className="mt-6">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
          <li>
            <Link
              href="/danh-muc/"
              className="inline-flex h-11 items-center whitespace-nowrap rounded-lg border-2 border-fg bg-surface px-4 text-sm font-semibold text-fg transition-colors duration-200 hover:bg-primary-soft"
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
                  className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-lg border-2 border-fg px-4 text-sm font-semibold transition-colors duration-200 ${
                    active
                      ? "bg-primary text-on-primary"
                      : "bg-surface text-fg hover:bg-primary-soft"
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

      {tuVan && (
        // tieuDe trong dữ liệu dính đoạn mở đầu sau dấu xuống dòng: dòng đầu là tiêu đề,
        // phần sau là đoạn văn. Phiếu trải hết bề ngang (tiêu đề trái, chữ phải) để
        // không chừa một ô trống bên cạnh như lưới thiếu thẻ.
        <section className="phieu mt-12 grid gap-x-10 gap-y-3 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">
            {tuVan.tieuDe.split("\n")[0]}
          </h2>
          <div>
            {[...tuVan.tieuDe.split("\n").slice(1), ...tuVan.doan].map((d, i) => (
              <p
                key={d}
                className={`max-w-[68ch] leading-relaxed text-fg-muted ${i ? "mt-3" : ""}`}
              >
                {d}
              </p>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
