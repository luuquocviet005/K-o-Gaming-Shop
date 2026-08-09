import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Xuất ra HTML/CSS/JS tĩnh trong thư mục `out/` -> chạy được trên MỌI gói
  // Hostinger (shared hosting, Business, VPS) mà không cần Node.js server.
  output: "export",

  // Sinh ra /gio-hang/index.html thay vì /gio-hang.html.
  // Apache trên Hostinger phục vụ index.html của thư mục nên link không bị 404.
  trailingSlash: true,

  // Static export không có server tối ưu ảnh -> phục vụ ảnh gốc.
  images: {
    unoptimized: true,
  },

  productionBrowserSourceMaps: false,

  /**
   * Chỉ có tác dụng khi nền tảng deploy chạy ở CHẾ ĐỘ MÁY CHỦ (Hostinger
   * Deployment). Ở chế độ tĩnh, Next bỏ qua phần này và `.htaccess` lo việc
   * cache.
   *
   * Vì sao cần: ở chế độ máy chủ, Next tự gắn `s-maxage=31536000` cho trang
   * đã dựng sẵn — CDN của Hostinger giữ HTML tới MỘT NĂM, nên deploy xong
   * khách vẫn thấy bản cũ. File trong /_next/static/ có mã băm trong tên nên
   * cache vĩnh viễn vẫn an toàn, riêng HTML thì phải kiểm tra lại mỗi lần.
   */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
