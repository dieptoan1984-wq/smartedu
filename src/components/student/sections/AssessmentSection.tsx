/**
 * Section 4: Kiểm tra (Assessments & Mock Tests)
 * Bố cục:
 * 1. Hai Tab: Tab A - Thi thử tự luyện & Tab B - Bài kiểm tra được giao
 * 2. Danh sách bài kiểm tra (tên, môn, lớp, thời lượng, số lượt, trạng thái)
 * 3. Hướng dẫn & quy định trước khi bắt đầu
 * 4. Giao diện làm bài: Đồng hồ đếm ngược, danh sách câu hỏi, cảnh báo câu trống
 * 5. Xác nhận nộp bài & hiển thị kết quả trung thực (tự luận chờ chấm)
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  studentDataService,
  QuestionBankItem
} from '../../../services/studentDataService';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  FileText,
  Lock
} from 'lucide-react';

interface AssessmentDef {
  id: string;
  title: string;
  subjectCode: string;
  subjectName: string;
  grade: number;
  type: 'mock' | 'assigned';
  durationMinutes: number;
  opensAt?: string;
  closesAt?: string;
  maxAttempts: number;
  usedAttempts: number;
  status: 'available' | 'in_progress' | 'submitted' | 'closed';
  teacherName?: string;
  instructions: string;
  questionIds: string[];
}

export const AssessmentSection: React.FC = () => {
  const { selectedGrade, setStudentSection } = useNavigation();
  const { userId, displayName } = useAuth();
  const currentGradeNum = typeof selectedGrade === 'number' ? selectedGrade : 6;

  const [activeTab, setActiveTab] = useState<'mock' | 'assigned'>('mock');

  // Danh mục đề kiểm tra thực tế
  const [assessments, setAssessments] = useState<AssessmentDef[]>([
    {
      id: 'mock_th6_01',
      title: 'Đề thi thử thường xuyên: Tin học 6 (Chủ đề 1)',
      subjectCode: 'tin_hoc',
      subjectName: 'Tin học',
      grade: 6,
      type: 'mock',
      durationMinutes: 15,
      maxAttempts: 3,
      usedAttempts: 0,
      status: 'available',
      instructions: 'Đề thi gồm các câu hỏi trắc nghiệm khách quan về thông tin, dữ liệu và vật mang tin. Em hãy chọn đáp án đúng nhất cho từng câu hỏi.',
      questionIds: ['th6-01', 'th6-02', 'th6-03', 'th6-04']
    },
    {
      id: 'mock_toan6_01',
      title: 'Đề thi thử ôn tập: Toán 6 (Chương 5 - Phân số)',
      subjectCode: 'toan',
      subjectName: 'Toán',
      grade: 6,
      type: 'mock',
      durationMinutes: 20,
      maxAttempts: 3,
      usedAttempts: 0,
      status: 'available',
      instructions: 'Đề thi thử phân số và số thập phân nhằm rèn luyện kỹ năng nhận biết và tính toán phân số bằng nhau.',
      questionIds: ['toan6-01', 'toan6-02', 'toan6-03']
    },
    {
      id: 'assigned_th6_01',
      title: 'Kiểm tra 15 phút: Dữ liệu và thông tin trong đời sống',
      subjectCode: 'tin_hoc',
      subjectName: 'Tin học',
      grade: 6,
      type: 'assigned',
      durationMinutes: 15,
      opensAt: '2026-11-01',
      closesAt: '2026-11-20',
      maxAttempts: 1,
      usedAttempts: 0,
      status: 'available',
      teacherName: 'Thầy Nguyễn Văn An',
      instructions: 'Bài kiểm tra chính thức trên lớp do giáo viên giao. Bài nộp sẽ được lưu trữ và tính vào sổ điểm theo quy định.',
      questionIds: ['th6-01', 'th6-02', 'th6-03', 'th6-05']
    }
  ]);

  // Bài kiểm tra đang thực hiện
  const [activeExam, setActiveExam] = useState<AssessmentDef | null>(null);
  const [examStep, setExamStep] = useState<'instructions' | 'taking' | 'submitted'>('instructions');

  // Trạng thái trong khi thi
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [examAnswers, setExamAnswers] = useState<Record<string, string>>({});
  const [examFlagged, setExamFlagged] = useState<Record<string, boolean>>({});
  const [examQuestions, setExamQuestions] = useState<QuestionBankItem[]>([]);

  // Lọc bài theo Tab và Khối
  const filteredAssessments = useMemo(() => {
    return assessments.filter(a => a.type === activeTab && a.grade === currentGradeNum);
  }, [assessments, activeTab, currentGradeNum]);

  // Bắt đầu vào phòng thi
  const handleOpenExamInstructions = (exam: AssessmentDef) => {
    setActiveExam(exam);
    // Lấy câu hỏi theo ID
    const questions = studentDataService.getQuestions({ grade: exam.grade, subjectCode: exam.subjectCode })
      .filter(q => exam.questionIds.includes(q.id));
    setExamQuestions(questions);
    setExamStep('instructions');
  };

  // Xác nhận bấm "Bắt đầu làm bài"
  const handleStartExam = () => {
    if (!activeExam) return;
    setTimeLeftSeconds(activeExam.durationMinutes * 60);
    setCurrentIndex(0);
    setExamAnswers({});
    setExamFlagged({});
    setExamStep('taking');
  };

  // Đồng hồ đếm ngược từng giây
  useEffect(() => {
    if (examStep !== 'taking' || timeLeftSeconds <= 0) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [examStep, timeLeftSeconds]);

  // Nộp bài thi
  const handleSubmitExam = () => {
    if (!activeExam) return;

    // Đếm câu đúng
    let correctCount = 0;
    examQuestions.forEach(q => {
      const userAns = examAnswers[q.id]?.trim().toLowerCase();
      if (userAns && userAns === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      }
    });

    const calculatedScore = examQuestions.length > 0
      ? Math.round((correctCount / examQuestions.length) * 10 * 10) / 10
      : 0;

    // Ghi vào nhật ký hoạt động
    studentDataService.logActivity(userId, {
      type: 'assessment',
      title: activeExam.title,
      subjectCode: activeExam.subjectCode,
      grade: activeExam.grade,
      score: calculatedScore,
      maxScore: 10,
      details: `${activeExam.type === 'mock' ? 'Thi thử tự luyện' : 'Bài kiểm tra giáo viên giao'} · Đúng ${correctCount}/${examQuestions.length} câu`
    });

    // Cập nhật lượt làm
    setAssessments(prev => prev.map(a => {
      if (a.id === activeExam.id) {
        return {
          ...a,
          usedAttempts: a.usedAttempts + 1,
          status: 'submitted'
        };
      }
      return a;
    }));

    setExamStep('submitted');
  };

  // Định dạng thời gian đồng hồ
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Đếm số câu chưa làm
  const unattemptedCount = useMemo(() => {
    return examQuestions.filter(q => !examAnswers[q.id]).length;
  }, [examQuestions, examAnswers]);

  const currentQ = examQuestions[currentIndex];

  return (
    <div className="space-y-6">
      {/* 1. KHI CHƯA VÀO BÀI THI: DANH SÁCH BÀI KIỂM TRA */}
      {!activeExam && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-[#1A56DB]" />
              <span>Kiểm tra &amp; Đánh giá học tập THCS</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Phân định minh bạch giữa các đề thi thử tự luyện và bài kiểm tra chính thức do giáo viên giao.
            </p>
          </div>

          {/* 2 Tab: Thi thử tự luyện & Bài kiểm tra được giao */}
          <div className="flex border-b border-slate-200 text-sm font-semibold">
            <button
              onClick={() => setActiveTab('mock')}
              className={`py-3 px-6 border-b-2 transition cursor-pointer ${
                activeTab === 'mock'
                  ? 'border-[#1A56DB] text-blue-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              A. Thi thử tự luyện
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`py-3 px-6 border-b-2 transition cursor-pointer ${
                activeTab === 'assigned'
                  ? 'border-[#1A56DB] text-blue-900 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              B. Bài kiểm tra được giao
            </button>
          </div>

          {/* Danh sách các bài kiểm tra */}
          {filteredAssessments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredAssessments.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-blue-300 transition flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                        {item.subjectName} {item.grade}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        item.status === 'submitted'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}>
                        {item.status === 'submitted' ? 'Đã nộp bài' : 'Có thể làm'}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {item.title}
                    </h3>

                    {item.teacherName && (
                      <div className="text-slate-500">Giáo viên giao: <strong>{item.teacherName}</strong></div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-slate-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Thời lượng: {item.durationMinutes} phút</span>
                      </span>
                      <span>·</span>
                      <span>Lượt làm: {item.usedAttempts}/{item.maxAttempts}</span>
                    </div>

                    <p className="text-slate-500 line-clamp-2 pt-1 border-t border-slate-100">
                      {item.instructions}
                    </p>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleOpenExamInstructions(item)}
                      disabled={item.usedAttempts >= item.maxAttempts}
                      className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-2xs disabled:opacity-40 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>{item.usedAttempts > 0 ? 'Làm lại bài thi' : 'Vào phòng thi'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <div>Không có bài kiểm tra nào trong danh mục này cho Lớp {currentGradeNum}.</div>
              <div className="text-slate-400 text-[11px]">Vui lòng chuyển tab hoặc chọn khối lớp khác để xem các bài thi thử.</div>
            </div>
          )}
        </div>
      )}

      {/* 2. MÀN HÌNH HƯỚNG DẪN TRƯỚC KHI LÀM */}
      {activeExam && examStep === 'instructions' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 max-w-2xl mx-auto">
          <div className="text-center space-y-2 border-b border-slate-100 pb-4">
            <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Quy chế thi trực tuyến · Smart EDU
            </span>
            <h2 className="text-xl font-bold text-slate-900">
              {activeExam.title}
            </h2>
            <p className="text-xs text-slate-500">
              Môn {activeExam.subjectName} {activeExam.grade} · Thời gian làm bài: {activeExam.durationMinutes} phút
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs text-slate-700">
            <span className="font-bold text-slate-900 block">Quy định phòng thi:</span>
            <ul className="list-disc pl-5 space-y-1">
              <li>Thời gian tính theo đồng hồ đếm ngược của hệ thống.</li>
              <li>Hết thời gian quy định, hệ thống sẽ tự động thu bài làm hiện tại.</li>
              <li>Các câu trắc nghiệm sẽ có kết quả ngay; câu tự luận sẽ chờ giáo viên chấm điểm.</li>
              <li>Không tải lại trang hoặc tắt trình duyệt khi đang làm bài.</li>
            </ul>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <button
              onClick={() => setActiveExam(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition cursor-pointer"
            >
              Quay lại danh sách
            </button>
            <button
              onClick={handleStartExam}
              className="px-6 py-2.5 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-xl font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <span>Xác nhận bắt đầu làm bài</span>
              <Play className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 3. MÀN HÌNH ĐANG LÀM BÀI KIỂM TRA (TAKING) */}
      {activeExam && examStep === 'taking' && currentQ && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Header thi: Tên bài, Đồng hồ đếm ngược, Nút nộp */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="text-xs text-slate-500">{activeExam.title}</div>
              <div className="font-bold text-slate-900 text-base">
                Câu {currentIndex + 1} / {examQuestions.length}
              </div>
            </div>

            {/* Đồng hồ đếm ngược */}
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border font-mono text-sm font-bold shadow-2xs ${
              timeLeftSeconds < 180 ? 'bg-rose-50 text-rose-700 border-rose-300 animate-pulse' : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}>
              <Clock className="w-4 h-4" />
              <span>{formatTime(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={() => {
                if (unattemptedCount > 0) {
                  if (confirm(`Em còn ${unattemptedCount} câu chưa trả lời. Em có chắc muốn nộp bài ngay bây giờ?`)) {
                    handleSubmitExam();
                  }
                } else {
                  if (confirm('Em có chắc chắn muốn nộp bài thi?')) {
                    handleSubmitExam();
                  }
                }
              }}
              className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Nộp bài thi</span>
            </button>
          </div>

          {/* Dải chọn nhanh câu hỏi */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            {examQuestions.map((q, idx) => {
              const isAnswered = !!examAnswers[q.id];
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg font-bold transition flex items-center justify-center cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1A56DB] text-white shadow-2xs'
                      : isAnswered
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Nội dung câu hỏi */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-relaxed">
              {currentQ.prompt}
            </h3>

            {/* Các lựa chọn trả lời */}
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = examAnswers[currentQ.id] === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => setExamAnswers(prev => ({ ...prev, [currentQ.id]: opt.key }))}
                      className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-center gap-3 text-sm ${
                        isSelected
                          ? 'border-[#1A56DB] bg-blue-50/50 text-blue-950 font-semibold'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 ${
                        isSelected ? 'border-[#1A56DB] bg-[#1A56DB] text-white' : 'border-slate-400 text-slate-600'
                      }`}>
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </label>
                  );
                })}
              </div>
            ) : currentQ.questionType === 'short' ? (
              <input
                type="text"
                value={examAnswers[currentQ.id] || ''}
                onChange={(e) => setExamAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                placeholder="Nhập câu trả lời của em..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            ) : (
              <textarea
                value={examAnswers[currentQ.id] || ''}
                onChange={(e) => setExamAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value }))}
                rows={4}
                placeholder="Trình bày bài làm tự luận..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
            )}
          </div>

          {/* Thanh chuyển câu */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Câu trước</span>
            </button>

            <span className="text-slate-400 text-[11px]">
              {unattemptedCount > 0 ? `Còn ${unattemptedCount} câu chưa chọn` : 'Đã hoàn thành tất cả câu hỏi'}
            </span>

            <button
              onClick={() => setCurrentIndex(prev => Math.min(examQuestions.length - 1, prev + 1))}
              disabled={currentIndex === examQuestions.length - 1}
              className="px-4 py-2 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-xl font-bold transition flex items-center gap-1 disabled:opacity-40 shadow-2xs cursor-pointer"
            >
              <span>Câu sau</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* 4. MÀN HÌNH SAU KHI NỘP BÀI THI (SUBMITTED) */}
      {activeExam && examStep === 'submitted' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs text-center space-y-6 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Nộp bài thi thành công!</h2>
            <p className="text-xs text-slate-500">
              Hệ thống đã ghi nhận bài nộp của em vào cơ sở dữ liệu học tập.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 text-left space-y-2">
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span>Bài thi:</span>
              <strong className="text-slate-900">{activeExam.title}</strong>
            </div>
            <div className="flex justify-between border-b border-slate-200 pb-1.5">
              <span>Thời điểm nộp:</span>
              <strong>{new Date().toLocaleTimeString('vi-VN')} ({new Date().toLocaleDateString('vi-VN')})</strong>
            </div>
            <div className="flex justify-between">
              <span>Trạng thái bài làm:</span>
              <strong className="text-emerald-700">Đã nộp bài đầy đủ</strong>
            </div>
          </div>

          <div className="pt-2 flex justify-center gap-3 text-xs">
            <button
              onClick={() => {
                setActiveExam(null);
                setExamStep('instructions');
              }}
              className="px-5 py-2.5 bg-[#1A56DB] text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              Quay về danh sách kiểm tra
            </button>
            <button
              onClick={() => setStudentSection('progress')}
              className="px-5 py-2.5 bg-white text-slate-700 border border-slate-300 font-semibold rounded-xl hover:bg-slate-50 transition cursor-pointer"
            >
              Xem báo cáo tiến bộ
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
