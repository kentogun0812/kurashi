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

const content_md = `# Hướng dẫn thủ tục xin nghỉ việc tại công ty Nhật Bản

Xin nghỉ việc (退職 - Taishoku) tại Nhật Bản đòi hỏi sự khéo léo trong giao tiếp và tuân thủ chặt chẽ các quy định hành chính để đảm bảo quyền lợi của người lao động cũng như giữ gìn mối quan hệ tốt đẹp với công ty cũ. Dưới đây là hướng dẫn chi tiết từng bước quy trình xin nghỉ việc chuẩn mực tại Nhật Bản.

---

## 1. Thời điểm thông báo nghỉ việc
Theo **Luật Tiêu chuẩn Lao động Nhật Bản**, người lao động có quyền nghỉ việc sau khi báo trước ít nhất **14 ngày**.
Tuy nhiên, quy định nội bộ của hầu hết các công ty Nhật (Nội quy lao động - 就業規則) thường yêu cầu phải báo trước từ **1 đến 3 tháng**.
*Lưu ý quan trọng: Bạn nên ưu tiên tuân thủ thời gian báo trước ghi trong Hợp đồng lao động hoặc Nội quy công ty để có đủ thời gian bàn giao công việc, tránh rắc rối pháp lý và kết thúc hợp đồng trong êm đẹp.*

---

## 2. Quy trình xin nghỉ việc chuẩn

### Bước 1: Trao đổi trực tiếp và nộp đơn
- **Gặp mặt trực tiếp:** Bạn hãy hẹn gặp riêng Quản lý trực tiếp (Tanto) hoặc Cấp trên (Joushi) để trao đổi. Hãy sử dụng những lý do mang tính cá nhân (hoàn cảnh gia đình, sức khỏe) hoặc định hướng phát triển nghề nghiệp. Tuyệt đối tránh nói xấu công ty hay phàn tự nàn về chế độ.
- **Nộp đơn xin nghỉ:**
  - **Taishoku Negai (退職願 - Đơn xin nghỉ việc):** Sử dụng khi bạn muốn *đề đạt nguyện vọng* nghỉ việc và muốn thảo luận/xin phép cấp trên về ngày nghỉ dự kiến. (Thường nộp trước 1-3 tháng).
  - **Taishoku Todoke (退職届 - Đơn thông báo nghỉ việc):** Sử dụng khi ngày nghỉ việc *đã được chốt dứt khoát* giữa bạn và công ty.
  *(Mẹo: Bạn nên tự viết tay đơn Taishoku Todoke theo đúng mẫu quy chuẩn hoặc mẫu riêng của công ty và bỏ vào phong bì trắng).*

### Bước 2: Bàn giao công việc và hoàn trả tài sản
- **Bàn giao (引継ぎ - Hikitsugi):** Lên danh sách chi tiết các công việc đang dang dở. Hướng dẫn trực tiếp cho người thay thế hoặc lập thành tài liệu bàn giao (Hikitsugi-sho) để công việc không bị gián đoạn.
- **Hoàn trả:** Vào ngày làm việc cuối cùng, bạn phải trả lại toàn bộ tài sản thuộc về công ty bao gồm: Thẻ nhân viên, đồng phục, máy tính/điện thoại công ty, tài liệu mật, danh thiếp khách hàng, v.v.

### Bước 3: Nhận các giấy tờ quan trọng từ công ty
Khi chấm dứt hợp đồng, công ty có nghĩa vụ cung cấp cho bạn các giấy tờ sau. Hãy kiểm tra kỹ để đảm bảo nhận đủ trước khi rời đi:
1. **Rishokuhyo (離職票 - Giấy xác nhận thôi việc):** Rất quan trọng để làm thủ tục nhận trợ cấp thất nghiệp.
2. **Nenkin Techo (年金手帳 - Sổ lương hưu):** (Hiện nay có thể quản lý qua mã số/thẻ điện tử).
3. **Koyo Hoken Hihokensha-sho (雇用保険被保険者証 - Thẻ bảo hiểm thất nghiệp).**
4. **Gensen Choshuhyo (源泉徴収票 - Giấy chứng nhận thu nhập và nộp thuế):** Dùng để làm thủ tục điều chỉnh thuế cuối năm hoặc nộp cho công ty mới.

---

## 3. Các thủ tục hành chính sau khi nghỉ việc
Là người lao động nước ngoài, bạn bắt buộc phải hoàn thành các thủ tục sau:
- **Khai báo với Cục Quản lý Xuất nhập cảnh (Nyukan):** Trong vòng **14 ngày** kể từ ngày nghỉ việc, bạn phải làm thủ tục "Khai báo liên quan đến cơ quan tiếp nhận" (所属機関に関する届出). Có thể thực hiện dễ dàng qua Hệ thống khai báo điện tử (e-Notification System).
- **Chuyển đổi Bảo hiểm Y tế & Nenkin:** Nếu chưa có công việc mới ngay lập tức, bạn phải mang giấy tờ đến Ủy ban quận/thành phố (Shiyakusho/Kuyakusho) để chuyển từ Bảo hiểm xã hội của công ty (Shakai Hoken) sang Bảo hiểm Quốc dân (Kokumin Kenko Hoken) và Quốc dân Nenkin.
- **Đăng ký Trợ cấp thất nghiệp:** Nếu bạn đã đóng bảo hiểm thất nghiệp trên 12 tháng, hãy mang Giấy xác nhận thôi việc (Rishokuhyo) đến Trung tâm Dịch vụ Việc làm Công (Hello Work) để làm hồ sơ nhận trợ cấp.

---
> [!WARNING]
> **Lưu ý Pháp lý bảo vệ Người lao động:**
> Công ty **không được phép** giam giữ các giấy tờ gốc của bạn (như Hộ chiếu, Thẻ ngoại kiều) hoặc cố tình không cấp Giấy xác nhận thôi việc (Rishokuhyo) nhằm làm khó dễ.
> Nếu công ty có dấu hiệu chèn ép hoặc vi phạm luật lao động, hãy mang hợp đồng đến **Cục Thanh tra Tiêu chuẩn Lao động (労働基準監督署 - Rodokijun Kantokusho)** tại địa phương để được bảo vệ quyền lợi hợp pháp.`;

const content_md_en = `# Guide to Resignation Procedures at Japanese Companies

Resigning (退職 - Taishoku) in Japan requires tactful communication and strict adherence to administrative rules to protect your rights and maintain a good relationship with your former employer. Below is a detailed step-by-step guide to the standard resignation process.

---

## 1. Timing Your Notice
According to the **Labor Standards Act of Japan**, employees have the right to resign by giving at least **14 days' notice**.
However, most internal company rules (就業規則 - Shugyo Kisoku) require a notice period of **1 to 3 months**.
*Important Note: You should prioritize following the notice period stated in your employment contract or company regulations. This ensures enough time for a proper handover, avoids legal disputes, and allows you to leave on good terms.*

---

## 2. Standard Resignation Process

### Step 1: Face-to-Face Discussion and Submitting the Notice
- **In-Person Meeting:** Schedule a private meeting with your direct manager (Tanto) or supervisor (Joushi). Use personal reasons (family situation, health) or career development as your reason for leaving. Strictly avoid badmouthing the company or complaining about conditions.
- **Submitting the Notice:**
  - **Taishoku Negai (退職願 - Letter of Resignation Request):** Used when you want to *express your desire* to resign and discuss/request approval for your expected last day. (Usually submitted 1-3 months in advance).
  - **Taishoku Todoke (退職届 - Notice of Resignation):** Used to officially notify the company *after the final date has been firmly decided*.
  *(Tip: It is highly recommended to handwrite the Taishoku Todoke using the standard format or company-specific template and present it in a plain white envelope).*

### Step 2: Handover and Returning Company Property
- **Handover (引継ぎ - Hikitsugi):** Create a detailed list of pending tasks. Provide direct training to your successor or create a comprehensive handover document (Hikitsugi-sho) to prevent workflow disruptions.
- **Returning Items:** On your final working day, you must return all company property, including: Employee ID card, uniform, company computer/phone, confidential documents, client business cards, etc.

### Step 3: Receive Essential Documents from the Company
Upon termination of your contract, the company is obligated to provide you with several important documents. Ensure you receive them before moving on:
1. **Rishokuhyo (離職票 - Letter of Separation):** Crucial for applying for unemployment benefits.
2. **Nenkin Techo (年金手帳 - Pension Book):** (Now often managed via a digital ID/card).
3. **Koyo Hoken Hihokensha-sho (雇用保険被保険者証 - Employment Insurance Card).**
4. **Gensen Choshuhyo (源泉徴収票 - Certificate of Income and Withholding Tax):** Required for year-end tax adjustments or for your new employer.

---

## 3. Administrative Procedures After Resigning
As a foreign worker, you are required to complete the following:
- **Notify Immigration (Nyukan):** Within **14 days** of your resignation, you must submit a "Notification Concerning the Accepting Organization" (所属機関に関する届出). This can be easily done via the e-Notification System online.
- **Switch Health Insurance & Pension:** If you do not have a new job lined up immediately, visit your local municipal office (Shiyakusho/Kuyakusho) to switch from the company’s Social Insurance (Shakai Hoken) to the National Health Insurance (Kokumin Kenko Hoken) and National Pension.
- **Apply for Unemployment Benefits:** If you have paid into employment insurance for over 12 months, bring your Rishokuhyo to the public employment office (Hello Work) to apply for benefits.

---
> [!WARNING]
> **Legal Protection for Workers:**
> The company is **strictly prohibited** from withholding your original personal documents (such as your Passport or Residence Card) or deliberately refusing to issue your Letter of Separation (Rishokuhyo) to make things difficult for you.
> If you experience workplace harassment regarding your resignation or suspect labor law violations, bring your contract to the local **Labor Standards Inspection Office (労働基準監督署 - Rodokijun Kantokusho)** for legal protection.`;

const content_md_jp = `# 日本の企業での退職手続きガイド

日本での退職（Taishoku）は、自身の労働者の権利を守るだけでなく、会社との良好な関係を保つために、慎重なコミュニケーションと厳格な手続きの遵守が求められます。以下は、一般的な退職手続きの詳しいステップです。

---

## 1. 退職を申し出るタイミング
**労働基準法**によれば、労働者は少なくとも**14日前**に退職を申し出ることで辞める権利があります。
しかし、多くの会社の就業規則では、**1ヶ月から3ヶ月前**の申し出を義務付けています。
*重要な注意点：引き継ぎの時間を十分に確保し、法的なトラブルを避け、円満に退社するためにも、雇用契約書や就業規則に記載されている通知期間を優先して遵守することをお勧めします。*

---

## 2. 退職手続きの基本的な流れ

### ステップ1：直接の相談と退職願/退職届の提出
- **直接の面談：** まずは直属の担当者（Tanto）や上司（Joushi）に個別の面談を申し込みます。退職理由は「一身上の都合（家庭の事情や健康など）」や「キャリアアップ」とし、会社への不満や批判は絶対に避けましょう。
- **書類の提出：**
  - **退職願（Taishoku Negai）：** 退職の*希望を伝え*、退職予定日について上司と相談・承認を得るための書類です。（通常1〜3ヶ月前に提出）。
  - **退職届（Taishoku Todoke）：** 退職日が*確定した後*、会社に対する正式な通告として提出する書類です。
  *（アドバイス：退職届は、規定のフォーマットまたは会社の指定用紙に手書きし、無地の白い封筒に入れて提出するのがマナーです）。*

### ステップ2：業務の引き継ぎと備品の返却
- **引き継ぎ（Hikitsugi）：** 進行中の業務リストを作成します。後任者に直接指導するか、業務が滞らないように詳細な引き継ぎ書（Hikitsugi-sho）を作成します。
- **備品の返却：** 最終出勤日には、社員証、制服、会社貸与のPCや携帯電話、機密書類、顧客の名刺など、会社に属するすべての物品を返却しなければなりません。

### ステップ3：会社から重要な書類を受け取る
契約終了時、会社は以下の書類を提供する義務があります。退社する前に必ず受け取ったか確認してください：
1. **離職票（Rishokuhyo）：** 失業保険（雇用保険の基本手当）の手続きに非常に重要な書類です。
2. **年金手帳（Nenkin Techo）：** （現在は基礎年金番号通知書やマイナンバーで管理されることもあります）。
3. **雇用保険被保険者証（Koyo Hoken Hihokensha-sho）。**
4. **源泉徴収票（Gensen Choshuhyo）：** 年末調整や、次の転職先へ提出するために必要です。

---

## 3. 退職後の公的手続き
外国人労働者として、以下の手続きを必ず完了させる必要があります：
- **出入国在留管理庁（入管）への届出：** 退職日から**14日以内**に「所属機関に関する届出」を行わなければなりません。これは入管の電子届出システム（e-Notification System）から簡単に手続きできます。
- **健康保険と年金の切り替え：** すぐに次の就職先が決まっていない場合は、市役所・区役所へ行き、会社の社会保険（Shakai Hoken）から国民健康保険（Kokumin Kenko Hoken）および国民年金への切り替え手続きを行ってください。
- **失業保険の申請：** 雇用保険に12ヶ月以上加入している場合、離職票をハローワークに持参し、失業手当の給付申請を行うことができます。

---
> [!WARNING]
> **労働者を守る法的保護：**
> 会社が嫌がらせ目的で、労働者の個人的な原本書類（パスポートや在留カードなど）を保留したり、**離職票**の発行を故意に拒否したりすることは**法律で厳しく禁じられています**。
> もし退職に関して不当な圧力を受けたり、労働基準法違反の疑いがある場合は、すぐに雇用契約書を持参して地元の**労働基準監督署（Rodokijun Kantokusho）**に相談し、法的保護を求めてください。`;

async function updateResignationGuide() {
  console.log('Starting resignation guide update...');
  
  const payload = {
    slug: 'resignation-procedure',
    title: 'Thủ tục xin nghỉ việc tại công ty Nhật Bản',
    title_en: 'Guide to Resignation Procedures at Japanese Companies',
    title_jp: '日本の企業での退職手続きガイド',
    summary: 'Quy trình chuẩn mực và các thủ tục hành chính bắt buộc khi xin nghỉ việc tại Nhật Bản để đảm bảo quyền lợi cho người lao động nước ngoài.',
    summary_en: 'A standard process and mandatory administrative procedures when resigning in Japan to ensure the rights of foreign workers.',
    summary_jp: '外国人労働者の権利を確保するための、日本での退職時の標準的なプロセスと必須の行政手続き。',
    content_md: content_md,
    content_md_en: content_md_en,
    content_md_jp: content_md_jp
  };

  const { data, error } = await supabase
    .from('administrative_guides')
    .update(payload)
    .eq('slug', 'xin-nghi-viec-safe')
    .select();

  if (error) {
    console.error('Error updating resignation guide:', error);
  } else {
    console.log('Successfully updated resignation guide!', data?.[0]?.id);
  }
}

updateResignationGuide();
