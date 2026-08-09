import type { Metadata } from "next";
import { CartView } from "@/components/cart-view";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Giỏ hàng",
  description: "Xem lại các sản phẩm bạn đã chọn tại KẸO GAMING SHOP.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-page py-8 lg:py-12">
      <Breadcrumbs items={[{ label: "Giỏ hàng" }]} />
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
        Giỏ hàng của bạn
      </h1>
      <CartView />
    </div>
  );
}
