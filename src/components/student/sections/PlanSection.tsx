/**
 * Smart EDU THCS - Mục 8: Kế hoạch học tập (Section 8)
 * Quản lí kế hoạch học tập cá nhân và nhiệm vụ được giáo viên giao.
 * 2 chế độ hiển thị: Danh sách & Lịch tuần.
 * Phân định nguồn: "Giáo viên giao" vs "Lưu trên thiết bị này".
 * Times New Roman 18px base, xanh công nghệ, tương thích điện thoại và máy tính.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import {
  studentDataService,
  StudyPlanItem
} from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Calendar as CalendarIcon,
  ListFilter,
  Plus,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  ChevronRight,
  Trash2,
  ExternalLink,
  BookOpen,
  Laptop,
  ClipboardList,
  Sparkles
} from 'lucide-react';

export const PlanSection: React.FC = () => {
  const { userId, displayName } = useAuth();
  const { openLessonPlayer, setStudentSection, setSelectedSubjectCode } = useNavigation();

  const [plans, setPlans] = useState<StudyPlanItem[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'pending' | 'completed'>('ALL');
  const [isAdding, setIsAdding] = useState(false);

  // Form thêm nhiệm vụ mới
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('tin_hoc');
  const [newType, setNewType] = useState<'lesson' | 'review' | 'assessment' | 'other'>('lesson');
  const [newDueDate, setNewDueDate] = useState(new Date().toISOString().split('T')[0]);
  const [newMinutes, setNewMinutes] = useState(30);
  const [newNotes, setNewNotes] = useState('');

  const loadPlans = () => {
    const list = studentDataService.getPlans(userId);
    setPlans(list);
  };

  useEffect(() => {
    loadPlans();
  }, [userId]);

  const handleToggleComplete = (id: string, currentCompleted: boolean) => {
    studentDataService.updatePlan(userId, id, {
      completed: !currentCompleted,
      completedAt: !currentCompleted ? new Date().toISOString() : undefined
    });
    loadPlans();
  };

  const handleDeletePlan = (id: string, isTeacherAssigned: boolean) => {
    if (isTeacherAssigned) {
      alert('Nhiệm vụ do thầy cô giao không thể xóa bởi học sinh.');
      return;
    }
    if (window.confirm('Em có chắc chắn muốn xóa nhiệm vụ tự đặt này không?')) {
      studentDataService.deletePlan(userId, id);
      loadPlans();
    }
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      alert('Vui lòng nhập tên công việc cần học.');
      return;
    }

    studentDataService.addPlan(userId, {
      title: newTitle.trim(),
      subjectCode: newSubject,
      grade: 6,
      type: newType,
      dueDate: newDueDate,
      estimatedMinutes: Number(newMinutes) || 30,
      isTeacherAssigned: false,
      notes: newNotes.trim() || undefined
    });

    setNewTitle('');
    setNewNotes('');
    setIsAdding(false);
    loadPlans();
  };

  // Tính toán thời gian phân nhóm
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredPlans = plans.filter(p => {
    if (filterSubject !== 'ALL' && p.subjectCode !== filterSubject) return false;
    if (filterStatus === 'pending' && p.completed) return false;
    if (filterStatus === 'completed' && !p.completed) return false;
    return true;
  });

  const overdueList = filteredPlans.filter(p => !p.completed && p.dueDate < todayStr);
  const todayList = filteredPlans.filter(p => !p.completed && p.dueDate === todayStr);
  const upcomingList = filteredPlans.filter(p => !p.completed && p.dueDate > todayStr);
  const completedList = filteredPlans.filter(p => p.completed);

  // Điều hướng liên kết nhanh đến đúng nội dung học
  const handleOpenRelatedContent = (item: StudyPlanItem) => {
    setSelectedSubjectCode(item.subjectCode);
    if (item.type === 'lesson') {
      openLessonPlayer();
    } else if (item.type === 'review') {
      setStudentSection('review');
    } else if (item.type === 'assessment') {
      setStudentSection('assessment');
    } else {
      openLessonPlayer();
    }
  };

  const getSubjectName = (code: string) => {
    const s = THCS_SUBJECTS.find(sub => sub.code === code);
    return s ? s.name : code;
  };

  // Tính lịch tuần cho calendar view (7 ngày bắt đầu từ Thứ 2 của tuần hiện tại)
  const getWeekDates = () => {
    const now = new Date();
    const currentDay = now.getDay();
    const diff = now.getDate() - currentDay + (currentDay === 0 ? -6 : 1); // Thứ 2
    const monday = new Date(now.setDate(diff));

    const week = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      week.push(d.toISOString().split('T')[0]);
    }
    return week;
  };

  const weekDates = getWeekDates();
  const dayNames = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & nút thêm */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 8 · Kế hoạch học tập THCS
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Kế hoạch học tập của em
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Sắp xếp thời gian học bài tương tác, lịch ôn tập và nhiệm vụ bài tập được giáo viên giao.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Chuyển chế độ xem */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5" />
              <span>Danh sách</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>Lịch biểu tuần</span>
            </button>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-4 py-2 bg-[#1A56DB] text-white font-semibold text-xs sm:text-sm rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm việc cần học</span>
          </button>
        </div>
      </div>

      {/* Form thêm việc mới */}
      {isAdding && (
        <form
          onSubmit={handleCreatePlan}
          className="bg-blue-50/60 border border-blue-200 rounded-2xl p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-200">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1A56DB]" />
              <span>Thêm mục tiêu / Kế hoạch học tập mới</span>
            </h3>
            <span className="text-[11px] font-semibold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
              Lưu trên thiết bị này
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tên công việc / Mục tiêu học: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Ôn tập 10 câu trắc nghiệm Tin học 6, Đọc lại bài 1..."
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Môn học:
              </label>
              <select
                value={newSubject}
                onChange={e => setNewSubject(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              >
                {THCS_SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Loại hoạt động:
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as any)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              >
                <option value="lesson">Học bài tương tác</option>
                <option value="review">Ôn tập / Luyện câu hỏi</option>
                <option value="assessment">Làm bài kiểm tra</option>
                <option value="other">Hoạt động tự học khác</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Hạn hoàn thành:
              </label>
              <input
                type="date"
                required
                value={newDueDate}
                onChange={e => setNewDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Thời lượng dự kiến (phút):
              </label>
              <input
                type="number"
                min={5}
                max={180}
                value={newMinutes}
                onChange={e => setNewMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Ghi chú thêm:
              </label>
              <input
                type="text"
                placeholder="Ghi chú thêm về nội dung cần chú ý..."
                value={newNotes}
                onChange={e => setNewNotes(e.target.value)}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              Lưu vào kế hoạch
            </button>
          </div>
        </form>
      )}

      {/* Thanh lọc môn & trạng thái */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 uppercase">Môn học:</span>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800"
            >
              <option value="ALL">Tất cả môn</option>
              {THCS_SUBJECTS.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold text-slate-700 uppercase">Trạng thái:</span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setFilterStatus('ALL')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterStatus === 'ALL' ? 'bg-[#1A56DB] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Tất cả ({plans.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterStatus === 'pending' ? 'bg-[#1A56DB] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Chưa làm ({plans.filter(p => !p.completed).length})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                  filterStatus === 'completed' ? 'bg-[#1A56DB] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Đã xong ({plans.filter(p => p.completed).length})
              </button>
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Tổng cộng: <strong>{filteredPlans.length}</strong> nhiệm vụ
        </div>
      </div>

      {/* CHẾ ĐỘ 1: XEM DANH SÁCH THEO NHÓM THỜI GIAN */}
      {viewMode === 'list' && (
        <div className="space-y-6">
          {/* Nhóm 1: Quá hạn */}
          {overdueList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-rose-700 font-bold text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Quá hạn cần hoàn thành ({overdueList.length})</span>
              </div>
              <div className="space-y-3">
                {overdueList.map(plan => (
                  <TaskCard
                    key={plan.id}
                    plan={plan}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeletePlan}
                    onOpenRelated={handleOpenRelatedContent}
                    getSubjectName={getSubjectName}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nhóm 2: Hôm nay */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Nhiệm vụ hôm nay ({todayList.length})</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {new Date().toLocaleDateString('vi-VN')}
              </span>
            </div>

            {todayList.length === 0 ? (
              <div className="p-5 bg-white border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                Hôm nay em không có nhiệm vụ nào còn tồn đọng. Rất tuyệt vời!
              </div>
            ) : (
              <div className="space-y-3">
                {todayList.map(plan => (
                  <TaskCard
                    key={plan.id}
                    plan={plan}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeletePlan}
                    onOpenRelated={handleOpenRelatedContent}
                    getSubjectName={getSubjectName}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Nhóm 3: Sắp tới */}
          {upcomingList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
                <CalendarIcon className="w-4 h-4 text-[#1A56DB]" />
                <span>Sắp tới ({upcomingList.length})</span>
              </div>
              <div className="space-y-3">
                {upcomingList.map(plan => (
                  <TaskCard
                    key={plan.id}
                    plan={plan}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeletePlan}
                    onOpenRelated={handleOpenRelatedContent}
                    getSubjectName={getSubjectName}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Nhóm 4: Đã hoàn thành */}
          {completedList.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Đã hoàn thành gần đây ({completedList.length})</span>
              </div>
              <div className="space-y-3 opacity-80">
                {completedList.map(plan => (
                  <TaskCard
                    key={plan.id}
                    plan={plan}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeletePlan}
                    onOpenRelated={handleOpenRelatedContent}
                    getSubjectName={getSubjectName}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHẾ ĐỘ 2: LỊCH BIỂU TUẦN */}
      {viewMode === 'calendar' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs overflow-x-auto">
          <div className="grid grid-cols-7 gap-3 min-w-[750px]">
            {weekDates.map((dateStr, idx) => {
              const dayTasks = plans.filter(p => p.dueDate === dateStr);
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={dateStr}
                  className={`rounded-xl border p-3 flex flex-col min-h-[220px] ${
                    isToday
                      ? 'bg-blue-50/60 border-blue-300 ring-1 ring-blue-300'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="text-center pb-2 border-b border-slate-200 mb-2">
                    <div className="text-xs font-bold text-slate-700">
                      {dayNames[idx]}
                    </div>
                    <div className={`text-sm font-bold ${isToday ? 'text-[#1A56DB]' : 'text-slate-900'}`}>
                      {dateStr.split('-').slice(1).reverse().join('/')}
                    </div>
                    {isToday && (
                      <span className="text-[10px] font-bold text-white bg-[#1A56DB] px-1.5 py-0.2 rounded-full inline-block mt-0.5">
                        Hôm nay
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 overflow-y-auto max-h-[260px]">
                    {dayTasks.length === 0 ? (
                      <div className="text-center py-6 text-[11px] text-slate-400 italic">
                        Không có lịch
                      </div>
                    ) : (
                      dayTasks.map(t => (
                        <div
                          key={t.id}
                          onClick={() => handleToggleComplete(t.id, t.completed)}
                          className={`p-2 rounded-lg text-xs cursor-pointer border transition ${
                            t.completed
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800 line-through opacity-75'
                              : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 shadow-2xs'
                          }`}
                        >
                          <div className="font-bold line-clamp-2">{t.title}</div>
                          <div className="text-[10px] text-slate-500 mt-1 flex items-center justify-between">
                            <span>{getSubjectName(t.subjectCode)}</span>
                            {t.estimatedMinutes && <span>{t.estimatedMinutes}p</span>}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  plan: StudyPlanItem;
  onToggleComplete: (id: string, completed: boolean) => void;
  onDelete: (id: string, isTeacherAssigned: boolean) => void;
  onOpenRelated: (item: StudyPlanItem) => void;
  getSubjectName: (code: string) => string;
}

const TaskCard: React.FC<TaskCardProps> = ({
  plan,
  onToggleComplete,
  onDelete,
  onOpenRelated,
  getSubjectName
}) => {
  const getTypeBadge = () => {
    switch (plan.type) {
      case 'lesson':
        return { label: 'Học bài tương tác', icon: Laptop, color: 'text-blue-900 bg-blue-100' };
      case 'review':
        return { label: 'Ôn tập câu hỏi', icon: BookOpen, color: 'text-amber-900 bg-amber-100' };
      case 'assessment':
        return { label: 'Kiểm tra', icon: ClipboardList, color: 'text-indigo-900 bg-indigo-100' };
      default:
        return { label: 'Tự học', icon: CheckCircle2, color: 'text-slate-700 bg-slate-100' };
    }
  };

  const typeInfo = getTypeBadge();
  const TypeIcon = typeInfo.icon;

  return (
    <div
      className={`bg-white border rounded-2xl p-4 sm:p-5 transition shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        plan.completed
          ? 'border-emerald-200 bg-emerald-50/20'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <button
          onClick={() => onToggleComplete(plan.id, plan.completed)}
          className="mt-0.5 text-slate-400 hover:text-[#1A56DB] transition cursor-pointer shrink-0"
          title={plan.completed ? 'Đánh dấu chưa hoàn thành' : 'Đánh dấu đã hoàn thành'}
        >
          {plan.completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${typeInfo.color}`}>
              <TypeIcon className="w-3 h-3" />
              <span>{typeInfo.label}</span>
            </span>

            <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
              {getSubjectName(plan.subjectCode)}
            </span>

            {plan.isTeacherAssigned ? (
              <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                Thầy cô giao: {plan.teacherName || 'Giáo viên bộ môn'}
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                Tự đặt · Lưu trên thiết bị này
              </span>
            )}
          </div>

          <h3
            className={`font-bold text-base sm:text-lg text-slate-900 leading-snug ${
              plan.completed ? 'line-through text-slate-400' : ''
            }`}
          >
            {plan.title}
          </h3>

          {plan.notes && (
            <p className="text-xs text-slate-600 italic">
              Ghi chú: {plan.notes}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Hạn: <strong>{plan.dueDate.split('-').reverse().join('/')}</strong></span>
            </span>

            {plan.estimatedMinutes && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{plan.estimatedMinutes} phút</span>
              </span>
            )}

            {plan.completed && plan.completedAt && (
              <span className="text-emerald-700 font-semibold">
                ✓ Hoàn thành: {new Date(plan.completedAt).toLocaleDateString('vi-VN')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        <button
          onClick={() => onOpenRelated(plan)}
          className="px-3.5 py-1.5 bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <span>Mở nội dung</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>

        {!plan.isTeacherAssigned ? (
          <button
            onClick={() => onDelete(plan.id, plan.isTeacherAssigned)}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-xl transition cursor-pointer"
            title="Xóa kế hoạch này"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        ) : (
          <span
            className="text-[11px] text-slate-400 italic px-2"
            title="Nhiệm vụ giáo viên giao không thể xóa"
          >
            Bài giáo viên
          </span>
        )}
      </div>
    </div>
  );
};
