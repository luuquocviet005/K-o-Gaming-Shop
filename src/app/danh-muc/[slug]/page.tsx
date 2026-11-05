import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory, productsByCategory, toCard, type Product } from "@/lib/products";
import { formatVND } from "@/lib/format";
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

  const moTa = `${category.name} tại ${site.name}. ${category.blurb}`;

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
  const gioiThieu = gioiThieuDanhMuc(dsMon);

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
          {gioiThieu && <p className="mt-1.5 max-w-2xl text-sm text-fg-muted">{gioiThieu}</p>}
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

/**
 * Đoạn giới thiệu dưới tiêu đề danh mục — để Google có chữ thật mà hiểu trang
 * (trước chỉ có một câu blurb). Ghép hoàn toàn từ dữ liệu đang bán nên tự
 * đúng khi Sheet đổi, không ai phải viết tay.
 */
function gioiThieuDanhMuc(ds: Product[]): string {
  const conHang = ds.filter((p) => p.soLuong > 0 && p.gia > 0);
  if (conHang.length === 0) return "";
  const demHang = new Map<string, number>();
  for (const p of conHang) {
    if (p.hang && !/không rõ/i.test(p.hang)) demHang.set(p.hang, (demHang.get(p.hang) ?? 0) + 1);
  }
  const hangChinh = [...demHang].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([h]) => h);
  const gia = conHang.map((p) => p.gia);
  const thap = Math.min(...gia);
  const cao = Math.max(...gia);
  return [
    `Đang có ${conHang.length} món${hangChinh.length ? ` từ ${hangChinh.join(", ")}` : ""}`,
    thap === cao ? `, giá ${formatVND(thap)}. ` : `, giá từ ${formatVND(thap)} đến ${formatVND(cao)}. `,
    "Ở Đà Nẵng thì qua test trực tiếp, ở tỉnh thì ship COD toàn quốc, tụi mình quay video đúng món trước khi gửi.",
  ].join("");
}
