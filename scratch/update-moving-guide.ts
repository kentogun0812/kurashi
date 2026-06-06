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

const content_md = `# Hướng dẫn thủ tục chuyển nhà tại Nhật Bản (Tenshutsu & Tennyu)

Thủ tục chuyển nhà tại Nhật Bản (chuyển đổi địa chỉ cư trú) bao gồm 2 bước hành chính bắt buộc: **Tenshutsu (thông báo chuyển đi)** tại nơi ở cũ và **Tennyu (thông báo chuyển đến)** tại nơi ở mới. Bạn cần hoàn tất toàn bộ quy trình này trong vòng **14 ngày** kể từ ngày chuyển đến địa chỉ mới để đảm bảo tính hợp pháp của thẻ cư trú và tránh các rắc rối về thuế, bảo hiểm.

Dưới đây là hướng dẫn chi tiết quy trình chuẩn và các lưu ý quan trọng.

---

## 1. Thủ tục chuyển đi (転出 - Tenshutsu) tại nơi ở cũ

Thủ tục này nhằm thông báo việc bạn cắt địa chỉ cũ. Thường được thực hiện **trước ngày chuyển đi khoảng 14 ngày**.

- **Nơi thực hiện:** Ủy ban hành chính quận/thành phố (Shiyakusho / Kuyakusho) nơi bạn đang sinh sống.
- **Giấy tờ cần mang:** 
  - Thẻ cư trú (Zairyu card).
  - Hộ chiếu (Passport).
  - Thẻ Mã số cá nhân (My Number Card) - nếu có.
  - Con dấu (Hanko) - tùy một số quận yêu cầu.
  - Thẻ bảo hiểm y tế quốc dân (nếu bạn đang dùng thẻ này, sẽ phải trả lại để cấp thẻ mới ở nhà mới).
- **Thực hiện trực tuyến:** Hiện nay, nếu bạn đã có thẻ cứng My Number và mật khẩu, bạn có thể thực hiện thủ tục Tenshutsu online hoàn toàn thông qua cổng thông tin **Myna Portal** mà không cần ra Shiyakusho.
- **Kết quả nhận được:** Bạn sẽ được cấp **Giấy chứng nhận chuyển đi (転出証明書 - Tenshutsu Shomeisho)**. 
  *(Lưu ý: Nếu làm online qua Myna Portal, bạn sẽ không được phát tờ giấy này mà dữ liệu được chuyển thẳng lên hệ thống. Nhưng nếu ra quầy làm trực tiếp, hãy giữ cẩn thận tờ giấy này để làm thủ tục tiếp theo).*

---

## 2. Thủ tục chuyển đến (転入 - Tennyu) tại nơi ở mới

Đây là thủ tục bắt buộc để đăng ký địa chỉ mới và cập nhật địa chỉ vào Thẻ cư trú của bạn.

- **Nơi thực hiện:** Ủy ban hành chính quận/thành phố (Shiyakusho / Kuyakusho) tại nơi bạn vừa dọn đến.
- **Thời hạn:** Bắt buộc trong vòng **14 ngày** kể từ ngày bắt đầu sống thực tế tại nhà mới.
- **Giấy tờ cần mang:** 
  - Thẻ cư trú (Zairyu card) của tất cả các thành viên trong gia đình.
  - **Giấy chứng nhận chuyển đi (Tenshutsu Shomeisho)** đã nhận ở bước trên (Nếu làm Tenshutsu online thì không cần, chỉ cần mang thẻ My Number).
  - Thẻ Mã số cá nhân (My Number Card).
  - Bản sao Hợp đồng thuê nhà mới (để đối chiếu địa chỉ chính xác).
- **Kết quả nhận được:** Nhân viên Shiyakusho sẽ in địa chỉ mới vào mặt sau Thẻ cư trú và mặt sau thẻ My Number của bạn.

---

## 3. Các lưu ý quan trọng khác khi chuyển nhà

Để việc chuyển nhà diễn ra suôn sẻ, bạn không được quên các công việc sau:

- **Chuyển tiếp thư tín (転居届 - Tenso Todoke):** Hãy đến Bưu điện (Yubinkyoku) gần nhất hoặc đăng ký online trên website của bưu điện để làm thủ tục chuyển tiếp thư. Toàn bộ thư từ, giấy tờ gửi đến địa chỉ cũ sẽ được bưu điện tự động chuyển tiếp đến địa chỉ mới của bạn **miễn phí trong vòng 1 năm**. 
- **Chuyển đổi Dịch vụ Tiện ích:** Bạn cần chủ động liên hệ với các công ty Điện, Ga, Nước, và Internet để thông báo ngày cắt dịch vụ (chốt số công tơ) ở nhà cũ và ngày mở lại dịch vụ tại nhà mới. (Lưu ý: Gas thường yêu cầu nhân viên đến mở van trực tiếp tại nhà mới).
- **Trường hợp chuyển nhà trong cùng một Thành phố/Quận:** Nếu bạn chuyển sang nhà mới nhưng vẫn nằm trong phạm vi của cùng một thành phố/quận (cùng một Shiyakusho), bạn không cần làm 2 bước Tenshutsu và Tennyu. Thủ tục này sẽ được gộp chung thành một bước duy nhất gọi là **Tenkyo (転居 - Thủ tục chuyển chỗ ở)**.`;

const content_md_en = `# Guide to Moving House Procedures in Japan (Tenshutsu & Tennyu)

Moving to a new house (changing your registered address) in Japan involves two mandatory administrative steps: **Tenshutsu (Moving-out notification)** at your old municipality and **Tennyu (Moving-in notification)** at your new one. You must complete this entire process within **14 days** of moving into your new address to maintain the validity of your Residence Card and avoid issues with taxes and insurance.

Below is a detailed guide to the standard procedure and important notes.

---

## 1. Moving-out Notification (転出 - Tenshutsu) at your old address

This procedure notifies the government that you are leaving your current address. It should generally be done **about 14 days before your move**.

- **Where to go:** The municipal office (Shiyakusho / Kuyakusho) of the city/ward you currently live in.
- **Required Documents:** 
  - Residence Card (Zairyu card).
  - Passport.
  - My Number Card (if you have one).
  - Personal seal (Hanko) - required by some offices.
  - National Health Insurance Card (if enrolled, you must return it here).
- **Online Option:** If you have a physical My Number Card and its PIN, you can now complete the Tenshutsu procedure entirely online via the **Myna Portal** without visiting the office.
- **What you receive:** You will be issued a **Moving-out Certificate (転出証明書 - Tenshutsu Shomeisho)**. 
  *(Note: If you apply online via Myna Portal, you will not receive a paper certificate as the data is sent digitally. If done in person, keep this paper safe for the next step).*

---

## 2. Moving-in Notification (転入 - Tennyu) at your new address

This is a mandatory step to register your new address and update your Residence Card.

- **Where to go:** The municipal office (Shiyakusho / Kuyakusho) of the city/ward you just moved to.
- **Deadline:** Strictly within **14 days** from the day you actually started living at the new address.
- **Required Documents:** 
  - Residence Cards of all family members moving.
  - **Moving-out Certificate (Tenshutsu Shomeisho)** received in the previous step (Not required if Tenshutsu was done online; just bring your My Number Card).
  - My Number Card.
  - A copy of your new House Lease Contract (to verify the exact address).
- **What you receive:** The municipal staff will print your new address on the back of your Residence Card and My Number Card.

---

## 3. Other Important Considerations When Moving

To ensure a smooth transition, do not forget the following tasks:

- **Mail Forwarding (転居届 - Tenso Todoke):** Visit your nearest Post Office (Yubinkyoku) or apply online on the Japan Post website for mail forwarding. All mail sent to your old address will be automatically forwarded to your new address **free of charge for 1 year**.
- **Utility Transfers:** You must proactively contact your Electricity, Gas, Water, and Internet providers to close your accounts (final meter reading) at the old house and open services at the new one. (Note: Gas usually requires a staff member to physically come and open the valve at the new house).
- **Moving within the same City/Ward:** If you are moving but staying within the jurisdiction of the same municipal office, you do not need to do both Tenshutsu and Tennyu. The procedure is combined into a single step called **Tenkyo (転居 - Change of address notification)**.`;

const content_md_jp = `# 日本での引越し手続きガイド（転出・転入）

日本での引越し（住所変更）には、旧住所での**「転出届（Tenshutsu）」**と、新住所での**「転入届（Tennyu）」**の2つの必須行政手続きが含まれます。在留カードの有効性を維持し、税金や保険に関するトラブルを防ぐため、新住所に住み始めてから**14日以内**にこれらの手続きをすべて完了する必要があります。

以下は、標準的な手続きの流れと重要な注意事項の詳細なガイドです。

---

## 1. 旧住所での転出届（Tenshutsu）

これは、現在の住所から引っ越すことを役所に通知する手続きです。通常、**引越し予定日の約14日前**から手続き可能です。

- **手続き場所：** 現在住んでいる市区町村の役所（市役所・区役所）。
- **必要書類：** 
  - 在留カード（Zairyu card）
  - パスポート
  - マイナンバーカード（お持ちの場合）
  - 印鑑（ハンコ） - 一部の役所で必要な場合あり
  - 国民健康保険証（加入している場合はここで返却します）
- **オンライン手続き：** マイナンバーカードと暗証番号をお持ちの場合、現在では役所に行かずに**マイナポータル（Myna Portal）**を通じてオンラインで転出届を完了させることができます。
- **受け取るもの：** **転出証明書（Tenshutsu Shomeisho）**が発行されます。
  *（注意：マイナポータルでオンライン申請した場合、データが直接送信されるため紙の証明書は発行されません。窓口で手続きした場合は、次のステップのためにこの証明書を大切に保管してください）。*

---

## 2. 新住所での転入届（Tennyu）

新住所を登録し、在留カードを更新するための必須手続きです。

- **手続き場所：** 引っ越し先の新しい市区町村の役所。
- **期限：** 新しい住所に実際に住み始めた日から**14日以内（厳守）**。
- **必要書類：** 
  - 引っ越す家族全員の在留カード
  - 前のステップで受け取った**転出証明書**（オンラインで転出をした場合は不要ですが、マイナンバーカードを持参してください）
  - マイナンバーカード
  - 新しい賃貸契約書のコピー（正確な住所を確認するため）
- **受け取るもの：** 役所の職員が、在留カードとマイナンバーカードの裏面に新しい住所を印字（記載）してくれます。

---

## 3. 引越し時のその他の重要事項

スムーズに引越しを完了させるために、以下の作業も忘れないでください：

- **郵便物の転送（転居届 - Tenso Todoke）：** 最寄りの郵便局に行くか、日本郵便のウェブサイトから転送サービスを申し込みます。旧住所宛ての郵便物が、**1年間無料**で新住所に自動転送されます。
- **ライフラインの移転手続き：** 電気、ガス、水道、インターネットの各会社に直接連絡し、旧居での利用停止（最終検針）と新居での利用開始の手続きを行う必要があります。（注意：ガスの開栓には、通常、作業員の立ち会いが必要です）。
- **同じ市区町村内での引越しの場合：** 同じ市区町村（同じ役所の管轄内）で引っ越す場合、転出・転入の2つの手続きは不要です。**「転居届（Tenkyo）」**という1回の手続きのみで完了します。`;

async function updateMovingGuide() {
  console.log('Starting moving guide update...');
  
  const payload = {
    slug: 'moving-house-procedure',
    title: 'Thủ tục chuyển nhà tại Nhật Bản',
    title_en: 'Guide to Moving House Procedures in Japan',
    title_jp: '日本での引越し手続きガイド',
    summary: 'Hướng dẫn chi tiết thủ tục hành chính khi chuyển nhà tại Nhật Bản (Tenshutsu & Tennyu), bao gồm các giấy tờ cần thiết và quy trình thực hiện cho người nước ngoài.',
    summary_en: 'A detailed guide to administrative procedures when moving house in Japan (Tenshutsu & Tennyu), including required documents and steps for foreigners.',
    summary_jp: '外国人向けの日本での引越しに伴う行政手続き（転出・転入）の詳細なガイド、必要書類と手順を含みます。',
    content_md: content_md,
    content_md_en: content_md_en,
    content_md_jp: content_md_jp
  };

  const { data, error } = await supabase
    .from('administrative_guides')
    .update(payload)
    .eq('slug', 'thu-tuc-chuyen-nha')
    .select();

  if (error) {
    console.error('Error updating moving guide:', error);
  } else {
    console.log('Successfully updated moving guide!', data?.[0]?.id);
  }
}

updateMovingGuide();
