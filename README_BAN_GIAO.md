# BÁO CÁO BÀN GIAO SẢN PHẨM SMART EDU THCS
**Tên đầy đủ:** Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS  
**Phiên bản bàn giao:** 1.0 (Bản sửa chuẩn 05/07)  
**Phạm vi áp dụng:** Học sinh THCS (Khối lớp 6, 7, 8, 9), Giáo viên bộ môn, Hội đồng thẩm định chuyên môn và Ban quản trị.  
**Bộ sách giáo khoa chuẩn:** Kết nối tri thức với cuộc sống (12 môn học THCS).

---

## 1. TỔNG QUAN KIẾN TRÚC & CÔNG NGHỆ

Hệ thống được thiết kế theo mô hình lai (hybrid-ready) tối ưu cho việc triển khai linh hoạt:
- **Giao diện người dùng (Frontend):** React 19 + TypeScript + Vite + Tailwind CSS v4.
- **Quy chuẩn hiển thị:** Phông chữ chuẩn *Times New Roman*, kích thước cơ bản 18px (văn bản học liệu và nội dung chính), màu xanh công nghệ chủ đạo (`#1A56DB`), hoàn toàn đáp ứng (responsive) trên máy tính bảng và điện thoại di động.
- **Cơ sở dữ liệu & Xác thực (Backend & Auth):** Supabase (PostgreSQL 15+ & Supabase Auth).
  - Phân quyền nghiêm ngặt qua hàm RPC máy chủ `public.current_access()`.
  - Phân tách schema riêng tư: `private.user_roles`, `private.reviewer_scopes`, `private.audit_log`.
  - Kiểm soát truy cập mức hàng (Row Level Security - RLS) trên toàn bộ bảng dữ liệu.
- **Máy chủ ứng dụng (Server):** Node.js Express với kiến trúc tách lớp adapter:
  - Adapter cục bộ / AI Studio: `server.ts` tích hợp `vite.middlewares` trên cổng 3000.
  - Adapter Vercel Serverless: `api/[...path].ts` chuyển tiếp yêu cầu đến `server/adapters/vercel.ts` thông qua `vercel.json`.

---

## 2. HƯỚNG DẪN CÀI ĐẶT VÀ CHẠY DỰ ÁN

### 2.1 Yêu cầu môi trường
- Node.js >= 20.x
- Trình quản lý gói: `npm` hoặc `bun`

### 2.2 Biến môi trường (.env)
Sao chép tệp mẫu `.env.example` thành `.env` và điền cấu hình Supabase:
```bash
# Cấu hình Client (Vite)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# Cấu hình Server đặc quyền (Backend RLS bypass khi cần thiết)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Cổng máy chủ phát triển
PORT=3000
```

### 2.3 Cài đặt thư viện và khởi động
```bash
# 1. Cài đặt các gói phụ thuộc
npm install

# 2. Khởi chạy môi trường phát triển (Dev Server)
npm run dev
# Ứng dụng chạy tại địa chỉ: http://localhost:3000

# 3. Kiểm tra mã nguồn (Lint & Typecheck)
npm run lint

# 4. Đóng gói sản phẩm (Production Build)
npm run build

# 5. Khởi chạy bản đóng gói hoàn chỉnh
npm start
```

---

## 3. THỨ TỰ THỰC THI MIGRATION CƠ SỞ DỮ LIỆU

Để khởi tạo trọn vẹn CSDL 21+5 bảng theo bản đặc tả và quy chuẩn Smart EDU, thực thi 3 tệp SQL trong thư mục `database/` theo đúng thứ tự:

1. **`database/sql_reference/001_nen_tang.sql`**:
   - Thiết lập cấu trúc nền tảng, schema `private`, cơ chế mã hóa mật khẩu, bảng `private.user_roles`, `private.reviewer_scopes`, `private.audit_log`, `public.subjects`, `public.curricula`.
   - Cài đặt hàm RPC `public.current_access()` lấy quyền thực của tài khoản đăng nhập.
   - Kích hoạt trigger `private.on_signup()` tự động gán vai trò `'student'` cho người dùng mới đăng ký, ngăn chặn việc tự nâng quyền.

2. **`database/sql_reference/002_danh_muc.sql`**:
   - Nạp toàn bộ danh mục 12 môn học THCS và bộ sách Kết nối tri thức với cuộc sống.
   - Nạp cấu trúc chương, bài học cho các môn học đại diện (Tin học 6, Toán, Khoa học tự nhiên...).

3. **`database/migrations/003_smart_edu_thcs_schema.sql`**:
   - Bổ sung các bảng nghiệp vụ thực thi:
     - `public.classes` & `public.class_students`: Quản lý lớp học và danh sách học sinh.
     - `public.interactive_lessons`: Lưu trữ gói học liệu HTML độc lập, trạng thái kiểm duyệt và phiên bản.
     - `public.questions`: Ngân hàng câu hỏi trắc nghiệm, tự luận, ma trận và barem chấm điểm.
     - `public.assignments` & `public.assignment_questions`: Giao bài tập, bài kiểm tra thường xuyên/định kỳ.
     - `public.submissions`: Quản lý bài làm học sinh, điểm tự động và nhận xét chi tiết của giáo viên.
     - `public.student_qa`: Hỏi đáp hai chiều giữa học sinh và giáo viên.
     - `public.student_mistakes`: Sổ câu sai cá nhân hóa phục vụ ôn tập trọng tâm.
     - `public.student_study_plans`: Kế hoạch học tập cá nhân.
   - Kích hoạt RLS policies cho từng nhóm đối tượng người dùng.

---

## 4. TÀI KHOẢN VÀ PHÂN QUYỀN TRUY CẬP

Hệ thống tuân thủ chặt chẽ nguyên tắc bảo mật: **Không cho phép người đăng ký tự chọn vai trò (admin/teacher/reviewer) ở giao diện**.
Khi đăng ký tài khoản mới qua Supabase Auth, trigger CSDL sẽ mặc định gán vai trò `student`. Việc phân quyền Giáo viên, Người thẩm định chuyên môn và Quản trị viên chỉ được thực hiện bởi Quản trị viên thông qua bảng `private.user_roles`.

### Danh sách tài khoản thử nghiệm hệ thống:
| Tài khoản | Email đăng nhập | Vai trò | Quyền hạn và phạm vi |
| :--- | :--- | :--- | :--- |
| **Học sinh** | `hocsinh6a@smartedu.edu.vn` | `student` | Truy cập 9 mục học sinh: Góc học tập, Học tương tác, Ôn tập, Kiểm tra, Trò chơi, Tiến bộ, Sổ câu sai, Kế hoạch, Hỏi giáo viên. |
| **Giáo viên** | `an.nv@thcs.edu.vn` | `teacher` | Truy cập 9 mục giáo viên: Bàn làm việc, Lớp học, Soạn bài tương tác, Ngân hàng câu hỏi, Giao bài, Hồ sơ kiểm tra 5 bước, Trò chơi, Chấm bài, Trao đổi với học sinh. |
| **Người thẩm định** | `reviewer.tinhoc@thcs.edu.vn` | `reviewer` | Thẩm định và duyệt bài học HTML, câu hỏi trắc nghiệm theo môn học được phân công trong `private.reviewer_scopes`. |
| **Quản trị viên** | `dieptoan1984@gmail.com` | `admin` | Toàn quyền quản trị danh mục môn, phân công thẩm định, cấp quyền người dùng, xem nhật ký kiểm toán hệ thống. |

*Lưu ý:* Trong trường hợp chạy thử nghiệm ngoại tuyến (Demo Mode), giao diện có cung cấp cơ chế chuyển đổi góc nhìn trực quan (View Switcher) có gắn nhãn rõ ràng để phục vụ việc kiểm thử nhanh toàn bộ luồng mà không vi phạm tính toàn vẹn của CSDL thực tế.

---

## 5. CÁC LUỒNG NGHIỆP VỤ LIÊN THÔNG ĐÃ HOÀN THIỆN

### 5.1 Luồng Học liệu Tương tác Khép kín (End-to-End)
1. **Giáo viên soạn học liệu (GV01 - GV03):** Giáo viên nhập nội dung học tập trực tiếp hoặc tải lên tệp bài giảng HTML độc lập (Standalone HTML Package).
2. **Hội đồng chuyên môn thẩm định (QT01 - QT03):** Người duyệt mở gói bài học trong iframe sandbox an toàn (`sandbox="allow-scripts allow-modals"`), kiểm tra chất lượng và ấn "Phê duyệt" hoặc "Yêu cầu sửa" (kèm lý do sư phạm cụ thể).
3. **Học sinh học tập trực quan (HS01 - HS06):** Bài học được phê duyệt sẽ lập tức xuất hiện trong danh mục học của học sinh. Học sinh trải nghiệm đầy đủ các pha: *Khởi động $\rightarrow$ Khám phá $\rightarrow$ Kiến thức $\rightarrow$ Luyện tập $\rightarrow$ Vận dụng $\rightarrow$ Tự kiểm tra*, ghi chú bài học và nhận phản hồi tương tác tức thì.

### 5.2 Luồng Kiểm tra, Đánh giá và Chấm bài
1. **Quản lý câu hỏi & Hồ sơ kiểm tra (GV04 - GV07, KT01 - KT16):**
   - Giáo viên thêm câu hỏi đơn lẻ hoặc nhập nhanh tệp CSV có kiểm tra cấu trúc từng dòng.
   - Tạo bộ hồ sơ kiểm tra 5 bước chuẩn hóa (Ma trận $\rightarrow$ Bản đặc tả $\rightarrow$ Đề kiểm tra $\rightarrow$ Đáp án $\rightarrow$ Hướng dẫn chấm).
   - Xuất trọn bộ hồ sơ kiểm tra ra định dạng file `.doc` (Word) chuẩn thể thức ngành Giáo dục chỉ với 1 cú click.
2. **Giao bài & Học sinh nộp bài (GV05, HS08 - HS11):**
   - Giáo viên giao bài kiểm tra tới lớp học, thiết lập thời gian làm bài, hạn chót và chính sách xem đáp án.
   - Học sinh làm bài trực tuyến với đồng hồ đếm ngược và nộp bài. Hệ thống tự động chấm phần trắc nghiệm khách quan.
3. **Chấm bài tự luận & Công bố kết quả (GV08 - GV09, HS10):**
   - Giáo viên vào khu vực "Chấm bài & Kết quả", xem bài nộp chi tiết của từng em, chấm phần tự luận theo barem điểm và ghi lời nhận xét cá nhân hóa.
   - Sau khi giáo viên bấm "Công bố kết quả", học sinh sẽ nhận được điểm tổng và xem lại bài làm kèm nhận xét của thầy cô.

### 5.3 Luồng Chăm sóc Cá nhân hóa & Trợ giúp Học tập
- **Sổ câu sai tự động (HS13 - HS15):** Mọi câu hỏi học sinh trả lời sai trong quá trình luyện tập và kiểm tra được tự động lưu vào Sổ câu sai kèm giải thích chi tiết, cho phép học sinh ôn tập lại bất kỳ lúc nào.
- **Kế hoạch học tập (HS16 - HS18):** Học sinh tự đặt mục tiêu điểm số và thời gian ôn luyện mỗi ngày.
- **Hỏi đáp hai chiều (HS19 - HS21, GV14 - GV15):** Học sinh gửi câu hỏi thắc mắc kèm bài học liên quan, giáo viên tiếp nhận trên Bàn làm việc và trả lời trực tiếp.

---

## 6. BẢO MẬT VÀ AN TOÀN HỆ THỐNG

1. **Cô lập mã nguồn học liệu (Iframe Sandbox Isolation):**
   - Gói bài học HTML của giáo viên tải lên được nhúng trong thẻ iframe với thuộc tính:  
     `sandbox="allow-scripts allow-modals"` (tuyệt đối không cấp `allow-same-origin`).
   - Mã lệnh JavaScript bên trong bài học HTML không thể truy cập `localStorage`, `cookie` hay token phiên của ứng dụng cha Smart EDU.
2. **Bảo mật cơ sở dữ liệu:**
   - Khóa bí mật máy chủ (`SUPABASE_SERVICE_ROLE_KEY`) chỉ nằm tại môi trường backend Node.js, không bao giờ lộ ra trình duyệt client.
   - Mọi truy vấn từ trình duyệt đều đi qua Anon Key và bị kiểm soát bởi các chính sách Row Level Security (RLS) của PostgreSQL.

---

## 7. GIỚI HẠN HIỆN TẠI VÀ LỘ TRÌNH NÂNG CẤP TIẾP THEO

- **Hệ thống tệp tĩnh mở rộng:** Các tệp hình ảnh đính kèm câu hỏi đang được lưu trữ dưới dạng Data URI hoặc đường dẫn CDN; lộ trình tiếp theo có thể tích hợp Supabase Storage bucket riêng biệt.
- **Tính năng giám sát thi chống gian lận nâng cao (KT11):** Hiện tại đã có cơ chế cảnh báo rời tab và khóa thời gian làm bài; có thể phát triển thêm tính năng chụp ảnh ngẫu nhiên bằng webcam nếu có yêu cầu thi trực tuyến tập trung.
