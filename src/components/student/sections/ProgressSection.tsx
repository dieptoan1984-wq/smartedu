/**
 * Section 6: Tiến bộ của em (Student Progress & Analytics)
 * Bố cục:
 * 1. Bộ lọc: Môn học, Khoảng thời gian (7 ngày, 30 ngày, Học kỳ), Loại hoạt động
 * 2. 4 Thẻ chỉ số minh bạch: Bài học đã mở, Lượt ôn tập, Bài kiểm tra, Điểm trung bình (ghi rõ công thức)
 * 3. Tách biệt rõ ràng giữa điểm Ôn tập, Kiểm tra và Trò chơi
 * 4. Bảng lịch sử hoạt động thực tế từ dữ liệu thiết bị và máy chủ
 * 5. Gợi ý nội dung cần luyện tiếp dựa trên kết quả thực
 */

import React, { useState, useMemo } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { studentDataService } from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Layers,
  ClipboardList,
  Gamepad2,
  Sparkles,
  Info,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export const ProgressSection: React.FC = () => {
  const { selectedSubjectCode, setSelectedSubjectCode, setStudentSection } = useNavigation();
  const { userId } = useAuth();

  const [timeFilter, setTimeFilter] = useState<'7days' | '30days' | 'term'>('7days');
  const [activityTypeFilter, setActivityTypeFilter] = useState<'ALL' | 'lesson' | 'review' | 'assessment' | 'game'>('ALL');

  // Lấy dữ liệu thực tế
  const rawActivities = useMemo(() => {
    return studentDataService.getActivities(userId);
  }, [userId]);

  const mistakes = useMemo(() => {
    return studentDataService.getMistakes(userId);
  }, [userId]);

  // Lọc hoạt động theo bộ lọc
  const filteredActivities = useMemo(() => {
    return rawActivities.filter(a => {
      const matchSubj = selectedSubjectCode === 'ALL' || a.subjectCode === selectedSubjectCode;
      const matchType = activityTypeFilter === 'ALL' || a.type === activityTypeFilter;
      return matchSubj && matchType;
    });
  }, [rawActivities, selectedSubjectCode, activityTypeFilter]);

  // Thống kê chỉ số thực tế
  const stats = useMemo(() => {
    const lessonActs = rawActivities.filter(a => a.type === 'lesson');
    const reviewActs = rawActivities.filter(a => a.type === 'review');
    const examActs = rawActivities.filter(a => a.type === 'assessment');

    const reviewScores = reviewActs.filter(a => a.score !== undefined).map(a => a.score!);
    const examScores = examActs.filter(a => a.score !== undefined).map(a => a.score!);

    const avgReview = reviewScores.length > 0
      ? (reviewScores.reduce((sum, s) => sum + s, 0) / reviewScores.length).toFixed(1)
      : null;

    const avgExam = examScores.length > 0
      ? (examScores.reduce((sum, s) => sum + s, 0) / examScores.length).toFixed(1)
      : null;

    return {
      totalLessonsStarted: lessonActs.length,
      totalReviews: reviewActs.length,
      totalExams: examActs.length,
      avgReview,
      avgExam
    };
  }, [rawActivities]);

  return (
    <div className="space-y-6">
      {/* 1. THANH TIÊU ĐỀ & BỘ LỌC THỐNG KÊ */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#1A56DB]" />
              <span>Theo dõi tiến bộ học tập cá nhân</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Số liệu thống kê được tính toán trực tiếp từ các bài học, lượt ôn tập và bài thi em đã thực hiện.
            </p>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTimeFilter('7days')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeFilter === '7days' ? 'bg-[#1A56DB] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7 ngày qua
            </button>
            <button
              onClick={() => setTimeFilter('30days')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeFilter === '30days' ? 'bg-[#1A56DB] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              30 ngày qua
            </button>
            <button
              onClick={() => setTimeFilter('term')}
              className={`px-3 py-1.5 rounded-lg transition cursor-pointer ${
                timeFilter === 'term' ? 'bg-[#1A56DB] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Học kỳ này
            </button>
          </div>
        </div>

        {/* Bộ lọc Môn và Loại hoạt động */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Môn học:</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => setSelectedSubjectCode(e.target.value)}
              aria-label="Lọc tiến độ theo môn học"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ALL">Tất cả các môn THCS</option>
              {THCS_SUBJECTS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Loại hoạt động:</label>
            <select
              value={activityTypeFilter}
              onChange={(e) => setActivityTypeFilter(e.target.value as any)}
              aria-label="Lọc theo loại hoạt động học tập"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ALL">Tất cả hoạt động</option>
              <option value="lesson">Bài học tương tác</option>
              <option value="review">Lượt ôn tập</option>
              <option value="assessment">Bài kiểm tra</option>
              <option value="game">Trò chơi học tập</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. BỐN THẺ CHỈ SỐ THỰC TẾ (CÔNG THỨC MINH BẠCH) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span>Bài học đã mở</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalLessonsStarted}</div>
          <div className="text-[11px] text-slate-400">Ghi nhận từ lượt mở bài</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span>Lượt ôn tập</span>
            <Layers className="w-4 h-4 text-sky-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalReviews}</div>
          <div className="text-[11px] text-slate-400">ĐTB ôn: {stats.avgReview ? `${stats.avgReview}/10` : 'Chưa có'}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span>Bài kiểm tra</span>
            <ClipboardList className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.totalExams}</div>
          <div className="text-[11px] text-slate-400">ĐTB thi: {stats.avgExam ? `${stats.avgExam}/10` : 'Chưa có'}</div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span>Câu sai cần ôn</span>
            <span className="w-2 h-2 rounded-full bg-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-900">{mistakes.length}</div>
          <div className="text-[11px] text-slate-400">Lưu trong Sổ câu sai</div>
        </div>
      </div>

      {/* 3. LỊCH SỬ HOẠT ĐỘNG THỰC TẾ & GỢI Ý HỌC TIẾP */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Bảng chi tiết hoạt động (8 cột) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Chi tiết lịch sử học tập ({filteredActivities.length})</span>
            </span>
            <span className="text-xs text-slate-400">Nguồn: Dữ liệu thiết bị</span>
          </div>

          {filteredActivities.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {filteredActivities.map((act) => (
                <div key={act.id} className="py-3 flex items-start justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-800 text-sm">{act.title}</div>
                    <div className="text-slate-500 text-[11px]">
                      {new Date(act.timestamp).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                      {act.details && ` · ${act.details}`}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {act.score !== undefined ? (
                      <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                        {act.score}/{act.maxScore || 10} đ
                      </span>
                    ) : (
                      <span className="text-[11px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        Đã mở xem
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <div>Chưa có dữ liệu hoạt động trong khoảng thời gian này.</div>
              <div className="text-slate-400 text-[11px]">
                Cần thêm hoạt động làm bài hoặc ôn tập để hệ thống tổng hợp báo cáo tiến bộ.
              </div>
            </div>
          )}
        </div>

        {/* Cột gợi ý học tiếp dựa trên dữ liệu (4 cột) */}
        <div className="lg:col-span-4 bg-gradient-to-br from-blue-50/50 via-sky-50/40 to-white border border-blue-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#1A56DB]" />
            <span>Kế hoạch rèn luyện tiếp theo</span>
          </div>

          <div className="space-y-3 text-xs">
            {mistakes.length > 0 ? (
              <div className="p-3 bg-white border border-amber-200 rounded-xl space-y-2">
                <span className="font-bold text-amber-900 block">Ôn lại các câu sai</span>
                <p className="text-slate-600 text-[11px]">
                  Em đang có {mistakes.length} câu hỏi cần củng cố lại trong Sổ câu sai.
                </p>
                <button
                  onClick={() => setStudentSection('mistakes')}
                  className="w-full py-1.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Mở sổ câu sai</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="p-3 bg-white border border-blue-200 rounded-xl space-y-2">
                <span className="font-bold text-blue-900 block">Luyện tập chủ đề mới</span>
                <p className="text-slate-600 text-[11px]">
                  Hoàn thành thêm các bài học tương tác để tích lũy kiến thức trọng tâm.
                </p>
                <button
                  onClick={() => setStudentSection('interactive')}
                  className="w-full py-1.5 bg-[#1A56DB] text-white rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>Vào học tương tác</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
