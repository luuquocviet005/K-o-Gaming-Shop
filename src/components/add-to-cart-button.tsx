"use client";

import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart";
import { CartIcon, CheckIcon, PlusIcon } from "@/components/icons";

/**
 * Nút thêm vào giỏ. Sau khi bấm, chuyển sang trạng thái "Đã thêm" 1,6 giây
 * để người dùng nhận được phản hồi rõ ràng thay vì phải tự đoán.
 */
export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  variant = "full",
  productName,
  className = "",
}: {
  productId: string;
  variantId?: string;
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

  function handleClick() {
    addItem(productId, variantId, quantity);
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
          className={`grid size-11 shrink-0 cursor-pointer place-items-center rounded-full transition-all duration-200 active:scale-90 ${
            added
              ? "bg-primary text-on-primary"
              : "bg-surface-3 text-fg hover:bg-primary hover:text-on-primary"
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
        className={`inline-flex h-14 cursor-pointer items-center justify-center gap-2.5 rounded-full px-8 text-base font-semibold transition-all duration-200 active:scale-[0.97] ${
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
