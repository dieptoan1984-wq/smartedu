# MA TRẬN THEO DÕI & TÌNH TRẠNG 78 CHỨC NĂNG SMART EDU THCS
**Căn cứ tài liệu:** Bản đặc tả chức năng Smart EDU v1.0 (Bản sửa cuối 05/07)  
**Phạm vi:** Cấp THCS (Lớp 6, 7, 8, 9) • 12 Môn học • 13 Bảng giao diện tham chiếu

---

## I. TỔNG HỢP TIẾN ĐỘ 6 NHÓM CHỨC NĂNG

| Nhóm chức năng | Dải mã | Số lượng | Trạng thái triển khai | Dữ liệu & Nghiệp vụ |
| :--- | :--- | :---: | :---: | :--- |
| **1. Phân hệ Học sinh** | `HS01` – `HS21` | 21 | 21/21 Hoàn chỉnh | Trải nghiệm học tương tác, bài tập, sổ câu sai, hỏi giáo viên |
| **2. Phân hệ Giáo viên** | `GV01` – `GV15` | 15 | 15/15 Hoàn chỉnh | Quản lý lớp, soạn bài HTML, câu hỏi, giao bài, chấm bài, Q&A |
| **3. Hồ sơ kiểm tra** | `KT01` – `KT16` | 16 | 16/16 Hoàn chỉnh | Quy trình 5 bước: Ma trận, đặc tả, đề, đáp án, barem, xuất Word |
| **4. Trò chơi & Tiện ích** | `TC01` – `TC10` | 10 | 10/10 Hoàn chỉnh | Thử thách trắc nghiệm, lật thẻ, chia nhóm, bấm giờ, bốc thăm |
| **5. Quản trị & Vận hành** | `QT01` – `QT10` | 10 | 10/10 Hoàn chỉnh | Duyệt học liệu (Review queue), phân công môn, phân quyền, audit log |
| **6. Nghiên cứu & Minh chứng** | `NC01` – `NC06` | 6 | 6/6 Hoàn chỉnh | Thống kê tiến bộ, xuất ma trận minh chứng, phân tích độ phân hóa |
| **TỔNG CỘNG** | **78 MÃ** | **78** | **78/78 Sẵn sàng** | **Đáp ứng 100% bản đặc tả 1.0 và 13 bảng giao diện** |

---

## II. MA TRẬN CHI TIẾT 78 MÃ CHỨC NĂNG

### 1. Phân hệ Học sinh (HS01 – HS21)

| Mã | Tên chức năng | Giao diện | Backend / RLS | Dữ liệu | Kiểm thử đã chạy | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **HS01** | Xem bảng tin học tập cá nhân | Đạt | RLS Student Read | Supabase + LocalStore | Render bảng tin, thống kê giờ học, bài nộp | Hoàn thành | Đã tích hợp tại Góc học tập |
| **HS02** | Xem danh mục môn học Lớp 6–9 | Đạt | `curricula` + `subjects` | CSDL 002_danh_muc | Lọc 12 môn THCS, chuyển khối lớp 6-9 | Hoàn thành | Chuẩn bộ sách Kết nối tri thức |
| **HS03** | Khởi động bài học tương tác | Đạt | Iframe Sandbox | HTML Lesson Package | Mở pha khởi động, tình huống bài toán | Hoàn thành | Cách ly an toàn Sandbox |
| **HS04** | Khám phá tình huống thực tế | Đạt | Client State | Dữ liệu Tin học 6 | Thử tình huống thời tiết & hành vi | Hoàn thành | Phản hồi giải thích tức thì |
| **HS05** | Phân loại thông tin & dữ liệu | Đạt | Client State | Dữ liệu tương tác | Thử nghiệm phân loại thẻ dữ liệu/thông tin | Hoàn thành | Hỗ trợ tương tác kéo thả / chọn |
| **HS06** | Ghi chép bài học cá nhân | Đạt | `localStorage` | Lưu trữ theo bài học | Thêm ghi chú, tải lại trang vẫn giữ nguyên | Hoàn thành | Tích hợp ngay dưới bài học |
| **HS07** | Ôn tập chuyên đề theo chương | Đạt | `chapters` + `questions` | CSDL Ngân hàng câu hỏi | Lọc câu hỏi theo chương, làm thử | Hoàn thành | Chấm điểm tự động từng câu |
| **HS08** | Làm bài kiểm tra thường xuyên | Đạt | `assignments` + RLS | Supabase / LocalStore | Đếm ngược thời gian, lưu bài làm | Hoàn thành | Tự động tính điểm trắc nghiệm |
| **HS09** | Làm bài kiểm tra định kỳ | Đạt | `assignments` | Cấu trúc đề chuẩn | Làm bài 45 phút, nộp bài đúng hạn | Hoàn thành | Có cảnh báo khi sắp hết giờ |
| **HS10** | Xem kết quả & lời phê giáo viên | Đạt | `submissions` | CSDL Submissions | Xem điểm trắc nghiệm & tự luận kèm nhận xét | Hoàn thành | Hiển thị sau khi GV công bố |
| **HS11** | Xem đáp án & hướng dẫn giải | Đạt | `show_solution_policy` | CSDL Assignments | Kiểm tra chính sách xem giải sau hạn nộp | Hoàn thành | Không lộ đáp án trước hạn |
| **HS12** | Chơi trò chơi thử thách trí tuệ | Đạt | Mini game engine | 5 câu hỏi kiến thức | Hoàn thành trò chơi, tính cúp chiến thắng | Hoàn thành | Động viên người học |
| **HS13** | Tự động ghi nhận câu làm sai | Đạt | `student_mistakes` | Tự động cập nhật | Làm sai ở bài kiểm tra, vào sổ câu sai kiểm tra | Hoàn thành | Lưu cả câu chọn sai & đáp án đúng |
| **HS14** | Luyện tập lại từ sổ câu sai | Đạt | Practice State | Danh sách câu sai | Bấm làm lại câu sai, giải thích chi tiết | Hoàn thành | Đánh dấu "Đã hiểu rõ" sau khi làm lại |
| **HS15** | Phân loại câu sai theo mức độ | Đạt | Client Filter | Sổ câu sai | Lọc câu sai theo môn, mức độ hiểu | Hoàn thành | Giúp học sinh tập trung lỗ hổng |
| **HS16** | Lập kế hoạch học tập cá nhân | Đạt | `student_study_plans` | Lưu kế hoạch | Thêm mục tiêu ngày thi, số phút học mỗi ngày | Hoàn thành | Lưu trữ an toàn theo từng học sinh |
| **HS17** | Theo dõi tiến độ hoàn thành kế hoạch | Đạt | Progress Tracker | Thống kê số giờ | Tính tỷ lệ phần trăm hoàn thành mục tiêu | Hoàn thành | Trực quan hóa tiến độ |
| **HS18** | Nhắc nhở lịch học và nộp bài | Đạt | Notification badge | Thời gian bài tập | Kiểm tra hiển thị chuông báo và huy hiệu | Hoàn thành | Không làm phiền người học |
| **HS19** | Gửi câu hỏi thắc mắc tới giáo viên | Đạt | `student_qa` + RLS | Form gửi câu hỏi | Gửi câu hỏi kèm bài học, kiểm tra danh sách chờ | Hoàn thành | Quyền xem giới hạn đúng học sinh |
| **HS20** | Xem phản hồi từ giáo viên | Đạt | `student_qa` | Dữ liệu trả lời | Giáo viên trả lời, học sinh đọc lời giải đáp | Hoàn thành | Hiển thị trạng thái "Đã trả lời" |
| **HS21** | Tự đánh giá mức độ tiếp thu | Đạt | Self-assessment | Lưu phản hồi | Chọn mức độ hiểu bài sau mỗi tiết học | Hoàn thành | Tích hợp vào báo cáo tiến bộ |

---

### 2. Phân hệ Giáo viên (GV01 – GV15)

| Mã | Tên chức năng | Giao diện | Backend / RLS | Dữ liệu | Kiểm thử đã chạy | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **GV01** | Bàn làm việc tổng quan giáo viên | Đạt | Teacher Read | Thống kê lớp & học liệu | Kiểm tra bảng tác vụ nhanh theo Ảnh 2 | Hoàn thành | Khớp 100% thiết kế Ảnh 2 |
| **GV02** | Quản lý lớp học & danh sách HS | Đạt | `classes` + RLS | CSDL Lớp học | Thêm lớp mới, lưu trữ lớp học cũ | Hoàn thành | Không làm mất dữ liệu học sinh |
| **GV03** | Soạn bài tương tác & tải tệp HTML | Đạt | `interactive_lessons` | Standalone HTML | Tải lên tệp HTML, xem trước, lưu nháp | Hoàn thành | Đưa vào hàng đợi thẩm định |
| **GV04** | Quản lý ngân hàng câu hỏi | Đạt | `questions` | ABCD, T/F, Tự luận | Thêm mới câu hỏi kèm mức độ nhận thức | Hoàn thành | Hỗ trợ 4 mức độ theo Thông tư 22 |
| **GV05** | Nhập câu hỏi hàng loạt từ CSV | Đạt | CSV Parser & Validator | Phân tích từng dòng | Nhập tệp CSV mẫu, kiểm tra lỗi từng dòng | Hoàn thành | Báo lỗi chi tiết dòng sai cú pháp |
| **GV06** | Tạo và giao nhiệm vụ học tập | Đạt | `assignments` | Giao tới lớp cụ thể | Chọn lớp, chọn câu hỏi, thiết lập thời hạn | Hoàn thành | Học sinh nhận ngay trong danh sách |
| **GV07** | Cấu hình kiểm tra & chính sách đáp án | Đạt | `show_solution_policy` | 3 mức chính sách | Thử chính sách xem sau hạn / xem ngay | Hoàn thành | Đảm bảo tính bảo mật bài thi |
| **GV08** | Chấm điểm bài tự luận của học sinh | Đạt | `submissions` | Giao diện chấm | Nhập điểm tự luận theo barem chi tiết | Hoàn thành | Tự động cộng tổng điểm |
| **GV09** | Ghi nhận xét sư phạm chi tiết | Đạt | `teacher_feedback` | Nhận xét cá nhân | Nhập nhận xét bài làm, lưu và gửi học sinh | Hoàn thành | Học sinh xem được sau công bố |
| **GV10** | Công bố kết quả bài kiểm tra | Đạt | `is_published` | CSDL Submissions | Bấm công bố, kiểm tra phía học sinh | Hoàn thành | Chỉ hiển thị khi giáo viên duyệt |
| **GV11** | Tạo trò chơi học tập trên lớp | Đạt | Game Creator | Trắc nghiệm vui | Tạo bộ thẻ bài tập khởi động lớp | Hoàn thành | Thích hợp chiếu trên màn hình lớp |
| **GV12** | Công cụ lớp học: Bốc thăm gọi tên | Đạt | Random Selector | Danh sách học sinh | Bốc thăm ngẫu nhiên học sinh trả lời | Hoàn thành | Minh bạch, công bằng |
| **GV13** | Công cụ lớp học: Đồng hồ đếm giờ | Đạt | Timer Utility | Đếm phút & giây | Bật đồng hồ thảo luận nhóm 15p, chuông reo | Hoàn thành | Có âm thanh và cảnh báo trực quan |
| **GV14** | Tiếp nhận câu hỏi thắc mắc từ HS | Đạt | `student_qa` | Hàng đợi câu hỏi | Xem danh sách câu hỏi chưa trả lời | Hoàn thành | Lọc theo lớp và theo môn |
| **GV15** | Trả lời và hướng dẫn học sinh | Đạt | `student_qa` + Audit | CSDL Q&A | Nhập câu trả lời, lưu vào hệ thống | Hoàn thành | Gửi thông báo đến học sinh |

---

### 3. Phân hệ Hồ sơ Kiểm tra Đánh giá (KT01 – KT16)

| Mã | Tên chức năng | Giao diện | Backend / RLS | Dữ liệu | Kiểm thử đã chạy | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **KT01** | Khởi tạo bộ hồ sơ kiểm tra 5 bước | Đạt | Dossier Engine | Quy trình tuần tự | Bấm khởi tạo, kiểm tra 5 bước hiển thị | Hoàn thành | Theo quy định của Bộ GD&ĐT |
| **KT02** | Xây dựng Ma trận đề kiểm tra | Đạt | Matrix Builder | 4 mức độ tư duy | Nhập số câu theo mức: Biết, Hiểu, Vận dụng | Hoàn thành | Tính tự động tổng điểm 10 |
| **KT03** | Xây dựng Bản đặc tả đề kiểm tra | Đạt | Specification Sheet | Yêu cầu cần đạt | Nhập chuẩn kiến thức, kỹ năng cần đạt | Hoàn thành | Khớp với chương trình GDPT 2018 |
| **KT04** | Biên soạn Đề kiểm tra chính thức | Đạt | Exam Generator | Ghép câu hỏi từ ngân hàng | Tạo đề thi có phân bổ câu tự động | Hoàn thành | Trích xuất câu hỏi chuẩn |
| **KT05** | Thiết lập Bảng đáp án trắc nghiệm | Đạt | Answer Key Matrix | Bảng mã ABCD | Tự động sinh bảng đáp án mã hóa | Hoàn thành | Tránh sai sót thủ công |
| **KT06** | Xây dựng Hướng dẫn chấm & Barem điểm | Đạt | Rubric Builder | Tiêu chí chi tiết | Thiết lập biểu điểm chi tiết đến 0.25đ | Hoàn thành | Dễ dàng áp dụng khi chấm chung |
| **KT07** | Xuất bộ hồ sơ ra định dạng Word (.doc) | Đạt | Real File Exporter | Định dạng Word HTML | Tải xuống file `.doc`, mở trên Microsoft Word | Hoàn thành | Định dạng chuẩn trang in A4 |
| **KT08** | Định dạng tiêu đề trường, phòng, sở | Đạt | Header Template | Khung chuẩn Bộ GD | Kiểm tra quốc hiệu, tên trường, lớp | Hoàn thành | Tự động điền theo năm học |
| **KT09** | Tách đề và đáp án khi in ấn | Đạt | Print Formatter | Page-break css | Xem trước bản in đề không kèm đáp án | Hoàn thành | Tránh lộ đề thi trước giờ |
| **KT10** | Lưu trữ hồ sơ vào kho tài liệu | Đạt | Local / CSDL | Dossier Storage | Lưu bộ hồ sơ đã hoàn thành để tái sử dụng | Hoàn thành | Quản lý theo năm học |
| **KT11** | Cảnh báo vi phạm thời gian làm bài | Đạt | Exam Monitor | Đồng hồ & Tab focus | Chuyển tab khi thi, hiện cảnh báo nhắc nhở | Hoàn thành | Nâng cao tính tự giác |
| **KT12** | Phân tích độ khó đề thi | Đạt | Analytics Tool | Tỷ lệ % các mức | Kiểm tra tỷ lệ 40-30-20-10 | Hoàn thành | Đảm bảo chuẩn sư phạm |
| **KT13** | Phân loại trắc nghiệm & tự luận | Đạt | Type Splitter | Tỷ lệ điểm 7/3 hoặc 5/5 | Cân đối phần trắc nghiệm và tự luận | Hoàn thành | Linh hoạt theo từng môn học |
| **KT14** | Tái sử dụng ma trận các năm trước | Đạt | Template Clone | Bản sao ma trận | Sao chép ma trận năm cũ sang năm mới | Hoàn thành | Tiết kiệm thời gian soạn đề |
| **KT15** | Đồng bộ ma trận với ngân hàng câu hỏi | Đạt | Question Sync | Liên kết mã câu hỏi | Chọn câu hỏi khớp với ô trong ma trận | Hoàn thành | Chính xác 100% |
| **KT16** | Đánh giá độ phân hóa đề thi | Đạt | Differentiation Metric | Phân tích bài làm | Thống kê phổ điểm của đề thi | Hoàn thành | Giúp giáo viên rút kinh nghiệm |

---

### 4. Trò chơi & Tiện ích học tập (TC01 – TC10)

| Mã | Tên chức năng | Giao diện | Backend / RLS | Dữ liệu | Kiểm thử đã chạy | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **TC01** | Trò chơi Trắc nghiệm thần tốc | Đạt | Quiz Game Engine | 5 câu hỏi tính giờ | Chơi thử, tính điểm và cúp vinh danh | Hoàn thành | Tăng hứng thú đầu giờ |
| **TC02** | Trò chơi Lật thẻ ghép cặp khái niệm | Đạt | Memory Match Engine | 6 cặp thẻ bài | Lật cặp từ khóa và định nghĩa khớp | Hoàn thành | Củng cố ghi nhớ từ vựng/thuật ngữ |
| **TC03** | Chia nhóm học tập ngẫu nhiên | Đạt | Grouping Tool | Danh sách lớp | Nhập số nhóm, tự động phân bổ học sinh | Hoàn thành | Phục vụ học nhóm trên lớp |
| **TC04** | Vòng quay may mắn chọn học sinh | Đạt | Random Wheel | Danh sách học sinh | Bốc thăm ngẫu nhiên người trả lời | Hoàn thành | Giao diện trực quan |
| **TC05** | Đồng hồ đếm ngược hoạt động nhóm | Đạt | Timer Component | Âm thanh báo hiệu | Chạy đồng hồ 5p, 10p, 15p | Hoàn thành | Tiện ích hỗ trợ giáo viên |
| **TC06** | Phiếu khảo sát nhanh cuối tiết (Exit Ticket) | Đạt | Poll Engine | 3 câu hỏi nhanh | Học sinh gửi đánh giá cuối buổi học | Hoàn thành | Giáo viên nắm được mức hiểu bài |
| **TC07** | Bảng xếp hạng thi đua tuần | Đạt | Leaderboard | Điểm tích lũy bài tập | Hiển thị top học sinh chăm chỉ nhất | Hoàn thành | Không tạo áp lực điểm số |
| **TC08** | Tích lũy huy hiệu thành tích học tập | Đạt | Badge System | Quy tắc hoàn thành | Đạt 100% bài học, nhận huy hiệu "Chăm chỉ" | Hoàn thành | Khích lệ tinh thần tự học |
| **TC09** | Chế độ làm bài không bị phân tâm | Đạt | Focus Mode | Fullscreen API | Bật chế độ tập trung, ẩn thanh điều hướng | Hoàn thành | Tối ưu trải nghiệm làm bài |
| **TC10** | Trợ giúp phím tắt truy cập nhanh | Đạt | Keyboard Shortcuts | Phím Esc, 1, 2, 3, 4 | Dùng phím số để chọn đáp án A, B, C, D | Hoàn thành | Thao tác nhanh chóng |

---

### 5. Quản trị & Vận hành (QT01 – QT10)

| Mã | Tên chức năng | Giao diện | Backend / RLS | Dữ liệu | Kiểm thử đã chạy | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **QT01** | Hàng đợi thẩm định học liệu (Review Queue) | Đạt | `interactive_lessons` | Danh sách bài chờ | Người duyệt xem bài, bấm duyệt / yêu cầu sửa | Hoàn thành | Cập nhật tức thì vào kho học sinh |
| **QT02** | Thẩm định câu hỏi trắc nghiệm | Đạt | `questions` | Danh sách câu chờ | Kiểm tra nội dung, đáp án, barem, bấm duyệt | Hoàn thành | Chỉ câu được duyệt mới vào đề |
| **QT03** | Gửi yêu cầu chỉnh sửa kèm lý do | Đạt | `review_feedback` | Lý do chuyên môn | Nhập lý do từ chối, giáo viên thấy phản hồi | Hoàn thành | Nâng cao chất lượng học liệu |
| **QT04** | Phân công người duyệt theo môn | Đạt | `private.reviewer_scopes`| Bảng phân công môn | Gán chuyên viên phụ trách môn Tin học, Toán | Hoàn thành | Đúng phạm vi chuyên môn |
| **QT05** | Quản lý danh mục 12 môn học THCS | Đạt | `public.subjects` | CSDL Danh mục 002 | Xem danh sách môn, trạng thái kích hoạt | Hoàn thành | Khớp với chương trình GDPT |
| **QT06** | Quản lý bộ sách Kết nối tri thức | Đạt | `public.textbooks` | CSDL Sách giáo khoa | Kiểm tra liên kết bộ sách và chương trình | Hoàn thành | Chuẩn sách giáo khoa |
| **QT07** | Quản lý tài khoản & Vai trò người dùng | Đạt | `private.user_roles` | RPC current_access | Xem danh sách tài khoản, vai trò thực tế | Hoàn thành | Ngăn chặn tự nâng quyền |
| **QT08** | Nhật ký kiểm toán thao tác (Audit Log) | Đạt | `private.audit_log` | Ghi log hệ thống | Thực hiện duyệt bài, kiểm tra bản ghi log | Hoàn thành | Đầy đủ người thực hiện, thời gian |
| **QT09** | Khóa/mở tài khoản an toàn | Đạt | User Status | Supabase Auth API | Quản trị viên kích hoạt / vô hiệu hóa | Hoàn thành | Bảo vệ an toàn dữ liệu |
| **QT10** | Sao lưu và phục hồi dữ liệu học liệu | Đạt | SQL Migration | Tệp xuất CSDL | Kiểm tra script phục hồi CSDL 001/002/003 | Hoàn thành | Khả thi triển khai thực tế |

---

### 6. Nghiên cứu & Minh chứng khoa học (NC01 – NC06)

| Mã | Tên chức năng | Giao diện | Backend / RLS | Dữ liệu | Kiểm thử đã chạy | Trạng thái | Ghi chú |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :--- |
| **NC01** | Báo cáo theo dõi tiến bộ cá nhân | Đạt | Student Analytics | Biểu đồ giờ học | Xem tiến bộ qua các bài kiểm tra | Hoàn thành | Tại mục "Tiến bộ của em" |
| **NC02** | Thống kê phân bố độ khó bài kiểm tra | Đạt | Question Metrics | Thống kê tỷ lệ | Tính tỷ lệ nhận biết / thông hiểu / vận dụng | Hoàn thành | Minh chứng khoa học đề thi |
| **NC03** | Xuất ma trận minh chứng nghiên cứu | Đạt | Word Export | Hồ sơ khảo sát | Xuất file ma trận kèm đề và barem chuẩn | Hoàn thành | Phục vụ đề tài NCKH sư phạm |
| **NC04** | Phân tích sai lầm phổ biến của học sinh | Đạt | Mistake Aggregator | Sổ câu sai | Tổng hợp các dạng câu hỏi học sinh hay nhầm | Hoàn thành | Giúp cải tiến phương pháp dạy |
| **NC05** | Báo cáo mức độ tương tác học liệu | Đạt | Lesson Analytics | Số lượt học | Thống kê lượt học các bài giảng tương tác | Hoàn thành | Đo lường hiệu quả bài giảng |
| **NC06** | Xuất dữ liệu phục vụ báo cáo sư phạm | Đạt | Report Generator | Tệp báo cáo tổng hợp | Xuất bảng tổng hợp kết quả học tập | Hoàn thành | Phục vụ họp phụ huynh & tổng kết |

---

## III. BẢO ĐẢM KỸ THUẬT & KIỂM CHỨNG CHẤT LƯỢNG

1. **Kiểm tra biên dịch (Compile Check):** Lệnh `npm run build` chạy thành công 100%, không phát sinh lỗi TypeScript.
2. **Kiểm tra lỗi tĩnh (Lint Check):** Lệnh `npm run lint` hoàn thành với **0 cảnh báo, 0 lỗi**.
3. **Phông chữ & Hiển thị tiếng Việt:** Đã xử lý triệt để hiện tượng tách dấu/khoảng trắng sai trong từ; thống nhất phông *Times New Roman* với kích thước cơ bản 18px đúng bản đặc tả.
4. **An toàn Sandbox:** Toàn bộ học liệu HTML được nhúng trong sandbox cô lập hoàn toàn, không có quyền can thiệp vào tài nguyên máy chủ hay thông tin cá nhân của người học.
