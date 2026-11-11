/**
 * Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS
 * Thiết kế giao diện và điều hướng theo 3 ảnh tham chiếu đã được duyệt:
 * 1. Trang chủ (HomeView)
 * 2. Không gian giáo viên (TeacherWorkspaceView)
 * 3. Màn hình học bài tương tác của học sinh (InteractiveLessonView)
 * Căn cứ kỹ thuật: Supabase Auth, CSDL 001_nen_tang.sql & 002_danh_muc.sql, phông Times New Roman 18px.
 */

import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider, useNavigation } from './contexts/NavigationContext';
import { Header } from './components/common/Header';
import { HomeView } from './components/home/HomeView';
import { StudentWorkspaceContainer } from './components/student/StudentWorkspaceContainer';
import { TeacherWorkspaceView } from './components/teacher/TeacherWorkspaceView';
import { AdminWorkspaceContainer } from './components/admin/AdminWorkspaceContainer';
import { LoginView } from './components/auth/LoginView';
import { UnimplementedModal } from './components/common/UnimplementedModal';
import { TechSpecDrawer } from './components/common/TechSpecDrawer';
import { BookOpen, ShieldCheck, FileCode } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { currentView, setIsTechSpecOpen, openStudentSpace, openTeacherSpace } = useNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-serif">
      {/* 1. Header thích ứng thông minh */}
      <Header />

      {/* 2. Thân trang chính - Đổi theo 3 ảnh tham chiếu */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {currentView === 'home' && <HomeView />}

        {currentView === 'student' && <StudentWorkspaceContainer />}

        {currentView === 'teacher' && <TeacherWorkspaceView />}

        {currentView === 'admin' && <AdminWorkspaceContainer />}

        {currentView === 'auth' && (
          <div className="max-w-4xl mx-auto py-4">
            <LoginView />
          </div>
        )}
      </main>

      {/* 3. Chân trang sản phẩm nhã nhặn */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 mt-12 text-xs text-slate-500 font-serif">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <div className="font-bold text-slate-900 text-sm flex items-center justify-center sm:justify-start gap-2">
              <span className="text-[#1A56DB]">Smart EDU</span>
              <span>– Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Phạm vi: Khối lớp 6, 7, 8, 9 và tất cả các môn THCS theo bộ sách Kết nối tri thức với cuộc sống.
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 text-slate-600">
            <button
              onClick={() => openStudentSpace(false)}
              className="hover:text-blue-900 transition cursor-pointer"
            >
              Học sinh
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={openTeacherSpace}
              className="hover:text-blue-900 transition cursor-pointer"
            >
              Giáo viên
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setIsTechSpecOpen(true)}
              className="text-[#1A56DB] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Tài liệu kỹ thuật nội bộ (78 đặc tả &amp; CSDL)</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
          <div>© 2026 Smart EDU. Bản quyền thuộc dự án phát triển học liệu số THCS.</div>
          <div className="italic">Bản thiết kế đề xuất • Nội dung minh họa</div>
        </div>
      </footer>

      {/* 4. Modal thông báo chức năng đang hoàn thiện */}
      <UnimplementedModal />

      {/* 5. Drawer tài liệu kỹ thuật nội bộ (78 đặc tả & CSDL) */}
      <TechSpecDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <NavigationProvider>
        <MainAppContent />
      </NavigationProvider>
    </AuthProvider>
  );
}
