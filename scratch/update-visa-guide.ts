import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY 

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateGuide() {
  console.log('Starting guide update...')
  
  const artifactPath = path.join(__dirname, '../.gemini/antigravity-ide/brain/6b4384d3-4b73-4af7-a0fd-e3206e85e471/gia-han-visa-ky-su.md')
  let rawContent = ''
  try {
    // If running from scratch dir, artifact might be outside. Let's just hardcode the contents since we have them in memory, it is safer than guessing the path
  } catch (e) {
    console.log(e)
  }

  // Hardcoded parsed sections from the artifact
  const content_md = `# Hướng dẫn chi tiết thủ tục gia hạn Visa Kỹ sư (Cập nhật quy định mới 2026)

Gia hạn Visa Kỹ sư (Kỹ thuật - Trí thức - Nghiệp vụ quốc tế / 技術・人文知識・国際業務) là thủ tục quan trọng để bạn tiếp tục sinh sống và làm việc hợp pháp tại Nhật Bản. Đặc biệt, từ ngày **15/04/2026**, Cục Xuất nhập cảnh (Nyukan) đã áp dụng những quy định mới, yêu cầu khắt khe hơn về năng lực tiếng Nhật đối với một số nhóm công ty.

Bài viết này sẽ tổng hợp chi tiết quy định mới nhất, các nguyên tắc sống còn khi gia hạn (đặc biệt khi bạn vừa chuyển việc) và danh sách hồ sơ cần chuẩn bị.

---

## 1. 🚨 Quy định mới từ 15/04/2026: Yêu cầu chứng minh năng lực tiếng Nhật (N2+)

Từ 15/04/2026, Nyukan áp dụng quy định mới khắt khe hơn đối với hồ sơ xin cấp mới, chuyển đổi và gia hạn Visa Kỹ sư.

### Đối tượng áp dụng:
Quy định này áp dụng nếu bạn thỏa mãn **đồng thời cả 2 điều kiện** sau:
1. Công ty tiếp nhận thuộc **Nhóm 3** hoặc **Nhóm 4**.
2. Tính chất công việc có sử dụng tiếng Nhật (giao tiếp, dịch vụ, đối ứng khách hàng,...).

*Lưu ý: Không phải tất cả đều cần N2. Nếu bạn làm kỹ sư IT không yêu cầu giao tiếp tiếng Nhật nhiều hoặc công ty thuộc Nhóm 1, 2 thì quy định này có thể không áp dụng.*

### Yêu cầu bổ sung:
Nếu thuộc diện trên, bạn sẽ bị yêu cầu bổ sung giấy tờ:
- Thông tin người đại diện công ty.
- Giấy tờ chứng minh trình độ tiếng Nhật tương đương **B2 trở lên**.

**Các điều kiện được công nhận đạt trình độ B2:**
- Có chứng chỉ **JLPT N2** trở lên.
- Điểm thi **BJT từ 400 điểm** trở lên.
- Tốt nghiệp hoặc từng trải qua giáo dục tại Nhật Bản (Senmon, Đại học,...).
- Đã sinh sống lâu dài và liên tục tại Nhật.

### Cách phân biệt công ty Nhóm 3 và Nhóm 4
- **Nhóm 3:** Thường là các công ty vừa và nhỏ, có hoạt động ổn định nhưng không thuộc nhóm doanh nghiệp lớn. Thường không niêm yết trên sàn chứng khoán. Hồ sơ của nhóm này bị Nyukan kiểm tra ở mức độ trung bình.
- **Nhóm 4:** Thường là công ty mới thành lập, quy mô siêu nhỏ hoặc độ tin cậy chưa cao. Các công ty này thường chưa có nhiều lịch sử tuyển dụng người nước ngoài. Hồ sơ thuộc Nhóm 4 bị xét rất chặt chẽ và rất dễ bị yêu cầu giải trình, bổ sung giấy tờ.

---

## 2. Các nguyên tắc quan trọng khi gia hạn Visa (Đặc biệt khi vừa chuyển việc)

Nếu bạn tiếp tục làm việc ở công ty cũ, thủ tục gia hạn rất đơn giản. Tuy nhiên, nếu bạn vừa chuyển việc, Nyukan sẽ thẩm định hồ sơ của bạn khắt khe tương đương với việc xin cấp mới. Dưới đây là 2 nguyên tắc bạn bắt buộc phải nhớ:

### Nguyên tắc 1: Thực hiện nghĩa vụ khai báo chuyển việc (Tốt nghiệp/Nghỉ việc/Vào công ty mới)
Theo luật, bạn có nghĩa vụ phải khai báo với Nyukan:
- Trong vòng **14 ngày** kể từ ngày nghỉ việc ở công ty cũ.
- Trong vòng **14 ngày** kể từ ngày vào làm ở công ty mới.

**Nếu quên khai báo:** Hệ thống sẽ ghi nhận bạn vi phạm nghĩa vụ. Dù hiếm khi bị trục xuất ngay, nhưng thời hạn Visa được cấp ở lần tiếp theo thường bị phạt rút ngắn xuống chỉ còn 1 năm và thời gian xét duyệt hồ sơ sẽ lâu hơn bình thường. Bạn có thể khai báo bổ sung qua trang web hệ thống điện tử của Nyukan.

### Nguyên tắc 2: Công việc mới phải khớp với bằng cấp
Nhiều người lầm tưởng "có Visa Kỹ sư rồi thì chuyển sang làm công ty nào cũng được". Đây là sai lầm dễ dẫn đến việc bị từ chối gia hạn. Nyukan luôn xét yếu tố: **Nội dung công việc mới (職務内容) có tương thích với chuyên ngành bạn đã học ở Đại học/Senmon không?**

*Ví dụ: Bằng của bạn là Kinh tế, công ty cũ bạn làm Sales. Công ty mới tuyển bạn làm Lập trình viên. Đến lúc gia hạn Visa, Cục sẽ đánh trượt trừ khi bạn chứng minh được bạn có 10 năm kinh nghiệm làm IT.*

---

## 3. Danh sách hồ sơ cần chuẩn bị

### A. Giấy tờ cá nhân
1. **Đơn xin gia hạn thời hạn lưu trú** (在留期間更新許可申請書) - Có đóng dấu của công ty mới.
2. **Ảnh thẻ** (3cm x 4cm) chụp trong vòng 3 tháng gần nhất.
3. **Hộ chiếu** (Bản gốc) và **Thẻ ngoại kiều - Zairyu Card** (Bản gốc).
4. **Giấy chứng nhận nộp thuế** (納税証明書 - Nouzei Shomeisho) và **Giấy chứng nhận đóng thuế** (課税証明書 - Kazei Shomeisho) của năm gần nhất (Xin tại Kuyakusho/Shiyakusho).

### B. Giấy tờ từ công ty cũ (Nếu chuyển việc)
1. **Giấy chứng nhận thôi việc** (退職証明書): Dùng để chốt mốc thời gian nghỉ ở công ty cũ, chứng minh bạn không làm 2 công ty cùng lúc.
2. **Giấy chứng nhận thu nhập và khấu trừ thuế** (源泉徴収票 - Gensen Choshuhyo): Xin từ công ty cũ để chứng minh bạn đã đóng thuế đầy đủ trong thời gian làm việc.

### C. Giấy tờ từ công ty mới
Tùy thuộc vào quy mô công ty (Nhóm 1, 2, 3, 4), giấy tờ yêu cầu sẽ khác nhau. Dưới đây là các giấy tờ cơ bản đối với công ty Nhóm 3 và 4:
1. Bản sao **Hợp đồng lao động** (雇用契約書) hoặc Giấy báo điều kiện làm việc.
2. **Bản sao Đăng ký kinh doanh** của công ty (登記簿謄本 - Tokibo Tohon).
3. **Bản sao Báo cáo quyết toán** năm gần nhất (決算書 - Kessansho).
4. **Tài liệu giới thiệu công ty** (Company profile, in từ Website,...).
5. Lý do tuyển dụng hoặc Giấy giải trình công việc (Đặc biệt quan trọng với công ty Nhóm 4 hoặc nếu công việc có rủi ro trái ngành).
6. *(Từ 15/04/2026)* **Giấy tờ chứng minh tiếng Nhật** (Bằng N2, BJT...) nếu tính chất công việc yêu cầu.

*Lưu ý: Nếu công ty mới thuộc Nhóm 1 hoặc 2 (công ty niêm yết lớn, đóng thuế đầy đủ số tiền lớn), bạn sẽ được miễn giảm phần lớn giấy tờ của công ty (chỉ cần nộp Đơn xin gia hạn và Hồ sơ cá nhân).*

---

## 4. Lời khuyên từ Kurashi
- Thời gian nộp hồ sơ gia hạn có thể bắt đầu từ **3 tháng trước khi Visa hết hạn**. Hãy chuẩn bị hồ sơ càng sớm càng tốt.
- Nếu bạn có thay đổi công việc, hãy luôn kiểm tra xem mô tả công việc mới có phù hợp với bằng cấp của bạn hay không để tránh rủi ro khi xin gia hạn.
- Với các quy định ngày càng khắt khe về tiếng Nhật, việc trang bị cho mình chứng chỉ N2 là rất cần thiết để đảm bảo sự ổn định lâu dài tại Nhật Bản.`;

  const content_md_en = `# Detailed Guide to Engineer Visa Extension (Updated with 2026 Regulations)

Extending your Engineer Visa (Engineer/Specialist in Humanities/International Services / 技術・人文知識・国際業務) is a crucial procedure to continue living and working legally in Japan. Notably, from **April 15, 2026**, the Immigration Services Agency (Nyukan) has implemented new regulations with stricter Japanese language proficiency requirements for certain categories of companies.

This article summarizes the latest regulations, vital principles for visa extension (especially if you just changed jobs), and the required document list.

---

## 1. 🚨 New Regulation from April 15, 2026: Proof of Japanese Proficiency (N2+)

Starting April 15, 2026, stricter rules apply to applications for new issuance, change of status, and extension of the Engineer Visa.

### Who is affected:
This applies if you meet **both of the following conditions simultaneously**:
1. The receiving company belongs to **Category 3** or **Category 4**.
2. The nature of the work involves using Japanese (communication, customer service, facing clients, etc.).

*Note: Not everyone needs N2. If you work as an IT engineer with minimal Japanese communication required, or if your company is in Category 1 or 2, this regulation may not apply.*

### Additional Requirements:
If you fall into the above category, you will be required to submit:
- Information on the company representative.
- Documents proving Japanese proficiency equivalent to **B2 level or higher**.

**Conditions recognized as B2 proficiency:**
- Holding a **JLPT N2** certificate or higher.
- A **BJT score of 400 points** or higher.
- Having graduated from or undergone education in Japan (Senmon, University, etc.).
- Having lived in Japan continuously for a long period.

### How to distinguish Category 3 and Category 4 companies
- **Category 3:** Typically small and medium-sized enterprises (SMEs) with stable operations but not part of large corporate groups. They are usually unlisted. Applications from this category are checked at a medium level by Nyukan.
- **Category 4:** Typically newly established companies, micro-enterprises, or those with lower reliability. These companies often lack a history of hiring foreigners. Applications in Category 4 are scrutinized very strictly and are highly likely to require additional explanations or documents.

---

## 2. Important Principles for Visa Extension (Especially when changing jobs)

If you continue working at the same company, the extension process is straightforward. However, if you recently changed jobs, Nyukan will evaluate your application as strictly as a new issuance. You must remember these two principles:

### Principle 1: Fulfillment of Notification Obligations (Graduation/Resignation/Joining a new company)
By law, you are obligated to notify Nyukan:
- Within **14 days** of leaving your old company.
- Within **14 days** of joining your new company.

**If you forget to notify:** The system will record you as violating this obligation. While rarely resulting in immediate deportation, your next visa duration is often penalized and shortened to just 1 year, and processing times will take longer. You can submit late notifications via Nyukan's electronic system website.

### Principle 2: The new job must match your degree
Many mistakenly believe that "having an Engineer Visa means you can work for any company." This is a dangerous misconception that can lead to visa denial. Nyukan always considers: **Does the new job description (職務内容) logically match the major you studied at University/Senmon?**

*Example: Your degree is in Economics, and your old job was in Sales. The new company hires you as a Programmer. When extending your visa, Nyukan will reject it unless you can prove 10 years of IT experience.*

---

## 3. Required Document List

### A. Personal Documents
1. **Application for Extension of Period of Stay** (在留期間更新許可申請書) - Stamped by the new company.
2. **ID Photo** (3cm x 4cm) taken within the last 3 months.
3. **Passport** (Original) and **Residence Card - Zairyu Card** (Original).
4. **Tax Payment Certificate** (納税証明書 - Nouzei Shomeisho) and **Taxation Certificate** (課税証明書 - Kazei Shomeisho) for the most recent year (Obtained at Kuyakusho/Shiyakusho).

### B. Documents from the old company (If you changed jobs)
1. **Certificate of Resignation** (退職証明書): Used to finalize your end date at the old company and prove you aren't working two jobs simultaneously.
2. **Withholding Tax Certificate** (源泉徴収票 - Gensen Choshuhyo): Proves you paid your taxes fully during your employment.

### C. Documents from the new company
Depending on the company size (Category 1, 2, 3, 4), required documents vary. Below are the basic documents for Category 3 and 4 companies:
1. Copy of the **Employment Contract** (雇用契約書) or Notice of Working Conditions.
2. **Company Registration Certificate** (登記簿謄本 - Tokibo Tohon).
3. **Financial Statement** for the most recent year (決算書 - Kessansho).
4. **Company Profile** (Pamphlet, printed from website, etc.).
5. Statement of reasons for employment or Job description explanation (Especially crucial for Category 4 or if the job has a risk of mismatching your degree).
6. *(From April 15, 2026)* **Proof of Japanese proficiency** (N2 certificate, BJT...) if the job requires it.

*Note: If your new company is Category 1 or 2 (large listed companies, paying substantial taxes), you are exempt from most company documents (only the Application form and Personal documents are needed).*

---

## 4. Advice from Kurashi
- You can apply for a visa extension starting from **3 months before your visa expires**. Prepare your documents as early as possible.
- If you change jobs, always verify that the new job description matches your degree to avoid risks during extension.
- With increasingly strict Japanese language regulations, acquiring an N2 certificate is highly recommended to ensure long-term stability in Japan.`;

  const content_md_jp = `# 技術・人文知識・国際業務ビザ更新の手続きガイド（2026年新規定対応）

技術・人文知識・国際業務ビザ（就労ビザ）の更新は、日本で合法的に生活し働くために重要な手続きです。特に**2026年4月15日**より、出入国在留管理庁（入管）は一部のカテゴリーの企業に対し、より厳格な日本語能力要件を課す新規定を導入しました。

この記事では、最新の規定、ビザ更新時の重要な原則（特に転職した場合）、および必要書類リストについて詳しく解説します。

---

## 1. 🚨 2026年4月15日からの新規定：日本語能力（N2以上）の証明要件

2026年4月15日より、入管は就労ビザの新規交付、変更、および更新に対してより厳格な規定を適用します。

### 対象者：
以下の**2つの条件を同時に満たす**場合、この規定が適用されます：
1. 受入企業が**カテゴリー3**または**カテゴリー4**に属している。
2. 業務内容において日本語を使用する（コミュニケーション、接客、顧客対応など）。

*注意：全員がN2を必要とするわけではありません。日本語でのコミュニケーションをあまり必要としないITエンジニアとして働く場合や、企業がカテゴリー1または2に属している場合、この規定は適用されないことがあります。*

### 追加要件：
上記に該当する場合、以下の書類の提出が求められます：
- 企業の代表者に関する情報。
- **B2レベル以上**に相当する日本語能力を証明する書類。

**B2レベルと認められる条件：**
- **JLPT N2**以上の資格を保有している。
- **BJT 400点以上**を取得している。
- 日本での教育機関（専門学校、大学など）を卒業、または教育を受けている。
- 日本に長期間かつ継続して居住している。

### カテゴリー3とカテゴリー4の違い
- **カテゴリー3：** 通常、安定した運営を行っているが、大企業グループには属さない中小企業（SME）。多くは非上場です。このカテゴリーの申請は、入管によって中程度の基準で審査されます。
- **カテゴリー4：** 設立間もない企業、零細企業、または信頼性が十分に確立されていない企業。外国人の採用実績がないことが多いです。カテゴリー4の申請は非常に厳しく審査され、追加の説明や書類が求められる可能性が高くなります。

---

## 2. ビザ更新時の重要原則（特に転職した場合）

同じ企業で働き続ける場合、更新手続きはシンプルです。しかし、最近転職した場合、入管は新規申請と同等に厳しく審査します。以下の2つの原則を必ず覚えておいてください。

### 原則1：届出義務の履行（卒業・退職・新しい企業への入社）
法律により、入管への届出が義務付けられています：
- 前の企業を退職してから**14日以内**。
- 新しい企業に入社してから**14日以内**。

**届出を忘れた場合：** システム上、義務違反として記録されます。直ちに強制送還されることは稀ですが、次回のビザ期間が1年に短縮されるなどのペナルティを受けることが多く、審査にも時間がかかります。入管の電子届出システムを通じて遅れて提出することも可能です。

### 原則2：新しい職務内容が学歴と一致していること
「就労ビザを持っていればどの会社でも働ける」と誤解している人が多くいますが、これはビザ不許可につながる危険な間違いです。入管は常に以下の要素を審査します：**新しい職務内容が、大学や専門学校で学んだ専攻と論理的に一致しているか？**

*例：専攻が経済学で、前職が営業だったとします。新しい企業があなたをプログラマーとして採用した場合、10年以上のIT実務経験を証明できない限り、更新時に不許可となります。*

---

## 3. 必要書類リスト

### A. 個人書類
1. **在留期間更新許可申請書**（新しい企業の社判が押印されたもの）。
2. **証明写真**（3cm x 4cm、過去3ヶ月以内に撮影したもの）。
3. **パスポート**（原本）および **在留カード**（原本）。
4. 直近1年分の**納税証明書**および**課税証明書**（区役所や市役所で取得）。

### B. 前職の企業からの書類（転職した場合）
1. **退職証明書**：前職の退職日を確定し、2つの企業で同時に働いていないことを証明するために使用します。
2. **源泉徴収票**：在職中に税金を適切に納めていたことを証明します。

### C. 新しい企業からの書類
企業の規模（カテゴリー1、2、3、4）によって必要書類は異なります。以下はカテゴリー3および4の企業の基本書類です：
1. **雇用契約書**または労働条件通知書のコピー。
2. **登記簿謄本**。
3. 直近1年分の**決算書**。
4. **会社案内**（パンフレットやウェブサイトの印刷物など）。
5. 雇用理由書または職務内容説明書（特にカテゴリー4の企業や、職務内容が専攻と不一致と見なされるリスクがある場合に重要）。
6. *(2026年4月15日以降)* 業務上必要な場合、**日本語能力を証明する書類**（N2証明書、BJTなど）。

*注意：新しい企業がカテゴリー1または2（上場企業や多額の税金を納めている企業）の場合、企業側の書類のほとんどが免除されます（申請書と個人書類のみで可）。*

---

## 4. Kurashiからのアドバイス
- ビザの更新申請は、**在留期限の3ヶ月前**から可能です。書類の準備はできるだけ早く始めましょう。
- 転職する場合は、新しい職務内容が自身の学歴と一致しているかを必ず確認し、更新時のリスクを回避してください。
- 日本語要件がますます厳格になる中、日本での長期的な安定を確保するためには、N2資格の取得を強くお勧めします。`;

  const payload = {
    title: 'Hướng dẫn chi tiết thủ tục gia hạn Visa Kỹ sư (Cập nhật 2026)',
    title_en: 'Detailed Guide to Engineer Visa Extension (Updated 2026)',
    title_jp: '技術・人文知識・国際業務ビザ更新の手続きガイド（2026年新規定対応）',
    summary: 'Tổng hợp chi tiết thủ tục gia hạn Visa Kỹ sư, bao gồm quy định mới nhất áp dụng từ 15/04/2026 yêu cầu năng lực tiếng Nhật N2 đối với một số nhóm công ty.',
    summary_en: 'A comprehensive guide on extending the Engineer Visa, including the latest regulations from April 15, 2026, which require N2 Japanese proficiency for certain company categories.',
    summary_jp: '2026年4月15日より一部の企業に対してN2以上の日本語能力が求められる新規定を含む、就労ビザの更新手続きに関する詳細ガイド。',
    content_md: content_md,
    content_md_en: content_md_en,
    content_md_jp: content_md_jp
  };

  const { data, error } = await supabase
    .from('administrative_guides')
    .update(payload)
    .eq('slug', 'gia-han-visa-ky-su')
    .select();

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('Successfully updated guide!', data[0].id);
  }
}

updateGuide();
