begin;
insert into public.subjects(code,name) values
('toan','Toán'),
('ngu_van','Ngữ văn'),
('ngoai_ngu_1','Ngoại ngữ 1'),
('gdcd','Giáo dục công dân'),
('lich_su_dia_li','Lịch sử và Địa lí'),
('khtn','Khoa học tự nhiên'),
('cong_nghe','Công nghệ'),
('tin_hoc','Tin học'),
('gdtc','Giáo dục thể chất'),
('nghe_thuat','Nghệ thuật'),
('hdtn_hn','Hoạt động trải nghiệm, hướng nghiệp'),
('gddp','Nội dung giáo dục địa phương')
on conflict(code) do nothing;
insert into public.textbooks(code,name) values('KNTT','Kết nối tri thức với cuộc sống') on conflict(code) do nothing;
-- Chỉ tạo khung, KHÔNG tự sinh chương/bài/YCCĐ hoặc nội dung SGK.
insert into public.curricula(grade,subject_id,textbook_id)
select g,s.id,b.id from generate_series(6,9) g cross join public.subjects s cross join public.textbooks b
where b.code='KNTT' on conflict do nothing;
commit;
