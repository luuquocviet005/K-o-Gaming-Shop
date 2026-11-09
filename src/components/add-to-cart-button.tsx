"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { CartIcon, CheckIcon, PlusIcon } from "@/components/icons";

/** Chip tem hồng bay từ nút lên icon giỏ ở header. Tắt khi bật "giảm chuyển động". */
function bayVaoGio(nut: HTMLElement) {
  const dich = document.querySelector("[data-gio-hang]");
  if (!dich || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const a = nut.getBoundingClientRect();
  const b = dich.getBoundingClientRect();
  if (!b.width) return;
  const chip = document.createElement("div");
  chip.setAttribute("aria-hidden", "true");
  chip.style.cssText = `position:fixed;z-index:80;pointer-events:none;width:28px;height:28px;border-radius:6px;border:2px solid var(--fg);background:var(--primary);left:${a.left + a.width / 2 - 14}px;top:${a.top + a.height / 2 - 14}px`;
  document.body.append(chip);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  chip
    .animate(
      [
        { transform: "translate(0,0) rotate(0) scale(1)", offset: 0 },
        { transform: `translate(${dx * 0.5}px,${dy * 0.5 - 60}px) rotate(-12deg) scale(1.1)`, offset: 0.45 },
        { transform: `translate(${dx}px,${dy}px) rotate(8deg) scale(0.3)`, offset: 1 },
      ],
      { duration: 650, easing: "cubic-bezier(0.4, 0, 0.8, 0.6)" },
    )
    .finished.then(() => chip.remove(), () => chip.remove());
}

/**
 * Nút thêm vào giỏ. Sau khi bấm, chuyển sang trạng thái "Đã thêm" 1,6 giây
 * để người dùng nhận được phản hồi rõ ràng thay vì phải tự đoán.
 */
export function AddToCartButton({
  productId,
  loai,
  quantity = 1,
  variant = "full",
  productName,
  className = "",
}: {
  productId: string;
  /** id phân loại đang chọn — món có nhiều màu/loại thì bắt buộc */
  loai?: string;
  quantity?: number;
  /** full: nút dài có chữ | icon: nút tròn trên thẻ sản phẩm */
  variant?: "full" | "icon";
  productName: string;
  className?: string;
}) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    bayVaoGio(e.currentTarget);
    addItem(productId, quantity, loai);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1600);
  }

  if (variant === "icon") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Thêm ${productName} vào giỏ hàng`}
          className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-md border-2 border-fg transition-colors duration-200 active:translate-y-px ${
            added
              ? "bg-primary text-on-primary"
              : "bg-surface text-fg hover:bg-primary hover:text-on-primary"
          } ${className}`}
        >
          {added ? <CheckIcon className="animate-pop" /> : <PlusIcon />}
        </button>
        <span role="status" aria-live="polite" className="sr-only">
          {added ? `Đã thêm ${productName} vào giỏ hàng` : ""}
        </span>
      </>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-md px-8 text-base font-semibold nut-nhan ${
          added
            ? "bg-primary-ink text-on-primary"
            : "bg-primary text-on-primary hover:bg-primary-hover"
        } ${className}`}
      >
        {added ? (
          <>
            <CheckIcon className="animate-pop" width={22} height={22} />
            Đã thêm vào giỏ
          </>
        ) : (
          <>
            <CartIcon width={22} height={22} />
            Thêm vào giỏ hàng
          </>
        )}
      </button>
      <span role="status" aria-live="polite" className="sr-only">
        {added ? `Đã thêm ${productName} vào giỏ hàng` : ""}
      </span>
    </>
  );
}
