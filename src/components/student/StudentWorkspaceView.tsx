/**
 * Student Workspace View - Khu vực học tập dành cho học sinh THCS (Bảng 01 & Bảng 02)
 * Tuân thủ yêu cầu:
 * - Tách biệt hoàn toàn với trang danh mục 78 đặc tả
 * - Hiển thị trạng thái xác thực tài khoản thật và vai trò từ RPC current_access()
 * - Kiểm tra đọc dữ liệu bảng public.subjects thật từ Supabase
 * - Tất cả chức năng chưa làm được ghi rõ "Chưa triển khai" và vô hiệu hóa nút bấm
 * - Giữ ngôn ngữ tiếng Việt, Times New Roman, xanh công nghệ, cỡ chữ 18px
 */

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationContext';
import { THCS_SUBJECTS, SMART_EDU_78_FUNCTIONS, FunctionItem } from '../../types/smartEduData';

export const StudentWorkspaceView: React.FC = () => {
  const {
    displayName,
    email,
    userId,
    roles,
    primaryRole,
    authMode,
    rpcAccess,
    subjectsTest,
    testSubjectsQuery,
    curriculaTest,
    testCurriculaQuery,
    logout
  } = useAuth();

  const { navigateToFunction, setSelectedGrade, selectedGrade } = useNavigation();

  const [activeTab, setActiveTab] = useState<'overview' | 'interactive_lessons' | 'review' | 'assessments'>('overview');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('TOAN');

  // Lấy các chức năng nhóm Học sinh (HS01–HS21)
  const studentFunctions = SMART_EDU_78_FUNCTIONS.filter((f: FunctionItem) => f.groupId === 'HocSinh');

  const getFunctionItem = (code: string): FunctionItem | undefined => {
    return studentFunctions.find((f: FunctionItem) => f.code === code);
  };

  const handleOpenSpec = (code: string) => {
    const fn = getFunctionItem(code);
    if (fn) {
      navigateToFunction(fn);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Tiêu đề Khu vực học tập học sinh */}
      <div className="bg-white border border-slate-200 p-6 rounded shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-blue-900 uppercase bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
                Bảng 01 & Bảng 02 · Không gian học sinh THCS
              </span>
              {authMode === 'real' ? (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ● Tài khoản thật (Supabase Auth)
                </span>
              ) : authMode === 'demo' ? (
                <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  ▲ Chế độ Demo (Chỉ duyệt bố cục)
                </span>
              ) : (
                <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  ○ Chưa đăng nhập (Khách vãng lai)
                </span>
              )}
            </div>

            <h1 className="text-2xl font-bold text-slate-900">
              Không Gian Học Tập Tương Tác Cấp THCS
            </h1>
            <p className="text-slate-600 text-sm mt-1 max-w-3xl leading-relaxed">
              Dành riêng cho học sinh Khối lớp 6, 7, 8, 9 với 12 môn học THCS theo bộ sách Kết nối tri thức với cuộc sống.
              Theo dõi tiến độ, tham gia bài học tương tác, làm bài tập tự đánh giá và rèn luyện kỹ năng.
            </p>
          </div>

          {/* Hộp định danh người dùng */}
          <div className="bg-slate-50 border border-slate-200 p-3.5 rounded text-xs min-w-[280px]">
            <div className="text-slate-500 text-[11px] uppercase mb-1 font-semibold">
              Học sinh đăng nhập:
            </div>
            <div className="font-bold text-slate-900 text-sm truncate">
              {displayName}
            </div>
            <div className="text-slate-600 truncate mt-0.5">
              Email: <span className="font-mono">{email || 'Chưa liên kết'}</span>
            </div>
            <div className="text-slate-600 mt-0.5 flex items-center gap-1.5">
              <span>Vai trò DB (current_access):</span>
              <strong className="text-blue-900 font-mono">
                {roles.join(', ') || 'student'}
              </strong>
            </div>

            {authMode === 'real' && (
              <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-emerald-700 font-medium">✓ Đã xác thực bảo mật</span>
                <button
                  onClick={logout}
                  className="text-rose-700 hover:underline font-semibold text-[11px]"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Trạng thái xác thực RPC current_access() */}
        <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-blue-50/70 border border-blue-200 rounded">
            <div className="font-bold text-blue-900 mb-1 flex items-center justify-between">
              <span>Xác thực vai trò qua RPC current_access():</span>
              {rpcAccess.loading && <span className="text-blue-700 font-normal">Đang kiểm tra...</span>}
            </div>
            {rpcAccess.error ? (
              <div className="text-rose-700">
                Lỗi RPC: {rpcAccess.error}
              </div>
            ) : rpcAccess.data ? (
              <div className="text-slate-700 space-y-0.5">
                <div>User ID: <code className="font-mono text-slate-900">{rpcAccess.data.user_id}</code></div>
                <div>Vai trò máy chủ cấp: <strong className="text-blue-900">{rpcAccess.data.roles.join(', ')}</strong></div>
                <div className="text-[11px] text-slate-500">Đối soát tại: {rpcAccess.lastFetchedAt}</div>
              </div>
            ) : (
              <div className="text-slate-600">
                Chưa nhận dữ liệu từ hàm RPC <code className="font-mono text-blue-900">public.current_access()</code>.
              </div>
            )}
          </div>

          {/* Kiểm tra đọc dữ liệu thật từ bảng public.subjects (Schema 001_nen_tang.sql) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded space-y-2">
            <div className="font-bold text-slate-900 flex flex-wrap items-center justify-between gap-2">
              <span className="flex items-center gap-1.5">
                <span>Đọc bảng public.subjects:</span>
                <span className="font-mono text-[10px] text-slate-500 font-normal">(id, code, name, active)</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={testSubjectsQuery}
                  disabled={subjectsTest.loading}
                  className="text-[11px] px-2.5 py-1 bg-blue-800 text-white font-semibold rounded hover:bg-blue-900 disabled:opacity-50"
                >
                  {subjectsTest.loading ? 'Đang truy vấn...' : 'Chạy truy vấn subjects'}
                </button>
                <button
                  onClick={() => testCurriculaQuery(typeof selectedGrade === 'number' ? selectedGrade : undefined)}
                  disabled={curriculaTest.loading}
                  className="text-[11px] px-2 py-1 bg-slate-200 text-slate-800 font-semibold rounded hover:bg-slate-300 disabled:opacity-50"
                  title="Truy vấn public.curricula liên kết subjects qua subject_id"
                >
                  {curriculaTest.loading ? 'Đang đọc...' : 'Thử curricula'}
                </button>
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-600 bg-white p-1.5 rounded border border-slate-200">
              supabase.from('subjects').select('id, code, name, active').eq('active', true)
            </div>

            {subjectsTest.success ? (
              <div className="text-emerald-800 space-y-0.5 text-xs">
                <div className="font-semibold">
                  ✓ Truy vấn thành công: Tìm thấy {subjectsTest.count} môn học thật từ bảng public.subjects (active = true).
                </div>
                <div className="text-[11px] text-slate-600">
                  Thời gian: {subjectsTest.lastQueriedAt} · Cột: id, code, name, active.
                </div>
              </div>
            ) : subjectsTest.error ? (
              <div className="text-rose-700 space-y-0.5 text-xs">
                <div className="font-semibold">✗ Chưa đọc được bảng public.subjects:</div>
                <div className="text-[11px] font-mono break-all">{subjectsTest.error}</div>
                <div className="text-[11px] text-slate-500">
                  (Bảng public.subjects yêu cầu quyền authenticated theo 001_nen_tang.sql)
                </div>
              </div>
            ) : (
              <div className="text-slate-600 text-[11px]">
                Nhấn "Chạy truy vấn subjects" để gửi lệnh SELECT id, code, name, active FROM public.subjects tới Supabase.
              </div>
            )}

            {/* Trạng thái truy vấn curricula (lọc môn theo lớp) */}
            {curriculaTest.success && curriculaTest.data && (
              <div className="text-[11px] text-blue-900 bg-blue-50/70 p-1.5 rounded border border-blue-200">
                ✓ public.curricula: Đọc {curriculaTest.count} liên kết môn học (Khối: {curriculaTest.selectedGrade}) liên kết với subjects bằng subject_id.
              </div>
            )}
            {curriculaTest.error && (
              <div className="text-[11px] text-rose-700 bg-rose-50 p-1.5 rounded border border-rose-200 font-mono">
                ✗ curricula: {curriculaTest.error}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Bộ lọc khối lớp THCS (Chỉ Lớp 6, 7, 8, 9) */}
      <div className="bg-white border border-slate-200 p-4 rounded flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700 uppercase">Khối lớp THCS:</span>
          <div className="flex items-center gap-1.5">
            {[6, 7, 8, 9].map(grade => (
              <button
                key={grade}
                onClick={() => {
                  const newGrade = selectedGrade === grade ? 'ALL' : grade;
                  setSelectedGrade(newGrade);
                  if (typeof newGrade === 'number') {
                    testCurriculaQuery(newGrade);
                  }
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                  selectedGrade === grade
                    ? 'bg-blue-900 text-white border-blue-900'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Lớp {grade}
              </button>
            ))}
            <button
              onClick={() => {
                setSelectedGrade('ALL');
                testCurriculaQuery();
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded border transition-colors ${
                selectedGrade === 'ALL'
                  ? 'bg-blue-900 text-white border-blue-900'
                  : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Tất cả 4 khối
            </button>
          </div>
        </div>

        <div className="text-xs text-slate-500">
          Chỉ phục vụ học sinh cấp THCS · Lọc theo lớp qua bảng <code className="font-mono text-blue-900">public.curricula</code>
        </div>
      </div>

      {/* 3. Bốn phân hệ không gian học sinh */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="border-b border-slate-200 flex flex-wrap bg-slate-50">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Bảng 01 – Tổng quan học tập (HS01)
          </button>
          <button
            onClick={() => setActiveTab('interactive_lessons')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'interactive_lessons'
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Bảng 02 – Bài học tương tác & Thí nghiệm ảo (HS02–HS09)
          </button>
          <button
            onClick={() => setActiveTab('review')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'review'
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Ôn tập & Sổ tay lỗi sai (HS10, HS11, HS12)
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`py-3 px-5 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === 'assessments'
                ? 'border-blue-900 text-blue-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            4. Bảng 03 – Làm bài kiểm tra (HS13–HS20)
          </button>
        </div>

        <div className="p-6">
          {/* Tab 1: Tổng quan học tập (Bảng 01) */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Bảng 01: Bảng Điều Khiển Học Tập Cá Nhân (HS01)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Giao diện trung tâm hiển thị tiến độ 12 môn THCS, bài cần làm, và ghi chú học tập.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Trạng thái: Chưa triển khai
                  </span>
                  <button
                    onClick={() => handleOpenSpec('HS01')}
                    className="text-xs text-blue-800 hover:underline font-semibold"
                  >
                    Xem đặc tả HS01 →
                  </button>
                </div>
              </div>

              {/* Danh sách 12 môn học THCS chính khóa */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="text-xs font-bold text-slate-700 uppercase">
                    {subjectsTest.success && subjectsTest.data && subjectsTest.data.length > 0 ? (
                      <span className="text-emerald-800">
                        Danh mục môn học đọc thực tế từ Supabase (bảng public.subjects):
                      </span>
                    ) : (
                      <span>Danh mục 12 môn học THCS (Bộ sách Kết nối tri thức với cuộc sống):</span>
                    )}
                  </div>
                  {subjectsTest.success && (
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ✓ Đã đồng bộ từ CSDL ({subjectsTest.count} môn active)
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {(subjectsTest.success && subjectsTest.data && subjectsTest.data.length > 0
                    ? subjectsTest.data
                    : THCS_SUBJECTS
                  ).map((subj: any) => (
                    <div
                      key={subj.code}
                      onClick={() => setSelectedSubjectFilter(subj.code)}
                      className={`p-3 rounded border text-left cursor-pointer transition-colors ${
                        selectedSubjectFilter === subj.code
                          ? 'bg-blue-50 border-blue-400 ring-1 ring-blue-400'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono font-bold text-blue-900">{subj.code}</span>
                        {subj.active !== undefined && (
                          <span className="text-[10px] text-emerald-700 font-semibold">
                            {subj.active ? '● Đang kích hoạt' : '○ Tắt'}
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-sm text-slate-900 truncate">
                        {subj.name}
                      </div>
                      {subj.id && (
                        <div className="text-[9px] font-mono text-slate-400 truncate mt-0.5">
                          ID: {subj.id}
                        </div>
                      )}
                      <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Tiến độ: 0%</span>
                        <span className="text-amber-800 font-medium">Chưa triển khai</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Khối tiện ích học sinh (HS08, HS12, HS21) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Ghi Chú Học Tập (HS08)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Chưa triển khai</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Lưu ghi chú cá nhân và đánh dấu học liệu trọng tâm theo bài học. Bảng <code className="font-mono text-blue-900">public.personal_notes</code>.
                  </p>
                  <button
                    disabled
                    className="w-full py-1.5 text-xs font-semibold bg-slate-200 text-slate-500 rounded cursor-not-allowed"
                  >
                    Xem ghi chú (Vô hiệu hóa)
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Sổ Tay Lỗi Sai (HS12)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Chưa triển khai</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tự động ghi nhận câu sai trong quá trình luyện tập và phân loại theo đơn vị kiến thức để sửa chữa.
                  </p>
                  <button
                    disabled
                    className="w-full py-1.5 text-xs font-semibold bg-slate-200 text-slate-500 rounded cursor-not-allowed"
                  >
                    Mở sổ tay lỗi sai (Vô hiệu hóa)
                  </button>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">Nhật Ký Học Tập (HS21)</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">Chưa triển khai</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nhật ký ghi nhận lịch sử tương tác, số giờ học thực tế và mức độ hoàn thành từng chuyên đề.
                  </p>
                  <button
                    disabled
                    className="w-full py-1.5 text-xs font-semibold bg-slate-200 text-slate-500 rounded cursor-not-allowed"
                  >
                    Xem nhật ký (Vô hiệu hóa)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Trình học tương tác & Thí nghiệm ảo (Bảng 02) */}
          {activeTab === 'interactive_lessons' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Bảng 02: Trình Học Tương Tác & Thí Nghiệm Mô Phỏng (HS02–HS09)
                  </h2>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Không gian học bài đa phương tiện, câu hỏi tương tác chạm kéo thả, mô phỏng thí nghiệm KHTN/Toán.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                    Trạng thái: Chưa triển khai
                  </span>
                </div>
              </div>

              {/* Lưới các chức năng tương tác bài học */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { code: 'HS02', title: 'Cây học liệu môn học', desc: 'Duyệt bài học theo cấu trúc chương, bài của sách giáo khoa KNTT.' },
                  { code: 'HS03', title: 'Khảo sát năng lực đầu bài', desc: 'Bài khảo sát nhanh 3-5 câu nhận biết trước khi vào bài mới.' },
                  { code: 'HS04', title: 'Trình học tương tác', desc: 'Trình phát đa phương tiện kết hợp video, âm thanh và văn bản.' },
                  { code: 'HS05', title: 'Tương tác chạm kéo thả', desc: 'Các dạng bài nối cột, điền khuyết, sắp xếp thứ tự trực quan.' },
                  { code: 'HS06', title: 'Thí nghiệm ảo / Mô phỏng', desc: 'Phòng thí nghiệm số tương tác cho môn KHTN, Vật lí, Hóa học, Sinh học.' },
                  { code: 'HS07', title: 'Gợi ý bài từng bước', desc: 'Cơ chế scaffolding trợ giúp khi học sinh gặp khúc mắc theo mức độ tăng dần.' },
                  { code: 'HS09', title: 'Tự đánh giá cuối bài', desc: 'Phiếu kiểm tra ngắn đo lường mức độ đạt chuẩn kiến thức kỹ năng của bài.' }
                ].map(item => (
                  <div key={item.code} className="p-4 bg-slate-50 border border-slate-200 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
                          {item.code}
                        </span>
                        <span className="font-bold text-sm text-slate-900">{item.title}</span>
                      </div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">
                        Chưa triển khai
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => handleOpenSpec(item.code)}
                        className="text-xs text-blue-800 hover:underline font-semibold"
                      >
                        Xem đặc tả chi tiết →
                      </button>
                      <button
                        disabled
                        className="px-3 py-1 text-xs font-semibold bg-slate-200 text-slate-500 rounded cursor-not-allowed"
                      >
                        Khởi động bài học
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Ôn tập có định hướng & Sổ tay lỗi sai (HS10, HS11, HS12) */}
          {activeTab === 'review' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  Ôn Tập Định Hướng & Khắc Phục Lỗi Sai (HS10, HS11, HS12)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Ôn tập sau mỗi chương, chuẩn bị kiểm tra giữa kỳ, cuối kỳ và luyện tập các câu sai trong quá khứ.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Ôn tập theo chuyên đề / chương (HS10)</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Chưa triển khai</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Tổng hợp kiến thức trọng tâm của toàn bộ chương học và đưa ra bộ câu hỏi rèn luyện theo 4 mức độ:
                    Nhận biết, Thông hiểu, Vận dụng, Vận dụng cao.
                  </p>
                  <button
                    disabled
                    className="w-full py-2 text-xs font-semibold bg-slate-200 text-slate-500 rounded cursor-not-allowed"
                  >
                    Bắt đầu ôn tập chương (Vô hiệu hóa)
                  </button>
                </div>

                <div className="p-5 bg-slate-50 border border-slate-200 rounded space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Luyện thi Giữa kỳ & Cuối kỳ (HS11)</span>
                    <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-semibold">Chưa triển khai</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Luyện giải đề mẫu theo đúng cấu trúc ma trận, bản đặc tả của Bộ GD&ĐT cấp THCS với thời gian thực.
                  </p>
                  <button
                    disabled
                    className="w-full py-2 text-xs font-semibold bg-slate-200 text-slate-500 rounded cursor-not-allowed"
                  >
                    Làm đề ôn thi (Vô hiệu hóa)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Phòng làm bài kiểm tra (Bảng 03 - HS13–HS20) */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              <div className="pb-4 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">
                  Bảng 03: Phòng Kiểm Tra Trực Tuyến (HS13–HS20)
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Làm bài kiểm tra thường xuyên và định kỳ, nộp bài tự luận/trắc nghiệm, xem phân tích kết quả bài thi.
                </p>
              </div>

              <div className="p-6 bg-slate-50 border border-slate-200 rounded text-center space-y-3">
                <div className="text-sm font-bold text-slate-800">
                  Hiện chưa có bài kiểm tra nào được giáo viên giao cho tài khoản của bạn.
                </div>
                <p className="text-xs text-slate-500 max-w-lg mx-auto">
                  Các chức năng làm bài kiểm tra (HS13), đếm ngược thời gian (HS14), chống gian lận (HS15),
                  tự lưu bài làm (HS16), nộp bài (HS17) và giải thích đáp án (HS18) đang được bảo lưu trạng thái
                  <strong className="text-amber-800"> Chưa triển khai</strong> theo đúng bản đặc tả 1.0.
                </p>
                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => handleOpenSpec('HS13')}
                    className="px-4 py-2 text-xs font-semibold bg-blue-800 text-white rounded hover:bg-blue-900"
                  >
                    Xem đặc tả phòng kiểm tra (HS13)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
