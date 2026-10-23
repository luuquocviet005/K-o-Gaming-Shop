/**
 * Biến link trong câu trả lời của bot thành link bấm được. Bot gửi link
 * Zalo / Messenger cho khách hỏi tình trạng — để dạng chữ thì
 * khách trên điện thoại phải tự chép, nhiều người bỏ luôn.
 * Chỉ nhận http(s) và cắt dấu câu dính ở cuối link.
 */
export function coLink(text: string) {
  return text.split(/(https?:\/\/[^\s]+[^\s.,!?;:)])/g).map((doan, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={doan}
        target="_blank"
        rel="noopener noreferrer"
        className="break-all font-semibold underline underline-offset-2"
      >
        {doan}
      </a>
    ) : (
      doan
    ),
  );
}
