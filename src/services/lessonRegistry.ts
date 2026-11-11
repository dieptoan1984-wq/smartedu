/**
 * Smart EDU THCS - Lesson Registry & Curricular Mapping
 * Ánh xạ danh mục: Khối lớp → Môn học → Chương/Chủ đề → Bài học → File HTML
 * Tuân thủ quy định:
 * - Chỉ gắn bài học thực sự có nội dung được duyệt
 * - Chưa có HTML: hiển thị "Bài học đang được chuẩn bị"
 * - Không tự ý bịa số chương hoặc nội dung SGK
 */

export interface LessonDef {
  id: string;
  code: string;
  title: string;
  hasHtml: boolean;
  htmlContent?: string;
  unpreparedNotice?: string;
}

export interface ChapterDef {
  id: string;
  code: string;
  title: string;
  lessons: LessonDef[];
}

export interface SubjectCurriculumDef {
  subjectCode: string;
  subjectName: string;
  chapters: ChapterDef[];
}

// Nội dung HTML tương tác chuẩn cho Tin học 6 - Bài 1: Thông tin và dữ liệu
export const TIN_HOC_6_BAI_1_HTML = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Tin học 6 - Bài 1: Thông tin và dữ liệu</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: "Times New Roman", Times, serif;
      font-size: 18px;
      line-height: 1.6;
      color: #0f172a;
      background-color: #f8fafc;
      padding: 24px;
    }
    .lesson-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .lesson-header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 16px;
      margin-bottom: 24px;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      border-radius: 8px;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 26px;
      font-weight: bold;
      color: #1e3a8a;
      margin-bottom: 6px;
    }
    h2 {
      font-size: 20px;
      font-weight: bold;
      color: #0f172a;
      margin-top: 24px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    p { margin-bottom: 14px; text-align: justify; }
    .situation-card {
      background: linear-gradient(135deg, #eff6ff 0%, #f0fdf4 100%);
      border: 1px solid #bfdbfe;
      border-radius: 14px;
      padding: 20px;
      margin: 20px 0;
      text-align: center;
    }
    .weather-bubble {
      display: inline-block;
      background: #ffffff;
      border: 2px solid #3b82f6;
      border-radius: 12px;
      padding: 12px 24px;
      font-size: 20px;
      font-weight: bold;
      color: #1e3a8a;
      margin: 12px 0;
      box-shadow: 0 2px 4px rgba(0,0,0,0.06);
    }
    .weather-icon { font-size: 48px; display: block; margin-bottom: 8px; }
    .interactive-quiz {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 18px;
      margin-top: 16px;
      text-align: left;
    }
    .options-group {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 16px 0;
    }
    .option-label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border: 1px solid #cbd5e1;
      border-radius: 10px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .option-label:hover {
      background: #f1f5f9;
      border-color: #94a3b8;
    }
    .option-label.selected {
      border-color: #2563eb;
      background: #eff6ff;
      font-weight: bold;
    }
    .actions-bar {
      display: flex;
      gap: 12px;
      margin-top: 14px;
    }
    button.btn {
      font-family: inherit;
      font-size: 16px;
      font-weight: bold;
      padding: 10px 20px;
      border-radius: 10px;
      border: none;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-primary { background: #1d4ed8; color: #ffffff; }
    .btn-primary:hover { background: #1e40af; }
    .btn-secondary { background: #f1f5f9; color: #334155; border: 1px solid #cbd5e1; }
    .btn-secondary:hover { background: #e2e8f0; }
    .feedback-box {
      margin-top: 16px;
      padding: 14px 18px;
      border-radius: 10px;
      display: none;
      font-size: 16px;
      line-height: 1.5;
    }
    .feedback-success { background: #f0fdf4; border: 1px solid #86efac; color: #166534; }
    .feedback-wrong { background: #fef2f2; border: 1px solid #fca5a5; color: #991b1b; }
    .feedback-hint { background: #fefce8; border: 1px solid #fde047; color: #854d0e; }
    .summary-box {
      background: #faf5ff;
      border-left: 4px solid #9333ea;
      padding: 16px 20px;
      border-radius: 0 12px 12px 0;
      margin: 24px 0;
    }
    .summary-box ul { padding-left: 20px; margin-top: 8px; }
    .summary-box li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <div class="lesson-container">
    <div class="lesson-header">
      <span class="badge">Tin học 6 • Kết nối tri thức với cuộc sống</span>
      <h1>Bài 1: Thông tin và dữ liệu</h1>
      <p style="color: #64748b; font-size: 16px;">Thời lượng dự kiến: 1 tiết (45 phút) • Trình phát bài học tương tác</p>
    </div>

    <h2>1. Quan sát tình huống</h2>
    <p>Em hãy quan sát tình huống thực tế sau đây và suy nghĩ xem em sẽ phản ứng như thế nào:</p>

    <div class="situation-card">
      <span class="weather-icon">🌧️</span>
      <div class="weather-bubble">
        Bản tin dự báo: Chiều nay có mưa.
      </div>
      <p style="color: #475569; font-size: 16px;">(Dòng chữ hiển thị trên màn hình tivi hoặc điện thoại)</p>

      <div class="interactive-quiz">
        <strong style="font-size: 18px;">Em sẽ sử dụng thông tin này như thế nào?</strong>
        <div class="options-group">
          <label class="option-label selected" onclick="chooseOption('opt1', this)">
            <input type="radio" name="weather_opt" id="opt1" checked />
            <span>Mang theo áo mưa khi đi học</span>
          </label>
          <label class="option-label" onclick="chooseOption('opt2', this)">
            <input type="radio" name="weather_opt" id="opt2" />
            <span>Ghi lại số trang sách</span>
          </label>
          <label class="option-label" onclick="chooseOption('opt3', this)">
            <input type="radio" name="weather_opt" id="opt3" />
            <span>Đổi hình nền máy tính</span>
          </label>
        </div>

        <div class="actions-bar">
          <button class="btn btn-primary" onclick="checkWeatherAnswer()">▶ Kiểm tra câu trả lời</button>
          <button class="btn btn-secondary" onclick="showWeatherHint()">💡 Gợi ý</button>
        </div>

        <div id="weather-feedback" class="feedback-box"></div>
      </div>
    </div>

    <h2>2. Kiến thức trọng tâm</h2>
    <div class="summary-box">
      <strong>Em cần ghi nhớ:</strong>
      <ul>
        <li><strong>Thông tin:</strong> Là những hiểu biết của con người về thế giới xung quanh và về chính bản thân mình.</li>
        <li><strong>Dữ liệu:</strong> Là hình thức thể hiện của thông tin (con số, chữ viết, hình ảnh, âm thanh...).</li>
        <li><strong>Vật mang tin:</strong> Là phương tiện dùng để lưu trữ và truyền đạt thông tin (như tờ giấy, quyển sách, đĩa quang, thẻ nhớ, USB...).</li>
      </ul>
    </div>

    <h2>3. Luyện tập tương tác</h2>
    <p>Hãy phân biệt dữ liệu và thông tin trong ví dụ sau:</p>
    <div class="interactive-quiz">
      <p><strong>Câu hỏi:</strong> Khi nhìn thấy biển báo giao thông có hình người đi bộ qua đường màu trắng trên nền xanh, hình vẽ đó là gì?</p>
      <div class="options-group">
        <label class="option-label" onclick="chooseQuizOption('q1_a', this)">
          <input type="radio" name="quiz1" id="q1_a" />
          <span>Hình vẽ là dữ liệu hình ảnh; biển báo là vật mang tin; ý nghĩa "đoạn đường dành cho người đi bộ" là thông tin.</span>
        </label>
        <label class="option-label" onclick="chooseQuizOption('q1_b', this)">
          <input type="radio" name="quiz1" id="q1_b" />
          <span>Hình vẽ là thông tin; biển báo là dữ liệu.</span>
        </label>
      </div>
      <div class="actions-bar">
        <button class="btn btn-primary" onclick="checkQuiz1()">▶ Kiểm tra</button>
      </div>
      <div id="quiz1-feedback" class="feedback-box"></div>
    </div>
  </div>

  <script>
    let currentOption = 'opt1';
    function chooseOption(optId, labelElem) {
      currentOption = optId;
      document.querySelectorAll('input[name="weather_opt"]').forEach(inp => {
        inp.parentElement.classList.remove('selected');
      });
      labelElem.classList.add('selected');
    }

    function checkWeatherAnswer() {
      const fb = document.getElementById('weather-feedback');
      fb.style.display = 'block';
      if (currentOption === 'opt1') {
        fb.className = 'feedback-box feedback-success';
        fb.innerHTML = '<strong>Chính xác!</strong> Biết tin chiều nay có mưa giúp em chủ động mang theo áo mưa để không bị ướt. Đây là ví dụ trực quan về việc xử lí thông tin để đưa ra quyết định hành động đúng đắn.';
      } else {
        fb.className = 'feedback-box feedback-wrong';
        fb.innerHTML = '<strong>Chưa chính xác!</strong> Em hãy suy nghĩ xem thông tin chiều nay có mưa sẽ ảnh hưởng trực tiếp đến việc chuẩn bị đồ dùng gì trước khi ra ngoài nhé!';
      }
    }

    function showWeatherHint() {
      const fb = document.getElementById('weather-feedback');
      fb.style.display = 'block';
      fb.className = 'feedback-box feedback-hint';
      fb.innerHTML = '<strong>Gợi ý:</strong> Thông tin về thời tiết giúp con người dự đoán thay đổi môi trường và chuẩn bị vật dụng phù hợp trước khi ra khỏi nhà.';
    }

    let quiz1Option = null;
    function chooseQuizOption(optId, labelElem) {
      quiz1Option = optId;
      document.querySelectorAll('input[name="quiz1"]').forEach(inp => {
        inp.parentElement.classList.remove('selected');
      });
      labelElem.classList.add('selected');
    }

    function checkQuiz1() {
      const fb = document.getElementById('quiz1-feedback');
      fb.style.display = 'block';
      if (quiz1Option === 'q1_a') {
        fb.className = 'feedback-box feedback-success';
        fb.innerHTML = '<strong>Hoàn toàn chính xác!</strong> Biển kim loại là vật mang tin, hình vẽ người đi bộ là dữ liệu hình ảnh, còn sự hiểu biết của em để giảm tốc độ là thông tin.';
      } else {
        fb.className = 'feedback-box feedback-wrong';
        fb.innerHTML = '<strong>Chưa đúng.</strong> Em hãy nhớ lại: vật mang tin là biển báo kim loại; hình vẽ là dữ liệu hình ảnh; ý nghĩa rút ra là thông tin.';
      }
    }
  </script>
</body>
</html>`;

// Danh mục học liệu THCS chính thức
export const LESSON_REGISTRY: Record<number, Record<string, ChapterDef[]>> = {
  // KHỐI 6
  6: {
    tin_hoc: [
      {
        id: 'chuong_1',
        code: 'TH6_CD1',
        title: 'Chủ đề 1: Máy tính và cộng đồng',
        lessons: [
          {
            id: 'bai_1',
            code: 'TH6_B1',
            title: 'Bài 1: Thông tin và dữ liệu',
            hasHtml: true,
            htmlContent: TIN_HOC_6_BAI_1_HTML
          },
          {
            id: 'bai_2',
            code: 'TH6_B2',
            title: 'Bài 2: Xử lí thông tin',
            hasHtml: false,
            unpreparedNotice: 'Bài học đang được chuẩn bị bởi tổ chuyên môn Tin học cấp THCS.'
          },
          {
            id: 'bai_3',
            code: 'TH6_B3',
            title: 'Bài 3: Thông tin trong máy tính',
            hasHtml: false,
            unpreparedNotice: 'Bài học đang được chuẩn bị bởi tổ chuyên môn Tin học cấp THCS.'
          }
        ]
      },
      {
        id: 'chuong_2',
        code: 'TH6_CD2',
        title: 'Chủ đề 2: Mạng máy tính và Internet',
        lessons: [
          {
            id: 'bai_4',
            code: 'TH6_B4',
            title: 'Bài 4: Mạng máy tính',
            hasHtml: false,
            unpreparedNotice: 'Bài học đang được chuẩn bị bởi tổ chuyên môn Tin học cấp THCS.'
          }
        ]
      }
    ],
    toan: [
      {
        id: 'chuong_5',
        code: 'TOAN6_CH5',
        title: 'Chương 5: Phân số và số thập phân',
        lessons: [
          {
            id: 'bai_23',
            code: 'TOAN6_B23',
            title: 'Bài 23: Mở rộng phân số. Phân số bằng nhau',
            hasHtml: false,
            unpreparedNotice: 'Bài học đang được chuẩn bị bởi tổ chuyên môn Toán THCS (Chờ tải file HTML bài học).'
          },
          {
            id: 'bai_24',
            code: 'TOAN6_B24',
            title: 'Bài 24: So sánh phân số',
            hasHtml: false,
            unpreparedNotice: 'Bài học đang được chuẩn bị bởi tổ chuyên môn Toán THCS.'
          }
        ]
      }
    ],
    khtn: [
      {
        id: 'chuong_1',
        code: 'KHTN6_CH1',
        title: 'Chương 1: Mở đầu về Khoa học tự nhiên',
        lessons: [
          {
            id: 'bai_1',
            code: 'KHTN6_B1',
            title: 'Bài 1: Giới thiệu về Khoa học tự nhiên',
            hasHtml: false,
            unpreparedNotice: 'Bài học đang được chuẩn bị bởi tổ chuyên môn Khoa học tự nhiên.'
          }
        ]
      }
    ]
  },

  // KHỐI 7, 8, 9 (Cấu trúc khung chuẩn - chưa có học liệu hiển thị đúng quy tắc)
  7: {},
  8: {},
  9: {}
};

/**
 * Lấy danh sách chương theo khối và môn
 */
export function getChapters(grade: number, subjectCode: string): ChapterDef[] {
  return LESSON_REGISTRY[grade]?.[subjectCode] || [];
}

/**
 * Lấy danh sách bài theo khối, môn và chương
 */
export function getLessons(grade: number, subjectCode: string, chapterId: string): LessonDef[] {
  const chapters = getChapters(grade, subjectCode);
  const found = chapters.find(c => c.id === chapterId);
  return found ? found.lessons : [];
}

/**
 * Tìm bài học cụ thể
 */
export function findLesson(grade: number, subjectCode: string, chapterId: string, lessonId: string): LessonDef | null {
  const lessons = getLessons(grade, subjectCode, chapterId);
  return lessons.find(l => l.id === lessonId) || null;
}
