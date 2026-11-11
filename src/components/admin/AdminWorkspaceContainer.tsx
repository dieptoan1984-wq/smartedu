/**
 * Smart EDU THCS - Khu vực Quản trị & Thẩm định chuyên môn (AdminWorkspaceContainer)
 * Dành riêng cho người dùng có vai trò 'admin' hoặc 'reviewer'
 * Các chức năng:
 * 1. Duyệt học liệu & câu hỏi (Review queue: Phê duyệt hoặc Yêu cầu sửa có lý do)
 * 2. Quản lý danh mục học tập (Khối 6-9, 12 môn, Bộ sách KNTT, Chương, Bài)
 * 3. Quản lý tài khoản & Phân quyền (Gán vai trò có kiểm soát)
 * 4. Phân công người duyệt theo môn (private.reviewer_scopes)
 * 5. Nhật ký thao tác hệ thống (private.audit_log)
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import {
  teacherDataService,
  TeacherLessonDraft,
  TeacherQuestionDraft,
  AuditLogEntry,
  ReviewerScopeItem
} from '../../services/teacherDataService';
import { THCS_SUBJECTS, UserRole } from '../../types/smartEduData';
import {
  Shield,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  BookOpen,
  Users,
  Eye,
  History,
  Lock,
  ChevronRight,
  Sparkles,
  ShieldAlert,
  Send,
  X
} from 'lucide-react';

export const AdminWorkspaceContainer: React.FC = () => {
  const { roles, displayName, userId } = useAuth();
  const { openHome } = useNavigation();

  const isAdmin = roles.includes('admin');
  const isReviewer = roles.includes('reviewer');
  const hasAccess = isAdmin || isReviewer;

  const [activeTab, setActiveTab] = useState<'review_queue' | 'curriculum' | 'users' | 'scopes' | 'audit'>('review_queue');

  // Dữ liệu
  const [lessons, setLessons] = useState<TeacherLessonDraft[]>(() => teacherDataService.getLessons());
  const [questions, setQuestions] = useState<TeacherQuestionDraft[]>(() => teacherDataService.getQuestions());
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => teacherDataService.getAuditLog());
  const [reviewerScopes, setReviewerScopes] = useState<ReviewerScopeItem[]>(() => teacherDataService.getReviewerScopes());

  // Modal xem trước bài học HTML
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string>('');

  // Modal yêu cầu chỉnh sửa
  const [rejectingItem, setRejectingItem] = useState<{ id: string; type: 'lesson' | 'question'; title: string } | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const refreshAll = () => {
    setLessons(teacherDataService.getLessons());
    setQuestions(teacherDataService.getQuestions());
    setAuditLogs(teacherDataService.getAuditLog());
    setReviewerScopes(teacherDataService.getReviewerScopes());
  };

  // Nếu người dùng không có quyền admin hoặc reviewer
  if (!hasAccess) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-rose-300 rounded-2xl p-8 text-center space-y-4 shadow-sm font-serif">
        <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-full flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6 text-rose-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Khu Vực Quản Trị &amp; Thẩm Định Chuyên Môn
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Khu vực này chỉ dành riêng cho Quản trị viên (Admin) và Người duyệt chuyên môn (Reviewer) được cấp quyền tại máy chủ qua hàm <code className="font-mono text-blue-900">current_access()</code>.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={openHome}
            className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Thẩm định bài học
  const handleApproveLesson = (id: string, title: string) => {
    if (window.confirm(`Phê duyệt bài học "${title}"? Sau khi duyệt, bài học sẽ xuất hiện ngay trong danh mục học tập của học sinh.`)) {
      teacherDataService.reviewLesson(id, 'approved', undefined, displayName || 'Thẩm định viên');
      refreshAll();
    }
  };

  const handleOpenRejectLesson = (id: string, title: string) => {
    setRejectingItem({ id, type: 'lesson', title });
    setRejectReason('');
  };

  // Thẩm định câu hỏi
  const handleApproveQuestion = (id: string, code: string) => {
    if (window.confirm(`Phê duyệt câu hỏi mã "${code}" vào ngân hàng chuẩn?`)) {
      teacherDataService.reviewQuestion(id, 'approved', undefined, displayName || 'Thẩm định viên');
      refreshAll();
    }
  };

  const handleOpenRejectQuestion = (id: string, code: string) => {
    setRejectingItem({ id, type: 'question', title: code });
    setRejectReason('');
  };

  // Xác nhận gửi yêu cầu chỉnh sửa
  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem || !rejectReason.trim()) return;

    if (rejectingItem.type === 'lesson') {
      teacherDataService.reviewLesson(rejectingItem.id, 'changes_requested', rejectReason.trim(), displayName || 'Thẩm định viên');
    } else {
      teacherDataService.reviewQuestion(rejectingItem.id, 'changes_requested', rejectReason.trim(), displayName || 'Thẩm định viên');
    }

    setRejectingItem(null);
    setRejectReason('');
    refreshAll();
  };

  const pendingLessons = lessons.filter(l => l.status === 'pending');
  const pendingQuestions = questions.filter(q => q.status === 'pending');

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề Khu vực Quản trị & Thẩm định */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-md">
              {isAdmin ? 'Quản trị hệ thống (Admin)' : 'Hội đồng thẩm định chuyên môn (Reviewer)'}
            </span>
            <span className="text-xs text-slate-500 font-semibold">
              Xác thực: current_access()
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Không gian Quản trị &amp; Thẩm định học liệu
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Duyệt bài học tương tác, thẩm định câu hỏi, quản lí danh mục môn học và theo dõi nhật ký kiểm toán.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-center min-w-[130px]">
            <div className="text-xl font-bold text-purple-900">
              {pendingLessons.length + pendingQuestions.length}
            </div>
            <div className="text-[11px] text-slate-600 font-semibold">Chờ thẩm định</div>
          </div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG 5 TAB CHÍNH */}
      <div className="bg-white border border-slate-200 rounded-2xl p-2.5 shadow-xs flex items-center justify-between gap-1 overflow-x-auto text-xs sm:text-sm">
        <button
          onClick={() => setActiveTab('review_queue')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'review_queue'
              ? 'bg-[#1A56DB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>1. Duyệt học liệu &amp; Câu hỏi ({pendingLessons.length + pendingQuestions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('curriculum')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'curriculum'
              ? 'bg-[#1A56DB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>2. Danh mục môn &amp; SGK</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'users'
              ? 'bg-[#1A56DB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>3. Tài khoản &amp; Phân quyền</span>
        </button>

        <button
          onClick={() => setActiveTab('scopes')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'scopes'
              ? 'bg-[#1A56DB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>4. Phân công thẩm định</span>
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-[#1A56DB] text-white shadow-2xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>5. Nhật ký kiểm toán ({auditLogs.length})</span>
        </button>
      </div>

      {/* TAB 1: DUYỆT HỌC LIỆU & CÂU HỎI (REVIEW QUEUE) */}
      {activeTab === 'review_queue' && (
        <div className="space-y-6">
          {/* PHẦN A: BÀI HỌC CHỜ DUYỆT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-700" />
                <span>Bài học tương tác chờ thẩm định ({pendingLessons.length})</span>
              </h2>
              <span className="text-xs text-slate-500">
                Phê duyệt để bài học xuất hiện trong danh mục học sinh
              </span>
            </div>

            {pendingLessons.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                Không có bài học nào đang chờ thẩm định.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingLessons.map(ls => (
                  <div
                    key={ls.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                            {ls.subjectCode.toUpperCase()} • Lớp {ls.grade}
                          </span>
                          <span className="text-xs text-slate-500">
                            Tác giả: <strong>{ls.authorName}</strong>
                          </span>
                        </div>
                        <h3 className="font-bold text-base text-slate-900">{ls.title}</h3>
                        <div className="text-xs text-slate-500">
                          {ls.chapterTitle} • Nguồn: {ls.source}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setPreviewHtml(ls.htmlContent);
                            setPreviewTitle(ls.title);
                          }}
                          className="px-3.5 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-700" />
                          <span>Xem trước HTML</span>
                        </button>

                        <button
                          onClick={() => handleOpenRejectLesson(ls.id, ls.title)}
                          className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold cursor-pointer"
                        >
                          Yêu cầu sửa
                        </button>

                        <button
                          onClick={() => handleApproveLesson(ls.id, ls.title)}
                          className="px-4 py-1.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                        >
                          Phê duyệt bài học
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* PHẦN B: CÂU HỎI CHỜ DUYỆT */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="font-bold text-base sm:text-lg text-slate-900 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-purple-700" />
                <span>Câu hỏi chờ thẩm định ({pendingQuestions.length})</span>
              </h2>
            </div>

            {pendingQuestions.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                Không có câu hỏi nào đang chờ thẩm định.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingQuestions.map(q => (
                  <div
                    key={q.id}
                    className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                          {q.code}
                        </span>
                        <span className="text-slate-600 font-semibold">
                          {q.subjectCode.toUpperCase()} • Lớp {q.grade}
                        </span>
                        <span className="text-purple-800 font-semibold bg-purple-100 px-2 py-0.5 rounded">
                          {q.questionType.toUpperCase()}
                        </span>
                      </div>
                      <span className="text-slate-400">Tác giả: {q.authorName}</span>
                    </div>

                    <div className="font-bold text-sm text-slate-900">{q.prompt}</div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                      <div>
                        Đáp án chuẩn: <strong className="text-emerald-800">{q.correctAnswer}</strong> • Điểm: <strong>{q.points}</strong>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleOpenRejectQuestion(q.id, q.code)}
                          className="px-3 py-1 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded font-bold"
                        >
                          Yêu cầu sửa
                        </button>
                        <button
                          onClick={() => handleApproveQuestion(q.id, q.code)}
                          className="px-4 py-1 bg-emerald-600 text-white hover:bg-emerald-700 rounded font-bold"
                        >
                          Phê duyệt câu hỏi
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DANH MỤC MÔN & SGK */}
      {activeTab === 'curriculum' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
            Danh mục 12 Môn học THCS (Bộ sách Kết nối tri thức với cuộc sống)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            {THCS_SUBJECTS.map(s => (
              <div key={s.code} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                <div className="flex justify-between font-mono font-bold text-blue-900">
                  <span>{s.code}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                    Đang kích hoạt
                  </span>
                </div>
                <div className="font-bold text-sm text-slate-900">{s.name}</div>
                <div className="text-[11px] text-slate-500">Áp dụng: Khối lớp 6, 7, 8, 9</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: TÀI KHOẢN & PHÂN QUYỀN */}
      {activeTab === 'users' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
            Quản lý tài khoản &amp; Vai trò hệ thống
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600">
                  <th className="py-2.5 px-3 font-bold">Tài khoản / Người dùng</th>
                  <th className="py-2.5 px-3 font-bold">Email</th>
                  <th className="py-2.5 px-3 font-bold">Vai trò hiện tại</th>
                  <th className="py-2.5 px-3 font-bold">Nguồn xác thực</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">{displayName || 'Người dùng hiện tại'}</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">dieptoan1984@gmail.com</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold text-purple-900 bg-purple-100 px-2 py-0.5 rounded-full">
                      {roles.join(', ')}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">current_access()</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-bold text-slate-900">Thầy Nguyễn Văn An</td>
                  <td className="py-2.5 px-3 font-mono text-slate-500">an.nv@thcs.edu.vn</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                      teacher
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">private.user_roles</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PHÂN CÔNG THẨM ĐỊNH (REVIEWER SCOPES) */}
      {activeTab === 'scopes' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
            Phân công người duyệt theo môn (private.reviewer_scopes)
          </h2>
          <div className="space-y-2 text-xs">
            {reviewerScopes.map((scope, idx) => (
              <div
                key={idx}
                className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900 text-sm">{scope.userName}</span>
                  <div className="text-[11px] text-slate-500">User ID: {scope.userId}</div>
                </div>
                <div className="text-right">
                  <span className="font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded">
                    Phụ trách môn: {scope.subjectName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: NHẬT KÝ KIỂM TOÁN (AUDIT LOG) */}
      {activeTab === 'audit' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-lg text-slate-900 pb-2 border-b border-slate-100">
            Nhật ký kiểm toán hệ thống (private.audit_log)
          </h2>
          <div className="space-y-2 max-h-[500px] overflow-y-auto">
            {auditLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">Chưa có nhật ký nào được ghi nhận.</div>
            ) : (
              auditLogs.map(log => (
                <div
                  key={log.id}
                  className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1"
                >
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-blue-900">[{log.action}] {log.entityType}</span>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {new Date(log.timestamp).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="text-slate-700">{log.details}</div>
                  <div className="text-[10px] text-slate-400">Thực hiện bởi: {log.actorName}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* MODAL XEM TRƯỚC BÀI HỌC HTML */}
      {previewHtml && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-sm text-slate-900">
                Thẩm định bài học trong Sandbox: {previewTitle}
              </span>
              <button
                onClick={() => setPreviewHtml(null)}
                className="p-1 text-slate-500 hover:text-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 w-full bg-slate-50">
              <iframe
                srcDoc={previewHtml}
                title="Preview Review"
                sandbox="allow-scripts allow-modals"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL YÊU CẦU CHỈNH SỬA CÓ LÝ DO */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmReject}
            className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-xl"
          >
            <h3 className="font-bold text-lg text-slate-900">
              Yêu cầu chỉnh sửa: {rejectingItem.title}
            </h3>
            <p className="text-xs text-slate-600">
              Vui lòng nêu rõ lý do chuyên môn cần bổ sung, chỉnh sửa để giáo viên hoàn thiện học liệu:
            </p>
            <textarea
              rows={4}
              required
              placeholder="Ví dụ: Cần bổ sung ví dụ minh họa trực quan hơn ở phần quan sát tình huống..."
              value={rejectReason}
              onChange={e => setRejectReason(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs focus:outline-hidden focus:border-[#1A56DB]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setRejectingItem(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700"
              >
                Gửi yêu cầu chỉnh sửa
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
