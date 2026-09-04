/**
 * Hạ dòng chữ "GEAR" xuống cho giãn khỏi dòng "KẸO GAMING".
 *
 *   node _tam-ha-gear.mjs <số px hạ xuống> <file ra>
 *   node _tam-ha-gear.mjs --do          # chỉ đo, không xuất ảnh
 *
 * File tạm, xoá sau khi chốt xong ảnh bìa.
 */
import sharp from "sharp";
import { writeFile } from "node:fs/promises";

const NEN = "C:/Users/OS/Downloads/Gemini_Generated_Image_6a7dtz6a7dtz6a7d.png";
const CHI_DO = process.argv[2] === "--do";
const HA = Number(process.argv[2] ?? 55);
const RA = process.argv[3];

const YA = 335, YB = 880, XA = 1250, XB = 3120;
const laChuMau = (R, G) => R - G >= 35 && (R < 150 || R > 200);
const NOI_RONG = 22;

export async function maskChu() {
  const { data, info } = await sharp(NEN).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const W = info.width, H = info.height;
  const idx = (x, y) => y * W + x;

  const tho = new Uint8Array(W * H);
  for (let y = YA; y <= YB; y++)
    for (let x = XA; x <= XB; x++) {
      const p = idx(x, y) * 4;
      if (laChuMau(data[p], data[p + 1])) tho[idx(x, y)] = 1;
    }

  // giữ cụm liên thông lớn nhất = khối chữ
  const nhan = new Int32Array(W * H).fill(-1);
  const q = new Int32Array(W * H);
  let cum = 0, cumChu = -1, maxN = 0;
  for (let y = YA; y <= YB; y++)
    for (let x = XA; x <= XB; x++) {
      const i = idx(x, y);
      if (!tho[i] || nhan[i] >= 0) continue;
      let d = 0, c = 0, n = 0;
      q[c++] = i; nhan[i] = cum;
      while (d < c) {
        const j = q[d++], jx = j % W, jy = (j / W) | 0;
        n++;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const nx = jx + dx, ny = jy + dy;
          if (nx < XA || nx > XB || ny < YA || ny > YB) continue;
          const k = idx(nx, ny);
          if (tho[k] && nhan[k] < 0) { nhan[k] = cum; q[c++] = k; }
        }
      }
      if (n > maxN) { maxN = n; cumChu = cum; }
      cum++;
    }
  const mask = new Uint8Array(W * H);
  for (let y = YA; y <= YB; y++)
    for (let x = XA; x <= XB; x++) if (nhan[idx(x, y)] === cumChu) mask[idx(x, y)] = 1;

  // lấp lỗ: vệt sáng bóng bên trong nét chữ gần trắng nên bộ lọc màu bỏ sót
  const ngoai = new Uint8Array(W * H);
  {
    let d = 0, c = 0;
    const nap = (x, y) => { const i = idx(x, y); if (!ngoai[i] && !mask[i]) { ngoai[i] = 1; q[c++] = i; } };
    for (let x = XA; x <= XB; x++) { nap(x, YA); nap(x, YB); }
    for (let y = YA; y <= YB; y++) { nap(XA, y); nap(XB, y); }
    while (d < c) {
      const j = q[d++], jx = j % W, jy = (j / W) | 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = jx + dx, ny = jy + dy;
        if (nx < XA || nx > XB || ny < YA || ny > YB) continue;
        nap(nx, ny);
      }
    }
  }
  for (let y = YA; y <= YB; y++)
    for (let x = XA; x <= XB; x++) { const i = idx(x, y); if (!mask[i] && !ngoai[i]) mask[i] = 1; }

  return { data, W, H, mask, idx };
}

function bbox(mask, idx, W, ya, yb) {
  let x0 = 1e9, x1 = -1, y0 = 1e9, y1 = -1, n = 0;
  for (let y = ya; y <= yb; y++)
    for (let x = XA; x <= XB; x++)
      if (mask[idx(x, y)]) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { x0, x1, y0, y1, n };
}

async function main() {
  const { data, W, H, mask, idx } = await maskChu();

  // tìm hàng thưa nhất trong khe giữa hai dòng, đo TRÊN MASK SẠCH
  let min = 1e9, yCat = 0;
  for (let y = 545; y <= 620; y++) {
    let c = 0;
    for (let x = XA; x <= XB; x++) if (mask[idx(x, y)]) c++;
    if (c < min) { min = c; yCat = y; }
  }
  const d1 = bbox(mask, idx, W, YA, yCat - 1);
  const d2 = bbox(mask, idx, W, yCat, YB);
  console.log(`Hàng cắt hai dòng: y=${yCat} (${min} px chữ trên hàng đó)`);
  console.log(`  Dòng 1  KẸO GAMING : x ${d1.x0}-${d1.x1}  y ${d1.y0}-${d1.y1}`);
  console.log(`  Dòng 2  GEAR       : x ${d2.x0}-${d2.x1}  y ${d2.y0}-${d2.y1}`);
  console.log(`  Khe hiện tại giữa hai dòng: ${d2.y0 - d1.y1} px  (chiều cao chữ ~${d1.y1 - d1.y0} px)`);
  if (CHI_DO) return;

  /* --- vùng chỉ thuộc dòng GEAR --- */
  const gear = new Uint8Array(W * H);
  for (let y = yCat; y <= YB; y++)
    for (let x = XA; x <= XB; x++) if (mask[idx(x, y)]) gear[idx(x, y)] = 1;

  /* --- nới rộng để trùm bóng đổ cũ của GEAR --- */
  const g = Buffer.alloc(W * H);
  for (let i = 0; i < W * H; i++) g[i] = gear[i] ? 255 : 0;
  const noi = await sharp(g, { raw: { width: W, height: H, channels: 1 } })
    .blur(NOI_RONG / 2).threshold(12).raw().toBuffer();

  /* --- vá nền chỗ GEAR cũ: nội suy dọc theo từng cột --- */
  const ra = Buffer.from(data);
  for (let x = d2.x0 - NOI_RONG; x <= d2.x1 + NOI_RONG; x++) {
    if (x < 0 || x >= W) continue;
    let y = 0;
    while (y < H) {
      if (!noi[idx(x, y)]) { y++; continue; }
      let y2 = y;
      while (y2 < H && noi[idx(x, y2)]) y2++;
      const pT = y - 1 >= 0 ? idx(x, y - 1) * 4 : -1;
      const pD = y2 < H ? idx(x, y2) * 4 : -1;
      for (let yy = y; yy < y2; yy++) {
        const t = (yy - y + 1) / (y2 - y + 1), p = idx(x, yy) * 4;
        for (let ch = 0; ch < 3; ch++) {
          const a = pT >= 0 ? data[pT + ch] : data[pD + ch];
          const b = pD >= 0 ? data[pD + ch] : data[pT + ch];
          ra[p + ch] = Math.round(a * (1 - t) + b * t);
        }
      }
      y = y2;
    }
  }

  /* --- cắt GEAR thành sprite --- */
  const rw = d2.x1 - d2.x0 + 1, rh = d2.y1 - d2.y0 + 1;
  const sp = Buffer.alloc(rw * rh * 4);
  for (let y = d2.y0; y <= d2.y1; y++)
    for (let x = d2.x0; x <= d2.x1; x++) {
      const s = idx(x, y) * 4, t = ((y - d2.y0) * rw + (x - d2.x0)) * 4;
      sp[t] = data[s]; sp[t + 1] = data[s + 1]; sp[t + 2] = data[s + 2];
      sp[t + 3] = gear[idx(x, y)] ? 255 : 0;
    }
  const alphaMem = await sharp(
    await sharp(sp, { raw: { width: rw, height: rh, channels: 4 } }).extractChannel(3).toBuffer(),
    { raw: { width: rw, height: rh, channels: 1 } },
  ).blur(0.8).toBuffer();
  const gearPng = await sharp(
    await sharp(sp, { raw: { width: rw, height: rh, channels: 4 } }).removeAlpha().raw().toBuffer(),
    { raw: { width: rw, height: rh, channels: 3 } },
  ).joinChannel(alphaMem, { raw: { width: rw, height: rh, channels: 1 } }).png().toBuffer();

  const bongAlpha = await sharp(alphaMem, { raw: { width: rw, height: rh, channels: 1 } })
    .blur(13).linear(0.4, 0).toBuffer();
  const bong = await sharp({ create: { width: rw, height: rh, channels: 3, background: { r: 78, g: 42, b: 52 } } })
    .joinChannel(bongAlpha, { raw: { width: rw, height: rh, channels: 1 } }).png().toBuffer();

  const nenVa = await sharp(ra, { raw: { width: W, height: H, channels: 4 } }).png().toBuffer();
  const ghep = await sharp(nenVa)
    .composite([
      { input: bong, left: d2.x0 - 9, top: d2.y0 + HA + 11 },
      { input: gearPng, left: d2.x0, top: d2.y0 + HA },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

  await writeFile(RA, ghep);
  console.log(`Đã hạ GEAR xuống ${HA}px -> ${RA}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
