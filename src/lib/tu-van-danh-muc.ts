/**
 * Chữ riêng của từng trang danh mục: meta description và khối tư vấn dưới lưới
 * sản phẩm. Đặt trong code vì Sheet không có chỗ cho đoạn văn dài. Chỉ ghi điều
 * chủ shop đã chốt (xem docs/kien-thuc/chu-shop-da-chot.md), không ghi thông số.
 */
export type TuVanDanhMuc = { meta: string; tieuDe: string; doan: string[] };

export const TU_VAN_DANH_MUC: Record<string, TuVanDanhMuc> = {
  "chuot": {
    "meta": "Chuột gaming cũ và mới ở Đà Nẵng. Mô tả đúng tình trạng, cho test trực tiếp, ship COD toàn quốc, bảo hành 1 tháng. Xem giá và ảnh thật.",
    "tieuDe": "Chọn chuột gaming cũ sao cho yên tâm\nChuột là món bạn cầm cả ngày, nên hợp tay quan trọng không kém thông số. Trước khi chọn, hãy nghĩ tới ba điều: bạn cầm chuột kiểu nào (úp cả bàn tay, cầm bằng đầu ngón hay cầm kẹp), tay lớn hay nhỏ, và chơi thể loại game nào. Chuột nhẹ, nhỏ thường hợp game bắn súng cần xoay nhanh. Chuột to hơn thường dễ chịu khi chơi lâu.",
    "doan": [
      "Với hàng cũ, tụi mình ghi thẳng tình trạng từng con: vỏ trầy ở đâu, nút bấm và con lăn ra sao, có đủ hộp hay phụ kiện không. Ảnh trên trang là ảnh thật của đúng con chuột bạn sẽ nhận, không phải ảnh hãng.",
      "Ở Đà Nẵng, bạn qua shop cầm thử và test click, cuộn, di chuột rồi mới trả tiền. Ở tỉnh khác, tụi mình ship COD toàn quốc và quay video đúng con chuột sẽ gửi trước khi đóng gói.",
      "Mọi món bảo hành 1 tháng. Lỗi không do va đập hay tự sửa thì tụi mình sửa, đổi món tương đương hoặc hoàn đủ tiền, shop chịu phí ship bảo hành hai chiều."
    ]
  },
  "ban-phim": {
    "meta": "Bàn phím cơ, bàn phím HE, kit và case rời ở Đà Nẵng. Hàng cũ và mới, test trực tiếp, ship COD toàn quốc, bảo hành 1 tháng.",
    "tieuDe": "Bàn phím cơ, bàn phím HE, kit và case rời\nDanh mục này có nhiều kiểu khác nhau, nên đọc kỹ loại trước khi chọn. Bàn phím nguyên bộ dùng được ngay. Kit và case rời dành cho bạn thích tự lắp, thường phải mua thêm phần còn lại. Mỗi trang sản phẩm ghi rõ loại hàng, tình trạng và những gì đi kèm để bạn không phải đoán.",
    "doan": [
      "Khi chọn bàn phím, hãy nghĩ tới nơi bạn dùng và thói quen gõ. Dùng chung phòng hay ở văn phòng thì tiếng gõ êm quan trọng. Chơi game nhiều thì cảm giác phím và kích thước bàn phím ảnh hưởng tới chỗ để chuột. Hàng cũ thì nên xem kỹ keycap, độ đều của các phím và phần đèn nếu có.",
      "Ở Đà Nẵng, bạn qua shop gõ thử trước khi mua. Ở tỉnh khác, tụi mình ship COD toàn quốc, quay video đúng bàn phím sẽ gửi, gõ cho nghe và cho xem từng phím.",
      "Mọi món bảo hành 1 tháng. Đơn chuyển khoản đủ từ 1 triệu được freeship. Đơn COD tính phí ship theo thực tế và cọc 50.000₫."
    ]
  },
  "tai-nghe": {
    "meta": "Tai nghe chụp tai, in-ear và soundcard cũ và mới ở Đà Nẵng. Cho nghe thử trực tiếp, ship COD toàn quốc, bảo hành 1 tháng.",
    "tieuDe": "Tai nghe nên nghe thử rồi hãy chọn\nMỗi người có đôi tai và kiểu đầu khác nhau, nên một chiếc tai nghe hợp với người này chưa chắc hợp với người khác. Tai nghe chụp tai thường thoải mái khi đeo lâu và hợp chơi game ở nhà. In-ear gọn nhẹ, tiện mang đi. Soundcard dành cho bạn muốn cải thiện âm thanh khi cắm vào máy tính.",
    "doan": [
      "Khi chọn tai nghe cũ, những chỗ nên xem kỹ là đệm tai, khung đeo, dây và jack cắm. Đây là các phần hao mòn nhiều nhất, nên tụi mình ghi rõ tình trạng từng phần trên trang sản phẩm. Ảnh là ảnh thật của đúng món bạn sẽ nhận.",
      "Ở Đà Nẵng, bạn qua shop đeo và nghe trực tiếp, kiểm tra loa trái phải, mic và độ vừa tai trước khi trả tiền. Ở tỉnh khác, tụi mình ship COD toàn quốc kèm video quay đúng món sẽ gửi.",
      "Mọi món bảo hành 1 tháng. Tụi mình không nhận lỗi do va đập, vào nước, tự sửa hay hao mòn thông thường đã ghi lúc bán."
    ]
  },
  "pad-chuot": {
    "meta": "Pad chuột vải, pad cỡ lớn cho game, hàng mới và cũ ở Đà Nẵng. Ảnh thật, ship COD toàn quốc, bảo hành 1 tháng.",
    "tieuDe": "Chọn pad chuột hợp bàn và hợp cách chơi\nPad chuột là món dễ chọn nhầm nhất khi mua online, vì kích thước khó hình dung qua ảnh. Trước khi mua, hãy đo chỗ để pad trên bàn và nghĩ xem bạn rê chuột rộng hay hẹp. Pad cỡ lớn cho thoải mái cả chuột lẫn bàn phím. Pad nhỏ hơn gọn trên bàn chật.",
    "doan": [
      "Bề mặt cũng quan trọng. Pad vải thường cho cảm giác rê đều và dễ kiểm soát. Mỗi tấm có độ trơn khác nhau, nên cảm giác khi chơi mỗi người một kiểu. Với pad cũ, hãy xem kỹ bề mặt có sờn, bẩn hay cong mép không. Tụi mình ghi rõ những điều đó trên từng trang.",
      "Ở Đà Nẵng, bạn qua shop rê chuột thử trên chính tấm pad. Ở tỉnh khác, tụi mình ship COD toàn quốc và quay video đúng tấm sẽ gửi.",
      "Pad mới hay cũ đều ghi rõ trên trang. Mọi món bảo hành 1 tháng cho các lỗi không phải hao mòn hay lỗi đã ghi lúc bán."
    ]
  },
  "phu-kien": {
    "meta": "Phụ kiện gaming gear ở Đà Nẵng: keycap, bungee, đế sạc, tai nghe không dây và đồ lẻ. Ảnh thật, ship COD toàn quốc, bảo hành 1 tháng.",
    "tieuDe": "Món lẻ đi kèm bộ gear của bạn\nĐây là chỗ tụi mình để những món nhỏ đi kèm bộ gear: keycap, bungee giữ dây chuột, đế sạc, tai nghe không dây và vài món khác. Mỗi món thường chỉ có một hoặc vài cái, nên hết là hết. Muốn món nào thì bạn nên chốt sớm.",
    "doan": [
      "Phụ kiện dễ mua nhầm vì phải hợp với món bạn đang có. Keycap cần hợp loại bàn phím. Đế sạc và tai nghe không dây cần hợp thiết bị của bạn. Trước khi mua, hãy đọc kỹ phần mô tả trang sản phẩm. Chưa chắc thì nhắn tụi mình, tụi mình nói thẳng món nào hợp, món nào không.",
      "Ở Đà Nẵng, bạn qua shop xem và thử trực tiếp. Ở tỉnh khác, tụi mình ship COD toàn quốc và quay video đúng món sẽ gửi.",
      "Mọi món bảo hành 1 tháng. Nếu bạn đang mua cùng chuột hoặc bàn phím, hỏi tụi mình để gộp đơn cho gọn."
    ]
  }
};
