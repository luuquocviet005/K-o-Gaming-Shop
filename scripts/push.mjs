/**
 * Kiểm tra → commit → push, trong một lệnh.
 *
 *   npm run push                    (tự đặt lời nhắn theo ngày giờ)
 *   npm run push -- "Sửa giá chuột"  (lời nhắn tự đặt)
 *
 * VÌ SAO PHẢI KIỂM TRA TRƯỚC KHI PUSH:
 * Nhánh main nối thẳng với Hostinger — push xong là website thật deploy lại.
 * Nếu bản build hỏng hoặc có link chết mà vẫn push, khách vào keogaminggear.com
 * sẽ thấy trang lỗi. Nên mọi bước dưới đây phải qua hết thì mới được push.
 */

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ghiMocPhienBan,
  doiWebCapNhat,
  docMocTrenWeb,
} from "./lib/kiem-tra-deploy.mjs";
import { giuKhoa } from "./lib/khoa.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/*
 * Giành khoá TRƯỚC KHI làm bất cứ việc gì.
 *
 * Lượt tự động 15 phút cũng chạy đúng các bước dưới đây. Hai lượt chồng nhau
 * thì `next build` báo "Another next build process is already running", còn
 * `git pull --rebase` thì để repo kẹt giữa một cuộc rebase dở dang với dấu
 * <<<<<<< nằm trong products.json — từ đó MỌI lượt sau đều chết ở bước kiểm
 * tra kiểu dữ liệu, ảnh đứng luôn nhiều ngày. Đã xảy ra thật ngày 21/8/2026.
 *
 * tu-dong.mjs và thu-cong.mjs giành khoá rồi mới gọi file này; khoá nhận ra
 * điều đó qua biến môi trường nên không tự chặn mình.
 */
if (!giuKhoa()) {
  console.error("");
  console.error("  Đang có một lượt nạp ảnh/đưa lên web khác chạy dở (thường");
  console.error("  là lượt tự động 15 phút). Chờ nó xong rồi chạy lại — chen");
  console.error("  vào lúc này dễ làm kẹt Git.");
  console.error("");
  process.exit(1);
}

/**
 * Chạy một lệnh, KHÔNG dùng shell.
 *
 * Vì sao không gọi qua `npm run ...`: trên Windows `npm` là file .cmd, mà
 * Node 24 chặn thực thi .cmd nếu không bật shell (lý do bảo mật). Còn bật
 * shell thì lời nhắn commit có dấu cách lại bị cắt vụn. Nên gọi thẳng từng
 * công cụ bằng chính Node đang chạy — cách này giống nhau trên mọi hệ điều hành.
 */
function run(cmd, args, { quiet = false, env } = {}) {
  const r = spawnSync(cmd, args, {
    cwd: root,
    stdio: quiet ? "pipe" : "inherit",
    encoding: "utf8",
    env: env ? { ...process.env, ...env } : process.env,
  });
  if (r.error) return { code: 1, out: String(r.error.message) };
  return { code: r.status ?? 1, out: (r.stdout ?? "") + (r.stderr ?? "") };
}

const node = process.execPath;
const bin = (...p) => join(root, "node_modules", ...p);

function step(label, cmd, args) {
  process.stdout.write(`  ${label} … `);
  const { code, out } = run(cmd, args, { quiet: true });
  if (code !== 0) {
    console.log("HỎNG\n");
    console.log(out);
    console.error(`✗ Dừng lại: bước "${label}" không qua. KHÔNG push gì cả.`);
    console.error("  Sửa xong rồi chạy lại `npm run push`.\n");
    process.exit(1);
  }
  console.log("đạt");
}

/**
 * Gỡ một cuộc gộp code (rebase) còn dang dở từ lượt trước.
 *
 * VÌ SAO CẦN: máy để ở nhà, lượt tự động 15 phút có thể bị cắt ngang bất cứ
 * lúc nào — tắt máy, ngủ đông, mất điện, tác vụ bị kill. Cắt đúng giữa `git
 * pull --rebase` thì thư mục .git/rebase-merge nằm lại đó, và MỌI lượt sau đều
 * chết ngay tại bước gộp với thông báo "already a rebase-merge directory".
 * Không ai sửa vì không ai đọc được tiếng Git — ảnh cứ thế nằm im nhiều ngày.
 * Đã xảy ra hai lần: 21/8 và 22/8/2026.
 *
 * PHẢI CHẠY ĐẦU TIÊN, trước cả khi xem có gì để push: lúc repo còn kẹt giữa
 * rebase thì `git commit` bên dưới sẽ đẻ commit vào đúng chỗ dang dở đó.
 */
function goRebaseKet() {
  if (
    !existsSync(join(root, ".git", "rebase-merge")) &&
    !existsSync(join(root, ".git", "rebase-apply"))
  ) {
    return;
  }

  console.log("  · Có một cuộc gộp code dang dở từ lượt trước — đang gỡ…");

  // Mã hai chữ đầu dòng `git status --porcelain`: hai bên cùng sửa một file
  // thì Git đánh dấu UU/AA/DD/AU/UA/DU/UD — đó là xung đột thật.
  const banDo = () => run("git", ["status", "--porcelain"], { quiet: true }).out;

  if (banDo().split("\n").some((d) => /^(UU|AA|DD|AU|UA|DU|UD)\s/.test(d))) {
    console.error("");
    console.error("✗ Lượt trước bị cắt ngang giữa lúc gộp code, và đang có xung đột");
    console.error("  thật sự cần người quyết định. Không dám tự chọn giùm.");
    console.error("  Chạy `git status` trong thư mục dự án để xem chi tiết.");
    console.error("");
    process.exit(1);
  }

  // Thử kết thúc cho trọn trước — cách này không đụng gì tới file đang có.
  // GIT_EDITOR=true vì không có ai ngồi trước màn hình để đóng trình soạn thảo.
  if (
    run("git", ["rebase", "--continue"], {
      quiet: true,
      env: { GIT_EDITOR: "true" },
    }).code === 0
  ) {
    console.log("    ✓ Đã gộp nốt phần dang dở.");
    return;
  }

  /*
   * Tới đây mới phải huỷ. `git rebase --abort` XOÁ SẠCH mọi thay đổi chưa
   * commit — mà ở đây thường chính là bộ ảnh vừa nạp xong. Nên phải cất chúng
   * vào ngăn tạm (stash) trước, huỷ xong lấy ra.
   *
   * Đây không phải lo xa: bản sửa đầu tiên của chính hàm này đã bị chính nó
   * xoá mất khi chạy thử ngày 22/8/2026.
   */
  const coViecDangDo = banDo().trim() !== "";

  if (coViecDangDo) {
    const cat = run(
      "git",
      ["stash", "push", "--include-untracked", "-m", "keo-go-rebase-ket"],
      { quiet: true },
    );
    if (cat.code !== 0) {
      console.error("");
      console.error("✗ Không cất tạm được các thay đổi đang có, nên không dám huỷ");
      console.error("  cuộc gộp dở (huỷ là mất ảnh vừa nạp). Chạy `git status`.");
      console.error("");
      process.exit(1);
    }
  }

  if (run("git", ["rebase", "--abort"], { quiet: true }).code !== 0) {
    console.error("");
    console.error("✗ Không gỡ được cuộc gộp code dang dở.");
    console.error("  Chạy `git rebase --abort` trong thư mục dự án rồi thử lại.");
    if (coViecDangDo) {
      console.error("  Thay đổi đang nằm trong ngăn tạm: `git stash pop`.");
    }
    console.error("");
    process.exit(1);
  }

  if (coViecDangDo && run("git", ["stash", "pop"], { quiet: true }).code !== 0) {
    console.error("");
    console.error("✗ Đã huỷ được cuộc gộp dở, nhưng lấy lại các thay đổi thì vướng.");
    console.error("  KHÔNG mất gì cả — chúng đang nằm trong ngăn tạm của Git.");
    console.error("  Chạy `git stash list` rồi `git stash pop` để lấy ra.");
    console.error("");
    process.exit(1);
  }

  console.log("    ✓ Đã huỷ cuộc gộp dở; sẽ gộp lại từ đầu ngay sau đây.");
}

console.log("");
console.log("═══ KIỂM TRA TRƯỚC KHI PUSH ═══");

goRebaseKet();

// Có gì để push không?
const { out: status } = run("git", ["status", "--porcelain"], { quiet: true });
const { out: ahead } = run("git", ["rev-list", "--count", "origin/main..main"], {
  quiet: true,
});

if (!status.trim() && Number(ahead.trim()) === 0) {
  console.log("");
  console.log("  Không có thay đổi nào. Mọi thứ đã đồng bộ với GitHub.");
  console.log("");
  process.exit(0);
}

/*
 * Sinh ảnh phái sinh (_nho.webp, chia-se.jpg) TRƯỚC khi build.
 *
 * Bước này nằm trong `npm run build`, nhưng ở đây gọi thẳng `next build` nên
 * nó bị bỏ qua — và đó từng làm hỏng toàn bộ dây chuyền tự động: món mới nạp
 * ảnh xong không có _nho.webp, "Quét link chết" thấy thẻ sản phẩm trỏ vào file
 * không tồn tại nên chặn push, ảnh nằm lại trên máy nhiều ngày mà web không đổi.
 * Thêm nữa nap-anh.mjs xoá sạch thư mục món trước khi ghi ảnh mới, nên món CŨ
 * vừa đổi ảnh cũng mất hai file này — phải sinh lại ở đây thì mới đủ.
 */
step("Sinh ảnh thu nhỏ & ảnh chia sẻ", node, [
  join(root, "scripts", "anh-chia-se-san-pham.mjs"),
]);
step("Kiểm tra kiểu dữ liệu", node, [bin("typescript", "bin", "tsc"), "--noEmit"]);
step("Kiểm tra code (lint)", node, [bin("eslint", "bin", "eslint.js")]);
step("Build trang tĩnh", node, [bin("next", "dist", "bin", "next"), "build"]);
step("Chuẩn bị thư mục out/", node, [join(root, "scripts", "postbuild.mjs")]);
step("Quét link chết", node, [join(root, "scripts", "check-links.mjs")]);
step("Kiểm tra SEO", node, [join(root, "scripts", "audit.mjs")]);
step("Kiểm tra tương phản màu", node, [join(root, "scripts", "contrast.mjs")]);

console.log("");
console.log("═══ ĐẨY LÊN GITHUB ═══");

const custom = process.argv.slice(2).join(" ").trim();
const now = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
const message = custom || `Cập nhật nội dung website — ${now}`;

/**
 * Mốc phiên bản để lát nữa hỏi lại web thật xem đã dựng lại chưa.
 *
 * Chỉ ghi mốc mới khi thật sự có thứ để commit. Lượt tự động 15 phút mà lượt
 * nào cũng đẻ ra một file đổi thì lượt nào cũng deploy — mỗi ngày gần trăm lần
 * dựng lại web mà chẳng có gì mới.
 */
let moc = null;

if (status.trim()) {
  moc = await ghiMocPhienBan(root);
  if (run("git", ["add", "-A"]).code !== 0) process.exit(1);
  if (run("git", ["commit", "-m", message]).code !== 0) process.exit(1);
  console.log(`  ✓ Đã commit: ${message}`);
} else {
  console.log("  · Không có thay đổi mới, chỉ đẩy commit đang chờ");
  // Commit đang chờ đã mang sẵn một mốc — dùng chính nó để đối chiếu.
  try {
    moc = (await readFile(join(root, "public", "version.txt"), "utf8")).trim();
  } catch {
    /* chưa có file mốc (lần đầu chạy bản này) — bỏ qua bước xác minh */
  }

  /*
   * Nhưng chỉ dùng được nếu web CHƯA mang sẵn mốc đó.
   *
   * Commit đang chờ có thể là commit tạo bằng tay, không đụng tới version.txt —
   * khi ấy mốc trong file y hệt mốc đang chạy trên web, và phép đối chiếu sẽ
   * khớp ngay lập tức rồi báo "đã cập nhật (sau 0 giây)" trong khi Hostinger
   * còn chưa build. Báo đúng nhầm còn nguy hơn báo sai: nó ru ngủ.
   */
  if (moc && (await docMocTrenWeb(root)) === moc) {
    moc = null;
  }
}

/**
 * Kéo bản trên mạng về trước khi đẩy.
 *
 * GitHub Actions tự chạy 20 phút một lần và commit lại bảng hàng, nên rất hay
 * xảy ra chuyện trên mạng đã đi trước trong lúc mình đang làm. Không gộp
 * trước thì push bị từ chối và người dùng phải tự xử lý Git — thứ họ không
 * nên phải biết.
 */
console.log("  · Đồng bộ với bản trên GitHub…");
if (run("git", ["pull", "--rebase", "origin", "main"], { quiet: true }).code !== 0) {
  console.error("");
  console.error("✗ Không gộp được với bản trên GitHub (có thể đang xung đột).");
  console.error("  Chạy `git status` để xem chi tiết.");
  console.error("");
  process.exit(1);
}

if (run("git", ["push", "origin", "main"]).code !== 0) {
  console.error("");
  console.error("✗ Push thất bại. Thường do chưa đăng nhập GitHub.");
  console.error("  Chạy `git push origin main` một lần trong terminal để đăng nhập.");
  console.error("");
  process.exit(1);
}

console.log("");
console.log("  ✓ Đã đẩy lên https://github.com/luuquocviet005/K-o-Gaming-Shop");

/*
 * Hỏi lại CHÍNH WEB THẬT xem đã nhận bản này chưa.
 *
 * Đây mới là câu hỏi đáng quan tâm. Bản trước hỏi workflow FTP trên GitHub —
 * một con đường đã cố ý tắt, nên nó báo hỏng ở mỗi lần push suốt nhiều ngày
 * trong khi web vẫn lên hàng bình thường. Hỏi thẳng web thật thì không đoán
 * mò: thấy đúng mốc là chắc chắn đã cập nhật, không thấy là chắc chắn chưa.
 */
if (moc) {
  console.log("  · Chờ Hostinger dựng lại web…");
  const kq = await doiWebCapNhat(root, moc);

  if (kq.xong) {
    console.log(`  ✓ Web thật đã cập nhật (sau ${kq.giay} giây).`);
  } else if (kq.ly_do === "het-gio") {
    console.log("");
    console.log(`  ⚠ Đã đẩy lên GitHub xong, nhưng sau ${Math.round(kq.giay / 60)} phút`);
    console.log("     web thật vẫn chưa đổi. Code đã an toàn trên GitHub, không mất đi");
    console.log("     đâu — nhưng khách vẫn đang thấy bản cũ.");
    console.log("     Vào hPanel > Triển khai xem lần deploy gần nhất có lỗi không.");
  }
} else {
  console.log("  → Hostinger tự deploy trong ít phút. Theo dõi ở hPanel > Triển khai.");
}
console.log("");
