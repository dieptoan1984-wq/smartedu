/**
 * Smart EDU THCS - Giáo viên: Mục 7. Trò chơi học tập (TeacherGamesSection)
 * Thiết kế trò chơi củng cố kiến thức:
 * - Mẫu Ghép cặp khái niệm (Matching pairs)
 * - Mẫu Lật thẻ ghi nhớ (Flashcards)
 * - Nhập mã trò chơi HTML độc lập
 * - Xem trước & giao trò chơi cho lớp học sinh
 */

import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Gamepad2,
  Plus,
  Play,
  Eye,
  Send,
  Layers,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const TeacherGamesSection: React.FC = () => {
  const { setStudentSection } = useNavigation();

  const [activeTemplate, setActiveTemplate] = useState<'match' | 'flashcard' | 'html'>('match');
  const [gameTitle, setGameTitle] = useState('Ghép cặp: Thông tin và Vật mang tin');
  const [subjectCode, setSubjectCode] = useState('tin_hoc');
  const [grade, setGrade] = useState<number>(6);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Mẫu Ghép cặp
  const [pair1Left, setPair1Left] = useState('Dữ liệu');
  const [pair1Right, setPair1Right] = useState('Các con số, chữ viết, hình ảnh, âm thanh lưu trữ');
  const [pair2Left, setPair2Left] = useState('Vật mang tin');
  const [pair2Right, setPair2Right] = useState('Phương tiện lưu trữ như sách báo, đĩa cứng, thẻ nhớ');
  const [pair3Left, setPair3Left] = useState('Thông tin');
  const [pair3Right, setPair3Right] = useState('Ý nghĩa rút ra từ dữ liệu giúp con người hành động');

  const handleSaveGame = (publish = false) => {
    setSaveMessage(
      publish
        ? '✓ Đã công bố trò chơi tương tác cho học sinh thành công!'
        : '✓ Đã lưu bản nháp trò chơi thành công.'
    );
    setTimeout(() => setSaveMessage(null), 3500);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & nút */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 7 · Trò chơi học tập củng cố kiến thức
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Trò chơi học tập
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Sử dụng các mẫu trò chơi củng cố nhanh hoặc nhập bài HTML tương tác để học sinh rèn luyện không áp lực.
          </p>
        </div>

        <button
          onClick={() => setStudentSection('game')}
          className="px-4 py-2 bg-purple-50 text-purple-900 hover:bg-purple-100 border border-purple-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
        >
          <Play className="w-4 h-4" />
          <span>Thử nghiệm giao diện học sinh</span>
        </button>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* CHỌN MẪU TRÒ CHƠI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setActiveTemplate('match')}
          className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            activeTemplate === 'match'
              ? 'bg-blue-50/70 border-blue-400 ring-2 ring-blue-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-blue-300'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-blue-900 uppercase">Mẫu 1</span>
            <h3 className="font-bold text-base text-slate-900">Ghép cặp khái niệm</h3>
            <p className="text-xs text-slate-600 mt-1">
              Học sinh chạm chọn cột trái và ghép tương ứng với định nghĩa ở cột phải.
            </p>
          </div>
          <span className="text-xs text-[#1A56DB] font-bold mt-4 inline-block">Đang chọn mẫu này →</span>
        </div>

        <div
          onClick={() => setActiveTemplate('flashcard')}
          className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            activeTemplate === 'flashcard'
              ? 'bg-purple-50/70 border-purple-400 ring-2 ring-purple-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-purple-300'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-purple-900 uppercase">Mẫu 2</span>
            <h3 className="font-bold text-base text-slate-900">Lật thẻ ghi nhớ (Flashcards)</h3>
            <p className="text-xs text-slate-600 mt-1">
              Thẻ lật 2 mặt giúp học sinh tự ghi nhớ thuật ngữ, định lý, công thức.
            </p>
          </div>
          <span className="text-xs text-purple-700 font-bold mt-4 inline-block">Chọn mẫu này →</span>
        </div>

        <div
          onClick={() => setActiveTemplate('html')}
          className={`p-5 rounded-2xl border transition cursor-pointer flex flex-col justify-between ${
            activeTemplate === 'html'
              ? 'bg-emerald-50/70 border-emerald-400 ring-2 ring-emerald-400 shadow-xs'
              : 'bg-white border-slate-200 hover:border-emerald-300'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-emerald-900 uppercase">Mẫu 3</span>
            <h3 className="font-bold text-base text-slate-900">Trò chơi HTML tùy biến</h3>
            <p className="text-xs text-slate-600 mt-1">
              Nhập mã HTML/JS độc lập dành riêng cho các trò chơi kéo thả phức tạp.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-bold mt-4 inline-block">Chọn mẫu này →</span>
        </div>
      </div>

      {/* FORM THIẾT LẬP DỮ LIỆU TRÒ CHƠI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-base text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <span>Biên soạn nội dung: {activeTemplate === 'match' ? 'Ghép cặp khái niệm' : activeTemplate === 'flashcard' ? 'Lật thẻ ghi nhớ' : 'Trò chơi HTML'}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Tên trò chơi:</label>
            <input
              type="text"
              value={gameTitle}
              onChange={e => setGameTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Môn học:</label>
            <select
              value={subjectCode}
              onChange={e => setSubjectCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            >
              {THCS_SUBJECTS.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Khối lớp:</label>
            <select
              value={grade}
              onChange={e => setGrade(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            >
              {[6, 7, 8, 9].map(g => (
                <option key={g} value={g}>Lớp {g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Thiết lập cặp dữ liệu */}
        {activeTemplate === 'match' && (
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <div className="text-xs font-bold text-slate-800 uppercase">
              Thiết lập các cặp khái niệm (Tự động xáo trộn khi học sinh chơi):
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-blue-900 mb-1">Cặp 1 - Khái niệm (Trái):</label>
                <input
                  type="text"
                  value={pair1Left}
                  onChange={e => setPair1Left(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-1">Cặp 1 - Ý nghĩa / Định nghĩa (Phải):</label>
                <input
                  type="text"
                  value={pair1Right}
                  onChange={e => setPair1Right(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-1">Cặp 2 - Khái niệm (Trái):</label>
                <input
                  type="text"
                  value={pair2Left}
                  onChange={e => setPair2Left(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-1">Cặp 2 - Ý nghĩa / Định nghĩa (Phải):</label>
                <input
                  type="text"
                  value={pair2Right}
                  onChange={e => setPair2Right(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-blue-900 mb-1">Cặp 3 - Khái niệm (Trái):</label>
                <input
                  type="text"
                  value={pair3Left}
                  onChange={e => setPair3Left(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block font-bold text-blue-900 mb-1">Cặp 3 - Ý nghĩa / Định nghĩa (Phải):</label>
                <input
                  type="text"
                  value={pair3Right}
                  onChange={e => setPair3Right(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs">
          <span className="text-slate-500 italic">
            * Điểm trò chơi được tách riêng để học sinh luyện tập, không tính vào sổ điểm chính khóa.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveGame(false)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl font-bold hover:bg-slate-50"
            >
              Lưu bản nháp
            </button>
            <button
              onClick={() => handleSaveGame(true)}
              className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl font-bold hover:bg-blue-700 shadow-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Công bố trò chơi</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
