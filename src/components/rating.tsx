import { StarIcon } from "@/components/icons";

/**
 * Sao đánh giá. Ngôi sao là hình ảnh trang trí — điểm số được nêu bằng CHỮ
 * ngay cạnh, nên người dùng trình đọc màn hình vẫn nắm được thông tin
 * (không dựa vào hình ảnh hay màu sắc để truyền đạt ý nghĩa).
 */
export function Rating({
  value,
  reviews,
  size = "sm",
  showStars = true,
}: {
  value: number;
  reviews?: number;
  size?: "sm" | "md";
  showStars?: boolean;
}) {
  const dim = size === "md" ? 16 : 13;

  return (
    <span className="inline-flex items-center gap-1.5">
      {showStars ? (
        <span className="inline-flex items-center gap-px text-star" aria-hidden="true">
          {[1, 2, 3, 4, 5].map((i) => (
            <StarIcon key={i} width={dim} height={dim} filled={i <= Math.round(value)} />
          ))}
        </span>
      ) : (
        <StarIcon
          width={dim}
          height={dim}
          filled
          className="text-star"
          aria-hidden="true"
        />
      )}
      <span
        className={`font-semibold text-fg ${size === "md" ? "text-sm" : "text-xs"}`}
      >
        {value.toFixed(1)}
      </span>
      {reviews !== undefined && (
        <span className={`text-fg-muted ${size === "md" ? "text-sm" : "text-xs"}`}>
          ({reviews} đánh giá)
        </span>
      )}
    </span>
  );
}
