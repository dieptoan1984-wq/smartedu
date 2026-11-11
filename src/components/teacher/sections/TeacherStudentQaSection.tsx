/**
 * Smart EDU THCS - Giáo viên: Mục 9. Trao đổi với học sinh (TeacherStudentQaSection)
 * Kết nối 2 chiều thực sự:
 * - Nhận câu hỏi học sinh đặt từ Mục 9 khu vực học sinh (studentDataService)
 * - Lọc theo Môn, Trạng thái (Chờ giải đáp, Đã trả lời, Đã giải quyết)
 * - Giáo viên trực tiếp gõ phản hồi giải thích câu hỏi khó
 * - Phản hồi xuất hiện tức thì trong màn hình của học sinh
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  studentDataService,
  TeacherQuestionItem
} from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  MessageCircle,
  Send,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Filter,
  ChevronRight
} from 'lucide-react';

export const TeacherStudentQaSection: React.FC = () => {
  const { displayName, userId } = useAuth();
  const [questions, setQuestions] = useState<TeacherQuestionItem[]>(() => studentDataService.getTeacherQuestions(null));
  const [selectedQId, setSelectedQId] = useState<string>(questions[0]?.id || '');
  const [replyText, setReplyText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');

  const refreshQuestions = () => {
    setQuestions(studentDataService.getTeacherQuestions(null));
  };

  const selectedQuestion = questions.find(q => q.id === selectedQId) || questions[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestion || !replyText.trim()) return;

    studentDataService.addQuestionReply(
      null,
      selectedQuestion.id,
      replyText.trim(),
      displayName || 'Thầy cô bộ môn'
    );

    // Cập nhật trạng thái câu hỏi thành 'answered'
    studentDataService.updateQuestionStatus(null, selectedQuestion.id, 'answered');

    setReplyText('');
    refreshQuestions();
  };

  const filteredQuestions = questions.filter(q => {
    if (filterStatus !== 'ALL' && q.status !== filterStatus) return false;
    if (filterSubject !== 'ALL' && q.subjectCode !== filterSubject) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & Giới thiệu */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 9 · Hỗ trợ &amp; Giải đáp thắc mắc học tập
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Trao đổi với học sinh
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tiếp nhận câu hỏi, thắc mắc về bài học tương tác và gửi phản hồi hướng dẫn cho học sinh.
          </p>
        </div>

        <div className="text-xs font-semibold text-slate-500 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-xl">
          Hội thoại kết nối trực tiếp với giao diện Hỏi giáo viên của học sinh
        </div>
      </div>

      {/* BỘ LỌC CÂU HỎI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Trạng thái:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="ALL">Tất cả ({questions.length})</option>
              <option value="pending">Chờ giải đáp ({questions.filter(q => q.status === 'pending').length})</option>
              <option value="answered">Đã trả lời ({questions.filter(q => q.status === 'answered').length})</option>
              <option value="resolved">Đã giải quyết ({questions.filter(q => q.status === 'resolved').length})</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Môn học:</span>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="ALL">Tất cả môn</option>
              {THCS_SUBJECTS.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-semibold">
          Tổng cộng: <strong>{filteredQuestions.length}</strong> cuộc trao đổi
        </div>
      </div>

      {/* BỐ CỤC 2 CỘT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT 1: Danh sách câu hỏi học sinh (5 cột) */}
        <div className="lg:col-span-5 space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
              Chưa có thắc mắc nào phù hợp với bộ lọc.
            </div>
          ) : (
            filteredQuestions.map(q => {
              const isSelected = q.id === selectedQuestion?.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQId(q.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer shadow-xs ${
                    isSelected
                      ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400'
                      : 'bg-white border-slate-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {q.subjectCode.toUpperCase()} • Lớp {q.grade}
                    </span>

                    {q.status === 'pending' ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Chờ giải đáp</span>
                      </span>
                    ) : q.status === 'answered' ? (
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                        Đã phản hồi ({q.replies.length})
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Đã hiểu bài
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
                    {q.title}
                  </h3>

                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Học sinh: {q.teacherOrClassName}</span>
                    <span>{new Date(q.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* CỘT 2: Chi tiết đoạn trao đổi và Khung trả lời (7 cột) */}
        <div className="lg:col-span-7">
          {selectedQuestion ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header câu hỏi */}
              <div className="space-y-2 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    Môn: {selectedQuestion.subjectCode.toUpperCase()}
                  </span>
                  {selectedQuestion.lessonTitle && (
                    <span className="text-xs text-slate-600 font-semibold">
                      {selectedQuestion.lessonTitle}
                    </span>
                  )}
                </div>

                <h2 className="text-lg font-bold text-slate-900">
                  {selectedQuestion.title}
                </h2>

                <div className="text-xs text-slate-500">
                  Gửi lúc: {new Date(selectedQuestion.createdAt).toLocaleString('vi-VN')}
                </div>
              </div>

              {/* Lời hỏi của học sinh */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>Câu hỏi của học sinh:</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedQuestion.content}
                </p>
              </div>

              {/* Dòng lịch sử các phản hồi */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                  <MessageCircle className="w-4 h-4 text-[#1A56DB]" />
                  <span>Lịch sử hướng dẫn giải đáp ({selectedQuestion.replies.length}):</span>
                </div>

                {selectedQuestion.replies.map(rep => (
                  <div
                    key={rep.id}
                    className={`p-4 rounded-xl border ${
                      rep.sender === 'teacher'
                        ? 'bg-blue-50/70 border-blue-200 ml-4'
                        : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1 font-bold text-blue-900">
                      <span>{rep.senderName} ({rep.sender === 'teacher' ? 'Thầy cô' : 'Học sinh'})</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(rep.sentAt).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {rep.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Khung nhập phản hồi của giáo viên */}
              <form onSubmit={handleSendReply} className="pt-3 border-t border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Nhập lời giải đáp sư phạm gửi học sinh:
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ghi giải thích rõ ràng, định hướng bước tư duy để em hiểu bài..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-hidden focus:border-[#1A56DB]"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi phản hồi cho học sinh</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
              Chọn một câu hỏi để trả lời
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
