import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role to bypass RLS for seeding if needed, or anon since guides are read-only public but we are writing here!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars')
  process.exit(1)
}

// Create client with service role to allow writes
const supabase = createClient(supabaseUrl, supabaseKey)

const guides = [
  {
    title: 'Gia hạn Visa Kỹ sư / Nhân văn / Tri thức quốc tế',
    slug: 'gia-han-visa-ky-su',
    category: 'visa',
    summary: 'Hướng dẫn chi tiết quy trình chuẩn bị hồ sơ và nộp hồ sơ xin gia hạn visa lao động tại Cục Quản lý Xuất nhập cảnh Nhật Bản.',
    content_md: `## Giới thiệu chung về Gia hạn Visa lao động

Đối với người nước ngoài đang làm việc tại Nhật Bản dưới tư cách lưu trú **"Kỹ thuật - Tri thức nhân văn - Nghiệp vụ quốc tế" (技術・人文知識・国際業務)**, việc gia hạn visa (tức là đăng ký thay đổi thời hạn lưu trú) là thủ tục bắt buộc để tiếp tục sinh sống và làm việc hợp pháp tại Nhật. 

Thủ tục này thường có thể được tiến hành từ **3 tháng trước khi visa hiện tại hết hạn**. Khuyên khích bạn nên chuẩn bị hồ sơ và nộp càng sớm càng tốt để tránh rủi ro quá hạn lưu trú.

---

## Hồ sơ cần chuẩn bị

Để gia hạn visa thành công, bạn cần sự phối hợp giữa bản thân bạn và phía công ty tiếp nhận. Dưới đây là danh mục hồ sơ chi tiết.

### 1. Giấy tờ cá nhân (Bạn tự chuẩn bị)
- **Đơn xin gia hạn thời hạn lưu trú (Application for Extension of Period of Stay)**: Phần dành cho người xin gia hạn (Trang 1, 2, 3).
- **Ảnh thẻ (3x4 cm)**: Chụp trong vòng 3 tháng gần nhất, ghi rõ họ tên sau ảnh và dán vào đơn.
- **Hộ chiếu (Passport)** & **Thẻ ngoại kiều (Zairyu Card)**: Bản gốc để đối chiếu.
- **Giấy chứng nhận đóng thuế (Nozei Shomeisho)** & **Giấy chứng nhận thu nhập thuế (Kazei Shomeisho)**: Của 1 năm gần nhất (xin tại Shyakusho địa phương).
- **Bản sao hợp đồng lao động** hoặc **Giấy chứng nhận đang làm việc (Zaishoku Shomeisho)** do công ty cấp.

### 2. Giấy tờ từ phía công ty (Công ty chuẩn bị)
- **Đơn xin gia hạn thời hạn lưu trú**: Phần dành cho tổ chức tiếp nhận (Trang 4, 5).
- **Bản sao Báo cáo quyết toán tài chính** của năm gần nhất (Gyomu Hokokusho).
- **Giấy tờ chứng minh quy mô công ty** (Tùy thuộc vào phân loại công ty từ Nhóm 1 đến Nhóm 4). Ví dụ: Bản sao danh sách nộp thuế, chứng nhận niêm yết trên sàn chứng khoán, v.v.

---

## Quy trình thực hiện cụ thể

Quy trình nộp hồ sơ gia hạn visa gồm các bước cơ bản sau đây.`,
    steps: [
      {
        step_number: 1,
        title: 'Thu thập giấy tờ cá nhân',
        description: 'Tải mẫu đơn xin gia hạn visa từ trang web của Cục Xuất Nhập Cảnh và điền đầy đủ thông tin cá nhân ở các trang từ 1 đến 3. Đến Shyakusho (Uỷ ban quận) gần nhất để xin Giấy chứng nhận thuế (Kazei/Nozei Shomeisho).',
        required_documents: ['Đơn xin gia hạn (Trang 1-3)', 'Ảnh thẻ 3x4', 'Zairyu Card', 'Hộ chiếu', 'Giấy chứng nhận thuế']
      },
      {
        step_number: 2,
        title: 'Yêu cầu công ty chuẩn bị hồ sơ doanh nghiệp',
        description: 'Gửi yêu cầu cho bộ phận Nhân sự (HR) của công ty để họ điền thông tin vào các trang 4 và 5 của đơn xin gia hạn, đồng thời cung cấp Giấy chứng nhận đang làm việc (Zaishoku Shomeisho) và tài liệu tài chính của công ty.',
        required_documents: ['Đơn xin gia hạn (Trang 4-5)', 'Zaishoku Shomeisho', 'Báo cáo tài chính công ty hoặc tài liệu nhóm công ty']
      },
      {
        step_number: 3,
        title: 'Nộp hồ sơ tại Cục Quản lý Xuất nhập cảnh (Nyukan)',
        description: 'Đến trực tiếp Nyukan quản lý khu vực bạn sinh sống để nộp hồ sơ, hoặc thực hiện nộp trực tuyến (Online) nếu bạn hoặc công ty có tài khoản đăng ký hệ thống nộp đơn trực tuyến. Sau khi nộp, bạn sẽ nhận được một phiếu hẹn (Application Receipt Seal) dán sau thẻ ngoại kiều.',
        required_documents: ['Toàn bộ bộ hồ sơ đã chuẩn bị', 'Hộ chiếu gốc', 'Thẻ ngoại kiều gốc']
      },
      {
        step_number: 4,
        title: 'Nhận kết quả và cập nhật thẻ ngoại kiều mới',
        description: 'Khi có kết quả (thông thường từ 2 tuần đến 2 tháng), Nyukan sẽ gửi bưu thiếp (hagaki) thông báo về địa chỉ nhà bạn. Hãy mang bưu thiếp này, hộ chiếu, thẻ ngoại kiều cũ và tem doanh thu (Shunyu Inshi) trị giá 4,000 Yên (mua tại bưu điện hoặc FamilyMart ở Nyukan) đến Nyukan để nhận thẻ ngoại kiều mới.',
        required_documents: ['Bưu thiếp thông báo kết quả', 'Hộ chiếu gốc', 'Thẻ ngoại kiều cũ', 'Tem doanh thu 4,000 Yên']
      }
    ]
  },
  {
    title: 'Thủ tục chuyển nhà (Tenshutsu & Tennyu)',
    slug: 'thu-tuc-chuyen-nha',
    category: 'moving',
    summary: 'Quy trình khai báo chuyển đi (Tenshutsu-todoke) và chuyển đến (Tennyu-todoke) tại Shyakusho (Quận/Thị xã) khi thay đổi chỗ ở.',
    content_md: `## Tổng quan thủ tục thay đổi nơi cư trú tại Nhật Bản

Khi bạn thay đổi địa chỉ sinh sống tại Nhật Bản (cho dù chuyển cùng quận hay khác quận/tỉnh thành), việc khai báo địa chỉ mới với chính quyền địa phương là bắt buộc theo luật pháp Nhật Bản. 

Thủ tục này phải được hoàn tất **trong vòng 14 ngày** kể từ ngày bạn dọn vào nhà mới. Nếu không tuân thủ, bạn có thể bị phạt hành chính hoặc gặp rắc rối trong việc gia hạn visa sau này do thông tin địa chỉ trên thẻ ngoại kiều không đồng nhất với thực tế.

---

## Các loại thủ tục tương ứng

Tùy vào điểm đi và điểm đến, bạn sẽ làm các thủ tục khác nhau:
1. **Chuyển đi khác Thành phố/Quận (Khác Shyakusho)**: Phải làm thủ tục chuyển đi (Tenshutsu) tại nơi cũ để lấy **Giấy chứng nhận chuyển đi (Tenshutsu Shomeisho)**, sau đó làm thủ tục chuyển đến (Tennyu) tại nơi mới.
2. **Chuyển nhà trong cùng Thành phố/Quận (Cùng Shyakusho)**: Chỉ cần làm thủ tục thay đổi địa chỉ (Tenkyo-todoke) tại Shyakusho một lần duy nhất.

---

## Chi tiết các bước thực hiện`,
    steps: [
      {
        step_number: 1,
        title: 'Làm thủ tục chuyển đi (Tenshutsu-todoke) tại quận cũ',
        description: 'Trước khi chuyển nhà khoảng 14 ngày (hoặc sau khi chuyển tối đa 14 ngày), đến Shyakusho quản lý địa chỉ cũ để làm thủ tục khai báo chuyển đi. Bạn sẽ nhận được giấy Tenshutsu Shomeisho (Giấy chứng nhận chuyển đi). Thủ tục này hoàn toàn miễn phí.',
        required_documents: ['Thẻ ngoại kiều', 'Con dấu (nếu có)', 'Hộ chiếu (để đề phòng)', 'Giấy tờ bảo hiểm y tế quốc dân (nếu có)']
      },
      {
        step_number: 2,
        title: 'Làm thủ tục chuyển đến (Tennyu-todoke) tại quận mới',
        description: 'Trong vòng 14 ngày kể từ khi dọn vào nhà mới, mang theo Giấy chứng nhận chuyển đi (Tenshutsu Shomeisho) nhận được ở Bước 1 đến Shyakusho quản lý khu vực mới để làm thủ tục đăng ký địa chỉ mới.',
        required_documents: ['Giấy chứng nhận chuyển đi (Tenshutsu Shomeisho)', 'Thẻ ngoại kiều của tất cả thành viên chuyển nhà', 'Thẻ My Number', 'Hợp đồng thuê nhà mới (để đối chiếu địa chỉ chính xác)']
      },
      {
        step_number: 3,
        title: 'Cập nhật địa chỉ trên thẻ My Number và thẻ ngoại kiều',
        description: 'Nhân viên Shyakusho sẽ in địa chỉ mới vào mặt sau của thẻ ngoại kiều và cập nhật chip điện tử trên thẻ My Number của bạn. Bạn sẽ được yêu cầu nhập mã PIN thẻ My Number để cập nhật thông tin địa chỉ mới.',
        required_documents: ['Thẻ ngoại kiều', 'Thẻ My Number (kèm mã PIN)']
      },
      {
        step_number: 4,
        title: 'Đăng ký chuyển tiếp bưu phẩm (Ten-to Service)',
        description: 'Đến bưu điện gần nhất hoặc đăng ký online dịch vụ chuyển tiếp bưu phẩm của Japan Post. Bưu điện sẽ miễn phí chuyển tiếp toàn bộ thư từ gửi đến địa chỉ cũ của bạn về địa chỉ mới trong vòng 1 năm.',
        required_documents: ['Thẻ ngoại kiều (đã cập nhật địa chỉ mới)', 'Đơn xin chuyển tiếp bưu điện (điền tại quầy bưu điện hoặc online)']
      }
    ]
  },
  {
    title: 'Xin nghỉ việc tại công ty Nhật Bản đúng luật',
    slug: 'xin-nghi-viec-safe',
    category: 'working',
    summary: 'Quy trình xin thôi việc đúng luật lao động Nhật Bản, bàn giao công việc êm thấm và nhận đầy đủ giấy tờ cần thiết.',
    content_md: `## Quy định pháp lý về việc thôi việc tại Nhật Bản

Theo Luật Lao động Nhật Bản, người lao động có quyền xin nghỉ việc bằng cách thông báo trước cho người sử dụng lao động. Thời hạn thông báo tối thiểu theo luật dân sự là **14 ngày trước ngày nghỉ dự kiến** (đối với hợp đồng không xác định thời hạn). 

Tuy nhiên, hầu hết các công ty Nhật Bản đều có nội quy lao động (Shugyo Kisoku) yêu cầu thông báo trước **1 tháng** hoặc **2 tháng** để công ty kịp sắp xếp người thay thế và bàn giao công việc. Hãy cư xử chuyên nghiệp bằng cách tuân thủ thời hạn này để giữ mối quan hệ tốt đẹp với công ty cũ.

---

## Các loại giấy tờ cần nhận lại từ công ty cũ

Khi nghỉ việc, bạn bắt buộc phải nhận lại các giấy tờ sau để làm thủ tục chuyển việc hoặc xin trợ cấp thất nghiệp:
1. **Giấy chứng nhận nghỉ việc (Risho-hyo - 離職票)**: Cần để xin trợ cấp thất nghiệp tại Hello Work.
2. **Tờ khai khấu trừ thuế thu nhập (Gensen Choshu-hyo - 源泉徴収票)**: Cần để nộp cho công ty mới làm thủ tục điều chỉnh thuế cuối năm (Nenmatsu Chousen).
3. **Sổ Nenkin (Bản gốc)** nếu công ty giữ.
4. **Giấy chứng nhận bảo hiểm xã hội thôi việc (Shakai Hoken Soshitsu Shomeisho)** nếu bạn cần chuyển sang bảo hiểm quốc dân tạm thời.`,
    steps: [
      {
        step_number: 1,
        title: 'Thông báo ý định nghỉ việc cho cấp trên trực tiếp',
        description: 'Hẹn một buổi nói chuyện riêng với sếp trực tiếp (chứ không nói qua tin nhắn hay email) trước ngày nghỉ dự kiến khoảng 1-2 tháng. Trình bày lý do nghỉ việc một cách khéo léo (ví dụ: muốn thử thách ở môi trường mới, lý do cá nhân/gia đình), tránh chỉ trích công ty.',
        required_documents: []
      },
      {
        step_number: 2,
        title: 'Nộp Đơn xin thôi việc (Taishoku-todoke)',
        description: 'Sau khi đã thống nhất được ngày nghỉ chính thức với sếp, bạn viết và nộp Đơn xin thôi việc chính thức (Taishoku-todoke hoặc Taishoku-gai). Đơn này cần ghi rõ ngày nộp đơn, ngày nghỉ việc chính thức, ký tên và đóng dấu cá nhân.',
        required_documents: ['Đơn xin thôi việc (Taishoku-todoke)']
      },
      {
        step_number: 3,
        title: 'Bàn giao công việc và trả lại tài sản công ty',
        description: 'Thực hiện bàn giao công việc chi tiết bằng văn bản hoặc hướng dẫn trực tiếp cho đồng nghiệp tiếp quản. Trả lại toàn bộ đồ dùng của công ty như máy tính, thẻ nhân viên, điện thoại công việc, danh thiếp của đối tác, bảo hiểm y tế shakai hoken cũ.',
        required_documents: ['Tài liệu bàn giao', 'Thẻ bảo hiểm y tế cũ (để trả lại công ty)', 'Thiết bị và tài sản của công ty']
      },
      {
        step_number: 4,
        title: 'Nhận các giấy tờ bàn giao và hoàn tất thuế/bảo hiểm',
        description: 'Sau khi nghỉ việc khoảng 1-2 tuần, công ty cũ sẽ gửi các giấy tờ như Gensen Choshu-hyo và Risho-hyo qua bưu điện về nhà bạn. Hãy giữ kỹ chúng để nộp cho công ty mới hoặc nộp lên Hello Work.',
        required_documents: ['Risho-hyo (nhận từ công ty cũ)', 'Gensen Choshu-hyo (nhận từ công ty cũ)']
      }
    ]
  },
  {
    title: 'Thủ tục đăng ký kết hôn tại Nhật Bản',
    slug: 'dang-ky-ket-hon',
    category: 'marriage',
    summary: 'Hướng dẫn thực hiện đăng ký kết hôn pháp lý tại Nhật Bản dành cho công dân Việt Nam kết hôn với nhau hoặc kết hôn với người Nhật.',
    content_md: `## Tổng quan về Đăng ký kết hôn tại Nhật

Công dân Việt Nam cư trú tại Nhật Bản có thể thực hiện thủ tục đăng ký kết hôn theo pháp luật Nhật Bản tại Cơ quan hành chính Nhật Bản (Shyakusho - Uỷ ban quận/thành phố) trước, sau đó thực hiện thủ tục trích lục hộ tịch tại Đại sứ quán Việt Nam để được pháp luật Việt Nam công nhận.

Thủ tục này đòi hỏi việc chuẩn bị đầy đủ các giấy tờ chứng minh tình trạng hôn nhân độc thân của cả hai bên để tránh việc kết hôn nhiều lần hoặc vi phạm luật hôn nhân gia đình.

---

## Hồ sơ cần chuẩn bị tại Đại sứ quán Việt Nam
Để xin được **Giấy đủ điều kiện kết hôn** (Giấy chứng nhận độc thân) từ Đại sứ quán Việt Nam tại Nhật Bản, bạn cần nộp các giấy tờ chứng minh từ Việt Nam.`,
    steps: [
      {
        step_number: 1,
        title: 'Xin Giấy xác nhận tình trạng hôn nhân từ Việt Nam',
        description: 'Yêu cầu người nhà ở Việt Nam đến UBND xã/phường nơi bạn đăng ký hộ khẩu thường trú trước khi sang Nhật để xin "Giấy xác nhận tình trạng hôn nhân" (Mục đích ghi rõ: Để làm thủ tục kết hôn tại Nhật Bản). Giấy này có thời hạn 6 tháng kể từ ngày cấp.',
        required_documents: ['Giấy xác nhận tình trạng hôn nhân độc thân (bản gốc)']
      },
      {
        step_number: 2,
        title: 'Xin Giấy đủ điều kiện kết hôn tại Đại sứ quán Việt Nam tại Nhật Bản',
        description: 'Mang Giấy xác nhận tình trạng hôn nhân từ Việt Nam, hộ chiếu, thẻ ngoại kiều đến Đại sứ quán hoặc Lãnh sự quán Việt Nam tại Nhật Bản để xin cấp "Giấy đủ điều kiện kết hôn" (bản tiếng Nhật hoặc dịch thuật công chứng).',
        required_documents: ['Giấy xác nhận tình trạng hôn nhân từ VN', 'Hộ chiếu & Thẻ ngoại kiều', 'Tờ khai xin cấp giấy chứng nhận (điền tại Đại sứ quán)']
      },
      {
        step_number: 3,
        title: 'Nộp tờ khai kết hôn (Kon-in Todoke) tại Shyakusho',
        description: 'Đến Shyakusho nơi bạn đang cư trú tại Nhật Bản để nộp Tờ khai đăng ký kết hôn (婚姻届 - Kon-in Todoke). Tờ khai này cần chữ ký xác nhận của 2 người làm chứng (trên 20 tuổi). Shyakusho sẽ kiểm tra hồ sơ và cấp cho bạn Giấy thụ lý kết hôn (Kon-in Todoke Juri Shomeisho).',
        required_documents: ['Tờ khai kết hôn Kon-in Todoke', 'Giấy đủ điều kiện kết hôn (Embassy cấp)', 'Thẻ ngoại kiều & Hộ chiếu của 2 bên', 'Bản dịch tiếng Nhật các giấy tờ tiếng Việt']
      },
      {
        step_number: 4,
        title: 'Báo cáo kết hôn lên Đại sứ quán Việt Nam',
        description: 'Để cuộc hôn nhân được công nhận hợp pháp tại Việt Nam, mang Giấy thụ lý kết hôn (Juri Shomeisho) do Shyakusho cấp đến Đại sứ quán Việt Nam tại Nhật Bản để làm thủ tục Ghi chú kết hôn và nhận Trích lục kết hôn Việt Nam.',
        required_documents: ['Giấy thụ lý kết hôn (Kon-in Todoke Juri Shomeisho) bản gốc', 'Bản dịch tiếng Việt của Juri Shomeisho', 'Hộ chiếu và thẻ ngoại kiều của hai vợ chồng']
      }
    ]
  },
  {
    title: 'Đăng ký mở tài khoản ngân hàng bưu điện Yucho',
    slug: 'mo-tai-khoan-yucho',
    category: 'daily_life',
    summary: 'Quy trình chi tiết đăng ký mở tài khoản ngân hàng bưu điện (Yucho Bank) - ngân hàng dễ đăng ký và phổ biến nhất đối với người nước ngoài mới sang Nhật Bản.',
    content_md: `## Tại sao nên chọn ngân hàng Yucho Bank?

Ngân hàng Bưu điện Nhật Bản (Yucho Bank / ゆうちょ銀行) là ngân hàng phổ biến nhất tại Nhật Bản với hệ thống ATM có mặt ở hầu hết các bưu điện và cửa hàng tiện lợi trên toàn quốc. 

Đặc biệt, Yucho Bank nổi tiếng là ngân hàng thân thiện nhất với người nước ngoài mới đặt chân đến Nhật (du học sinh, thực tập sinh, kỹ sư mới sang), do họ có chính sách mở tài khoản linh hoạt hơn so với các ngân hàng lớn khác như MUFG hay SMBC (vốn thường yêu cầu người nước ngoài phải ở Nhật trên 6 tháng mới được mở tài khoản thông thường).

---

## Điều kiện và lưu ý khi mở tài khoản
- **Đã đăng ký địa chỉ cư trú**: Thẻ ngoại kiều của bạn bắt buộc phải có địa chỉ in ở mặt sau (đã đăng ký tại Shyakusho).
- **Số điện thoại tại Nhật**: Bạn cần có một số điện thoại liên lạc được tại Nhật Bản để nhận thông báo và xác thực tài khoản.`,
    steps: [
      {
        step_number: 1,
        title: 'Chuẩn bị đầy đủ giấy tờ cần thiết',
        description: 'Trước khi đến bưu điện, hãy kiểm tra và chuẩn bị đầy đủ các giấy tờ tùy thân. Hãy mang theo con dấu cá nhân (inkan) nếu bạn đã làm, nếu chưa có bạn có thể đăng ký bằng chữ ký tay.',
        required_documents: ['Thẻ ngoại kiều (đã đăng ký địa chỉ ở mặt sau)', 'Hộ chiếu còn hạn', 'Con dấu cá nhân hoặc bút viết để ký', 'Số điện thoại tại Nhật']
      },
      {
        step_number: 2,
        title: 'Đến chi nhánh bưu điện gần nơi cư trú hoặc làm việc',
        description: 'Yucho Bank thường yêu cầu bạn mở tài khoản tại bưu điện gần nhà hoặc gần công ty/trường học của bạn nhất. Đến quầy dịch vụ tài chính (thường có màu xanh lá cây) và nói với nhân viên: "Kouza wo tsukuritai desu" (Tôi muốn mở tài khoản).',
        required_documents: []
      },
      {
        step_number: 3,
        title: 'Điền đơn đăng ký mở tài khoản (Kouza Kaisetsu Shinseisho)',
        description: 'Nhân viên bưu điện sẽ đưa cho bạn một tờ khai. Điền đầy đủ thông tin cá nhân bao gồm: Họ tên (viết chữ in hoa không dấu giống hộ chiếu và katakana), ngày tháng năm sinh, địa chỉ nhà chính xác, mã pin 4 số tự chọn cho thẻ rút tiền.',
        required_documents: ['Đơn đăng ký (điền tại quầy)']
      },
      {
        step_number: 4,
        title: 'Nhận sổ ngân hàng và chờ thẻ rút tiền gửi về nhà',
        description: 'Sau khi xử lý hồ sơ (khoảng 30 phút), nhân viên sẽ cấp cho bạn Sổ tài khoản ngân hàng (Tsuucho) ngay lập tức. Thẻ ATM vật lý (Cash card) sẽ được gửi qua đường bưu điện bảo đảm về địa chỉ nhà bạn sau 1 đến 2 tuần.',
        required_documents: []
      }
    ]
  }
]

async function seed() {
  console.log('Starting seed...')
  
  // 1. Clear existing guides (which cascade deletes steps)
  console.log('Clearing existing administrative guides...')
  const { error: deleteError } = await supabase
    .from('administrative_guides')
    .delete()
    .neq('slug', 'keep-alive-non-existent') // delete all rows
    
  if (deleteError) {
    console.error('Error clearing guides:', deleteError)
    process.exit(1)
  }
  
  console.log('Seeding guides...')
  for (const guide of guides) {
    const { title, slug, category, summary, content_md, steps } = guide
    
    // Insert guide
    const { data: guideData, error: guideError } = await supabase
      .from('administrative_guides')
      .insert({ title, slug, category, summary, content_md })
      .select('id')
      .single()
      
    if (guideError || !guideData) {
      console.error(`Error inserting guide ${title}:`, guideError)
      continue
    }
    
    const guideId = guideData.id
    console.log(`Inserted guide: ${title} (ID: ${guideId})`)
    
    // Insert steps
    const stepsToInsert = steps.map(step => ({
      guide_id: guideId,
      step_number: step.step_number,
      title: step.title,
      description: step.description,
      required_documents: step.required_documents
    }))
    
    const { error: stepsError } = await supabase
      .from('administrative_steps')
      .insert(stepsToInsert)
      
    if (stepsError) {
      console.error(`Error inserting steps for guide ${title}:`, stepsError)
    } else {
      console.log(`Inserted ${stepsToInsert.length} steps for guide: ${title}`)
    }
  }
  
  console.log('Seeding completed successfully!')
  process.exit(0)
}

seed().catch(err => {
  console.error('Seed failed unexpectedly:', err)
  process.exit(1)
})
