/**
 * Section 5: Trò chơi học tập (Educational Games)
 * Bố cục:
 * 1. Bộ lọc: Khối lớp, Môn học, Loại trò chơi (Trắc nghiệm nhanh, Ghép cặp, Sắp xếp, Phân loại, Lật thẻ)
 * 2. Danh mục trò chơi với mục tiêu, hướng dẫn rõ ràng
 * 3. Khung chơi tương tác trực tiếp: Phản hồi tức thì, kết quả củng cố kiến thức
 * 4. Quy tắc: Không lấy điểm trò chơi làm điểm kiểm tra chính thức, không bảng xếp hạng giả
 */

import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import { useAuth } from '../../../contexts/AuthContext';
import { studentDataService } from '../../../services/studentDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Gamepad2,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Sparkles,
  Layers,
  ArrowRight,
  Shuffle
} from 'lucide-react';

type GameType = 'speed_quiz' | 'matching' | 'flashcards' | 'sorting';

interface GameItem {
  id: string;
  title: string;
  type: GameType;
  typeName: string;
  grade: number;
  subjectCode: string;
  description: string;
  instructions: string;
  timeLimitSeconds?: number;
}

export const GameSection: React.FC = () => {
  const { selectedGrade, setSelectedGrade, selectedSubjectCode, setSelectedSubjectCode } = useNavigation();
  const { userId } = useAuth();
  const currentGradeNum = typeof selectedGrade === 'number' ? selectedGrade : 6;

  const [selectedGameType, setSelectedGameType] = useState<GameType | 'ALL'>('ALL');
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);

  // Danh mục trò chơi học tập chuẩn duyệt
  const games: GameItem[] = [
    {
      id: 'game_th6_match',
      title: 'Ghép cặp: Thông tin và Vật mang tin',
      type: 'matching',
      typeName: 'Ghép cặp khái niệm',
      grade: 6,
      subjectCode: 'tin_hoc',
      description: 'Nối các khái niệm với hình ảnh minh họa tương ứng trong đời sống.',
      instructions: 'Nhấp chọn một thẻ ở cột A rồi nhấp thẻ tương ứng ở cột B để tạo thành cặp đúng.'
    },
    {
      id: 'game_th6_flash',
      title: 'Lật thẻ ghi nhớ: Thuật ngữ Tin học 6',
      type: 'flashcards',
      typeName: 'Lật thẻ kiến thức',
      grade: 6,
      subjectCode: 'tin_hoc',
      description: 'Lật các thẻ bài để ghi nhớ định nghĩa Dữ liệu, Thông tin, Vật mang tin.',
      instructions: 'Nhấp vào từng thẻ để lật mặt sau xem giải nghĩa và kiểm tra trí nhớ.'
    },
    {
      id: 'game_toan6_speed',
      title: 'Thử thách nhanh: Rút gọn phân số',
      type: 'speed_quiz',
      typeName: 'Trắc nghiệm nhanh',
      grade: 6,
      subjectCode: 'toan',
      description: 'Tìm phân số tối giản tương ứng trong thời gian 30 giây.',
      instructions: 'Quan sát phân số trên màn hình và chọn đáp án rút gọn chính xác nhất.',
      timeLimitSeconds: 30
    }
  ];

  // Lọc trò chơi
  const filteredGames = games.filter(g => {
    const matchGrade = g.grade === currentGradeNum;
    const matchSubj = g.subjectCode === selectedSubjectCode;
    const matchType = selectedGameType === 'ALL' || g.type === selectedGameType;
    return matchGrade && matchSubj && matchType;
  });

  // Trạng thái chơi trò Ghép cặp (Matching)
  const [matchPairs] = useState([
    { id: '1', left: 'Tờ báo in buổi sáng', right: 'Vật mang tin (chứa chữ và ảnh)' },
    { id: '2', left: 'Dòng số 38.5 trên nhiệt kế', right: 'Dữ liệu đo được' },
    { id: '3', left: 'Biết mình bị sốt để uống thuốc', right: 'Thông tin có ý nghĩa hành động' }
  ]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  const [matchError, setMatchError] = useState<boolean>(false);

  // Xử lí ghép cặp
  const handleSelectLeft = (id: string) => {
    if (matchedIds.includes(id)) return;
    setSelectedLeft(id);
    setMatchError(false);
  };

  const handleSelectRight = (id: string) => {
    if (!selectedLeft) return;
    if (selectedLeft === id) {
      const nextMatched = [...matchedIds, id];
      setMatchedIds(nextMatched);
      setSelectedLeft(null);
      setMatchError(false);
      if (nextMatched.length === matchPairs.length) {
        // Ghi nhận hoàn thành trò chơi
        studentDataService.logActivity(userId, {
          type: 'game',
          title: 'Hoàn thành trò chơi: Ghép cặp Thông tin và Vật mang tin',
          subjectCode: selectedSubjectCode,
          grade: currentGradeNum,
          details: 'Ghép đúng 3/3 cặp khái niệm'
        });
      }
    } else {
      setMatchError(true);
      setTimeout(() => setMatchError(false), 1500);
    }
  };

  const handleResetMatchGame = () => {
    setSelectedLeft(null);
    setMatchedIds([]);
    setMatchError(false);
  };

  return (
    <div className="space-y-6">
      {/* 1. THANH TIÊU ĐỀ & BỘ LỌC TRÒ CHƠI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-600" />
              <span>Trò chơi học tập củng cố kiến thức</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Học mà chơi, chơi mà học qua các hoạt động ngắn giúp ghi nhớ khái niệm lâu hơn.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-purple-50 border border-purple-200 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>Điểm trò chơi dùng để củng cố, không tính vào sổ điểm chính thức</span>
          </div>
        </div>

        {/* 3 Bộ lọc: Khối, Môn, Loại trò chơi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="font-bold text-slate-700 block mb-1">Khối lớp:</label>
            <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200">
              {[6, 7, 8, 9].map((g) => (
                <button
                  key={g}
                  onClick={() => {
                    setSelectedGrade(g as 6 | 7 | 8 | 9);
                    setActiveGame(null);
                  }}
                  className={`flex-1 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    currentGradeNum === g
                      ? 'bg-purple-700 text-white font-bold shadow-2xs'
                      : 'text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Lớp {g}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Môn học:</label>
            <select
              value={selectedSubjectCode}
              onChange={(e) => {
                setSelectedSubjectCode(e.target.value);
                setActiveGame(null);
              }}
              aria-label="Chọn môn học cho trò chơi"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
            >
              {THCS_SUBJECTS.map((s) => (
                <option key={s.code} value={s.code}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Loại trò chơi:</label>
            <select
              value={selectedGameType}
              onChange={(e) => setSelectedGameType(e.target.value as any)}
              aria-label="Chọn thể loại trò chơi"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 font-semibold text-slate-800 cursor-pointer"
            >
              <option value="ALL">Tất cả các thể loại</option>
              <option value="matching">Ghép cặp khái niệm</option>
              <option value="flashcards">Lật thẻ kiến thức</option>
              <option value="speed_quiz">Trắc nghiệm nhanh</option>
              <option value="sorting">Sắp xếp trình tự</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. KHUNG TRÒ CHƠI ĐANG CHƠI HOẶC DANH SÁCH */}
      {activeGame ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-purple-800 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                {activeGame.typeName}
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">{activeGame.title}</h3>
              <p className="text-xs text-slate-500">{activeGame.instructions}</p>
            </div>

            <button
              onClick={() => setActiveGame(null)}
              className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
            >
              Đổi trò chơi khác
            </button>
          </div>

          {/* Trò chơi Ghép cặp */}
          {activeGame.type === 'matching' && (
            <div className="space-y-6 max-w-2xl mx-auto py-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">
                  Tiến độ: {matchedIds.length} / {matchPairs.length} cặp đúng
                </span>
                <button
                  onClick={handleResetMatchGame}
                  className="text-purple-700 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Chơi lại</span>
                </button>
              </div>

              {matchError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 text-center font-bold">
                  Chưa chính xác! Hai thẻ này không tương ứng với nhau. Hãy thử lại nhé!
                </div>
              )}

              {matchedIds.length === matchPairs.length && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <div className="text-2xl">🎉</div>
                  <h4 className="font-bold text-emerald-900 text-base">Xuất sắc! Em đã ghép đúng toàn bộ các cặp!</h4>
                  <p className="text-xs text-emerald-800">
                    Em đã nắm rất vững sự khác nhau giữa Vật mang tin, Dữ liệu và Thông tin trong đời sống.
                  </p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Cột A: Tình huống / Ví dụ */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-700 text-center pb-1">Cột A: Tình huống</div>
                  {matchPairs.map((pair) => {
                    const isMatched = matchedIds.includes(pair.id);
                    const isSelected = selectedLeft === pair.id;
                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched}
                        onClick={() => handleSelectLeft(pair.id)}
                        className={`w-full p-3.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-60'
                            : isSelected
                            ? 'bg-purple-100 border-purple-500 text-purple-950 font-bold ring-2 ring-purple-200'
                            : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800'
                        }`}
                      >
                        {pair.left}
                        {isMatched && <span className="float-right text-emerald-700">✓</span>}
                      </button>
                    );
                  })}
                </div>

                {/* Cột B: Khái niệm tương ứng */}
                <div className="space-y-2">
                  <div className="font-bold text-slate-700 text-center pb-1">Cột B: Khái niệm</div>
                  {matchPairs.map((pair) => {
                    const isMatched = matchedIds.includes(pair.id);
                    return (
                      <button
                        key={pair.id}
                        disabled={isMatched}
                        onClick={() => handleSelectRight(pair.id)}
                        className={`w-full p-3.5 rounded-xl border text-left font-semibold transition cursor-pointer ${
                          isMatched
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 opacity-60'
                            : 'bg-white border-slate-200 hover:border-purple-300 text-slate-800'
                        }`}
                      >
                        {pair.right}
                        {isMatched && <span className="float-right text-emerald-700">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Trò chơi Flashcards */}
          {activeGame.type === 'flashcards' && (
            <div className="max-w-md mx-auto text-center space-y-4 py-4">
              <div className="p-8 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-200 rounded-2xl shadow-sm space-y-3 cursor-pointer hover:border-purple-400 transition">
                <span className="text-xs font-bold text-purple-800 uppercase">Khái niệm trọng tâm</span>
                <div className="text-2xl font-bold text-slate-900">Vật mang tin</div>
                <div className="pt-2 border-t border-purple-100 text-xs text-slate-600 leading-relaxed">
                  Là phương tiện dùng để lưu trữ và truyền đạt thông tin (ví dụ: tờ giấy, bảng tin, thẻ nhớ, đĩa CD...).
                </div>
              </div>
              <p className="text-xs text-slate-400">Nhấp vào thẻ để lật kiểm tra kiến thức tiếp theo</p>
            </div>
          )}
        </div>
      ) : (
        /* Danh sách trò chơi khả dụng */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {filteredGames.length > 0 ? (
            filteredGames.map((game) => (
              <div
                key={game.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-2xs hover:border-purple-300 transition flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-purple-900 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded">
                      {game.typeName}
                    </span>
                    <span className="text-slate-400">Lớp {game.grade}</span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {game.title}
                  </h3>

                  <p className="text-slate-600 leading-relaxed">
                    {game.description}
                  </p>
                </div>

                <button
                  onClick={() => setActiveGame(game)}
                  className="w-full py-2 bg-purple-700 text-white rounded-xl text-xs font-bold hover:bg-purple-800 transition flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Bắt đầu chơi</span>
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-500 text-xs space-y-1">
              <div>Chưa có trò chơi học tập nào cho môn này tại Lớp {currentGradeNum}.</div>
              <div className="text-slate-400 text-[11px]">Vui lòng chọn môn Tin học 6 hoặc Toán 6 để trải nghiệm các trò chơi mẫu đã chuẩn hóa.</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
