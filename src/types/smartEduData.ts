/**
 * Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS
 * Căn cứ: Bản đặc tả 1.0 (78 chức năng, 6 nhóm nghiệp vụ, 13 bảng giao diện)
 * Căn cứ CSDL: 001_nen_tang.sql (21 bảng public, 5 bảng private) và 002_danh_muc.sql
 * Phạm vi: Lớp 6, 7, 8, 9 - Tất cả các môn THCS
 */

export type UserRole = 'student' | 'teacher' | 'reviewer' | 'admin' | 'researcher' | 'guest';

export interface SmartEduRoleInfo {
  code: UserRole;
  name: string;
  description: string;
  scope: string;
}

export const SMART_EDU_ROLES: SmartEduRoleInfo[] = [
  {
    code: 'student',
    name: 'Học sinh',
    description: 'Học liệu đã duyệt phù hợp; nhiệm vụ được giao; bài làm, ghi chú và tiến bộ của mình',
    scope: 'Không xem bài làm người khác; không truy cập đáp án trước thời điểm công bố'
  },
  {
    code: 'teacher',
    name: 'Giáo viên',
    description: 'Lớp được phân công; học liệu sở hữu/được chia sẻ; giao bài, chấm bài và hồ sơ kiểm tra theo quyền',
    scope: 'Không mặc nhiên xem lớp khác; không tự cấp quyền quản trị hoặc quyền duyệt'
  },
  {
    code: 'reviewer',
    name: 'Người duyệt',
    description: 'Duyệt học liệu, câu hỏi và hồ sơ trong phạm vi bộ môn được phân công',
    scope: 'Quyền duyệt nội dung không đồng nghĩa quyền xem toàn bộ dữ liệu học sinh'
  },
  {
    code: 'admin',
    name: 'Quản trị viên',
    description: 'Tài khoản, danh mục, cấu hình, phân quyền và vận hành hệ thống',
    scope: 'Truy cập dữ liệu nhạy cảm phải có phạm vi và nhật kí; không sửa điểm âm thầm'
  },
  {
    code: 'researcher',
    name: 'Nghiên cứu viên',
    description: 'Đánh giá hiệu quả phương pháp sư phạm, xuất dữ liệu mã hóa định danh',
    scope: 'Tệp xuất không chứa danh tính cá nhân ngoài phạm vi nghiên cứu đã duyệt'
  },
  {
    code: 'guest',
    name: 'Khách',
    description: 'Xem giới thiệu và học liệu được đánh dấu công khai',
    scope: 'Không xem dữ liệu lớp, kết quả cá nhân, đề chưa mở hoặc đáp án bảo vệ'
  }
];

export interface THCSSubject {
  code: string;
  name: string;
}

/**
 * Kiểu dữ liệu bảng public.subjects theo 001_nen_tang.sql (id, code, name, active)
 * Tuyệt đối KHÔNG có cột grade_levels trong bảng subjects
 */
export interface SubjectItem {
  id: string;
  code: string;
  name: string;
  active: boolean;
}

/**
 * Kiểu dữ liệu bảng public.textbooks theo 001_nen_tang.sql (id, code, name)
 */
export interface TextbookItem {
  id: string;
  code: string;
  name: string;
}

/**
 * Kiểu dữ liệu bảng public.curricula theo 001_nen_tang.sql (id, grade, subject_id, textbook_id)
 * Lọc môn theo khối lớp 6–9 và bộ sách thông qua liên kết curricula -> subjects & textbooks
 */
export interface CurriculumItem {
  id: string;
  grade: number;
  subject_id: string;
  textbook_id: string;
  subjects?: SubjectItem;
  textbooks?: TextbookItem;
}

export const THCS_SUBJECTS: THCSSubject[] = [
  { code: 'toan', name: 'Toán' },
  { code: 'ngu_van', name: 'Ngữ văn' },
  { code: 'ngoai_ngu_1', name: 'Ngoại ngữ 1' },
  { code: 'gdcd', name: 'Giáo dục công dân' },
  { code: 'lich_su_dia_li', name: 'Lịch sử và Địa lí' },
  { code: 'khtn', name: 'Khoa học tự nhiên' },
  { code: 'cong_nghe', name: 'Công nghệ' },
  { code: 'tin_hoc', name: 'Tin học' },
  { code: 'gdtc', name: 'Giáo dục thể chất' },
  { code: 'nghe_thuat', name: 'Nghệ thuật' },
  { code: 'hdtn_hn', name: 'Hoạt động trải nghiệm, hướng nghiệp' },
  { code: 'gddp', name: 'Nội dung giáo dục địa phương' }
];

export const THCS_GRADES = [6, 7, 8, 9] as const;
export type THCSGrade = typeof THCS_GRADES[number];

export const THCS_TEXTBOOKS = [
  { code: 'KNTT', name: 'Kết nối tri thức với cuộc sống (Ưu tiên ban đầu)' }
];

export interface FunctionItem {
  code: string;
  title: string;
  groupId: 'HocSinh' | 'GiaoVien' | 'KiemTra' | 'TroChoi' | 'QuanTri' | 'NghienCuu';
  groupName: string;
  groupRange: string;
  board: string;
  dauVao: string;
  xuLi: string;
  dauRa: string;
  chapNhan: string;
  status: 'CHUA_TRIEN_KHAI';
}

export interface FunctionGroup {
  id: 'HocSinh' | 'GiaoVien' | 'KiemTra' | 'TroChoi' | 'QuanTri' | 'NghienCuu';
  name: string;
  range: string;
  menuPath: string;
  description: string;
  functions: FunctionItem[];
}

export interface UIBoardDesign {
  boardNumber: string;
  name: string;
  functionRange: string;
  notes?: string;
  description: string;
}

export const UI_BOARDS: UIBoardDesign[] = [
  { boardNumber: '01', name: 'Bảng 01: Học tập cá nhân', functionRange: 'HS01–HS06', description: 'Trang học tập cá nhân, chọn nội dung, kiểm tra đầu vào, bài học tương tác, mô phỏng thí nghiệm' },
  { boardNumber: '02', name: 'Bảng 02: Ôn tập & Hỗ trợ học tập', functionRange: 'HS07–HS12', description: 'Gợi ý từng bước, ghi chú đánh dấu, tự kiểm tra, ôn tập phạm vi/mức độ, sổ câu sai' },
  { boardNumber: '03', name: 'Bảng 03: Luyện đề & Đánh giá tiến bộ', functionRange: 'HS13–HS18', description: 'Đề xuất hoạt động, luyện đề, làm bài kiểm tra lớp/mã, nộp tự luận, kết quả tiến bộ' },
  { boardNumber: '04', name: 'Bảng 04: Tương tác & Khởi tạo sư phạm', functionRange: 'HS19–HS21; GV01–GV03', description: 'Học sinh: Trò chơi, hỏi đáp AI, nhắc học; Giáo viên: Quản lí lớp, chương trình, soạn bài học' },
  { boardNumber: '05', name: 'Bảng 05: Học liệu & Ngân hàng câu hỏi (Bản sửa cuối)', functionRange: 'GV04–GV09', notes: 'Dùng bản sửa cuối', description: 'Nhập học liệu, ngân hàng câu hỏi, nhập xuất Excel, duyệt nội dung, giao nhiệm vụ' },
  { boardNumber: '06', name: 'Bảng 06: Chấm bài & Điều phối dạy học', functionRange: 'GV10–GV15', description: 'Theo dõi học, chấm bài nhận xét, phân tích câu hỏi, báo cáo lớp học, chia sẻ chuyên môn, trợ lý AI' },
  { boardNumber: '07', name: 'Bảng 07: Ma trận & Đặc tả kiểm tra (Bản sửa cuối)', functionRange: 'KT01–KT06', notes: 'Dùng bản sửa cuối', description: 'Thiết lập bài kiểm tra, cấu hình mẫu, cơ cấu đề, tạo ma trận, tạo bản đặc tả, tạo đề' },
  { boardNumber: '08', name: 'Bảng 08: Soạn đề, Đáp án & Đối chiếu', functionRange: 'KT07–KT12', description: 'Soạn câu còn thiếu, tạo đáp án, hướng dẫn chấm, đối chiếu hồ sơ, cảnh báo lỗi, tạo mã đề' },
  { boardNumber: '09', name: 'Bảng 09: Duyệt hồ sơ & Khởi tạo trò chơi', functionRange: 'KT13–KT16; TC01–TC02', description: 'Duyệt bộ hồ sơ, xuất hồ sơ, chuyển online, thẩm định; Tạo trò chơi ngân hàng, theo hoạt động' },
  { boardNumber: '10', name: 'Bảng 10: Thư viện & Phòng chơi trực tiếp', functionRange: 'TC03–TC08', description: 'Thư viện mẫu, phòng chơi trực tiếp, cá nhân/nhóm, phản hồi trò chơi, gọi tên ngẫu nhiên, chia nhóm' },
  { boardNumber: '11', name: 'Bảng 11: Tiện ích lớp & Phân quyền nền tảng', functionRange: 'TC09–TC10; QT01–QT04', description: 'Đồng hồ bốc thăm, khảo sát phiếu cuối tiết; Quản trị tài khoản, phân quyền dữ liệu, danh mục, chất lượng' },
  { boardNumber: '12', name: 'Bảng 12: An ninh đề & Vận hành đa thiết bị', functionRange: 'QT05–QT10', description: 'Bảo vệ đề/đáp án, nhật kí thao tác, sao lưu khôi phục, quản lí AI, hỗ trợ đa thiết bị, hỗ trợ mạng yếu' },
  { boardNumber: '13', name: 'Bảng 13: Nghiên cứu & Đo nghiệm sư phạm', functionRange: 'NC01–NC06', description: 'Ghi nhận quá trình học, cơ chế đề xuất, đánh giá trước sau, đo hỗ trợ giáo viên, xuất dữ liệu mã hóa, lưu phiên bản' }
];

export const UI_BOARD_DESIGNS = UI_BOARDS;

export const SMART_EDU_78_FUNCTIONS: FunctionItem[] = [
  {
    "code": "HS01",
    "title": "Trang học tập cá nhân",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "01",
    "dauVao": "Tài khoản, lớp, nhiệm vụ",
    "xuLi": "Tổng hợp theo quyền; tiếp tục bài gần nhất",
    "dauRa": "Thẻ bài học, hạn nộp, lịch, tiến độ",
    "chapNhan": "HS chỉ thấy dữ liệu của mình; chưa có dữ liệu có hướng dẫn bắt đầu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS02",
    "title": "Chọn nội dung học",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "01",
    "dauVao": "Khối, môn, bộ sách, kỳ",
    "xuLi": "Lọc chương/bài; xem trước rồi mở bài",
    "dauRa": "Danh sách học liệu đã duyệt đúng ngữ cảnh",
    "chapNhan": "Đổi lớp hoặc sách không hiển thị nhầm nội dung cũ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS03",
    "title": "Kiểm tra đầu vào",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "01",
    "dauVao": "Phạm vi, bộ câu đã duyệt",
    "xuLi": "Làm bài; ghi câu trả lời theo yêu cầu cần đạt",
    "dauRa": "Kết quả ban đầu và nội dung cần kiểm tra thêm",
    "chapNhan": "Không kết luận thành thạo từ một câu; thiếu dữ liệu phải nêu rõ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS04",
    "title": "Học bài tương tác",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "01",
    "dauVao": "Phiên bản bài học",
    "xuLi": "Khởi động, khám phá, kiến thức, luyện tập, vận dụng, đánh giá",
    "dauRa": "Tiến độ và kết quả từng hoạt động",
    "chapNhan": "Tải lại tiếp tục đúng phiên; không hoàn thành chỉ vì mở trang",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS05",
    "title": "Tương tác đa dạng",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "01",
    "dauVao": "Cấu hình câu và tiêu chí",
    "xuLi": "Chọn, kéo thả, ghép, sắp xếp, điền, phân loại",
    "dauRa": "Câu trả lời, phản hồi, lượt thử",
    "chapNhan": "Có cách thao tác bằng bàn phím; hiển thị đúng đáp án và công thức",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS06",
    "title": "Mô phỏng và thí nghiệm ảo",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "01",
    "dauVao": "Mô hình đã duyệt, tham số",
    "xuLi": "Đổi tham số trong miền cho phép; ghi quan sát",
    "dauRa": "Trạng thái mô hình và nhận xét học sinh",
    "chapNhan": "Không nhập tham số ngoài miền; nêu giả định/giới hạn mô hình",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS07",
    "title": "Gợi ý từng bước",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "02",
    "dauVao": "Câu đang làm, bộ gợi ý",
    "xuLi": "Mở lần lượt; ghi số gợi ý đã dùng",
    "dauRa": "Gợi ý tăng dần và lượt sử dụng",
    "chapNhan": "Không tự lộ toàn bộ lời giải; kết quả có dấu hiệu đã nhận hỗ trợ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS08",
    "title": "Ghi chú và đánh dấu",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "02",
    "dauVao": "Nội dung, vị trí trong bài",
    "xuLi": "Tạo, sửa, xóa ghi chú cá nhân",
    "dauRa": "Ghi chú gắn đúng phiên bản/vị trí",
    "chapNhan": "HS khác không đọc được; lưu lại sau đăng nhập lại",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS09",
    "title": "Tự kiểm tra cuối bài",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "02",
    "dauVao": "Bộ câu cuối bài",
    "xuLi": "Trả lời, nộp, xem phản hồi theo chính sách",
    "dauRa": "Kết quả theo nội dung và mục cần ôn",
    "chapNhan": "Tính điểm đúng cấu hình; tự luận chưa chấm phải có nhãn chờ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS10",
    "title": "Ôn tập theo phạm vi",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "02",
    "dauVao": "Bài/chương/GK1/CK1/GK2/CK2",
    "xuLi": "Chọn nội dung từ phạm vi đã cấu hình",
    "dauRa": "Phiên ôn và danh sách câu phù hợp",
    "chapNhan": "Không lấy bài ngoài phạm vi; thiếu câu phải báo",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS11",
    "title": "Ôn tập theo mức độ",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "02",
    "dauVao": "Biết, Hiểu, Vận dụng",
    "xuLi": "Chọn mức hoặc phối hợp theo cấu hình",
    "dauRa": "Bộ bài và tiến độ luyện",
    "chapNhan": "Mức độ theo từng câu/ý; không suy ra chỉ từ độ dài câu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS12",
    "title": "Sổ câu sai",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "02",
    "dauVao": "Câu sai và dữ liệu lượt làm",
    "xuLi": "Lọc, xem giải thích, luyện bài tương đương",
    "dauRa": "Lịch sử lỗi và kết quả luyện lại",
    "chapNhan": "Không xóa lịch sử khi làm đúng; tránh tính lại cùng câu như bằng chứng độc lập",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS13",
    "title": "Đề xuất hoạt động tiếp theo",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "03",
    "dauVao": "Bằng chứng theo nội dung",
    "xuLi": "Áp dụng quy tắc phiên bản hóa; cho chọn hoạt động khác",
    "dauRa": "Hoạt động đề xuất và lí do",
    "chapNhan": "Thiếu dữ liệu đề xuất khảo sát; không đưa đáp án bài kiểm tra đang mở",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS14",
    "title": "Luyện đề",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "03",
    "dauVao": "Phạm vi, thời lượng, đề luyện",
    "xuLi": "Bắt đầu, lưu, nộp và xem giải thích",
    "dauRa": "Kết quả luyện, thời gian, nội dung yếu",
    "chapNhan": "Gắn nhãn đề luyện; không tự ghi vào điểm chính thức",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS15",
    "title": "Kiểm tra theo lớp hoặc mã",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "03",
    "dauVao": "Danh tính, mã, điều kiện dự thi",
    "xuLi": "Kiểm tra quyền, thời gian, số lượt; lưu và nộp",
    "dauRa": "Lượt làm có mã, xác nhận máy chủ",
    "chapNhan": "Không lộ đáp án qua dữ liệu tải về; nộp lặp không sinh hai kết quả",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS16",
    "title": "Nộp tự luận và thực hành",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "03",
    "dauVao": "Văn bản, công thức, ảnh/tệp",
    "xuLi": "Lưu nháp, kiểm tra tệp, xác nhận nộp",
    "dauRa": "Bài nộp và biên nhận",
    "chapNhan": "Tệp sai định dạng bị từ chối; nháp không bị coi đã nộp",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS17",
    "title": "Kết quả và nhận xét",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "03",
    "dauVao": "Bài làm, điểm, chính sách công bố",
    "xuLi": "Hiển thị phần đã được phép xem",
    "dauRa": "Điểm, tiêu chí, nhận xét, đáp án được công bố",
    "chapNhan": "Chưa chấm/đang phúc tra có trạng thái riêng; không quy về 0 tùy tiện",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS18",
    "title": "Theo dõi tiến bộ",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "03",
    "dauVao": "Kết quả qua các lần và phiên bản",
    "xuLi": "Tổng hợp theo môn, nội dung, thời gian",
    "dauRa": "Xu hướng và nội dung cần củng cố",
    "chapNhan": "Phân biệt có/không gợi ý, thiếu bài và bài đã chấm; đồ thị có mẫu số",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS19",
    "title": "Tham gia trò chơi",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "04",
    "dauVao": "Mã phòng, danh tính/nhóm",
    "xuLi": "Vào phòng theo quyền; nhận câu, gửi lượt chơi",
    "dauRa": "Trạng thái phòng, điểm chơi, phản hồi",
    "chapNhan": "Mất kết nối có cách vào lại; không giả định đã chống gian lận hoàn toàn",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS20",
    "title": "Hỏi đáp và trợ lý AI",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "04",
    "dauVao": "Câu hỏi, tệp hợp lệ, ngữ cảnh",
    "xuLi": "Gửi GV hoặc hỏi AI theo quyền/hạn mức",
    "dauRa": "Trao đổi và nguồn tham chiếu nếu có",
    "chapNhan": "AI không bịa nguồn; lỗi AI có thông báo; không trả đáp án đề đang bảo vệ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "HS21",
    "title": "Kế hoạch và nhắc học",
    "groupId": "HocSinh",
    "groupName": "Học sinh",
    "groupRange": "HS01–HS21",
    "board": "04",
    "dauVao": "Mục tiêu, nhiệm vụ, hạn",
    "xuLi": "Tạo/sửa kế hoạch; bật thông báo trong web",
    "dauRa": "Lịch cá nhân và nhắc việc",
    "chapNhan": "Dùng múi giờ Việt Nam; chưa bao gồm gửi SMS/email tự động\n\n6 Chức năng giáo viên\nPhạm vi sử dụng theo quyền tại mục 2; mỗi mã có điều kiện nghiệm thu riêng.\nMã và chức năng\nĐầu vào và xử lí\nĐầu ra và điều kiện nghiệm thu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV01",
    "title": "Quản lí lớp và học sinh",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "04",
    "dauVao": "Tên lớp, danh sách, năm học",
    "xuLi": "Tạo lớp, nhập thành viên, nhóm, mã tham gia",
    "dauRa": "Lớp và quan hệ thành viên",
    "chapNhan": "Chỉ GV được phân công thao tác; phát hiện trùng học sinh",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV02",
    "title": "Quản lí chương trình",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "04",
    "dauVao": "Khối/môn/sách/chương/bài/YCCĐ",
    "xuLi": "Tạo và gắn phạm vi từng kỳ",
    "dauRa": "Danh mục có mã ổn định",
    "chapNhan": "Không xóa cứng mục đang có câu hỏi; đổi tên không mất liên kết",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV03",
    "title": "Soạn bài học tương tác",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "04",
    "dauVao": "Mục tiêu, khối nội dung, hoạt động",
    "xuLi": "Kéo sắp khối, nhập tương tác, xem trước",
    "dauRa": "Bản nháp học liệu có phiên bản",
    "chapNhan": "Có đủ hoạt động theo mẫu chọn; lưu nháp khác gửi duyệt",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV04",
    "title": "Nhập học liệu",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "05",
    "dauVao": "Tệp theo mẫu, ánh xạ trường",
    "xuLi": "Kiểm tra cấu trúc, mã và nội dung; xem trước",
    "dauRa": "Bản nháp và báo cáo nhập",
    "chapNhan": "Không thực thi mã/script từ tệp; không âm thầm nhập dữ liệu lỗi",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV05",
    "title": "Ngân hàng câu hỏi",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "05",
    "dauVao": "Câu, đáp án, điểm, metadata",
    "xuLi": "Tạo/sửa/lọc/nhân bản; xem nguồn",
    "dauRa": "Câu hỏi và phiên bản",
    "chapNhan": "Mỗi mã duy nhất; câu đã dùng đề chốt không bị sửa ngược",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV06",
    "title": "Nhập và xuất Excel",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "05",
    "dauVao": "Mẫu sáu sheet, tệp và chế độ nhập",
    "xuLi": "Kiểm tra từng dòng/ý; xử lí trùng; xác nhận nhập",
    "dauRa": "Câu hợp lệ và báo cáo lỗi dòng/cột",
    "chapNhan": "Xuất rồi nhập lại giữ đúng bốn ý đúng–sai, mức độ và đáp án",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV07",
    "title": "Duyệt nội dung",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "05",
    "dauVao": "Bản nháp, nguồn, ý kiến",
    "xuLi": "Duyệt hoặc yêu cầu sửa theo quyền",
    "dauRa": "Trạng thái và lịch sử người duyệt",
    "chapNhan": "Chưa duyệt không xuất hiện ở kho HS; sửa nội dung đã duyệt tạo bản mới",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV08",
    "title": "Giao nhiệm vụ",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "05",
    "dauVao": "Học liệu, đối tượng, hạn",
    "xuLi": "Xác nhận phiên bản và phạm vi rồi giao",
    "dauRa": "Nhiệm vụ theo lớp/nhóm/cá nhân",
    "chapNhan": "HS ngoài đối tượng không truy cập; hạn nộp hiển thị thống nhất",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV09",
    "title": "Giao bài phân hóa",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "05",
    "dauVao": "Kết quả và nhóm, bài phù hợp",
    "xuLi": "Gợi ý nhóm; GV xem và điều chỉnh",
    "dauRa": "Gói nhiệm vụ theo nhóm/cá nhân",
    "chapNhan": "GV ghi đè được; không công khai nhãn nhóm yếu cho cả lớp",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV10",
    "title": "Theo dõi việc học",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "06",
    "dauVao": "Lớp và nhiệm vụ được quyền xem",
    "xuLi": "Lọc trạng thái; xem chi tiết hoạt động",
    "dauRa": "Bảng hoàn thành và nội dung khó",
    "chapNhan": "Tách chưa bắt đầu, đang làm, đã nộp, đã chấm",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV11",
    "title": "Chấm bài và nhận xét",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "06",
    "dauVao": "Bài nộp, rubric, điểm gợi ý",
    "xuLi": "Chấm từng tiêu chí; sửa có lí do; trả bài",
    "dauRa": "Điểm và nhận xét do GV xác nhận",
    "chapNhan": "Tổng điểm không vượt thang; AI không tự chốt điểm tự luận",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV12",
    "title": "Phân tích câu hỏi",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "06",
    "dauVao": "Bài đã chấm, nhóm dữ liệu",
    "xuLi": "Đếm tỉ lệ đúng và phương án; chỉ số nâng cao nếu đủ dữ liệu",
    "dauRa": "Phân tích kèm cỡ mẫu, công thức",
    "chapNhan": "Đúng–sai thống kê từng ý; cảnh báo mẫu nhỏ, không suy diễn chất lượng",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV13",
    "title": "Báo cáo lớp học",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "06",
    "dauVao": "Phạm vi lớp/môn/thời gian",
    "xuLi": "Tổng hợp, lọc và xuất",
    "dauRa": "Báo cáo tiến độ và khó khăn",
    "chapNhan": "Tổng khớp dữ liệu nguồn; xuất không lộ lớp ngoài quyền",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV14",
    "title": "Chia sẻ tổ chuyên môn",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "06",
    "dauVao": "Học liệu, quyền xem/sao chép/góp ý",
    "xuLi": "Chia sẻ và sao chép có nguồn",
    "dauRa": "Quyền chia sẻ, bản sao và góp ý",
    "chapNhan": "Bản sao tách phiên bản; không chia sẻ bài làm HS mặc định",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "GV15",
    "title": "Trợ lý AI giáo viên",
    "groupId": "GiaoVien",
    "groupName": "Giáo viên",
    "groupRange": "GV01–GV15",
    "board": "06",
    "dauVao": "Môn/lớp/mục tiêu, yêu cầu",
    "xuLi": "Sinh nháp, gợi ý sửa và hoạt động",
    "dauRa": "Bản nháp có dấu nguồn AI",
    "chapNhan": "Đầu ra AI luôn cần duyệt; lỗi kết nối không mất nội dung đã soạn\n\n7 Chức năng hồ sơ kiểm tra\nPhạm vi sử dụng theo quyền tại mục 2; mỗi mã có điều kiện nghiệm thu riêng.\nMã và chức năng\nĐầu vào và xử lí\nĐầu ra và điều kiện nghiệm thu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT01",
    "title": "Thiết lập bài kiểm tra",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "07",
    "dauVao": "Môn/lớp/kỳ/thời gian/thang/phạm vi",
    "xuLi": "Lưu cấu hình và phiên bản",
    "dauRa": "Thông tin chung hồ sơ",
    "chapNhan": "Thiếu trường bắt buộc không sang bước kế tiếp",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT02",
    "title": "Cấu hình mẫu hồ sơ",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "07",
    "dauVao": "Mẫu trường/đơn vị và quy tắc",
    "xuLi": "Nhân bản, chỉnh sửa, lưu phiên bản",
    "dauRa": "Mẫu bố cục và quy tắc",
    "chapNhan": "Nêu rõ mẫu đang dùng; không gắn tuyên bố đúng mọi quy định",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT03",
    "title": "Thiết lập cơ cấu đề",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "07",
    "dauVao": "Dạng câu, điểm, mức độ, nội dung",
    "xuLi": "Tính tổng bằng số thập phân chính xác",
    "dauRa": "Cơ cấu và trạng thái hợp lệ",
    "chapNhan": "10,01 khác 10,00 phải báo lỗi, không làm tròn để bỏ qua",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT04",
    "title": "Tạo ma trận",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "07",
    "dauVao": "Phạm vi/YCCĐ/cơ cấu",
    "xuLi": "Phân bổ theo nội dung, dạng câu, mức độ",
    "dauRa": "Ma trận, tổng ngang/dọc, tỉ lệ điểm",
    "chapNhan": "Tổng từng trục khớp; tách tỉ lệ điểm với tỉ lệ số câu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT05",
    "title": "Tạo bản đặc tả",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "07",
    "dauVao": "Ma trận, YCCĐ có nguồn",
    "xuLi": "Liên kết từng yêu cầu với câu/ý",
    "dauRa": "Bản đặc tả và mã liên kết",
    "chapNhan": "Mọi câu/ý có đối chiếu; ô tự luận nhiều ý được biểu diễn riêng",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT06",
    "title": "Tạo đề kiểm tra",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "07",
    "dauVao": "Ma trận, câu đã duyệt",
    "xuLi": "Chọn câu đủ ràng buộc, thay và sắp thứ tự",
    "dauRa": "Bản đề gắn mã câu/phiên bản",
    "chapNhan": "Thiếu câu báo rõ; thay câu phải kiểm lại ma trận và đáp án",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT07",
    "title": "Soạn câu còn thiếu",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "08",
    "dauVao": "Ô thiếu, mức độ, YCCĐ",
    "xuLi": "GV/AI tạo nháp rồi duyệt",
    "dauRa": "Câu mới trạng thái chờ duyệt",
    "chapNhan": "Không tự đưa câu AI chưa duyệt vào đề chính thức",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT08",
    "title": "Tạo đáp án",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "08",
    "dauVao": "Đề theo phiên bản, đáp án gốc",
    "xuLi": "Đồng bộ từng câu/ý và dạng câu",
    "dauRa": "Đáp án trắc nghiệm và mẫu tự luận",
    "chapNhan": "Không có câu thiếu đáp án; chấp nhận phương án tương đương theo cấu hình",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT09",
    "title": "Hướng dẫn chấm",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "08",
    "dauVao": "Câu tự luận, tiêu chí và thang",
    "xuLi": "Chia điểm từng ý; ghi lời giải khác",
    "dauRa": "Rubric và tổng điểm",
    "chapNhan": "Tổng điểm ý bằng điểm câu; có tiêu chí chấm rõ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT10",
    "title": "Đối chiếu bộ hồ sơ",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "08",
    "dauVao": "Năm thành phần hồ sơ",
    "xuLi": "Kiểm tổng, mức độ, phạm vi, liên kết, đáp án",
    "dauRa": "Danh sách đạt/lỗi/cần xem lại",
    "chapNhan": "Không chỉ kiểm có tệp; thay bất kỳ thành phần nào phải đối chiếu lại",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT11",
    "title": "Cảnh báo lỗi hồ sơ",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "08",
    "dauVao": "Kết quả kiểm tra quy tắc",
    "xuLi": "Chỉ vị trí, lí do và cách sửa",
    "dauRa": "Lỗi chặn/cảnh báo/thông tin",
    "chapNhan": "Lỗi chặn không được đánh dấu đã sửa nếu kiểm lại vẫn lỗi",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT12",
    "title": "Tạo mã đề",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "08",
    "dauVao": "Đề chốt, luật đảo, số mã",
    "xuLi": "Đảo hợp lệ; giữ nhóm ý/câu dẫn",
    "dauRa": "Mã đề và đáp án đồng bộ",
    "chapNhan": "Câu có tham chiếu/ý phụ không bị đảo phá cấu trúc",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT13",
    "title": "Giáo viên duyệt bộ hồ sơ",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "09",
    "dauVao": "Phiên bản và kết quả đối chiếu",
    "xuLi": "Xem đủ tài liệu; xác nhận hoặc trả sửa",
    "dauRa": "Phiên bản đã duyệt, người và thời điểm",
    "chapNhan": "Đổi nội dung sau duyệt làm mất trạng thái duyệt của bản mới",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT14",
    "title": "Xuất bộ hồ sơ",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "09",
    "dauVao": "Phiên bản được chọn, định dạng",
    "xuLi": "Xuất từng tài liệu/gộp ZIP",
    "dauRa": "Word/Excel/PDF theo loại tài liệu",
    "chapNhan": "Mã đề và phiên bản nhất quán; công thức, bảng và trang đọc được",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT15",
    "title": "Chuyển đề sang online",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "09",
    "dauVao": "Đề đã chốt, lớp, lịch, số lượt",
    "xuLi": "Tạo bài kiểm tra và chính sách công bố",
    "dauRa": "Bài kiểm tra gắn phiên bản đề",
    "chapNhan": "Không đưa đáp án vào tải xuống của HS; máy chủ chấm theo đề đúng mã",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "KT16",
    "title": "Thẩm định và phân tích kết quả",
    "groupId": "KiemTra",
    "groupName": "Hồ sơ kiểm tra",
    "groupRange": "KT01–KT16",
    "board": "09",
    "dauVao": "Tiêu chí, nhận xét, kết quả thật",
    "xuLi": "Lập biên bản; tổng hợp sau kiểm tra",
    "dauRa": "Hồ sơ bổ trợ và đề xuất điều chỉnh",
    "chapNhan": "Phần chưa có kết quả để trống/chờ dữ liệu; không tự sinh kết luận thành tích\n\n8 Trò chơi và tiện ích\nPhạm vi sử dụng theo quyền tại mục 2; mỗi mã có điều kiện nghiệm thu riêng.\nMã và chức năng\nĐầu vào và xử lí\nĐầu ra và điều kiện nghiệm thu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC01",
    "title": "Tạo trò chơi từ ngân hàng",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "09",
    "dauVao": "Câu đã duyệt, mẫu",
    "xuLi": "Chọn câu tương thích với kiểu chơi",
    "dauRa": "Trò chơi có phiên bản câu",
    "chapNhan": "Đổi mẫu không làm mất đáp án; câu không tương thích có thông báo",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC02",
    "title": "Tạo theo hoạt động học",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "09",
    "dauVao": "Mục tiêu, thời lượng, hoạt động",
    "xuLi": "Chọn khởi động/khám phá/luyện/vận dụng/củng cố",
    "dauRa": "Gợi ý mẫu và cấu hình",
    "chapNhan": "GV chỉnh được; mục tiêu và câu hỏi được lưu cùng hoạt động",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC03",
    "title": "Thư viện mẫu trò chơi",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "10",
    "dauVao": "Mẫu và bộ lọc",
    "xuLi": "Xem thử, chọn và sao chép",
    "dauRa": "Ô cửa, hộp quà, vòng quay, ô chữ, ghép đôi, tiếp sức",
    "chapNhan": "Mẫu có hướng dẫn và dữ liệu thử tách khỏi câu thật",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC04",
    "title": "Phòng chơi trực tiếp",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "10",
    "dauVao": "Trò chơi, mã phòng, người tham gia",
    "xuLi": "Bắt đầu/tạm dừng/kết thúc; đồng bộ lượt",
    "dauRa": "Phiên chơi và câu trả lời",
    "chapNhan": "Phòng đóng không nhận lượt mới; xử lí gửi lặp và người vào lại",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC05",
    "title": "Chơi cá nhân và theo nhóm",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "10",
    "dauVao": "Đội, thời gian, luật điểm",
    "xuLi": "Cấu hình trước khi bắt đầu",
    "dauRa": "Chế độ và bảng điểm phiên chơi",
    "chapNhan": "Thay luật giữa phiên cần xác nhận và lưu dấu; không đổi âm thầm",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC06",
    "title": "Phản hồi sau trò chơi",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "10",
    "dauVao": "Lượt chơi và đáp án",
    "xuLi": "Xem giải thích, câu khó, đề xuất luyện",
    "dauRa": "Tổng kết và hoạt động nối tiếp",
    "chapNhan": "Cho ẩn bảng xếp hạng; không công khai thông tin nhạy cảm",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC07",
    "title": "Gọi tên ngẫu nhiên",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "10",
    "dauVao": "Danh sách hợp lệ, tùy chọn tránh lặp",
    "xuLi": "Bốc thăm và lưu lượt tham gia",
    "dauRa": "Người được gọi và lịch sử",
    "chapNhan": "Tránh lặp tới khi hết danh sách; có đặt lại vòng",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC08",
    "title": "Chia nhóm",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "10",
    "dauVao": "Danh sách, số nhóm, tiêu chí",
    "xuLi": "Chia rồi cho GV điều chỉnh",
    "dauRa": "Nhóm và thành viên",
    "chapNhan": "Không mất/trùng thành viên; chênh số lượng theo cấu hình",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC09",
    "title": "Đồng hồ và bốc thăm",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "11",
    "dauVao": "Thời lượng, nhiệm vụ, danh sách",
    "xuLi": "Bắt đầu/dừng/đặt lại/chọn thứ tự",
    "dauRa": "Đồng hồ và nhiệm vụ được chọn",
    "chapNhan": "Đặt lại không xóa danh sách; kiểm soát tránh bốc trùng nếu bật",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "TC10",
    "title": "Khảo sát và phiếu cuối tiết",
    "groupId": "TroChoi",
    "groupName": "Trò chơi và tiện ích",
    "groupRange": "TC01–TC10",
    "board": "11",
    "dauVao": "Câu khảo sát, lớp, tùy chọn ẩn danh",
    "xuLi": "Phát phiếu và tổng hợp",
    "dauRa": "Phản hồi theo câu",
    "chapNhan": "Ẩn danh không hiển thị khóa liên kết danh tính cho GV; công bố giới hạn ẩn danh\n\n9 Quản trị và vận hành\nPhạm vi sử dụng theo quyền tại mục 2; mỗi mã có điều kiện nghiệm thu riêng.\nMã và chức năng\nĐầu vào và xử lí\nĐầu ra và điều kiện nghiệm thu",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT01",
    "title": "Tài khoản và phân quyền",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "11",
    "dauVao": "Tài khoản, vai trò, trạng thái",
    "xuLi": "Cấp/thu quyền, khóa, hỗ trợ đặt lại",
    "dauRa": "Tài khoản và lịch sử quyền",
    "chapNhan": "Người dùng không tự nâng quyền; thu quyền có hiệu lực ở máy chủ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT02",
    "title": "Phân quyền dữ liệu",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "11",
    "dauVao": "Vai trò, lớp, chủ sở hữu",
    "xuLi": "Áp chính sách cho từng tài nguyên",
    "dauRa": "Quyền xem/sửa/duyệt/xuất",
    "chapNhan": "Gọi trực tiếp dữ liệu ngoài quyền bị từ chối dù biết mã bản ghi",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT03",
    "title": "Danh mục dùng chung",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "11",
    "dauVao": "Khối/môn/sách/chương/bài/YCCĐ",
    "xuLi": "Tạo, sửa, ngừng dùng",
    "dauRa": "Danh mục chuẩn có mã",
    "chapNhan": "Không tạo trùng mã; ngừng dùng giữ lịch sử dữ liệu cũ",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT04",
    "title": "Chất lượng học liệu",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "11",
    "dauVao": "Nguồn, báo lỗi, trạng thái, phiên bản",
    "xuLi": "Phân công xử lí và tái duyệt",
    "dauRa": "Hồ sơ chất lượng và lịch sử",
    "chapNhan": "Báo lỗi không tự thay bản đang giao; có truy vết người xử lí",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT05",
    "title": "Bảo vệ đề và đáp án",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "12",
    "dauVao": "Lịch, đối tượng, quyền công bố",
    "xuLi": "Kiểm quyền máy chủ, tách dữ liệu đáp án",
    "dauRa": "Chính sách và nhật kí truy cập",
    "chapNhan": "Tài khoản HS không đọc đáp án trước công bố qua API hoặc bộ nhớ đệm",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT06",
    "title": "Lịch sử thao tác",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "12",
    "dauVao": "Sự kiện người dùng/quản trị",
    "xuLi": "Ghi người, thời gian, đối tượng, trước/sau",
    "dauRa": "Nhật kí truy vết",
    "chapNhan": "Không ghi mật khẩu, khóa API hoặc toàn bộ hội thoại nhạy cảm",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT07",
    "title": "Sao lưu và khôi phục",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "12",
    "dauVao": "Phạm vi, lịch, bản sao",
    "xuLi": "Tạo sao lưu; kiểm và xác nhận khôi phục",
    "dauRa": "Bản sao và kết quả phục hồi",
    "chapNhan": "Diễn tập khôi phục ở môi trường thử; nêu phần chưa nằm trong bản sao",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT08",
    "title": "Quản lí AI và hạn mức",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "12",
    "dauVao": "Nhà cung cấp, khóa, quyền, hạn mức",
    "xuLi": "Gọi qua máy chủ; tính lượt/chi phí; chặn vượt mức",
    "dauRa": "Cấu hình và nhật kí dùng",
    "chapNhan": "Không lộ khóa ở trình duyệt/log; mất AI không chặn bài học đã có",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT09",
    "title": "Hỗ trợ nhiều thiết bị",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "12",
    "dauVao": "Kích thước màn hình, tùy chọn đọc",
    "xuLi": "Đổi bố cục, cỡ chữ, hỗ trợ bàn phím",
    "dauRa": "Giao diện đọc và thao tác được",
    "chapNhan": "Kiểm tra ở 360/768/1366 px; bảng không che nút chính",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "QT10",
    "title": ", NC01–NC06; bộ thiết kế 13 bảng, dùng bản sửa cuối của bảng 05 và 07",
    "groupId": "QuanTri",
    "groupName": "Quản trị và vận hành",
    "groupRange": "QT01–QT10",
    "board": "12",
    "dauVao": "",
    "xuLi": "",
    "dauRa": "",
    "chapNhan": "",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "NC01",
    "title": "Ghi nhận quá trình học",
    "groupId": "NghienCuu",
    "groupName": "Nghiên cứu và minh chứng",
    "groupRange": "NC01–NC06",
    "board": "13",
    "dauVao": "Sự kiện hoạt động theo quyền và đồng ý",
    "xuLi": "Ghi thời gian, lượt, gợi ý, kết quả",
    "dauRa": "Dữ liệu sự kiện có phiên bản",
    "chapNhan": "Không coi thời gian mở trang là thời gian học; không ghi thao tác ngoài mục đích",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "NC02",
    "title": "Theo dõi cơ chế đề xuất",
    "groupId": "NghienCuu",
    "groupName": "Nghiên cứu và minh chứng",
    "groupRange": "NC01–NC06",
    "board": "13",
    "dauVao": "Bằng chứng, quy tắc, hoạt động",
    "xuLi": "Lưu vì sao chọn và kết quả sau hoạt động",
    "dauRa": "Dấu vết đề xuất có giải thích",
    "chapNhan": "Truy lại được đúng quy tắc/phiên bản tại thời điểm đề xuất",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "NC03",
    "title": "Đánh giá trước và sau",
    "groupId": "NghienCuu",
    "groupName": "Nghiên cứu và minh chứng",
    "groupRange": "NC01–NC06",
    "board": "13",
    "dauVao": "Thiết kế đợt đo, nhóm, bài tương đương",
    "xuLi": "Quản lí trước/sau/duy trì; xử lí thiếu",
    "dauRa": "Dữ liệu và bảng so sánh có cỡ mẫu",
    "chapNhan": "Không khẳng định nhân quả chỉ từ chênh lệch trước–sau; công bố hạn chế",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "NC04",
    "title": "Đo hỗ trợ giáo viên",
    "groupId": "NghienCuu",
    "groupName": "Nghiên cứu và minh chứng",
    "groupRange": "NC01–NC06",
    "board": "13",
    "dauVao": "Tác vụ chuẩn, quy trình, thời gian/lỗi",
    "xuLi": "Ghi nhận theo cùng điều kiện so sánh",
    "dauRa": "Dữ liệu thời gian, lỗi, số lần sửa",
    "chapNhan": "Không so tác vụ khác độ khó; giữ lần thất bại và lí do loại nếu có",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "NC05",
    "title": "Xuất dữ liệu mã hóa định danh",
    "groupId": "NghienCuu",
    "groupName": "Nghiên cứu và minh chứng",
    "groupRange": "NC01–NC06",
    "board": "13",
    "dauVao": "Đợt đo, trường và người được quyền",
    "xuLi": "Thay định danh bằng mã; lọc trường nhạy cảm",
    "dauRa": "CSV/Excel và mô tả biến",
    "chapNhan": "Không xuất bảng nối mã–danh tính mặc định; mã thay tên chưa phải ẩn danh tuyệt đối",
    "status": "CHUA_TRIEN_KHAI"
  },
  {
    "code": "NC06",
    "title": "; bộ thiết kế 13 bảng, dùng bản sửa cuối của bảng 05 và 07",
    "groupId": "NghienCuu",
    "groupName": "Nghiên cứu và minh chứng",
    "groupRange": "NC01–NC06",
    "board": "13",
    "dauVao": "",
    "xuLi": "",
    "dauRa": "",
    "chapNhan": "",
    "status": "CHUA_TRIEN_KHAI"
  }
];

export const SMART_EDU_GROUPS: FunctionGroup[] = [
  {
    id: 'HocSinh',
    name: 'Học sinh',
    range: 'HS01–HS21',
    menuPath: '/hoc-sinh',
    description: 'Học bài tương tác, ôn bài/chương/giữa kỳ/cuối kỳ, làm bài kiểm tra và theo dõi tiến bộ',
    functions: SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === 'HocSinh')
  },
  {
    id: 'GiaoVien',
    name: 'Giáo viên',
    range: 'GV01–GV15',
    menuPath: '/giao-vien',
    description: 'Soạn học liệu, quản lí câu hỏi, giao bài, chấm bài, theo dõi và trợ lý AI sư phạm',
    functions: SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === 'GiaoVien')
  },
  {
    id: 'KiemTra',
    name: 'Hồ sơ kiểm tra',
    range: 'KT01–KT16',
    menuPath: '/ho-so-kiem-tra',
    description: 'Quy trình tạo ma trận, bản đặc tả, đề, đáp án, hướng dẫn chấm và đối chiếu bộ hồ sơ',
    functions: SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === 'KiemTra')
  },
  {
    id: 'TroChoi',
    name: 'Trò chơi và tiện ích',
    range: 'TC01–TC10',
    menuPath: '/tro-choi',
    description: 'Tạo trò chơi học tập, phòng chơi trực tiếp, gọi tên ngẫu nhiên, chia nhóm, đồng hồ bốc thăm',
    functions: SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === 'TroChoi')
  },
  {
    id: 'QuanTri',
    name: 'Quản trị và vận hành',
    range: 'QT01–QT10',
    menuPath: '/quan-tri',
    description: 'Tài khoản, phân quyền dữ liệu, danh mục dùng chung, bảo vệ đề thi, nhật kí và đa thiết bị',
    functions: SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === 'QuanTri')
  },
  {
    id: 'NghienCuu',
    name: 'Nghiên cứu và minh chứng',
    range: 'NC01–NC06',
    menuPath: '/nghien-cuu',
    description: 'Ghi nhận quá trình học, đánh giá trước/sau, đo tác vụ giáo viên và xuất dữ liệu mã hóa định danh',
    functions: SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === 'NghienCuu')
  }
];

export const OFFICIAL_DB_TABLES = {
  publicTables: [
    { name: 'profiles', desc: 'Hồ sơ người dùng gắn auth.users(id), display_name' },
    { name: 'subjects', desc: '12 môn học THCS: Toán, Ngữ văn, KHTN, Sử–Địa, GDCD, Tin học...' },
    { name: 'textbooks', desc: 'Bộ sách giáo khoa: KNTT (Kết nối tri thức)' },
    { name: 'curricula', desc: 'Khung chương trình: Khối 6, 7, 8, 9 theo môn và sách' },
    { name: 'chapters', desc: 'Chương trong khung chương trình' },
    { name: 'topics', desc: 'Bài học/Chủ đề trong chương' },
    { name: 'learning_outcomes', desc: 'Yêu cầu cần đạt (YCCĐ) theo chương trình' },
    { name: 'classes', desc: 'Lớp học THCS (Khối 6–9, năm học)' },
    { name: 'class_memberships', desc: 'Thành viên lớp (student/teacher, active)' },
    { name: 'lessons', desc: 'Bài học tương tác theo chủ đề' },
    { name: 'lesson_versions', desc: 'Phiên bản bài học (draft, pending, approved, changes_requested, archived)' },
    { name: 'questions', desc: 'Câu hỏi theo chủ đề' },
    { name: 'question_versions', desc: 'Phiên bản câu hỏi (abcd, true_false, short, essay / biet, hieu, van_dung)' },
    { name: 'question_outcomes', desc: 'Liên kết câu hỏi với YCCĐ' },
    { name: 'question_items', desc: 'Tiểu mục câu hỏi phức hợp' },
    { name: 'assignments', desc: 'Nhiệm vụ học tập giao cho lớp' },
    { name: 'assignment_lessons', desc: 'Bài học kèm trong nhiệm vụ' },
    { name: 'assignment_questions', desc: 'Câu hỏi kiểm tra kèm trong nhiệm vụ' },
    { name: 'submissions', desc: 'Bài nộp của học sinh (draft, submitted, graded)' },
    { name: 'lesson_progress', desc: 'Tiến độ học qua từng bài' },
    { name: 'personal_notes', desc: 'Ghi chú và đánh dấu cá nhân của học sinh' }
  ],
  privateTables: [
    { name: 'private.user_roles', desc: 'Vai trò người dùng: student, teacher, reviewer, admin, researcher' },
    { name: 'private.reviewer_scopes', desc: 'Phạm vi bộ môn của người duyệt' },
    { name: 'private.audit_log', desc: 'Nhật kí thao tác hệ thống' },
    { name: 'private.answer_keys', desc: 'Đáp án, lời giải thích và rubric bảo vệ trên server' },
    { name: 'private.submission_grades', desc: 'Điểm số và nhận xét bài nộp được kiểm soát' }
  ]
};
