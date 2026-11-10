/**
 * UnimplementedModal - Thông báo chức năng đang hoàn thiện
 * Tuân thủ quy định:
 * - Các chức năng chưa làm ghi rõ "Chức năng đang được hoàn thiện"
 * - Tuyệt đối không tạo kết quả thành công giả (không giả lưu, giả nộp bài, giả chấm điểm)
 */

import React from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { AlertCircle, X } from 'lucide-react';

export const UnimplementedModal: React.FC = () => {
  const { unimplementedFeature, setUnimplementedFeature } = useNavigation();

  if (!unimplementedFeature) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 font-serif">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Chức năng đang được hoàn thiện
              </h3>
              <span className="text-xs text-blue-900 font-semibold bg-blue-50 px-2 py-0.5 rounded">
                Bản đặc tả 1.0 · Cấp THCS
              </span>
            </div>
          </div>
          <button
            onClick={() => setUnimplementedFeature(null)}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-sm text-slate-600 leading-relaxed space-y-2">
          <div>
            Nghiệp vụ: <strong className="text-slate-900">{unimplementedFeature}</strong>
          </div>
          <p className="text-xs text-slate-500">
            Hệ thống Smart EDU bảo toàn quy tắc kiến trúc: chức năng chưa kết nối backend sẽ không tạo kết quả thành công giả hoặc dữ liệu tạm không có nguồn.
          </p>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => setUnimplementedFeature(null)}
            className="px-4 py-2 bg-[#1A56DB] text-white text-xs font-semibold rounded-xl hover:bg-blue-700 transition"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
