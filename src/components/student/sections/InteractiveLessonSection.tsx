/**
 * Section 2: Học tương tác (Interactive Lessons)
 * Bố cục:
 * 1. Bộ chọn phụ thuộc nhau theo thứ tự: Khối lớp → Môn học → Chương/Chủ đề → Bài học
 * 2. Đổi lựa chọn cha tự động xóa và reset lựa chọn con
 * 3. Tìm kiếm bài học theo tên
 * 4. Đường dẫn nội dung (Breadcrumbs)
 * 5. Tích hợp HtmlLessonViewer nhúng iframe an toàn
 * 6. Thông báo "Bài học đang được chuẩn bị" nếu chưa có HTML
 * 7. Nút "Ôn bài này" và "Hỏi giáo viên" liên kết trực tiếp
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { HtmlLessonViewer } from '../HtmlLessonViewer';
import {
  LESSON_REGISTRY,
  getChapters,
  getLessons,
  findLesson,
  LessonDef
} from '../../../services/lessonRegistry';
import { studentDataService } from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Play,
  Search,
  BookOpen,
  ChevronRight,
  AlertCircle,
  HelpCircle,
  Clock,
  Layers,
  Sparkles
} from 'lucide-react';

export const InteractiveLessonSection: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    selectedSubjectCode,
    setSelectedSubjectCode,
    setStudentSection
  } = useNavigation();

  const { userId } = useAuth();

  const currentGradeNum = typeof selectedGrade === 'number' ? selectedGrade : 6;

  // Trạng thái chương, bài và tìm kiếm
  const [selectedChapterId, setSelectedChapterId] = useState<string>('chuong_1');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('bai_1');
  const [activeLesson, setActiveLesson] = useState<LessonDef | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  // 1. Lấy danh sách chương theo Khối và Môn
  const chapters = useMemo(() => {
    return getChapters(currentGradeNum, selectedSubjectCode);
  }, [currentGradeNum, selectedSubjectCode]);

  // 2. Lấy danh sách bài theo Chương
  const lessons = useMemo(() => {
    if (!selectedChapterId) return [];
    return getLessons(currentGradeNum, selectedSubjectCode, selectedChapterId);
  }, [currentGradeNum, selectedSubjectCode, selectedChapterId]);

  // Lọc bài học theo tìm kiếm
  const filteredLessons = useMemo(() => {
    if (!searchQuery.trim()) return lessons;
    const q = searchQuery.toLowerCase().trim();
    return lessons.filter(l => l.title.toLowerCase().includes(q) || l.code.toLowerCase().includes(q));
  }, [lessons, searchQuery]);

  // Khi đổi Khối lớp: xóa chương, bài và đóng bài đang mở
  const handleGradeChange = (newGrade: number) => {
    setSelectedGrade(newGrade as 6 | 7 | 8 | 9);
    setSelectedChapterId('');
    setSelectedLessonId('');
    setActiveLesson(null);
  };

  // Khi đổi Môn học: xóa chương, bài và đóng bài đang mở
  const handleSubjectChange = (newSubjCode: string) => {
    setSelectedSubjectCode(newSubjCode);
    const newChapters = getChapters(currentGradeNum, newSubjCode);
    const firstChapter = newChapters[0]?.id || '';
    setSelectedChapterId(firstChapter);
    const newLessons = firstChapter ? getLessons(currentGradeNum, newSubjCode, firstChapter) : [];
    setSelectedLessonId(newLessons[0]?.id || '');
    setActiveLesson(null);
  };

  // Khi đổi Chương: xóa bài cũ và đóng bài đang mở
  const handleChapterChange = (newChapId: string) => {
    setSelectedChapterId(newChapId);
    const newLessons = getLessons(currentGradeNum, selectedSubjectCode, newChapId);
    setSelectedLessonId(newLessons[0]?.id || '');
    setActiveLesson(null);
  };

  // Mở bài học
  const handleOpenLesson = (lesson: LessonDef) => {
    setActiveLesson(lesson);
    setSelectedLessonId(lesson.id);

    // Ghi nhận hoạt động vào nhật ký
    studentDataService.logActivity(userId, {
      type: 'lesson',
      title: lesson.title,
      subjectCode: selectedSubjectCode,
      grade: currentGradeNum,
      details: lesson.hasHtml ? 'Mở bài học tương tác HTML' : 'Xem thông tin chuẩn bị bài học'
    });
  };

  // Tự động mở bài mặc định (Tin học 6 - Bài 1) khi khởi tạo lần đầu nếu đang ở Tin học 6
  useEffect(() => {
    if (currentGradeNum === 6 && selectedSubjectCode === 'tin_hoc' && selectedChapterId === 'chuong_1' && !activeLesson) {
      const defaultLesson = findLesson(6, 'tin_hoc', 'chuong_1', 'bai_1');
      if (defaultLesson) {
        setActiveLesson(defaultLesson);
      }
    }
  }, [currentGradeNum, selectedSubjectCode, selectedChapterId]);

  // Tên môn hiện tại
  const currentSubjectName = THCS_SUBJECTS.find(s => s.code === selectedSubjectCode)?.name || 'Môn học';
  const currentChapterTitle = chapters.find(c => c.id === selectedChapterId)?.title || 'Chương học';

  // Chuyển sang Ôn bài này
  const handleReviewThisLesson = () => {
    setStudentSection('review');
  };

  // Chuyển sang Hỏi giáo viên bài này
  const handleAskTeacherThisLesson = () => {
    setStudentSection('ask_teacher');
  };

  return (
    <div className="space-y-6">
      {/* 1. THANH BỘ CHỌN PHỤ THUỘC & TÌM KIẾM */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#1A56DB]" />
              <span>Học bài tương tác theo chương trình</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Chọn Lớp → Môn → Chương/Chủ đề → Bài học để mở bài tương tác HTML chuẩn duyệt.
            </p>
          </div>

          {/* Ô tìm kiếm bài học */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm bài học..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Cụm 4 bộ chọn phụ thuộc */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Bộ chọn 1: Khối lớp */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">1. Khối lớp THCS:</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => handleGradeChange(g)}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
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

          {/* Bộ chọn 2: Môn học */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">2. Môn học:</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => handleSubjectChange(e.target.value)}
              aria-label="Chọn môn học"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white cursor-pointer"
            >
              {THCS_SUBJECTS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Bộ chọn 3: Chương / Chủ đề */}
          <div>
            <label className="font-bold text-slate-700 block mb-1">3. Chương / Chủ đề:</label>
            <select
              value={selectedChapterId}
              onChange={(e) => handleChapterChange(e.target.value)}
              disabled={chapters.length === 0}
              aria-label="Chọn chương hoặc chủ đề"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:bg-white disabled:opacity-50 cursor-pointer"
            >
              {chapters.length > 0 ? (
                chapters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title}
                  </option>
                ))
              ) : (
                <option value="">Chưa có chương học</option>
              )}
            </select>
          </div>
        </div>

        {/* Đường dẫn nội dung (Breadcrumbs) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="font-semibold text-slate-700">Đường dẫn:</span>
          <span>Lớp {currentGradeNum}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-blue-900 font-semibold">{currentSubjectName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span>{currentChapterTitle}</span>
          {activeLesson && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className="font-bold text-blue-950">{activeLesson.title}</span>
            </>
          )}
        </div>
      </div>

      {/* 2. DANH SÁCH BÀI HỌC VÀ KHUNG HIỂN THỊ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Danh sách bài học của chương (4 cột trên desktop nếu chưa phóng to) */}
        {!isExpanded && (
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-slate-800">
                Danh sách bài học ({filteredLessons.length})
              </span>
              <span className="text-[11px] text-slate-400">Kết nối tri thức</span>
            </div>

            {filteredLessons.length > 0 ? (
              <div className="space-y-2">
                {filteredLessons.map((l) => {
                  const isCurrent = activeLesson?.id === l.id;
                  return (
                    <div
                      key={l.id}
                      onClick={() => handleOpenLesson(l)}
                      className={`p-3 rounded-xl border transition text-left cursor-pointer flex flex-col justify-between gap-1.5 ${
                        isCurrent
                          ? 'border-blue-500 bg-blue-50/50 shadow-2xs'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className={`text-xs font-bold ${isCurrent ? 'text-blue-950' : 'text-slate-800'}`}>
                          {l.title}
                        </span>
                        {l.hasHtml ? (
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded shrink-0">
                            HTML Có sẵn
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                            Chuẩn bị
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>{l.code}</span>
                        <span className="text-blue-900 font-semibold flex items-center gap-0.5">
                          <span>Mở bài</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500 text-xs space-y-1">
                <div>Chưa có bài học nào trong danh mục này.</div>
                <div className="text-slate-400 text-[11px]">Vui lòng chọn môn hoặc chương khác.</div>
              </div>
            )}
          </div>
        )}

        {/* Khung nội dung bài học HTML hoặc thông báo (8 cột hoặc 12 cột khi mở rộng) */}
        <div className={isExpanded ? 'lg:col-span-12' : 'lg:col-span-8'}>
          {activeLesson ? (
            activeLesson.hasHtml && activeLesson.htmlContent ? (
              /* Trường hợp 1: Có bài học HTML */
              <HtmlLessonViewer
                htmlContent={activeLesson.htmlContent}
                title={activeLesson.title}
                subjectName={currentSubjectName}
                grade={currentGradeNum}
                isExpanded={isExpanded}
                setIsExpanded={setIsExpanded}
                onReviewLesson={handleReviewThisLesson}
                onAskTeacher={handleAskTeacherThisLesson}
              />
            ) : (
              /* Trường hợp 2: Bài học chưa có file HTML */
              <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-4 shadow-xs">
                <div className="w-14 h-14 rounded-full bg-blue-50 text-[#1A56DB] flex items-center justify-center mx-auto text-2xl">
                  📖
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                    Bài học đang được chuẩn bị
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 pt-1">
                    {activeLesson.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentSubjectName} {currentGradeNum} • {currentChapterTitle}
                  </p>
                </div>

                <div className="max-w-md mx-auto p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 leading-relaxed text-left">
                  {activeLesson.unpreparedNotice ||
                    'Nội dung bài học tương tác này đang được tổ chuyên môn biên soạn và thẩm định theo bản đặc tả học liệu số THCS.'}
                </div>

                <div className="pt-2 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => {
                      // Chuyển sang bài Tin học 6 mẫu có HTML
                      setSelectedGrade(6);
                      setSelectedSubjectCode('tin_hoc');
                      setSelectedChapterId('chuong_1');
                      const th1 = findLesson(6, 'tin_hoc', 'chuong_1', 'bai_1');
                      if (th1) handleOpenLesson(th1);
                    }}
                    className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Học bài mẫu: Tin học 6 (Bài 1)</span>
                  </button>
                  <button
                    onClick={handleReviewThisLesson}
                    className="px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl text-xs font-semibold hover:bg-slate-50 transition cursor-pointer"
                  >
                    <span>Luyện câu hỏi ôn tập</span>
                  </button>
                </div>
              </div>
            )
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-2 shadow-xs">
              <div className="text-3xl">👈</div>
              <div className="text-sm font-bold text-slate-700">Em hãy chọn một bài học từ danh sách bên trái để bắt đầu.</div>
              <div className="text-xs text-slate-400">Nội dung bài học sẽ hiển thị tại đây với giao diện tương tác đầy đủ.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
