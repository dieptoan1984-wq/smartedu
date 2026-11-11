/**
 * TeacherWorkspaceView - Không gian giáo viên Smart EDU (9 Phân hệ theo Ảnh 2 tham chiếu)
 * Phân hệ:
 * 1. Bàn làm việc (workspace)
 * 2. Lớp học của tôi (classes)
 * 3. Soạn bài tương tác (authoring)
 * 4. Ngân hàng câu hỏi (questions)
 * 5. Giao bài & kiểm tra (assignments)
 * 6. Bộ hồ sơ kiểm tra (test_dossier)
 * 7. Trò chơi học tập (games)
 * 8. Chấm bài & kết quả (grading)
 * 9. Trao đổi với học sinh (student_qa)
 */

import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import { teacherDataService } from '../../services/teacherDataService';

import { TeacherDashboardSection } from './sections/TeacherDashboardSection';
import { TeacherClassesSection } from './sections/TeacherClassesSection';
import { TeacherAuthoringSection } from './sections/TeacherAuthoringSection';
import { TeacherQuestionBankSection } from './sections/TeacherQuestionBankSection';
import { TeacherAssignmentsSection } from './sections/TeacherAssignmentsSection';
import { TeacherTestDossierSection } from './sections/TeacherTestDossierSection';
import { TeacherGamesSection } from './sections/TeacherGamesSection';
import { TeacherGradingSection } from './sections/TeacherGradingSection';
import { TeacherStudentQaSection } from './sections/TeacherStudentQaSection';

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
  MessageCircle,
  AlertCircle,
  Menu,
  X,
  ChevronRight,
  Maximize2,
  Minimize2
} from 'lucide-react';

export const TeacherWorkspaceView: React.FC = () => {
  const {
    openHome,
    teacherSection,
    setTeacherSection,
    openLessonPlayer
  } = useNavigation();

  const { isAuthenticated, roles, primaryRole, displayName } = useAuth();

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

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
            className="px-4 py-2 bg-blue-800 text-white font-semibold text-xs rounded-xl hover:bg-blue-900 cursor-pointer"
          >
            Xem trước không gian giáo viên
          </button>
          <button
            onClick={openHome}
            className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold text-xs rounded-xl hover:bg-slate-200 cursor-pointer"
          >
            Quay về Trang chủ
          </button>
        </div>
      </div>
    );
  }

  // Danh mục 9 menu giáo viên
  const navItems = [
    { id: 'workspace', label: 'Bàn làm việc', icon: Home },
    { id: 'classes', label: 'Lớp học của tôi', icon: Users },
    { id: 'authoring', label: 'Soạn bài tương tác', icon: Layers },
    { id: 'questions', label: 'Ngân hàng câu hỏi', icon: HelpCircle },
    { id: 'assignments', label: 'Giao bài & Kiểm tra', icon: ClipboardList },
    { id: 'test_dossier', label: 'Bộ hồ sơ kiểm tra', icon: CheckSquare },
    { id: 'games', label: 'Trò chơi học tập', icon: Gamepad2 },
    { id: 'grading', label: 'Chấm bài & Kết quả', icon: BarChart2 },
    { id: 'student_qa', label: 'Trao đổi với học sinh', icon: MessageCircle }
  ] as const;

  const getSectionTitle = () => {
    switch (teacherSection) {
      case 'workspace': return 'Bàn làm việc';
      case 'classes': return 'Lớp học của tôi';
      case 'authoring': return 'Soạn bài tương tác';
      case 'questions': return 'Ngân hàng câu hỏi';
      case 'assignments': return 'Giao bài & Kiểm tra';
      case 'test_dossier': return 'Bộ hồ sơ kiểm tra';
      case 'games': return 'Trò chơi học tập';
      case 'grading': return 'Chấm bài & Kết quả';
      case 'student_qa': return 'Trao đổi với học sinh';
      default: return 'Bàn làm việc';
    }
  };

  return (
    <div className="font-serif bg-slate-50 min-h-screen flex flex-col">
      {/* 1. THANH BREADCRUMB VÀ ĐIỀU HƯỚNG NHANH TRÊN CÙNG */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-3.5 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-600 flex-wrap">
          <button
            onClick={() => setTeacherSection('workspace')}
            className="flex items-center gap-1.5 font-bold text-[#1A56DB] hover:underline cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Smart EDU Giáo viên</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-900">{getSectionTitle()}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            title={isSidebarCollapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
          >
            {isSidebarCollapsed ? (
              <>
                <Maximize2 className="w-3.5 h-3.5" />
                <span>Mở rộng menu</span>
              </>
            ) : (
              <>
                <Minimize2 className="w-3.5 h-3.5" />
                <span>Thu gọn menu</span>
              </>
            )}
          </button>

          <button
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="lg:hidden p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            aria-label="Mở menu giáo viên"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. BỐ CỤC CHÍNH: MENU TRÁI (9 MỤC) + NỘI DUNG PHÂN HỆ */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* CỘT MENU TRÁI GIÁO VIÊN (ẢNH 2) */}
        <aside
          className={`w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-xs space-y-6 ${
            isSidebarCollapsed ? 'lg:hidden' : 'lg:block'
          } ${isSidebarOpenMobile ? 'block' : 'hidden lg:block'}`}
        >
          <div className="pb-3 border-b border-slate-100">
            <div className="text-[11px] font-bold text-[#1A56DB] uppercase">
              Không gian giáo viên
            </div>
            <div className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {displayName || 'Thầy cô Smart EDU'}
            </div>
            <div className="text-[11px] text-slate-500">Năm học 2026–2027 • Cấp THCS</div>
          </div>

          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = teacherSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setTeacherSection(item.id as any);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center gap-3 cursor-pointer ${
                    isActive
                      ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* NỘI DUNG 9 PHÂN HỆ GIÁO VIÊN */}
        <main className="flex-1 min-w-0 w-full">
          {teacherSection === 'workspace' && <TeacherDashboardSection />}
          {teacherSection === 'classes' && <TeacherClassesSection />}
          {teacherSection === 'authoring' && <TeacherAuthoringSection />}
          {teacherSection === 'questions' && <TeacherQuestionBankSection />}
          {teacherSection === 'assignments' && <TeacherAssignmentsSection />}
          {teacherSection === 'test_dossier' && <TeacherTestDossierSection />}
          {teacherSection === 'games' && <TeacherGamesSection />}
          {teacherSection === 'grading' && <TeacherGradingSection />}
          {teacherSection === 'student_qa' && <TeacherStudentQaSection />}
        </main>
      </div>
    </div>
  );
};
