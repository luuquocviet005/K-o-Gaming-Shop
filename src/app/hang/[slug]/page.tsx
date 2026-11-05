import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getTrangHang,
  gioiThieuNhom,
  hangNoiBat,
  tatCaTrangHang,
  tenLoaiHang,
  toCard,
  type Product,
  type TrangHang,
} from "@/lib/products";
import { site, ANH_CHIA_SE, anhDayDu, anhChiaSeSanPham } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ProductCard } from "@/components/product-card";

export const dynamicParams = false;

export function generateStaticParams() {
  return tatCaTrangHang().map((t) => ({ slug: t.slug }));
}

type Props = { params: Promise<{ slug: string }> };

/** Món của hãng chia theo danh mục, danh mục đông món đứng trước */
function theoDanhMuc(dsMon: Product[]): [string, Product[]][] {
  const nhom = new Map<string, Product[]>();
  for (const c of categories) nhom.set(c.slug, []);
  for (const p of dsMon) nhom.get(p.danhMuc)?.push(p);
  return [...nhom].filter(([, ds]) => ds.length > 0).sort((a, b) => b[1].length - a[1].length);
}

/**
 * "Chuột, bàn phím ATK cũ và mới tại Đà Nẵng" — đúng cụm khách gõ.
 * Layout nối thêm " | Kẹo Gaming Gear", audit đòi cả câu ≤ 70 nên phần này ≤ 52:
 * dài quá thì bớt dần loại hàng.
 */
function tieuDeHang(t: TrangHang): string {
  const loai = theoDanhMuc(t.dsMon).map(([slug]) => tenLoaiHang(slug));
  for (let n = Math.min(2, loai.length); n >= 0; n--) {
    const dau = loai
      .slice(0, n)
      .map((l, i) => (i === 0 ? l : l.toLowerCase()))
      .join(", ");
    const tieuDe = `${dau ? `${dau} ` : "Gear "}${t.ten} cũ và mới tại Đà Nẵng`;
    if (tieuDe.length <= 52) return tieuDe;
  }
  return `${t.ten} tại Đà Nẵng`;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const t = getTrangHang(slug);
  if (!t) return { title: "Không tìm thấy hãng" };

  const tieuDe = tieuDeHang(t);
  const moTa = t.duMon
    ? `${tieuDe} tại ${site.name}. ${gioiThieuNhom(t.dsMon)}`
    : `Gear ${t.ten} tại ${site.name} đang tạm hết. Xem những món tương tự đang có, ghi rõ tình trạng thật, cho test trước khi trả tiền.`;
  const monCoAnh = t.dsMon.find((p) => p.anh);
  const anh = monCoAnh ? anhChiaSeSanPham(monCoAnh) : anhDayDu(ANH_CHIA_SE);
  const url = `${site.url}/hang/${t.slug}/`;

  return {
    title: tieuDe,
    description: moTa,
    alternates: { canonical: `/hang/${t.slug}/` },
    // Hãng còn dưới ngưỡng: giữ đường dẫn sống cho link cũ nhưng không cho xếp hạng trang mỏng
    ...(t.duMon ? {} : { robots: { index: false, follow: true } }),
    openGraph: {
      title: `${t.ten} — ${site.name}`,
      description: moTa,
      url,
      images: [{ url: anh, width: 1200, height: 630, alt: t.ten }],
    },
    twitter: { card: "summary_large_image", title: `${t.ten} — ${site.name}`, description: moTa, images: [anh] },
  };
}

export default async function TrangHangPage(props: Props) {
  const { slug } = await props.params;
  const t = getTrangHang(slug);
  if (!t) notFound();

  const khoi = theoDanhMuc(t.dsMon);
  const gioiThieu = gioiThieuNhom(t.dsMon);
  const goiY = t.duMon ? [] : hangNoiBat(8).filter((p) => !t.dsMon.includes(p)).slice(0, 4);

  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs
        items={[
          { label: "Tất cả sản phẩm", href: "/danh-muc/" },
          { label: t.ten },
        ]}
      />

      <header className="mt-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          {tieuDeHang(t)}
        </h1>
        <p className="mt-2 max-w-2xl text-fg-muted">
          {gioiThieu ||
            `Hàng ${t.ten} đang tạm hết. Tụi mình nhập thêm thường xuyên, nhắn shop để được báo khi có món mới.`}
        </p>
      </header>

      {khoi.map(([dm, ds]) => (
        <section key={dm} className="mt-10">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">
            {tenLoaiHang(dm)} {t.ten}
            <span className="ml-2 text-base font-semibold text-fg-subtle">{ds.length}</span>
          </h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {ds.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      ))}

      {goiY.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg">Món khác đang có</h2>
          <div className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {goiY.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-10">
        <Link href="/danh-muc/" className="font-semibold text-primary-ink underline-offset-4 hover:underline">
          Xem tất cả sản phẩm
        </Link>
      </p>
    </div>
  );
}
