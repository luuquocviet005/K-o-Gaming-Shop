"use client";

import { useEffect } from "react";
import { site } from "@/lib/site";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Đếm lượt khách bấm vào các nút liên hệ: Zalo, gọi điện, Facebook, TikTok.
 *
 * VÌ SAO ĐÁNG ĐO: shop chốt đơn qua Zalo, nên "bấm nút Zalo" chính là hành vi
 * gần với đơn hàng nhất mà website đo được. Biết trang nào đẻ ra nhiều lượt
 * bấm là biết nên dồn sức vào đâu.
 *
 * CÁCH LÀM: một bộ lắng nghe duy nhất ở cấp trang, bắt mọi cú bấm rồi lần
 * ngược lên tìm thẻ <a>. Nhờ vậy không phải sửa từng nút một trong hàng chục
 * chỗ, và nút thêm mới sau này tự động được đếm.
 *
 * Không có Google Analytics thì hàm gtag không tồn tại — mọi thứ im lặng bỏ
 * qua, không lỗi, không tốn gì.
 */
export function DoLienHe() {
  useEffect(() => {
    if (!site.ga4) return;

    function khiBam(e: MouseEvent) {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;

      const href = a.getAttribute("href") ?? "";
      let kenh: string | null = null;

      if (href.startsWith("tel:")) kenh = "goi_dien";
      else if (href.includes("zalo.me")) kenh = "zalo";
      else if (href.includes("facebook.com")) kenh = "facebook";
      else if (href.includes("tiktok.com")) kenh = "tiktok";
      else if (href.startsWith("mailto:")) kenh = "email";

      if (!kenh) return;

      window.gtag?.("event", "bam_lien_he", {
        kenh,
        // Biết khách bấm từ trang nào — trang sản phẩm nào ra nhiều đơn nhất
        trang: window.location.pathname,
      });
    }

    document.addEventListener("click", khiBam);
    return () => document.removeEventListener("click", khiBam);
  }, []);

  return null;
}
