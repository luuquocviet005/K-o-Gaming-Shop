import type { Metadata } from "next";
import { site } from "@/lib/site";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ContactForm } from "@/components/contact-form";
import {
  ClockIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/icons";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ ${site.name}: ${site.contact.phone} · ${site.contact.email} · ${site.contact.address}`,
};

const channels = [
  {
    Icon: PhoneIcon,
    label: "Điện thoại",
    value: site.contact.phone,
    href: site.contact.phoneHref,
    note: "Nhanh nhất — gọi là có người nghe",
  },
  {
    Icon: MailIcon,
    label: "Email",
    value: site.contact.email,
    href: `mailto:${site.contact.email}`,
    note: "Phản hồi trong vòng 24 giờ",
  },
  {
    Icon: MapPinIcon,
    label: "Cửa hàng",
    value: site.contact.address,
    note: "Mời bạn ghé trải nghiệm gear trực tiếp",
  },
  {
    Icon: ClockIcon,
    label: "Giờ mở cửa",
    value: site.contact.hours,
    note: "Kể cả lễ, Tết nghỉ 3 ngày mùng 1–3",
  },
];

export default function ContactPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Liên hệ" }]} />

      <header className="mt-6 max-w-2xl">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          Liên hệ với KẸO
        </h1>
        <p className="mt-3 text-fg-muted">
          Cần tư vấn chọn gear, hỏi bảo hành, hay muốn báo giá số lượng lớn cho
          phòng net? Chọn kênh nào tiện nhất với bạn.
        </p>
      </header>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:gap-10">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {channels.map(({ Icon, label, value, href, note }) => {
            const content = (
              <>
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-ink">
                  <Icon width={20} height={20} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wider text-fg-subtle">
                    {label}
                  </span>
                  <span className="mt-1 block font-semibold text-fg">{value}</span>
                  <span className="mt-1 block text-xs text-fg-muted">{note}</span>
                </span>
              </>
            );

            return (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    className="flex h-full items-start gap-4 rounded-[1.5rem] border border-border bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary"
                  >
                    {content}
                  </a>
                ) : (
                  <div className="flex h-full items-start gap-4 rounded-[1.5rem] border border-border bg-surface p-5">
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        <ContactForm />
      </div>
    </div>
  );
}
