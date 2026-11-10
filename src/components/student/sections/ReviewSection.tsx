/**
 * Section 3: Ôn tập (Review & Practice)
 * Bố cục:
 * 1. Màn hình 1 (Config): Bộ chọn Khối, Môn, Phạm vi, Mức độ, Số câu (báo số lượng câu thực có)
 * 2. Màn hình 2 (Doing): Làm bài, danh sách câu, nút Trước/Sau, đánh dấu xem lại, phản hồi/giải thích
 * 3. Màn hình 3 (Results): Tổng kết đúng, sai, chưa trả lời, lưu vào Sổ câu sai, luyện lại
 */

import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  studentDataService,
  QuestionBankItem
} from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  BookOpen,
  ArrowRight,
  AlertTriangle,
  Lightbulb
} from 'lucide-react';

type ReviewStep = 'config' | 'doing' | 'results';

export const ReviewSection: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    selectedSubjectCode,
    setSelectedSubjectCode,
    setStudentSection
  } = useNavigation();

  const { userId } = useAuth();
  const currentGradeNum = typeof selectedGrade === 'number' ? selectedGrade : 6;

  // Trạng thái cấu hình ôn tập
  const [step, setStep] = useState<ReviewStep>('config');
  const [scope, setScope] = useState<'lesson' | 'chapter' | 'mid_term_1' | 'final_term_1' | 'mid_term_2' | 'final_term_2'>('chapter');
  const [difficulty, setDifficulty] = useState<'biet' | 'hieu' | 'van_dung' | 'ket_hop'>('ket_hop');
  const [questionCount, setQuestionCount] = useState<number>(5);

  // Danh sách câu hỏi trong phiên ôn tập
  const [sessionQuestions, setSessionQuestions] = useState<QuestionBankItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [flagged, setFlagged] = useState<Record<string, boolean>>({});
  const [usedHints, setUsedHints] = useState<Record<string, boolean>>({});
  const [savedToMistakes, setSavedToMistakes] = useState<boolean>(false);

  // Câu hỏi khả dụng trong ngân hàng
  const availableQuestions = useMemo(() => {
    return studentDataService.getQuestions({
      grade: currentGradeNum,
      subjectCode: selectedSubjectCode,
      difficulty: difficulty === 'ket_hop' ? undefined : difficulty
    });
  }, [currentGradeNum, selectedSubjectCode, difficulty]);

  // Bắt đầu làm bài
  const handleStartReview = () => {
    if (availableQuestions.length === 0) return;
    const questionsToUse = availableQuestions.slice(0, questionCount);
    setSessionQuestions(questionsToUse);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setUsedHints({});
    setSavedToMistakes(false);
    setStep('doing');
  };

  // Chọn đáp án
  const handleSelectAnswer = (qId: string, val: string) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  // Đánh dấu cần xem lại
  const toggleFlag = (qId: string) => {
    setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }));
  };

  // Dùng gợi ý
  const handleUseHint = (qId: string) => {
    setUsedHints(prev => ({ ...prev, [qId]: true }));
  };

  // Nộp bài ôn tập
  const handleFinishReview = () => {
    // Tính toán kết quả
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    sessionQuestions.forEach(q => {
      const userAns = answers[q.id]?.trim().toLowerCase();
      if (!userAns) {
        unansweredCount++;
      } else if (userAns === q.correctAnswer.trim().toLowerCase()) {
        correctCount++;
      } else {
        wrongCount++;
        // Tự động lưu vào Sổ câu sai
        studentDataService.recordMistake(userId, {
          questionId: q.id,
          subjectCode: q.subjectCode,
          grade: q.grade,
          chapterTitle: q.chapterTitle,
          lessonTitle: q.lessonTitle,
          prompt: q.prompt,
          questionType: q.questionType,
          options: q.options,
          studentAnswer: answers[q.id] || '(Chưa trả lời)',
          correctAnswer: q.correctAnswer,
          explanation: q.explanation
        });
      }
    });

    const calculatedScore = sessionQuestions.length > 0
      ? Math.round((correctCount / sessionQuestions.length) * 10 * 10) / 10
      : 0;

    // Ghi vào nhật ký hoạt động
    const currentSubjectName = THCS_SUBJECTS.find(s => s.code === selectedSubjectCode)?.name || 'Môn học';
    studentDataService.logActivity(userId, {
      type: 'review',
      title: `Ôn tập ${currentSubjectName} ${currentGradeNum}`,
      subjectCode: selectedSubjectCode,
      grade: currentGradeNum,
      score: calculatedScore,
      maxScore: 10,
      details: `Đúng ${correctCount}/${sessionQuestions.length} câu`
    });

    setSavedToMistakes(true);
    setStep('results');
  };

  // Câu hỏi hiện tại
  const currentQ = sessionQuestions[currentIndex];

  // Kết quả sau khi kết thúc
  const resultsSummary = useMemo(() => {
    if (step !== 'results') return null;
    let correct = 0;
    let wrong = 0;
    let unanswered = 0;
    const wrongList: QuestionBankItem[] = [];

    sessionQuestions.forEach(q => {
      const ans = answers[q.id]?.trim().toLowerCase();
      if (!ans) {
        unanswered++;
        wrongList.push(q);
      } else if (ans === q.correctAnswer.trim().toLowerCase()) {
        correct++;
      } else {
        wrong++;
        wrongList.push(q);
      }
    });

    const score = sessionQuestions.length > 0 ? ((correct / sessionQuestions.length) * 10).toFixed(1) : '0';
    return { correct, wrong, unanswered, score, wrongList };
  }, [step, sessionQuestions, answers]);

  // Luyện lại câu sai
  const handleRetryMistakes = () => {
    if (!resultsSummary || resultsSummary.wrongList.length === 0) return;
    setSessionQuestions(resultsSummary.wrongList);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged({});
    setUsedHints({});
    setStep('doing');
  };

  return (
    <div className="space-y-6">
      {/* 1. MÀN HÌNH CHỌN NỘI DUNG ÔN TẬP (CONFIG) */}
      {step === 'config' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1A56DB]" />
              <span>Thiết lập nội dung ôn tập</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn phạm vi, mức độ và số lượng câu hỏi để luyện tập và nhận phản hồi chi tiết.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Cột 1: Môn & Khối */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Khối lớp THCS:</label>
                <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
                  {[6, 7, 8, 9].map((g) => (
                    <button
                      key={g}
                      onClick={() => setSelectedGrade(g as 6 | 7 | 8 | 9)}
                      className={`flex-1 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                        currentGradeNum === g
                          ? 'bg-[#1A56DB] text-white shadow-2xs font-bold'
                          : 'text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Lớp {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Môn học THCS:</label>
                <select
                  value={selectedSubjectCode}
                  onChange={(e) => setSelectedSubjectCode(e.target.value)}
                  aria-label="Chọn môn học để ôn tập"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
                >
                  {THCS_SUBJECTS.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phạm vi ôn tập:</label>
                <select
                  value={scope}
                  onChange={(e) => setScope(e.target.value as any)}
                  aria-label="Chọn phạm vi ôn tập"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
                >
                  <option value="lesson">Theo bài học</option>
                  <option value="chapter">Theo chương / chủ đề</option>
                  <option value="mid_term_1">Ôn thi Giữa kỳ I</option>
                  <option value="final_term_1">Ôn thi Cuối kỳ I</option>
                  <option value="mid_term_2">Ôn thi Giữa kỳ II</option>
                  <option value="final_term_2">Ôn thi Cuối kỳ II</option>
                </select>
              </div>
            </div>

            {/* Cột 2: Mức độ & Số câu */}
            <div className="space-y-4">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Mức độ nhận thức:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'ket_hop', label: 'Kết hợp các mức' },
                    { id: 'biet', label: 'Nhận biết' },
                    { id: 'hieu', label: 'Thông hiểu' },
                    { id: 'van_dung', label: 'Vận dụng' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      onClick={() => setDifficulty(lvl.id as any)}
                      className={`p-2 rounded-xl border text-center font-semibold transition cursor-pointer ${
                        difficulty === lvl.id
                          ? 'bg-blue-100 text-blue-900 border-blue-400 font-bold'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Số câu ôn tập (Khả dụng: {availableQuestions.length} câu):
                </label>
                <div className="flex items-center gap-2">
                  {[3, 5, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => setQuestionCount(num)}
                      disabled={num > availableQuestions.length && availableQuestions.length > 0}
                      className={`px-4 py-2 rounded-xl border font-bold transition cursor-pointer ${
                        questionCount === num
                          ? 'bg-[#1A56DB] text-white border-blue-700 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 disabled:opacity-40'
                      }`}
                    >
                      {num} câu
                    </button>
                  ))}
                </div>
              </div>

              {/* Thông báo tình trạng câu hỏi chuẩn xác */}
              <div className="p-3.5 rounded-xl border bg-blue-50/60 border-blue-200 text-slate-700 leading-relaxed">
                <span className="font-bold text-blue-900">Thông tin ngân hàng: </span>
                {availableQuestions.length > 0 ? (
                  <span>
                    Hiện có <strong className="text-blue-900">{availableQuestions.length} câu hỏi</strong> chuẩn duyệt cho môn này. Các câu sai sẽ tự động được ghi vào Sổ câu sai để em xem lại.
                  </span>
                ) : (
                  <span className="text-amber-800">
                    Chưa có câu hỏi nào được duyệt cho môn/mức độ này. Vui lòng chọn môn Tin học hoặc Toán lớp 6 để thử nghiệm.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              onClick={handleStartReview}
              disabled={availableQuestions.length === 0}
              className="px-6 py-2.5 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-2 shadow-xs disabled:opacity-50 cursor-pointer"
            >
              <span>Bắt đầu ôn tập</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 2. MÀN HÌNH LÀM BÀI ÔN TẬP (DOING) */}
      {step === 'doing' && currentQ && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          {/* Thanh trên: Tiến trình, Đánh dấu, Thoát */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-slate-900 text-sm">
                Câu {currentIndex + 1} / {sessionQuestions.length}
              </span>
              <span className="text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-semibold">
                {currentQ.chapterTitle}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFlag(currentQ.id)}
                className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 font-semibold transition cursor-pointer ${
                  flagged[currentQ.id]
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{flagged[currentQ.id] ? 'Đã đánh dấu' : 'Xem lại sau'}</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Em có chắc muốn dừng bài ôn tập này?')) {
                    setStep('config');
                  }
                }}
                className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-semibold transition cursor-pointer"
              >
                Thoát
              </button>
            </div>
          </div>

          {/* Dải số câu chọn nhanh */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {sessionQuestions.map((q, idx) => {
              const isAnswered = !!answers[q.id];
              const isCurrent = idx === currentIndex;
              const isFlag = !!flagged[q.id];
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-8 h-8 rounded-lg font-bold transition flex items-center justify-center relative cursor-pointer ${
                    isCurrent
                      ? 'bg-[#1A56DB] text-white shadow-2xs'
                      : isAnswered
                      ? 'bg-blue-100 text-blue-900 border border-blue-300'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span>{idx + 1}</span>
                  {isFlag && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-1 -right-1 ring-1 ring-white" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Nội dung câu hỏi */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-2">
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-xs font-bold shrink-0 mt-0.5">
                {currentQ.questionType === 'abcd' ? 'Trắc nghiệm ABCD' : currentQ.questionType === 'true_false' ? 'Đúng / Sai' : currentQ.questionType === 'short' ? 'Trả lời ngắn' : 'Tự luận'}
              </span>
              <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-relaxed">
                {currentQ.prompt}
              </h3>
            </div>

            {/* Các dạng trả lời */}
            {currentQ.options && currentQ.options.length > 0 ? (
              <div className="space-y-2 pt-2">
                {currentQ.options.map((opt) => {
                  const isSelected = answers[currentQ.id] === opt.key;
                  return (
                    <label
                      key={opt.key}
                      onClick={() => handleSelectAnswer(currentQ.id, opt.key)}
                      className={`p-3 rounded-xl border-2 transition cursor-pointer flex items-center gap-3 text-sm ${
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
              <div className="pt-2">
                <input
                  type="text"
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                  placeholder="Nhập câu trả lời ngắn của em..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
              </div>
            ) : (
              <div className="pt-2 space-y-1">
                <textarea
                  value={answers[currentQ.id] || ''}
                  onChange={(e) => handleSelectAnswer(currentQ.id, e.target.value)}
                  rows={4}
                  placeholder="Trình bày câu trả lời tự luận của em..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
                />
                <span className="text-[11px] text-slate-500 italic block">
                  * Câu tự luận có trạng thái "Chờ giáo viên chấm" và không tự tính điểm tự động.
                </span>
              </div>
            )}

            {/* Khung Gợi ý nếu học sinh cần */}
            {currentQ.hint && (
              <div className="pt-2">
                {usedHints[currentQ.id] ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
                    <span className="font-bold flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                      <span>Gợi ý hướng dẫn:</span>
                    </span>
                    <p>{currentQ.hint}</p>
                    <span className="text-[10px] text-amber-700 italic block">
                      (Lượt sử dụng gợi ý đã được ghi nhận trong phiên ôn tập)
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handleUseHint(currentQ.id)}
                    className="text-xs text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                    <span>Xem gợi ý giải thích</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Thanh chuyển câu & Hoàn thành */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
            <button
              onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 rounded-xl font-semibold transition flex items-center gap-1 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Câu trước</span>
            </button>

            {currentIndex < sessionQuestions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => Math.min(sessionQuestions.length - 1, prev + 1))}
                className="px-5 py-2 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-xl font-bold transition flex items-center gap-1 shadow-2xs cursor-pointer"
              >
                <span>Câu tiếp</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleFinishReview}
                className="px-6 py-2 bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Nộp bài ôn tập</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 3. MÀN HÌNH KẾT QUẢ VÀ XEM LẠI (RESULTS) */}
      {step === 'results' && resultsSummary && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="text-center space-y-2 border-b border-slate-100 pb-5">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-[#1A56DB] flex items-center justify-center mx-auto text-2xl font-bold">
              {resultsSummary.score}
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Hoàn thành phiên ôn tập!
            </h2>
            <p className="text-xs text-slate-500">
              Điểm số được tính trên các câu trắc nghiệm khách quan có quy tắc chấm xác định.
            </p>
          </div>

          {/* 3 Thẻ thống kê */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="text-2xl font-bold text-emerald-800">{resultsSummary.correct}</div>
              <div className="text-xs font-semibold text-emerald-700">Câu đúng</div>
            </div>
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
              <div className="text-2xl font-bold text-rose-800">{resultsSummary.wrong}</div>
              <div className="text-xs font-semibold text-rose-700">Câu sai</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-2xl font-bold text-slate-700">{resultsSummary.unanswered}</div>
              <div className="text-xs font-semibold text-slate-600">Chưa làm</div>
            </div>
          </div>

          {/* Thông báo tự động ghi vào Sổ câu sai */}
          {savedToMistakes && resultsSummary.wrong > 0 && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  Đã tự động lưu <strong>{resultsSummary.wrong} câu sai</strong> vào <strong>Sổ câu sai</strong> của em để tiện xem lại bất cứ lúc nào.
                </span>
              </div>
              <button
                onClick={() => setStudentSection('mistakes')}
                className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-bold hover:bg-amber-700 shrink-0 cursor-pointer"
              >
                Xem sổ câu sai
              </button>
            </div>
          )}

          {/* Xem lại danh sách câu hỏi trong phiên */}
          <div className="space-y-4 pt-2">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Xem lại chi tiết từng câu:
            </h3>

            <div className="space-y-3">
              {sessionQuestions.map((q, idx) => {
                const userAns = answers[q.id];
                const isCorrect = userAns?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
                const isEssay = q.questionType === 'essay';

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border text-xs space-y-2 ${
                      isEssay
                        ? 'border-blue-200 bg-blue-50/30'
                        : isCorrect
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-900">
                        Câu {idx + 1}: {q.prompt}
                      </span>
                      {isEssay ? (
                        <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded shrink-0">
                          Chờ giáo viên chấm
                        </span>
                      ) : isCorrect ? (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded shrink-0">
                          ✓ Đúng
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded shrink-0">
                          ✗ Sai
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-slate-600 space-y-0.5">
                      <div>Em đã chọn: <strong>{userAns || '(Bỏ trống)'}</strong></div>
                      {!isEssay && !isCorrect && (
                        <div className="text-emerald-800 font-semibold">
                          Đáp án đúng: <strong>{q.correctAnswer}</strong>
                        </div>
                      )}
                    </div>

                    {q.explanation && (
                      <div className="text-[11px] text-slate-700 bg-white/80 p-2.5 rounded-lg border border-slate-200 leading-relaxed">
                        <span className="font-bold">Giải thích: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Các nút hành động */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
            <button
              onClick={() => setStep('config')}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Ôn tập chủ đề khác</span>
            </button>

            <div className="flex items-center gap-2">
              {resultsSummary.wrongList.length > 0 && (
                <button
                  onClick={handleRetryMistakes}
                  className="px-4 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Luyện lại câu sai ({resultsSummary.wrongList.length})</span>
                </button>
              )}
              <button
                onClick={() => setStudentSection('interactive')}
                className="px-4 py-2 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-xl font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mở bài học liên quan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
