/**
 * HomeView - Trang chủ Smart EDU (Theo Ảnh 1 tham chiếu)
 * Bố cục:
 * 1. Top Hero Banner "Học chủ động, tiến bộ mỗi ngày"
 * 2. Bộ lọc "Em muốn học gì hôm nay?" (Khối 6–9, ô tìm kiếm, lưới 12 môn)
 * 3. 4 Lối vào chính: Học tương tác, Ôn tập, Kiểm tra, Trò chơi
 * 4. Dải dành cho giáo viên: Soạn bài, Tạo bộ hồ sơ kiểm tra, Tạo trò chơi
 */

import React, { useMemo } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Calculator,
  BookOpen,
  FlaskConical,
  Globe,
  Code,
  Settings,
  Scale,
  Activity,
  Palette,
  Sprout,
  MapPin,
  Laptop,
  Layers,
  ClipboardList,
  Gamepad2,
  ChevronRight,
  Search
} from 'lucide-react';

interface SubjectCardDef {
  code: string;
  name: string;
  icon: React.ReactNode;
  iconBg: string;
}

export const HomeView: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    selectedSubjectCode,
    setSelectedSubjectCode,
    searchSubject,
    setSearchSubject,
    openStudentSpace,
    openTeacherSpace,
    openLessonPlayer,
    setStudentSection,
    setUnimplementedFeature
  } = useNavigation();

  const { subjectsTest } = useAuth();

  // 12 môn học THCS chính thức theo bộ sách KNTT với icon & màu sắc nhận diện như Ảnh 1
  const defaultSubjects: SubjectCardDef[] = [
    {
      code: 'toan',
      name: 'Toán',
      icon: <Calculator className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-blue-100'
    },
    {
      code: 'ngu_van',
      name: 'Ngữ văn',
      icon: <BookOpen className="w-6 h-6 text-amber-700" />,
      iconBg: 'bg-amber-100'
    },
    {
      code: 'ngoai_ngu_1',
      name: 'Tiếng Anh',
      icon: (
        <span className="font-bold text-xs bg-red-600 text-white px-1.5 py-0.5 rounded">
          EN
        </span>
      ),
      iconBg: 'bg-blue-50'
    },
    {
      code: 'khtn',
      name: 'Khoa học tự nhiên',
      icon: <FlaskConical className="w-6 h-6 text-cyan-600" />,
      iconBg: 'bg-cyan-100'
    },
    {
      code: 'lich_su_dia_li',
      name: 'Lịch sử và Địa lí',
      icon: <Globe className="w-6 h-6 text-blue-700" />,
      iconBg: 'bg-emerald-100'
    },
    {
      code: 'tin_hoc',
      name: 'Tin học',
      icon: <Code className="w-6 h-6 text-indigo-600" />,
      iconBg: 'bg-indigo-100'
    },
    {
      code: 'cong_nghe',
      name: 'Công nghệ',
      icon: <Settings className="w-6 h-6 text-blue-600" />,
      iconBg: 'bg-slate-100'
    },
    {
      code: 'gdcd',
      name: 'Giáo dục công dân',
      icon: <Scale className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-100'
    },
    {
      code: 'gdtc',
      name: 'Giáo dục thể chất',
      icon: <Activity className="w-6 h-6 text-sky-600" />,
      iconBg: 'bg-sky-100'
    },
    {
      code: 'nghe_thuat',
      name: 'Nghệ thuật',
      icon: <Palette className="w-6 h-6 text-rose-500" />,
      iconBg: 'bg-rose-100'
    },
    {
      code: 'hdtn_hn',
      name: 'Trải nghiệm, hướng nghiệp',
      icon: <Sprout className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-100'
    },
    {
      code: 'gddp',
      name: 'Giáo dục địa phương',
      icon: <MapPin className="w-6 h-6 text-teal-600" />,
      iconBg: 'bg-teal-100'
    }
  ];

  // Nếu Supabase đã trả về danh sách môn học thật, kết hợp tên và trạng thái từ CSDL
  const displaySubjects = useMemo(() => {
    if (subjectsTest.success && subjectsTest.data && subjectsTest.data.length > 0) {
      return defaultSubjects.map(def => {
        const found = subjectsTest.data?.find(s => s.code.toLowerCase() === def.code.toLowerCase());
        return {
          ...def,
          name: found ? found.name : def.name
        };
      });
    }
    return defaultSubjects;
  }, [subjectsTest.data, subjectsTest.success]);

  // Lọc theo thanh tìm kiếm
  const filteredSubjects = useMemo(() => {
    if (!searchSubject.trim()) return displaySubjects;
    const q = searchSubject.toLowerCase().trim();
    return displaySubjects.filter(s => s.name.toLowerCase().includes(q) || s.code.toLowerCase().includes(q));
  }, [displaySubjects, searchSubject]);

  const handleSelectSubject = (code: string) => {
    setSelectedSubjectCode(code);
    if (code === 'tin_hoc') {
      // Mở ngay bài học mẫu theo Ảnh 3
      openLessonPlayer();
    } else {
      openStudentSpace(false);
    }
  };

  return (
    <div className="space-y-8 font-serif pb-12">
      {/* 1. HERO BANNER THEO ẢNH 1 */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50/50 border border-blue-100/80 p-8 sm:p-10 shadow-sm">
        {/* Họa tiết trang trí học tập phong cách minh họa */}
        <div className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-4 pointer-events-none opacity-90 select-none">
          <div className="relative">
            {/* Thẻ công thức toán */}
            <div className="absolute -top-12 -left-8 bg-white/95 border border-blue-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-mono text-blue-900 font-semibold rotate-[-4deg]">
              x² + 3x - 4 = 0
            </div>
            {/* Quả địa cầu & Sách & Bình thí nghiệm minh họa */}
            <div className="w-44 h-36 bg-gradient-to-br from-blue-400/20 to-sky-300/30 rounded-full blur-2xl absolute inset-0 -z-10" />
            <div className="flex items-end gap-3">
              <div className="w-12 h-20 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-b-xl border-2 border-white shadow-md flex items-center justify-center text-white text-xs font-bold">
                ⚗️
              </div>
              <div className="w-32 h-24 bg-white border-2 border-blue-200 rounded-xl shadow-lg p-2.5 flex flex-col justify-between">
                <div className="flex items-center justify-between text-[10px] text-blue-800 font-bold border-b border-blue-100 pb-1">
                  <span>Smart EDU</span>
                  <span>Lớp {selectedGrade}</span>
                </div>
                <div className="space-y-1 my-auto">
                  <div className="h-1.5 bg-blue-100 rounded w-full" />
                  <div className="h-1.5 bg-blue-100 rounded w-5/6" />
                  <div className="h-1.5 bg-sky-200 rounded w-2/3" />
                </div>
                <div className="text-[9px] text-slate-400 text-right">KNTT</div>
              </div>
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex items-center justify-center text-white text-lg">
                🌍
              </div>
            </div>
          </div>
        </div>

        {/* Nội dung bên trái */}
        <div className="max-w-xl relative z-10 space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0F172A] leading-tight">
            Học chủ động, tiến bộ mỗi ngày
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Học tương tác • Ôn tập • Kiểm tra — Dành cho lớp 6–9
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => openStudentSpace(false)}
              className="px-6 py-3 bg-[#1A56DB] text-white font-semibold text-base rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2 group cursor-pointer"
            >
              <span>Vào không gian học sinh</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={openTeacherSpace}
              className="px-6 py-3 bg-white text-slate-800 border border-slate-300 font-semibold text-base rounded-xl hover:bg-slate-50 transition shadow-sm flex items-center gap-2 group cursor-pointer"
            >
              <span>Vào không gian giáo viên</span>
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. KHU VỰC "EM MUỐN HỌC GÌ HÔM NAY?" */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold text-slate-900 whitespace-nowrap">
              Em muốn học gì hôm nay?
            </h2>

            {/* 4 Nút chọn khối lớp 6, 7, 8, 9 */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {[6, 7, 8, 9].map((g) => {
                const isActive = selectedGrade === g;
                return (
                  <button
                    key={g}
                    onClick={() => setSelectedGrade(g as 6 | 7 | 8 | 9)}
                    className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition cursor-pointer ${
                      isActive
                        ? 'bg-[#1A56DB] text-white shadow-sm'
                        : 'text-slate-700 hover:text-slate-900 hover:bg-slate-200/60'
                    }`}
                  >
                    Lớp {g}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ô tìm kiếm môn học, bài học */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              placeholder="Tìm môn học, bài học..."
              className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition shadow-xs"
            />
          </div>
        </div>

        {/* Lưới 12 Môn học THCS theo Ảnh 1 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {filteredSubjects.map((subj) => {
            const isSelected = selectedSubjectCode === subj.code;
            return (
              <div
                key={subj.code}
                onClick={() => handleSelectSubject(subj.code)}
                className={`group bg-white p-3.5 rounded-xl border transition-all cursor-pointer flex items-center gap-3 hover:shadow-md ${
                  isSelected
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-xs'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className={`w-11 h-11 rounded-xl ${subj.iconBg} flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs`}>
                  {subj.icon}
                </div>
                <div className="min-w-0">
                  <div className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-blue-900 transition-colors truncate">
                    {subj.name}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Lớp {selectedGrade}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. BỐN LỐI VÀO CHÍNH (ẢNH 1) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Học tương tác */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700 shrink-0">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Học tương tác</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Khám phá bài học trực quan, tương tác chạm kéo thả và mô phỏng.
              </p>
            </div>
          </div>
          <button
            onClick={openLessonPlayer}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Khám phá bài học</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Ôn tập */}
        <div className="bg-gradient-to-br from-sky-50 to-white border border-sky-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-100 flex items-center justify-center text-sky-700 shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Ôn tập</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Củng cố kiến thức theo chương, chuẩn bị thi giữa kỳ và cuối kỳ.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStudentSection('review')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Theo chương và học kỳ</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 3. Kiểm tra */}
        <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700 shrink-0">
              <ClipboardList className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Kiểm tra</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Luyện đề thường xuyên, định kỳ và làm bài tập thầy cô giao.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStudentSection('assessment')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Luyện đề và bài được giao</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 4. Trò chơi */}
        <div className="bg-gradient-to-br from-purple-50 to-white border border-purple-200/80 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-xs hover:shadow-md transition">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Trò chơi</h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Vừa học vừa chơi cùng bạn bè qua các thử thách trí tuệ thú vị.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStudentSection('game')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
          >
            <span>Học cùng thử thách</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. DẢI DÀNH CHO GIÁO VIÊN THEO ẢNH 1 */}
      <section className="bg-gradient-to-r from-blue-50/70 via-sky-50/60 to-white border border-blue-200/80 rounded-2xl p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-base text-slate-900 block">
              Dành cho giáo viên
            </span>
            <span className="text-xs text-slate-500">
              Không gian quản lí lớp học, ngân hàng câu hỏi và tạo bộ hồ sơ kiểm tra chuẩn hóa
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openTeacherSpace}
            className="px-4 py-2 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-300 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <span>✏️ Soạn bài</span>
          </button>
          <button
            onClick={openTeacherSpace}
            className="px-4 py-2 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-300 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <span>📋 Tạo bộ hồ sơ kiểm tra</span>
          </button>
          <button
            onClick={openTeacherSpace}
            className="px-4 py-2 bg-white hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-300 rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-2xs cursor-pointer"
          >
            <span>🎮 Tạo trò chơi</span>
          </button>
        </div>
      </section>

      {/* Dòng ghi chú bản quyền & minh họa góc dưới như Ảnh 1 */}
      <div className="text-right text-xs text-slate-400 italic pr-2">
        Bản thiết kế đề xuất • Nội dung minh họa
      </div>
    </div>
  );
};
