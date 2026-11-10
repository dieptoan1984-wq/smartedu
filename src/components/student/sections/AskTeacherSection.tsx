/**
 * Smart EDU THCS - Mục 9: Hỏi giáo viên (Section 9)
 * Không gian gửi câu hỏi, thắc mắc về bài học và xem phản hồi từ giáo viên bộ môn.
 * Luồng câu hỏi, phản hồi trao đổi, đánh dấu đã giải quyết.
 * Phân định minh bạch: Lưu trên thiết bị này, chuẩn bị kết nối API máy chủ.
 * Times New Roman 18px base, xanh công nghệ.
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigation } from '../../../contexts/NavigationContext';
import {
  studentDataService,
  TeacherQuestionItem
} from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  MessageCircle,
  Plus,
  Send,
  CheckCircle2,
  Clock,
  User,
  GraduationCap,
  Sparkles,
  HelpCircle,
  Filter,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AskTeacherSection: React.FC = () => {
  const { userId, displayName } = useAuth();
  const { selectedSubjectCode, openLessonPlayer } = useNavigation();

  const [questions, setQuestions] = useState<TeacherQuestionItem[]>([]);
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'pending' | 'answered' | 'resolved'>('ALL');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [isAskingNew, setIsAskingNew] = useState(false);

  // Form đặt câu hỏi
  const [subject, setSubject] = useState(selectedSubjectCode || 'tin_hoc');
  const [lessonTitle, setLessonTitle] = useState('Bài 1: Thông tin và dữ liệu');
  const [teacherName, setTeacherName] = useState('Thầy Nguyễn Văn An (GV Tin học)');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Form trả lời tiếp (follow-up)
  const [replyText, setReplyText] = useState('');

  const loadQuestions = () => {
    let list = studentDataService.getTeacherQuestions(userId);
    if (list.length === 0) {
      // Khởi tạo câu hỏi đối thoại mẫu đầu tiên cho học sinh thấy luồng
      const defaultQ = studentDataService.addTeacherQuestion(userId, {
        subjectCode: 'tin_hoc',
        grade: 6,
        lessonTitle: 'Bài 1: Thông tin và dữ liệu',
        teacherOrClassName: 'Thầy Nguyễn Văn An (GV Tin học)',
        title: 'Thầy cho em hỏi cách phân biệt rõ hơn giữa dữ liệu dạng số và thông tin rút ra?',
        content: 'Trong phần bài tập quan sát dự báo thời tiết, em thấy nhiệt độ 32 độ C là một con số, nhưng khi nào nó được tính là dữ liệu và khi nào là thông tin ạ?'
      });

      // Thêm phản hồi mẫu từ giáo viên để học sinh hình dung giao diện
      defaultQ.replies.push({
        id: 'rep_sample_01',
        sender: 'teacher',
        senderName: 'Thầy Nguyễn Văn An',
        text: 'Chào em. Câu hỏi rất hay! Bản thân con số "32" ghi trên nhiệt kế là dữ liệu thô (dữ liệu số). Khi em đọc số 32 đó và hiểu rằng hôm nay trời rất nóng, cần uống nhiều nước và bật quạt thì ý nghĩa đó chính là thông tin mà em thu nhận được. Em thử làm thêm câu trắc nghiệm số 2 để củng cố nhé!',
        sentAt: new Date(Date.now() - 3600000 * 5).toISOString()
      });
      defaultQ.status = 'answered';
      try {
        localStorage.setItem(`smart_edu_student_${userId || 'guest'}_questions`, JSON.stringify([defaultQ]));
      } catch {}
      list = [defaultQ];
    }
    setQuestions(list);
  };

  useEffect(() => {
    loadQuestions();
  }, [userId]);

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung thắc mắc.');
      return;
    }

    const created = studentDataService.addTeacherQuestion(userId, {
      subjectCode: subject,
      grade: 6,
      lessonTitle: lessonTitle.trim() || undefined,
      teacherOrClassName: teacherName,
      title: title.trim(),
      content: content.trim()
    });

    setTitle('');
    setContent('');
    setIsAskingNew(false);
    loadQuestions();
    setSelectedQuestionId(created.id);
  };

  const handleSendFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuestionId || !replyText.trim()) return;

    studentDataService.addQuestionReply(
      userId,
      selectedQuestionId,
      replyText.trim(),
      displayName || 'Em (Học sinh)'
    );

    setReplyText('');
    loadQuestions();
  };

  const handleToggleResolve = (qId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'resolved' ? 'answered' : 'resolved';
    studentDataService.updateQuestionStatus(userId, qId, nextStatus);
    loadQuestions();
  };

  const filteredQuestions = questions.filter(q => {
    if (filterStatus === 'ALL') return true;
    return q.status === filterStatus;
  });

  const selectedQuestion = questions.find(q => q.id === selectedQuestionId);

  const getSubjectName = (code: string) => {
    const s = THCS_SUBJECTS.find(sub => sub.code === code);
    return s ? s.name : code;
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & Nút đặt câu hỏi */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 9 · Trao đổi cùng giáo viên
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Hỏi giáo viên bộ môn
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Gửi thắc mắc về bài học, bài tập khó hoặc nội dung ôn tập trực tiếp tới thầy cô giảng dạy.
          </p>
        </div>

        <button
          onClick={() => {
            setIsAskingNew(true);
            setSelectedQuestionId(null);
          }}
          className="px-5 py-2.5 bg-[#1A56DB] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Đặt câu hỏi mới</span>
        </button>
      </div>

      {/* Thông báo phân định minh bạch */}
      <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-blue-900">
        <ShieldCheck className="w-4 h-4 text-[#1A56DB] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold">
            Trạng thái lưu trữ: Bản nháp lưu an toàn trên thiết bị này
          </div>
          <p className="text-slate-600 leading-relaxed">
            Hệ thống đang lưu trữ các câu hỏi và nhật ký trao đổi của em trong trình duyệt. Khi kết nối tài khoản giáo viên trực tiếp trên hệ thống trường học được kích hoạt, câu hỏi sẽ tự động đồng bộ lên máy chủ bộ môn.
          </p>
        </div>
      </div>

      {/* MODAL / FORM ĐẶT CÂU HỎI MỚI */}
      {isAskingNew && (
        <form
          onSubmit={handleCreateQuestion}
          className="bg-white border border-blue-300 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1A56DB]" />
              <span>Gửi thắc mắc học tập tới thầy cô</span>
            </h2>
            <button
              type="button"
              onClick={() => setIsAskingNew(false)}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Đóng lại
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Môn học:
              </label>
              <select
                value={subject}
                onChange={e => setSubject(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              >
                {THCS_SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Giáo viên nhận câu hỏi:
              </label>
              <select
                value={teacherName}
                onChange={e => setTeacherName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              >
                <option value="Thầy Nguyễn Văn An (GV Tin học)">Thầy Nguyễn Văn An (GV Tin học)</option>
                <option value="Cô Lê Thị Hoa (GV Toán)">Cô Lê Thị Hoa (GV Toán)</option>
                <option value="Thầy Trần Minh Đức (GV KHTN)">Thầy Trần Minh Đức (GV KHTN)</option>
                <option value="Cô Vũ Thu Hằng (GV Ngữ văn)">Cô Vũ Thu Hằng (GV Ngữ văn)</option>
                <option value="Giáo viên bộ môn chung">Giáo viên phụ trách khối 6</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bài học liên quan (nếu có):
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Bài 1: Thông tin và dữ liệu, Bài 23: Mở rộng phân số..."
                value={lessonTitle}
                onChange={e => setLessonTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tiêu đề câu hỏi vắn tắt: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Em chưa hiểu cách tính bài tập số 3 trong phiếu rèn luyện..."
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Nội dung câu hỏi chi tiết: <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={4}
                placeholder="Em hãy mô tả rõ câu hỏi, bước nào em đã làm và bước nào em bị vướng mắc để thầy cô giải đáp cụ thể nhất..."
                value={content}
                onChange={e => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAskingNew(false)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Gửi câu hỏi</span>
            </button>
          </div>
        </form>
      )}

      {/* BỐ CỤC CHÍNH: DANH SÁCH BÊN TRÁI & CHI TIẾT ĐỐI THOẠI BÊN PHẢI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Cột 1: Danh sách câu hỏi (5 cột) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Bộ lọc tab trạng thái */}
          <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-1 overflow-x-auto text-xs">
            <button
              onClick={() => setFilterStatus('ALL')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
                filterStatus === 'ALL'
                  ? 'bg-[#1A56DB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Tất cả ({questions.length})
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
                filterStatus === 'pending'
                  ? 'bg-[#1A56DB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Chờ trả lời ({questions.filter(q => q.status === 'pending').length})
            </button>
            <button
              onClick={() => setFilterStatus('answered')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
                filterStatus === 'answered'
                  ? 'bg-[#1A56DB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Đã có lời giải ({questions.filter(q => q.status === 'answered').length})
            </button>
            <button
              onClick={() => setFilterStatus('resolved')}
              className={`px-3 py-1.5 rounded-xl font-semibold transition cursor-pointer whitespace-nowrap ${
                filterStatus === 'resolved'
                  ? 'bg-[#1A56DB] text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Đã hiểu ({questions.filter(q => q.status === 'resolved').length})
            </button>
          </div>

          {/* Danh sách thẻ câu hỏi */}
          <div className="space-y-3">
            {filteredQuestions.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-2xl text-center text-xs text-slate-500 space-y-2">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                <div>Không có câu hỏi nào trong mục này.</div>
              </div>
            ) : (
              filteredQuestions.map(item => {
                const isSelected = item.id === selectedQuestionId;
                return (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedQuestionId(item.id);
                      setIsAskingNew(false);
                    }}
                    className={`p-4 rounded-2xl border transition cursor-pointer shadow-xs ${
                      isSelected
                        ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400'
                        : 'bg-white border-slate-200 hover:border-blue-200'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                        {getSubjectName(item.subjectCode)}
                      </span>

                      {item.status === 'pending' ? (
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>Chờ phản hồi</span>
                        </span>
                      ) : item.status === 'answered' ? (
                        <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <MessageCircle className="w-3 h-3" />
                          <span>Đã trả lời ({item.replies.length})</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Đã giải quyết</span>
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug">
                      {item.title}
                    </h3>

                    {item.lessonTitle && (
                      <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                        Bài: {item.lessonTitle}
                      </div>
                    )}

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{item.teacherOrClassName}</span>
                      <span>{new Date(item.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Cột 2: Chi tiết đoạn trao đổi và câu trả lời của giáo viên (7 cột) */}
        <div className="lg:col-span-7">
          {selectedQuestion ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header câu hỏi */}
              <div className="space-y-3 pb-4 border-b border-slate-200">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
                      {getSubjectName(selectedQuestion.subjectCode)}
                    </span>
                    {selectedQuestion.lessonTitle && (
                      <span className="text-xs text-slate-600 font-medium">
                        {selectedQuestion.lessonTitle}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleToggleResolve(selectedQuestion.id, selectedQuestion.status)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      selectedQuestion.status === 'resolved'
                        ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {selectedQuestion.status === 'resolved' ? 'Mở lại câu hỏi' : 'Đánh dấu đã hiểu bài'}
                    </span>
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-900">
                  {selectedQuestion.title}
                </h2>

                <div className="text-xs text-slate-500 flex items-center gap-4">
                  <span>Gửi tới: <strong>{selectedQuestion.teacherOrClassName}</strong></span>
                  <span>•</span>
                  <span>Thời gian: {new Date(selectedQuestion.createdAt).toLocaleString('vi-VN')}</span>
                </div>
              </div>

              {/* Lời hỏi ban đầu của học sinh */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <User className="w-4 h-4 text-blue-700" />
                  <span>Em ({displayName || 'Học sinh'}) đã hỏi:</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedQuestion.content}
                </p>
              </div>

              {/* Dòng thời gian phản hồi (Timeline) */}
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-700 uppercase flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 text-[#1A56DB]" />
                  <span>Trao đổi và hướng dẫn giải ({selectedQuestion.replies.length})</span>
                </div>

                {selectedQuestion.replies.length === 0 ? (
                  <div className="p-6 bg-amber-50/60 border border-amber-200 rounded-xl text-center space-y-1">
                    <div className="text-sm font-semibold text-amber-900">
                      Thầy cô đang tiếp nhận câu hỏi của em
                    </div>
                    <p className="text-xs text-amber-700">
                      Giáo viên bộ môn sẽ phản hồi giải thích trong thời gian sớm nhất. Em có thể tiếp tục học các bài khác trong lúc chờ.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {selectedQuestion.replies.map(reply => (
                      <div
                        key={reply.id}
                        className={`p-4 rounded-xl border ${
                          reply.sender === 'teacher'
                            ? 'bg-blue-50/70 border-blue-200'
                            : 'bg-white border-slate-200 ml-6'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="font-bold flex items-center gap-1.5 text-blue-900">
                            {reply.sender === 'teacher' ? (
                              <>
                                <GraduationCap className="w-4 h-4 text-[#1A56DB]" />
                                <span>{reply.senderName}</span>
                                <span className="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded font-semibold">
                                  Giáo viên
                                </span>
                              </>
                            ) : (
                              <>
                                <User className="w-3.5 h-3.5 text-slate-600" />
                                <span>{reply.senderName}</span>
                              </>
                            )}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(reply.sentAt).toLocaleString('vi-VN')}
                          </span>
                        </div>
                        <p className="text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                          {reply.text}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Khối gửi phản hồi tiếp */}
              <form onSubmit={handleSendFollowUp} className="pt-2 border-t border-slate-200 space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Hỏi tiếp hoặc gửi lời cảm ơn thầy cô:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Viết nội dung trao đổi thêm hoặc xác nhận đã hiểu..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:border-[#1A56DB]"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 disabled:opacity-50 transition cursor-pointer flex items-center gap-1.5 shrink-0 shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Gửi</span>
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 space-y-3">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto" />
              <div className="font-bold text-slate-700 text-base">
                Chọn một câu hỏi ở danh sách bên trái để xem trao đổi
              </div>
              <p className="text-xs max-w-sm mx-auto">
                Hoặc nhấn nút "+ Đặt câu hỏi mới" ở góc trên để gửi thắc mắc mới về bài học tới thầy cô.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
