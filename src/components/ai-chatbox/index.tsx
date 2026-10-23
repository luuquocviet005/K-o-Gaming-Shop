"use client";

import { useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import { getProduct } from "@/lib/products";
import { danhThucMayChu } from "./may-chu";
import { useTroChuyen } from "./use-tro-chuyen";
import { KhungChat } from "./khung-chat";
import { NutNoi } from "./nut-noi";
import { QrPhongTo } from "./qr-phong-to";

/*
 * Khung chat AI ở góc dưới mọi trang. Mỗi file trong thư mục này một việc:
 *   may-chu.ts           gọi backend ai-marketing-town, đánh thức máy chủ
 *   tra-loi-du-phong.ts  trả lời ngay trên trình duyệt khi backend không trả lời
 *   use-tro-chuyen.ts    tin nhắn, hàng chờ, gửi/nhận
 *   khung-chat.tsx       giao diện khung chat đang mở
 *   nut-noi.tsx          nút nổi khi khung chat đóng (máy tính + menu di động)
 *   qr-phong-to.tsx      ảnh QR chuyển khoản phóng to
 */
export function AiChatbox() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  // Ảnh QR đang phóng to (null = đóng).
  const [qrPhongTo, setQrPhongTo] = useState<string | null>(null);
  const dongQr = useCallback(() => setQrPhongTo(null), []);

  // Nhận diện sản phẩm khách đang xem từ URL (/san-pham/<slug>)
  const productSlugMatch = pathname?.match(/^\/san-pham\/([^/]+)/);
  const currentProductSlug = productSlugMatch ? productSlugMatch[1] : null;
  const currentProduct = currentProductSlug ? getProduct(currentProductSlug) : undefined;

  const troChuyen = useTroChuyen(pathname, currentProductSlug, currentProduct);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end sm:bottom-5 sm:right-5">
      {open ? (
        <KhungChat
          troChuyen={troChuyen}
          currentProduct={currentProduct}
          expanded={expanded}
          setExpanded={setExpanded}
          onDong={() => setOpen(false)}
          onPhongToQr={setQrPhongTo}
        />
      ) : (
        <NutNoi
          currentProduct={currentProduct}
          onMoChat={() => {
            danhThucMayChu();
            setOpen(true);
          }}
        />
      )}
      {qrPhongTo && <QrPhongTo url={qrPhongTo} onDong={dongQr} />}
    </div>
  );
}
