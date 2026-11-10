# Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS

**Phiên bản:** 1.0 — Bản đề xuất trình duyệt (09/11/2026)  
**Phạm vi:** Học sinh và giáo viên lớp 6, 7, 8, 9; tất cả 12 môn học THCS; bộ sách Kết nối tri thức với cuộc sống (KNTT).

---

## 1. Trọng Tâm Ứng Dụng

- **Học sinh:** Học bài tương tác theo lớp, môn, bộ sách; nhận phản hồi sư phạm; ôn bài/chương/giữa kỳ/cuối kỳ; làm bài kiểm tra và theo dõi tiến bộ cá nhân.
- **Giáo viên:** Soạn học liệu, quản lí câu hỏi, giao bài, chấm bài; tạo ma trận, bản đặc tả, đề, đáp án, hướng dẫn chấm; tạo trò chơi học tập và theo dõi dữ liệu lớp học.
- **Ranh giới:** Không triển khai học bạ, thời khóa biểu hoặc quản lí phòng học trường THPT ngoài phạm vi đã duyệt.

---

## 2. Danh Mục 78 Chức Năng (6 Nhóm Nghiệp Vụ)

Khôi phục chính xác 6 nhóm với 78 mã chức năng theo bản đặc tả 1.0:

1. **Học sinh (`HS01`–`HS21`, 21 chức năng):**
   - `HS01`: Trang học tập cá nhân
   - `HS02`: Chọn nội dung học
   - `HS03`: Kiểm tra đầu vào
   - `HS04`: Học bài tương tác
   - `HS05`: Tương tác đa dạng
   - `HS06`: Mô phỏng và thí nghiệm ảo
   - `HS07`: Gợi ý từng bước
   - `HS08`: Ghi chú và đánh dấu
   - `HS09`: Tự kiểm tra cuối bài
   - `HS10`: Ôn tập theo phạm vi
   - `HS11`: Ôn tập theo mức độ
   - `HS12`: Sổ câu sai
   - `HS13`: Đề xuất hoạt động tiếp theo
   - `HS14`: Luyện đề
   - `HS15`: Kiểm tra theo lớp hoặc mã
   - `HS16`: Nộp tự luận và thực hành
   - `HS17`: Kết quả và nhận xét
   - `HS18`: Theo dõi tiến bộ
   - `HS19`: Tham gia trò chơi
   - `HS20`: Hỏi đáp và trợ lý AI
   - `HS21`: Kế hoạch và nhắc học

2. **Giáo viên (`GV01`–`GV15`, 15 chức năng):**
   - `GV01`: Quản lí lớp và học sinh
   - `GV02`: Quản lí chương trình
   - `GV03`: Soạn bài học tương tác
   - `GV04`: Nhập học liệu
   - `GV05`: Ngân hàng câu hỏi
   - `GV06`: Nhập và xuất Excel
   - `GV07`: Duyệt nội dung
   - `GV08`: Giao nhiệm vụ
   - `GV09`: Giao bài phân hóa
   - `GV10`: Theo dõi việc học
   - `GV11`: Chấm bài và nhận xét
   - `GV12`: Phân tích câu hỏi
   - `GV13`: Báo cáo lớp học
   - `GV14`: Chia sẻ tổ chuyên môn
   - `GV15`: Trợ lý AI giáo viên

3. **Hồ sơ kiểm tra (`KT01`–`KT16`, 16 chức năng):**
   - `KT01`: Thiết lập bài kiểm tra
   - `KT02`: Cấu hình mẫu hồ sơ
   - `KT03`: Thiết lập cơ cấu đề
   - `KT04`: Tạo ma trận
   - `KT05`: Tạo bản đặc tả
   - `KT06`: Tạo đề kiểm tra
   - `KT07`: Soạn câu còn thiếu
   - `KT08`: Tạo đáp án
   - `KT09`: Hướng dẫn chấm
   - `KT10`: Đối chiếu bộ hồ sơ
   - `KT11`: Cảnh báo lỗi hồ sơ
   - `KT12`: Tạo mã đề
   - `KT13`: Giáo viên duyệt bộ hồ sơ
   - `KT14`: Xuất bộ hồ sơ
   - `KT15`: Chuyển đề sang online
   - `KT16`: Thẩm định và phân tích kết quả

4. **Trò chơi và tiện ích (`TC01`–`TC10`, 10 chức năng):**
   - `TC01`: Tạo trò chơi từ ngân hàng
   - `TC02`: Tạo theo hoạt động học
   - `TC03`: Thư viện mẫu trò chơi
   - `TC04`: Phòng chơi trực tiếp
   - `TC05`: Chơi cá nhân và theo nhóm
   - `TC06`: Phản hồi sau trò chơi
   - `TC07`: Gọi tên ngẫu nhiên
   - `TC08`: Chia nhóm
   - `TC09`: Đồng hồ và bốc thăm
   - `TC10`: Khảo sát và phiếu cuối tiết

5. **Quản trị và vận hành (`QT01`–`QT10`, 10 chức năng):**
   - `QT01`: Tài khoản và phân quyền
   - `QT02`: Phân quyền dữ liệu
   - `QT03`: Danh mục dùng chung
   - `QT04`: Chất lượng học liệu
   - `QT05`: Bảo vệ đề và đáp án
   - `QT06`: Lịch sử thao tác
   - `QT07`: Sao lưu và khôi phục
   - `QT08`: Quản lí AI và hạn mức
   - `QT09`: Hỗ trợ nhiều thiết bị
   - `QT10`: Hỗ trợ mạng yếu

6. **Nghiên cứu và minh chứng (`NC01`–`NC06`, 6 chức năng):**
   - `NC01`: Ghi nhận quá trình học
   - `NC02`: Theo dõi cơ chế đề xuất
   - `NC03`: Đánh giá trước và sau
   - `NC04`: Đo hỗ trợ giáo viên
   - `NC05`: Xuất dữ liệu mã hóa định danh
   - `NC06`: Lưu phiên bản thử nghiệm

---

## 3. Căn Cứ Cơ Sở Dữ Liệu & Bộ 13 Bảng Ảnh Thiết Kế

1. **Bộ 13 Bảng Ảnh Giao Diện (UI Mockups):**
   - Bảng 01: `HS01–HS06`
   - Bảng 02: `HS07–HS12`
   - Bảng 03: `HS13–HS18`
   - Bảng 04: `HS19–HS21; GV01–GV03`
   - Bảng 05: `GV04–GV09` — **dùng bản sửa cuối**
   - Bảng 06: `GV10–GV15`
   - Bảng 07: `KT01–KT06` — **dùng bản sửa cuối**
   - Bảng 08: `KT07–KT12`
   - Bảng 09: `KT13–KT16; TC01–TC02`
   - Bảng 10: `TC03–TC08`
   - Bảng 11: `TC09–TC10; QT01–QT04`
   - Bảng 12: `QT05–QT10`
   - Bảng 13: `NC01–NC06`

2. **Cơ Sở Dữ Liệu Nền Tảng (001_nen_tang.sql & 002_danh_muc.sql):**
   - **21 Bảng Public:** `profiles`, `subjects`, `textbooks`, `curricula`, `chapters`, `topics`, `learning_outcomes`, `classes`, `class_memberships`, `lessons`, `lesson_versions`, `questions`, `question_versions`, `question_outcomes`, `question_items`, `assignments`, `assignment_lessons`, `assignment_questions`, `submissions`, `lesson_progress`, `personal_notes`.
   - **5 Bảng Private:** `private.user_roles`, `private.reviewer_scopes`, `private.audit_log`, `private.answer_keys`, `private.submission_grades`.
   - **12 Môn THCS:** Toán, Ngữ văn, Ngoại ngữ 1, GDCD, Lịch sử và Địa lí, KHTN, Công nghệ, Tin học, GDTC, Nghệ thuật, HĐTN-HN, GDĐP.

---

## 4. Nguyên Tắc Bước Hiện Tại

1. Bước hiện tại chỉ sửa khung, menu, danh mục chức năng và màn hình đăng nhập.
2. Mỗi chức năng có trang riêng, hiển thị đầy đủ thông tin: Đầu vào, Xử lí, Đầu ra, Điều kiện chấp nhận.
3. Chức năng chưa có ghi rõ **“Chưa triển khai”** và vô hiệu hóa nút; tuyệt đối không giả thành công, không tự tuyên bố RLS an toàn hoặc chức năng đã nghiệm thu.
4. Frontend chỉ nhận hai biến: `VITE_SUPABASE_URL` và `VITE_SUPABASE_PUBLISHABLE_KEY`. Tuyệt đối không đưa khóa quản trị vào frontend.
