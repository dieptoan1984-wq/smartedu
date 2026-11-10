/**
 * Demo Roles View - Khu vực thử nghiệm giao diện theo vai trò (Demo UI)
 * Tuân thủ nghiêm ngặt yêu cầu:
 * - Nút "Đổi vai trò" chỉ được dùng trong khu vực demo có nhãn rõ ràng
 * - Khu vực sử dụng thật chỉ hiển thị vai trò do tài khoản cấp, không tự nâng quyền
 * - Không giả mạo kết quả thực thi máy chủ
 */

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { SMART_EDU_ROLES, UserRole } from '../../types/smartEduData';

export const DemoRolesView: React.FC = () => {
  const { authMode, currentRole, enterDemoRole, exitDemoMode, loading } = useAuth();
  const { setActiveTab } = useNavigation();

  return (
    <div className="space-y-6">
      {/* 1. Dải băng cảnh báo bắt buộc */}
      <div className="p-4 bg-amber-50 border-2 border-amber-400 rounded text-xs text-amber-900 shadow-sm space-y-1">
        <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
          <span className="bg-amber-400 text-amber-950 px-2 py-0.5 rounded uppercase font-black text-[11px]">
            CẢNH BÁO DEMO
          </span>
          <span>KHU VỰC THỬ NGHIỆM GIAO DIỆN (DEMO) · CHỈ PHỤC VỤ THẨM ĐỊNH BỐ CỤC UI</span>
        </div>
        <p className="leading-relaxed">
          Khu vực này được cung cấp riêng biệt để các bên liên quan (Chuyên gia, Tổ trưởng chuyên môn, Thẩm định viên)
          có thể xem xét cách sắp xếp bố cục của 13 bảng giao diện từ 5 góc nhìn vai trò sư phạm khác nhau.
          <strong> Thao tác chọn vai trò ở đây KHÔNG cấp quyền thực thi trên máy chủ CSDL Supabase</strong> và không thay thế tài khoản thật.
        </p>
      </div>

      {/* 2. Tiêu đề và nút thoát Demo */}
      <div className="bg-white border border-slate-200 p-6 rounded shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-blue-900 uppercase mb-1">
            5 Vai Trò Sư Phạm Chuẩn THCS (001_nen_tang.sql)
          </div>
          <h1 className="text-2xl font-bold text-slate-900">
            Chuyển Đổi Góc Nhìn Kiểm Thử Bố Cục
          </h1>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Chọn một vai trò dưới đây để xem cách hệ thống hiển thị bảng điều khiển, menu và quyền truy cập đặc tả.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {authMode === 'demo' && (
            <button
              onClick={exitDemoMode}
              className="px-4 py-2 bg-slate-100 text-rose-700 border border-slate-300 font-semibold text-xs rounded hover:bg-rose-50"
            >
              Thoát Chế Độ Demo
            </button>
          )}
          <button
            onClick={() => setActiveTab('login')}
            className="px-4 py-2 bg-blue-800 text-white font-semibold text-xs rounded hover:bg-blue-900"
          >
            Quay Về Xác Thực Thật →
          </button>
        </div>
      </div>

      {/* 3. Danh sách 5 vai trò theo CSDL nền */}
      <div className="space-y-3">
        {SMART_EDU_ROLES.map((roleInfo) => {
          const isCurrent = authMode === 'demo' && currentRole === roleInfo.code;
          return (
            <div
              key={roleInfo.code}
              className={`p-4 rounded border transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                isCurrent
                  ? 'bg-amber-50/60 border-amber-300 ring-1 ring-amber-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-slate-900">{roleInfo.name}</span>
                  <span className="font-mono text-xs font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    Mã DB: {roleInfo.code}
                  </span>
                  {isCurrent && (
                    <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded border border-amber-300">
                      Đang xem giao diện này
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-700 leading-relaxed">
                  {roleInfo.description}
                </div>

                <div className="text-xs text-slate-500 pt-1 flex flex-wrap gap-4">
                  <span><strong>Phạm vi truy cập:</strong> {roleInfo.scope}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-3">
                <button
                  onClick={() => enterDemoRole(roleInfo.code as UserRole)}
                  disabled={loading}
                  className={`px-4 py-2 text-xs font-semibold rounded whitespace-nowrap transition-colors ${
                    isCurrent
                      ? 'bg-amber-800 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                  }`}
                >
                  {isCurrent ? '✓ Đang kích hoạt' : `Kích hoạt Demo: ${roleInfo.name}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Ghi chú quy chuẩn kiến trúc */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 leading-relaxed space-y-1">
        <div className="font-bold text-slate-800">Cơ chế quản lý vai trò trong CSDL Smart EDU:</div>
        <ul className="list-disc list-inside space-y-1 text-slate-600">
          <li>
            Mỗi người dùng khi đăng ký qua trigger <code className="font-mono text-blue-900">smart_edu_signup</code>
            tự động nhận một bản ghi trong bảng <code className="font-mono text-blue-900">private.user_roles</code> với vai trò <code className="font-mono font-bold">student</code>.
          </li>
          <li>
            Vai trò <code className="font-mono">teacher</code>, <code className="font-mono">reviewer</code>, <code className="font-mono">admin</code>, <code className="font-mono">researcher</code>
            chỉ được cấp bởi Quản trị viên hệ thống qua lệnh INSERT có kiểm soát hoặc xác thực trường học.
          </li>
          <li>
            Hàm <code className="font-mono text-blue-900">public.current_access()</code> có thuộc tính <code className="font-mono">security definer</code> sẽ truy vấn các vai trò thực từ schema <code className="font-mono">private</code> để trả về cho máy khách.
          </li>
        </ul>
      </div>
    </div>
  );
};
