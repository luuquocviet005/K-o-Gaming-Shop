/**
 * Cắt bộ logo mascot từ một file ảnh gốc nền trắng.
 *
 * Chạy:  node scripts/tao-bo-logo.mjs "D:\\Tạo trang web bán hàng\\logo-goc.png"
 *
 * Ảnh gốc là nhân vật toàn thân, nền trắng đặc. Script làm ba việc:
 *   1. Xoá nền trắng (loang từ mép ảnh vào, nên vùng trắng BÊN TRONG nhân vật
 *      — tròng mắt, vạch áo — vẫn giữ nguyên).
 *   2. Cắt sát nhân vật, xuất bản toàn thân nền trong suốt.
 *   3. Cắt vùng đầu + vai + tay cầm kẹo thành huy hiệu tròn cho header,
 *      favicon và avatar.
 *
 * Vùng cắt huy hiệu khai báo ở CAT_BADGE bên dưới theo TỈ LỆ của khung nhân
 * vật sau khi đã cắt sát — không phải toạ độ pixel tuyệt đối. Làm vậy để đổi
 * ảnh gốc kích thước khác vẫn chạy được.
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const NGUON = process.argv[2];
if (!NGUON) {
  console.error("Thiếu đường dẫn ảnh gốc.\nVí dụ: node scripts/tao-bo-logo.mjs \"D:\\\\Tạo trang web bán hàng\\\\logo-goc.png\"");
  process.exit(1);
}

const GOC = path.resolve(process.cwd(), "..");
const RA_PUBLIC = path.join(process.cwd(), "public");
const RA_APP = path.join(process.cwd(), "src", "app");
const RA_DESIGN = path.join(process.cwd(), "design", "logo", "mascot-anh");

/* Tỉ lệ khung cắt huy hiệu, tính trên khung nhân vật đã cắt sát.
   0 = mép trái/trên, 1 = mép phải/dưới. Chỉnh bốn số này là dịch được khung. */
const CAT_BADGE = { trai: 0.02, tren: 0.0, phai: 1.0, duoi: 0.46 };

const HONG_PHAN = { r: 255, g: 228, b: 238, alpha: 1 }; // --primary-soft
const HONG_DAM = "#c2185b"; // --primary

/** Ngưỡng coi là "trắng nền". Nét vẽ có viền nâu đậm nên để cao vẫn an toàn. */
const NGUONG_TRANG = 236;

/**
 * Xoá nền trắng bằng cách loang từ mép ảnh. Dùng loang thay vì "mọi pixel
 * trắng đều trong suốt" vì kiểu thứ hai sẽ khoét thủng cả áo trắng và tròng
 * mắt của nhân vật.
 */
async function xoaNenTrang(buf) {
  const { data, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: W, height: H } = info;
  const laNen = new Uint8Array(W * H);

  const trang = (i) => {
    const p = i * 4;
    return data[p] >= NGUONG_TRANG && data[p + 1] >= NGUONG_TRANG && data[p + 2] >= NGUONG_TRANG;
  };

  // Hàng đợi phẳng (Int32Array) thay cho mảng JS — ảnh 1024px là hơn 1 triệu
  // pixel, dùng array.push/shift ở cỡ đó chậm thấy rõ.
  const hang = new Int32Array(W * H);
  let dau = 0;
  let cuoi = 0;
  const nap = (i) => {
    if (!laNen[i] && trang(i)) {
      laNen[i] = 1;
      hang[cuoi++] = i;
    }
  };
  for (let x = 0; x < W; x++) {
    nap(x);
    nap((H - 1) * W + x);
  }
  for (let y = 0; y < H; y++) {
    nap(y * W);
    nap(y * W + W - 1);
  }
  while (dau < cuoi) {
    const i = hang[dau++];
    const x = i % W;
    const y = (i / W) | 0;
    if (x > 0) nap(i - 1);
    if (x < W - 1) nap(i + 1);
    if (y > 0) nap(i - W);
    if (y < H - 1) nap(i + W);
  }

  for (let i = 0; i < W * H; i++) if (laNen[i]) data[i * 4 + 3] = 0;
  return sharp(data, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
}

/** Cắt sát nhân vật, bỏ hết viền trong suốt thừa. */
async function catSat(buf) {
  return sharp(buf).trim({ threshold: 1 }).png().toBuffer();
}

/** Mặt nạ tròn kích thước n×n, dùng để bo huy hiệu. */
function matNaTron(n) {
  return Buffer.from(
    `<svg width="${n}" height="${n}"><circle cx="${n / 2}" cy="${n / 2}" r="${n / 2}" fill="#fff"/></svg>`,
  );
}

async function main() {
  for (const d of [RA_PUBLIC, RA_DESIGN]) await mkdir(d, { recursive: true });

  const goc = await sharp(NGUON).png().toBuffer();
  const sach = await catSat(await xoaNenTrang(goc));
  const m = await sharp(sach).metadata();
  console.log(`Nhân vật sau khi cắt sát: ${m.width}×${m.height}`);

  /* --- 1. Mascot toàn thân, nền trong suốt --- */
  const CAO_FULL = 1200;
  const full = await sharp(sach)
    .resize({ height: CAO_FULL, fit: "inside", withoutEnlargement: false })
    .png({ compressionLevel: 9 })
    .toBuffer();
  await writeFile(path.join(RA_PUBLIC, "mascot.png"), full);
  await writeFile(path.join(RA_DESIGN, "mascot-toan-than.png"), full);

  /* --- 2. Huy hiệu tròn: đầu + vai + tay cầm kẹo --- */
  const cl = Math.round(m.width * CAT_BADGE.trai);
  const ct = Math.round(m.height * CAT_BADGE.tren);
  const cw = Math.round(m.width * (CAT_BADGE.phai - CAT_BADGE.trai));
  const ch = Math.round(m.height * (CAT_BADGE.duoi - CAT_BADGE.tren));

  // Ép khung cắt về vuông, canh giữa theo bề ngang, để mặt không bị méo khi
  // nhét vào hình tròn.
  const canh = Math.max(cw, ch);
  const vuong = await sharp({
    create: { width: canh, height: canh, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([
      {
        input: await sharp(sach).extract({ left: cl, top: ct, width: cw, height: ch }).toBuffer(),
        left: Math.round((canh - cw) / 2),
        top: Math.round((canh - ch) / 2),
      },
    ])
    .png()
    .toBuffer();

  const N = 512;
  const DEM = 0.06; // chừa mép trong, mascot không dính sát viền tròn
  const trong = Math.round(N * (1 - DEM * 2));
  const badge = await sharp({
    create: { width: N, height: N, channels: 4, background: HONG_PHAN },
  })
    .composite([
      { input: await sharp(vuong).resize(trong, trong, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), left: Math.round(N * DEM), top: Math.round(N * DEM) },
      { input: matNaTron(N), blend: "dest-in" },
    ])
    .png()
    .toBuffer();
  await writeFile(path.join(RA_PUBLIC, "logo.png"), badge);
  await writeFile(path.join(RA_DESIGN, "huy-hieu-tron.png"), badge);

  /* --- 3. Favicon + icon màn hình điện thoại --- */
  await writeFile(path.join(RA_APP, "icon.png"), await sharp(badge).resize(96, 96).png().toBuffer());
  await writeFile(
    path.join(RA_PUBLIC, "apple-icon.png"),
    await sharp({ create: { width: 180, height: 180, channels: 4, background: HONG_PHAN } })
      .composite([{ input: await sharp(badge).resize(180, 180).toBuffer() }])
      .flatten({ background: HONG_PHAN })
      .png()
      .toBuffer(),
  );

  /* --- 4. Avatar fanpage / Zalo: vuông 1000, nền đặc (Zalo không nhận alpha) --- */
  await writeFile(
    path.join(RA_DESIGN, "avatar-fanpage-1000.png"),
    await sharp({ create: { width: 1000, height: 1000, channels: 4, background: HONG_PHAN } })
      .composite([{ input: await sharp(vuong).resize(860, 860, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer(), left: 70, top: 70 }])
      .flatten({ background: HONG_PHAN })
      .png()
      .toBuffer(),
  );

  console.log("Xong. Xem trong public/ và design/logo/mascot-anh/");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
