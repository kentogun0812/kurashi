import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const content_md = `# Hướng dẫn đăng ký mở tài khoản ngân hàng bưu điện Yucho (Bản cập nhật)

Ngân hàng Bưu điện Nhật Bản (Yucho Bank / ゆうちょ銀行) là một trong những ngân hàng phổ biến nhất với mạng lưới chi nhánh và máy rút tiền (ATM) phủ sóng khắp toàn quốc. Ưu điểm lớn nhất của Yucho là yêu cầu mở tài khoản tương đối dễ dàng, đặc biệt phù hợp với người nước ngoài mới sang Nhật Bản (du học sinh, thực tập sinh, kỹ sư) chưa có nhiều thời gian lưu trú hay vốn tiếng Nhật chưa tốt.

Bạn có thể đăng ký mở tài khoản nhanh chóng ngay tại nhà thông qua ứng dụng điện thoại hoặc trực tiếp tại quầy bưu điện gần nhất.

---

## 1. Chuẩn bị giấy tờ cần thiết

Trước khi thực hiện đăng ký, bạn cần chuẩn bị đầy đủ các giấy tờ và thông tin sau:
1. **Thẻ ngoại kiều (Zairyu Card)**: Bản gốc, còn hạn sử dụng và đã được in địa chỉ cư trú hiện tại ở mặt sau (đã làm thủ tục đăng ký địa chỉ tại Shyakusho).
2. **Hộ chiếu (Passport)**: Bản gốc, còn hạn sử dụng.
3. **Giấy tờ xác minh bổ sung (nếu cần)**: Thẻ Mã số cá nhân (My Number Card) hoặc thẻ Bảo hiểm y tế quốc dân.
4. **Điện thoại thông minh**: Đã kết nối mạng và có thể tải/cài đặt ứng dụng (nếu đăng ký online). Kèm theo một số điện thoại có thể liên lạc tại Nhật Bản.
5. **Con dấu cá nhân (Hanko)**: Nếu bạn làm thủ tục trực tiếp tại quầy (một số chi nhánh hiện tại chấp nhận chữ ký, nhưng mang theo Hanko là an toàn nhất).

---

## 2. Hai cách đăng ký phổ biến

### Cách A: Đăng ký trực tuyến bằng ứng dụng di động (Khuyên dùng)
Đây là cách tiết kiệm thời gian nhất, không yêu cầu vốn tiếng Nhật giao tiếp.
1. **Tải ứng dụng**: Tìm và tải ứng dụng **ゆうちょ手続アプリ (Yucho Tetsuzuki App)** trên App Store (iOS) hoặc Google Play (Android).
2. **Xác minh danh tính**: Mở ứng dụng, làm theo hướng dẫn để quét chip IC và chụp ảnh Thẻ ngoại kiều hoặc Thẻ My Number. 
3. **Điền thông tin**: Nhập đầy đủ thông tin cá nhân (Họ tên bằng tiếng Anh và Katakana, địa chỉ, số điện thoại, mục đích mở tài khoản).
4. **Chờ nhận kết quả**: Ngân hàng sẽ tiến hành xét duyệt hồ sơ. Nếu thành công, thẻ rút tiền (Cash card) và sổ tài khoản (Tsuucho) sẽ được gửi bảo đảm về địa chỉ nhà bạn qua đường bưu điện trong khoảng 1 đến 2 tuần.

### Cách B: Đăng ký trực tiếp tại quầy bưu điện
Cách này phù hợp nếu bạn không thạo thao tác trên điện thoại hoặc cần thẻ/sổ ngay lập tức.
1. **Tìm bưu điện gần nhất**: Đến bưu điện (Yubinkyoku) gần nơi bạn cư trú hoặc làm việc nhất (bưu điện thường có logo chữ T gạch ngang 〒 màu đỏ).
2. **Lấy số và trao đổi**: Lấy số thứ tự tại máy tự động. Đến quầy giao dịch ngân hàng (thường có màu xanh lá) và nói: "Kouza wo tsukuritai desu" (Tôi muốn mở tài khoản).
3. **Điền đơn đăng ký**: Điền thông tin vào Mẫu đơn đăng ký mở tài khoản (Kouza Kaisetsu Shinseisho). Bạn nên chuẩn bị sẵn cách viết tên mình bằng Katakana, số điện thoại và địa chỉ nhà chính xác.
4. **Hoàn tất thủ tục**: Nộp lại hồ sơ kèm giấy tờ tuỳ thân. Nhân viên sẽ tiến hành xử lý. Bạn có thể nhận ngay Sổ tài khoản tại quầy, còn Thẻ ATM vật lý sẽ được gửi về nhà sau 1-2 tuần.

---

## 3. Lưu ý quan trọng dành cho người nước ngoài
- **Điều kiện cư trú**: Đối với người nước ngoài mang tư cách lưu trú trung và dài hạn, bạn cần có thời gian lưu trú tại Nhật Bản **từ đủ 3 tháng trở lên** để đủ điều kiện mở tài khoản thông thường. Nếu bạn vừa sang Nhật dưới 3 tháng, tài khoản mở ra có thể bị hạn chế một số chức năng (như không thể nhận lương chuyển khoản hoặc gửi tiền quốc tế) cho đến khi đủ mốc thời gian quy định.
- **Tính thống nhất của thông tin**: Tên trên đăng ký tài khoản bắt buộc phải khớp hoàn toàn với tên in trên Hộ chiếu và Thẻ ngoại kiều (viết hoa không dấu).
- **Tránh việc mua bán tài khoản**: Tuyệt đối không giao sổ, thẻ, hay mã PIN của bạn cho người khác. Hành vi mua bán, cho mượn tài khoản ngân hàng là vi phạm pháp luật Nhật Bản nghiêm trọng.`;

const content_md_en = `# Guide to Opening a Yucho Bank (Japan Post Bank) Account

Japan Post Bank (Yucho Bank / ゆうちょ銀行) is one of the most accessible and widespread banks in Japan, with branches and ATMs available nationwide. Its biggest advantage is the relatively easy account opening process, making it highly suitable for foreigners new to Japan (students, technical interns, engineers) who may not have a long residency history or advanced Japanese skills.

You can easily apply for an account from home using a mobile app or in person at the nearest post office.

---

## 1. Required Documents

Before applying, please prepare the following documents and information:
1. **Residence Card (Zairyu Card)**: Original, valid, and updated with your current address on the back (after registering your address at the local ward/city office).
2. **Passport**: Original and valid.
3. **Additional ID (if required)**: My Number Card or National Health Insurance Card.
4. **Smartphone**: With internet access, capable of downloading apps (if applying online). A valid Japanese phone number is also required.
5. **Personal Seal (Hanko)**: Required if applying in person at the counter (some branches may accept a signature, but bringing a Hanko is safest).

---

## 2. Two Common Application Methods

### Method A: Online Application via Mobile App (Recommended)
This is the most time-saving method and requires minimal conversational Japanese.
1. **Download the App**: Search for and download the **ゆうちょ手続アプリ (Yucho Tetsuzuki App)** from the App Store (iOS) or Google Play (Android).
2. **Identity Verification**: Open the app and follow the prompts to scan the IC chip and take photos of your Residence Card or My Number Card.
3. **Enter Information**: Fill in your personal details (Name in English and Katakana, address, phone number, and purpose for opening the account).
4. **Wait for Delivery**: The bank will review your application. If successful, your cash card and bankbook (Tsuucho) will be sent to your registered address via registered mail within 1 to 2 weeks.

### Method B: In-Person Application at the Post Office
This method is suitable if you prefer face-to-face support or need your bankbook immediately.
1. **Find a Post Office**: Go to the nearest post office (Yubinkyoku) to your home or workplace (look for the red 〒 logo).
2. **Take a Ticket**: Take a waiting ticket. Once at the financial counter (usually green), say: "Kouza wo tsukuritai desu" (I would like to open an account).
3. **Fill Out the Form**: Complete the Account Opening Application Form. It is helpful to prepare your name in Katakana, your phone number, and exact address beforehand.
4. **Finalize**: Submit the form along with your ID. The staff will process it. You will receive your bankbook immediately at the counter, while the physical ATM card will be mailed to your home in 1-2 weeks.

---

## 3. Important Notes for Foreigners
- **Residency Requirement**: Mid- to long-term foreign residents generally need to have lived in Japan for **at least 3 months** to be eligible for a standard account. If you have been in Japan for less than 3 months, your account may be restricted (e.g., you might not be able to receive salary transfers or make international remittances) until the 3-month mark is reached.
- **Consistency of Information**: The name registered for the account must perfectly match the name printed on your Passport and Residence Card (uppercase letters without accent marks).
- **Account Security**: Never give your bankbook, card, or PIN to anyone. Buying, selling, or lending bank accounts is a severe violation of Japanese law.`;

const content_md_jp = `# ゆうちょ銀行口座開設の手続きガイド

ゆうちょ銀行は、日本全国に支店とATM網を持つ最も普及している銀行の一つです。最大の利点は、口座開設の要件が比較的緩やかであり、日本に来て間もない外国人（留学生、技能実習生、エンジニア）で、滞在期間が短く日本語がまだ得意でない方にも適していることです。

スマートフォンアプリを使って自宅から簡単に申し込むか、最寄りの郵便局の窓口で直接手続きを行うことができます。

---

## 1. 必要書類と準備するもの

手続きを行う前に、以下の書類と情報を準備してください：
1. **在留カード**：有効期限内で、裏面に現在の居住地住所が記載されている原本（市役所・区役所で住所登録済みのもの）。
2. **パスポート**：有効期限内の原本。
3. **追加の本人確認書類（必要な場合）**：マイナンバーカードまたは国民健康保険証。
4. **スマートフォン**：インターネットに接続でき、アプリをダウンロードできるもの（オンライン申請の場合）。日本国内で連絡可能な電話番号も必要です。
5. **印鑑（ハンコ）**：窓口で手続きを行う場合（サインで受け付けてくれる支店もありますが、印鑑を持参するのが最も確実です）。

---

## 2. 2つの主な登録方法

### 方法A：スマートフォンアプリによるオンライン申請（推奨）
時間を節約でき、日本語での会話が不要な方法です。
1. **アプリのダウンロード**：App StoreまたはGoogle Playで**「ゆうちょ手続アプリ」**をダウンロードします。
2. **本人確認**：アプリを開き、指示に従って在留カードまたはマイナンバーカードのICチップを読み取り、顔写真を撮影します。
3. **情報の入力**：個人情報（アルファベットとカタカナの氏名、住所、電話番号、口座開設の目的）を入力します。
4. **受け取りを待つ**：銀行が審査を行います。承認されると、キャッシュカードと通帳が1〜2週間程度で簡易書留にて自宅住所に郵送されます。

### 方法B：郵便局窓口での直接申請
スマートフォンの操作が苦手な方や、すぐに行員にサポートしてもらいたい方に適しています。
1. **最寄りの郵便局へ行く**：自宅または職場の最寄りの郵便局（〒マークが目印）に行きます。
2. **整理券を取る**：整理券を取り、金融窓口（通常は緑色）で「口座を作りたいです（Kouza wo tsukuritai desu）」と伝えます。
3. **申請書の記入**：口座開設申込書に記入します。事前に自分の名前のカタカナ表記、電話番号、正確な住所を準備しておくとスムーズです。
4. **手続きの完了**：書類と身分証明書を提出します。手続きが終わると、その場で通帳を受け取ることができます。キャッシュカードは1〜2週間後に自宅に郵送されます。

---

## 3. 外国人向けの重要事項
- **滞在期間の要件**：中長期在留資格を持つ外国人が通常の口座を開設するには、原則として日本に**3ヶ月以上**滞在している必要があります。滞在期間が3ヶ月未満の場合、要件を満たすまで口座の一部機能（給与振込の受け取りや海外送金など）が制限される場合があります。
- **情報の不一致に注意**：口座に登録する氏名は、パスポートおよび在留カードに印字されている氏名（アクセント記号なしのローマ字大文字）と完全に一致している必要があります。
- **口座売買の禁止**：自分の通帳、カード、暗証番号（PIN）を他人に絶対に渡さないでください。銀行口座の売買や貸与は、日本の法律で重く罰せられる犯罪行為です。`;

async function updateYuchoGuide() {
  console.log('Starting Yucho guide update...');
  
  const payload = {
    slug: 'open-yucho-bank-account',
    title: 'Hướng dẫn đăng ký mở tài khoản ngân hàng bưu điện Yucho',
    title_en: 'Guide to Opening a Yucho Bank (Japan Post Bank) Account',
    title_jp: 'ゆうちょ銀行口座開設の手続きガイド',
    summary: 'Quy trình chi tiết đăng ký mở tài khoản ngân hàng bưu điện (Yucho Bank) thông qua ứng dụng hoặc trực tiếp tại quầy, phù hợp cho người nước ngoài mới đến Nhật Bản.',
    summary_en: 'A detailed guide on opening a Yucho Bank account via the mobile app or in person, especially suited for foreigners newly arrived in Japan.',
    summary_jp: 'アプリまたは窓口でゆうちょ銀行口座を開設する詳細な手順。日本に来たばかりの外国人にも最適です。',
    content_md: content_md,
    content_md_en: content_md_en,
    content_md_jp: content_md_jp
  };

  const { data, error } = await supabase
    .from('administrative_guides')
    .update(payload)
    .eq('slug', 'mo-tai-khoan-yucho')
    .select();

  if (error) {
    console.error('Error updating Yucho guide:', error);
  } else {
    console.log('Successfully updated Yucho guide!', data?.[0]?.id);
  }
}

updateYuchoGuide();
