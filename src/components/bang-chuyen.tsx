import { SparkIcon } from "@/components/icons";

/**
 * Băng chuyền chạy ngang — dải chữ trôi liên tục như bảng đèn trước cửa tiệm.
 *
 * Nội dung lặp HAI lần và dịch đúng 50%, nhờ vậy khi hết vòng thì bản sao thứ
 * hai đã nằm sẵn đúng vị trí bản đầu — mắt không thấy điểm nối.
 *
 * Thuần trang trí: bản gốc mang chữ thật cho trình đọc màn hình, bản sao
 * aria-hidden để không bị đọc hai lần.
 */
export function BangChuyen({ muc }: { muc: string[] }) {
  const mot = (an: boolean) => (
    <ul
      aria-hidden={an || undefined}
      className="bang-chuyen flex shrink-0 items-center gap-8 pr-8"
    >
      {muc.map((m, i) => (
        <li key={i} className="flex shrink-0 items-center gap-8">
          <span className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.18em]">
            {m}
          </span>
          <SparkIcon width={14} height={14} className="shrink-0 opacity-60" />
        </li>
      ))}
    </ul>
  );

  return (
    <div className="flex overflow-hidden border-y border-border bg-dai-dam-nen py-3 text-dai-dam-chu">
      {mot(false)}
      {mot(true)}
    </div>
  );
}
