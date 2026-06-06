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

const content_md = `# Hướng dẫn thủ tục đăng ký kết hôn tại Nhật Bản

Thủ tục đăng ký kết hôn tại Nhật Bản sẽ có sự khác biệt lớn tùy thuộc vào quốc tịch của người bạn đời. Bài viết này sẽ hướng dẫn chi tiết quy trình, hồ sơ cần chuẩn bị cho 2 trường hợp phổ biến nhất: Kết hôn với công dân Nhật Bản và Kết hôn giữa hai công dân Việt Nam.

---

## 1. Trường hợp kết hôn với công dân Nhật Bản

Khi kết hôn với người Nhật, bạn bắt buộc phải thực hiện thủ tục đăng ký tại cơ quan hành chính địa phương của Nhật Bản (Shiyakusho/Kuyakusho) trước. Sau khi hoàn tất, đây sẽ là cơ sở pháp lý để bạn xin chuyển đổi sang tư cách lưu trú "Vợ/chồng người Nhật" (Spouse Visa).

### A. Hồ sơ cần chuẩn bị

**Đối với công dân Việt Nam:**
1. **Giấy xác nhận tình trạng hôn nhân**: Xin tại UBND xã/phường nơi đăng ký hộ khẩu thường trú tại Việt Nam. Giấy này cần được dịch thuật công chứng sang tiếng Nhật.
   *(Lưu ý xác minh: Một số Shiyakusho có thể yêu cầu bạn phải đổi giấy này thành "Giấy đủ điều kiện kết hôn" do Đại sứ quán Việt Nam tại Nhật Bản cấp. Bạn nên gọi điện hỏi trước Shiyakusho nơi dự định nộp hồ sơ).*
2. **Hộ chiếu (Passport)**: Bản gốc và bản sao.
3. **Thẻ ngoại kiều (Zairyu Card)**: Bản gốc và bản sao.

**Đối với công dân Nhật Bản:**
1. **Đơn xin đăng ký kết hôn (婚姻届 - Konin-todoke)**: Lấy mẫu tại Shiyakusho. Cần điền đầy đủ thông tin và có chữ ký/đóng dấu.
2. **Bản sao hộ tịch (戸籍謄本 - Koseki Tohon)**: Lấy tại nơi đăng ký hộ khẩu gốc của người Nhật (Bản cấp trong vòng 3 tháng).
3. **Giấy chứng nhận cư trú (住民票 - Juminhyo)**.
4. **Chữ ký của 2 người làm chứng**: Đơn đăng ký kết hôn yêu cầu phải có chữ ký và đóng dấu của 02 người làm chứng (bất kể quốc tịch, từ 20 tuổi trở lên).

### B. Quy trình thực hiện
1. **Nộp hồ sơ tại cơ quan Nhật Bản**: Mang toàn bộ hồ sơ trên đến Tòa thị chính thành phố/quận (Shiyakusho/Kuyakusho) nơi người Nhật cư trú để nộp.
2. **Nhận kết quả**: Nếu hồ sơ hợp lệ, bạn sẽ được nhận **Giấy chứng nhận thụ lý đăng ký kết hôn (結婚届受理証明書 - Konin Todoke Juri Shomeisho)**.
3. **Ghi chú kết hôn tại ĐSQ Việt Nam**: Để cuộc hôn nhân được công nhận hợp pháp tại Việt Nam, bạn mang Giấy chứng nhận thụ lý (kèm bản dịch tiếng Việt) cùng Hộ chiếu, Thẻ ngoại kiều lên Đại sứ quán/Lãnh sự quán Việt Nam tại Nhật Bản để làm thủ tục Ghi chú kết hôn.

---

## 2. Trường hợp kết hôn giữa hai công dân Việt Nam

Nếu cả hai vợ chồng đều là người Việt Nam đang lưu trú hợp pháp tại Nhật, các bạn không cần thông qua chính quyền Nhật Bản. Thủ tục sẽ được thực hiện trực tiếp tại cơ quan đại diện ngoại giao của Việt Nam tại Nhật Bản.

### A. Hồ sơ cần chuẩn bị (Nộp tại Đại sứ quán/Lãnh sự quán)
1. **Phiếu đề nghị và thông tin liên hệ**: Theo mẫu của Đại sứ quán.
2. **Tờ khai đăng ký kết hôn**: Theo mẫu quy định, có dán ảnh thẻ của cả hai người.
3. **Giấy xác nhận tình trạng hôn nhân**: Của cả hai bên, do UBND cấp xã/phường tại Việt Nam cấp (còn hiệu lực trong vòng 6 tháng tính đến ngày nộp hồ sơ).
4. **Giấy tờ tùy thân**: Bản sao Hộ chiếu và Thẻ ngoại kiều (Zairyu Card) của cả hai bên (Mang theo bản gốc để đối chiếu).
   *(Lưu ý xác minh: Tùy từng thời điểm, ĐSQ có thể yêu cầu nộp thêm Giấy khám sức khỏe tâm thần/truyền nhiễm. Bạn cần liên hệ trước với ĐSQ để xác nhận chính xác danh mục hồ sơ hiện hành).*

### B. Quy trình thực hiện
1. **Chuẩn bị hồ sơ và đặt lịch**: Hoàn thiện các giấy tờ nêu trên. Truy cập website của ĐSQ để lấy số/đặt lịch hẹn (nếu có yêu cầu).
2. **Nộp trực tiếp**: Cả hai người cùng có mặt mang hồ sơ nộp trực tiếp tại Đại sứ quán Việt Nam (Tokyo) hoặc Tổng lãnh sự quán Việt Nam (Osaka, Fukuoka...).
3. **Đóng lệ phí và nhận kết quả**: Nộp lệ phí lãnh sự theo quy định. Sau khi được duyệt, hai bạn sẽ cùng ký tên vào sổ đăng ký và nhận **Giấy chứng nhận kết hôn** (Bản chính màu hồng).`;

const content_md_en = `# Guide to Marriage Registration Procedures in Japan

The marriage registration process in Japan varies significantly depending on your partner's nationality. This guide provides detailed steps and required documents for the two most common scenarios: Marrying a Japanese citizen and Marrying a fellow Vietnamese citizen.

---

## 1. Marrying a Japanese Citizen

When marrying a Japanese national, you must first register the marriage at a local Japanese municipal office (Shiyakusho/Kuyakusho). Once completed, this serves as the legal basis to apply for a change of residency status to a "Spouse of Japanese National" visa.

### A. Required Documents

**For the Vietnamese Citizen:**
1. **Certificate of Marital Status**: Obtained from the People's Committee of the ward/commune where you are registered in Vietnam. This document must be translated into Japanese and notarized.
   *(Verification Note: Some Shiyakusho may require you to exchange this for a "Certificate of Eligibility to Marry" issued by the Vietnamese Embassy in Japan. It is strongly advised to call your local Shiyakusho beforehand to confirm).*
2. **Passport**: Original and copy.
3. **Residence Card (Zairyu Card)**: Original and copy.

**For the Japanese Citizen:**
1. **Marriage Registration Form (婚姻届 - Konin-todoke)**: Available at the Shiyakusho. Must be fully completed, signed, and stamped (hanko).
2. **Certified Copy of Family Register (戸籍謄本 - Koseki Tohon)**: Obtained from their registered domicile (must be issued within the last 3 months).
3. **Certificate of Residence (住民票 - Juminhyo)**.
4. **Signatures of 2 Witnesses**: The Konin-todoke requires the signatures and stamps of two adult witnesses (any nationality, aged 20 or older).

### B. Procedure
1. **Submit at the Japanese Municipal Office**: Bring all the above documents to the Shiyakusho/Kuyakusho of the Japanese citizen's residence.
2. **Receive Confirmation**: If the documents are valid, you will receive a **Certificate of Acceptance of Marriage Registration (結婚届受理証明書 - Konin Todoke Juri Shomeisho)**.
3. **Marriage Recording at the VN Embassy**: For the marriage to be legally recognized in Vietnam, you must submit the Certificate of Acceptance (with a Vietnamese translation), Passport, and Residence Card to the Vietnamese Embassy/Consulate in Japan to complete the "Recording of Marriage" procedure.

---

## 2. Marriage Between Two Vietnamese Citizens

If both partners are Vietnamese citizens legally residing in Japan, you do not need to go through the Japanese municipal office. The procedure is handled directly at the Vietnamese diplomatic missions in Japan.

### A. Required Documents (Submitted to the Embassy/Consulate)
1. **Application and Contact Information Form**: Using the Embassy's template.
2. **Marriage Registration Declaration Form**: Using the prescribed form, with ID photos of both individuals attached.
3. **Certificate of Marital Status**: For both individuals, issued by the commune/ward People's Committee in Vietnam (valid within 6 months prior to submission).
4. **Identification**: Copies of Passports and Residence Cards (Zairyu Cards) for both partners (bring originals for verification).
   *(Verification Note: Depending on current regulations, the Embassy may require a psychiatric/infectious disease health check certificate. Please contact the Embassy beforehand to confirm the exact checklist).*

### B. Procedure
1. **Prepare Documents & Book Appointment**: Complete the paperwork. Check the Embassy's website for appointment booking requirements.
2. **Submit in Person**: Both partners must be present to submit the documents directly at the Vietnamese Embassy (Tokyo) or Consulate General (Osaka, Fukuoka, etc.).
3. **Pay Fees and Receive Certificate**: Pay the required consular fees. Once approved, both partners will sign the registry book and receive the **Marriage Certificate** (The original pink document).`;

const content_md_jp = `# 日本での婚姻届・結婚手続きガイド

日本での結婚手続きは、配偶者の国籍によって大きく異なります。この記事では、最も一般的な2つのケース（日本人との結婚、およびベトナム人同士の結婚）について、詳細な手順と必要書類を解説します。

---

## 1. 日本人と結婚する場合

日本人と結婚する場合、まず日本の市区町村役場（市役所・区役所）で婚姻届を提出する必要があります。これが完了した後、在留資格を「日本人の配偶者等」（配偶者ビザ）に変更するための法的な基盤となります。

### A. 必要書類

**ベトナム人側：**
1. **婚姻状況証明書（独身証明書）**：ベトナムの住民登録があるコミューン/区の人民委員会で取得。日本語への翻訳と公証が必要です。
   *（確認事項：一部の市役所では、この書類を駐日ベトナム大使館が発行する「婚姻要件具備証明書」に書き換えるよう求められる場合があります。事前に提出予定の市役所に電話で確認することを強くお勧めします）。*
2. **パスポート**：原本およびコピー。
3. **在留カード**：原本およびコピー。

**日本人側：**
1. **婚姻届（Konin-todoke）**：市役所で入手可能。必要事項を記入し、署名・捺印します。
2. **戸籍謄本（Koseki Tohon）**：本籍地で取得（発行から3ヶ月以内のもの）。
3. **住民票（Juminhyo）**。
4. **証人2名の署名**：婚姻届には、20歳以上の証人2名（国籍問わず）の署名と捺印が必要です。

### B. 手続きの流れ
1. **日本の役所に提出**：上記の全書類を、日本人が居住する市区町村役場に提出します。
2. **受理証明書の受け取り**：書類に不備がなければ、**「婚姻届受理証明書」**が交付されます。
3. **ベトナム大使館での婚姻の記帳**：ベトナムでも法的に婚姻を認めさせるために、婚姻届受理証明書（ベトナム語翻訳付き）、パスポート、在留カードを駐日ベトナム大使館・領事館に持参し、「婚姻の記帳（Ghi chú kết hôn）」手続きを行います。

---

## 2. ベトナム人同士が結婚する場合

夫婦ともに日本に合法的に滞在しているベトナム人の場合、日本の市区町村役場を通す必要はありません。手続きは駐日ベトナム外交代表機関で直接行われます。

### A. 必要書類（大使館/領事館に提出）
1. **申請・連絡先情報フォーム**：大使館指定のフォーマット。
2. **婚姻登録申告書**：規定のフォーマット。2人の証明写真を貼付します。
3. **婚姻状況証明書（独身証明書）**：双方の分。ベトナムの人民委員会が発行したもの（提出日から6ヶ月以内の有効期限のもの）。
4. **身分証明書**：双方のパスポートと在留カードのコピー（原本も持参して照合します）。
   *（確認事項：時期によっては、精神疾患・感染症に関する健康診断書の提出が求められる場合があります。現在の正確な必要書類については、事前に大使館にお問い合わせください）。*

### B. 手続きの流れ
1. **書類の準備と予約**：上記の書類を揃えます。大使館のウェブサイトにアクセスし、必要に応じて予約を取ります。
2. **窓口へ直接提出**：夫婦2人が揃って、駐日ベトナム大使館（東京）または総領事館（大阪、福岡など）の窓口に書類を直接提出します。
3. **手数料の支払いと証明書の受け取り**：規定の領事手数料を支払います。審査が通ると、2人で登録簿に署名し、**結婚証明書**（ピンク色の原本）を受け取ります。`;

async function updateMarriageGuide() {
  console.log('Starting marriage guide update...');
  
  const payload = {
    slug: 'marriage-registration',
    title: 'Thủ tục đăng ký kết hôn tại Nhật Bản',
    title_en: 'Guide to Marriage Registration Procedures in Japan',
    title_jp: '日本での婚姻届・結婚手続きガイド',
    summary: 'Hướng dẫn chi tiết thủ tục, hồ sơ đăng ký kết hôn tại Nhật Bản dành cho người Việt Nam (kết hôn với người Nhật hoặc kết hôn với người Việt).',
    summary_en: 'A detailed guide on marriage registration procedures and required documents in Japan for Vietnamese citizens (marrying a Japanese national or a fellow Vietnamese).',
    summary_jp: 'ベトナム人のための日本での婚姻届・結婚手続きの必要書類と手順に関する詳細なガイド（日本人との結婚、またはベトナム人同士の結婚）。',
    content_md: content_md,
    content_md_en: content_md_en,
    content_md_jp: content_md_jp
  };

  const { data, error } = await supabase
    .from('administrative_guides')
    .update(payload)
    .eq('slug', 'dang-ky-ket-hon') // This is the old slug from DB
    .select();

  if (error) {
    console.error('Error updating marriage guide:', error);
  } else {
    console.log('Successfully updated marriage guide!', data?.[0]?.id);
  }
}

updateMarriageGuide();
