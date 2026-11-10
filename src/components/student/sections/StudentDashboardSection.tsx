/**
 * Section 1: Góc học tập (Student Dashboard)
 * Bố cục:
 * 1. Lời chào theo tên hiển thị của học sinh
 * 2. Bộ chọn khối lớp (6-9)
 * 3. Thẻ "Tiếp tục học" & Thẻ "Việc cần làm"
 * 4. Bốn nút hành động lớn: Học bài mới / Ôn tập / Làm bài kiểm tra / Chơi để học
 * 5. Danh sách môn học của khối
 * 6. Hoạt động gần đây & Gợi ý học tiếp
 */

import React, { useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { studentDataService } from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Play,
  CheckCircle2,
  Calendar,
  Layers,
  ClipboardList,
  Gamepad2,
  BookOpen,
  ChevronRight,
  Clock,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const StudentDashboardSection: React.FC = () => {
  const {
    selectedGrade,
    setSelectedGrade,
    setSelectedSubjectCode,
    setStudentSection,
    openLessonPlayer
  } = useNavigation();

  const { displayName, userId } = useAuth();

  // Dữ liệu từ studentDataService
  const activities = useMemo(() => {
    return studentDataService.getActivities(userId);
  }, [userId]);

  const plans = useMemo(() => {
    return studentDataService.getPlans(userId);
  }, [userId]);

  // Việc cần làm hôm nay hoặc chưa hoàn thành
  const pendingPlans = useMemo(() => {
    return plans.filter(p => !p.completed);
  }, [plans]);

  // Bài tập được giáo viên giao
  const teacherAssignedPlans = useMemo(() => {
    return pendingPlans.filter(p => p.isTeacherAssigned);
  }, [pendingPlans]);

  return (
    <div className="space-y-6">
      {/* 1. LỜI CHÀO & CHỌN KHỐI LỚP */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#1A56DB] uppercase mb-1">
            Góc học tập cá nhân · Cấp THCS
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Chào mừng em, {displayName || 'Học sinh Smart EDU'}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Hôm nay em muốn tiếp tục học bài tương tác hay luyện tập ôn bài nào?
          </p>
        </div>

        {/* Bộ nút chọn khối 6-9 */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
          <span className="text-xs font-semibold text-slate-500 pl-2">Khối:</span>
          {[6, 7, 8, 9].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGrade(g as 6 | 7 | 8 | 9)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                selectedGrade === g
                  ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                  : 'text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lớp {g}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THẺ TIẾP TỤC HỌC VÀ VIỆC CẦN LÀM (2 CỘT) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Thẻ Tiếp tục học */}
        <div className="bg-gradient-to-br from-blue-50/80 via-sky-50/50 to-white border border-blue-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 uppercase flex items-center gap-1.5">
                <Play className="w-3.5 h-3.5 text-[#1A56DB]" />
                <span>Tiếp tục học bài gần nhất</span>
              </span>
              <span className="text-[11px] font-semibold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                Lớp {selectedGrade === 'ALL' ? 6 : selectedGrade}
              </span>
            </div>

            <div className="font-bold text-lg text-slate-900">
              Tin học {selectedGrade === 'ALL' ? 6 : selectedGrade} • Bài 1: Thông tin và dữ liệu
            </div>
            <p className="text-xs text-slate-600">
              Hoạt động gần nhất: Quan sát tình huống thời tiết và phân biệt thông tin/dữ liệu.
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                setSelectedSubjectCode('tin_hoc');
                setStudentSection('interactive');
              }}
              className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Học tiếp</span>
            </button>
            <span className="text-[11px] text-slate-500 italic">Tiết kiệm thời gian ôn bài</span>
          </div>
        </div>

        {/* Thẻ Việc cần làm */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 uppercase flex items-center gap-1.5">
              <ClipboardList className="w-4 h-4 text-amber-600" />
              <span>Việc cần làm</span>
            </span>
            <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              {pendingPlans.length} nhiệm vụ
            </span>
          </div>

          <div className="space-y-2 text-xs">
            {teacherAssignedPlans.length > 0 ? (
              teacherAssignedPlans.slice(0, 2).map((p) => (
                <div key={p.id} className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-bold text-amber-950 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span>{p.title}</span>
                    </div>
                    <div className="text-[11px] text-amber-800">{p.teacherName || 'Giáo viên bộ môn giao'} · Hạn: {p.dueDate}</div>
                  </div>
                  <button
                    onClick={() => setStudentSection('interactive')}
                    className="px-2 py-1 bg-amber-600 text-white rounded text-[11px] font-bold hover:bg-amber-700 shrink-0 cursor-pointer"
                  >
                    Làm ngay
                  </button>
                </div>
              ))
            ) : (
              <div className="p-3 bg-slate-50 rounded-xl text-slate-500 text-center italic">
                Em chưa có nhiệm vụ được giao mới từ giáo viên.
              </div>
            )}
          </div>

          <div className="pt-1 flex items-center justify-between border-t border-slate-100 text-xs">
            <span className="text-slate-500">Kế hoạch cá nhân hôm nay</span>
            <button
              onClick={() => setStudentSection('plan')}
              className="text-[#1A56DB] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Xem tất cả kế hoạch</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. BỐN NÚT HÀNH ĐỘNG CHÍNH */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <button
          onClick={() => setStudentSection('interactive')}
          className="p-4 bg-white border border-blue-200 hover:border-blue-400 hover:bg-blue-50/40 rounded-2xl transition shadow-2xs text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Play className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900 group-hover:text-blue-900">Học bài mới</div>
          <div className="text-xs text-slate-500 mt-0.5">Khám phá bài học tương tác đa phương tiện</div>
        </button>

        <button
          onClick={() => setStudentSection('review')}
          className="p-4 bg-white border border-sky-200 hover:border-sky-400 hover:bg-sky-50/40 rounded-2xl transition shadow-2xs text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900 group-hover:text-sky-900">Ôn tập</div>
          <div className="text-xs text-slate-500 mt-0.5">Củng cố kiến thức theo chương và học kỳ</div>
        </button>

        <button
          onClick={() => setStudentSection('assessment')}
          className="p-4 bg-white border border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50/40 rounded-2xl transition shadow-2xs text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <ClipboardList className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900 group-hover:text-indigo-900">Làm kiểm tra</div>
          <div className="text-xs text-slate-500 mt-0.5">Thi thử tự luyện & bài kiểm tra được giao</div>
        </button>

        <button
          onClick={() => setStudentSection('game')}
          className="p-4 bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50/40 rounded-2xl transition shadow-2xs text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <div className="font-bold text-sm text-slate-900 group-hover:text-purple-900">Chơi để học</div>
          <div className="text-xs text-slate-500 mt-0.5">Vừa chơi vừa nhớ qua trò chơi học tập</div>
        </button>
      </div>

      {/* 4. DANH SÁCH MÔN HỌC THCS (KHỐI ĐANG CHỌN) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#1A56DB]" />
            <h2 className="font-bold text-base text-slate-900">
              Các môn học THCS · Khối {selectedGrade === 'ALL' ? 6 : selectedGrade}
            </h2>
          </div>
          <span className="text-xs text-slate-500">Bộ sách Kết nối tri thức với cuộc sống</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {THCS_SUBJECTS.map((s) => (
            <button
              key={s.code}
              onClick={() => {
                setSelectedSubjectCode(s.code);
                setStudentSection('interactive');
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 transition text-left group cursor-pointer"
            >
              <div className="text-xs font-bold text-slate-800 group-hover:text-blue-900 truncate">
                {s.name}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center justify-between">
                <span>Lớp {selectedGrade === 'ALL' ? 6 : selectedGrade}</span>
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform text-slate-300 group-hover:text-blue-600" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 5. HOẠT ĐỘNG GẦN ĐÂY & GỢI Ý HỌC TIẾP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hoạt động gần đây (8 cột) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Hoạt động học tập gần đây</span>
            </span>
            <span className="text-xs text-slate-400">Dữ liệu lưu trên thiết bị</span>
          </div>

          {activities.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {activities.slice(0, 5).map((act) => (
                <div key={act.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <div className="font-bold text-slate-800 truncate">{act.title}</div>
                    <div className="text-slate-500 text-[11px]">
                      {new Date(act.timestamp).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {act.details && ` · ${act.details}`}
                    </div>
                  </div>
                  {act.score !== undefined && (
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded shrink-0">
                      {act.score}/{act.maxScore || 10} đ
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs space-y-1">
              <div>Em hãy chọn một môn để bắt đầu học bài hoặc luyện tập.</div>
              <div className="text-slate-400 text-[11px]">Lịch sử làm bài và tiến bộ sẽ tự động được ghi lại tại đây.</div>
            </div>
          )}
        </div>

        {/* Gợi ý học tiếp (4 cột) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-indigo-50/50 to-white border border-indigo-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Gợi ý học tiếp</span>
          </div>

          <div className="p-3 bg-white border border-indigo-100 rounded-xl space-y-2 text-xs">
            <div className="font-bold text-indigo-950">
              Bài 1: Thông tin và dữ liệu (Tin học 6)
            </div>
            <p className="text-slate-600 text-[11px]">
              Bài học tương tác có đầy đủ hình ảnh, tình huống thời tiết và câu hỏi luyện tập trực tiếp.
            </p>
            <button
              onClick={() => {
                setSelectedSubjectCode('tin_hoc');
                setStudentSection('interactive');
              }}
              className="w-full py-1.5 bg-[#1A56DB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <span>Vào học ngay</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
