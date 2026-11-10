/**
 * UI Boards View - Bộ 13 bảng ảnh thiết kế giao diện
 * Làm rõ: 13 bảng là 13 bảng ảnh giao diện, dùng bản sửa cuối của Bảng 05 và Bảng 07
 */

import React from 'react';
import { UI_BOARDS, SMART_EDU_78_FUNCTIONS, FunctionItem } from '../../types/smartEduData';
import { useNavigation } from '../../contexts/NavigationContext';

export const UIBoardsView: React.FC = () => {
  const { navigateToFunction } = useNavigation();

  return (
    <div className="space-y-6">
      {/* Giới thiệu 13 bảng ảnh */}
      <div className="bg-white border border-slate-200 p-6 rounded">
        <div className="text-xs font-semibold text-blue-900 mb-1 uppercase">
          Tài liệu thiết kế giao diện (UI Mockups)
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Bộ 13 Bảng Ảnh Thiết Kế Giao Diện
        </h1>
        <p className="text-slate-600 text-sm max-w-4xl leading-relaxed">
          Bộ ảnh 13 bảng là cơ sở tham chiếu bố cục giao diện cho toàn bộ 78 chức năng.
          Đặc biệt, <strong>Bảng 05</strong> (GV04–GV09) và <strong>Bảng 07</strong> (KT01–KT06)
          sử dụng bản sửa cuối theo yêu cầu đã duyệt.
        </p>
      </div>

      {/* Grid 13 bảng ảnh */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {UI_BOARDS.map(b => {
          const matchingFns = SMART_EDU_78_FUNCTIONS.filter((f: FunctionItem) => f.board === b.boardNumber);

          return (
            <div
              key={b.boardNumber}
              className="bg-white border border-slate-200 p-5 rounded space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  Bảng {b.boardNumber}
                </span>
                {b.notes && (
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {b.notes}
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">{b.name}</h3>
                <div className="text-xs text-blue-800 font-mono mt-0.5 font-semibold">
                  Phạm vi chức năng: {b.functionRange}
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {b.description}
              </p>

              {/* Danh sách nút các chức năng thuộc bảng */}
              <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                {matchingFns.map((fn: FunctionItem) => (
                  <button
                    key={fn.code}
                    onClick={() => navigateToFunction(fn)}
                    className="px-2 py-1 text-xs rounded bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-900 border border-slate-200 hover:border-blue-300 font-mono transition-colors"
                  >
                    {fn.code}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
