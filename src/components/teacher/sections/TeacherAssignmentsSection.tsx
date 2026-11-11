/**
 * Smart EDU THCS - Giáo viên: Mục 5. Giao bài & Kiểm tra (TeacherAssignmentsSection)
 * Quy trình giao bài chuẩn:
 * 1. Chọn lớp phụ trách
 * 2. Chọn nội dung: Bài học tương tác hoặc danh mục câu hỏi đã duyệt
 * 3. Thiết lập lịch: Giờ mở, Hạn nộp, Thời lượng làm bài
 * 4. Chính sách kết quả: Công bố ngay / Sau hạn nộp / Giáo viên công bố thủ công
 * 5. Theo dõi tiến độ nộp bài của học sinh
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import {
  teacherDataService,
  TeacherAssignmentItem,
  TeacherClassItem
} from '../../../services/teacherDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  ClipboardList,
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  FileCheck,
  Send,
  Eye,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const TeacherAssignmentsSection: React.FC = () => {
  const { displayName, userId } = useAuth();
  const { setTeacherSection } = useNavigation();

  const classes = teacherDataService.getClasses();
  const approvedQuestions = teacherDataService.getQuestions().filter(q => q.status === 'approved');
  const [assignments, setAssignments] = useState<TeacherAssignmentItem[]>(() => teacherDataService.getAssignments());

  const [isCreating, setIsCreating] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form giao bài
  const [title, setTitle] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(classes[0]?.id || '');
  const [subjectCode, setSubjectCode] = useState('tin_hoc');
  const [instructions, setInstructions] = useState('Các em hoàn thành các câu hỏi trong thời gian quy định.');
  const [opensAt, setOpensAt] = useState(new Date().toISOString().slice(0, 16));
  const [dueAt, setDueAt] = useState(new Date(Date.now() + 86400000 * 7).toISOString().slice(0, 16));
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [releasePolicy, setReleasePolicy] = useState<'immediate' | 'after_due' | 'manual'>('immediate');
  const [selectedQuestionCodes, setSelectedQuestionCodes] = useState<string[]>(
    approvedQuestions.map(q => q.code).slice(0, 4)
  );

  const refreshList = () => {
    setAssignments(teacherDataService.getAssignments());
  };

  const handleToggleQuestionSelect = (qCode: string) => {
    if (selectedQuestionCodes.includes(qCode)) {
      setSelectedQuestionCodes(selectedQuestionCodes.filter(c => c !== qCode));
    } else {
      setSelectedQuestionCodes([...selectedQuestionCodes, qCode]);
    }
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedClassId) {
      alert('Vui lòng nhập tên bài kiểm tra và chọn lớp nhận bài.');
      return;
    }

    if (selectedQuestionCodes.length === 0) {
      alert('Vui lòng chọn ít nhất 1 câu hỏi từ ngân hàng để giao cho học sinh.');
      return;
    }

    const selectedCls = classes.find(c => c.id === selectedClassId);

    teacherDataService.createAssignment({
      classId: selectedClassId,
      className: selectedCls ? selectedCls.name : 'Lớp học',
      title: title.trim(),
      instructions: instructions.trim(),
      grade: selectedCls ? selectedCls.grade : 6,
      subjectCode,
      opensAt,
      dueAt,
      durationMinutes: Number(durationMinutes) || 15,
      questionIds: selectedQuestionCodes,
      status: 'published',
      releasePolicy,
      authorId: userId || 'gv_demo',
      authorName: displayName || 'Giáo viên THCS'
    });

    setSaveMessage('✓ Đã giao bài kiểm tra thành công tới toàn bộ học sinh trong lớp.');
    setTimeout(() => setSaveMessage(null), 4000);
    setIsCreating(false);
    refreshList();
  };

  const submissions = teacherDataService.getSubmissions();

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & Nút giao bài */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 5 · Giao bài tập &amp; Nhiệm vụ kiểm tra
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Giao bài và kiểm tra
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tạo nhiệm vụ kiểm tra trực tuyến, thiết lập thời lượng làm bài và quy định chính sách công bố kết quả.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(!isCreating)}
          className="px-5 py-2.5 bg-[#1A56DB] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Giao bài kiểm tra mới</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* FORM GIAO BÀI MỚI */}
      {isCreating && (
        <form
          onSubmit={handleCreateAssignment}
          className="bg-white border border-blue-300 rounded-2xl p-6 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1A56DB]" />
              <span>Thiết lập bài kiểm tra giao cho lớp</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Hủy
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Tiêu đề bài kiểm tra: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Kiểm tra 15 phút - Thông tin và Dữ liệu"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Lớp nhận bài: <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-blue-900"
              >
                {classes.filter(c => !c.archived).map(c => (
                  <option key={c.id} value={c.id}>{c.name} ({c.studentCount} HS)</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Môn học:</label>
              <select
                value={subjectCode}
                onChange={e => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                {THCS_SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Thời lượng (phút):</label>
              <input
                type="number"
                min="5"
                max="120"
                value={durationMinutes}
                onChange={e => setDurationMinutes(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Chính sách công bố điểm:</label>
              <select
                value={releasePolicy}
                onChange={e => setReleasePolicy(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
              >
                <option value="immediate">Công bố điểm ngay sau khi nộp</option>
                <option value="after_due">Công bố sau khi hết hạn nộp bài</option>
                <option value="manual">Giáo viên chấm duyệt &amp; công bố thủ công</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Thời gian mở bài:</label>
              <input
                type="datetime-local"
                value={opensAt}
                onChange={e => setOpensAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Hạn nộp bài:</label>
              <input
                type="datetime-local"
                value={dueAt}
                onChange={e => setDueAt(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono text-xs"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block font-bold text-slate-700 uppercase mb-1">Hướng dẫn làm bài:</label>
              <input
                type="text"
                value={instructions}
                onChange={e => setInstructions(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* Chọn câu hỏi từ ngân hàng đã duyệt */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Chọn câu hỏi từ Ngân hàng đã duyệt ({selectedQuestionCodes.length} câu đã chọn):
              </label>
              <span className="text-[11px] text-slate-500">
                Chỉ những câu hỏi được Hội đồng thẩm định phê duyệt mới được giao cho học sinh
              </span>
            </div>

            <div className="max-h-48 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2 bg-slate-50">
              {approvedQuestions.map(q => {
                const isSelected = selectedQuestionCodes.includes(q.code);
                return (
                  <div
                    key={q.id}
                    onClick={() => handleToggleQuestionSelect(q.code)}
                    className={`p-2 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-blue-50 border-blue-400 font-semibold text-blue-900'
                        : 'bg-white border-slate-200 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="rounded text-blue-600"
                      />
                      <span>[{q.code}] {q.prompt}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{q.points} điểm</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Giao bài chính thức</span>
            </button>
          </div>
        </form>
      )}

      {/* DANH SÁCH BÀI ĐÃ GIAO */}
      <div className="space-y-3">
        {assignments.length === 0 ? (
          <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
            Chưa có bài kiểm tra nào được giao. Nhấn "+ Giao bài kiểm tra mới" ở góc trên.
          </div>
        ) : (
          assignments.map(asg => {
            const asgSubs = submissions.filter(s => s.assignmentId === asg.id);
            const submittedCount = asgSubs.length;

            return (
              <div
                key={asg.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      {asg.className}
                    </span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {asg.subjectCode.toUpperCase()} • Lớp {asg.grade}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Đã phát đề ({asg.questionIds.length} câu)
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    {asg.title}
                  </h3>

                  <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{asg.durationMinutes} phút</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Hạn: {new Date(asg.dueAt).toLocaleDateString('vi-VN')}</span>
                    </span>
                    <span>•</span>
                    <span>Chính sách: {asg.releasePolicy === 'immediate' ? 'Hiện điểm ngay' : 'Thủ công'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <div className="text-right text-xs">
                    <div className="font-bold text-slate-900">{submittedCount} bài nộp</div>
                    <div className="text-[11px] text-slate-400">Đã nộp bài</div>
                  </div>

                  <button
                    onClick={() => setTeacherSection('grading')}
                    className="px-4 py-2 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition cursor-pointer"
                  >
                    Xem bài nộp &amp; Chấm
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
