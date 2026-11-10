/**
 * Smart EDU THCS - Không gian học sinh (Student Workspace Container)
 * Điều phối 9 phân hệ chức năng học tập thực tế của học sinh THCS (Ảnh 3):
 * 1. Góc học tập (Dashboard)
 * 2. Học tương tác (Interactive Lessons & Scaffolding)
 * 3. Ôn tập (Review theo chương & đề cương)
 * 4. Kiểm tra (Online Assessment & Countdown)
 * 5. Trò chơi (Educational Games)
 * 6. Tiến bộ của em (Analytics & Progress)
 * 7. Sổ câu sai (Mistakes Notebook)
 * 8. Kế hoạch học (Study Plans & Schedule)
 * 9. Hỏi giáo viên (Q&A with Teachers)
 * 
 * Thiết kế: Xanh công nghệ (#1A56DB), Times New Roman, 18px base typography.
 */

import React, { useState, useEffect } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import { studentDataService } from '../../services/studentDataService';

// 9 Phân hệ chức năng học sinh
import { StudentDashboardSection } from './sections/StudentDashboardSection';
import { InteractiveLessonSection } from './sections/InteractiveLessonSection';
import { ReviewSection } from './sections/ReviewSection';
import { AssessmentSection } from './sections/AssessmentSection';
import { GameSection } from './sections/GameSection';
import { ProgressSection } from './sections/ProgressSection';
import { MistakesSection } from './sections/MistakesSection';
import { PlanSection } from './sections/PlanSection';
import { AskTeacherSection } from './sections/AskTeacherSection';

import {
  Home,
  Laptop,
  BookOpen,
  ClipboardList,
  Gamepad2,
  BarChart2,
  Bookmark,
  Calendar,
  MessageCircle,
  Menu,
  X,
  ChevronRight,
  Maximize2,
  Minimize2,
  ShieldCheck,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const StudentWorkspaceContainer: React.FC = () => {
  const {
    studentSection,
    setStudentSection,
    selectedGrade,
    selectedSubjectCode
  } = useNavigation();

  const { userId, displayName } = useAuth();

  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Thống kê nhanh để hiển thị badge số lượng
  const [mistakesCount, setMistakesCount] = useState(0);
  const [pendingPlansCount, setPendingPlansCount] = useState(0);
  const [unresolvedQuestionsCount, setUnresolvedQuestionsCount] = useState(0);

  useEffect(() => {
    const mistakes = studentDataService.getMistakes(userId);
    setMistakesCount(mistakes.filter(m => m.status === 'need_review').length);

    const plans = studentDataService.getPlans(userId);
    setPendingPlansCount(plans.filter(p => !p.completed).length);

    const questions = studentDataService.getTeacherQuestions(userId);
    setUnresolvedQuestionsCount(questions.filter(q => q.status === 'answered').length);
  }, [userId, studentSection]);

  const navItems = [
    {
      id: 'dashboard',
      label: 'Góc học tập',
      icon: Home,
      badge: null
    },
    {
      id: 'interactive',
      label: 'Học tương tác',
      icon: Laptop,
      badge: 'Mới'
    },
    {
      id: 'review',
      label: 'Ôn tập',
      icon: BookOpen,
      badge: null
    },
    {
      id: 'assessment',
      label: 'Kiểm tra',
      icon: ClipboardList,
      badge: null
    },
    {
      id: 'game',
      label: 'Trò chơi',
      icon: Gamepad2,
      badge: null
    },
    {
      id: 'progress',
      label: 'Tiến bộ của em',
      icon: BarChart2,
      badge: null
    },
    {
      id: 'mistakes',
      label: 'Sổ câu sai',
      icon: Bookmark,
      badge: mistakesCount > 0 ? `${mistakesCount}` : null
    },
    {
      id: 'plan',
      label: 'Kế hoạch học',
      icon: Calendar,
      badge: pendingPlansCount > 0 ? `${pendingPlansCount}` : null
    }
  ] as const;

  const getSectionTitle = () => {
    switch (studentSection) {
      case 'dashboard': return 'Góc học tập';
      case 'interactive': return 'Học tương tác';
      case 'review': return 'Ôn tập';
      case 'assessment': return 'Kiểm tra';
      case 'game': return 'Trò chơi học tập';
      case 'progress': return 'Tiến bộ của em';
      case 'mistakes': return 'Sổ câu sai';
      case 'plan': return 'Kế hoạch học';
      case 'ask_teacher': return 'Hỏi giáo viên';
      default: return 'Góc học tập';
    }
  };

  return (
    <div className="font-serif">
      {/* 1. THANH BREADCRUMB VÀ ĐIỀU HƯỚNG NHANH TRÊN CÙNG (ẢNH 3) */}
      <div className="bg-white border border-slate-200 rounded-2xl px-4 sm:px-6 py-3.5 mb-6 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-slate-600 flex-wrap">
          <button
            onClick={() => setStudentSection('dashboard')}
            className="flex items-center gap-1.5 font-bold text-[#1A56DB] hover:underline cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Smart EDU Học sinh</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-semibold text-slate-700">Lớp {selectedGrade || 6}</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
          <span className="font-bold text-slate-900">{getSectionTitle()}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Nút bật tắt thu gọn menu trên desktop */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden lg:flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition cursor-pointer"
            title={isSidebarCollapsed ? 'Mở rộng thanh menu' : 'Thu gọn thanh menu để xem rộng hơn'}
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

          {/* Nút menu di động */}
          <button
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="lg:hidden p-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition cursor-pointer"
            aria-label="Mở danh mục menu"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. BỐ CỤC CHÍNH: MENU TRÁI (9 MỤC) + NỘI DUNG PHÂN HỆ */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* CỘT MENU TRÁI (ẢNH 3 - BẢN THIẾT KẾ ĐÃ DUYỆT) */}
        <aside
          className={`w-full lg:w-64 bg-white border border-slate-200 rounded-2xl p-4 shrink-0 shadow-xs space-y-6 ${
            isSidebarCollapsed ? 'lg:hidden' : 'lg:block'
          } ${isSidebarOpenMobile ? 'block' : 'hidden lg:block'}`}
        >
          {/* Lời chào học sinh thu nhỏ */}
          <div className="pb-3 border-b border-slate-100">
            <div className="text-[11px] font-bold text-[#1A56DB] uppercase">
              Không gian học sinh
            </div>
            <div className="font-bold text-sm text-slate-900 truncate mt-0.5">
              {displayName || 'Học sinh Smart EDU'}
            </div>
            <div className="text-[11px] text-slate-500">Khối lớp {selectedGrade || 6} THCS</div>
          </div>

          {/* 8 Nút chức năng chính */}
          <nav className="space-y-1 text-sm font-semibold text-slate-700">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = studentSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setStudentSection(item.id as any);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl transition flex items-center justify-between cursor-pointer ${
                    isActive
                      ? 'bg-[#1A56DB] text-white shadow-xs font-bold'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white text-[#1A56DB]'
                          : item.id === 'mistakes'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-blue-100 text-[#1A56DB]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Nút 9: Hỏi giáo viên (Vị trí đặc biệt nổi bật dưới menu) */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => {
                setStudentSection('ask_teacher');
                setIsSidebarOpenMobile(false);
              }}
              className={`w-full py-2.5 px-3.5 rounded-xl text-sm font-bold transition flex items-center justify-between cursor-pointer shadow-2xs ${
                studentSection === 'ask_teacher'
                  ? 'bg-[#1A56DB] text-white'
                  : 'bg-blue-50 text-blue-900 border border-blue-200 hover:bg-blue-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <MessageCircle className={`w-4 h-4 ${studentSection === 'ask_teacher' ? 'text-white' : 'text-[#1A56DB]'}`} />
                <span>Hỏi giáo viên</span>
              </div>

              {unresolvedQuestionsCount > 0 && (
                <span className="text-[10px] bg-blue-600 text-white px-1.5 py-0.2 rounded-full">
                  {unresolvedQuestionsCount}
                </span>
              )}
            </button>
          </div>
        </aside>

        {/* KHÔNG GIAN NỘI DUNG 9 PHÂN HỆ HỌC SINH */}
        <main className="flex-1 min-w-0 w-full">
          {studentSection === 'dashboard' && <StudentDashboardSection />}
          {studentSection === 'interactive' && <InteractiveLessonSection />}
          {studentSection === 'review' && <ReviewSection />}
          {studentSection === 'assessment' && <AssessmentSection />}
          {studentSection === 'game' && <GameSection />}
          {studentSection === 'progress' && <ProgressSection />}
          {studentSection === 'mistakes' && <MistakesSection />}
          {studentSection === 'plan' && <PlanSection />}
          {studentSection === 'ask_teacher' && <AskTeacherSection />}
        </main>
      </div>
    </div>
  );
};
