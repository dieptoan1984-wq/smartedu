/**
 * HtmlLessonViewer Component - Smart EDU THCS
 * Thành phần nhúng bài học HTML qua iframe an toàn:
 * - sandbox="allow-scripts allow-modals"
 * - Không ghép allow-scripts với allow-same-origin
 * - Không truyền token, API key hoặc session Supabase vào bài HTML
 * - Có chế độ "Mở rộng bài học" (ẩn sidebar, full width) và "Thu gọn"
 * - Nút "Ôn bài này" và "Hỏi giáo viên" liên kết trực tiếp
 */

import React, { useState } from 'react';
import {
  Maximize2,
  Minimize2,
  BookOpen,
  MessageCircle,
  FileEdit,
  Save,
  CheckCircle,
  ShieldCheck
} from 'lucide-react';

interface HtmlLessonViewerProps {
  htmlContent: string;
  title: string;
  subjectName: string;
  grade: number;
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  onReviewLesson: () => void;
  onAskTeacher: () => void;
}

export const HtmlLessonViewer: React.FC<HtmlLessonViewerProps> = ({
  htmlContent,
  title,
  subjectName,
  grade,
  isExpanded,
  setIsExpanded,
  onReviewLesson,
  onAskTeacher
}) => {
  const [showNotes, setShowNotes] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [noteStatus, setNoteStatus] = useState<string | null>(null);

  const handleSaveNotes = () => {
    if (!personalNotes.trim()) {
      setNoteStatus('Vui lòng nhập nội dung ghi chú.');
      setTimeout(() => setNoteStatus(null), 3000);
      return;
    }
    try {
      localStorage.setItem(`smart_edu_lesson_notes_${title}`, personalNotes);
      setNoteStatus('✓ Đã lưu ghi chú cá nhân thành công trên thiết bị này.');
      setTimeout(() => setNoteStatus(null), 3500);
    } catch {
      setNoteStatus('Không thể lưu ghi chú vào bộ nhớ trình duyệt.');
    }
  };

  return (
    <div className={`bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col transition-all ${
      isExpanded ? 'fixed inset-2 z-50 shadow-2xl' : 'w-full'
    }`}>
      {/* THANH ĐIỀU KHIỂN BÀI HỌC */}
      <div className="bg-slate-100/90 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" title="Bài học HTML sẵn sàng" />
          <div className="truncate">
            <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded mr-2">
              Lớp {grade} • {subjectName}
            </span>
            <span className="text-sm font-bold text-slate-800">{title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Nút Ghi chép cá nhân */}
          <button
            onClick={() => setShowNotes(!showNotes)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center gap-1.5 cursor-pointer ${
              showNotes
                ? 'bg-blue-800 text-white border-blue-900'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
            title="Mở sổ ghi chép nhanh cho bài học này"
          >
            <FileEdit className="w-3.5 h-3.5" />
            <span>Ghi chép</span>
          </button>

          {/* Nút Ôn bài này */}
          <button
            onClick={onReviewLesson}
            className="px-3 py-1.5 bg-white text-blue-900 hover:bg-blue-50 border border-blue-200 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Chuyển sang bộ câu hỏi ôn tập của bài này"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#1A56DB]" />
            <span>Ôn bài này</span>
          </button>

          {/* Nút Hỏi giáo viên */}
          <button
            onClick={onAskTeacher}
            className="px-3 py-1.5 bg-white text-slate-700 hover:bg-blue-50 hover:text-blue-900 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title="Đặt câu hỏi cho giáo viên về bài này"
          >
            <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
            <span>Hỏi giáo viên</span>
          </button>

          {/* Nút Mở rộng / Thu gọn */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 bg-[#1A56DB] text-white hover:bg-blue-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
            title={isExpanded ? 'Thu gọn bài học về chế độ xem thông thường' : 'Mở rộng bài học toàn màn hình'}
          >
            {isExpanded ? (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Thu gọn</span>
              </>
            ) : (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Mở rộng</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* KHUNG GHI CHÉP NHANH (NẾU MỞ) */}
      {showNotes && (
        <div className="bg-amber-50/60 border-b border-amber-200 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <span>✏️</span>
              <span>Ghi chép và ghi nhớ của em (Bài: {title})</span>
            </span>
            {noteStatus && (
              <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                {noteStatus}
              </span>
            )}
          </div>
          <textarea
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
            rows={2}
            placeholder="Ghi lại các định nghĩa quan trọng, công thức hoặc lưu ý của em khi học bài này..."
            className="w-full bg-white border border-amber-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
          <div className="flex justify-between items-center text-[11px] text-slate-500">
            <span>Dữ liệu lưu an toàn trên thiết bị này theo tài khoản của em.</span>
            <button
              onClick={handleSaveNotes}
              className="px-3 py-1 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition flex items-center gap-1 shadow-2xs cursor-pointer"
            >
              <Save className="w-3 h-3" />
              <span>Lưu ghi chép</span>
            </button>
          </div>
        </div>
      )}

      {/* KHUNG IFRAME AN TOÀN */}
      <div className="relative flex-1 w-full bg-slate-50 min-h-[580px]">
        <iframe
          srcDoc={htmlContent}
          title={`Bài học tương tác: ${title}`}
          sandbox="allow-scripts allow-modals"
          className="w-full h-full min-h-[580px] border-0"
          loading="lazy"
        />
      </div>

      {/* DÒNG AN TOÀN & BẢN QUYỀN CHÂN BÀI HỌC */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1.5 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Môi trường nhúng an toàn chuẩn Smart EDU Sandbox (Không truyền token/API key)</span>
        </div>
        <div className="italic">Nội dung học liệu số chuẩn THCS • Bộ sách Kết nối tri thức với cuộc sống</div>
      </div>
    </div>
  );
};
