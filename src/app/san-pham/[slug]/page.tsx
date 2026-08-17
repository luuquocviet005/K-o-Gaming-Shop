import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, getProduct, products, relatedProducts, toCard } from "@/lib/products";
import { formatGia } from "@/lib/format";
import { site, ANH_CHIA_SE, anhDayDu, anhChiaSeSanPham } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ThuVienAnh } from "@/components/thu-vien-anh";
import { ProductCard } from "@/components/product-card";
import { ProductPurchase } from "@/components/product-purchase";
import { ConditionBadge } from "@/components/condition-badge";
import { CheckIcon, InfoIcon, MapPinIcon, PhoneIcon } from "@/components/icons";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

/** Xem ghi chú ở src/app/danh-muc/[slug]/page.tsx về lý do không dùng PageProps */
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) return { title: "Không tìm thấy sản phẩm" };

  /*
   * Mô tả hiện dưới tiêu đề trong kết quả Google.
   *
   * Món nào Sheet bỏ trống ô Tình trạng và ô Ghi chú thì phần đầu chỉ còn
   * chừng 50 ký tự — Google cắt bỏ và tự bịa mô tả khác từ nội dung trang,
   * thường ra một câu chẳng ăn nhập gì. Nên luôn nối thêm tên danh mục và một
   * câu về cách shop bán, cho đủ dài và đúng sự thật.
   */
  const danhMuc = getCategory(product.danhMuc);

  const phanChinh = [
    product.hang,
    product.ten,
    product.tinhTrang,
    `giá ${formatGia(product)}`,
    `hàng ở ${product.diaDiem}`,
    product.moTa,
    product.note,
  ]
    .filter(Boolean)
    .map((s) => String(s).replace(/\s+/g, " ").trim())
    .join(" · ");

  const phanThem = [
    danhMuc ? `${danhMuc.name} tại ${site.name}.` : `${site.name}.`,
    "Cho test trước khi trả tiền.",
  ].join(" ");

  /*
   * Google cắt mô tả quanh mốc 160 ký tự. Tự cắt trước thì chủ động hơn, nhưng
   * phải cắt ở RANH GIỚI CÂU — cắt giữa chừng ra "cho test trước khi trả" thì
   * trông như trang bị lỗi. Không câu nào vừa thì bỏ hẳn phần thêm.
   */
  const day = `${phanChinh}. ${phanThem}`;
  const moTa =
    day.length <= 158
      ? day
      : `${phanChinh}. ${danhMuc?.name ?? site.name}`.slice(0, 158);

  // Ảnh cho thẻ xem trước trên Zalo / Messenger / Facebook. Món chưa có ảnh
  // thật thì rơi về tấm mặc định của shop, chứ không để trống.
  const coAnh = Boolean(product.anh);
  const anhChiaSe = coAnh
    ? anhChiaSeSanPham(product.slug)
    : anhDayDu(ANH_CHIA_SE);
  const tieuDe = `${product.ten} — ${formatGia(product)}`;

  return {
    title: `${product.ten} — ${product.hang}`,
    description: moTa,
    alternates: { canonical: `/san-pham/${product.slug}/` },
    openGraph: {
      type: "website",
      title: tieuDe,
      description: moTa,
      url: `${site.url}/san-pham/${product.slug}/`,
      images: [
        {
          url: anhChiaSe,
          width: 1200,
          height: 630,
          alt: `${product.hang} ${product.ten}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tieuDe,
      description: moTa,
      images: [anhChiaSe],
    },
  };
}

export default async function ProductPage(props: Props) {
  const { slug } = await props.params;
  const product = getProduct(slug);
  if (!product) notFound();

  const category = getCategory(product.danhMuc);
  const related = relatedProducts(product, 4);

  // Dữ liệu có cấu trúc giúp Google hiện giá ngay trên kết quả tìm kiếm.
  // `itemCondition` khai báo đúng hàng mới hay hàng cũ — khai sai là vi phạm
  // chính sách mua sắm của Google.
  // Google chỉ hiện ảnh kèm kết quả tìm kiếm khi có trường `image`, và địa chỉ
  // phải đầy đủ tên miền chứ không phải đường dẫn tương đối.
  const anhChoGoogle = (product.anhs ?? (product.anh ? [product.anh] : [])).map(anhDayDu);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.hang} ${product.ten}`,
    description:
      [product.moTa, product.note].filter(Boolean).join(" — ") ||
      `${product.ten} — ${product.tinhTrang}`,
    ...(anhChoGoogle.length > 0 && { image: anhChoGoogle }),
    brand: { "@type": "Brand", name: product.hang },
    ...(product.gia > 0 && {
      offers: {
        "@type": "Offer",
        price: product.gia,
        priceCurrency: "VND",
        itemCondition:
          product.nhomTinhTrang === "moi"
            ? "https://schema.org/NewCondition"
            : "https://schema.org/UsedCondition",
        availability:
          product.soLuong > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        url: `${site.url}/san-pham/${product.slug}/`,
      },
    }),
  };

  /*
   * Đường dẫn phân cấp cho Google.
   *
   * Nhờ nó, kết quả tìm kiếm hiện "keogaminggear.com › Chuột gaming › Naga v2"
   * thay vì một chuỗi URL dài loằng ngoằng — khách nhìn là biết mình sắp vào
   * đâu, và tỉ lệ bấm vào cao hơn hẳn.
   */
  const jsonLdDuongDan = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${site.url}/` },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 2,
              name: category.name,
              item: `${site.url}/danh-muc/${category.slug}/`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: category ? 3 : 2,
        name: `${product.hang} ${product.ten}`,
        item: `${site.url}/san-pham/${product.slug}/`,
      },
    ],
  };

  const thongTin = [
    { nhan: "Hãng", giaTri: product.hang },
    { nhan: "Tình trạng", giaTri: product.tinhTrang || "Chưa ghi" },
    { nhan: "Hàng đang ở", giaTri: product.diaDiem },
    {
      nhan: "Số lượng còn",
      giaTri: product.soLuong > 0 ? `${product.soLuong}` : "Đã hết",
    },
    ...(category ? [{ nhan: "Nhóm", giaTri: category.name }] : []),
  ];

  return (
    <div className="container-page py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDuongDan) }}
      />

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
        {/* ── Ảnh ── */}
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="relative">
            <div className="absolute left-6 top-6 z-10">
              <ConditionBadge
                tinhTrang={product.tinhTrang}
                nhom={product.nhomTinhTrang}
                size="md"
              />
            </div>

            <ThuVienAnh product={product} />
          </div>

          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            <li className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-3.5 text-xs leading-snug text-fg-muted">
              <MapPinIcon width={19} height={19} className="shrink-0 text-primary" />
              Hàng đang ở {product.diaDiem} — hẹn gặp test trực tiếp được
            </li>
            <li className="flex items-center gap-2.5 rounded-2xl border border-border bg-surface p-3.5 text-xs leading-snug text-fg-muted">
              <CheckIcon width={19} height={19} className="shrink-0 text-primary" />
              Mô tả sai tình trạng thì tụi mình chịu trách nhiệm
            </li>
          </ul>
        </div>

        {/* ── Thông tin & mua ── */}
        <div>
          <p className="text-sm font-bold uppercase tracking-wider text-fg-subtle">
            {product.hang}
          </p>
          <h1 className="mt-2 font-display text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-4xl">
            {product.ten}
          </h1>

          <ProductPurchase product={product} />

          {/*
            Mô tả: cấu hình, phụ kiện kèm theo. Đặt TRƯỚC bảng thông số vì đây
            là thứ khách hàng cũ đọc kỹ nhất — cái case gì, switch gì, có kèm
            hộp không. `whitespace-pre-line` để chủ shop xuống dòng trong ô
            Google Sheet (Alt+Enter) thì trên web cũng xuống dòng đúng chỗ.
          */}
          {product.moTa && (
            <section className="mt-10">
              <h2 className="font-display text-lg font-bold text-fg">Mô tả</h2>
              <p className="mt-3 whitespace-pre-line rounded-2xl border border-border bg-surface px-5 py-4 text-[0.95rem] leading-relaxed text-fg">
                {product.moTa}
              </p>
            </section>
          )}

          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-fg">Thông tin món hàng</h2>
            <dl className="mt-4 divide-y divide-border rounded-2xl border border-border bg-surface px-5">
              {thongTin.map((t) => (
                <div key={t.nhan} className="flex justify-between gap-6 py-3.5">
                  <dt className="text-sm text-fg-muted">{t.nhan}</dt>
                  <dd className="text-right text-sm font-semibold text-fg">
                    {t.giaTri}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          <p className="mt-6 flex gap-2.5 rounded-2xl bg-surface-2 px-4 py-3.5 text-sm leading-relaxed text-fg-muted">
            <InfoIcon width={18} height={18} className="mt-px shrink-0 text-fg-subtle" />
            <span>
              Thông tin lấy từ bảng hàng của shop. Cần biết thêm chi tiết nào — số
              lần dùng, phụ kiện kèm theo, ảnh thật — cứ{" "}
              <a
                href={site.social.zalo}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary-ink underline underline-offset-2"
              >
                nhắn Zalo
              </a>{" "}
              hoặc gọi{" "}
              <a
                href={site.contact.phoneHref}
                className="font-semibold text-primary-ink underline underline-offset-2"
              >
                {site.contact.phone}
              </a>
              .
            </span>
          </p>
        </div>
      </div>

      {/* ── Sản phẩm liên quan ── */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">
            Món khác cùng nhóm
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={toCard(p)} />
            ))}
          </div>
        </section>
      )}

      {/* Nút gọi nổi trên di động — hàng cũ thì khách hay hỏi trước khi chốt */}
      <a
        href={site.social.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-30 inline-flex h-14 items-center gap-2.5 rounded-full bg-primary px-6 text-sm font-bold text-on-primary shadow-[0_12px_30px_-10px_rgba(60,20,40,0.6)] lg:hidden"
      >
        <PhoneIcon width={19} height={19} />
        Hỏi về món này
      </a>
    </div>
  );
}
