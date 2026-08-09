"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";

export const THEME_KEY = "keo-theme";

/**
 * Script chạy TRƯỚC khi trình duyệt vẽ, để trang không bị nháy trắng
 * rồi mới chuyển sang dark. Được nhúng trong <head> ở layout.
 */
export const themeInitScript = `
(function(){
  try {
    var stored = localStorage.getItem('${THEME_KEY}');
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var theme = stored || (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.theme = theme;
  } catch (e) {
    document.documentElement.dataset.theme = 'light';
  }
})();
`;

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  // Theme thật do script trong <head> đặt vào <html data-theme> trước khi vẽ.
  // Server không biết giá trị đó, nên phải đọc sau khi mount rồi đồng bộ vào
  // state — đây là ngoại lệ hợp lệ của quy tắc "không setState trong effect".
  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(current === "dark" ? "dark" : "light");
    setMounted(true);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      // Chặn ghi localStorage thì vẫn đổi được theme trong phiên hiện tại
    }
  }

  const isDark = theme === "dark";
  const label = isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className={`grid size-11 cursor-pointer place-items-center rounded-full border border-border bg-surface text-fg-muted transition-colors duration-200 hover:border-primary hover:text-primary-ink ${className}`}
    >
      {/* Trước khi mount, giữ icon mặt trăng tĩnh để markup server/client khớp nhau */}
      {mounted && isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
