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
};

export default nextConfig;
