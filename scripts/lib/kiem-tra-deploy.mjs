/**
 * Hỏi GitHub xem lần deploy gần nhất có thành công không.
 *
 * VÌ SAO CẦN: đẩy code lên GitHub xong KHÔNG có nghĩa là web đã cập nhật.
 * Còn một chặng nữa — GitHub Actions build rồi đẩy qua FTP lên Hostinger.
 * Chặng đó hỏng thì mọi thứ vẫn "thành công" ở phía máy này: git push xanh,
 * bảng hàng đã đồng bộ, ảnh đã nén — mà web thì đứng yên.
 *
 * Đã xảy ra thật: deploy hỏng liên tục hơn một ngày, chủ shop thêm hàng vào
 * Sheet mãi không thấy lên web, và không đâu báo cho biết cả.
 *
 * Dùng API công khai, không cần token. Hỏng thì im lặng bỏ qua — việc này chỉ
 * để báo tin, không được phép làm hỏng lệnh push.
 */

const WORKFLOW = "deploy-hostinger.yml";

/** Đọc owner/repo từ remote origin */
function docRepo(remoteUrl) {
  const m = remoteUrl.match(/github\.com[/:]([^/]+)\/(.+?)(?:\.git)?\s*$/i);
  return m ? `${m[1]}/${m[2]}` : null;
}

/**
 * @returns {Promise<null | {ok: boolean, ketLuan: string, luc: string, url: string}>}
 *          null nghĩa là không hỏi được (mất mạng, đổi repo…) — không phải lỗi.
 */
export async function kiemTraDeploy(remoteUrl, { doiToiDaMs = 8000 } = {}) {
  const repo = docRepo(remoteUrl ?? "");
  if (!repo) return null;

  try {
    const res = await fetch(
      `https://api.github.com/repos/${repo}/actions/workflows/${WORKFLOW}/runs?per_page=1`,
      {
        headers: { Accept: "application/vnd.github+json" },
        signal: AbortSignal.timeout(doiToiDaMs),
      },
    );
    if (!res.ok) return null;

    const data = await res.json();
    const run = data.workflow_runs?.[0];
    if (!run) return null;

    return {
      ok: run.conclusion === "success",
      ketLuan: run.conclusion ?? run.status,
      luc: new Date(run.created_at).toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
      }),
      url: run.html_url,
    };
  } catch {
    return null; // mạng chậm hoặc GitHub chặn — không phải việc của lệnh push
  }
}
