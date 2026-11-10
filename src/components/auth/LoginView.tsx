/**
 * Smart EDU THCS - Màn hình Xác thực & Đăng nhập (LoginView)
 * Tuân thủ yêu cầu:
 * 1. Dùng VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY; hiện lỗi rõ nếu thiếu hoặc sai; không dùng đăng nhập giả.
 * 2. Đăng ký, Đăng nhập, Đăng xuất, Quên mật khẩu qua Supabase Auth; xử lý email và phiên.
 * 3. Sau đăng nhập, gọi RPC current_access() không tham số để lấy quyền thực của tài khoản.
 *    Không lấy quyền từ user_metadata hay chọn giao diện.
 *    Không cho người đăng ký tự chọn admin/teacher/reviewer.
 * 4. Nút "Đổi vai trò" chỉ ở khu vực demo có nhãn rõ.
 * 5. Kiểm tra đọc danh mục subjects thật từ Supabase sau đăng nhập.
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import {
  setCustomSupabaseConfig,
  clearCustomSupabaseConfig
} from '../../config/supabase';

type AuthFormTab = 'signin' | 'signup' | 'forgot' | 'config';

export const LoginView: React.FC = () => {
  const {
    isAuthenticated,
    authMode,
    email,
    displayName,
    userId,
    roles,
    primaryRole,
    rpcAccess,
    subjectsTest,
    testSubjectsQuery,
    curriculaTest,
    testCurriculaQuery,
    loginSupabase,
    signUpSupabase,
    resetPassword,
    logout,
    configStatus,
    refreshCurrentAccess
  } = useAuth();

  const { setActiveTab } = useNavigation();

  // Tab đăng nhập / đăng ký / quên mật khẩu / cấu hình
  const [activeFormTab, setActiveFormTab] = useState<AuthFormTab>('signin');

  // Form Đăng nhập
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState<string | null>(null);
  const [isSignInSubmitting, setIsSignInSubmitting] = useState(false);

  // Form Đăng ký
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  const [signUpFullName, setSignUpFullName] = useState('');
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [signUpSuccessMessage, setSignUpSuccessMessage] = useState<string | null>(null);
  const [isSignUpSubmitting, setIsSignUpSubmitting] = useState(false);

  // Form Quên mật khẩu
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccessMessage, setForgotSuccessMessage] = useState<string | null>(null);
  const [isForgotSubmitting, setIsForgotSubmitting] = useState(false);

  // Form cấu hình bổ sung (nếu chưa có biến môi trường .env)
  const [customUrl, setCustomUrl] = useState('');
  const [customKey, setCustomKey] = useState('');
  const [configMessage, setConfigMessage] = useState<string | null>(null);

  // Xử lý đăng nhập
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError(null);
    setIsSignInSubmitting(true);

    const res = await loginSupabase(signInEmail, signInPassword);
    setIsSignInSubmitting(false);

    if (!res.success && res.error) {
      setSignInError(res.error);
    }
  };

  // Xử lý đăng ký
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError(null);
    setSignUpSuccessMessage(null);

    if (signUpPassword !== signUpConfirmPassword) {
      setSignUpError('Mật khẩu xác nhận không khớp với mật khẩu đã nhập.');
      return;
    }

    if (signUpPassword.length < 6) {
      setSignUpError('Mật khẩu phải có độ dài tối thiểu từ 6 ký tự trở lên.');
      return;
    }

    setIsSignUpSubmitting(true);
    const res = await signUpSupabase(signUpEmail, signUpPassword, signUpFullName);
    setIsSignUpSubmitting(false);

    if (res.success) {
      if (res.requiresEmailConfirmation) {
        setSignUpSuccessMessage(
          'Đăng ký thành công! Hệ thống Supabase đã gửi email xác thực tới địa chỉ của bạn. Vui lòng kiểm tra hộp thư để kích hoạt tài khoản trước khi đăng nhập.'
        );
      } else {
        setSignUpSuccessMessage(
          'Đăng ký tài khoản thành công và đã tự động đăng nhập với vai trò Học sinh (student) theo trigger cơ sở dữ liệu.'
        );
      }
      setSignUpPassword('');
      setSignUpConfirmPassword('');
    } else if (res.error) {
      setSignUpError(res.error);
    }
  };

  // Xử lý quên mật khẩu
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccessMessage(null);
    setIsForgotSubmitting(true);

    const res = await resetPassword(forgotEmail);
    setIsForgotSubmitting(false);

    if (res.success && res.message) {
      setForgotSuccessMessage(res.message);
    } else if (res.error) {
      setForgotError(res.error);
    }
  };

  // Xử lý lưu cấu hình Supabase tùy chỉnh
  const handleSaveCustomConfig = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim() || !customKey.trim()) {
      setConfigMessage('Vui lòng nhập đầy đủ cả URL dự án và Publishable Key.');
      return;
    }
    setCustomSupabaseConfig(customUrl, customKey);
    setConfigMessage('Đã lưu cấu hình kết nối. Đang tải lại phiên làm việc...');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleClearCustomConfig = () => {
    clearCustomSupabaseConfig();
    setConfigMessage('Đã khôi phục cấu hình mặc định từ biến môi trường.');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* 1. Tiêu đề trang xác thực */}
      <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
        <div className="text-xs font-bold text-blue-900 uppercase mb-1">
          Hệ Thống Xác Thực & Phân Quyền · Smart EDU THCS
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Đăng Ký & Đăng Nhập Tài Khoản Supabase Auth
        </h1>
        <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
          Xác thực danh tính thực tế thông qua máy chủ Supabase. Sau khi đăng nhập, hệ thống sẽ thực thi
          hàm RPC <code className="text-blue-900 font-mono font-semibold">public.current_access()</code> để
          truy vấn trực tiếp danh sách vai trò hợp lệ từ bảng <code className="text-blue-900 font-mono">private.user_roles</code>.
        </p>

        {/* Trạng thái biến môi trường kết nối */}
        <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-600">
          <div>
            URL Supabase: <strong className="text-slate-800">{configStatus.urlDomain}</strong>
          </div>
          <div>
            Publishable Key:{' '}
            <strong className={configStatus.hasPublishableKey ? 'text-emerald-700' : 'text-rose-700'}>
              {configStatus.hasPublishableKey ? 'Đã cấu hình' : 'Chưa thiết lập'}
            </strong>
          </div>
          <div>
            Nguồn cấu hình:{' '}
            <strong className="text-blue-900 font-mono">
              {configStatus.source === 'env'
                ? 'Biến môi trường (.env)'
                : configStatus.source === 'storage'
                ? 'Phiên duyệt trực tiếp (Local)'
                : 'Chưa có'}
            </strong>
          </div>
        </div>

        {/* Cảnh báo nếu thiếu hoặc sai cấu hình */}
        {!configStatus.isValid && (
          <div className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded text-xs text-rose-800 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="font-bold">Thiếu hoặc sai cấu hình Supabase:</div>
              <div>{configStatus.error || 'Cần có VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY hợp lệ.'}</div>
              <div className="text-[11px] text-rose-700">
                Theo quy định, hệ thống không dùng đăng nhập giả. Vui lòng thiết lập biến môi trường hoặc nhập thông tin vào tab "Cấu hình kết nối".
              </div>
            </div>
            <button
              onClick={() => setActiveFormTab('config')}
              className="px-3 py-1 bg-rose-700 text-white font-semibold rounded hover:bg-rose-800 shrink-0 text-xs"
            >
              Cấu hình ngay
            </button>
          </div>
        )}
      </div>

      {/* 2. Nếu đã đăng nhập thành công */}
      {isAuthenticated && authMode === 'real' && (
        <div className="bg-white border border-emerald-300 p-6 rounded shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-emerald-100">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  ĐÃ ĐĂNG NHẬP THÀNH CÔNG
                </span>
                <span className="text-xs text-slate-500">
                  ID: <code className="font-mono">{userId}</code>
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                Xin chào, {displayName}!
              </h2>
              <div className="text-xs text-slate-600 mt-0.5">
                Email: <span className="font-mono text-slate-800 font-semibold">{email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('student_workspace')}
                className="px-4 py-2 bg-blue-800 text-white font-semibold text-xs rounded hover:bg-blue-900 transition-colors"
              >
                Vào Không Gian Học Tập →
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 bg-slate-100 text-rose-700 border border-slate-300 font-semibold text-xs rounded hover:bg-rose-50 transition-colors"
              >
                Đăng Xuất
              </button>
            </div>
          </div>

          {/* Chi tiết phân quyền thực nhận từ RPC current_access() */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>Quyền thực từ CSDL (current_access):</span>
                <button
                  onClick={refreshCurrentAccess}
                  className="text-blue-800 hover:underline text-[11px] font-semibold"
                >
                  Làm mới quyền ↻
                </button>
              </div>

              {rpcAccess.loading ? (
                <div className="text-slate-500">Đang truy vấn hàm RPC current_access()...</div>
              ) : rpcAccess.error ? (
                <div className="text-rose-700">Lỗi RPC: {rpcAccess.error}</div>
              ) : (
                <div className="space-y-1">
                  <div>
                    Các vai trò được cấp:{' '}
                    <span className="font-bold text-blue-900 font-mono">
                      {roles.length > 0 ? roles.join(', ') : 'Chưa có vai trò trong private.user_roles'}
                    </span>
                  </div>
                  <div>
                    Vai trò chính quy ước:{' '}
                    <strong className="text-emerald-800 capitalize">{primaryRole}</strong>
                  </div>
                  <div className="text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                    * Quyền thực tế lấy từ bảng <code className="font-mono text-slate-700">private.user_roles</code>.
                    Người dùng không thể tự chọn hay nâng quyền từ giao diện.
                  </div>
                </div>
              )}
            </div>

            {/* Thử nghiệm truy vấn thật public.subjects (Schema 001_nen_tang.sql) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-3">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span className="flex items-center gap-1.5">
                  <span>1. Truy vấn public.subjects:</span>
                  <span className="text-[10px] font-mono font-normal text-slate-500">(id, code, name, active)</span>
                </span>
                <button
                  onClick={testSubjectsQuery}
                  disabled={subjectsTest.loading}
                  className="px-2.5 py-1 bg-blue-800 text-white rounded text-[11px] font-semibold hover:bg-blue-900 disabled:opacity-50"
                >
                  {subjectsTest.loading ? 'Đang truy vấn...' : 'Chạy truy vấn subjects'}
                </button>
              </div>

              <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 font-mono">
                supabase.from('subjects').select('id, code, name, active').eq('active', true)
              </div>

              {subjectsTest.loading ? (
                <div className="text-slate-500 text-xs">Đang gửi truy vấn SELECT * FROM public.subjects tới Supabase...</div>
              ) : subjectsTest.success ? (
                <div className="space-y-2">
                  <div className="text-emerald-700 font-bold text-xs flex items-center justify-between">
                    <span>✓ Đọc thành công {subjectsTest.count} môn học thật từ CSDL Supabase</span>
                    <span className="text-[10px] text-slate-500 font-normal">{subjectsTest.lastQueriedAt}</span>
                  </div>

                  {/* Bảng dữ liệu thật trả về từ Supabase */}
                  {subjectsTest.data && subjectsTest.data.length > 0 && (
                    <div className="max-h-48 overflow-y-auto border border-slate-200 rounded bg-white">
                      <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200 sticky top-0">
                          <tr>
                            <th className="py-1.5 px-2">Mã code</th>
                            <th className="py-1.5 px-2">Tên môn học</th>
                            <th className="py-1.5 px-2">Trạng thái (active)</th>
                            <th className="py-1.5 px-2 font-mono text-[10px]">UUID (id)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-slate-700">
                          {subjectsTest.data.map((s) => (
                            <tr key={s.id || s.code} className="hover:bg-slate-50">
                              <td className="py-1 px-2 font-mono font-bold text-blue-900">{s.code}</td>
                              <td className="py-1 px-2 font-semibold text-slate-900">{s.name}</td>
                              <td className="py-1 px-2">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-semibold ${
                                  s.active ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {s.active ? 'Hoạt động' : 'Tắt'}
                                </span>
                              </td>
                              <td className="py-1 px-2 font-mono text-[9px] text-slate-400 truncate max-w-[120px]">{s.id}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              ) : subjectsTest.error ? (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-800 space-y-1">
                  <div className="font-bold text-xs">✗ Lỗi truy vấn bảng public.subjects:</div>
                  <div className="font-mono text-[11px] break-all">{subjectsTest.error}</div>
                </div>
              ) : (
                <div className="text-slate-500 text-[11px]">
                  Bấm nút "Chạy truy vấn subjects" để đọc danh sách môn học thật từ CSDL Supabase.
                </div>
              )}

              {/* Phần 2: Thử nghiệm lọc môn qua bảng public.curricula */}
              <div className="pt-3 border-t border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>2. Lọc môn theo lớp qua public.curricula:</span>
                  <div className="flex items-center gap-1">
                    {[6, 7, 8, 9].map((g) => (
                      <button
                        key={g}
                        onClick={() => testCurriculaQuery(g)}
                        disabled={curriculaTest.loading}
                        className="px-1.5 py-0.5 bg-slate-200 hover:bg-blue-800 hover:text-white rounded text-[10px] font-semibold"
                      >
                        Lớp {g}
                      </button>
                    ))}
                    <button
                      onClick={() => testCurriculaQuery()}
                      disabled={curriculaTest.loading}
                      className="px-1.5 py-0.5 bg-blue-900 text-white rounded text-[10px] font-semibold"
                    >
                      Tất cả
                    </button>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500">
                  curricula (grade, subject_id, textbook_id) ➜ liên kết subjects bằng subject_id.
                </div>

                {curriculaTest.loading && (
                  <div className="text-[11px] text-slate-500">Đang truy vấn bảng public.curricula...</div>
                )}

                {curriculaTest.success && curriculaTest.data && (
                  <div className="text-[11px] text-emerald-800 bg-emerald-50/70 p-2 rounded border border-emerald-200">
                    ✓ Đọc được {curriculaTest.count} liên kết môn học (Khối: {curriculaTest.selectedGrade}) từ bảng public.curricula!
                  </div>
                )}

                {curriculaTest.error && (
                  <div className="text-[11px] text-rose-700 bg-rose-50 p-2 rounded border border-rose-200 font-mono">
                    {curriculaTest.error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Khối Form Xác Thực khi chưa đăng nhập */}
      {(!isAuthenticated || authMode !== 'real') && (
        <div className="bg-white border border-slate-200 rounded overflow-hidden shadow-sm">
          {/* Thanh chuyển Tab */}
          <div className="border-b border-slate-200 flex flex-wrap bg-slate-50">
            <button
              onClick={() => setActiveFormTab('signin')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeFormTab === 'signin'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              1. Đăng Nhập
            </button>
            <button
              onClick={() => setActiveFormTab('signup')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeFormTab === 'signup'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              2. Đăng Ký Tài Khoản
            </button>
            <button
              onClick={() => setActiveFormTab('forgot')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeFormTab === 'forgot'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              3. Quên Mật Khẩu
            </button>
            <button
              onClick={() => setActiveFormTab('config')}
              className={`py-3 px-6 text-sm font-semibold border-b-2 transition-colors ${
                activeFormTab === 'config'
                  ? 'border-blue-900 text-blue-900 bg-white'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              4. Cấu Hình Kết Nối Supabase
            </button>
          </div>

          <div className="p-6 max-w-xl">
            {/* Form 1: Đăng nhập */}
            {activeFormTab === 'signin' && (
              <form onSubmit={handleSignInSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Đăng Nhập Smart EDU</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Sử dụng địa chỉ email và mật khẩu tài khoản Supabase Auth đã được đăng ký.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={signInEmail}
                    onChange={e => setSignInEmail(e.target.value)}
                    placeholder="hocsinh@smartedu.edu.vn"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-semibold text-slate-700">Mật khẩu:</label>
                    <button
                      type="button"
                      onClick={() => setActiveFormTab('forgot')}
                      className="text-xs text-blue-800 hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={signInPassword}
                    onChange={e => setSignInPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                {signInError && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded text-xs">
                    {signInError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSignInSubmitting || !configStatus.isValid}
                  className="w-full py-2.5 px-4 bg-blue-800 text-white font-semibold text-sm rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  {isSignInSubmitting ? 'Đang xác thực với Supabase...' : 'Đăng Nhập'}
                </button>

                <div className="text-xs text-slate-500 text-center pt-2">
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveFormTab('signup')}
                    className="text-blue-800 font-bold hover:underline"
                  >
                    Đăng ký tài khoản học sinh ngay
                  </button>
                </div>
              </form>
            )}

            {/* Form 2: Đăng ký */}
            {activeFormTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Đăng Ký Tài Khoản Học Sinh</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hệ thống sẽ tạo tài khoản tại Supabase Auth. Theo trigger <code className="font-mono text-blue-900">private.on_signup()</code>,
                    mọi tài khoản mới được đăng ký mặc định nhận vai trò <strong>student (Học sinh)</strong>.
                    Tuyệt đối không cho phép tự chọn vai trò quản trị hoặc giáo viên.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên học sinh:
                  </label>
                  <input
                    type="text"
                    required
                    value={signUpFullName}
                    onChange={e => setSignUpFullName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ Email:
                  </label>
                  <input
                    type="email"
                    required
                    value={signUpEmail}
                    onChange={e => setSignUpEmail(e.target.value)}
                    placeholder="nguyenvana@gmail.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mật khẩu (tối thiểu 6 ký tự):
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpPassword}
                    onChange={e => setSignUpPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nhập lại mật khẩu:
                  </label>
                  <input
                    type="password"
                    required
                    value={signUpConfirmPassword}
                    onChange={e => setSignUpConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                {signUpError && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded text-xs">
                    {signUpError}
                  </div>
                )}

                {signUpSuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-xs leading-relaxed">
                    {signUpSuccessMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSignUpSubmitting || !configStatus.isValid}
                  className="w-full py-2.5 px-4 bg-blue-800 text-white font-semibold text-sm rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  {isSignUpSubmitting ? 'Đang gửi đăng ký tới Supabase...' : 'Tạo Tài Khoản Mới'}
                </button>

                <div className="text-xs text-slate-500 text-center pt-2">
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setActiveFormTab('signin')}
                    className="text-blue-800 font-bold hover:underline"
                  >
                    Đăng nhập
                  </button>
                </div>
              </form>
            )}

            {/* Form 3: Quên mật khẩu */}
            {activeFormTab === 'forgot' && (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Khôi Phục Mật Khẩu</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nhập địa chỉ email tài khoản đã đăng ký để nhận liên kết đặt lại mật khẩu từ Supabase.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Địa chỉ Email cần khôi phục:
                  </label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="hocsinh@smartedu.edu.vn"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                {forgotError && (
                  <div className="p-3 bg-rose-50 text-rose-800 border border-rose-200 rounded text-xs">
                    {forgotError}
                  </div>
                )}

                {forgotSuccessMessage && (
                  <div className="p-3.5 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded text-xs leading-relaxed">
                    {forgotSuccessMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isForgotSubmitting || !configStatus.isValid}
                  className="w-full py-2.5 px-4 bg-blue-800 text-white font-semibold text-sm rounded hover:bg-blue-900 transition-colors disabled:opacity-50"
                >
                  {isForgotSubmitting ? 'Đang gửi yêu cầu...' : 'Gửi Liên Kết Đặt Lại Mật Khẩu'}
                </button>

                <div className="text-xs text-slate-500 text-center pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveFormTab('signin')}
                    className="text-blue-800 font-bold hover:underline"
                  >
                    ← Quay lại màn hình đăng nhập
                  </button>
                </div>
              </form>
            )}

            {/* Form 4: Cấu hình kết nối Supabase */}
            {activeFormTab === 'config' && (
              <form onSubmit={handleSaveCustomConfig} className="space-y-4">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Cấu Hình Kết Nối Supabase</h2>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    Theo quy định bảo mật, frontend chỉ nhận hai giá trị công khai:
                    <br />
                    1. <code className="font-mono text-blue-900 font-bold">VITE_SUPABASE_URL</code>: URL dự án Supabase (VD: https://xyz.supabase.co).
                    <br />
                    2. <code className="font-mono text-blue-900 font-bold">VITE_SUPABASE_PUBLISHABLE_KEY</code>: Khóa Publishable (Anon Key).
                    <br />
                    <span className="text-rose-700 font-semibold">* Tuyệt đối không nhập Service Role Key hoặc Database Secret.</span>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    VITE_SUPABASE_URL:
                  </label>
                  <input
                    type="url"
                    value={customUrl}
                    onChange={e => setCustomUrl(e.target.value)}
                    placeholder="https://xyzcompany.supabase.co"
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    VITE_SUPABASE_PUBLISHABLE_KEY (Anon Key):
                  </label>
                  <input
                    type="password"
                    value={customKey}
                    onChange={e => setCustomKey(e.target.value)}
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:ring-1 focus:ring-blue-800"
                  />
                </div>

                {configMessage && (
                  <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded text-xs">
                    {configMessage}
                  </div>
                )}

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 px-4 bg-blue-800 text-white font-semibold text-xs rounded hover:bg-blue-900 transition-colors"
                  >
                    Lưu & Kích Hoạt Phiên Này
                  </button>
                  <button
                    type="button"
                    onClick={handleClearCustomConfig}
                    className="py-2 px-3 bg-slate-100 text-slate-700 border border-slate-300 font-semibold text-xs rounded hover:bg-slate-200"
                  >
                    Xóa & Dùng .env
                  </button>
                </div>

                <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  Thông tin này được lưu cục bộ trong trình duyệt của bạn để kiểm thử và không bao giờ gửi ra ngoài.
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Liên kết tới Khu vực Demo chuyển đổi vai trò (Được dán nhãn rõ ràng) */}
      <div className="p-4 bg-amber-50/70 border border-amber-300 rounded flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="space-y-0.5">
          <div className="font-bold text-amber-900 flex items-center gap-2">
            <span>[KHU VỰC THỬ NGHIỆM GIAO DIỆN · DEMO BỐ CỤC]</span>
          </div>
          <p className="text-amber-800">
            Bạn cần xem bố cục giao diện từ góc nhìn Giáo viên, Người duyệt, Quản trị hoặc Nghiên cứu viên?
            Khu vực Demo tách biệt cho phép chuyển đổi vai trò giả lập mà không làm ảnh hưởng tài khoản thật.
          </p>
        </div>
        <button
          onClick={() => setActiveTab('demo_roles')}
          className="px-4 py-2 bg-amber-800 text-white font-semibold rounded hover:bg-amber-900 shrink-0 whitespace-nowrap"
        >
          Mở Khu Vực Demo Vai Trò →
        </button>
      </div>
    </div>
  );
};
