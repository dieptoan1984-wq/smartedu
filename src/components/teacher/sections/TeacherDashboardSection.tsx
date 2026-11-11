/**
 * Smart EDU THCS - Giáo viên: Mục 1. Bàn làm việc (Teacher Dashboard Section)
 * Tuân thủ Ảnh 2 tham chiếu:
 * - Tiêu đề: "Thầy cô muốn chuẩn bị gì hôm nay?"
 * - 4 Thẻ lớn: Soạn bài tương tác, Ngân hàng câu hỏi, Bộ hồ sơ kiểm tra, Trò chơi học tập
 * - Lớp học của tôi (+ Tạo lớp, Xem danh sách, Vào lớp, Giao bài)
 * - Học liệu đang chuẩn bị (bảng theo dõi trạng thái Bản nháp / Chờ duyệt / Đã duyệt)
 * - Bộ hồ sơ kiểm tra (Quy trình 5 bước: Ma trận, Bản đặc tả, Đề kiểm tra, Đáp án, Hướng dẫn chấm)
 * - Cần xử lí (Bài nộp chờ chấm)
 * - Công cụ trong lớp: Gọi tên ngẫu nhiên, Chia nhóm, Đồng hồ bấm giờ, Phiếu cuối tiết
 */

import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import {
  teacherDataService,
  TeacherClassItem,
  TeacherLessonDraft,
  StudentSubmissionItem
} from '../../../services/teacherDataService';
import {
  Layers,
  HelpCircle,
  ClipboardList,
  Gamepad2,
  Users,
  Plus,
  Play,
  Edit3,
  Eye,
  Clock,
  Shuffle,
  FileCheck,
  ChevronRight,
  FolderOpen,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const TeacherDashboardSection: React.FC = () => {
  const { setTeacherSection, openLessonPlayer } = useNavigation();
  const { displayName } = useAuth();

  const classes = teacherDataService.getClasses();
  const lessons = teacherDataService.getLessons();
  const submissions = teacherDataService.getSubmissions();

  const pendingGradingCount = submissions.filter(s => s.status === 'submitted').length;
  const pendingLessonsCount = lessons.filter(l => l.status === 'pending').length;

  // Công cụ tiện ích lớp học nhanh (Interactive Modals)
  const [activeTool, setActiveTool] = useState<'picker' | 'groups' | 'timer' | null>(null);
  const [pickedStudent, setPickedStudent] = useState<string | null>(null);
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [timerRunning, setTimerRunning] = useState(false);

  const sampleStudentList = [
    'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Dũng',
    'Vũ Hải Đăng', 'Đỗ Thảo Linh', 'Ngô Quốc Bảo', 'Hoàng Mai Chi',
    'Bùi Tiến Đạt', 'Dương Thúy Hằng'
  ];

  const handlePickRandomStudent = () => {
    const randomIdx = Math.floor(Math.random() * sampleStudentList.length);
    setPickedStudent(sampleStudentList[randomIdx]);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* 1. KHỐI TIÊU ĐỀ LỚN (ẢNH 2) */}
      <div className="bg-gradient-to-r from-blue-100/90 via-sky-50 to-white border border-blue-200/90 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase bg-white/80 px-2.5 py-0.5 rounded-full border border-blue-200">
            Không gian làm việc giáo viên THCS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
            Thầy cô muốn chuẩn bị gì hôm nay?
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tạo học liệu, biên soạn câu hỏi, giao nhiệm vụ và theo dõi kết quả học sinh trong cùng một không gian.
          </p>
        </div>

        {/* Thống kê nhanh công việc cần xử lí */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-blue-200 rounded-xl p-3 shadow-2xs text-center min-w-[110px]">
            <div className="text-xl font-bold text-blue-900">{classes.length}</div>
            <div className="text-[11px] text-slate-500 font-semibold">Lớp phụ trách</div>
          </div>
          <div className="bg-white border border-amber-200 rounded-xl p-3 shadow-2xs text-center min-w-[110px]">
            <div className="text-xl font-bold text-amber-700">{pendingGradingCount}</div>
            <div className="text-[11px] text-slate-500 font-semibold">Bài chờ chấm</div>
          </div>
        </div>
      </div>

      {/* 2. BỐN THẺ HÀNH ĐỘNG LỚN (ẢNH 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Thẻ 1: Soạn bài tương tác */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Soạn bài tương tác</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Thiết kế bài học sinh động với nội dung, câu hỏi và tương tác chạm kéo thả.
            </p>
          </div>
          <button
            onClick={() => setTeacherSection('authoring')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Tạo bài mới</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thẻ 2: Ngân hàng câu hỏi */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Ngân hàng câu hỏi</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Xây dựng và quản lí câu hỏi theo môn học, 4 dạng bài và ma trận kiến thức.
            </p>
          </div>
          <button
            onClick={() => setTeacherSection('questions')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Thêm câu hỏi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thẻ 3: Bộ hồ sơ kiểm tra */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
              <ClipboardList className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Bộ hồ sơ kiểm tra</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tạo đầy đủ ma trận, bản đặc tả, đề kiểm tra, đáp án và hướng dẫn chấm.
            </p>
          </div>
          <button
            onClick={() => setTeacherSection('test_dossier')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Tạo bộ hồ sơ</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Thẻ 4: Trò chơi học tập */}
        <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Trò chơi học tập</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Sử dụng các mẫu trò chơi tương tác để luyện tập, củng cố bài học.
            </p>
          </div>
          <button
            onClick={() => setTeacherSection('games')}
            className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
          >
            <span>Chọn mẫu trò chơi</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. KHU VỰC 2 CỘT CHÍNH (ẢNH 2) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (Khoảng 65% - 8 cột): Lớp học của tôi & Học liệu đang chuẩn bị */}
        <div className="lg:col-span-8 space-y-6">
          {/* Vùng: Lớp học của tôi */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                <Users className="w-5 h-5 text-[#1A56DB]" />
                <span>Lớp học của tôi</span>
              </div>
              <button
                onClick={() => setTeacherSection('classes')}
                className="px-3.5 py-1.5 bg-blue-50 text-[#1A56DB] hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tạo lớp</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              {classes.map(cls => (
                <div
                  key={cls.id}
                  className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 hover:border-blue-400 transition space-y-3 shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-base">{cls.name}</span>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {cls.studentCount} HS
                    </span>
                  </div>

                  <div className="text-xs text-slate-600">
                    Năm học: <span className="font-semibold text-slate-800">{cls.schoolYear}</span>
                  </div>

                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setTeacherSection('classes')}
                      className="px-2.5 py-1 text-xs font-bold text-blue-900 hover:underline"
                    >
                      Danh sách HS
                    </button>
                    <button
                      onClick={() => setTeacherSection('assignments')}
                      className="px-3 py-1 bg-[#1A56DB] text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                    >
                      Giao bài
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vùng: Học liệu đang chuẩn bị (Bảng trạng thái thực) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <span>📖</span>
                <span>Học liệu đang chuẩn bị</span>
              </h2>
              <button
                onClick={() => setTeacherSection('authoring')}
                className="text-xs font-bold text-[#1A56DB] hover:underline"
              >
                Xem tất cả ({lessons.length}) →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                    <th className="py-2.5 px-3 font-bold">Tên học liệu</th>
                    <th className="py-2.5 px-3 font-bold">Môn / Khối</th>
                    <th className="py-2.5 px-3 font-bold">Trạng thái</th>
                    <th className="py-2.5 px-3 font-bold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lessons.slice(0, 5).map(ls => (
                    <tr key={ls.id} className="hover:bg-slate-50/70 transition">
                      <td className="py-3 px-3 font-semibold text-slate-900">
                        {ls.title}
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {ls.subjectCode.toUpperCase()} • Lớp {ls.grade}
                      </td>
                      <td className="py-3 px-3">
                        {ls.status === 'approved' ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            ● Đã duyệt
                          </span>
                        ) : ls.status === 'pending' ? (
                          <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                            ● Chờ duyệt
                          </span>
                        ) : ls.status === 'changes_requested' ? (
                          <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                            ▲ Cần chỉnh sửa
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            ● Bản nháp
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setTeacherSection('authoring')}
                          className="px-2.5 py-1 bg-blue-50 text-blue-900 hover:bg-blue-100 rounded-lg font-bold text-xs"
                        >
                          Mở soạn
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (Khoảng 35% - 4 cột): Bộ hồ sơ kiểm tra 5 bước & Bài nộp chờ chấm */}
        <div className="lg:col-span-4 space-y-6">
          {/* Vùng: Bộ hồ sơ kiểm tra 5 bước */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-[#1A56DB]" />
                <span>Bộ hồ sơ kiểm tra</span>
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Quy trình chuẩn hóa 5 bước theo Thông tư Bộ GD&ĐT:
              </p>
            </div>

            <div className="space-y-1.5 text-xs font-semibold">
              {[
                { step: 1, label: 'Ma trận đề kiểm tra', icon: '1' },
                { step: 2, label: 'Bản đặc tả câu hỏi', icon: '2' },
                { step: 3, label: 'Đề kiểm tra trắc nghiệm & tự luận', icon: '3' },
                { step: 4, label: 'Đáp án chuẩn', icon: '4' },
                { step: 5, label: 'Hướng dẫn chấm & Rubric', icon: '5' }
              ].map(s => (
                <div
                  key={s.step}
                  onClick={() => setTeacherSection('test_dossier')}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl flex items-center justify-between cursor-pointer transition"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-[#1A56DB] font-bold text-[11px] flex items-center justify-center">
                      {s.icon}
                    </span>
                    <span className="text-slate-800">{s.label}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>

            <button
              onClick={() => setTeacherSection('test_dossier')}
              className="w-full py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bắt đầu tạo hồ sơ mới</span>
            </button>
          </div>

          {/* Vùng: Cần xử lí (Bài nộp chờ chấm) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Cần xử lí</span>
              </h3>
              <span className="text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                {pendingGradingCount} bài chờ chấm
              </span>
            </div>

            {pendingGradingCount === 0 ? (
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-center text-xs text-slate-500">
                Chưa có bài nộp nào cần chấm trong phiên này.
              </div>
            ) : (
              <div className="space-y-2">
                {submissions.filter(s => s.status === 'submitted').map(sub => (
                  <div
                    key={sub.id}
                    className="p-3 bg-amber-50/40 border border-amber-200 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">{sub.studentName}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[170px]">{sub.assignmentTitle}</div>
                    </div>
                    <button
                      onClick={() => setTeacherSection('grading')}
                      className="px-2.5 py-1 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition cursor-pointer"
                    >
                      Chấm ngay
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. THANH CÔNG CỤ TRONG LỚP HỌC (ẢNH 2) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
          <span>🛠️</span>
          <span>Công cụ trong lớp:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => {
              setActiveTool('picker');
              handlePickRandomStudent();
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 text-[#1A56DB]" />
            <span>Gọi tên ngẫu nhiên</span>
          </button>

          <button
            onClick={() => setActiveTool('groups')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>Chia nhóm học tập</span>
          </button>

          <button
            onClick={() => setActiveTool('timer')}
            className="px-3.5 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-200 rounded-xl font-semibold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-purple-600" />
            <span>Đồng hồ bấm giờ</span>
          </button>
        </div>
      </div>

      {/* MODAL CÔNG CỤ NHANH */}
      {activeTool === 'picker' && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl text-center">
            <h3 className="font-bold text-lg text-slate-900">Gọi tên học sinh ngẫu nhiên</h3>
            <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="text-2xl font-bold text-blue-900">{pickedStudent}</span>
            </div>
            <div className="flex justify-center gap-3">
              <button
                onClick={handlePickRandomStudent}
                className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
              >
                Gọi bạn khác
              </button>
              <button
                onClick={() => setActiveTool(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
