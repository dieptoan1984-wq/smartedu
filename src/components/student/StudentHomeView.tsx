/**
 * StudentHomeView - Trang tổng quan Không gian học sinh
 * Gồm:
 * 1. Menu bên trái: Góc học tập, Học tương tác, Ôn tập, Kiểm tra, Trò chơi, Tiến bộ, Sổ câu sai, Kế hoạch học, Hỏi giáo viên
 * 2. Khối "Tiếp tục bài đang học" -> Liên kết trực tiếp vào bài học tương tác minh họa (Ảnh 3)
 * 3. Luồng chọn bài: Lớp (6-9) → Môn → Bộ sách (KNTT) → Chương → Bài → Bắt đầu học (Nếu chưa có dữ liệu báo "Nội dung đang được chuẩn bị")
 * 4. Nhiệm vụ giáo viên giao
 * 5. 4 Lối vào: Học tương tác, Ôn tập, Kiểm tra, Trò chơi
 */

import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Laptop,
  BookOpen,
  ClipboardList,
  Gamepad2,
  BarChart2,
  Bookmark,
  Calendar,
  MessageCircle,
  Play,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  BookMarked
} from 'lucide-react';
import { THCS_SUBJECTS } from '../../types/smartEduData';

export const StudentHomeView: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    selectedSubjectCode,
    setSelectedSubjectCode,
    studentSection,
    setStudentSection,
    openLessonPlayer,
    setUnimplementedFeature
  } = useNavigation();

  const { displayName } = useAuth();

  // Trạng thái chọn bộ sách, chương, bài
  const [selectedBook, setSelectedBook] = useState<string>('KNTT');
  const [selectedChapter, setSelectedChapter] = useState<string>('');

  return (
    <div className="font-serif bg-slate-50 min-h-screen flex flex-col">
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* CỘT MENU TRÁI HỌC SINH (ẢNH 3 & YÊU CẦU E) */}
        <aside className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-xs space-y-6">
          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => setStudentSection('dashboard')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 cursor-pointer ${
                studentSection === 'dashboard'
                  ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Góc học tập</span>
            </button>

            <button
              onClick={openLessonPlayer}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Laptop className="w-4 h-4 text-slate-500" />
              <span>Học tương tác</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Ôn tập theo chương và đề cương học kỳ')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Ôn tập</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Làm bài kiểm tra và luyện đề trực tuyến')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-500" />
              <span>Kiểm tra</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Trò chơi học tập tương tác')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-slate-500" />
              <span>Trò chơi</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Báo cáo tiến bộ học tập cá nhân')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <span>Tiến bộ của em</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Sổ câu sai cá nhân')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Sổ câu sai</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Kế hoạch học tập tuần và tháng')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Kế hoạch học</span>
            </button>
          </nav>

          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => setUnimplementedFeature('Hỏi giáo viên bộ môn')}
              className="w-full py-2.5 px-3 bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#1A56DB]" />
              <span>Hỏi giáo viên</span>
            </button>
          </div>
        </aside>

        {/* NỘI DUNG TỔNG QUAN HỌC SINH */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Header chào mừng */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-[#1A56DB] uppercase">
                Góc học tập cá nhân · Cấp THCS
              </span>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                Chào mừng em, {displayName || 'Học sinh Smart EDU'}!
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                Hôm nay em muốn tiếp tục học bài tương tác hay luyện tập ôn bài nào?
              </p>
            </div>

            <button
              onClick={openLessonPlayer}
              className="px-5 py-2.5 bg-[#1A56DB] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-xs shrink-0 cursor-pointer"
            >
              <Play className="w-4 h-4" />
              <span>Vào học bài tương tác</span>
            </button>
          </div>

          {/* 1. KHỐI "TIẾP TỤC BÀI ĐANG HỌC" */}
          <div className="bg-gradient-to-r from-blue-50/80 via-sky-50/60 to-white border border-blue-200 rounded-2xl p-6 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <span>📖</span>
                <span>Tiếp tục bài đang học</span>
              </span>
              <span className="text-xs font-semibold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                Bài học mẫu
              </span>
            </div>

            <div className="bg-white border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-900">
                  <span>Tin học 6</span>
                  <span>•</span>
                  <span>Bài 1: Thông tin và dữ liệu</span>
                </div>
                <div className="text-sm font-bold text-slate-900">
                  Khám phá thông tin và dữ liệu trong đời sống
                </div>
                <div className="text-xs text-slate-500">
                  Đang dừng tại: Bước 2 • Quan sát tình huống thời tiết
                </div>
              </div>

              <button
                onClick={openLessonPlayer}
                className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs shrink-0 cursor-pointer"
              >
                <span>Học tiếp ngay</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 2. KHỐI CHỌN LỚP, MÔN VÀ BỘ SÁCH THEO LUỒNG YÊU CẦU E */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#1A56DB]" />
              <span>Chọn bài học theo chương trình: Lớp → Môn → Bộ sách → Chương → Bài</span>
            </h2>

            {/* Bước 1: Chọn Khối Lớp */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 uppercase">
                1. Khối lớp THCS:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {[6, 7, 8, 9].map((g) => (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g as 6 | 7 | 8 | 9)}
                    className={`px-4 py-1.5 rounded-xl text-sm font-semibold transition cursor-pointer ${
                      selectedGrade === g
                        ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    Lớp {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Bước 2: Chọn Môn Học */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase">
                2. Môn học THCS (Lớp {selectedGrade}):
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {THCS_SUBJECTS.map((s) => (
                  <button
                    key={s.code}
                    onClick={() => {
                      setSelectedSubjectCode(s.code);
                      if (s.code === 'tin_hoc' && selectedGrade === 6) {
                        setSelectedChapter('chuong_1');
                      } else {
                        setSelectedChapter('');
                      }
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      selectedSubjectCode === s.code
                        ? 'bg-blue-100 text-blue-900 font-bold border border-blue-300'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Bước 3: Bộ sách (KNTT) & Chương/Bài */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex items-center gap-4 text-xs">
                <span className="font-bold text-slate-700 uppercase">
                  3. Bộ sách:
                </span>
                <span className="font-semibold text-blue-900 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
                  Kết nối tri thức với cuộc sống (KNTT)
                </span>
              </div>
            </div>

            {/* Bước 4: Danh mục Chương / Bài */}
            <div className="pt-2 border-t border-slate-100">
              <div className="text-xs font-bold text-slate-700 uppercase mb-2">
                4. Chương & Bài học:
              </div>

              {selectedSubjectCode === 'tin_hoc' && selectedGrade === 6 ? (
                /* Tin học 6 có bài mẫu minh họa */
                <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="font-bold text-sm text-slate-900">
                      Chủ đề 1: Máy tính và cộng đồng
                    </div>
                    <div className="text-xs text-blue-900 mt-0.5">
                      Bài 1: Thông tin và dữ liệu (Bài học tương tác minh họa)
                    </div>
                  </div>
                  <button
                    onClick={openLessonPlayer}
                    className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Bắt đầu học ngay</span>
                  </button>
                </div>
              ) : (
                /* Tuân thủ yêu cầu E: Khi chưa có chương/bài hiển thị "Nội dung đang được chuẩn bị", không tự chế dữ liệu */
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center space-y-1">
                  <div className="text-sm font-semibold text-slate-700">
                    Nội dung đang được chuẩn bị
                  </div>
                  <div className="text-xs text-slate-500">
                    Chương và bài học của môn học này đang được tổ chuyên môn biên soạn học liệu tương tác.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 3. KHỐI "NHIỆM VỤ GIÁO VIÊN GIAO" (YÊU CẦU E) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span>
              <span>Nhiệm vụ giáo viên giao</span>
            </h2>
            <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-500">
              Hiện tại chưa có nhiệm vụ hoặc bài tập mới nào được giáo viên giao cho tài khoản của em.
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
