# Tài Liệu Phân Tích Nghiệp Vụ (Business Analysis Document) - Dự án Kurashi

**Ngày cập nhật:** 12/04/2026
**Dự án:** Kurashi
**Loại hình:** Web Single Page Application (SPA)

---

## 1. Tóm tắt điều hành (Executive Summary)

**Kurashi** là dự án phát triển Web Single Page Application (SPA) nhằm xây dựng một hệ sinh thái toàn diện dành riêng cho cộng đồng người Việt Nam đang sống, làm việc và học tập tại Nhật Bản. Sứ mệnh của dự án là trở thành "cầu nối" đắc lực, hỗ trợ người dùng vượt qua rào cản ngôn ngữ và văn hóa thông qua 3 trụ cột chính:
1. Cung cấp thông tin và hướng dẫn thủ tục hành chính chính xác, ứng dụng AI.
2. Xây dựng không gian kết nối cộng đồng và theo dõi sự kiện địa phương.
3. Nền tảng chia sẻ, mua bán và trao đổi đồ cũ giữa những người dùng an toàn, tiện lợi.

Với định hướng phát triển tối ưu cho thiết bị di động (Mobile-first) và ứng dụng mạnh mẽ Cloud AI, Kurashi kỳ vọng sẽ tạo ra những trải nghiệm mượt mà, tiện ích và gắn kết sâu sắc cộng đồng người Việt tại Nhật.

---

## 2. Đối tượng mục tiêu & Chân dung người dùng (Target Audience & User Personas)

### 2.1. Đối tượng mục tiêu
- **Thực tập sinh kỹ năng & Kỹ năng đặc định (Tokutei Ginou):** Những người có nhu cầu lớn về tìm kiếm thông tin hành chính cơ bản, mua đồ cũ giá rẻ và tham gia cộng đồng giải trí.
- **Kỹ sư / Nhân viên văn phòng (Shain):** Những người cần thông tin chuyên sâu (thuế, visa, bảo hiểm) và kết nối giao thương rộng rãi.
- **Du học sinh:** Có nhu cầu tìm kiếm hội nhóm, việc làm thêm, và kết bạn.

### 2.2. Chân dung người dùng (User Personas)

| Tiêu chí | Persona 1: Thực tập sinh mới sang | Persona 2: Kỹ sư lâu năm |
| :--- | :--- | :--- |
| **Độ tuổi** | 18 - 25 | 25 - 35 |
| **Tiếng Nhật** | N5 - N4 (Cơ bản) | N2 - N1 (Thành thạo) |
| **Nhu cầu chính** | Hướng dẫn làm giấy tờ từ A-Z, mua đồ gia dụng rẻ, tìm hội đồng hương. | Đổi visa, khai thuế, thanh lý đồ dọn nhà, networking chuyên môn. |
| **Nỗi đau (Pain points)** | Rào cản ngôn ngữ khi làm việc với Kuyakusho, sợ bị lừa khi mua đồ, khó tìm thông tin chính thống. | Quá bận rộn không có thời gian tra cứu thủ tục, rủi ro lừa đảo khi giao dịch C2C. |

---

## 3. Tài liệu Yêu cầu Chức năng (Functional Requirements Document - FRD)

### 3.1. Phân hệ Thủ tục hành chính (Administrative Hub)

Là "trái tim" cung cấp thông tin pháp lý và hành chính với sự hỗ trợ của AI.

| Tính năng cốt lõi | Mô tả chi tiết |
| :--- | :--- |
| **Danh mục thủ tục** | Bao gồm: Đăng ký kết hôn, Xin nghỉ việc (Taishoku), Chuyển nhà (Tenshutsu/Tennyu), Đổi Visa, Bảo hiểm, Thuế. |
| **Hướng dẫn Step-by-step** | Giao diện dạng Timeline/Stepper trực quan, liệt kê chi tiết: Danh sách giấy tờ cần chuẩn bị; Địa chỉ cơ quan (Kuyakusho, Nhập quản, Đại sứ quán) được tích hợp bản đồ. |
| **Tích hợp Chatbot AI (LLM)** | Hỗ trợ 24/7 giải đáp thắc mắc về các thủ tục pháp lý. <br/> - **Nguồn dữ liệu:** Dựa trên database pháp luật hiện hành và các quy định hành chính cập nhật. <br/> - **Hỗ trợ biểu mẫu:** Hỗ trợ dịch thuật và hướng dẫn điền form xin visa, tờ khai hành chính. |

### 3.2. Phân hệ Sự kiện & Cộng đồng (Events & Networking)

Nền tảng kết nối offline thông qua các sự kiện trực tuyến.

| Tính năng cốt lõi | Mô tả chi tiết |
| :--- | :--- |
| **Khám phá sự kiện** | Hệ thống tự động thu thập và trình bày các thông tin sự kiện liên quan: Lễ hội (Matsuri), Giao lưu văn hóa, Ngày hội việc làm (Job Fair). |
| **Event Groups** | Người dùng có thể chủ động tạo các nhóm ảo ("Event Group") gắn liền với một sự kiện có sẵn hoặc tự tổ chức. |
| **Quản lý nhóm** | Cơ chế xin/duyệt tham gia hoặc rời nhóm một cách linh hoạt. |
| **Bảng tin thảo luận** | Tích hợp forum/chat nội bộ trong từng Event Group để thành viên tiện lợi trao đổi, hẹn địa điểm và thời gian gặp mặt (Meetup). |

### 3.3. Phân hệ Chợ đồ cũ (Classifieds Marketplace)

Kênh thương mại điện tử C2C kết nối trực tiếp cung - cầu, hoạt động dưới dạng niêm yết (listing).

| Tính năng cốt lõi | Mô tả chi tiết |
| :--- | :--- |
| **Mô hình hoạt động** | C2C (Người bán - Người mua), Listing-only. Khách hàng tự liên hệ và thanh toán trực tiếp, không tích hợp cổng thanh toán trực tuyến trên app. |
| **Đăng tin rao vặt** | Cho phép người dùng upload ảnh, viết mô tả chi tiết, thiết lập mức giá và chọn khu vực sinh sống. |
| **Tìm kiếm & Phân loại** | Bộ lọc mạnh mẽ hỗ trợ tìm kiếm dựa trên danh mục (Điện tử, Gia dụng, Quần áo...) và theo từng tỉnh thành (Prefectures). |
| **Trust System (Hệ thống uy tín)** | - **Rating & Reviews:** Đánh giá sao và nhận xét từ người mua sau khi giao dịch/liên hệ.<br/> - **Report (Báo cáo):** Chức năng cắm cờ các bài đăng có dấu hiệu lừa đảo, spam. |

---

## 4. Yêu cầu Phi chức năng (Non-functional Requirements)

- **Giao diện (UI/UX) - Mobile-First:** Thiết kế đáp ứng (Responsive), ưu tiên tuyệt đối cho trải nghiệm vuốt/chạm trên điện thoại di động vì phần lớn tệp người dùng truy cập khi đang di chuyển, trên tàu điện.
- **Hiệu năng & Tốc độ chuyển trang:** Kiến trúc SPA giúp chuyển trang tức thì, không giật lag. Hình ảnh trên Chợ đồ cũ phải được tự động tối ưu hóa size (lazy loading & nén) để duy trì tốc độ tải trang cao.
- **Tối ưu hóa tìm kiếm (SEO):** Vô cùng quan trọng cho Phân hệ Thủ tục hành chính để thu hút traffic tự nhiên từ Google search. Bắt buộc áp dụng cơ chế Server-Side Rendering (SSR) hoặc Static Site Generation (SSG).
- **Định danh & Bảo mật:**
  - Quy định bắt buộc xác thực qua Email hoặc SMS (Số điện thoại Nhật) để đảm bảo "người thật, việc thật", chống spam tài khoản ảo rác.
  - Ban hành và hiển thị minh bạch Chính sách Bảo mật (Privacy Policy), mã hóa dữ liệu cá nhân theo tiêu chuẩn quốc tế.

---

## 5. Đề xuất Công nghệ (Proposed Tech Stack - Cloud & AI Focus)

Với các yêu cầu về hiệu năng, SEO, và AI, sau đây là kiến trúc công nghệ đề xuất:

| Hạng mục | Công nghệ đề xuất | Lý do lựa chọn |
| :--- | :--- | :--- |
| **Frontend** | **Next.js (React)**, TypeScript, Tailwind CSS | - Hoàn hảo cho SPA kết hợp **SSR/SSG** dễ dàng giải quyết bài toán SEO.<br/>- Tailwind giúp tối ưu UI Mobile-First nhanh và nhất quán. |
| **Backend/BaaS** | **Supabase** hoặc **Firebase** (Serverless) | Rút ngắn thời gian phát triển, hỗ trợ Auth (SĐT/Email), Database (PostgreSQL/NoSQL) theo thời gian thực (rất phù hợp cho Bảng tin cộng đồng). |
| **Hệ thống AI** | **OpenAI API** (hoặc **Gemini API**) + **LangChain** + **Vector DB (Pinecone/Supabase pgvector)** | Triển khai RAG (Retrieval-Augmented Generation) xây dựng Chatbot AI trả lời chính xác dựa trên database luật hành chính và các thủ tục Nhật Bản (không bịa đặt câu trả lời). |
| **Cloud Hosting** | **Vercel** hoặc **AWS** | Tích hợp hoàn hảo với Next.js, Edge Network giúp tối ưu tốc độ cho thiết bị người dùng cuối truy cập từ mạng Nhật Bản. |
| **Lưu trữ Ảnh** | **AWS S3** hoặc **Cloudinary** | Hỗ trợ nén ảnh on-the-fly, phân phối CDN nhanh chóng cho chợ đồ cũ. |

---

## 6. Đánh giá Rủi ro & Kế hoạch Giảm thiểu (Risk Assessment & Mitigation Plan)

| Sự kiện rủi ro (Risk) | Mức độ | Khả năng | Kế hoạch Giảm thiểu (Mitigation Plan) |
| :--- | :--- | :--- | :--- |
| **R1: Nội dung pháp luật bị lỗi thời**<br/>(Luật visa, thuế thay đổi nhưng trên web chưa cập nhật, Chatbot trả lời sai). | Cao | Trung bình | - Có đội ngũ cộng tác viên (Admin) định kỳ rà soát các bài viết thủ tục (mỗi 3 tháng).<br/>- Cập nhật định kỳ Vector DB cho AI và gắn disclaimer (miễn trừ trách nhiệm, nhắc nhở người dùng tham khảo thêm trang web chính phủ). |
| **R2: Lừa đảo, hàng giả trên chợ đồ cũ**<br/>(Người dùng bị mất tiền oan). | Cao | Cao | - Xác thực sđt bắt buộc (OTP) trước khi được quyền đăng bán.<br/>- Đưa ra các khuyến cáo giao dịch an toàn tự động ở mỗi bài đăng C2C.<br/>- Khóa tài khoản vĩnh viễn khi có Report được Admin kiểm chứng chuẩn xác. |
| **R3: Nhóm sự kiện hoạt động sai mục đích**<br/>(Biến tướng thành cờ bạc, môi giới đa cấp). | Cao | Trung bình | - Giới hạn quyền tạo nhóm (chỉ tài khoản uy tín), hoặc yêu cầu kiểm duyệt ban đầu.<br/>- Triển khai bộ lọc từ khóa tự động (Auto-moderation) với các cụm từ nhạy cảm.<br/>- Cung cấp nút "Report Group" dễ tiếp cận. |
| **R4: Thiếu hụt User Retention (Tỉ lệ giữ chân thấp)**<br/>(Hoàn thành thủ tục xong người dùng không quay lại). | Trung bình | Cao | - Cross-sell các tính năng: Đẩy mạnh Notification về sự kiện sắp diễn ra, chợ đồ cũ theo sở thích cá nhân.<br/>- Cập nhật thông tin hữu ích và xu hướng đời sống liên tục ở bảng tin. |

---
*Tài liệu được thiết kế riêng cho dự án Kurashi.*
