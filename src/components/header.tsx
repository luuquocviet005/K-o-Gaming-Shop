"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { categories } from "@/lib/products";
import { site } from "@/lib/site";
import { formatVND } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { Logo } from "@/components/logo";
import { SearchBox } from "@/components/search-box";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  CartIcon,
  categoryIcons,
  CloseIcon,
  MenuIcon,
  PhoneIcon,
  SearchIcon,
  TruckIcon,
} from "@/components/icons";

export function Header() {
  const pathname = usePathname();
  const { itemCount, subtotal, ready, addPulse } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [bump, setBump] = useState(false);
  const firstRender = useRef(true);

  // Đóng mọi lớp phủ khi chuyển trang
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Khoá cuộn nền khi menu di động đang mở
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Đóng bằng phím Esc
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Nảy nhẹ icon giỏ khi có hàng mới được thêm
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setBump(true);
    const t = setTimeout(() => setBump(false), 400);
    return () => clearTimeout(t);
  }, [addPulse]);

  return (
    <>
      {/* Thanh thông báo */}
      <div className="hidden bg-fg text-bg md:block">
        <div className="container-page flex h-9 items-center justify-between text-xs">
          <p className="inline-flex items-center gap-2">
            <TruckIcon width={15} height={15} />
            Miễn phí vận chuyển cho đơn từ{" "}
            <strong className="font-semibold">
              {formatVND(site.shipping.freeThreshold)}
            </strong>
          </p>
          <div className="flex items-center gap-5">
            <a
              href={site.contact.phoneHref}
              className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
            >
              <PhoneIcon width={14} height={14} />
              {site.contact.phone}
            </a>
            <span className="opacity-70">{site.contact.hours}</span>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-xl">
        <div className="container-page flex h-[4.5rem] items-center gap-4">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2 lg:hidden"
          >
            <MenuIcon width={22} height={22} />
          </button>

          <Logo />

          {/* Điều hướng desktop */}
          <nav aria-label="Danh mục sản phẩm" className="ml-2 hidden lg:block">
            <ul className="flex items-center gap-0.5">
              <li>
                <NavLink href="/danh-muc/" active={pathname === "/danh-muc/"}>
                  Tất cả
                </NavLink>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <NavLink
                    href={`/danh-muc/${c.slug}/`}
                    active={pathname.startsWith(`/danh-muc/${c.slug}`)}
                  >
                    {c.short}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-1.5 md:gap-2">
            <SearchBox className="hidden w-72 xl:block" />

            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              aria-label="Tìm kiếm"
              aria-expanded={searchOpen}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-surface text-fg-muted transition-colors hover:border-primary hover:text-primary-ink xl:hidden"
            >
              <SearchIcon />
            </button>

            <ThemeToggle />

            <Link
              href="/gio-hang/"
              className="group relative inline-flex h-11 cursor-pointer items-center gap-2.5 rounded-full bg-primary pl-4 pr-4 text-on-primary transition-colors duration-200 hover:bg-primary-hover sm:pr-5"
            >
              <span className="relative">
                <CartIcon
                  width={21}
                  height={21}
                  className={bump ? "animate-pop" : undefined}
                />
                {ready && itemCount > 0 && (
                  <span className="absolute -right-2.5 -top-2.5 grid min-w-5 place-items-center rounded-full bg-candy px-1.5 text-[0.65rem] font-bold leading-5 text-white">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </span>
              <span className="hidden text-sm font-semibold sm:inline">
                {ready && subtotal > 0 ? formatVND(subtotal) : "Giỏ hàng"}
              </span>
              <span className="sr-only">
                {ready ? `Giỏ hàng, ${itemCount} sản phẩm` : "Giỏ hàng"}
              </span>
            </Link>
          </div>
        </div>

        {/* Ô tìm kiếm bung ra trên màn hình nhỏ */}
        {searchOpen && (
          <div className="border-t border-border bg-bg px-4 py-3 xl:hidden">
            <SearchBox autoFocus onNavigate={() => setSearchOpen(false)} />
          </div>
        )}
      </header>

      {/* Menu di động */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Đóng menu"
            onClick={() => setMenuOpen(false)}
            className="absolute inset-0 cursor-default bg-fg/40 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu điều hướng"
            className="animate-rise absolute inset-y-0 left-0 flex w-[min(20rem,85vw)] flex-col overflow-y-auto bg-bg p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Đóng menu"
                className="grid size-11 cursor-pointer place-items-center rounded-full text-fg transition-colors hover:bg-surface-2"
              >
                <CloseIcon width={22} height={22} />
              </button>
            </div>

            <nav aria-label="Danh mục" className="mt-6">
              <ul className="flex flex-col gap-1">
                <li>
                  <Link
                    href="/danh-muc/"
                    className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-[0.95rem] font-semibold text-fg transition-colors hover:bg-surface-2"
                  >
                    Tất cả sản phẩm
                  </Link>
                </li>
                {categories.map((c) => {
                  const Icon = categoryIcons[c.slug];
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/danh-muc/${c.slug}/`}
                        className="flex min-h-12 items-center gap-3 rounded-2xl px-3 text-[0.95rem] font-semibold text-fg transition-colors hover:bg-surface-2"
                      >
                        <span className="grid size-9 place-items-center rounded-xl bg-primary-soft text-primary-ink">
                          <Icon width={18} height={18} />
                        </span>
                        {c.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="mt-auto space-y-2 pt-8 text-sm text-fg-muted">
              <a
                href={site.contact.phoneHref}
                className="flex min-h-11 items-center gap-2.5 font-semibold text-fg"
              >
                <PhoneIcon width={17} height={17} />
                {site.contact.phone}
              </a>
              <p className="px-0.5">{site.contact.hours}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`inline-flex h-10 items-center rounded-full px-3.5 text-sm font-semibold transition-colors duration-200 ${
        active
          ? "bg-primary-soft text-primary-ink"
          : "text-fg-muted hover:bg-surface-2 hover:text-fg"
      }`}
    >
      {children}
    </Link>
  );
}
