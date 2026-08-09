import Link from "next/link";
import { ChevronRightIcon } from "@/components/icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Đường dẫn trang">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-fg-muted">
        <li>
          <Link href="/" className="transition-colors hover:text-primary-ink">
            Trang chủ
          </Link>
        </li>
        {items.map((item, i) => (
          <li key={item.label} className="flex items-center gap-1">
            <ChevronRightIcon
              width={15}
              height={15}
              className="text-fg-subtle"
            />
            {item.href && i < items.length - 1 ? (
              <Link
                href={item.href}
                className="transition-colors hover:text-primary-ink"
              >
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-fg">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
