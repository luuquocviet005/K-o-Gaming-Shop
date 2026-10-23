#!/usr/bin/env node
/**
 * Sửa code của một phần mà không sửa ghi chú kiến thức của phần đó → báo lỗi.
 *
 * VÌ SAO CẦN: AI không nhớ gì giữa các phiên — `docs/kien-thuc/` là trí nhớ
 * duy nhất. "Xong việc nhớ cập nhật ghi chú" mà chỉ ghi trong AGENTS.md thì AI
 * quên, ghi chú cũ dần, AI sau đọc phải điều sai rồi lặp lại lỗi đã sửa.
 *
 * Sửa vặt không có gì đáng ghi: thêm dòng `[bo-qua-ghi-chu]` (đứng RIÊNG một
 * dòng) vào lời nhắn commit. Phải đứng riêng vì lời nhắn nhắc tới thẻ này khi
 * mô tả nó cũng không được tính là bỏ qua.
 *
 * Dùng: node scripts/kiem-tra-ghi-chu.mjs [nhánh gốc, mặc định origin/main]
 */
import { execFileSync } from "node:child_process";

/*
 * Đường dẫn code → ghi chú phải sửa cùng. Khớp tiền tố, dòng đầu tiên khớp
 * thì thắng. Giao diện chung (src/app, phần còn lại của src/components) không
 * nằm đây: sửa nhỏ quá thường xuyên, bắt ghi chú mỗi lần chỉ sinh ghi chú rác.
 */
const PHAN = [
  { tienTo: ["src/components/ai-chatbox/"], ghiChu: "chatbot.md" },
  {
    tienTo: [
      "scripts/sync-sheet.mjs",
      "scripts/inspect-sheet.mjs",
      "scripts/lib/csv.mjs",
      "sync.config.json",
      ".github/workflows/dong-bo-sheet.yml",
    ],
    ghiChu: "bang-hang-sheet.md",
  },
  {
    tienTo: [
      ".github/workflows/",
      "eslint/",
      "eslint.config.mjs",
      "next.config.ts",
      "scripts/postbuild.mjs",
      "scripts/check-links.mjs",
      "scripts/audit.mjs",
      "scripts/contrast.mjs",
      "scripts/kiem-tra-ghi-chu.mjs",
      "scripts/lib/kiem-tra-deploy.mjs",
    ],
    ghiChu: "deploy-va-kiem-tra.md",
  },
  {
    tienTo: [
      "scripts/nap-anh.mjs",
      "scripts/tu-dong.mjs",
      "scripts/push.mjs",
      "scripts/thu-cong.mjs",
      "scripts/giai-nen-ngay.mjs",
      "scripts/chay-ngam.vbs",
      "scripts/lib/",
    ],
    ghiChu: "nap-anh.md",
  },
  { tienTo: [".claude/", ".agents/"], ghiChu: "moi-truong-ai.md" },
];

const BO_QUA = "[bo-qua-ghi-chu]";
const DONG_BO_QUA = /^\s*\[bo-qua-ghi-chu\]\s*$/m;

const goc = process.argv[2] ?? "origin/main";
const git = (...args) => execFileSync("git", args, { encoding: "utf8" });

const fileDoi = git("diff", "--name-only", `${goc}...HEAD`).split("\n").filter(Boolean);
const loiNhan = git("log", "--format=%B", `${goc}..HEAD`);

if (DONG_BO_QUA.test(loiNhan)) {
  console.log(`Có ${BO_QUA} trong lời nhắn commit — bỏ qua kiểm tra ghi chú.`);
  process.exit(0);
}

const thieu = new Map(); // ghi chú → các file code đã sửa
for (const file of fileDoi) {
  const phan = PHAN.find((p) => p.tienTo.some((t) => file.startsWith(t)));
  if (!phan) continue;
  if (fileDoi.includes(`docs/kien-thuc/${phan.ghiChu}`)) continue;
  if (!thieu.has(phan.ghiChu)) thieu.set(phan.ghiChu, []);
  thieu.get(phan.ghiChu).push(file);
}

if (thieu.size === 0) {
  console.log("✓ Ghi chú kiến thức đã đi cùng code.");
  process.exit(0);
}

console.error("✗ Sửa code mà chưa sửa ghi chú kiến thức đi kèm:\n");
for (const [ghiChu, files] of thieu) {
  console.error(`  docs/kien-thuc/${ghiChu}`);
  for (const f of files) console.error(`      vì đã sửa ${f}`);
}
console.error(
  `\nCập nhật ghi chú cho đúng với code mới (bẫy vừa gặp, điều đã hết đúng, việc còn dở).` +
    `\nSửa vặt không có gì đáng ghi thì thêm một dòng riêng ${BO_QUA} vào lời nhắn commit.`,
);
process.exit(1);
