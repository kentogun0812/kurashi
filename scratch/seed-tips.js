const { Client } = require('pg');

const tips = [
  {
    title: 'Cách tiết kiệm điện vào mùa đông ở Nhật Bản',
    title_en: 'How to save electricity during winter in Japan',
    title_jp: '日本の冬の電気代節約術',
    slug: 'cach-tiet-kiem-dien-mua-dong-nhat-ban',
    category: 'daily_life',
    summary: 'Mùa đông ở Nhật rất lạnh, dẫn đến hóa đơn tiền điện tăng cao do sử dụng điều hòa, lò sưởi. Dưới đây là những mẹo hữu ích giúp bạn giữ ấm mà vẫn tiết kiệm điện hiệu quả.',
    summary_en: 'Winter in Japan is cold, leading to high electricity bills. Here are useful tips to stay warm while effectively saving electricity.',
    summary_jp: '日本の冬は寒く、暖房の使用により電気代が高騰します。暖かく保ちながら効果的に電気を節約するヒントを紹介します。',
    content_md: `Mùa đông ở Nhật Bản thường rất lạnh, đặc biệt là ở các khu vực phía Bắc như Hokkaido hay Tohoku. Việc sử dụng điều hòa không khí (エアコン), quạt sưởi, chăn điện liên tục có thể khiến hóa đơn tiền điện của bạn tăng vọt (có thể lên tới 1-2 man/tháng). 

Dưới đây là một số mẹo giúp bạn sống sót qua mùa đông ở Nhật mà không "cháy túi":

### 1. Sử dụng điều hòa đúng cách
- **Cài đặt nhiệt độ hợp lý:** Nhiệt độ lý tưởng và tiết kiệm nhất cho điều hòa mùa đông là **20°C - 22°C**. Mỗi khi bạn tăng thêm 1 độ, lượng điện tiêu thụ sẽ tăng khoảng 10%.
- **Hướng gió xuống dưới:** Khí nóng thường nhẹ hơn và bay lên trên. Hãy điều chỉnh cánh quạt điều hòa chúc xuống dưới sàn nhà để hơi ấm lan tỏa từ dưới lên, giúp phòng ấm nhanh hơn.
- **Không tắt bật liên tục:** Khởi động điều hòa tốn rất nhiều điện năng. Nếu bạn chỉ ra ngoài dưới 30 phút, hãy để điều hòa chạy ở mức thấp (hoặc chế độ tự động) thay vì tắt đi rồi bật lại.

### 2. Tận dụng đồ giữ ấm cá nhân
- **Chăn điện (電気毛布 - Denki moufu):** Chăn điện tiêu thụ năng lượng cực thấp (chỉ bằng khoảng 1/10 điều hòa). Trải chăn điện dưới ga giường và bật trước khi ngủ 15 phút, bạn sẽ có một giấc ngủ ấm áp.
- **Quần áo giữ nhiệt (Heatech):** Sử dụng các loại quần áo giữ nhiệt của Uniqlo hoặc các hãng tương tự. Mặc nhiều lớp áo mỏng sẽ giữ ấm tốt hơn một lớp áo dày.
- **Túi chườm nóng (湯たんぽ - Yutanpo):** Một giải pháp "cổ điển" nhưng vô cùng hiệu quả. Chỉ cần đổ nước nóng vào túi, bạn có thể giữ ấm trong chăn suốt cả đêm mà không tốn 1 yên tiền điện.

### 3. Ngăn chặn khí lạnh từ bên ngoài
- **Sử dụng miếng dán cửa kính:** Khí lạnh thường xâm nhập qua cửa sổ, và khí nóng cũng thoát ra từ đây. Hãy mua các miếng dán cách nhiệt (có hình xốp nổ) tại cửa hàng 100 yên (Daiso, Seria) và dán lên cửa kính.
- **Băng keo chặn khe cửa (隙間テープ):** Dán vào các khe hở ở cửa ra vào hoặc cửa sổ để ngăn gió lùa.
- **Sử dụng rèm cửa dày:** Treo rèm cửa loại dày và kéo kín vào ban đêm.

### 4. Vệ sinh thiết bị thường xuyên
Đừng quên tháo lưới lọc của điều hòa ra rửa sạch (ít nhất 2 tuần 1 lần). Lưới lọc bám bụi sẽ làm giảm hiệu suất sưởi ấm và ngốn nhiều điện hơn.

Áp dụng những mẹo nhỏ này, bạn có thể tiết kiệm đáng kể chi phí sinh hoạt trong mùa đông khắc nghiệt tại Nhật Bản!`,
    content_md_en: 'Winter in Japan is cold, leading to high electricity bills. Here are useful tips to stay warm while effectively saving electricity.',
    content_md_jp: '日本の冬は寒く、暖房の使用により電気代が高騰します。暖かく保ちながら効果的に電気を節約するヒントを紹介します。',
    thumbnail_url: 'https://images.unsplash.com/photo-1542451313056-b7c8e6266459?q=80&w=800&auto=format&fit=crop',
    tags: ['tiết kiệm', 'mùa đông', 'điện', 'sinh hoạt'],
  },
  {
    title: 'Cách phân loại và vứt rác chuẩn Nhật Bản',
    title_en: 'How to sort and dispose of garbage correctly in Japan',
    title_jp: '日本での正しいゴミの分別と出し方',
    slug: 'cach-phan-loai-va-vut-rac-chuan-nhat-ban',
    category: 'daily_life',
    summary: 'Phân loại rác ở Nhật Bản rất nghiêm ngặt và phức tạp. Việc vứt rác sai quy định có thể khiến bạn bị phạt hoặc gặp rắc rối với hàng xóm. Hãy cùng tìm hiểu các quy tắc cơ bản.',
    summary_en: 'Garbage sorting in Japan is very strict. Disposing of garbage incorrectly can lead to fines or trouble with neighbors. Let\'s learn the basic rules.',
    summary_jp: '日本のゴミ分別は非常に厳格です。間違ったゴミ捨ては罰金や近所トラブルの原因になります。基本的なルールを学びましょう。',
    content_md: `Tại Nhật Bản, việc phân loại rác không chỉ là ý thức mà còn là **quy định bắt buộc**. Mỗi thành phố/khu vực (Shi/Ku) sẽ có quy định và lịch thu gom rác khác nhau. Nếu bạn vứt rác sai, xe rác sẽ dán tem cảnh cáo và từ chối thu gom, gây phiền toái cho bản thân và hàng xóm.

Dưới đây là các loại rác cơ bản và cách phân loại chung nhất:

### 1. Rác cháy được (燃えるゴミ - Moeru Gomi)
- **Bao gồm:** Rác thải nhà bếp (thức ăn thừa), giấy vụn, đồ gỗ nhỏ, quần áo cũ, rãnh nhựa không tái chế được.
- **Cách xử lý:** 
  - Thức ăn thừa cần vắt kiệt nước trước khi vứt.
  - Phải sử dụng túi rác được chỉ định của khu vực (thường có màu vàng hoặc trong suốt, bán ở siêu thị/combini).
- **Ngày thu gom:** Thường là 2 ngày/tuần.

### 2. Rác không cháy được (燃えないゴミ - Moenai Gomi)
- **Bao gồm:** Thủy tinh, gốm sứ (bát vỡ), đồ kim loại nhỏ (nồi, chảo), ô che mưa, các loại nhựa cứng, bóng đèn.
- **Cách xử lý:**
  - Đối với đồ thủy tinh hoặc dao nhọn, cần bọc trong giấy báo và ghi chú "Kiken" (Nguy hiểm - 危険) ở bên ngoài.
  - Sử dụng túi rác chuyên dụng cho rác không cháy.
- **Ngày thu gom:** Thường là 1 - 2 lần/tháng.

### 3. Rác tái chế (資源ゴミ - Shigen Gomi)
Đây là loại rác cần phân loại kỹ nhất, bao gồm:
- **Chai nhựa (PET bottle - ペットボトル):** Cần tháo nhãn ni-lông và nắp chai (nắp và nhãn thường vứt vào rác nhựa), sau đó rửa sạch bên trong, đạp bẹp.
- **Lon (Can - 缶) và Chai thủy tinh (Bin - 瓶):** Rửa sạch bên trong.
- **Giấy, bìa carton:** Xếp gọn gàng và dùng dây dù buộc lại thành hình chữ thập.
- **Khay xốp (thịt/cá):** Rửa sạch, phơi khô. (Nhiều siêu thị có thùng thu gom khay xốp miễn phí).

### 4. Rác quá khổ (粗大ゴミ - Sodai Gomi)
- **Bao gồm:** Đồ nội thất (bàn, ghế, giường), đồ gia dụng lớn (lò vi sóng, máy hút bụi), xe đạp.
- **Đặc biệt lưu ý:** Bốn loại thiết bị gồm TV, Tủ lạnh, Máy giặt, Điều hòa KHÔNG ĐƯỢC vứt như rác quá khổ mà phải gọi công ty tái chế và trả phí tái chế khá cao.
- **Cách xử lý:** Bạn phải gọi điện hoặc đăng ký qua website của tòa thị chính để hẹn lịch. Sau đó ra combini mua tem rác (Sodai gomi shori-ken - 粗大ごみ処理券) dán lên đồ vật và mang ra nơi quy định đúng ngày giờ hẹn.

### Lời khuyên
- Khi mới chuyển đến, hãy lên tòa thị chính (Kuyakusho/Shiyakusho) xin cuốn **Sổ tay hướng dẫn vứt rác** và tờ lịch thu gom rác của khu vực bạn sống.
- Dán tờ lịch thu gom rác lên tủ lạnh để không bị quên.
- Chú ý giờ vứt rác: Thường phải vứt **trước 8h sáng** của ngày thu gom. Tuyệt đối không vứt rác vào đêm hôm trước để tránh quạ bới rác.`,
    content_md_en: 'Garbage sorting in Japan is very strict. Disposing of garbage incorrectly can lead to fines or trouble with neighbors. Let\'s learn the basic rules.',
    content_md_jp: '日本のゴミ分別は非常に厳格です。間違ったゴミ捨ては罰金や近所トラブルの原因になります。基本的なルールを学びましょう。',
    thumbnail_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop',
    tags: ['rác', 'phân loại', 'sinh hoạt', 'quy tắc'],
  },
  {
    title: 'Top 5 ứng dụng điện thoại không thể thiếu tại Nhật',
    title_en: 'Top 5 Must-Have Smartphone Apps in Japan',
    title_jp: '日本で必須のスマートフォントップ5アプリ',
    slug: 'top-5-ung-dung-dien-thoai-khong-the-thieu-tai-nhat',
    category: 'daily_life',
    summary: 'Việc sinh sống tại Nhật sẽ trở nên vô cùng dễ dàng và tiện lợi nếu bạn biết tận dụng sức mạnh của smartphone. Dưới đây là 5 ứng dụng nhất định phải cài.',
    summary_en: 'Living in Japan becomes much easier if you know how to leverage smartphone apps. Here are 5 must-install apps.',
    summary_jp: 'スマートフォンアプリを活用すれば、日本での生活は格段に便利になります。必須の5つのアプリをご紹介します。',
    content_md: `Khi mới đặt chân đến Nhật Bản, ngoài việc làm quen với ngôn ngữ và văn hóa, việc trang bị cho chiếc smartphone của mình những ứng dụng (app) hữu ích là điều cực kỳ quan trọng. Dưới đây là 5 ứng dụng "cứu cánh" mà bất kỳ người Việt nào ở Nhật cũng nên có.

### 1. Navitime hoặc Google Maps (Bản đồ & Tra tàu)
Mạng lưới giao thông công cộng ở Nhật Bản cực kỳ chằng chịt và phức tạp.
- **Google Maps:** Rất tốt cho việc tìm đường đi bộ, tìm quán ăn, siêu thị.
- **Navitime / Yahoo Transit (Yahoo 乗換案内):** Đây là các app chuyên dụng để tra cứu giờ tàu chạy, số bến (platform), giá vé và cách chuyển tàu chi tiết đến từng phút. Ưu điểm là chính xác tuyệt đối theo lịch trình của hệ thống đường sắt Nhật.

### 2. Line (Ứng dụng nhắn tin quốc dân)
Tại Nhật Bản, Line phổ biến như Zalo ở Việt Nam. Hầu hết mọi người, từ bạn bè, đồng nghiệp đến công ty, trường học đều dùng Line để liên lạc. Bạn cũng có thể dùng Line Pay để thanh toán tại combini rất tiện lợi.

### 3. PayPay (Thanh toán điện tử)
Nhật Bản đang chuyển mình mạnh mẽ sang xã hội không tiền mặt. Trong đó, **PayPay** là ứng dụng thanh toán qua QR code phổ biến nhất hiện nay.
- Được chấp nhận ở hầu hết các siêu thị, combini, quán ăn và cả các cửa hàng nhỏ lẻ.
- Thường xuyên có các chiến dịch hoàn tiền (Cashback) 10-20% vô cùng hấp dẫn.

### 4. Yucho Direct / App ngân hàng
Nếu bạn sử dụng ngân hàng bưu điện Yucho (phổ biến nhất cho người nước ngoài), hãy tải ứng dụng **Yucho Bank** để kiểm tra số dư, theo dõi lịch sử giao dịch và chuyển tiền ngay trên điện thoại mà không cần ra cây ATM.

### 5. Mercari (Chợ đồ cũ online)
Đồ ở Nhật rất tốt và bền. Thay vì mua đồ mới với giá cao, bạn có thể mua đồ cũ (tủ lạnh, máy giặt, quần áo, sách...) trên **Mercari** với giá cực rẻ. Ngược lại, khi chuyển nhà hoặc về nước, bạn cũng có thể dễ dàng thanh lý đồ đạc của mình trên ứng dụng này để tiết kiệm chi phí bỏ rác.

*(Bên cạnh Mercari, bạn cũng có thể sử dụng chính tính năng **Chợ Đồ Cũ** trên nền tảng **Kurashi** của chúng tôi để giao dịch trực tiếp với cộng đồng người Việt một cách dễ dàng và tin cậy hơn!)*`,
    content_md_en: 'Living in Japan becomes much easier if you know how to leverage smartphone apps. Here are 5 must-install apps.',
    content_md_jp: 'スマートフォンアプリを活用すれば、日本での生活は格段に便利になります。必須の5つのアプリをご紹介します。',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop',
    tags: ['ứng dụng', 'tiện ích', 'sinh hoạt', 'app'],
  }
];

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres.lfyizvwmssgdeshvklzp:ajKVZSwfNBglmLO4@aws-1-ap-northeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
  });

  await client.connect();
  
  try {
    for (const tip of tips) {
      const query = `
        INSERT INTO public.life_tips 
        (title, title_en, title_jp, slug, category, summary, summary_en, summary_jp, content_md, content_md_en, content_md_jp, thumbnail_url, tags)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        ON CONFLICT (slug) DO UPDATE SET
          title = EXCLUDED.title,
          summary = EXCLUDED.summary,
          content_md = EXCLUDED.content_md,
          thumbnail_url = EXCLUDED.thumbnail_url;
      `;
      const values = [
        tip.title, tip.title_en, tip.title_jp, tip.slug, tip.category, tip.summary, tip.summary_en, tip.summary_jp, 
        tip.content_md, tip.content_md_en, tip.content_md_jp, tip.thumbnail_url, tip.tags
      ];
      await client.query(query, values);
    }
    console.log("Life tips seeded successfully!");
  } catch (e) {
    console.error("Error seeding life tips:", e);
  } finally {
    await client.end();
  }
}

run();
