/**
 * TeacherWorkspaceView - Không gian giáo viên Smart EDU (Theo Ảnh 2 tham chiếu)
 * Bố cục:
 * 1. Thanh tiêu đề "Thầy cô muốn chuẩn bị gì hôm nay?"
 * 2. 4 Thẻ hành động lớn: Soạn bài tương tác, Ngân hàng câu hỏi, Bộ hồ sơ kiểm tra, Trò chơi học tập
 * 3. Cột trái: Lớp học của tôi (+ Tạo lớp), Học liệu đang chuẩn bị (bảng danh sách)
 * 4. Cột phải: Bộ hồ sơ kiểm tra (quy trình 5 bước), Cần xử lí (bài nộp cần chấm)
 * 5. Thanh công cụ trong lớp: Gọi tên, Chia nhóm, Đồng hồ, Phiếu cuối tiết
 */

import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  Users,
  Layers,
  HelpCircle,
  ClipboardList,
  Gamepad2,
  CheckSquare,
  BarChart2,
  BookOpen,
  Plus,
  Play,
  Edit3,
  Eye,
  Clock,
  Shuffle,
  FileCheck,
  ChevronRight,
  FolderOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const TeacherWorkspaceView: React.FC = () => {
  const {
    openHome,
    teacherSection,
    setTeacherSection,
    openLessonPlayer,
    setUnimplementedFeature
  } = useNavigation();

  const { isAuthenticated, roles, primaryRole } = useAuth();

  // Kiểm tra vai trò thực tế
  const isTeacherOrAdmin =
    roles.includes('teacher') ||
    roles.includes('admin') ||
    roles.includes('reviewer');

  // Chế độ xem trước dành cho thẩm định viên (nếu đang ở tài khoản học sinh hoặc khách)
  const [allowPreview, setAllowPreview] = useState<boolean>(true);

  if (!isTeacherOrAdmin && !allowPreview) {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white border border-amber-300 rounded-2xl p-8 text-center space-y-4 shadow-sm font-serif">
        <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto text-xl">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Khu Vực Dành Cho Giáo Viên
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          Tài khoản hiện tại của bạn chưa được cấp vai trò Giáo viên trong cơ sở dữ liệu.
          Quyền truy cập được xác thực máy chủ qua hàm <code className="font-mono text-blue-900">current_access()</code> và bảng <code className="font-mono text-blue-900">private.user_roles</code>.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <button
            onClick={() => setAllowPreview(true)}
            className="px-4 py-2 bg-blue-800 text-white font-semibold text-xs rounded-xl hover:bg-blue-900"
          >
            Xem trước bố cục giao diện minh họa
          </button>
          <button
            onClick={openHome}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="font-serif bg-slate-50 min-h-screen flex flex-col">
      {/* KHUNG THÂN: MENU TRÁI + NỘI DUNG BÀN LÀM VIỆC */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex flex-col lg:flex-row gap-6 items-start">
        {/* CỘT MENU TRÁI GIÁO VIÊN (ẢNH 2) */}
        <aside className="w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-xs space-y-6">
          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            <button
              onClick={() => setTeacherSection('workspace')}
              className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 cursor-pointer ${
                teacherSection === 'workspace'
                  ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Bàn làm việc</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Quản lí lớp học và phân công giảng dạy (GV01)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-500" />
              <span>Lớp học</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Trình soạn thảo bài học tương tác đa phương tiện (GV03)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-slate-500" />
              <span>Soạn bài tương tác</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Ngân hàng câu hỏi ma trận chuẩn hóa (GV05)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-500" />
              <span>Ngân hàng câu hỏi</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Quy trình tạo bộ hồ sơ kiểm tra (KT01–KT16)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <ClipboardList className="w-4 h-4 text-slate-500" />
              <span>Bộ hồ sơ kiểm tra</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Tạo trò chơi học tập củng cố kiến thức (TC01)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <Gamepad2 className="w-4 h-4 text-slate-500" />
              <span>Trò chơi học tập</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Chấm bài tự luận và trắc nghiệm (KT11, KT12)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <CheckSquare className="w-4 h-4 text-slate-500" />
              <span>Chấm bài</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Báo cáo phân tích kết quả học sinh (KT13)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <BarChart2 className="w-4 h-4 text-slate-500" />
              <span>Kết quả học sinh</span>
            </button>

            <button
              onClick={() => setUnimplementedFeature('Kho học liệu chia sẻ tổ chuyên môn (GV02)')}
              className="w-full text-left px-3.5 py-2.5 rounded-xl hover:bg-slate-100 transition flex items-center gap-3 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-slate-500" />
              <span>Học liệu chia sẻ</span>
            </button>
          </nav>
        </aside>

        {/* NỘI DUNG CHÍNH BÀN LÀM VIỆC GIÁO VIÊN (ẢNH 2) */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* 1. Header Bàn làm việc */}
          <div className="relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
                Thầy cô muốn chuẩn bị gì hôm nay?
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Tạo học liệu, giao nhiệm vụ và theo dõi việc học trong cùng một không gian.
              </p>
            </div>

            {/* Minh họa sách giáo án & bút chì bên phải như Ảnh 2 */}
            <div className="hidden sm:flex items-center gap-3 shrink-0 select-none">
              <div className="w-20 h-16 bg-gradient-to-tr from-blue-600 to-sky-400 rounded-xl shadow-md p-2 flex flex-col justify-between text-white text-xs">
                <span className="font-bold">Kế hoạch</span>
                <span className="text-[10px] opacity-80">2026–2027</span>
              </div>
              <div className="w-10 h-14 bg-amber-100 border border-amber-300 rounded-b-xl flex items-center justify-center text-lg shadow-sm">
                ✏️
              </div>
            </div>
          </div>

          {/* 2. BỐN HÀNH ĐỘNG LỚN (ẢNH 2) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Soạn bài tương tác */}
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Soạn bài tương tác</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thiết kế bài học sinh động với nội dung, câu hỏi và tương tác.
                </p>
              </div>
              <button
                onClick={() => setUnimplementedFeature('Trình soạn thảo bài học tương tác')}
                className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Tạo bài mới</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 2: Ngân hàng câu hỏi */}
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Ngân hàng câu hỏi</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Xây dựng và quản lí câu hỏi theo môn học, dạng bài.
                </p>
              </div>
              <button
                onClick={() => setUnimplementedFeature('Ngân hàng câu hỏi THCS')}
                className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Thêm câu hỏi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 3: Bộ hồ sơ kiểm tra */}
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
                  <ClipboardList className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Bộ hồ sơ kiểm tra</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Tạo đầy đủ ma trận, đặc tả, đề kiểm tra, đáp án và hướng dẫn chấm.
                </p>
              </div>
              <button
                onClick={() => setUnimplementedFeature('Tạo trọn bộ hồ sơ kiểm tra')}
                className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Tạo bộ hồ sơ</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Card 4: Trò chơi học tập */}
            <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-xl bg-blue-100 text-[#1A56DB] flex items-center justify-center shadow-2xs">
                  <Gamepad2 className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-base text-slate-900">Trò chơi học tập</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Sử dụng các mẫu trò chơi để luyện tập, củng cố bài học.
                </p>
              </div>
              <button
                onClick={() => setUnimplementedFeature('Mẫu trò chơi học tập')}
                className="w-full py-2 px-3 bg-[#1A56DB] text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Chọn mẫu trò chơi</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* 3. KHU VỰC 2 CỘT (ẢNH 2) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* CỘT TRÁI (Khoảng 65% - 8 cột) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Vùng: Lớp học của tôi */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                    <Users className="w-5 h-5 text-[#1A56DB]" />
                    <span>Lớp học của tôi</span>
                  </div>
                  <button
                    onClick={() => setUnimplementedFeature('Tạo lớp học mới (GV01)')}
                    className="px-3 py-1.5 bg-blue-50 text-[#1A56DB] hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tạo lớp</span>
                  </button>
                </div>

                {/* 3 Thẻ lớp học như Ảnh 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Lớp Toán 9 */}
                  <div className="bg-gradient-to-br from-blue-50/50 to-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs hover:border-blue-300 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        🖩
                      </div>
                      <div>
                        <div className="font-bold text-base text-slate-900">Toán 9</div>
                        <div className="text-[11px] text-slate-500">● Chưa giao nhiệm vụ</div>
                      </div>
                    </div>
                    <div
                      onClick={() => setUnimplementedFeature('Danh sách học sinh lớp Toán 9')}
                      className="text-xs text-blue-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Xem danh sách lớp &gt;</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => setUnimplementedFeature('Vào không gian lớp Toán 9')}
                        className="flex-1 py-1 px-2 bg-[#1A56DB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Vào lớp</span>
                      </button>
                      <button
                        onClick={() => setUnimplementedFeature('Giao bài tập lớp Toán 9')}
                        className="flex-1 py-1 px-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Giao bài</span>
                      </button>
                    </div>
                  </div>

                  {/* Lớp Tin học 6 */}
                  <div className="bg-gradient-to-br from-cyan-50/50 to-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs hover:border-cyan-300 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold text-sm">
                        🖥️
                      </div>
                      <div>
                        <div className="font-bold text-base text-slate-900">Tin học 6</div>
                        <div className="text-[11px] text-slate-500">● Chưa giao nhiệm vụ</div>
                      </div>
                    </div>
                    <div
                      onClick={() => setUnimplementedFeature('Danh sách học sinh lớp Tin học 6')}
                      className="text-xs text-blue-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Xem danh sách lớp &gt;</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => setUnimplementedFeature('Vào không gian lớp Tin học 6')}
                        className="flex-1 py-1 px-2 bg-[#1A56DB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Vào lớp</span>
                      </button>
                      <button
                        onClick={() => setUnimplementedFeature('Giao bài tập lớp Tin học 6')}
                        className="flex-1 py-1 px-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Giao bài</span>
                      </button>
                    </div>
                  </div>

                  {/* Lớp Tin học 8 */}
                  <div className="bg-gradient-to-br from-indigo-50/50 to-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-2xs hover:border-indigo-300 transition">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                        🖥️
                      </div>
                      <div>
                        <div className="font-bold text-base text-slate-900">Tin học 8</div>
                        <div className="text-[11px] text-slate-500">● Chưa giao nhiệm vụ</div>
                      </div>
                    </div>
                    <div
                      onClick={() => setUnimplementedFeature('Danh sách học sinh lớp Tin học 8')}
                      className="text-xs text-blue-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Xem danh sách lớp &gt;</span>
                    </div>
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                      <button
                        onClick={() => setUnimplementedFeature('Vào không gian lớp Tin học 8')}
                        className="flex-1 py-1 px-2 bg-[#1A56DB] text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Vào lớp</span>
                      </button>
                      <button
                        onClick={() => setUnimplementedFeature('Giao bài tập lớp Tin học 8')}
                        className="flex-1 py-1 px-2 bg-white text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>Giao bài</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vùng: Học liệu đang chuẩn bị */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                  <BookOpen className="w-5 h-5 text-[#1A56DB]" />
                  <span>Học liệu đang chuẩn bị</span>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">Tên học liệu</th>
                        <th className="py-2.5 px-4">Loại</th>
                        <th className="py-2.5 px-4">Trạng thái</th>
                        <th className="py-2.5 px-4 text-center">Thao tác</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {/* Dòng 1: Thông tin và dữ liệu */}
                      <tr className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 flex items-center gap-2 font-bold text-slate-900">
                          <span className="text-blue-600">▶</span>
                          <span>Thông tin và dữ liệu</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs sm:text-sm">
                          Bài học tương tác
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
                            ● Bản nháp
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={openLessonPlayer}
                            className="px-3 py-1 bg-white hover:bg-blue-50 text-blue-900 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3 text-[#1A56DB]" />
                            <span>Tiếp tục soạn</span>
                          </button>
                        </td>
                      </tr>

                      {/* Dòng 2: Ôn tập theo chương */}
                      <tr className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-4 flex items-center gap-2 font-bold text-slate-900">
                          <span className="text-indigo-600">≡</span>
                          <span>Ôn tập theo chương</span>
                        </td>
                        <td className="py-3 px-4 text-slate-600 text-xs sm:text-sm">
                          Bộ câu hỏi
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full">
                            ● Chờ duyệt
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => setUnimplementedFeature('Xem bộ câu hỏi ôn tập theo chương')}
                            className="px-3 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition flex items-center gap-1 mx-auto cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Xem</span>
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* CỘT PHẢI (Khoảng 35% - 4 cột) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Vùng: Bộ hồ sơ kiểm tra (Quy trình 5 bước theo Ảnh 2) */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-lg">
                  <ClipboardList className="w-5 h-5 text-[#1A56DB]" />
                  <span>Bộ hồ sơ kiểm tra</span>
                </div>
                <p className="text-xs text-slate-500">
                  Tạo trọn bộ hồ sơ kiểm tra theo quy trình gợi ý dưới đây.
                </p>

                {/* 5 Bước quy trình */}
                <div className="space-y-2 text-sm">
                  {[
                    { num: 1, title: 'Ma trận', icon: '▦' },
                    { num: 2, title: 'Bản đặc tả', icon: '≡' },
                    { num: 3, title: 'Đề kiểm tra', icon: '📄' },
                    { num: 4, title: 'Đáp án', icon: '☑' },
                    { num: 5, title: 'Hướng dẫn chấm', icon: '📝' }
                  ].map((step) => (
                    <div
                      key={step.num}
                      onClick={() => setUnimplementedFeature(`Quy trình bước ${step.num}: ${step.title}`)}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center group-hover:bg-[#1A56DB] group-hover:text-white transition">
                          {step.num}
                        </span>
                        <span className="font-semibold text-slate-800 text-sm">
                          {step.icon} {step.title}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
                    </div>
                  ))}
                </div>

                {/* 2 Nút hành động */}
                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => setUnimplementedFeature('Bắt đầu tạo hồ sơ kiểm tra mới (KT01)')}
                    className="w-full py-2.5 px-4 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Bắt đầu tạo hồ sơ</span>
                  </button>
                  <button
                    onClick={() => setUnimplementedFeature('Mở hồ sơ kiểm tra đã lưu (KT02)')}
                    className="w-full py-2.5 px-4 bg-white text-slate-700 border border-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FolderOpen className="w-4 h-4 text-slate-500" />
                    <span>Mở hồ sơ đã lưu</span>
                  </button>
                </div>
              </div>

              {/* Vùng: Cần xử lí */}
              <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-base">
                  <CheckSquare className="w-4 h-4 text-[#1A56DB]" />
                  <span>Cần xử lí</span>
                </div>

                <div className="py-6 px-4 bg-slate-50/70 rounded-xl text-center space-y-2 border border-slate-100">
                  <div className="text-3xl">📭</div>
                  <div className="text-xs text-slate-500 font-medium">
                    Chưa có bài nộp cần chấm.
                  </div>
                  <button
                    onClick={() => setUnimplementedFeature('Mở bàn chấm bài tự luận và trắc nghiệm')}
                    className="px-4 py-1.5 bg-[#1A56DB] text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-1.5 cursor-pointer mt-1"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Mở chấm bài</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 4. DẢI CÔNG CỤ TRONG LỚP (ẢNH 2 Ở ĐÁY) */}
          <div className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="text-lg">💼</span>
              <span>Công cụ trong lớp</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setUnimplementedFeature('Công cụ: Gọi tên ngẫu nhiên (TC07)')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>Gọi tên</span>
              </button>
              <button
                onClick={() => setUnimplementedFeature('Công cụ: Chia nhóm học tập tự động (TC08)')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Shuffle className="w-3.5 h-3.5 text-indigo-700" />
                <span>Chia nhóm</span>
              </button>
              <button
                onClick={() => setUnimplementedFeature('Công cụ: Đồng hồ đếm ngược / Quay thưởng (TC09)')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Đồng hồ</span>
              </button>
              <button
                onClick={() => setUnimplementedFeature('Công cụ: Phiếu cuối tiết / Khảo sát nhanh (TC10)')}
                className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Phiếu cuối tiết</span>
              </button>
            </div>
          </div>

          {/* Dòng ghi chú bản quyền ở góc dưới như Ảnh 2 */}
          <div className="text-right text-xs text-slate-400 italic pr-2">
            Bản thiết kế đề xuất • Nội dung minh họa
          </div>
        </main>
      </div>
    </div>
  );
};
