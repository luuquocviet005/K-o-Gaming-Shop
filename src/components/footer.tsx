import Link from "next/link";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import { Logo } from "@/components/logo";
import {
  ClockIcon,
  FacebookIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  TiktokIcon,
  ZaloIcon,
} from "@/components/icons";

const socials = [
  { href: site.social.facebook, label: "Facebook", Icon: FacebookIcon },
  { href: site.social.tiktok, label: "TikTok", Icon: TiktokIcon },
  { href: site.social.zalo, label: "Zalo", Icon: ZaloIcon },
];

const policies = [
  { label: "Cách mô tả tình trạng", href: "/chinh-sach/#tinh-trang" },
  { label: "Test trước khi mua", href: "/chinh-sach/#test-truoc" },
  { label: "Đổi trả", href: "/chinh-sach/#doi-tra" },
  { label: "Bảo hành", href: "/chinh-sach/#bao-hanh" },
  { label: "Giao hàng", href: "/chinh-sach/#van-chuyen" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-surface">
      <div className="container-page grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-fg-muted">
            Chuột, bàn phím, tai nghe và switch — phần lớn là hàng đã qua sử
            dụng. Món nào trầy, thiếu gì, còn bảo hành tới bao giờ, tụi mình ghi
            thẳng lên trang sản phẩm.
          </p>

          <ul className="mt-5 flex gap-2">
            {socials.map(({ href, label, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} trên ${label}`}
                  className="grid size-11 place-items-center rounded-full border border-border text-fg-muted transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-on-primary"
                >
                  <Icon width={19} height={19} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-labelledby="footer-cat">
          <h2
            id="footer-cat"
            className="font-display text-sm font-bold uppercase tracking-wider text-fg"
          >
            Danh mục
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/danh-muc/${c.slug}/`}
                  className="inline-flex min-h-9 items-center text-fg-muted transition-colors hover:text-primary-ink"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-policy">
          <h2
            id="footer-policy"
            className="font-display text-sm font-bold uppercase tracking-wider text-fg"
          >
            Hỗ trợ
          </h2>
          <ul className="mt-4 flex flex-col gap-2.5 text-sm">
            {policies.map((p) => (
              <li key={p.label}>
                <Link
                  href={p.href}
                  className="inline-flex min-h-9 items-center text-fg-muted transition-colors hover:text-primary-ink"
                >
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/lien-he/"
                className="inline-flex min-h-9 items-center text-fg-muted transition-colors hover:text-primary-ink"
              >
                Liên hệ
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-fg">
            Liên hệ
          </h2>
          <ul className="mt-4 flex flex-col gap-3.5 text-sm text-fg-muted">
            <li className="flex gap-3">
              <MapPinIcon width={18} height={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{site.contact.address}</span>
            </li>
            <li className="flex gap-3">
              <PhoneIcon width={18} height={18} className="mt-0.5 shrink-0 text-primary" />
              <a
                href={site.contact.phoneHref}
                className="font-semibold text-fg transition-colors hover:text-primary-ink"
              >
                {site.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <MailIcon width={18} height={18} className="mt-0.5 shrink-0 text-primary" />
              <a
                href={`mailto:${site.contact.email}`}
                className="transition-colors hover:text-primary-ink"
              >
                {site.contact.email}
              </a>
            </li>
            <li className="flex gap-3">
              <ClockIcon width={18} height={18} className="mt-0.5 shrink-0 text-primary" />
              <span>{site.contact.hours}</span>
            </li>
            <li className="flex gap-3">
              <FacebookIcon
                width={18}
                height={18}
                className="mt-0.5 shrink-0 text-primary"
              />
              <a
                href={site.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-fg transition-colors hover:text-primary-ink"
              >
                Nhắn tin qua Facebook
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-fg-subtle sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. Đã đăng ký bản quyền.
          </p>
          <p>Hàng cũ &amp; mới · Cho test trước khi mua · Đà Nẵng &amp; Sài Gòn</p>
        </div>
      </div>
    </footer>
  );
}
