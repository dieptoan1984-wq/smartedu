/**
 * InteractiveLessonView - Màn hình học bài tương tác của học sinh (Theo Ảnh 3 tham chiếu)
 * Minh họa bài: "Thông tin và dữ liệu - Tin học 6 • Bài học minh họa"
 * Gồm:
 * 1. Breadcrumbs: Lớp 6 / Tin học / Bài học tương tác
 * 2. Ribbon tiến trình bài học: Khởi động, Khám phá, Kiến thức, Luyện tập, Vận dụng, Tự kiểm tra
 * 3. Hoạt động tương tác: Quan sát tình huống thời tiết, lựa chọn câu trả lời, nút Kiểm tra, Gợi ý
 * 4. Vùng ghi nhớ và Lưu ghi chú cá nhân
 * 5. Cột phải: Hoạt động trong bài, Cần hỗ trợ, Tiếp theo
 */

import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
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
  Search,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Info,
  HelpCircle
} from 'lucide-react';

export const InteractiveLessonView: React.FC = () => {
  const {
    openHome,
    openStudentSpace,
    studentSection,
    setStudentSection,
    selectedGrade,
    setUnimplementedFeature
  } = useNavigation();

  // Các bước trong bài học
  const lessonStages = [
    { id: 'khoi_dong', title: 'Khởi động' },
    { id: 'kham_pha', title: 'Khám phá' },
    { id: 'kien_thuc', title: 'Kiến thức' },
    { id: 'luyen_tap', title: 'Luyện tập' },
    { id: 'van_dung', title: 'Vận dụng' },
    { id: 'tu_kiem_tra', title: 'Tự kiểm tra' }
  ];

  const [activeStage, setActiveStage] = useState<string>('kham_pha');
  const [selectedOption, setSelectedOption] = useState<string>('ao_mua');
  const [feedback, setFeedback] = useState<{
    type: 'idle' | 'success' | 'hint' | 'incorrect';
    message: string;
  }>({
    type: 'idle',
    message: 'Hãy chọn câu trả lời rồi kiểm tra.'
  });

  const [notes, setNotes] = useState<string>('');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Xử lý kiểm tra đáp án
  const handleCheckAnswer = () => {
    if (selectedOption === 'ao_mua') {
      setFeedback({
        type: 'success',
        message:
          'Chính xác! Biết tin chiều nay có mưa giúp em chủ động mang theo áo mưa để không bị ướt. Đây là ví dụ rõ ràng về việc xử lí thông tin để đưa ra quyết định hành động đúng đắn.'
      });
    } else {
      setFeedback({
        type: 'incorrect',
        message: 'Chưa chính xác. Em hãy suy nghĩ xem thông tin về trời mưa sẽ ảnh hưởng trực tiếp đến việc chuẩn bị đồ dùng gì khi ra ngoài nhé!'
      });
    }
  };

  // Xử lý hiển thị gợi ý
  const handleShowHint = () => {
    setFeedback({
      type: 'hint',
      message:
        'Gợi ý: Thông tin về thời tiết giúp con người dự đoán sự thay đổi môi trường và chuẩn bị vật dụng phù hợp trước khi ra khỏi nhà.'
    });
  };

  // Xử lý lưu ghi chú
  const handleSaveNotes = () => {
    if (!notes.trim()) {
      setSaveStatus('Vui lòng viết ghi chú trước khi lưu.');
      setTimeout(() => setSaveStatus(null), 3000);
      return;
    }
    setSaveStatus('✓ Đã lưu ghi chú học tập thành công vào bộ nhớ phiên.');
    setTimeout(() => setSaveStatus(null), 3000);
  };

  return (
    <div className="font-serif bg-slate-50 min-h-screen flex flex-col">
      {/* 1. THÂN CHÍNH: THANH MENU TRÁI + VÙNG BÀI HỌC + CỘT PHẢI */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* CỘT MENU TRÁI HỌC SINH (ẢNH 3) */}
        <aside className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-xs space-y-6">
          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Home className="w-4 h-4 text-slate-500" />
              <span>Góc học tập</span>
            </button>

            <button
              onClick={() => setStudentSection('interactive')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl bg-[#1A56DB] text-white transition flex items-center gap-3 shadow-xs cursor-pointer"
            >
              <Laptop className="w-4 h-4 text-white" />
              <span>Học tương tác</span>
            </button>

            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Ôn tập</span>
            </button>

            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-500" />
              <span>Kiểm tra</span>
            </button>

            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-slate-500" />
              <span>Trò chơi</span>
            </button>

            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <span>Tiến bộ của em</span>
            </button>

            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Bookmark className="w-4 h-4 text-slate-500" />
              <span>Sổ câu sai</span>
            </button>

            <button
              onClick={() => openStudentSpace(false)}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-slate-500" />
              <span>Kế hoạch học</span>
            </button>
          </nav>

          {/* Nút Hỏi giáo viên ghim dưới */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => setUnimplementedFeature('Hỏi giáo viên & Giải đáp thắc mắc')}
              className="w-full py-2.5 px-3 bg-white text-blue-900 border border-blue-200 hover:bg-blue-50 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <MessageCircle className="w-4 h-4 text-[#1A56DB]" />
              <span>Hỏi giáo viên</span>
            </button>
          </div>
        </aside>

        {/* VÙNG NỘI DUNG CHÍNH BÀI HỌC (ẢNH 3 - TRUNG TÂM) */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Tiêu đề bài học và nhãn minh họa */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Thông tin và dữ liệu
              </h1>
              <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2.5 py-1 rounded-md">
                Bài học minh họa
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Tin học 6 • Cánh diều / Kết nối tri thức với cuộc sống
            </p>
          </div>

          {/* Dải tiến trình bài học (Các bước theo Ảnh 3) */}
          <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 text-xs sm:text-sm font-semibold">
            {lessonStages.map((stg) => {
              const isActive = activeStage === stg.id;
              return (
                <button
                  key={stg.id}
                  onClick={() => setActiveStage(stg.id)}
                  className={`px-3.5 sm:px-4 py-2 rounded-lg transition whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {stg.title}
                </button>
              );
            })}
          </div>

          {/* KHUNG HOẠT ĐỘNG TƯƠNG TÁC (CHÍNH THEO ẢNH 3) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Tiêu đề hoạt động */}
            <div className="flex items-center gap-2 text-slate-900 font-bold text-lg sm:text-xl border-b border-slate-100 pb-3">
              <Search className="w-5 h-5 text-[#1A56DB]" />
              <span>Quan sát tình huống</span>
            </div>

            {/* Khung minh họa thời tiết (Đám mây mưa dễ thương + Bảng tin) */}
            <div className="bg-gradient-to-r from-blue-50 via-sky-50 to-blue-100/60 border border-blue-200/80 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-center gap-6 text-center sm:text-left">
              {/* Đồ họa đám mây mưa */}
              <div className="relative flex flex-col items-center">
                <div className="text-5xl select-none animate-bounce" style={{ animationDuration: '3s' }}>
                  🌧️
                </div>
                <div className="text-[11px] font-semibold text-blue-900 mt-1 bg-white/80 px-2 py-0.5 rounded-full border border-blue-200">
                  Dự báo thời tiết
                </div>
              </div>

              {/* Hộp tin thông báo */}
              <div className="bg-white/95 border-2 border-blue-300 rounded-xl px-5 py-3 shadow-xs">
                <span className="font-bold text-base sm:text-lg text-blue-950">
                  Bản tin dự báo: Chiều nay có mưa.
                </span>
              </div>
            </div>

            {/* Câu hỏi tương tác */}
            <div className="space-y-4 pt-2">
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                Em sẽ sử dụng thông tin này như thế nào?
              </h3>

              {/* 3 Lựa chọn (Radio options như Ảnh 3) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  onClick={() => setSelectedOption('ao_mua')}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-center gap-3 ${
                    selectedOption === 'ao_mua'
                      ? 'border-[#1A56DB] bg-blue-50/40 text-blue-950 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedOption === 'ao_mua' ? 'border-[#1A56DB] bg-[#1A56DB]' : 'border-slate-400'
                  }`}>
                    {selectedOption === 'ao_mua' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm sm:text-base">Mang theo áo mưa</span>
                </label>

                <label
                  onClick={() => setSelectedOption('trang_sach')}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-center gap-3 ${
                    selectedOption === 'trang_sach'
                      ? 'border-[#1A56DB] bg-blue-50/40 text-blue-950 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedOption === 'trang_sach' ? 'border-[#1A56DB] bg-[#1A56DB]' : 'border-slate-400'
                  }`}>
                    {selectedOption === 'trang_sach' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm sm:text-base">Ghi lại số trang sách</span>
                </label>

                <label
                  onClick={() => setSelectedOption('hinh_nen')}
                  className={`p-4 rounded-xl border-2 transition cursor-pointer flex items-center gap-3 ${
                    selectedOption === 'hinh_nen'
                      ? 'border-[#1A56DB] bg-blue-50/40 text-blue-950 font-bold shadow-2xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedOption === 'hinh_nen' ? 'border-[#1A56DB] bg-[#1A56DB]' : 'border-slate-400'
                  }`}>
                    {selectedOption === 'hinh_nen' && <div className="w-2 h-2 rounded-full bg-white" />}
                  </div>
                  <span className="text-sm sm:text-base">Đổi hình nền máy tính</span>
                </label>
              </div>

              {/* Nút Kiểm tra câu trả lời & Gợi ý */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleCheckAnswer}
                  className="px-5 py-2.5 bg-[#1A56DB] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>▶ Kiểm tra câu trả lời</span>
                </button>
                <button
                  onClick={handleShowHint}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300 font-semibold text-sm rounded-xl transition flex items-center gap-2 cursor-pointer"
                >
                  <Lightbulb className="w-4 h-4 text-amber-500" />
                  <span>Gợi ý</span>
                </button>
              </div>

              {/* Dòng phản hồi hoặc thông báo gợi ý */}
              <div
                className={`p-3 rounded-xl border text-sm flex items-start gap-2.5 transition-colors ${
                  feedback.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : feedback.type === 'incorrect'
                    ? 'bg-rose-50 border-rose-200 text-rose-900'
                    : feedback.type === 'hint'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-blue-50/60 border-blue-200/80 text-blue-900'
                }`}
              >
                {feedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div className="leading-relaxed">{feedback.message}</div>
              </div>
            </div>
          </div>

          {/* VÙNG GHI NHỚ CỦA EM (ẢNH 3) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                <span>✏️</span>
                <span>Ghi nhớ của em</span>
              </div>
              {saveStatus && (
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {saveStatus}
                </span>
              )}
            </div>

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Em hãy ghi lại những điều quan trọng em rút ra từ hoạt động này..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition"
            />

            <div className="flex justify-end">
              <button
                onClick={handleSaveNotes}
                className="px-4 py-2 bg-[#1A56DB] text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu ghi chú</span>
              </button>
            </div>
          </div>

          {/* THANH ĐIỀU HƯỚNG BƯỚC HỌC: HOẠT ĐỘNG TRƯỚC / TIẾP TỤC */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => {
                setActiveStage('khoi_dong');
              }}
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 hover:bg-slate-100 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Hoạt động trước</span>
            </button>

            <button
              onClick={() => {
                setActiveStage('kien_thuc');
              }}
              className="px-6 py-2.5 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-xl text-sm font-semibold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <span>Tiếp tục</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </main>

        {/* CỘT PHẢI: TRONG BÀI HỌC NÀY / CẦN HỖ TRỢ / TIẾP THEO (ẢNH 3) */}
        <aside className="w-full lg:w-72 space-y-5 shrink-0">
          {/* Hộp 1: Trong bài học này */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <span>📋</span>
              <span>Trong bài học này</span>
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-blue-900 font-bold">
                <div className="w-3 h-3 rounded-full bg-[#1A56DB] ring-4 ring-blue-100 shrink-0" />
                <span>Quan sát tình huống</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer">
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0 ml-0.5" />
                <span>Phân biệt thông tin và dữ liệu</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer">
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0 ml-0.5" />
                <span>Thử sức cùng ví dụ</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 hover:text-slate-900 cursor-pointer">
                <div className="w-2.5 h-2.5 rounded-full border border-slate-300 shrink-0 ml-0.5" />
                <span>Tự kiểm tra</span>
              </div>
            </div>
          </div>

          {/* Hộp 2: Cần hỗ trợ? */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              <span>Cần hỗ trợ?</span>
            </h3>
            <button
              onClick={() => setUnimplementedFeature('Gửi câu hỏi cho giáo viên bộ môn')}
              className="w-full py-2.5 px-3 bg-white hover:bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-[#1A56DB]" />
              <span>Gửi câu hỏi</span>
            </button>
          </div>

          {/* Hộp 3: Tiếp theo */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-1.5">
              <span>⏩</span>
              <span>Tiếp theo</span>
            </h3>
            <button
              onClick={() => openStudentSpace(false)}
              className="w-full py-2.5 px-3 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>Ôn tập nội dung bài</span>
            </button>
          </div>

          {/* Watermark ở góc dưới cột phải theo Ảnh 3 */}
          <div className="text-right text-xs text-slate-400 italic">
            Bản thiết kế đề xuất • Nội dung minh họa
          </div>
        </aside>
      </div>
    </div>
  );
};
