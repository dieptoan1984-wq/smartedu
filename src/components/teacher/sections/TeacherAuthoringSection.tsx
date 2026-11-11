/**
 * Smart EDU THCS - Giáo viên: Mục 3. Soạn bài học tương tác (TeacherAuthoringSection)
 * Quy trình:
 * 1. Nhập file HTML độc lập (hoặc soạn mã HTML)
 * 2. Gắn Khối lớp (6-9), Môn học THCS, Bộ sách (KNTT), Chương và Tên bài
 * 3. Xem trước (Preview) an toàn trong iframe sandbox="allow-scripts allow-modals"
 * 4. Lưu bản nháp (draft), quản lí số phiên bản (version 1, 2...)
 * 5. Gửi duyệt chuyên môn (chuyển sang pending để Người duyệt thẩm định)
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  teacherDataService,
  TeacherLessonDraft
} from '../../../services/teacherDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  Layers,
  Upload,
  Eye,
  Save,
  Send,
  FileCode,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  BookOpen,
  ChevronRight,
  ShieldCheck,
  Maximize2
} from 'lucide-react';

export const TeacherAuthoringSection: React.FC = () => {
  const { displayName, userId } = useAuth();
  const [lessons, setLessons] = useState<TeacherLessonDraft[]>(() => teacherDataService.getLessons());

  // Form soạn thảo bài học
  const [title, setTitle] = useState('');
  const [subjectCode, setSubjectCode] = useState('tin_hoc');
  const [grade, setGrade] = useState<number>(6);
  const [chapterTitle, setChapterTitle] = useState('Chủ đề 1: Máy tính và cộng đồng');
  const [lessonCode, setLessonCode] = useState('TH6_CD1_B1');
  const [htmlContent, setHtmlContent] = useState('');
  const [source, setSource] = useState('Biên soạn theo SGK Tin học 6 - Kết nối tri thức');

  // Preview trong modal
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  const refreshLessons = () => {
    setLessons(teacherDataService.getLessons());
  };

  // Tải file HTML từ máy tính giáo viên
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      alert('Vui lòng chọn tệp định dạng .html hoặc .htm');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setHtmlContent(content);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      setSaveMessage('✓ Đã tải tệp HTML thành công vào trình soạn thảo.');
      setTimeout(() => setSaveMessage(null), 3500);
    };
    reader.readAsText(file, 'UTF-8');
  };

  // Lưu bản nháp
  const handleSaveDraft = (status: 'draft' | 'pending' = 'draft') => {
    if (!title.trim() || !htmlContent.trim()) {
      alert('Vui lòng nhập tiêu đề bài học và nội dung mã HTML bài học.');
      return;
    }

    teacherDataService.saveLessonDraft({
      lessonId: `ls_${Date.now()}`,
      title: title.trim(),
      subjectCode,
      grade: Number(grade),
      textbookCode: 'KNTT',
      chapterId: 'chuong_1',
      chapterTitle: chapterTitle.trim(),
      lessonCode: lessonCode.trim() || `LS_${Date.now()}`,
      htmlContent: htmlContent.trim(),
      source: source.trim(),
      status,
      authorId: userId || 'gv_demo',
      authorName: displayName || 'Thầy cô bộ môn'
    });

    setSaveMessage(
      status === 'pending'
        ? '✓ Đã gửi bài học lên hội đồng thẩm định chuyên môn thành công.'
        : '✓ Đã lưu bản nháp bài học thành công trên hệ thống.'
    );
    setTimeout(() => setSaveMessage(null), 4000);
    refreshLessons();
  };

  // Mở bài học cũ để chỉnh sửa
  const handleLoadLessonToEdit = (ls: TeacherLessonDraft) => {
    setTitle(ls.title);
    setSubjectCode(ls.subjectCode);
    setGrade(ls.grade);
    setChapterTitle(ls.chapterTitle);
    setLessonCode(ls.lessonCode);
    setHtmlContent(ls.htmlContent);
    setSource(ls.source);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Xem trước bài học
  const handleOpenPreview = () => {
    if (!htmlContent.trim()) {
      alert('Chưa có nội dung HTML để xem trước.');
      return;
    }
    setPreviewHtml(htmlContent);
    setIsPreviewOpen(true);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & Giới thiệu */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 3 · Soạn bài tương tác &amp; Quản lí phiên bản
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Biên soạn học liệu tương tác
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Nhập bài học HTML độc lập, gắn danh mục SGK Kết nối tri thức, xem trước trong sandbox và gửi duyệt chuyên môn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="px-4 py-2.5 bg-blue-50 text-[#1A56DB] hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs">
            <Upload className="w-4 h-4" />
            <span>Tải file .html lên</span>
            <input
              type="file"
              accept=".html,.htm"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* KHUNG SOẠN THẢO CHÍNH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT TRÁI (8 CỘT): Form nhập liệu & Mã HTML */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileCode className="w-5 h-5 text-[#1A56DB]" />
            <span>Thông tin học liệu &amp; Mã nguồn bài học</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tên bài học: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Bài 1: Thông tin và dữ liệu"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB] text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Khối lớp THCS:
              </label>
              <select
                value={grade}
                onChange={e => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB] text-xs font-semibold"
              >
                {[6, 7, 8, 9].map(g => (
                  <option key={g} value={g}>Lớp {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Môn học:
              </label>
              <select
                value={subjectCode}
                onChange={e => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB] text-xs font-semibold"
              >
                {THCS_SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Bộ sách:
              </label>
              <input
                type="text"
                readOnly
                value="Kết nối tri thức với cuộc sống (KNTT)"
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Mã định danh bài:
              </label>
              <input
                type="text"
                placeholder="TH6_CD1_B1"
                value={lessonCode}
                onChange={e => setLessonCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Chương / Chủ đề:
              </label>
              <input
                type="text"
                placeholder="Chủ đề 1: Máy tính và cộng đồng"
                value={chapterTitle}
                onChange={e => setChapterTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Mã nguồn bài học HTML độc lập: <span className="text-red-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400">
                HTML + CSS + JS khép kín (Self-contained)
              </span>
            </div>
            <textarea
              rows={12}
              required
              placeholder="Dán mã HTML bài học tương tác tại đây (bao gồm thẻ <html>, <style>, <script> đầy đủ)..."
              value={htmlContent}
              onChange={e => setHtmlContent(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-100 rounded-xl border border-slate-700 focus:outline-hidden focus:border-blue-400"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleOpenPreview}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-blue-700" />
              <span>Xem trước trong Sandbox</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleSaveDraft('draft')}
                className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Lưu bản nháp</span>
              </button>

              <button
                type="button"
                onClick={() => handleSaveDraft('pending')}
                className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Gửi thẩm định duyệt</span>
              </button>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI (4 CỘT): Danh sách bài học của tôi & Trạng thái thẩm định */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">Học liệu đã tạo ({lessons.length})</span>
            </div>

            <div className="space-y-3 max-h-[550px] overflow-y-auto">
              {lessons.map(ls => (
                <div
                  key={ls.id}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-blue-300 transition space-y-2"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded">
                      {ls.subjectCode.toUpperCase()} • Lớp {ls.grade}
                    </span>

                    {ls.status === 'approved' ? (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        ● Đã duyệt (v{ls.version})
                      </span>
                    ) : ls.status === 'pending' ? (
                      <span className="text-[10px] font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-full">
                        ● Chờ duyệt (v{ls.version})
                      </span>
                    ) : ls.status === 'changes_requested' ? (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-full">
                        ▲ Yêu cầu sửa
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                        ● Bản nháp (v{ls.version})
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 leading-snug">
                    {ls.title}
                  </h3>

                  {ls.reviewFeedback && (
                    <div className="p-2 bg-rose-50 border border-rose-200 rounded text-[11px] text-rose-900">
                      <strong>Nhận xét duyệt:</strong> {ls.reviewFeedback}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                    <span className="text-slate-400">
                      {new Date(ls.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    <button
                      onClick={() => handleLoadLessonToEdit(ls)}
                      className="text-[#1A56DB] hover:underline font-bold"
                    >
                      Sửa bài này →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL XEM TRƯỚC BÀI HỌC HTML AN TOÀN */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900">
                  Xem trước bài học trong Sandbox: {title || 'Bài học tương tác'}
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-3 py-1 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 cursor-pointer"
              >
                Đóng lại
              </button>
            </div>

            <div className="flex-1 w-full bg-slate-50">
              <iframe
                srcDoc={previewHtml}
                title="Preview Lesson"
                sandbox="allow-scripts allow-modals"
                className="w-full h-full border-0"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
