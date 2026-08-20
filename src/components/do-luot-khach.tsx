import Script from "next/script";
import { site } from "@/lib/site";

/**
 * Google Analytics.
 *
 * KHÔNG gắn gì khi `site.ga4` còn trống — không tải script, không cookie,
 * trang nhẹ y như trước. Nhờ vậy dự án vẫn chạy bình thường ở máy người khác
 * hoặc lúc dựng thử, và chủ shop bật lên chỉ bằng cách dán mã vào site.ts.
 *
 * `afterInteractive`: chờ trang hiện xong rồi mới tải. Đo lượt khách không
 * đáng để làm chậm thứ khách đang chờ xem.
 *
 * Trang tĩnh nên mỗi lần chuyển trang là một lần tải lại thật — GA tự đếm,
 * không cần đoạn mã theo dõi điều hướng như ở web động.
 */
export function DoLuotKhach() {
  if (!site.ga4) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${site.ga4}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${site.ga4}');
        `}
      </Script>
    </>
  );
}
