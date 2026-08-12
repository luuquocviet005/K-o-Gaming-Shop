/**
 * Vẽ public/anh-chia-se.png — tấm ảnh hiện trong thẻ xem trước khi ai đó dán
 * link trang chủ vào Zalo / Messenger / Facebook.
 *
 *   node scripts/tao-anh-chia-se.mjs
 *
 * Chỉ cần chạy lại khi đổi logo hoặc màu thương hiệu. Ảnh sinh ra được commit
 * vào repo nên bản build không phụ thuộc vào script này.
 *
 * 1200×630 là khung Facebook và Zalo dùng để cắt thẻ xem trước; lệch tỉ lệ này
 * thì ảnh bị cắt mất hai đầu.
 *
 * KHÔNG có chữ trong ảnh. librsvg bên trong sharp lấy font từ hệ điều hành, mà
 * máy dựng web không chắc có font đọc được dấu tiếng Việt — "KẸO" rất dễ thành
 * "KO" hoặc ô vuông, và lỗi đó chỉ lộ ra sau khi đã gửi link cho khách. Zalo và
 * Facebook vốn đã hiện tên shop cùng mô tả ngay dưới ảnh, nên ảnh chỉ cần nhận
 * ra được bằng mắt là đủ. Vẽ hình thì chạy ở máy nào cũng ra đúng một kết quả.
 */

import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const HONG = "#c2185b";
const HONG_NHAT = "#ffd9e7";
const NEN = "#fdf7f9";

/** Viên kẹo trang trí: thân bầu dục + hai đầu xoắn */
const vienKeo = (x, y, xoay, to) => `
  <g transform="translate(${x} ${y}) rotate(${xoay}) scale(${to})">
    <path d="M-34 0 -47 -14 -43 0 -47 14Z" fill="${HONG_NHAT}"/>
    <path d="M34 0 47 -14 43 0 47 14Z" fill="${HONG_NHAT}"/>
    <ellipse rx="34" ry="21" fill="${HONG_NHAT}"/>
    <ellipse cx="-10" cy="-6" rx="10" ry="5" fill="#ffffff" opacity="0.55"/>
  </g>`;

/** Logo — cùng hình với src/app/icon.svg, phóng từ khung 32 lên khung 320 */
const logo = `
  <g transform="translate(440 155) scale(10)">
    <rect width="32" height="32" rx="9" fill="${HONG}"/>
    <g fill="#ffffff">
      <path d="M2.8 11.2 6.5 16l-3.7 4.8a.7.7 0 0 1-1.3-.4v-8.8a.7.7 0 0 1 1.3-.4Z"/>
      <path d="M29.2 11.2 25.5 16l3.7 4.8a.7.7 0 0 0 1.3-.4v-8.8a.7.7 0 0 0-1.3-.4Z"/>
      <rect x="7.5" y="8.5" width="17" height="15" rx="7.5"/>
    </g>
    <g stroke="${HONG}" stroke-width="2" stroke-linecap="round" fill="none">
      <path d="M12.4 13.6c2.2-1.5 4.4-1.5 6.6 0"/>
      <path d="M12.4 18.4c2.2-1.5 4.4-1.5 6.6 0"/>
    </g>
  </g>`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${NEN}"/>

  <!-- Dải sọc kẹo trên và dưới -->
  <rect width="1200" height="22" fill="${HONG}"/>
  <rect y="608" width="1200" height="22" fill="${HONG}"/>

  <!-- Kẹo rải quanh logo -->
  ${vienKeo(165, 145, -22, 1.5)}
  ${vienKeo(1035, 160, 24, 1.25)}
  ${vienKeo(1055, 495, -16, 1.55)}
  ${vienKeo(150, 480, 18, 1.3)}
  ${vienKeo(600, 560, 0, 1.0)}

  ${logo}
</svg>`;

const png = await sharp(Buffer.from(svg))
  .png({ compressionLevel: 9, palette: true })
  .toBuffer();

await writeFile(join(root, "public", "anh-chia-se.png"), png);

const meta = await sharp(png).metadata();
console.log(
  `✓ Đã vẽ public/anh-chia-se.png — ${meta.width}×${meta.height}, ${(png.length / 1024).toFixed(0)} KB`,
);
