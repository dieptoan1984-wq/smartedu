/**
 * Smart EDU THCS - Student Data Service
 * Quản lí dữ liệu khu vực học sinh:
 * - Tích hợp Supabase (subjects, curricula, assignments, lesson_progress)
 * - Lưu trữ cục bộ an toàn theo phạm vi ID người dùng (Mistakes, Plans, Activities, Q&A)
 * - Phân định minh bạch giữa dữ liệu từ máy chủ (Server/DB) và dữ liệu lưu trên thiết bị (Local Device)
 */

import { supabase } from '../config/supabase';

export interface StudentActivityLog {
  id: string;
  timestamp: string;
  type: 'lesson' | 'review' | 'assessment' | 'game';
  title: string;
  subjectCode: string;
  grade: number;
  score?: number;
  maxScore?: number;
  details?: string;
  source: 'local_device' | 'server';
}

export interface MistakeItem {
  id: string;
  questionId: string;
  subjectCode: string;
  grade: number;
  chapterTitle: string;
  lessonTitle: string;
  prompt: string;
  questionType: 'abcd' | 'true_false' | 'short' | 'essay';
  options?: Array<{ key: string; text: string }>;
  studentAnswer: string;
  correctAnswer: string;
  explanation: string;
  dateAdded: string;
  wrongCount: number;
  status: 'need_review' | 'practicing' | 'corrected';
  personalNotes?: string;
  source: 'local_device' | 'server';
}

export interface StudyPlanItem {
  id: string;
  title: string;
  subjectCode: string;
  grade: number;
  type: 'lesson' | 'review' | 'assessment' | 'other';
  dueDate: string; // YYYY-MM-DD
  estimatedMinutes?: number;
  lessonId?: string;
  isTeacherAssigned: boolean;
  teacherName?: string;
  notes?: string;
  completed: boolean;
  completedAt?: string;
  source: 'local_device' | 'server';
}

export interface TeacherQuestionItem {
  id: string;
  subjectCode: string;
  grade: number;
  lessonTitle?: string;
  teacherOrClassName: string;
  title: string;
  content: string;
  createdAt: string;
  status: 'pending' | 'answered' | 'resolved';
  replies: Array<{
    id: string;
    sender: 'student' | 'teacher';
    senderName: string;
    text: string;
    sentAt: string;
  }>;
  source: 'local_device' | 'server';
}

export interface QuestionBankItem {
  id: string;
  code: string;
  grade: number;
  subjectCode: string;
  chapterId: string;
  chapterTitle: string;
  lessonTitle: string;
  questionType: 'abcd' | 'true_false' | 'short' | 'essay';
  difficulty: 'biet' | 'hieu' | 'van_dung';
  prompt: string;
  options?: Array<{ key: string; text: string }>;
  correctAnswer: string;
  explanation: string;
  hint?: string;
}

// Ngân hàng câu hỏi chuẩn duyệt (Tin học 6, Toán 6, Khoa học tự nhiên 6)
export const APPROVED_QUESTIONS: QuestionBankItem[] = [
  // TIN HỌC 6 - CHỦ ĐỀ 1: MÁY TÍNH VÀ CỘNG ĐỒNG - BÀI 1: THÔNG TIN VÀ DỮ LIỆU
  {
    id: 'th6-01',
    code: 'TH6_CD1_B1_01',
    grade: 6,
    subjectCode: 'tin_hoc',
    chapterId: 'chuong_1',
    chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
    questionType: 'abcd',
    difficulty: 'biet',
    prompt: 'Vật mang tin là gì trong các định nghĩa sau?',
    options: [
      { key: 'A', text: 'Phương tiện dùng để lưu trữ và truyền đạt thông tin (như sách, báo, đĩa cứng, thẻ nhớ).' },
      { key: 'B', text: 'Những gì con người cảm nhận được bằng trực giác.' },
      { key: 'C', text: 'Chỉ riêng các thiết bị điện tử có kết nối Internet.' },
      { key: 'D', text: 'Mọi âm thanh phát ra trong tự nhiên.' }
    ],
    correctAnswer: 'A',
    explanation: 'Vật mang tin là phương tiện được sử dụng để lưu trữ và truyền đạt thông tin như giấy viết, sách báo, đĩa CD, thẻ nhớ, USB...',
    hint: 'Hãy liên hệ với quyển sách hoặc chiếc thẻ nhớ máy tính em dùng để ghi dữ liệu.'
  },
  {
    id: 'th6-02',
    code: 'TH6_CD1_B1_02',
    grade: 6,
    subjectCode: 'tin_hoc',
    chapterId: 'chuong_1',
    chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
    questionType: 'abcd',
    difficulty: 'hieu',
    prompt: 'Bản tin dự báo thời tiết thông báo: "Chiều nay có mưa dông cục bộ tại Hà Nội". Dòng chữ này đối với em là gì?',
    options: [
      { key: 'A', text: 'Là dữ liệu dạng văn bản; khi em đọc và hiểu được chiều nay trời mưa thì nó trở thành thông tin giúp em chuẩn bị áo mưa.' },
      { key: 'B', text: 'Không phải là thông tin hay dữ liệu.' },
      { key: 'C', text: 'Chỉ là dữ liệu âm thanh thuần túy.' },
      { key: 'D', text: 'Là vật mang tin.' }
    ],
    correctAnswer: 'A',
    explanation: 'Dãy ký tự trên màn hình hoặc giấy là dữ liệu. Khi con người tiếp nhận và hiểu ý nghĩa để hành động, nó là thông tin.',
    hint: 'Phân biệt giữa dòng chữ (dữ liệu) và ý nghĩa rút ra để hành động (thông tin).'
  },
  {
    id: 'th6-03',
    code: 'TH6_CD1_B1_03',
    grade: 6,
    subjectCode: 'tin_hoc',
    chapterId: 'chuong_1',
    chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
    questionType: 'true_false',
    difficulty: 'van_dung',
    prompt: 'Xác định tính Đúng (Đ) hoặc Sai (S) của nhận định: "Mọi dữ liệu đưa vào máy tính đều tự động trở thành thông tin có ích cho con người mà không cần xử lí."',
    options: [
      { key: 'D', text: 'Đúng' },
      { key: 'S', text: 'Sai' }
    ],
    correctAnswer: 'S',
    explanation: 'Sai. Dữ liệu là các con số, văn bản thô. Dữ liệu phải qua quá trình xử lí (hoặc con người hiểu) mới đem lại thông tin có ý nghĩa.',
    hint: 'Một bảng số liệu lộn xộn nếu chưa sắp xếp thì có giúp em ra quyết định ngay được không?'
  },
  {
    id: 'th6-04',
    code: 'TH6_CD1_B1_04',
    grade: 6,
    subjectCode: 'tin_hoc',
    chapterId: 'chuong_1',
    chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
    questionType: 'short',
    difficulty: 'biet',
    prompt: 'Điền từ còn thiếu vào chỗ trống: "Các số liệu, văn bản, hình ảnh, âm thanh được lưu trữ trong máy tính gọi là ..."',
    correctAnswer: 'dữ liệu',
    explanation: 'Dữ liệu là hình thức thể hiện của thông tin dưới dạng các con số, văn bản, hình ảnh, âm thanh trong máy tính.',
    hint: 'Từ gồm 2 tiếng: "dữ ..." '
  },
  {
    id: 'th6-05',
    code: 'TH6_CD1_B1_05',
    grade: 6,
    subjectCode: 'tin_hoc',
    chapterId: 'chuong_1',
    chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
    lessonTitle: 'Bài 1: Thông tin và dữ liệu',
    questionType: 'essay',
    difficulty: 'van_dung',
    prompt: 'Nêu một ví dụ thực tế trong cuộc sống hàng ngày mà em đã tiếp nhận thông tin và đưa ra quyết định hành động tương ứng.',
    correctAnswer: 'Ví dụ: Khi nghe thấy tiếng chuông báo thức reo (dữ liệu âm thanh), em biết đã đến 6 giờ sáng (thông tin) và quyết định thức dậy chuẩn bị đi học (hành động).',
    explanation: 'Câu tự luận sẽ được giáo viên đọc và nhận xét chi tiết.',
    hint: 'Hãy nghĩ về tín hiệu đèn giao thông hoặc tiếng trống trường.'
  },

  // TOÁN 6 - CHƯƠNG 5: PHÂN SỐ VÀ SỐ THẬP PHÂN - BÀI 23: MỞ RỘNG PHÂN SỐ
  {
    id: 'toan6-01',
    code: 'TOAN6_CH5_B23_01',
    grade: 6,
    subjectCode: 'toan',
    chapterId: 'chuong_5',
    chapterTitle: 'Chương 5: Phân số và số thập phân',
    lessonTitle: 'Bài 23: Mở rộng phân số. Phân số bằng nhau',
    questionType: 'abcd',
    difficulty: 'biet',
    prompt: 'Trong các cách viết sau, cách viết nào cho ta một phân số?',
    options: [
      { key: 'A', text: '-3 / 5' },
      { key: 'B', text: '1.5 / 4' },
      { key: 'C', text: '7 / 0' },
      { key: 'D', text: '0 / 0' }
    ],
    correctAnswer: 'A',
    explanation: 'Phân số có dạng a/b với a, b là các số nguyên và b khác 0. Trong đó -3 và 5 là số nguyên, 5 khác 0.',
    hint: 'Mẫu số phải là số nguyên khác 0, tử số là số nguyên.'
  },
  {
    id: 'toan6-02',
    code: 'TOAN6_CH5_B23_02',
    grade: 6,
    subjectCode: 'toan',
    chapterId: 'chuong_5',
    chapterTitle: 'Chương 5: Phân số và số thập phân',
    lessonTitle: 'Bài 23: Mở rộng phân số. Phân số bằng nhau',
    questionType: 'abcd',
    difficulty: 'hieu',
    prompt: 'Cặp phân số nào sau đây bằng nhau?',
    options: [
      { key: 'A', text: '-2 / 3 và 4 / -6' },
      { key: 'B', text: '1 / 2 và -1 / 2' },
      { key: 'C', text: '3 / 4 và 4 / 3' },
      { key: 'D', text: '-3 / 5 và 3 / 5' }
    ],
    correctAnswer: 'A',
    explanation: 'Hai phân số a/b = c/d khi a * d = b * c. Với (-2)*(-6) = 12 và 3*4 = 12, nên -2/3 = 4/(-6).',
    hint: 'Nhân chéo tử của phân số này với mẫu của phân số kia.'
  },
  {
    id: 'toan6-03',
    code: 'TOAN6_CH5_B23_03',
    grade: 6,
    subjectCode: 'toan',
    chapterId: 'chuong_5',
    chapterTitle: 'Chương 5: Phân số và số thập phân',
    lessonTitle: 'Bài 23: Mở rộng phân số. Phân số bằng nhau',
    questionType: 'short',
    difficulty: 'van_dung',
    prompt: 'Tìm số nguyên x thỏa mãn: x / 7 = 6 / 21. Giá trị của x là:',
    correctAnswer: '2',
    explanation: 'Ta có x * 21 = 7 * 6 => 21x = 42 => x = 42 / 21 = 2.',
    hint: 'Dùng quy tắc bằng nhau của hai phân số: a*d = b*c.'
  }
];

class StudentDataService {
  private getStorageKey(userId: string | null, key: string): string {
    const safeUser = userId ? userId.replace(/[^a-zA-Z0-9_-]/g, '') : 'guest';
    return `smart_edu_student_${safeUser}_${key}`;
  }

  // 1. NHẬT KÝ HOẠT ĐỘNG (Activity Log)
  getActivities(userId: string | null): StudentActivityLog[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'activities'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  }

  logActivity(userId: string | null, activity: Omit<StudentActivityLog, 'id' | 'timestamp' | 'source'>): StudentActivityLog {
    const list = this.getActivities(userId);
    const newLog: StudentActivityLog = {
      ...activity,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      source: 'local_device'
    };
    list.unshift(newLog);
    // Giữ tối đa 50 hoạt động gần nhất
    if (list.length > 50) list.pop();
    try {
      localStorage.setItem(this.getStorageKey(userId, 'activities'), JSON.stringify(list));
    } catch {
      // ignore
    }
    return newLog;
  }

  // 2. SỔ CÂU SAI (Mistakes Notebook)
  getMistakes(userId: string | null): MistakeItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'mistakes'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  }

  recordMistake(userId: string | null, item: Omit<MistakeItem, 'id' | 'dateAdded' | 'wrongCount' | 'status' | 'source'>): MistakeItem {
    const list = this.getMistakes(userId);
    const existingIndex = list.findIndex(m => m.questionId === item.questionId);

    if (existingIndex >= 0) {
      list[existingIndex].wrongCount += 1;
      list[existingIndex].status = 'need_review';
      list[existingIndex].studentAnswer = item.studentAnswer;
      try {
        localStorage.setItem(this.getStorageKey(userId, 'mistakes'), JSON.stringify(list));
      } catch {}
      return list[existingIndex];
    }

    const newMistake: MistakeItem = {
      ...item,
      id: `mis_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      dateAdded: new Date().toISOString(),
      wrongCount: 1,
      status: 'need_review',
      source: 'local_device'
    };
    list.unshift(newMistake);
    try {
      localStorage.setItem(this.getStorageKey(userId, 'mistakes'), JSON.stringify(list));
    } catch {}
    return newMistake;
  }

  updateMistake(userId: string | null, id: string, updates: Partial<MistakeItem>): void {
    const list = this.getMistakes(userId);
    const idx = list.findIndex(m => m.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      try {
        localStorage.setItem(this.getStorageKey(userId, 'mistakes'), JSON.stringify(list));
      } catch {}
    }
  }

  removeMistake(userId: string | null, id: string): void {
    const list = this.getMistakes(userId).filter(m => m.id !== id);
    try {
      localStorage.setItem(this.getStorageKey(userId, 'mistakes'), JSON.stringify(list));
    } catch {}
  }

  // 3. KẾ HOẠCH HỌC TẬP (Study Plans)
  getPlans(userId: string | null): StudyPlanItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'plans'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    // Nhiệm vụ mẫu nếu danh sách ban đầu trống (phân biệt rõ nguồn Giáo viên giao và Tự đặt)
    const initialPlans: StudyPlanItem[] = [
      {
        id: 'plan_gv_01',
        title: 'Hoàn thành bài học tương tác: Thông tin và dữ liệu',
        subjectCode: 'tin_hoc',
        grade: 6,
        type: 'lesson',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
        estimatedMinutes: 25,
        isTeacherAssigned: true,
        teacherName: 'Thầy Nguyễn Văn An (GV Tin học)',
        notes: 'Các em học kỹ phần quan sát tình huống thời tiết và hoàn thành câu hỏi luyện tập.',
        completed: false,
        source: 'local_device'
      }
    ];
    return initialPlans;
  }

  addPlan(userId: string | null, plan: Omit<StudyPlanItem, 'id' | 'completed' | 'source'>): StudyPlanItem {
    const list = this.getPlans(userId);
    const newPlan: StudyPlanItem = {
      ...plan,
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      completed: false,
      source: 'local_device'
    };
    list.unshift(newPlan);
    try {
      localStorage.setItem(this.getStorageKey(userId, 'plans'), JSON.stringify(list));
    } catch {}
    return newPlan;
  }

  updatePlan(userId: string | null, id: string, updates: Partial<StudyPlanItem>): void {
    const list = this.getPlans(userId);
    const idx = list.findIndex(p => p.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      try {
        localStorage.setItem(this.getStorageKey(userId, 'plans'), JSON.stringify(list));
      } catch {}
    }
  }

  deletePlan(userId: string | null, id: string): boolean {
    const list = this.getPlans(userId);
    const item = list.find(p => p.id === id);
    if (item && item.isTeacherAssigned) {
      // Không cho phép học sinh xóa bài do giáo viên giao gốc
      return false;
    }
    const filtered = list.filter(p => p.id !== id);
    try {
      localStorage.setItem(this.getStorageKey(userId, 'plans'), JSON.stringify(filtered));
    } catch {}
    return true;
  }

  // 4. HỎI GIÁO VIÊN (Q&A with Teachers)
  getTeacherQuestions(userId: string | null): TeacherQuestionItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey(userId, 'questions'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }
    return [];
  }

  addTeacherQuestion(
    userId: string | null,
    q: Omit<TeacherQuestionItem, 'id' | 'createdAt' | 'status' | 'replies' | 'source'>
  ): TeacherQuestionItem {
    const list = this.getTeacherQuestions(userId);
    const newQuestion: TeacherQuestionItem = {
      ...q,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'pending',
      replies: [],
      source: 'local_device'
    };
    list.unshift(newQuestion);
    try {
      localStorage.setItem(this.getStorageKey(userId, 'questions'), JSON.stringify(list));
    } catch {}
    return newQuestion;
  }

  addQuestionReply(
    userId: string | null,
    questionId: string,
    text: string,
    senderName: string
  ): void {
    const list = this.getTeacherQuestions(userId);
    const q = list.find(item => item.id === questionId);
    if (q) {
      q.replies.push({
        id: `rep_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        sender: 'student',
        senderName,
        text,
        sentAt: new Date().toISOString()
      });
      try {
        localStorage.setItem(this.getStorageKey(userId, 'questions'), JSON.stringify(list));
      } catch {}
    }
  }

  updateQuestionStatus(userId: string | null, questionId: string, status: 'pending' | 'answered' | 'resolved'): void {
    const list = this.getTeacherQuestions(userId);
    const q = list.find(item => item.id === questionId);
    if (q) {
      q.status = status;
      try {
        localStorage.setItem(this.getStorageKey(userId, 'questions'), JSON.stringify(list));
      } catch {}
    }
  }

  // 5. NGÂN HÀNG CÂU HỎI THEO BỘ LỌC
  getQuestions(params: {
    grade: number;
    subjectCode: string;
    chapterId?: string;
    difficulty?: 'biet' | 'hieu' | 'van_dung' | 'ket_hop';
    limit?: number;
  }): QuestionBankItem[] {
    let result = APPROVED_QUESTIONS.filter(q => q.grade === params.grade && q.subjectCode === params.subjectCode);
    if (params.chapterId) {
      result = result.filter(q => q.chapterId === params.chapterId);
    }
    if (params.difficulty && params.difficulty !== 'ket_hop') {
      result = result.filter(q => q.difficulty === params.difficulty);
    }
    if (params.limit && params.limit > 0) {
      result = result.slice(0, params.limit);
    }
    return result;
  }
}

export const studentDataService = new StudentDataService();
