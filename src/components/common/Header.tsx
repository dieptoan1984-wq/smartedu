/**
 * Header Component - Smart EDU THCS
 * Thiết kế thích ứng mượt mà theo 3 ảnh tham chiếu:
 * 1. Khi ở Trang chủ: Thanh đầu trang theo Ảnh 1 (Smart EDU | Trang chủ | Học sinh | Giáo viên | Học liệu)
 * 2. Khi ở Không gian giáo viên: Thanh đầu trang theo Ảnh 2 (Smart EDU | Không gian giáo viên | Năm học 2026–2027 | Tài khoản giáo viên)
 * 3. Khi ở Màn hình học bài học sinh: Thanh đầu trang theo Ảnh 3 (Smart EDU | Lớp 6 / Tin học / Bài học tương tác | Tài khoản của em)
 */

import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  GraduationCap,
  BookOpen,
  Home,
  Bell,
  Search,
  User,
  ChevronDown,
  LogOut,
  Settings,
  Shield,
  Menu,
  X
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    isViewingLesson,
    setIsViewingLesson,
    selectedGrade,
    openHome,
    openStudentSpace,
    openTeacherSpace,
    openAdminSpace,
    openAuth,
    academicYear,
    setAcademicYear,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    setIsTechSpecOpen
  } = useNavigation();

  const { isAuthenticated, displayName, email, roles, primaryRole, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState<boolean>(false);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'teacher':
        return 'Giáo viên';
      case 'admin':
        return 'Quản trị';
      case 'reviewer':
        return 'Người duyệt';
      case 'researcher':
        return 'Nghiên cứu';
      default:
        return 'Học sinh';
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200/90 shadow-2xs font-serif">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* VÙNG TRÁI: LOGO HOẶC LOGO + BREADCRUMBS */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:text-slate-900 focus:outline-none"
            aria-label="Mở trình đơn"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo Smart EDU */}
          <div
            onClick={openHome}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-[#1A56DB] text-white flex items-center justify-center shadow-xs">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-xl text-[#1A56DB] group-hover:text-blue-800 transition">
              Smart EDU
            </span>
          </div>

          {/* Nếu đang ở Không gian giáo viên: Hiện vạch phân cách và chữ "Không gian giáo viên" theo Ảnh 2 */}
          {currentView === 'teacher' && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-300 text-sm font-semibold text-slate-700">
              <span>Không gian giáo viên</span>
            </div>
          )}

          {/* Nếu đang ở Không gian quản trị & thẩm định */}
          {currentView === 'admin' && (
            <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-300 text-sm font-semibold text-purple-900">
              <span>Quản trị &amp; Thẩm định chuyên môn</span>
            </div>
          )}

          {/* Nếu đang ở Màn hình học tương tác: Hiện Breadcrumbs theo Ảnh 3 */}
          {currentView === 'student' && isViewingLesson && (
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-300 text-xs sm:text-sm text-slate-600">
              <button
                onClick={() => openStudentSpace(false)}
                className="hover:text-blue-900 transition flex items-center gap-1 cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-slate-400" />
                <span>Lớp {selectedGrade}</span>
              </button>
              <span className="text-slate-400">/</span>
              <span className="text-slate-700 font-semibold">Tin học</span>
              <span className="text-slate-400">/</span>
              <span className="text-blue-900 font-bold">Bài học tương tác</span>
            </div>
          )}
        </div>

        {/* VÙNG GIỮA: 4 LIÊN KẾT ĐIỀU HƯỚNG TRANG CHỦ THEO ẢNH 1 */}
        {currentView === 'home' && (
          <nav className="hidden md:flex items-center gap-2 lg:gap-3 text-sm font-semibold text-slate-700">
            <button
              onClick={openHome}
              className="px-4 py-1.5 rounded-lg bg-[#1A56DB] text-white shadow-xs font-bold cursor-pointer"
            >
              Trang chủ
            </button>
            <button
              onClick={() => openStudentSpace(false)}
              className="px-3.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900 transition text-slate-700 cursor-pointer"
            >
              Học sinh
            </button>
            <button
              onClick={openTeacherSpace}
              className="px-3.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900 transition text-slate-700 cursor-pointer"
            >
              Giáo viên
            </button>
            <button
              onClick={() => openStudentSpace(false)}
              className="px-3.5 py-1.5 rounded-lg hover:bg-slate-100 hover:text-blue-900 transition text-slate-700 cursor-pointer"
            >
              Học liệu
            </button>
          </nav>
        )}

        {/* VÙNG PHẢI: TÁC VỤ NGƯỜI DÙNG & TÀI KHOẢN THEO ẢNH */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Khi ở Không gian giáo viên: Selector Năm học 2026–2027 theo Ảnh 2 */}
          {currentView === 'teacher' && (
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                aria-label="Chọn năm học"
                className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs focus:outline-none focus:ring-1 focus:ring-blue-600 cursor-pointer"
              >
                <option value="2026–2027">Năm học 2026–2027</option>
                <option value="2025–2026">Năm học 2025–2026</option>
              </select>
            </div>
          )}

          {/* Icon chuông thông báo (Ảnh 2 & Ảnh 3) */}
          {(currentView === 'teacher' || (currentView === 'student' && isViewingLesson)) && (
            <button
              onClick={() => {}}
              className="p-2 text-slate-600 hover:text-slate-900 relative rounded-xl hover:bg-slate-100 transition cursor-pointer"
              title="Thông báo"
              aria-label="Thông báo"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-[#1A56DB] absolute top-2 right-2 ring-2 ring-white" />
            </button>
          )}

          {/* Chưa đăng nhập: Nút Đăng nhập & Bắt đầu học theo Ảnh 1 */}
          {!isAuthenticated ? (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => openAuth('home')}
                className="px-4 py-2 bg-white text-slate-800 border border-slate-300 rounded-xl text-sm font-semibold hover:bg-slate-50 transition shadow-2xs cursor-pointer"
              >
                Đăng nhập
              </button>
              <button
                onClick={() => openStudentSpace(false)}
                className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition shadow-xs cursor-pointer"
              >
                Bắt đầu học
              </button>
            </div>
          ) : (
            /* Đã đăng nhập: Nút Tài khoản giáo viên / Tài khoản của em kèm dropdown an toàn */
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 transition text-sm font-semibold text-slate-800 cursor-pointer"
              >
                <div className="w-6 h-6 rounded-full bg-[#1A56DB] text-white flex items-center justify-center text-xs">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="hidden sm:inline">
                  {currentView === 'teacher'
                    ? 'Tài khoản giáo viên'
                    : currentView === 'student'
                    ? 'Tài khoản của em'
                    : displayName || 'Tài khoản'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
              </button>

              {/* Menu thả xuống của tài khoản */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 text-sm space-y-1">
                  <div className="p-3 border-b border-slate-100">
                    <div className="font-bold text-slate-900 truncate">{displayName || 'Người dùng'}</div>
                    <div className="text-xs text-slate-500 truncate">{email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {getRoleBadge(primaryRole)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold">● Đã xác thực</span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      openStudentSpace(false);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Home className="w-4 h-4 text-blue-600" />
                    <span>Không gian học sinh</span>
                  </button>

                  <button
                    onClick={() => {
                      openTeacherSpace();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-indigo-600" />
                    <span>Không gian giáo viên</span>
                  </button>

                  <button
                    onClick={() => {
                      openAdminSpace();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 text-purple-900 flex items-center gap-2.5 cursor-pointer font-semibold"
                  >
                    <Shield className="w-4 h-4 text-purple-700" />
                    <span>Quản trị &amp; Thẩm định</span>
                  </button>

                  <button
                    onClick={() => {
                      openAuth();
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 flex items-center gap-2.5 cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Cấu hình & Phiên đăng nhập</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsTechSpecOpen(true);
                      setIsUserMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 text-blue-900 text-xs font-semibold flex items-center gap-2.5 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-blue-700" />
                    <span>Tài liệu kỹ thuật (78 đặc tả)</span>
                  </button>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      onClick={async () => {
                        await logout();
                        setIsUserMenuOpen(false);
                        openHome();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <nav className="flex flex-col gap-1 text-sm font-semibold">
            <button
              onClick={openHome}
              className={`p-2.5 rounded-xl text-left ${currentView === 'home' ? 'bg-[#1A56DB] text-white' : 'hover:bg-slate-100'}`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => openStudentSpace(false)}
              className={`p-2.5 rounded-xl text-left ${currentView === 'student' ? 'bg-[#1A56DB] text-white' : 'hover:bg-slate-100'}`}
            >
              Học sinh
            </button>
            <button
              onClick={openTeacherSpace}
              className={`p-2.5 rounded-xl text-left ${currentView === 'teacher' ? 'bg-[#1A56DB] text-white' : 'hover:bg-slate-100'}`}
            >
              Giáo viên
            </button>
            <button
              onClick={openAdminSpace}
              className={`p-2.5 rounded-xl text-left ${currentView === 'admin' ? 'bg-purple-800 text-white' : 'hover:bg-slate-100'}`}
            >
              Quản trị &amp; Thẩm định
            </button>
            <button
              onClick={() => openStudentSpace(false)}
              className="p-2.5 rounded-xl text-left hover:bg-slate-100"
            >
              Học liệu
            </button>
            <button
              onClick={() => {
                setIsTechSpecOpen(true);
                setIsMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-xl text-left hover:bg-blue-50 text-blue-900 text-xs"
            >
              Tài liệu kỹ thuật (78 đặc tả kiểm thử)
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
