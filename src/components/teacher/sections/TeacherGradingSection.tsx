/**
 * Smart EDU THCS - Giáo viên: Mục 8. Chấm bài & Kết quả (TeacherGradingSection)
 * Chức năng:
 * - Xem danh sách bài làm nộp của học sinh theo bài kiểm tra
 * - Chấm điểm chi tiết từng câu (Tự luận & Trắc nghiệm)
 * - Tách biệt rõ ràng: Chưa nộp / Đang chờ chấm / Đã chấm (Không gán 0 điểm cho bài chưa nộp)
 * - Nhập nhận xét sư phạm động viên học sinh
 * - Lưu bản nháp chấm & Công bố điểm cho học sinh
 * - Thống kê phổ điểm bằng dữ liệu thật
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  teacherDataService,
  StudentSubmissionItem
} from '../../../services/teacherDataService';
import {
  CheckSquare,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  User,
  Save,
  Send,
  BarChart2,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const TeacherGradingSection: React.FC = () => {
  const { displayName } = useAuth();
  const [submissions, setSubmissions] = useState<StudentSubmissionItem[]>(() => teacherDataService.getSubmissions());
  const [selectedSubId, setSelectedSubId] = useState<string>(submissions[0]?.id || '');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form chấm điểm cho bài được chọn
  const [gradingScore, setGradingScore] = useState<number>(8.0);
  const [gradingFeedback, setGradingFeedback] = useState<string>('');

  const refreshList = () => {
    setSubmissions(teacherDataService.getSubmissions());
  };

  const selectedSubmission = submissions.find(s => s.id === selectedSubId) || submissions[0];

  const handleOpenGradeModal = (sub: StudentSubmissionItem) => {
    setSelectedSubId(sub.id);
    setGradingScore(sub.score !== undefined ? sub.score : 8.0);
    setGradingFeedback(sub.feedback || '');
  };

  const handleSaveGrading = (isReleased = true) => {
    if (!selectedSubmission) return;

    if (gradingScore < 0 || gradingScore > selectedSubmission.maxScore) {
      alert(`Điểm số phải từ 0 đến ${selectedSubmission.maxScore}.`);
      return;
    }

    teacherDataService.gradeSubmission(
      selectedSubmission.id,
      gradingScore,
      gradingFeedback.trim(),
      displayName || 'Giáo viên bộ môn',
      isReleased
    );

    setSaveMessage(
      isReleased
        ? `✓ Đã hoàn tất chấm điểm và công bố kết quả cho học sinh ${selectedSubmission.studentName}.`
        : `✓ Đã lưu nháp kết quả chấm điểm cho ${selectedSubmission.studentName}.`
    );
    setTimeout(() => setSaveMessage(null), 4000);
    refreshList();
  };

  // Thống kê dữ liệu thật
  const gradedSubs = submissions.filter(s => s.status === 'graded');
  const avgScore = gradedSubs.length > 0
    ? (gradedSubs.reduce((acc, cur) => acc + (cur.score || 0), 0) / gradedSubs.length).toFixed(1)
    : 'Chưa có';

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & Thống kê */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 8 · Chấm bài &amp; Đánh giá kết quả học tập
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Chấm bài và công bố kết quả
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Chấm chi tiết bài làm của học sinh, ghi nhận xét sư phạm và phát hành điểm số chính thức.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-blue-900">{avgScore}</div>
            <div className="text-[11px] text-slate-600 font-semibold">Điểm trung bình</div>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center min-w-[120px]">
            <div className="text-xl font-bold text-amber-800">
              {submissions.filter(s => s.status === 'submitted').length}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">Bài chờ chấm</div>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* BỐ CỤC 2 CỘT: DANH SÁCH BÀI NỘP BÊN TRÁI & KHUNG CHẤM ĐIỂM BÊN PHẢI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT 1: Danh sách bài nộp (5 cột) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">Danh sách bài nộp ({submissions.length})</span>
            </div>

            <div className="space-y-2">
              {submissions.map(sub => {
                const isSelected = sub.id === selectedSubmission?.id;
                return (
                  <div
                    key={sub.id}
                    onClick={() => handleOpenGradeModal(sub)}
                    className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{sub.studentName}</span>
                        {sub.status === 'graded' ? (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.2 rounded-full">
                            {sub.score}/{sub.maxScore} điểm
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.2 rounded-full">
                            Chờ chấm
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        {sub.assignmentTitle}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        Nộp lúc: {new Date(sub.submittedAt).toLocaleString('vi-VN')}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CỘT 2: Chi tiết bài làm & Phiếu chấm điểm (7 cột) */}
        <div className="lg:col-span-7">
          {selectedSubmission ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header bài thi */}
              <div className="space-y-1 pb-4 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    Bài thi của học sinh: {selectedSubmission.studentName}
                  </span>
                  {selectedSubmission.isReleased ? (
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      ✓ Đã công bố điểm
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Bản nháp chấm (Chưa công bố)
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedSubmission.assignmentTitle}
                </h2>
                <div className="text-xs text-slate-500">
                  Thời gian nộp: {new Date(selectedSubmission.submittedAt).toLocaleString('vi-VN')}
                </div>
              </div>

              {/* Chi tiết câu trả lời của học sinh */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-slate-800 uppercase flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1A56DB]" />
                  <span>Bài làm chi tiết của học sinh:</span>
                </h3>

                <div className="space-y-2 font-mono text-xs">
                  {Object.entries(selectedSubmission.answers).map(([qKey, ans], idx) => (
                    <div key={qKey} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                      <div className="font-bold text-slate-700">Câu {idx + 1} ({qKey}):</div>
                      <div className="text-blue-900 font-semibold bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap">
                        {ans}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phiếu cho điểm & nhận xét của giáo viên */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1A56DB]" />
                  <span>Đánh giá &amp; Nhận xét của giáo viên</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Tổng điểm chấm (Thang {selectedSubmission.maxScore}): <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max={selectedSubmission.maxScore}
                      value={gradingScore}
                      onChange={e => setGradingScore(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-base text-blue-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Người chấm:
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedSubmission.gradedBy || displayName || 'Thầy cô bộ môn'}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-600 font-semibold"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 uppercase mb-1">
                      Lời nhận xét &amp; Hướng dẫn sửa lỗi cho học sinh:
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Ghi nhận xét cụ thể: Ưu điểm bài làm, các lỗi cần khắc phục, lời khuyên ôn tập..."
                      value={gradingFeedback}
                      onChange={e => setGradingFeedback(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-[#1A56DB]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-blue-200">
                  <button
                    onClick={() => handleSaveGrading(false)}
                    className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer"
                  >
                    Lưu nháp điểm
                  </button>
                  <button
                    onClick={() => handleSaveGrading(true)}
                    className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Công bố điểm cho học sinh</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
              Chọn bài nộp của học sinh để chấm
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
