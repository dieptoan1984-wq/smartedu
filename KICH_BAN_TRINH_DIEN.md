# KỊCH BẢN TRÌNH DIỄN SẢN PHẨM SMART EDU THCS (5 PHÚT)
**Đề tài:** Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS  
**Mục tiêu:** Trình diễn mạch lạc, thuyết phục toàn bộ quy trình liên thông giữa 3 đối tượng người dùng: **Giáo viên**, **Người thẩm định** và **Học sinh**, chứng minh năng lực thực tế của 78 mã chức năng và CSDL chuẩn.

---

## TỔNG QUAN PHÂN BỔ THỜI GIAN (5 PHÚT)
- **Phút 01:** Trang chủ, Triết lý sản phẩm & Xác thực quyền thực qua Supabase RPC.
- **Phút 02:** Bàn làm việc Giáo viên – Quản lý lớp, Soạn bài tương tác HTML & Ngân hàng câu hỏi.
- **Phút 03:** Khu vực Thẩm định chuyên môn & Quản trị – Duyệt học liệu trong Sandbox & Nhật ký kiểm toán.
- **Phút 04:** Không gian Học sinh – Trải nghiệm học tương tác đa pha, làm bài & Sổ câu sai cá nhân.
- **Phút 05:** Khép kín chu trình Đánh giá – Chấm bài tự luận, Công bố điểm & Xuất hồ sơ kiểm tra 5 bước ra file Word.

---

## PHÚT 01: TRANG CHỦ & XÁC THỰC QUYỀN THỰC
**Mục tiêu:** Giới thiệu định vị sản phẩm THCS (Khối 6–9), phông Times New Roman 18px và cơ chế bảo mật máy chủ.

1. **Thao tác:**
   - Mở Trang chủ tại đường dẫn `/`.
   - Giới thiệu khẩu hiệu: *"Học chủ động, tiến bộ mỗi ngày – Dành cho học sinh lớp 6–9"*.
   - Nhấn chọn chuyển đổi giữa các khối lớp **Lớp 6, Lớp 7, Lớp 8, Lớp 9**; trình diễn danh mục 12 môn học THCS chuẩn bộ sách *Kết nối tri thức với cuộc sống*.
   - Bấm nút **"Đăng nhập"** trên góc phải.
2. **Lời thuyết minh:**
   > *"Kính thưa Hội đồng, Smart EDU được thiết kế chuyên biệt cho cấp THCS với phông chữ chuẩn mực Times New Roman, cỡ chữ 18px thân thiện thị giác và bố cục khoa học. Hệ thống không sử dụng đăng nhập giả lập. Mọi phiên làm việc được chứng thực qua Supabase Auth và phân quyền trực tiếp tại máy chủ qua hàm `current_access()`, đảm bảo học sinh không thể tự ý nâng quyền thành giáo viên hay quản trị viên."*

---

## PHÚT 02: BÀN LÀM VIỆC GIÁO VIÊN – SOẠN HỌC LIỆU TƯƠNG TÁC
**Mục tiêu:** Trình diễn Bàn làm việc theo Ảnh 2, tính năng tải tệp HTML và ngân hàng câu hỏi.

1. **Thao tác:**
   - Vào menu **"Giáo viên"** (hoặc chọn góc nhìn Giáo viên).
   - Trình diễn 9 mục phân hệ tại thanh điều hướng bên trái: *Bàn làm việc, Lớp học, Soạn bài, Ngân hàng câu hỏi, Giao bài, Bộ hồ sơ kiểm tra, Trò chơi, Chấm bài, Trao đổi với HS*.
   - Chọn mục **"Soạn bài tương tác"**:
     - Nhập tiêu đề bài học mới: *"Tin học 6 – Bài 2: Xử lý thông tin"*.
     - Trình diễn khả năng tải lên tệp bài giảng HTML độc lập (Standalone HTML).
     - Bấm **"Xem trước"** để kiểm tra giao diện bài giảng.
     - Bấm **"Gửi thẩm định"** $\rightarrow$ Hệ thống lưu trạng thái `pending` và ghi log kiểm toán.
   - Chọn mục **"Ngân hàng câu hỏi"**:
     - Thao tác nhanh tính năng nhập hàng loạt câu hỏi từ tệp CSV có kiểm tra lỗi cú pháp từng dòng.
2. **Lời thuyết minh:**
   > *"Tại Bàn làm việc giáo viên, thầy cô có toàn quyền quản lý lớp học và chủ động sáng tạo bài giảng. Điểm nổi bật là Smart EDU cho phép giáo viên tải lên toàn bộ gói bài giảng HTML tương tác. Gói học liệu này được đưa vào hàng đợi chờ Hội đồng thẩm định phê duyệt trước khi phát hành tới học sinh."*

---

## PHÚT 03: KHU VỰC THẨM ĐỊNH & QUẢN TRỊ CHUYÊN MÔN
**Mục tiêu:** Trình diễn quy trình phê duyệt học liệu trong Sandbox an toàn và tính minh bạch của hệ thống.

1. **Thao tác:**
   - Bấm vào menu tài khoản, chọn **"Quản trị & Thẩm định"** (đường dẫn `/quan-tri`).
   - Tại tab **"1. Duyệt học liệu & Câu hỏi"**:
     - Mở bài học vừa được gửi thẩm định.
     - Bấm **"Xem trước HTML"**: Bài học mở ra trong cửa sổ pop-up chạy dưới thẻ iframe được cô lập nghiêm ngặt bằng sandbox (`sandbox="allow-scripts allow-modals"`).
     - Bấm nút **"Phê duyệt bài học"**.
   - Chuyển sang tab **"5. Nhật ký kiểm toán (Audit Log)"**:
     - Trình diễn bản ghi kiểm toán mới nhất được ghi tự động: hành động duyệt bài, tên người thực hiện, thời gian chi tiết.
2. **Lời thuyết minh:**
   > *"Để bảo vệ an toàn cho học sinh, toàn bộ mã HTML của giáo viên đều được chạy trong môi trường Sandbox cô lập tuyệt đối, không có quyền can thiệp vào cookie hay dữ liệu người dùng của hệ thống. Hội đồng thẩm định có thể phê duyệt hoặc gửi yêu cầu chỉnh sửa kèm nhận xét chuyên môn. Mọi thao tác đều được lưu vết trong Nhật ký kiểm toán minh bạch."*

---

## PHÚT 04: KHÔNG GIAN HỌC SINH – TRẢI NGHIỆM HỌC TƯƠNG TÁC
**Mục tiêu:** Trình diễn trải nghiệm học sinh theo Ảnh 3, bài học đa pha và sổ câu sai tự động.

1. **Thao tác:**
   - Bấm chuyển sang **"Không gian học sinh"** (đường dẫn `/hoc-sinh`).
   - Vào mục **"Học tương tác"**:
     - Bài học vừa được duyệt lập tức xuất hiện trong danh mục học tập của em.
     - Trình diễn bài học tương tác *Tin học 6 – Bài 1: Thông tin và dữ liệu* theo đúng thiết kế Ảnh 3:
       - Pha Khám phá: Trả lời tình huống dự báo thời tiết $\rightarrow$ Bấm **"Kiểm tra câu trả lời"** $\rightarrow$ Nhận phản hồi giải thích khoa học tức thì.
       - Pha Ghi chép: Nhập ghi nhớ cá nhân vào ô *"Ghi nhớ của em"* và bấm **"Lưu ghi chú"**.
   - Vào mục **"Kiểm tra"**:
     - Làm một bài trắc nghiệm nhanh 5 câu. Cố ý chọn sai 1 câu để trình diễn tính năng.
   - Chuyển sang mục **"Sổ câu sai"**:
     - Chỉ ra câu hỏi vừa làm sai đã được tự động đưa vào sổ tay cá nhân hóa, kèm theo đáp án đúng và lời giải thích chi tiết để học sinh ôn luyện lại.
2. **Lời thuyết minh:**
   > *"Không gian học sinh chuyển từ tiếp thu thụ động sang học tập chủ động qua các tình huống khám phá thực tế. Đặc biệt, tính năng Sổ câu sai tự động giúp học sinh nhận diện đúng lỗ hổng kiến thức để rèn luyện trọng tâm mà không bị áp lực thành tích."*

---

## PHÚT 05: KHÉP KÍN CHU TRÌNH ĐÁNH GIÁ & XUẤT HỒ SƠ WORD
**Mục tiêu:** Trình diễn chấm bài tự luận của giáo viên và xuất bộ hồ sơ kiểm tra 5 bước ra file Word chuẩn.

1. **Thao tác:**
   - Quay lại Không gian giáo viên, chọn mục **"Chấm bài & Kết quả"**:
     - Mở bài nộp của học sinh, chấm điểm câu hỏi tự luận theo barem chi tiết.
     - Nhập nhận xét cá nhân hóa: *"Em phân biệt thông tin và dữ liệu rất tốt, cần chú ý thêm phần ví dụ thực tế"*.
     - Bấm **"Công bố kết quả"**.
   - Chuyển sang mục **"Bộ hồ sơ kiểm tra"**:
     - Mở hồ sơ kiểm tra giữa kỳ 1 môn Tin học 6.
     - Trình diễn 5 bước chuẩn hóa: *Ma trận $\rightarrow$ Bản đặc tả $\rightarrow$ Đề kiểm tra $\rightarrow$ Đáp án $\rightarrow$ Hướng dẫn chấm*.
     - Bấm nút **"Xuất toàn bộ hồ sơ (.doc)"**.
     - Mở tệp tin `.doc` vừa tải xuống: Trình diễn thể thức trang in A4 hoàn hảo, có quốc hiệu, tiêu ngữ, bảng ma trận chi tiết và barem điểm chấm sẵn sàng in ấn nộp tổ chuyên môn.
2. **Lời kết luận:**
   > *"Thưa Hội đồng, Smart EDU đã hoàn thiện trọn vẹn 78/78 mã chức năng theo bản đặc tả 1.0, kết nối mạch lạc từ khâu tạo học liệu, thẩm định, học tập, kiểm tra đến xuất hồ sơ nghiệp vụ sư phạm chuẩn mực. Sản phẩm đã sẵn sàng chuyển giao và vận hành thực tế tại các trường THCS. Xin trân trọng cảm ơn Hội đồng!"*
