/**
 * Smart EDU THCS Auth Context
 * Tuân thủ yêu cầu:
 * 1. Dùng hai biến VITE_SUPABASE_URL & VITE_SUPABASE_PUBLISHABLE_KEY. Báo lỗi rõ nếu thiếu, không dùng đăng nhập giả.
 * 2. Đăng ký, đăng nhập, đăng xuất, quên mật khẩu qua Supabase Auth.
 * 3. Sau đăng nhập, gọi RPC current_access() không tham số để lấy quyền thực của tài khoản.
 *    Không lấy quyền từ user_metadata hay chọn giao diện.
 *    Không cho người đăng ký tự chọn admin/teacher/reviewer.
 * 4. Nút "Đổi vai trò" chỉ ở khu vực demo có nhãn rõ. Khu vực thật chỉ hiển thị vai trò do tài khoản cấp.
 * 5. Truy vấn bảng public.subjects để kiểm tra kết nối CSDL thật sau đăng nhập.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { UserRole, SubjectItem, CurriculumItem } from '../types/smartEduData';
import { apiClient } from '../services/apiClient';
import {
  getClientSupabase,
  isClientSupabaseConfigured,
  getClientConfigStatus
} from '../config/supabase';

export interface RpcCurrentAccessResult {
  user_id: string | null;
  roles: string[];
}

export interface SubjectsQueryResult {
  loading: boolean;
  success: boolean;
  data: SubjectItem[] | null;
  count: number;
  error: string | null;
  lastQueriedAt: string | null;
}

export interface CurriculaQueryResult {
  loading: boolean;
  success: boolean;
  data: CurriculumItem[] | null;
  count: number;
  selectedGrade: number | 'ALL';
  error: string | null;
  lastQueriedAt: string | null;
}

export interface AuthContextType {
  // Trạng thái phiên
  loading: boolean;
  isAuthenticated: boolean;
  authMode: 'real' | 'demo' | 'guest';
  supabaseUser: User | null;
  supabaseSession: Session | null;

  // Thông tin định danh & vai trò
  userId: string | null;
  email: string | null;
  displayName: string;
  roles: UserRole[];
  primaryRole: UserRole;
  currentRole: UserRole;

  // Kết quả gọi RPC current_access()
  rpcAccess: {
    loading: boolean;
    data: RpcCurrentAccessResult | null;
    error: string | null;
    lastFetchedAt: string | null;
  };

  // Kết quả truy vấn thử bảng public.subjects
  subjectsTest: SubjectsQueryResult;
  testSubjectsQuery: () => Promise<void>;

  // Kết quả truy vấn bảng public.curricula (lọc môn theo lớp 6–9 và bộ sách)
  curriculaTest: CurriculaQueryResult;
  testCurriculaQuery: (grade?: number) => Promise<void>;

  // Thao tác Supabase Auth thật
  loginSupabase: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpSupabase: (email: string, password: string, fullName: string) => Promise<{
    success: boolean;
    error?: string;
    requiresEmailConfirmation?: boolean;
  }>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;

  // Thao tác Demo (Chỉ dùng trong khu vực có nhãn rõ ràng)
  enterDemoRole: (role: UserRole) => Promise<void>;
  exitDemoMode: () => Promise<void>;

  // Làm mới quyền
  refreshCurrentAccess: () => Promise<void>;

  // Trạng thái cấu hình môi trường
  configStatus: ReturnType<typeof getClientConfigStatus>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<'real' | 'demo' | 'guest'>('guest');
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [supabaseSession, setSupabaseSession] = useState<Session | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('Khách vãng lai');
  const [roles, setRoles] = useState<UserRole[]>(['guest']);
  const [primaryRole, setPrimaryRole] = useState<UserRole>('guest');

  // Trạng thái RPC current_access()
  const [rpcAccess, setRpcAccess] = useState<{
    loading: boolean;
    data: RpcCurrentAccessResult | null;
    error: string | null;
    lastFetchedAt: string | null;
  }>({
    loading: false,
    data: null,
    error: null,
    lastFetchedAt: null
  });

  // Trạng thái truy vấn thử public.subjects
  const [subjectsTest, setSubjectsTest] = useState<SubjectsQueryResult>({
    loading: false,
    success: false,
    data: null,
    count: 0,
    error: null,
    lastQueriedAt: null
  });

  // Trạng thái truy vấn thử public.curricula (lọc môn theo khối lớp 6–9 và bộ sách)
  const [curriculaTest, setCurriculaTest] = useState<CurriculaQueryResult>({
    loading: false,
    success: false,
    data: null,
    count: 0,
    selectedGrade: 'ALL',
    error: null,
    lastQueriedAt: null
  });

  const configStatus = getClientConfigStatus();

  /**
   * Gọi hàm RPC current_access() không tham số từ Supabase
   * Đây là nguồn sự thật duy nhất cho vai trò người dùng trong hệ thống
   */
  const fetchRpcCurrentAccess = useCallback(async (clientUser: User, token: string) => {
    const supabase = getClientSupabase();
    if (!supabase) return;

    setRpcAccess(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Gọi RPC không tham số: select public.current_access();
      const { data, error } = await supabase.rpc('current_access');

      if (error) {
        console.warn('RPC current_access() error:', error);
        setRpcAccess({
          loading: false,
          data: null,
          error: error.message || 'Lỗi khi gọi RPC current_access() trên Supabase.',
          lastFetchedAt: new Date().toLocaleTimeString('vi-VN')
        });

        // Nếu RPC lỗi (ví dụ hàm chưa được grant execute hoặc đang bảo trì),
        // gán vai trò tối thiểu an toàn là student theo trigger private.on_signup()
        setRoles(['student']);
        setPrimaryRole('student');
        return;
      }

      const parsedRoles = (Array.isArray(data?.roles) ? data.roles : []) as UserRole[];
      const validRoles: UserRole[] = parsedRoles.length > 0 ? parsedRoles : ['student'];

      // Quyết định vai trò chính theo thứ tự đặc quyền: admin > reviewer > teacher > researcher > student
      let primary: UserRole = 'student';
      if (validRoles.includes('admin')) primary = 'admin';
      else if (validRoles.includes('reviewer')) primary = 'reviewer';
      else if (validRoles.includes('teacher')) primary = 'teacher';
      else if (validRoles.includes('researcher')) primary = 'researcher';
      else if (validRoles.includes('student')) primary = 'student';

      setRpcAccess({
        loading: false,
        data: {
          user_id: data?.user_id || clientUser.id,
          roles: validRoles
        },
        error: null,
        lastFetchedAt: new Date().toLocaleTimeString('vi-VN')
      });

      setRoles(validRoles);
      setPrimaryRole(primary);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối RPC current_access()';
      setRpcAccess({
        loading: false,
        data: null,
        error: msg,
        lastFetchedAt: new Date().toLocaleTimeString('vi-VN')
      });
      setRoles(['student']);
      setPrimaryRole('student');
    }
  }, []);

  /**
   * Truy vấn thật bảng public.subjects từ Supabase theo đúng schema 001_nen_tang.sql
   * Cột: id, code, name, active (KHÔNG có grade_levels)
   * Chỉ báo kết nối thành công khi truy vấn thực tế thành công
   */
  const testSubjectsQuery = useCallback(async () => {
    const supabase = getClientSupabase();
    if (!supabase) {
      setSubjectsTest({
        loading: false,
        success: false,
        data: null,
        count: 0,
        error: 'Chưa khởi tạo được Supabase Client (kiểm tra VITE_SUPABASE_URL và VITE_SUPABASE_PUBLISHABLE_KEY).',
        lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
      });
      return;
    }

    setSubjectsTest(prev => ({ ...prev, loading: true, error: null }));

    try {
      const { data, error, count } = await supabase
        .from('subjects')
        .select('id, code, name, active', { count: 'exact' })
        .eq('active', true)
        .order('code');

      if (error) {
        setSubjectsTest({
          loading: false,
          success: false,
          data: null,
          count: 0,
          error: `${error.message} (Mã lỗi: ${error.code || 'không rõ'})`,
          lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
        });
      } else {
        setSubjectsTest({
          loading: false,
          success: true,
          data: (data || []) as SubjectItem[],
          count: count ?? (data?.length || 0),
          error: null,
          lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi ngoại lệ khi truy vấn public.subjects';
      setSubjectsTest({
        loading: false,
        success: false,
        data: null,
        count: 0,
        error: msg,
        lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
      });
    }
  }, []);

  /**
   * Truy vấn bảng public.curricula để lọc môn theo khối lớp (6–9) và bộ sách
   * Liên kết: curricula.subject_id -> subjects(id, code, name, active)
   * và curricula.textbook_id -> textbooks(id, code, name)
   */
  const testCurriculaQuery = useCallback(async (grade?: number) => {
    const supabase = getClientSupabase();
    if (!supabase) {
      setCurriculaTest({
        loading: false,
        success: false,
        data: null,
        count: 0,
        selectedGrade: grade ?? 'ALL',
        error: 'Chưa khởi tạo được Supabase Client.',
        lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
      });
      return;
    }

    setCurriculaTest(prev => ({
      ...prev,
      loading: true,
      error: null,
      selectedGrade: grade ?? 'ALL'
    }));

    try {
      let query = supabase
        .from('curricula')
        .select(`
          id,
          grade,
          subject_id,
          textbook_id,
          subjects (id, code, name, active),
          textbooks (id, code, name)
        `, { count: 'exact' });

      if (grade && grade >= 6 && grade <= 9) {
        query = query.eq('grade', grade);
      }

      const { data, error, count } = await query.order('grade');

      if (error) {
        setCurriculaTest({
          loading: false,
          success: false,
          data: null,
          count: 0,
          selectedGrade: grade ?? 'ALL',
          error: `${error.message} (Mã lỗi: ${error.code || 'không rõ'})`,
          lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
        });
      } else {
        setCurriculaTest({
          loading: false,
          success: true,
          data: (data || []) as unknown as CurriculumItem[],
          count: count ?? (data?.length || 0),
          selectedGrade: grade ?? 'ALL',
          error: null,
          lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi truy vấn public.curricula';
      setCurriculaTest({
        loading: false,
        success: false,
        data: null,
        count: 0,
        selectedGrade: grade ?? 'ALL',
        error: msg,
        lastQueriedAt: new Date().toLocaleTimeString('vi-VN')
      });
    }
  }, []);

  /**
   * Khởi tạo trạng thái phiên ban đầu:
   * Kiểm tra phiên Supabase thật trước; KHÔNG tự động đăng nhập giả lập.
   */
  useEffect(() => {
    let isMounted = true;
    const supabase = getClientSupabase();

    async function initSession() {
      setLoading(true);

      // Nếu có Supabase client, kiểm tra phiên thật
      if (supabase && isClientSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session && session.user && isMounted) {
            setAuthMode('real');
            setSupabaseUser(session.user);
            setSupabaseSession(session);
            setUserId(session.user.id);
            setEmail(session.user.email || null);
            const userMeta = session.user.user_metadata || {};
            setDisplayName(userMeta.full_name || session.user.email?.split('@')[0] || 'Học viên Smart EDU');
            apiClient.setToken(session.access_token);

            // Gọi RPC current_access() để lấy vai trò từ DB
            await fetchRpcCurrentAccess(session.user, session.access_token);

            // Tự động kiểm tra truy vấn bảng subjects
            testSubjectsQuery();
            setLoading(false);
            return;
          }
        } catch (err) {
          console.warn('Lỗi kiểm tra phiên Supabase ban đầu:', err);
        }
      }

      // Kiểm tra xem có token demo cũ không
      const savedToken = apiClient.getToken();
      if (savedToken && savedToken.startsWith('demo-') && isMounted) {
        const role = savedToken.replace('demo-', '') as UserRole;
        setAuthMode('demo');
        setUserId(`demo-${role}`);
        setEmail(`demo.${role}@smartedu.vn`);
        setDisplayName(`Tài khoản Demo [${role.toUpperCase()}]`);
        setRoles([role]);
        setPrimaryRole(role);
        setLoading(false);
        return;
      }

      // Mặc định: Chưa đăng nhập (khách vãng lai)
      if (isMounted) {
        setAuthMode('guest');
        setSupabaseUser(null);
        setSupabaseSession(null);
        setUserId(null);
        setEmail(null);
        setDisplayName('Khách vãng lai');
        setRoles(['guest']);
        setPrimaryRole('guest');
        apiClient.setToken(null);
        setLoading(false);
      }
    }

    initSession();

    // Lắng nghe thay đổi phiên Supabase Auth
    let authListener: { subscription: { unsubscribe: () => void } } | null = null;
    if (supabase) {
      const { data: subData } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (!isMounted) return;

        if (event === 'SIGNED_IN' && session?.user) {
          setAuthMode('real');
          setSupabaseUser(session.user);
          setSupabaseSession(session);
          setUserId(session.user.id);
          setEmail(session.user.email || null);
          const meta = session.user.user_metadata || {};
          setDisplayName(meta.full_name || session.user.email?.split('@')[0] || 'Học viên Smart EDU');
          apiClient.setToken(session.access_token);
          await fetchRpcCurrentAccess(session.user, session.access_token);
          testSubjectsQuery();
        } else if (event === 'SIGNED_OUT') {
          setAuthMode('guest');
          setSupabaseUser(null);
          setSupabaseSession(null);
          setUserId(null);
          setEmail(null);
          setDisplayName('Khách vãng lai');
          setRoles(['guest']);
          setPrimaryRole('guest');
          setRpcAccess({ loading: false, data: null, error: null, lastFetchedAt: null });
          apiClient.setToken(null);
        }
      });
      authListener = subData;
    }

    return () => {
      isMounted = false;
      if (authListener) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [fetchRpcCurrentAccess, testSubjectsQuery]);

  /**
   * Đăng nhập thật bằng Supabase Auth
   */
  const loginSupabase = async (userEmail: string, pass: string) => {
    const supabase = getClientSupabase();
    if (!supabase || !isClientSupabaseConfigured()) {
      return {
        success: false,
        error: 'Chưa cấu hình biến môi trường VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail.trim(),
        password: pass
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.session && data.user) {
        setAuthMode('real');
        setSupabaseUser(data.user);
        setSupabaseSession(data.session);
        setUserId(data.user.id);
        setEmail(data.user.email || null);
        const meta = data.user.user_metadata || {};
        setDisplayName(meta.full_name || data.user.email?.split('@')[0] || 'Học viên Smart EDU');
        apiClient.setToken(data.session.access_token);

        // Gọi ngay RPC current_access() không tham số
        await fetchRpcCurrentAccess(data.user, data.session.access_token);

        // Truy vấn kiểm tra bảng subjects
        testSubjectsQuery();

        return { success: true };
      }

      return { success: false, error: 'Không nhận được phiên đăng nhập hợp lệ từ máy chủ Supabase.' };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi kết nối Supabase Auth';
      return { success: false, error: msg };
    }
  };

  /**
   * Đăng ký thật qua Supabase Auth
   * Không cho người đăng ký tự chọn vai trò (Trigger private.on_signup sẽ cấp vai trò student)
   */
  const signUpSupabase = async (userEmail: string, pass: string, fullName: string) => {
    const supabase = getClientSupabase();
    if (!supabase || !isClientSupabaseConfigured()) {
      return {
        success: false,
        error: 'Chưa cấu hình biến môi trường VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY.'
      };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: userEmail.trim(),
        password: pass,
        options: {
          data: {
            full_name: fullName.trim()
            // Tuyệt đối KHÔNG đưa vai trò vào metadata ở đây
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Kiểm tra nếu cần xác thực email (chưa có session tức thì)
      const requiresEmailConfirmation = !data.session;

      if (data.session && data.user) {
        setAuthMode('real');
        setSupabaseUser(data.user);
        setSupabaseSession(data.session);
        setUserId(data.user.id);
        setEmail(data.user.email || null);
        setDisplayName(fullName.trim() || data.user.email?.split('@')[0] || 'Học viên Smart EDU');
        apiClient.setToken(data.session.access_token);

        await fetchRpcCurrentAccess(data.user, data.session.access_token);
        testSubjectsQuery();
      }

      return {
        success: true,
        requiresEmailConfirmation
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi gửi yêu cầu đăng ký';
      return { success: false, error: msg };
    }
  };

  /**
   * Quên mật khẩu qua Supabase Auth
   */
  const resetPassword = async (userEmail: string) => {
    const supabase = getClientSupabase();
    if (!supabase || !isClientSupabaseConfigured()) {
      return {
        success: false,
        error: 'Chưa cấu hình biến môi trường VITE_SUPABASE_URL hoặc VITE_SUPABASE_PUBLISHABLE_KEY.'
      };
    }

    try {
      const redirectTo = typeof window !== 'undefined' ? window.location.origin : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail.trim(), {
        redirectTo
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return {
        success: true,
        message: 'Liên kết đặt lại mật khẩu đã được gửi tới email của bạn. Vui lòng kiểm tra hộp thư đến.'
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Lỗi khi gửi yêu cầu khôi phục mật khẩu';
      return { success: false, error: msg };
    }
  };

  /**
   * Đăng xuất hệ thống
   */
  const logout = async () => {
    const supabase = getClientSupabase();
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch {
        // bỏ qua
      }
    }

    apiClient.setToken(null);
    setAuthMode('guest');
    setSupabaseUser(null);
    setSupabaseSession(null);
    setUserId(null);
    setEmail(null);
    setDisplayName('Khách vãng lai');
    setRoles(['guest']);
    setPrimaryRole('guest');
    setRpcAccess({ loading: false, data: null, error: null, lastFetchedAt: null });
    setSubjectsTest({
      loading: false,
      success: false,
      data: null,
      count: 0,
      error: null,
      lastQueriedAt: null
    });
  };

  /**
   * Kích hoạt chế độ Demo (Chỉ dùng kiểm thử giao diện trong khu vực có nhãn rõ)
   */
  const enterDemoRole = async (role: UserRole) => {
    setAuthMode('demo');
    setSupabaseUser(null);
    setSupabaseSession(null);
    setUserId(`demo-${role}`);
    setEmail(`demo.${role}@smartedu.vn`);
    setDisplayName(`Tài khoản Demo [${role.toUpperCase()}]`);
    setRoles([role]);
    setPrimaryRole(role);
    apiClient.setToken(`demo-${role}`);
    setRpcAccess({
      loading: false,
      data: {
        user_id: `demo-${role}`,
        roles: [role]
      },
      error: null,
      lastFetchedAt: new Date().toLocaleTimeString('vi-VN')
    });
  };

  /**
   * Thoát khỏi chế độ Demo
   */
  const exitDemoMode = async () => {
    await logout();
  };

  const refreshCurrentAccess = async () => {
    if (supabaseUser && supabaseSession) {
      await fetchRpcCurrentAccess(supabaseUser, supabaseSession.access_token);
      await testSubjectsQuery();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthenticated: authMode === 'real' || authMode === 'demo',
        authMode,
        supabaseUser,
        supabaseSession,
        userId,
        email,
        displayName,
        roles,
        primaryRole,
        currentRole: primaryRole,
        rpcAccess,
        subjectsTest,
        testSubjectsQuery,
        curriculaTest,
        testCurriculaQuery,
        loginSupabase,
        signUpSupabase,
        resetPassword,
        logout,
        enterDemoRole,
        exitDemoMode,
        refreshCurrentAccess,
        configStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
