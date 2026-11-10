/**
 * Section 7: Sổ câu sai (Mistakes Notebook)
 * Bố cục:
 * 1. Thanh tiêu đề & Bộ lọc theo Môn học, Trạng thái (Cần ôn / Đang luyện lại / Đã trả lời đúng)
 * 2. Nút hành động nhanh: "Luyện toàn bộ câu sai"
 * 3. Danh sách thẻ câu sai: Đề bài, câu trả lời sai của em, đáp án đúng & giải thích
 * 4. Ô ghi chú cá nhân của học sinh gắn liền với câu hỏi
 * 5. Modal "Luyện lại câu này" để thử sức ngay tại chỗ
 * 6. Nút "Mở bài học liên quan"
 */

import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  studentDataService,
  MistakeItem
} from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Bookmark,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Edit3,
  Save,
  HelpCircle,
  Lightbulb,
  Search,
  ChevronRight,
  Filter
} from 'lucide-react';

export const MistakesSection: React.FC = () => {
  const { setStudentSection, setSelectedSubjectCode } = useNavigation();
  const { userId } = useAuth();

  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'need_review' | 'practicing' | 'corrected'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Danh sách câu sai từ studentDataService
  const [mistakesList, setMistakesList] = useState<MistakeItem[]>(() => {
    return studentDataService.getMistakes(userId);
  });

  // Modal luyện lại 1 câu
  const [practicingItem, setPracticingItem] = useState<MistakeItem | null>(null);
  const [practiceAnswer, setPracticeAnswer] = useState<string>('');
  const [practiceFeedback, setPracticeFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);

  // Ghi chú cá nhân đang soạn thảo
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [editingNotesText, setEditingNotesText] = useState<string>('');

  // Làm mới danh sách câu sai
  const refreshMistakes = () => {
    setMistakesList(studentDataService.getMistakes(userId));
  };

  // Lọc câu sai
  const filteredMistakes = useMemo(() => {
    return mistakesList.filter(item => {
      const matchSubj = subjectFilter === 'ALL' || item.subjectCode === subjectFilter;
      const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
      const matchQuery = !searchQuery.trim() || item.prompt.toLowerCase().includes(searchQuery.toLowerCase().trim());
      return matchSubj && matchStatus && matchQuery;
    });
  }, [mistakesList, subjectFilter, statusFilter, searchQuery]);

  // Lưu ghi chú cá nhân cho 1 câu sai
  const handleSaveNotes = (id: string) => {
    studentDataService.updateMistake(userId, id, {
      personalNotes: editingNotesText
    });
    setEditingNotesId(null);
    refreshMistakes();
  };

  // Mở modal luyện lại câu này
  const handleOpenPracticeModal = (item: MistakeItem) => {
    setPracticingItem(item);
    setPracticeAnswer('');
    setPracticeFeedback(null);
  };

  // Kiểm tra câu trả lời luyện lại
  const handleCheckPracticeAnswer = () => {
    if (!practicingItem) return;
    const isCorrect = practiceAnswer.trim().toLowerCase() === practicingItem.correctAnswer.trim().toLowerCase();

    if (isCorrect) {
      setPracticeFeedback({
        isCorrect: true,
        message: 'Hoàn toàn chính xác! Em đã hiểu bản chất câu hỏi và khắc phục được lỗi sai trước đó.'
      });
      // Cập nhật trạng thái thành 'corrected'
      studentDataService.updateMistake(userId, practicingItem.id, {
        status: 'corrected'
      });
      refreshMistakes();
    } else {
      setPracticeFeedback({
        isCorrect: false,
        message: 'Chưa chính xác. Em hãy đọc lại giải thích bên dưới hoặc mở bài học để ôn tập kỹ hơn nhé!'
      });
      studentDataService.updateMistake(userId, practicingItem.id, {
        status: 'practicing'
      });
      refreshMistakes();
    }
  };

  // Chuyển sang Học tương tác bài liên quan
  const handleOpenLesson = (item: MistakeItem) => {
    setSelectedSubjectCode(item.subjectCode);
    setStudentSection('interactive');
  };

  return (
    <div className="space-y-6">
      {/* 1. THANH TIÊU ĐỀ & BỘ LỌC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-amber-600" />
              <span>Sổ câu sai cá nhân (Ôn tập &amp; Khắc phục lỗi)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Hệ thống tự động ghi nhận các câu hỏi em đã trả lời chưa đúng để em luyện lại và ghi chép kinh nghiệm.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-xl">
              Tổng cộng: {mistakesList.length} câu cần lưu ý
            </span>
          </div>
        </div>

        {/* 3 Bộ lọc: Môn, Trạng thái, Tìm kiếm */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Môn học:</label>
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              aria-label="Lọc câu sai theo môn học"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ALL">Tất cả các môn</option>
              {THCS_SUBJECTS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Trạng thái:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              aria-label="Lọc câu sai theo trạng thái"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="need_review">Cần ôn tập</option>
              <option value="practicing">Đang luyện lại</option>
              <option value="corrected">Đã trả lời đúng khi luyện lại</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Tìm kiếm nội dung:</label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm câu hỏi..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. DANH SÁCH CÂU SAI */}
      {filteredMistakes.length > 0 ? (
        <div className="space-y-4">
          {filteredMistakes.map((item, idx) => (
            <div
              key={item.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3"
            >
              {/* Header câu sai */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Lớp {item.grade} • {item.lessonTitle}
                  </span>
                  <span className="text-slate-400">· {item.chapterTitle}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    item.status === 'corrected'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : item.status === 'practicing'
                      ? 'bg-blue-50 text-blue-800 border border-blue-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}>
                    {item.status === 'corrected' ? '✓ Đã sửa đúng' : item.status === 'practicing' ? 'Đang luyện lại' : '● Cần ôn tập'}
                  </span>
                  <span className="text-slate-400 text-[11px]">Sai {item.wrongCount} lần</span>
                </div>
              </div>

              {/* Nội dung câu hỏi */}
              <div className="space-y-2">
                <div className="font-bold text-slate-900 text-sm sm:text-base leading-relaxed">
                  Câu {idx + 1}: {item.prompt}
                </div>

                {/* Phương án hoặc câu trả lời trước đó */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                  <div className="text-rose-700">
                    Câu trả lời của em: <strong>{item.studentAnswer || '(Chưa làm)'}</strong>
                  </div>
                  <div className="text-emerald-800 font-semibold">
                    Đáp án chuẩn: <strong>{item.correctAnswer}</strong>
                  </div>
                  {item.explanation && (
                    <div className="text-slate-600 pt-1 border-t border-slate-200 mt-1">
                      <span className="font-bold">Giải thích: </span>
                      {item.explanation}
                    </div>
                  )}
                </div>
              </div>

              {/* Ghi chú cá nhân của học sinh */}
              <div className="pt-1">
                {editingNotesId === item.id ? (
                  <div className="space-y-2 p-3 bg-amber-50/60 border border-amber-200 rounded-xl text-xs">
                    <span className="font-bold text-amber-950 block">Ghi chú rút kinh nghiệm của em:</span>
                    <textarea
                      value={editingNotesText}
                      onChange={(e) => setEditingNotesText(e.target.value)}
                      rows={2}
                      placeholder="Ghi lại nguyên nhân em làm sai hoặc kiến thức cần nhớ..."
                      className="w-full bg-white border border-amber-300 rounded-lg p-2 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingNotesId(null)}
                        className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-semibold hover:bg-slate-200 cursor-pointer"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => handleSaveNotes(item.id)}
                        className="px-3 py-1 bg-amber-600 text-white rounded text-[11px] font-bold hover:bg-amber-700 cursor-pointer"
                      >
                        Lưu ghi chú
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <div className="truncate max-w-lg">
                      {item.personalNotes ? (
                        <span className="text-slate-700 italic">
                          📝 Ghi chú: "{item.personalNotes}"
                        </span>
                      ) : (
                        <span className="text-slate-400 italic">Chưa có ghi chú rút kinh nghiệm</span>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        setEditingNotesId(item.id);
                        setEditingNotesText(item.personalNotes || '');
                      }}
                      className="text-amber-800 hover:text-amber-950 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{item.personalNotes ? 'Sửa ghi chú' : '+ Thêm ghi chú'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Nút hành động */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                <button
                  onClick={() => handleOpenLesson(item)}
                  className="text-blue-900 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Mở bài học liên quan</span>
                </button>

                <button
                  onClick={() => handleOpenPracticeModal(item)}
                  className="px-4 py-1.5 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Luyện lại câu này</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs space-y-2 shadow-xs">
          <div className="text-3xl">🎉</div>
          <div className="text-sm font-bold text-slate-800">Không có câu sai nào trong danh mục này!</div>
          <div className="text-slate-400 text-[11px]">
            Khi làm bài ôn tập hoặc kiểm tra, nếu có câu nào chưa đúng, hệ thống sẽ tự động lưu lại vào đây để em ôn luyện.
          </div>
        </div>
      )}

      {/* 3. MODAL LUYỆN LẠI CÂU NÀY */}
      {practicingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xl max-w-xl w-full space-y-4 font-serif">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                Luyện lại câu hỏi
              </span>
              <button
                onClick={() => setPracticingItem(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-base text-slate-900 leading-relaxed">
                {practicingItem.prompt}
              </h4>

              {/* Lựa chọn hoặc nhập câu trả lời */}
              {practicingItem.options && practicingItem.options.length > 0 ? (
                <div className="space-y-2 text-xs">
                  {practicingItem.options.map((opt) => (
                    <label
                      key={opt.key}
                      onClick={() => setPracticeAnswer(opt.key)}
                      className={`p-3 rounded-xl border transition cursor-pointer flex items-center gap-2.5 ${
                        practiceAnswer === opt.key
                          ? 'border-amber-600 bg-amber-50/60 font-bold text-amber-950'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center text-xs">
                        {opt.key}
                      </span>
                      <span>{opt.text}</span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  value={practiceAnswer}
                  onChange={(e) => setPracticeAnswer(e.target.value)}
                  placeholder="Nhập câu trả lời của em..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              )}

              {/* Phản hồi sau khi kiểm tra */}
              {practiceFeedback && (
                <div className={`p-3 rounded-xl text-xs leading-relaxed ${
                  practiceFeedback.isCorrect
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border border-rose-200 text-rose-900'
                }`}>
                  <strong>{practiceFeedback.isCorrect ? '✓ ' : '✗ '}</strong>
                  {practiceFeedback.message}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <button
                onClick={() => setPracticingItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl font-semibold transition cursor-pointer"
              >
                Đóng
              </button>

              <button
                onClick={handleCheckPracticeAnswer}
                disabled={!practiceAnswer.trim()}
                className="px-5 py-2 bg-amber-600 text-white hover:bg-amber-700 rounded-xl font-bold transition disabled:opacity-40 shadow-2xs cursor-pointer"
              >
                Kiểm tra câu trả lời
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
