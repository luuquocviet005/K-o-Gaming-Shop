# Kiến thức dự án — "bộ não thứ hai" của AI

Mỗi file là MỘT phần của shop, ghi điều CÒN ĐÚNG: nó chạy thế nào, bẫy nào đã
gặp, việc gì còn dở. Không phải nhật ký — nhật ký nằm ở `docs/ban-giao/`.

| Ghi chú | Phần | Code liên quan |
| :-- | :-- | :-- |
| [chatbot.md](chatbot.md) | Khung chat AI + backend ai-marketing-town | `src/components/ai-chatbox/` |
| [nap-anh.md](nap-anh.md) | Lượt nạp ảnh tự động 15 phút trên máy shop | `scripts/nap-anh.mjs`, `tu-dong.mjs`, `push.mjs`, `thu-cong.mjs`, `scripts/lib/` |
| [bang-hang-sheet.md](bang-hang-sheet.md) | Google Sheet → `src/data/*.json` | `scripts/sync-sheet.mjs`, `sync.config.json`, `dong-bo-sheet.yml` |
| [deploy-va-kiem-tra.md](deploy-va-kiem-tra.md) | Hostinger, CI, lint, bộ kiểm tra | `.github/workflows/`, `eslint/`, `next.config.ts`, các script kiểm tra |
| [giao-dien.md](giao-dien.md) | Các trang web, nút nổi, thông tin shop | `src/app/`, `src/components/`, `src/lib/` |
| [moi-truong-ai.md](moi-truong-ai.md) | Claude trên cloud, Antigravity trên máy shop | `.claude/`, `.agents/` |
| [chu-shop-da-chot.md](chu-shop-da-chot.md) | Quyết định của chủ shop — đừng đề xuất ngược lại | — |

## Luật

- Sửa phần nào thì ĐỌC ghi chú phần đó trước khi sửa.
- Xong việc thì SỬA ghi chú đó cho đúng với code mới: thêm bẫy vừa gặp, xoá
  điều đã hết đúng, cập nhật "còn dở". Viết lại chứ đừng nối thêm nhật ký.
- Ghi chú ngắn. Quá ~120 dòng thì tách thành ghi chú con và link từ đây.
- Workflow "Kiểm tra PR" chặn PR sửa code của một phần mà không sửa ghi chú
  của phần đó (`scripts/kiem-tra-ghi-chu.mjs`). Sửa vặt không có gì đáng ghi
  thì thêm dòng `[bo-qua-ghi-chu]` (đứng riêng một dòng) vào lời nhắn commit.
