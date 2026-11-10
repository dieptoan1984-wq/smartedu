/**
 * Smart EDU THCS - Navigation Context
 * Điều hướng sản phẩm thực tế theo 3 ảnh tham chiếu:
 * 1. Trang chủ (Home)
 * 2. Không gian giáo viên (Teacher Workspace)
 * 3. Màn hình học bài tương tác của học sinh (Student Interactive Lesson)
 * Đảm bảo tương thích ngược cho các bảng kiểm thử và drawer kỹ thuật
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { FunctionItem } from '../types/smartEduData';

export type AppView = 'home' | 'student' | 'teacher' | 'materials' | 'auth';

export type StudentSubSection =
  | 'dashboard'
  | 'interactive'
  | 'review'
  | 'assessment'
  | 'game'
  | 'progress'
  | 'mistakes'
  | 'plan'
  | 'ask_teacher';

export type TeacherSubSection =
  | 'workspace'
  | 'classes'
  | 'authoring'
  | 'questions'
  | 'test_dossier'
  | 'games'
  | 'grading'
  | 'results'
  | 'shared_materials';

export type MainNavSection = 'ALL' | 'HocSinh' | 'GiaoVien' | 'KiemTra' | 'TroChoi' | 'QuanTri' | 'NghienCuu';
export type ActiveTab =
  | 'home'
  | 'student'
  | 'teacher'
  | 'student_workspace'
  | 'catalog'
  | 'function_detail'
  | 'database_spec'
  | 'ui_boards'
  | 'login'
  | 'demo_roles';

interface NavigationContextType {
  // Điều hướng chính theo 3 ảnh tham chiếu
  currentView: AppView;
  setCurrentView: (view: AppView) => void;

  // Phân hệ học sinh
  studentSection: StudentSubSection;
  setStudentSection: (sec: StudentSubSection) => void;
  isViewingLesson: boolean;
  setIsViewingLesson: (viewing: boolean) => void;

  // Phân hệ giáo viên
  teacherSection: TeacherSubSection;
  setTeacherSection: (sec: TeacherSubSection) => void;
  academicYear: string;
  setAcademicYear: (year: string) => void;

  // Bộ lọc khối lớp & môn học
  selectedGrade: number | 'ALL';
  setSelectedGrade: (grade: number | 'ALL') => void;
  selectedSubjectCode: string;
  setSelectedSubjectCode: (code: string) => void;
  selectedSubject: string | 'ALL';
  setSelectedSubject: (subject: string | 'ALL') => void;
  searchSubject: string;
  setSearchSubject: (query: string) => void;

  // Các phương thức điều hướng nhanh
  openHome: () => void;
  openStudentSpace: (startInteractiveLesson?: boolean) => void;
  openTeacherSpace: () => void;
  openAuth: (redirectView?: AppView) => void;
  openLessonPlayer: () => void;

  // Drawer tài liệu kỹ thuật nội bộ (phục vụ đối soát/nghiệm thu 78 mã)
  isTechSpecOpen: boolean;
  setIsTechSpecOpen: (open: boolean) => void;

  // Modal thông báo chức năng đang hoàn thiện
  unimplementedFeature: string | null;
  setUnimplementedFeature: (featureName: string | null) => void;

  // Mobile menu
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Tương thích ngược cho các component kiểm thử
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeSection: MainNavSection;
  setActiveSection: (section: MainNavSection) => void;
  selectedFunction: FunctionItem | null;
  setSelectedFunction: (fn: FunctionItem | null) => void;
  selectedBoard: string | 'ALL';
  setSelectedBoard: (board: string | 'ALL') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  navigateToFunction: (fn: FunctionItem) => void;
  openStudentWorkspace: () => void;
}

export const STUDENT_SECTION_PATHS: Record<StudentSubSection, string> = {
  dashboard: '/hoc-sinh',
  interactive: '/hoc-sinh/hoc-tuong-tac',
  review: '/hoc-sinh/on-tap',
  assessment: '/hoc-sinh/kiem-tra',
  game: '/hoc-sinh/tro-choi',
  progress: '/hoc-sinh/tien-bo',
  mistakes: '/hoc-sinh/so-cau-sai',
  plan: '/hoc-sinh/ke-hoach',
  ask_teacher: '/hoc-sinh/hoi-giao-vien'
};

const getInitialRouting = (): { view: AppView; section: StudentSubSection; isViewingLesson: boolean } => {
  if (typeof window === 'undefined') {
    return { view: 'home', section: 'dashboard', isViewingLesson: false };
  }
  const pathname = window.location.pathname.toLowerCase();

  if (pathname.startsWith('/giao-vien')) {
    return { view: 'teacher', section: 'dashboard', isViewingLesson: false };
  }
  if (pathname.startsWith('/dang-nhap') || pathname.startsWith('/auth')) {
    return { view: 'auth', section: 'dashboard', isViewingLesson: false };
  }
  if (pathname.startsWith('/hoc-sinh')) {
    if (pathname.includes('/hoc-tuong-tac')) {
      return { view: 'student', section: 'interactive', isViewingLesson: true };
    }
    if (pathname.includes('/on-tap')) {
      return { view: 'student', section: 'review', isViewingLesson: false };
    }
    if (pathname.includes('/kiem-tra')) {
      return { view: 'student', section: 'assessment', isViewingLesson: false };
    }
    if (pathname.includes('/tro-choi')) {
      return { view: 'student', section: 'game', isViewingLesson: false };
    }
    if (pathname.includes('/tien-bo')) {
      return { view: 'student', section: 'progress', isViewingLesson: false };
    }
    if (pathname.includes('/so-cau-sai')) {
      return { view: 'student', section: 'mistakes', isViewingLesson: false };
    }
    if (pathname.includes('/ke-hoach')) {
      return { view: 'student', section: 'plan', isViewingLesson: false };
    }
    if (pathname.includes('/hoi-giao-vien')) {
      return { view: 'student', section: 'ask_teacher', isViewingLesson: false };
    }
    return { view: 'student', section: 'dashboard', isViewingLesson: false };
  }

  return { view: 'home', section: 'dashboard', isViewingLesson: false };
};

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initial = getInitialRouting();
  const [currentView, setCurrentViewState] = useState<AppView>(initial.view);
  const [studentSection, setStudentSectionState] = useState<StudentSubSection>(initial.section);
  const [isViewingLesson, setIsViewingLesson] = useState<boolean>(initial.isViewingLesson);
  const [teacherSection, setTeacherSection] = useState<TeacherSubSection>('workspace');
  const [academicYear, setAcademicYear] = useState<string>('2026–2027');

  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>(6);
  const [selectedSubjectCode, setSelectedSubjectCode] = useState<string>('tin_hoc');
  const [selectedSubject, setSelectedSubject] = useState<string | 'ALL'>('ALL');
  const [searchSubject, setSearchSubject] = useState<string>('');

  const [isTechSpecOpen, setIsTechSpecOpen] = useState<boolean>(false);
  const [unimplementedFeature, setUnimplementedFeature] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Tương thích ngược
  const [activeTab, setActiveTabState] = useState<ActiveTab>('home');
  const [activeSection, setActiveSection] = useState<MainNavSection>('ALL');
  const [selectedFunction, setSelectedFunction] = useState<FunctionItem | null>(null);
  const [selectedBoard, setSelectedBoard] = useState<string | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Đồng bộ URL với browser history
  const updateBrowserUrl = (url: string) => {
    if (typeof window !== 'undefined' && window.location.pathname !== url) {
      window.history.pushState({}, '', url);
    }
  };

  const setCurrentView = (view: AppView) => {
    setCurrentViewState(view);
    if (view === 'home') {
      updateBrowserUrl('/');
      setIsViewingLesson(false);
    } else if (view === 'teacher') {
      updateBrowserUrl('/giao-vien');
      setIsViewingLesson(false);
    } else if (view === 'auth') {
      updateBrowserUrl('/dang-nhap');
    } else if (view === 'student') {
      updateBrowserUrl(STUDENT_SECTION_PATHS[studentSection] || '/hoc-sinh');
    }
  };

  const setStudentSection = (sec: StudentSubSection) => {
    setStudentSectionState(sec);
    setCurrentViewState('student');
    if (sec === 'interactive') {
      setIsViewingLesson(true);
    } else {
      setIsViewingLesson(false);
    }
    const path = STUDENT_SECTION_PATHS[sec] || '/hoc-sinh';
    updateBrowserUrl(path);
  };

  // Lắng nghe sự kiện Back/Forward của trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      const routing = getInitialRouting();
      setCurrentViewState(routing.view);
      setStudentSectionState(routing.section);
      setIsViewingLesson(routing.isViewingLesson);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setActiveTab = (tab: ActiveTab) => {
    setActiveTabState(tab);
    if (tab === 'login') {
      setCurrentView('auth');
    } else if (tab === 'student_workspace') {
      openStudentSpace(false);
    } else if (tab === 'catalog' || tab === 'ui_boards' || tab === 'database_spec') {
      setIsTechSpecOpen(true);
    }
  };

  const openHome = () => {
    setCurrentView('home');
    setActiveTabState('home');
    setIsViewingLesson(false);
    setIsMobileMenuOpen(false);
  };

  const openStudentSpace = (startInteractiveLesson = false) => {
    setCurrentViewState('student');
    setActiveTabState('student_workspace');
    setIsViewingLesson(startInteractiveLesson);
    const targetSec = startInteractiveLesson ? 'interactive' : 'dashboard';
    setStudentSectionState(targetSec);
    updateBrowserUrl(STUDENT_SECTION_PATHS[targetSec]);
    setIsMobileMenuOpen(false);
  };

  const openTeacherSpace = () => {
    setCurrentView('teacher');
    setActiveTabState('teacher');
    setTeacherSection('workspace');
    setIsViewingLesson(false);
    setIsMobileMenuOpen(false);
  };

  const openAuth = () => {
    setCurrentView('auth');
    setActiveTabState('login');
    setIsMobileMenuOpen(false);
  };

  const openLessonPlayer = () => {
    setCurrentViewState('student');
    setActiveTabState('student_workspace');
    setStudentSectionState('interactive');
    setIsViewingLesson(true);
    updateBrowserUrl(STUDENT_SECTION_PATHS.interactive);
    setIsMobileMenuOpen(false);
  };

  const navigateToFunction = (fn: FunctionItem) => {
    setSelectedFunction(fn);
    setIsTechSpecOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <NavigationContext.Provider
      value={{
        currentView,
        setCurrentView,
        studentSection,
        setStudentSection,
        isViewingLesson,
        setIsViewingLesson,
        teacherSection,
        setTeacherSection,
        academicYear,
        setAcademicYear,
        selectedGrade,
        setSelectedGrade,
        selectedSubjectCode,
        setSelectedSubjectCode,
        selectedSubject,
        setSelectedSubject,
        searchSubject,
        setSearchSubject,
        openHome,
        openStudentSpace,
        openTeacherSpace,
        openAuth,
        openLessonPlayer,
        isTechSpecOpen,
        setIsTechSpecOpen,
        unimplementedFeature,
        setUnimplementedFeature,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        activeTab,
        setActiveTab,
        activeSection,
        setActiveSection,
        selectedFunction,
        setSelectedFunction,
        selectedBoard,
        setSelectedBoard,
        searchQuery,
        setSearchQuery,
        navigateToFunction,
        openStudentWorkspace: () => openStudentSpace(false)
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
};

export function useNavigation(): NavigationContextType {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
