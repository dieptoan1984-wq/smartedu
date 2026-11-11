-- ==============================================================================
-- SMART EDU THCS - MIGRATION 003: OPERATIONAL TABLES & ACCESS CONTROL
-- Bổ sung các bảng nghiệp vụ thực thi cho Học sinh, Giáo viên và Hội đồng thẩm định
-- Căn cứ: Bản đặc tả Smart EDU v1.0, 78 mã chức năng, CSDL 001/002
-- Phạm vi: Lớp 6-9, 12 môn học THCS, Bộ sách Kết nối tri thức với cuộc sống
-- ==============================================================================

-- 1. BẢNG LỚP HỌC (CLASSES) & HỌC SINH THAM GIA (CLASS_STUDENTS)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 9),
    academic_year TEXT NOT NULL DEFAULT '2026–2027',
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_classes_grade ON public.classes(grade);

CREATE TABLE IF NOT EXISTS public.class_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(class_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_class_students_class ON public.class_students(class_id);
CREATE INDEX IF NOT EXISTS idx_class_students_student ON public.class_students(student_id);

-- 2. BẢNG BÀI HỌC TƯƠNG TÁC (INTERACTIVE_LESSONS)
-- Lưu trữ gói HTML đóng gói tự do (standalone) được hiển thị trong iframe sandbox an toàn
CREATE TABLE IF NOT EXISTS public.interactive_lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subject_code TEXT NOT NULL,
    grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 9),
    title TEXT NOT NULL,
    chapter_title TEXT NOT NULL,
    description TEXT,
    html_content TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'changes_requested')),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id),
    review_feedback TEXT,
    reviewed_at TIMESTAMPTZ,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lessons_status ON public.interactive_lessons(status);
CREATE INDEX IF NOT EXISTS idx_lessons_grade_subj ON public.interactive_lessons(grade, subject_code);

-- 3. BẢNG NGÂN HÀNG CÂU HỎI (QUESTIONS)
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    grade SMALLINT NOT NULL CHECK (grade BETWEEN 6 AND 9),
    subject_code TEXT NOT NULL,
    chapter_title TEXT NOT NULL,
    question_type TEXT NOT NULL CHECK (question_type IN ('single_choice', 'multiple_choice', 'true_false', 'short_answer', 'essay')),
    prompt TEXT NOT NULL,
    options JSONB,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    points NUMERIC(4, 2) NOT NULL DEFAULT 1.0,
    difficulty TEXT NOT NULL DEFAULT 'thong_hieu' CHECK (difficulty IN ('nhan_biet', 'thong_hieu', 'van_dung', 'van_dung_cao')),
    rubric JSONB,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'changes_requested')),
    author_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    reviewer_id UUID REFERENCES auth.users(id),
    review_feedback TEXT,
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_questions_status ON public.questions(status);
CREATE INDEX IF NOT EXISTS idx_questions_subject ON public.questions(subject_code, grade);

-- 4. BẢNG GIAO BÀI & KIỂM TRA (ASSIGNMENTS & ASSIGNMENT_QUESTIONS)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    test_type TEXT NOT NULL DEFAULT 'regular' CHECK (test_type IN ('practice', 'regular', 'mid_term', 'final_term')),
    duration_minutes INT NOT NULL DEFAULT 45,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    allow_retry BOOLEAN NOT NULL DEFAULT FALSE,
    show_solution_policy TEXT NOT NULL DEFAULT 'after_deadline' CHECK (show_solution_policy IN ('immediately', 'after_deadline', 'manual')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('draft', 'active', 'closed')),
    created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_id);

CREATE TABLE IF NOT EXISTS public.assignment_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    sequence INT NOT NULL,
    points NUMERIC(4, 2) NOT NULL,
    UNIQUE(assignment_id, question_id)
);

-- 5. BẢNG BÀI NỘP & CHẤM ĐIỂM (SUBMISSIONS)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    score NUMERIC(4, 2),
    auto_score NUMERIC(4, 2),
    manual_score NUMERIC(4, 2),
    graded_by UUID REFERENCES auth.users(id),
    teacher_feedback TEXT,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    graded_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);

-- 6. BẢNG HỎI ĐÁP HAI CHIỀU GIỮA HỌC SINH VÀ GIÁO VIÊN (STUDENT_QA)
CREATE TABLE IF NOT EXISTS public.student_qa (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject_code TEXT NOT NULL,
    lesson_title TEXT,
    question_text TEXT NOT NULL,
    answer_text TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'answered')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    answered_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_qa_student ON public.student_qa(student_id);
CREATE INDEX IF NOT EXISTS idx_qa_teacher ON public.student_qa(teacher_id);

-- 7. BẢNG SỔ CÂU SAI & KẾ HOẠCH HỌC TẬP (STUDENT_MISTAKES & STUDY_PLANS)
CREATE TABLE IF NOT EXISTS public.student_mistakes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    prompt TEXT NOT NULL,
    chosen_answer TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    explanation TEXT,
    mistake_reason TEXT,
    is_reviewed BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mistakes_student ON public.student_mistakes(student_id);

CREATE TABLE IF NOT EXISTS public.student_study_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    target_date DATE NOT NULL,
    target_score NUMERIC(3, 1) NOT NULL,
    daily_minutes INT NOT NULL DEFAULT 30,
    reminder_time TEXT DEFAULT '20:00',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_plans_student ON public.student_study_plans(student_id);

-- ==============================================================================
-- CẤU HÌNH ROW LEVEL SECURITY (RLS)
-- ==============================================================================

ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interactive_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignment_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_study_plans ENABLE ROW LEVEL SECURITY;

-- Policy mẫu cho Học sinh đọc bài học đã phê duyệt
CREATE POLICY rls_lessons_student_read ON public.interactive_lessons
    FOR SELECT USING (status = 'approved' OR auth.uid() = author_id);

-- Policy cho Tác giả sửa bài học nháp của mình
CREATE POLICY rls_lessons_author_write ON public.interactive_lessons
    FOR ALL USING (auth.uid() = author_id);

-- Policy cho Giáo viên xem/sửa lớp học của mình
CREATE POLICY rls_classes_teacher ON public.classes
    FOR ALL USING (auth.uid() = teacher_id);

-- Policy cho Học sinh xem lớp mình đang theo học
CREATE POLICY rls_classes_student_read ON public.classes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.class_students
            WHERE class_students.class_id = classes.id
              AND class_students.student_id = auth.uid()
        )
    );

-- Policy cho Học sinh xem bài nộp của chính mình
CREATE POLICY rls_submissions_student ON public.submissions
    FOR ALL USING (auth.uid() = student_id);

-- Policy cho Sổ câu sai của học sinh
CREATE POLICY rls_mistakes_student ON public.student_mistakes
    FOR ALL USING (auth.uid() = student_id);

-- Policy cho Kế hoạch học của học sinh
CREATE POLICY rls_plans_student ON public.student_study_plans
    FOR ALL USING (auth.uid() = student_id);
