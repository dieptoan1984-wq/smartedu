-- Smart EDU 1.0: NỀN TẢNG GIAI ĐOẠN 1. Chỉ chạy một lần trên dự án Supabase MỚI.
-- Không xóa/ghi đè dữ liệu cũ. Không phải cơ sở dữ liệu hoàn chỉnh cho 78 chức năng.
-- Giao diện chỉ được đọc theo RLS, sửa tên cá nhân và ghi chú của mình.
-- Các thao tác giáo viên/nộp bài/chấm/duyệt phải qua backend đã kiểm quyền; chưa có trong SQL này.
begin;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated, service_role;
create table private.user_roles (
 user_id uuid not null references auth.users(id) on delete cascade,
 role text not null check(role in ('student','teacher','reviewer','admin','researcher')),
 primary key(user_id,role)
);
create table private.reviewer_scopes (
 user_id uuid not null references auth.users(id), subject_id uuid not null,
 primary key(user_id,subject_id)
);
create table private.audit_log (
 id bigint generated always as identity primary key, actor_id uuid references auth.users(id),
 action text not null, entity_type text not null, entity_id uuid, details jsonb not null default '{}'::jsonb,
 created_at timestamptz not null default now()
);
create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text not null default '' check(length(display_name)<=120), created_at timestamptz not null default now()
);
create table public.subjects (
 id uuid primary key default gen_random_uuid(), code text unique not null,
 name text not null, active boolean not null default true
);
create table public.textbooks (
 id uuid primary key default gen_random_uuid(), code text unique not null, name text not null
);
create table public.curricula (
 id uuid primary key default gen_random_uuid(), grade smallint not null check(grade between 6 and 9),
 subject_id uuid not null references public.subjects(id), textbook_id uuid not null references public.textbooks(id),
 unique(grade,subject_id,textbook_id)
);
create table public.chapters (
 id uuid primary key default gen_random_uuid(), curriculum_id uuid not null references public.curricula(id),
 code text not null, title text not null, position integer not null check(position>=0), unique(curriculum_id,code)
);
create table public.topics (
 id uuid primary key default gen_random_uuid(), chapter_id uuid not null references public.chapters(id),
 code text not null, title text not null, position integer not null check(position>=0), unique(chapter_id,code)
);
create table public.learning_outcomes (
 id uuid primary key default gen_random_uuid(), curriculum_id uuid not null references public.curricula(id),
 code text not null, description text not null, source text not null, unique(curriculum_id,code)
);
create table public.classes (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null references public.profiles(id),
 name text not null, grade smallint not null check(grade between 6 and 9), school_year text not null,
 archived boolean not null default false, created_at timestamptz not null default now()
);
create table public.class_memberships (
 class_id uuid not null references public.classes(id), user_id uuid not null references public.profiles(id),
 member_role text not null check(member_role in ('student','teacher')), active boolean not null default true,
 primary key(class_id,user_id)
);
create table public.lessons (
 id uuid primary key default gen_random_uuid(), topic_id uuid not null references public.topics(id),
 author_id uuid not null references public.profiles(id), created_at timestamptz not null default now()
);
create table public.lesson_versions (
 id uuid primary key default gen_random_uuid(), lesson_id uuid not null references public.lessons(id),
 version integer not null check(version>0), title text not null, body jsonb not null default '[]'::jsonb,
 source text not null default '', status text not null default 'draft' check(status in ('draft','pending','approved','changes_requested','archived')),
 created_at timestamptz not null default now(), approved_at timestamptz, approved_by uuid references public.profiles(id),
 check(status<>'approved' or (approved_at is not null and approved_by is not null)), unique(lesson_id,version)
);
create table public.questions (
 id uuid primary key default gen_random_uuid(), topic_id uuid not null references public.topics(id),
 author_id uuid not null references public.profiles(id), code text unique not null, created_at timestamptz not null default now()
);
create table public.question_versions (
 id uuid primary key default gen_random_uuid(), question_id uuid not null references public.questions(id),
 version integer not null check(version>0), question_type text not null check(question_type in ('abcd','true_false','short','essay')),
 difficulty text not null check(difficulty in ('biet','hieu','van_dung')), prompt jsonb not null,
 options jsonb not null default '[]'::jsonb, points numeric(8,2) not null check(points>=0), source text not null default '',
 status text not null default 'draft' check(status in ('draft','pending','approved','changes_requested','archived')),
 created_at timestamptz not null default now(), approved_at timestamptz, approved_by uuid references public.profiles(id),
 check(status<>'approved' or (approved_at is not null and approved_by is not null)), unique(question_id,version)
);
create table public.question_outcomes (
 question_version_id uuid not null references public.question_versions(id), outcome_id uuid not null references public.learning_outcomes(id),
 primary key(question_version_id,outcome_id)
);
create table public.question_items (
 id uuid primary key default gen_random_uuid(), question_version_id uuid not null references public.question_versions(id),
 item_key text not null, prompt jsonb not null, difficulty text not null check(difficulty in ('biet','hieu','van_dung')),
 points numeric(8,2) not null check(points>=0), unique(question_version_id,item_key)
);
create table public.assignments (
 id uuid primary key default gen_random_uuid(), class_id uuid not null references public.classes(id),
 author_id uuid not null references public.profiles(id), title text not null, instructions text not null default '',
 opens_at timestamptz not null default now(), due_at timestamptz, status text not null default 'draft' check(status in ('draft','published','closed')),
 check(due_at is null or due_at>opens_at), created_at timestamptz not null default now()
);
create table public.assignment_lessons (
 assignment_id uuid not null references public.assignments(id), lesson_version_id uuid not null references public.lesson_versions(id),
 position integer not null default 0, primary key(assignment_id,lesson_version_id)
);
create table public.assignment_questions (
 assignment_id uuid not null references public.assignments(id), question_version_id uuid not null references public.question_versions(id),
 position integer not null default 0, primary key(assignment_id,question_version_id)
);
create table public.submissions (
 id uuid primary key default gen_random_uuid(), assignment_id uuid not null references public.assignments(id),
 student_id uuid not null references public.profiles(id), status text not null default 'draft' check(status in ('draft','submitted','graded')),
 answers jsonb not null default '{}'::jsonb, revision integer not null default 1 check(revision>0),
 submitted_at timestamptz, created_at timestamptz not null default now(), unique(assignment_id,student_id)
);
create table public.lesson_progress (
 student_id uuid not null references public.profiles(id), lesson_version_id uuid not null references public.lesson_versions(id),
 activity_state jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now(), completed_at timestamptz,
 primary key(student_id,lesson_version_id)
);
create table public.personal_notes (
 id uuid primary key default gen_random_uuid(), owner_id uuid not null default auth.uid() references public.profiles(id),
 lesson_version_id uuid not null references public.lesson_versions(id), body text not null check(length(body)<=20000),
 bookmark boolean not null default false, updated_at timestamptz not null default now()
);

alter table private.reviewer_scopes add foreign key(subject_id) references public.subjects(id);
create table private.answer_keys (
 question_version_id uuid primary key references public.question_versions(id),
 answers jsonb not null, explanation jsonb not null default '{}'::jsonb,
 rubric jsonb not null default '[]'::jsonb
);
create table private.submission_grades (
 submission_id uuid primary key references public.submissions(id), score numeric(8,2) check(score>=0),
 maximum_score numeric(8,2) not null check(maximum_score>0),
 feedback jsonb not null default '{}'::jsonb, graded_by uuid references public.profiles(id),
 released_at timestamptz, check(score is null or score<=maximum_score)
);
-- Helpers không nhận user_id tùy ý: danh tính luôn từ JWT đã xác thực.
create function private.has_role(wanted text) returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from private.user_roles where user_id=auth.uid() and role=wanted) $$;
create function private.teaches(cid uuid) returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from public.classes where id=cid and owner_id=auth.uid())
 or exists(select 1 from public.class_memberships where class_id=cid and user_id=auth.uid() and member_role='teacher' and active) $$;
create function private.enrolled(cid uuid) returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from public.class_memberships where class_id=cid and user_id=auth.uid() and member_role='student' and active) $$;
create function private.reviews_topic(tid uuid) returns boolean language sql stable security definer set search_path=''
as $$ select private.has_role('reviewer') and exists(
 select 1 from public.topics t join public.chapters c on c.id=t.chapter_id
 join public.curricula cu on cu.id=c.curriculum_id
 join private.reviewer_scopes rs on rs.subject_id=cu.subject_id
 where t.id=tid and rs.user_id=auth.uid()) $$;
create function public.current_access() returns jsonb language sql stable security definer set search_path=''
as $$ select jsonb_build_object('user_id',auth.uid(),'roles',coalesce((select jsonb_agg(role) from private.user_roles where user_id=auth.uid()),'[]'::jsonb)) $$;
-- Trigger hồ sơ không sao chép vai trò từ user_metadata.
create function private.on_signup() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id) values(new.id) on conflict do nothing;
 insert into private.user_roles(user_id,role) values(new.id,'student') on conflict do nothing;
 return new;
end $$;
create trigger smart_edu_signup after insert on auth.users for each row execute function private.on_signup();
insert into public.profiles(id) select id from auth.users on conflict do nothing;
insert into private.user_roles(user_id,role) select id,'student' from auth.users on conflict do nothing;
alter table public.profiles enable row level security;
revoke all on public.profiles from anon, authenticated;
grant select on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.subjects enable row level security;
revoke all on public.subjects from anon, authenticated;
grant select on public.subjects to authenticated;
grant all on public.subjects to service_role;
alter table public.textbooks enable row level security;
revoke all on public.textbooks from anon, authenticated;
grant select on public.textbooks to authenticated;
grant all on public.textbooks to service_role;
alter table public.curricula enable row level security;
revoke all on public.curricula from anon, authenticated;
grant select on public.curricula to authenticated;
grant all on public.curricula to service_role;
alter table public.chapters enable row level security;
revoke all on public.chapters from anon, authenticated;
grant select on public.chapters to authenticated;
grant all on public.chapters to service_role;
alter table public.topics enable row level security;
revoke all on public.topics from anon, authenticated;
grant select on public.topics to authenticated;
grant all on public.topics to service_role;
alter table public.learning_outcomes enable row level security;
revoke all on public.learning_outcomes from anon, authenticated;
grant select on public.learning_outcomes to authenticated;
grant all on public.learning_outcomes to service_role;
alter table public.classes enable row level security;
revoke all on public.classes from anon, authenticated;
grant select on public.classes to authenticated;
grant all on public.classes to service_role;
alter table public.class_memberships enable row level security;
revoke all on public.class_memberships from anon, authenticated;
grant select on public.class_memberships to authenticated;
grant all on public.class_memberships to service_role;
alter table public.lessons enable row level security;
revoke all on public.lessons from anon, authenticated;
grant select on public.lessons to authenticated;
grant all on public.lessons to service_role;
alter table public.lesson_versions enable row level security;
revoke all on public.lesson_versions from anon, authenticated;
grant select on public.lesson_versions to authenticated;
grant all on public.lesson_versions to service_role;
alter table public.questions enable row level security;
revoke all on public.questions from anon, authenticated;
grant select on public.questions to authenticated;
grant all on public.questions to service_role;
alter table public.question_versions enable row level security;
revoke all on public.question_versions from anon, authenticated;
grant select on public.question_versions to authenticated;
grant all on public.question_versions to service_role;
alter table public.question_outcomes enable row level security;
revoke all on public.question_outcomes from anon, authenticated;
grant select on public.question_outcomes to authenticated;
grant all on public.question_outcomes to service_role;
alter table public.question_items enable row level security;
revoke all on public.question_items from anon, authenticated;
grant select on public.question_items to authenticated;
grant all on public.question_items to service_role;
alter table public.assignments enable row level security;
revoke all on public.assignments from anon, authenticated;
grant select on public.assignments to authenticated;
grant all on public.assignments to service_role;
alter table public.assignment_lessons enable row level security;
revoke all on public.assignment_lessons from anon, authenticated;
grant select on public.assignment_lessons to authenticated;
grant all on public.assignment_lessons to service_role;
alter table public.assignment_questions enable row level security;
revoke all on public.assignment_questions from anon, authenticated;
grant select on public.assignment_questions to authenticated;
grant all on public.assignment_questions to service_role;
alter table public.submissions enable row level security;
revoke all on public.submissions from anon, authenticated;
grant select on public.submissions to authenticated;
grant all on public.submissions to service_role;
alter table public.lesson_progress enable row level security;
revoke all on public.lesson_progress from anon, authenticated;
grant select on public.lesson_progress to authenticated;
grant all on public.lesson_progress to service_role;
alter table public.personal_notes enable row level security;
revoke all on public.personal_notes from anon, authenticated;
grant select on public.personal_notes to authenticated;
grant all on public.personal_notes to service_role;
alter table private.user_roles enable row level security;
revoke all on private.user_roles from public, anon, authenticated;
grant all on private.user_roles to service_role;
alter table private.reviewer_scopes enable row level security;
revoke all on private.reviewer_scopes from public, anon, authenticated;
grant all on private.reviewer_scopes to service_role;
alter table private.audit_log enable row level security;
revoke all on private.audit_log from public, anon, authenticated;
grant all on private.audit_log to service_role;
alter table private.answer_keys enable row level security;
revoke all on private.answer_keys from public, anon, authenticated;
grant all on private.answer_keys to service_role;
alter table private.submission_grades enable row level security;
revoke all on private.submission_grades from public, anon, authenticated;
grant all on private.submission_grades to service_role;
grant usage, select on all sequences in schema private to service_role;

create function private.reads_lesson(lid uuid) returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from public.lessons l where l.id=lid and (l.author_id=auth.uid() or private.reviews_topic(l.topic_id)
 or exists(select 1 from public.lesson_versions v where v.lesson_id=l.id and v.status='approved'))) $$;
create function private.reads_question(qid uuid) returns boolean language sql stable security definer set search_path=''
as $$ select exists(select 1 from public.questions q where q.id=qid and (q.author_id=auth.uid() or private.reviews_topic(q.topic_id)
 or exists(select 1 from public.question_versions v where v.question_id=q.id and v.status='approved'))) $$;
create policy read_scoped on public.profiles for select to authenticated using (id=auth.uid() or exists(select 1 from public.class_memberships m where m.user_id=profiles.id and m.active and private.teaches(m.class_id)));
create policy read_scoped on public.classes for select to authenticated using (private.teaches(id) or private.enrolled(id));
create policy read_scoped on public.class_memberships for select to authenticated using (user_id=auth.uid() or private.teaches(class_id));
create policy read_scoped on public.lessons for select to authenticated using (private.reads_lesson(id));
create policy read_scoped on public.lesson_versions for select to authenticated using (status='approved' or exists(select 1 from public.lessons l where l.id=lesson_versions.lesson_id and (l.author_id=auth.uid() or private.reviews_topic(l.topic_id))));
create policy read_scoped on public.questions for select to authenticated using (private.reads_question(id));
create policy read_scoped on public.question_versions for select to authenticated using (status='approved' or exists(select 1 from public.questions q where q.id=question_versions.question_id and (q.author_id=auth.uid() or private.reviews_topic(q.topic_id))));
create policy read_scoped on public.question_items for select to authenticated using (exists(select 1 from public.question_versions q where q.id=question_items.question_version_id));
create policy read_scoped on public.question_outcomes for select to authenticated using (exists(select 1 from public.question_versions q where q.id=question_outcomes.question_version_id));
create policy read_scoped on public.assignments for select to authenticated using (private.teaches(class_id) or (status<>'draft' and opens_at<=now() and private.enrolled(class_id)));
create policy read_scoped on public.assignment_lessons for select to authenticated using (exists(select 1 from public.assignments a where a.id=assignment_lessons.assignment_id));
create policy read_scoped on public.assignment_questions for select to authenticated using (exists(select 1 from public.assignments a where a.id=assignment_questions.assignment_id));
create policy read_scoped on public.submissions for select to authenticated using (student_id=auth.uid() or exists(select 1 from public.assignments a where a.id=submissions.assignment_id and private.teaches(a.class_id)));
create policy read_scoped on public.lesson_progress for select to authenticated using (student_id=auth.uid());
create policy read_scoped on public.personal_notes for select to authenticated using (owner_id=auth.uid());
create policy read_scoped on public.subjects for select to authenticated using (true);
create policy read_scoped on public.textbooks for select to authenticated using (true);
create policy read_scoped on public.curricula for select to authenticated using (true);
create policy read_scoped on public.chapters for select to authenticated using (true);
create policy read_scoped on public.topics for select to authenticated using (true);
create policy read_scoped on public.learning_outcomes for select to authenticated using (true);

grant update(display_name) on public.profiles to authenticated;
create policy edit_own_name on public.profiles for update to authenticated using(id=auth.uid()) with check(id=auth.uid());
grant insert(owner_id,lesson_version_id,body,bookmark), update(body,bookmark,updated_at), delete on public.personal_notes to authenticated;
create policy insert_own_note on public.personal_notes for insert to authenticated with check(owner_id=auth.uid() and exists(select 1 from public.lesson_versions v where v.id=lesson_version_id));
create policy update_own_note on public.personal_notes for update to authenticated using(owner_id=auth.uid()) with check(owner_id=auth.uid());
create policy delete_own_note on public.personal_notes for delete to authenticated using(owner_id=auth.uid());
-- Thu EXECUTE mặc định; chỉ công khai các helper cần cho RLS và hàm đọc quyền của chính mình.
revoke all on all functions in schema private from public, anon, authenticated;
grant execute on function private.has_role(text), private.teaches(uuid), private.enrolled(uuid), private.reviews_topic(uuid), private.reads_lesson(uuid), private.reads_question(uuid) to authenticated;
revoke all on function public.current_access() from public, anon;
grant execute on function public.current_access() to authenticated;
create index on public.class_memberships(user_id,class_id) where active;
create index on public.assignments(class_id,status,opens_at);
create index on public.lesson_versions(lesson_id,status);
create index on public.question_versions(question_id,status);
create index on public.submissions(student_id,assignment_id);
comment on schema private is 'Không thêm schema này vào Exposed schemas. Không chứa trong dữ liệu gửi xuống trình duyệt.';
commit;
