/**
 * Function Detail View - Trang riêng cho từng chức năng trong 78 mã
 * Tuân thủ yêu cầu:
 * 1. Mỗi chức năng có trang riêng
 * 2. Hiển thị đầy đủ Đầu vào, Xử lí, Đầu ra, Điều kiện chấp nhận theo đặc tả 1.0
 * 3. Ghi rõ "Chưa triển khai" và vô hiệu hóa nút; không tạo kết quả thành công giả.
 */

import React, { useState } from 'react';
import { FunctionItem } from '../../types/smartEduData';
import { useNavigation } from '../../contexts/NavigationContext';
import { apiClient } from '../../services/apiClient';

interface Props {
  fn: FunctionItem;
}

export const FunctionDetailView: React.FC<Props> = ({ fn }) => {
  const { setActiveTab } = useNavigation();
  const [testResult, setTestResult] = useState<{ loading: boolean; message: string | null; isError: boolean }>({
    loading: false,
    message: null,
    isError: false
  });

  const handleTestInvoke = async () => {
    setTestResult({ loading: true, message: null, isError: false });
    try {
      const res = await apiClient.invokePrivilegedFunction(fn.code);
      setTestResult({
        loading: false,
        message: res.message,
        isError: !res.success
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối máy chủ';
      setTestResult({
        loading: false,
        message: msg,
        isError: true
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Nút quay lại danh mục */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setActiveTab('catalog')}
          className="text-sm font-semibold text-blue-900 hover:text-blue-700 flex items-center gap-1.5"
        >
          ← Quay lại Danh mục 78 chức năng
        </button>
        <span className="text-xs text-slate-500 font-mono">
          Mã chức năng: <strong>{fn.code}</strong> · Bảng giao diện: <strong>Bảng {fn.board}</strong>
        </span>
      </div>

      {/* Tiêu đề & Thông tin cơ bản */}
      <div className="bg-white border border-slate-200 p-6 rounded">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {fn.code}
              </span>
              <span className="text-xs text-slate-500">
                Nhóm {fn.groupName} ({fn.groupRange})
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {fn.title}
            </h1>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-xs font-bold text-rose-700 block">
              Trạng thái: Chưa triển khai
            </span>
            <span className="text-xs text-slate-500">
              (Đã vô hiệu hóa thao tác)
            </span>
          </div>
        </div>

        {/* Cảnh báo tính minh bạch */}
        <div className="mt-4 p-3.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-700 leading-relaxed">
          <strong>Thông báo tiến độ:</strong> Bước hiện tại tập trung sửa khung, menu, danh mục và màn hình đăng nhập.
          Chức năng <strong>{fn.code}</strong> chưa có trong bước này. Hệ thống tuân thủ nguyên tắc không tạo kết quả thành công giả,
          không tự nhận đã nghiệm thu hay tuyên bố tính năng hoàn tất.
        </div>
      </div>

      {/* Chi tiết 4 phần đặc tả nghiệp vụ: Đầu vào, Xử lí, Đầu ra, Điều kiện chấp nhận */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. Đầu vào */}
        <div className="bg-white border border-slate-200 p-5 rounded space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase">
            1. Dữ liệu đầu vào
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {fn.dauVao || 'Theo cấu hình người dùng và bối cảnh lớp/môn THCS.'}
          </p>
        </div>

        {/* 2. Xử lí */}
        <div className="bg-white border border-slate-200 p-5 rounded space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase">
            2. Quy trình xử lí
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {fn.xuLi || 'Thao tác xử lí nghiệp vụ tuân thủ quy tắc sư phạm THCS.'}
          </p>
        </div>

        {/* 3. Đầu ra */}
        <div className="bg-white border border-slate-200 p-5 rounded space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase">
            3. Kết quả đầu ra
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {fn.dauRa || 'Dữ liệu hiển thị hoặc tệp hồ sơ xuất tương ứng.'}
          </p>
        </div>

        {/* 4. Điều kiện chấp nhận */}
        <div className="bg-white border border-slate-200 p-5 rounded space-y-2">
          <div className="text-xs font-bold text-blue-900 uppercase">
            4. Điều kiện chấp nhận
          </div>
          <p className="text-sm text-slate-800 leading-relaxed">
            {fn.chapNhan || 'Kiểm tra bảo mật, phân quyền và tính toàn vẹn dữ liệu.'}
          </p>
        </div>
      </div>

      {/* Vùng thử nghiệm kiểm tra trạng thái máy chủ */}
      <div className="bg-white border border-slate-200 p-6 rounded space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Khu Vực Thao Tác Nghiệp Vụ
        </h2>
        <p className="text-xs text-slate-600">
          Theo quy định bản sửa, nút thực thi tính năng đang được vô hiệu hóa. Bạn có thể nhấn nút kiểm tra
          để xem phản hồi từ chối chính xác từ máy chủ backend (mã phản hồi xác thực trạng thái Chưa triển khai).
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            disabled
            className="px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-400 rounded border border-slate-200 cursor-not-allowed"
            title="Chức năng chưa triển khai theo đặc tả 1.0"
          >
            Thực hiện {fn.code} (Vô hiệu hóa)
          </button>

          <button
            onClick={handleTestInvoke}
            disabled={testResult.loading}
            className="px-4 py-2 text-sm font-semibold bg-blue-800 text-white rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
          >
            {testResult.loading ? 'Đang gửi...' : 'Kiểm tra phản hồi Backend Server'}
          </button>
        </div>

        {testResult.message && (
          <div className="p-3.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-900">
            <strong>Phản hồi từ Server:</strong> {testResult.message}
          </div>
        )}
      </div>
    </div>
  );
};
