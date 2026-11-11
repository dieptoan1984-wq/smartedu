/**
 * Smart EDU THCS - Teacher & Admin Data Service
 * Quản lí dữ liệu giáo viên, người duyệt và quản trị viên:
 * - Lớp học (Classes & Memberships)
 * - Bài học tương tác (Authoring, HTML import, Preview, Gửi duyệt)
 * - Ngân hàng câu hỏi (Tạo/sửa, Import template, Gửi duyệt)
 * - Giao bài & kiểm tra (Assignments, thời hạn, chính sách công bố)
 * - Chấm bài & kết quả (Submissions, Chấm điểm từng câu, Nhận xét, Công bố)
 * - Phê duyệt học liệu (Review queue, Phê duyệt, Yêu cầu sửa đổi có lí do)
 * - Phân quyền & Nhật ký kiểm toán (Audit log)
 */

import { THCS_SUBJECTS, UserRole } from '../types/smartEduData';
import { studentDataService, QuestionBankItem } from './studentDataService';
import { TIN_HOC_6_BAI_1_HTML } from './lessonRegistry';

export interface TeacherClassItem {
  id: string;
  name: string;
  grade: number;
  schoolYear: string;
  studentCount: number;
  students: Array<{ id: string; name: string; email?: string }>;
  archived: boolean;
  createdAt: string;
}

export interface TeacherLessonDraft {
  id: string;
  lessonId: string;
  version: number;
  title: string;
  subjectCode: string;
  grade: number;
  textbookCode: string; // 'KNTT'
  chapterId: string;
  chapterTitle: string;
  lessonCode: string;
  htmlContent: string;
  source: string;
  status: 'draft' | 'pending' | 'approved' | 'changes_requested' | 'archived';
  authorId: string;
  authorName: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  reviewFeedback?: string;
}

export interface TeacherQuestionDraft {
  id: string;
  code: string;
  version: number;
  subjectCode: string;
  grade: number;
  chapterId: string;
  chapterTitle: string;
  lessonTitle: string;
  questionType: 'abcd' | 'true_false' | 'short' | 'essay';
  difficulty: 'biet' | 'hieu' | 'van_dung';
  prompt: string;
  options?: Array<{ key: string; text: string }>;
  correctAnswer: string;
  explanation: string;
  points: number;
  rubric?: string;
  source: string;
  status: 'draft' | 'pending' | 'approved' | 'changes_requested';
  authorId: string;
  authorName: string;
  createdAt: string;
  approvedAt?: string;
  approvedBy?: string;
  reviewFeedback?: string;
}

export interface TeacherAssignmentItem {
  id: string;
  classId: string;
  className: string;
  title: string;
  instructions: string;
  grade: number;
  subjectCode: string;
  opensAt: string;
  dueAt: string;
  durationMinutes: number;
  lessonVersionId?: string;
  questionIds: string[];
  status: 'draft' | 'published' | 'closed';
  releasePolicy: 'immediate' | 'after_due' | 'manual';
  createdAt: string;
  authorId: string;
  authorName: string;
}

export interface StudentSubmissionItem {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  classId: string;
  studentId: string;
  studentName: string;
  status: 'draft' | 'submitted' | 'graded';
  submittedAt: string;
  answers: Record<string, string>;
  score?: number;
  maxScore: number;
  feedback?: string;
  gradedBy?: string;
  gradedAt?: string;
  isReleased: boolean;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  details: string;
}

export interface ReviewerScopeItem {
  userId: string;
  userName: string;
  subjectCode: string;
  subjectName: string;
}

class TeacherDataService {
  private getStorageKey(key: string): string {
    return `smart_edu_teacher_${key}`;
  }

  // ==========================================
  // 1. LỚP HỌC (Classes)
  // ==========================================
  getClasses(userId?: string | null): TeacherClassItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('classes'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // ignore
    }

    // Lớp học mẫu ban đầu chuẩn THCS
    const defaultClasses: TeacherClassItem[] = [
      {
        id: 'cls_6a1',
        name: 'Lớp 6A1 – Tin học',
        grade: 6,
        schoolYear: '2026–2027',
        studentCount: 38,
        students: [
          { id: 'hs_01', name: 'Nguyễn Văn An', email: 'an.nv@thcs.edu.vn' },
          { id: 'hs_02', name: 'Trần Thị Bình', email: 'binh.tt@thcs.edu.vn' },
          { id: 'hs_03', name: 'Lê Hoàng Cường', email: 'cuong.lh@thcs.edu.vn' },
          { id: 'hs_04', name: 'Phạm Minh Dũng', email: 'dung.pm@thcs.edu.vn' }
        ],
        archived: false,
        createdAt: '2026-09-05T08:00:00Z'
      },
      {
        id: 'cls_6a2',
        name: 'Lớp 6A2 – Tin học',
        grade: 6,
        schoolYear: '2026–2027',
        studentCount: 36,
        students: [
          { id: 'hs_05', name: 'Vũ Hải Đăng', email: 'dang.vh@thcs.edu.vn' },
          { id: 'hs_06', name: 'Đỗ Thảo Linh', email: 'linh.dt@thcs.edu.vn' }
        ],
        archived: false,
        createdAt: '2026-09-05T08:30:00Z'
      },
      {
        id: 'cls_8a3',
        name: 'Lớp 8A3 – Tin học & Công nghệ',
        grade: 8,
        schoolYear: '2026–2027',
        studentCount: 40,
        students: [
          { id: 'hs_07', name: 'Ngô Quốc Bảo', email: 'bao.nq@thcs.edu.vn' }
        ],
        archived: false,
        createdAt: '2026-09-06T09:00:00Z'
      }
    ];

    try {
      localStorage.setItem(this.getStorageKey('classes'), JSON.stringify(defaultClasses));
    } catch {}
    return defaultClasses;
  }

  createClass(data: Omit<TeacherClassItem, 'id' | 'createdAt' | 'studentCount' | 'students' | 'archived'>): TeacherClassItem {
    const list = this.getClasses();
    const newClass: TeacherClassItem = {
      ...data,
      id: `cls_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      studentCount: 0,
      students: [],
      archived: false,
      createdAt: new Date().toISOString()
    };
    list.unshift(newClass);
    try {
      localStorage.setItem(this.getStorageKey('classes'), JSON.stringify(list));
    } catch {}
    this.logAudit('Tạo lớp học mới', 'classes', `Tạo ${newClass.name} (Khối ${newClass.grade})`);
    return newClass;
  }

  updateClass(id: string, updates: Partial<TeacherClassItem>): void {
    const list = this.getClasses();
    const idx = list.findIndex(c => c.id === id);
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...updates };
      try {
        localStorage.setItem(this.getStorageKey('classes'), JSON.stringify(list));
      } catch {}
    }
  }

  archiveClass(id: string, archive = true): void {
    const list = this.getClasses();
    const cls = list.find(c => c.id === id);
    if (cls) {
      cls.archived = archive;
      try {
        localStorage.setItem(this.getStorageKey('classes'), JSON.stringify(list));
      } catch {}
      this.logAudit(archive ? 'Lưu trữ lớp học' : 'Khôi phục lớp học', 'classes', `${cls.name}`);
    }
  }

  addStudentToClass(classId: string, studentName: string, studentEmail?: string): void {
    const list = this.getClasses();
    const cls = list.find(c => c.id === idClassIdHelper(c.id, classId));
    if (cls) {
      const newSt = {
        id: `hs_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: studentName,
        email: studentEmail
      };
      cls.students.push(newSt);
      cls.studentCount = cls.students.length;
      try {
        localStorage.setItem(this.getStorageKey('classes'), JSON.stringify(list));
      } catch {}
    }
  }

  // ==========================================
  // 2. BÀI HỌC TƯƠNG TÁC (Lessons & HTML Authoring)
  // ==========================================
  getLessons(): TeacherLessonDraft[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('lessons'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {}

    // Bài học mẫu ban đầu (Tin học 6 - Bài 1 đã được phê duyệt sẵn)
    const initialLessons: TeacherLessonDraft[] = [
      {
        id: 'ls_th6_b1_v1',
        lessonId: 'bai_1_th6',
        version: 1,
        title: 'Bài 1: Thông tin và dữ liệu',
        subjectCode: 'tin_hoc',
        grade: 6,
        textbookCode: 'KNTT',
        chapterId: 'chuong_1',
        chapterTitle: 'Chủ đề 1: Máy tính và cộng đồng',
        lessonCode: 'TH6_CD1_B1',
        htmlContent: TIN_HOC_6_BAI_1_HTML,
        source: 'Chủ biên Tin học 6 - KNTT',
        status: 'approved',
        authorId: 'gv_nguyen_van_an',
        authorName: 'Thầy Nguyễn Văn An',
        createdAt: '2026-09-01T08:00:00Z',
        approvedAt: '2026-09-02T10:00:00Z',
        approvedBy: 'Người duyệt chuyên môn Tin học THCS'
      },
      {
        id: 'ls_toan6_b23_v1',
        lessonId: 'bai_23_toan6',
        version: 1,
        title: 'Bài 23: Mở rộng phân số. Phân số bằng nhau',
        subjectCode: 'toan',
        grade: 6,
        textbookCode: 'KNTT',
        chapterId: 'chuong_5',
        chapterTitle: 'Chương 5: Phân số và số thập phân',
        lessonCode: 'TOAN6_CH5_B23',
        htmlContent: `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"><title>Mở rộng phân số</title><style>body{font-family:'Times New Roman',serif;font-size:18px;padding:24px;line-height:1.6;color:#0f172a;}.box{background:#eff6ff;padding:20px;border-radius:12px;border:1px solid #bfdbfe;margin-bottom:16px;}</style></head><body><div class="box"><h2>Bài 23: Mở rộng phân số</h2><p>Khái niệm phân số với tử và mẫu là các số nguyên, mẫu khác 0.</p></div></body></html>`,
        source: 'Tổ Toán THCS',
        status: 'pending',
        authorId: 'gv_le_thi_hoa',
        authorName: 'Cô Lê Thị Hoa',
        createdAt: '2026-10-12T14:30:00Z'
      }
    ];

    try {
      localStorage.setItem(this.getStorageKey('lessons'), JSON.stringify(initialLessons));
    } catch {}
    return initialLessons;
  }

  saveLessonDraft(data: Omit<TeacherLessonDraft, 'id' | 'createdAt' | 'version'>): TeacherLessonDraft {
    const list = this.getLessons();
    const existing = list.find(l => l.lessonCode === data.lessonCode && l.authorId === data.authorId);
    const version = existing ? existing.version + 1 : 1;

    const newLesson: TeacherLessonDraft = {
      ...data,
      id: `ls_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      version,
      createdAt: new Date().toISOString()
    };
    list.unshift(newLesson);
    try {
      localStorage.setItem(this.getStorageKey('lessons'), JSON.stringify(list));
    } catch {}
    this.logAudit('Lưu bài học tương tác', 'lessons', `Lưu "${newLesson.title}" (Trạng thái: ${newLesson.status})`);
    return newLesson;
  }

  submitLessonForReview(id: string): void {
    const list = this.getLessons();
    const lesson = list.find(l => l.id === id);
    if (lesson) {
      lesson.status = 'pending';
      try {
        localStorage.setItem(this.getStorageKey('lessons'), JSON.stringify(list));
      } catch {}
      this.logAudit('Gửi duyệt bài học', 'lessons', `Gửi duyệt "${lesson.title}"`);
    }
  }

  reviewLesson(id: string, decision: 'approved' | 'changes_requested', feedback?: string, reviewerName = 'Người duyệt'): void {
    const list = this.getLessons();
    const lesson = list.find(l => l.id === id);
    if (lesson) {
      lesson.status = decision;
      lesson.reviewFeedback = feedback;
      if (decision === 'approved') {
        lesson.approvedAt = new Date().toISOString();
        lesson.approvedBy = reviewerName;
      }
      try {
        localStorage.setItem(this.getStorageKey('lessons'), JSON.stringify(list));
      } catch {}
      this.logAudit(
        decision === 'approved' ? 'Phê duyệt bài học' : 'Yêu cầu sửa đổi bài học',
        'lessons',
        `Bài học: "${lesson.title}" - Quyết định: ${decision}`
      );
    }
  }

  // ==========================================
  // 3. NGÂN HÀNG CÂU HỎI (Questions)
  // ==========================================
  getQuestions(): TeacherQuestionDraft[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('questions'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {}

    // Khởi tạo danh mục câu hỏi dựa trên ngân hàng chuẩn
    const defaultList: TeacherQuestionDraft[] = [
      {
        id: 'q_th6_01',
        code: 'TH6_CD1_B1_01',
        version: 1,
        subjectCode: 'tin_hoc',
        grade: 6,
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
        explanation: 'Vật mang tin là phương tiện được sử dụng để lưu trữ và truyền đạt thông tin.',
        points: 2.5,
        rubric: 'Chọn đúng đáp án A được 2.5 điểm.',
        source: 'SGK Tin học 6 - Kết nối tri thức',
        status: 'approved',
        authorId: 'gv_nguyen_van_an',
        authorName: 'Thầy Nguyễn Văn An',
        createdAt: '2026-09-01T08:00:00Z',
        approvedAt: '2026-09-02T10:00:00Z',
        approvedBy: 'Tổ thẩm định Tin học THCS'
      },
      {
        id: 'q_toan6_01',
        code: 'TOAN6_CH5_B23_01',
        version: 1,
        subjectCode: 'toan',
        grade: 6,
        chapterId: 'chuong_5',
        chapterTitle: 'Chương 5: Phân số và số thập phân',
        lessonTitle: 'Bài 23: Mở rộng phân số',
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
        explanation: 'Phân số có dạng a/b với a, b là số nguyên, b khác 0.',
        points: 2.5,
        rubric: 'Chọn đúng đáp án A được 2.5 điểm.',
        source: 'SGK Toán 6 - Kết nối tri thức',
        status: 'approved',
        authorId: 'gv_le_thi_hoa',
        authorName: 'Cô Lê Thị Hoa',
        createdAt: '2026-09-01T08:00:00Z',
        approvedAt: '2026-09-02T10:00:00Z',
        approvedBy: 'Tổ thẩm định Toán THCS'
      }
    ];

    try {
      localStorage.setItem(this.getStorageKey('questions'), JSON.stringify(defaultList));
    } catch {}
    return defaultList;
  }

  saveQuestion(data: Omit<TeacherQuestionDraft, 'id' | 'createdAt' | 'version'>): TeacherQuestionDraft {
    const list = this.getQuestions();
    const newQ: TeacherQuestionDraft = {
      ...data,
      id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      version: 1,
      createdAt: new Date().toISOString()
    };
    list.unshift(newQ);
    try {
      localStorage.setItem(this.getStorageKey('questions'), JSON.stringify(list));
    } catch {}
    this.logAudit('Tạo câu hỏi', 'questions', `Tạo câu hỏi mã ${newQ.code} môn ${newQ.subjectCode}`);
    return newQ;
  }

  submitQuestionForReview(id: string): void {
    const list = this.getQuestions();
    const q = list.find(item => item.id === id);
    if (q) {
      q.status = 'pending';
      try {
        localStorage.setItem(this.getStorageKey('questions'), JSON.stringify(list));
      } catch {}
      this.logAudit('Gửi duyệt câu hỏi', 'questions', `Gửi duyệt mã ${q.code}`);
    }
  }

  reviewQuestion(id: string, decision: 'approved' | 'changes_requested', feedback?: string, reviewerName = 'Người duyệt'): void {
    const list = this.getQuestions();
    const q = list.find(item => item.id === id);
    if (q) {
      q.status = decision;
      q.reviewFeedback = feedback;
      if (decision === 'approved') {
        q.approvedAt = new Date().toISOString();
        q.approvedBy = reviewerName;
      }
      try {
        localStorage.setItem(this.getStorageKey('questions'), JSON.stringify(list));
      } catch {}
      this.logAudit(
        decision === 'approved' ? 'Phê duyệt câu hỏi' : 'Yêu cầu chỉnh sửa câu hỏi',
        'questions',
        `Mã ${q.code} - Kết quả: ${decision}`
      );
    }
  }

  // ==========================================
  // 4. GIAO BÀI & KIỂM TRA (Assignments)
  // ==========================================
  getAssignments(): TeacherAssignmentItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('assignments'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {}

    const defaultAssignments: TeacherAssignmentItem[] = [
      {
        id: 'asg_th6_01',
        classId: 'cls_6a1',
        className: 'Lớp 6A1 – Tin học',
        title: 'Kiểm tra 15 phút: Thông tin và Dữ liệu',
        instructions: 'Các em đọc kỹ câu hỏi trắc nghiệm và tình huống trước khi chọn đáp án.',
        grade: 6,
        subjectCode: 'tin_hoc',
        opensAt: '2026-11-01T08:00:00Z',
        dueAt: '2026-11-30T23:59:00Z',
        durationMinutes: 15,
        questionIds: ['TH6_CD1_B1_01', 'TH6_CD1_B1_02', 'TH6_CD1_B1_03', 'TH6_CD1_B1_04'],
        status: 'published',
        releasePolicy: 'immediate',
        createdAt: '2026-11-01T07:30:00Z',
        authorId: 'gv_nguyen_van_an',
        authorName: 'Thầy Nguyễn Văn An'
      }
    ];

    try {
      localStorage.setItem(this.getStorageKey('assignments'), JSON.stringify(defaultAssignments));
    } catch {}
    return defaultAssignments;
  }

  createAssignment(data: Omit<TeacherAssignmentItem, 'id' | 'createdAt'>): TeacherAssignmentItem {
    const list = this.getAssignments();
    const newAsg: TeacherAssignmentItem = {
      ...data,
      id: `asg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString()
    };
    list.unshift(newAsg);
    try {
      localStorage.setItem(this.getStorageKey('assignments'), JSON.stringify(list));
    } catch {}
    this.logAudit('Giao bài kiểm tra', 'assignments', `Giao "${newAsg.title}" cho lớp ${newAsg.className}`);
    return newAsg;
  }

  // ==========================================
  // 5. CHẤM BÀI & KẾT QUẢ (Submissions & Grading)
  // ==========================================
  getSubmissions(): StudentSubmissionItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('submissions'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {}

    const defaultSubmissions: StudentSubmissionItem[] = [
      {
        id: 'sub_01',
        assignmentId: 'asg_th6_01',
        assignmentTitle: 'Kiểm tra 15 phút: Thông tin và Dữ liệu',
        classId: 'cls_6a1',
        studentId: 'hs_01',
        studentName: 'Nguyễn Văn An',
        status: 'submitted',
        submittedAt: '2026-11-05T09:15:00Z',
        answers: {
          'TH6_CD1_B1_01': 'A',
          'TH6_CD1_B1_02': 'A',
          'TH6_CD1_B1_03': 'S',
          'TH6_CD1_B1_04': 'dữ liệu'
        },
        maxScore: 10,
        isReleased: false
      },
      {
        id: 'sub_02',
        assignmentId: 'asg_th6_01',
        assignmentTitle: 'Kiểm tra 15 phút: Thông tin và Dữ liệu',
        classId: 'cls_6a1',
        studentId: 'hs_02',
        studentName: 'Trần Thị Bình',
        status: 'graded',
        submittedAt: '2026-11-05T09:20:00Z',
        answers: {
          'TH6_CD1_B1_01': 'A',
          'TH6_CD1_B1_02': 'B',
          'TH6_CD1_B1_03': 'S',
          'TH6_CD1_B1_04': 'dữ liệu'
        },
        score: 7.5,
        maxScore: 10,
        feedback: 'Em làm tốt các câu nhận biết, chú ý phân biệt dữ liệu và thông tin ở tình huống thời tiết.',
        gradedBy: 'Thầy Nguyễn Văn An',
        gradedAt: '2026-11-05T15:00:00Z',
        isReleased: true
      }
    ];

    try {
      localStorage.setItem(this.getStorageKey('submissions'), JSON.stringify(defaultSubmissions));
    } catch {}
    return defaultSubmissions;
  }

  gradeSubmission(submissionId: string, score: number, feedback: string, teacherName: string, isReleased = true): void {
    const list = this.getSubmissions();
    const sub = list.find(s => s.id === submissionId);
    if (sub) {
      sub.score = score;
      sub.feedback = feedback;
      sub.gradedBy = teacherName;
      sub.gradedAt = new Date().toISOString();
      sub.status = 'graded';
      sub.isReleased = isReleased;
      try {
        localStorage.setItem(this.getStorageKey('submissions'), JSON.stringify(list));
      } catch {}
      this.logAudit('Chấm bài', 'submissions', `Chấm bài cho ${sub.studentName}: ${score}/${sub.maxScore} điểm`);
    }
  }

  // ==========================================
  // 6. NHẬT KÝ KIỂM TOÁN (Audit Log)
  // ==========================================
  getAuditLog(): AuditLogEntry[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('audit_log'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {}
    return [];
  }

  logAudit(action: string, entityType: string, details: string, actorName = 'Hệ thống Smart EDU'): void {
    const list = this.getAuditLog();
    const entry: AuditLogEntry = {
      id: `audit_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      actorId: 'system_or_user',
      actorName,
      action,
      entityType,
      details
    };
    list.unshift(entry);
    if (list.length > 100) list.pop();
    try {
      localStorage.setItem(this.getStorageKey('audit_log'), JSON.stringify(list));
    } catch {}
  }

  // ==========================================
  // 7. PHÂN CÔNG NGƯỜI DUYỆT (Reviewer Scopes)
  // ==========================================
  getReviewerScopes(): ReviewerScopeItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(this.getStorageKey('reviewer_scopes'));
      if (data) {
        return JSON.parse(data);
      }
    } catch {}

    const defaultScopes: ReviewerScopeItem[] = [
      { userId: 'u-demo-reviewer', userName: 'Thẩm định viên Tin học', subjectCode: 'tin_hoc', subjectName: 'Tin học' },
      { userId: 'u-demo-reviewer', userName: 'Thẩm định viên Toán', subjectCode: 'toan', subjectName: 'Toán' },
      { userId: 'u-demo-reviewer', userName: 'Thẩm định viên Khoa học', subjectCode: 'khtn', subjectName: 'Khoa học tự nhiên' }
    ];
    try {
      localStorage.setItem(this.getStorageKey('reviewer_scopes'), JSON.stringify(defaultScopes));
    } catch {}
    return defaultScopes;
  }

  assignReviewerScope(scope: ReviewerScopeItem): void {
    const list = this.getReviewerScopes();
    const existing = list.findIndex(s => s.userId === scope.userId && s.subjectCode === scope.subjectCode);
    if (existing < 0) {
      list.push(scope);
      try {
        localStorage.setItem(this.getStorageKey('reviewer_scopes'), JSON.stringify(list));
      } catch {}
      this.logAudit('Phân công thẩm định viên', 'reviewer_scopes', `Gán ${scope.userName} duyệt môn ${scope.subjectName}`);
    }
  }
}

function idClassIdHelper(cId: string, searchId: string): string {
  return cId === searchId ? cId : '';
}

export const teacherDataService = new TeacherDataService();
