/**
 * Smart EDU THCS - Giáo viên: Mục 4. Ngân hàng câu hỏi (TeacherQuestionBankSection)
 * Chức năng:
 * - Biên soạn câu hỏi 4 dạng: Nhiều lựa chọn (abcd), Đúng-sai (true_false), Trả lời ngắn (short), Tự luận (essay)
 * - Mức độ tư duy: Biết (Nhận biết), Hiểu (Thông hiểu), Vận dụng
 * - Thiết lập điểm số, đáp án, giải thích, hướng dẫn chấm (rubric)
 * - Nhập câu hỏi từ định dạng mẫu thực tế (CSV/Template) với kiểm tra lỗi từng dòng
 * - Gửi thẩm định chuyên môn & theo dõi phản hồi
 */

import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import {
  teacherDataService,
  TeacherQuestionDraft
} from '../../../services/teacherDataService';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  HelpCircle,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Eye,
  Send,
  Save,
  Trash2,
  Sparkles,
  Download,
  Filter
} from 'lucide-react';

export const TeacherQuestionBankSection: React.FC = () => {
  const { displayName, userId } = useAuth();
  const [questions, setQuestions] = useState<TeacherQuestionDraft[]>(() => teacherDataService.getQuestions());

  // Bộ lọc danh sách
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');

  // Chế độ mở form: 'none' | 'create' | 'import'
  const [modalMode, setModalMode] = useState<'none' | 'create' | 'import'>('none');
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Form tạo câu hỏi đơn
  const [code, setCode] = useState(`TH6_${Date.now().toString().slice(-4)}`);
  const [subjectCode, setSubjectCode] = useState('tin_hoc');
  const [grade, setGrade] = useState<number>(6);
  const [chapterTitle, setChapterTitle] = useState('Chủ đề 1: Máy tính và cộng đồng');
  const [lessonTitle, setLessonTitle] = useState('Bài 1: Thông tin và dữ liệu');
  const [questionType, setQuestionType] = useState<'abcd' | 'true_false' | 'short' | 'essay'>('abcd');
  const [difficulty, setDifficulty] = useState<'biet' | 'hieu' | 'van_dung'>('biet');
  const [prompt, setPrompt] = useState('');
  const [points, setPoints] = useState<number>(2.5);
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [explanation, setExplanation] = useState('');
  const [rubric, setRubric] = useState('');

  // 4 lựa chọn cho ABCD
  const [optA, setOptA] = useState('');
  const [optB, setOptB] = useState('');
  const [optC, setOptC] = useState('');
  const [optD, setOptD] = useState('');

  // Dữ liệu nhập hàng loạt (Bulk Import CSV)
  const [csvText, setCsvText] = useState('');
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [previewImportItems, setPreviewImportItems] = useState<any[]>([]);

  const refreshList = () => {
    setQuestions(teacherDataService.getQuestions());
  };

  const handleCreateQuestion = (e: React.FormEvent, status: 'draft' | 'pending' = 'draft') => {
    e.preventDefault();
    if (!prompt.trim() || !correctAnswer.trim()) {
      alert('Vui lòng nhập nội dung câu hỏi và đáp án đúng.');
      return;
    }

    let options: Array<{ key: string; text: string }> | undefined = undefined;
    if (questionType === 'abcd') {
      options = [
        { key: 'A', text: optA.trim() },
        { key: 'B', text: optB.trim() },
        { key: 'C', text: optC.trim() },
        { key: 'D', text: optD.trim() }
      ];
    } else if (questionType === 'true_false') {
      options = [
        { key: 'D', text: 'Đúng' },
        { key: 'S', text: 'Sai' }
      ];
    }

    teacherDataService.saveQuestion({
      code: code.trim(),
      subjectCode,
      grade: Number(grade),
      chapterId: 'chuong_1',
      chapterTitle: chapterTitle.trim(),
      lessonTitle: lessonTitle.trim(),
      questionType,
      difficulty,
      prompt: prompt.trim(),
      options,
      correctAnswer: correctAnswer.trim(),
      explanation: explanation.trim(),
      points: Number(points) || 2.5,
      rubric: rubric.trim() || undefined,
      source: 'Biên soạn theo SGK Kết nối tri thức',
      status,
      authorId: userId || 'gv_demo',
      authorName: displayName || 'Giáo viên THCS'
    });

    setSaveMessage(
      status === 'pending'
        ? '✓ Đã tạo câu hỏi và gửi duyệt thẩm định thành công.'
        : '✓ Đã lưu câu hỏi vào bản nháp thành công.'
    );
    setTimeout(() => setSaveMessage(null), 3500);
    setModalMode('none');
    refreshList();
  };

  // Kiểm tra cú pháp file CSV mẫu
  const handleValidateCsv = () => {
    setImportErrors([]);
    setPreviewImportItems([]);

    if (!csvText.trim()) {
      setImportErrors(['Nội dung dữ liệu nhập trống.']);
      return;
    }

    const lines = csvText.trim().split('\n');
    const errors: string[] = [];
    const validItems: any[] = [];

    lines.forEach((line, index) => {
      const parts = line.split('|').map(p => p.trim());
      const rowNum = index + 1;

      // Định dạng mẫu: Dạng|Mức độ|Mã câu|Nội dung|Đáp án đúng|Giải thích|Điểm
      if (parts.length < 5) {
        errors.push(`Dòng ${rowNum}: Thiếu trường dữ liệu. Cần ít nhất 5 trường ngăn cách bởi dấu gạch đứng |.`);
        return;
      }

      const [qType, qDiff, qCode, qPrompt, qAns, qExp, qPts] = parts;

      if (!['abcd', 'true_false', 'short', 'essay'].includes(qType.toLowerCase())) {
        errors.push(`Dòng ${rowNum}: Dạng câu "${qType}" không hợp lệ (hỗ trợ: abcd, true_false, short, essay).`);
        return;
      }

      if (!['biet', 'hieu', 'van_dung'].includes(qDiff.toLowerCase())) {
        errors.push(`Dòng ${rowNum}: Mức độ "${qDiff}" không hợp lệ (hỗ trợ: biet, hieu, van_dung).`);
        return;
      }

      validItems.push({
        questionType: qType.toLowerCase(),
        difficulty: qDiff.toLowerCase(),
        code: qCode || `IMP_${Date.now()}_${rowNum}`,
        prompt: qPrompt,
        correctAnswer: qAns,
        explanation: qExp || '',
        points: Number(qPts) || 2.5
      });
    });

    setImportErrors(errors);
    setPreviewImportItems(validItems);
  };

  const handleExecuteImport = () => {
    if (previewImportItems.length === 0) return;

    previewImportItems.forEach(item => {
      teacherDataService.saveQuestion({
        ...item,
        subjectCode,
        grade,
        chapterId: 'chuong_1',
        chapterTitle,
        lessonTitle,
        source: 'Nhập theo tệp mẫu kiểm tra',
        status: 'draft',
        authorId: userId || 'gv_demo',
        authorName: displayName || 'Giáo viên THCS'
      });
    });

    setSaveMessage(`✓ Đã nhập thành công ${previewImportItems.length} câu hỏi vào ngân hàng.`);
    setTimeout(() => setSaveMessage(null), 3500);
    setModalMode('none');
    setCsvText('');
    setPreviewImportItems([]);
    refreshList();
  };

  const filteredQuestions = questions.filter(q => {
    if (filterSubject !== 'ALL' && q.subjectCode !== filterSubject) return false;
    if (filterDifficulty !== 'ALL' && q.difficulty !== filterDifficulty) return false;
    if (filterType !== 'ALL' && q.questionType !== filterType) return false;
    if (filterStatus !== 'ALL' && q.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & nút hành động */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 4 · Ngân hàng câu hỏi THCS chuẩn hóa
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Ngân hàng câu hỏi
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Biên soạn câu hỏi theo 4 mức độ và 4 dạng thức đánh giá; hỗ trợ nhập tệp mẫu và kiểm tra lỗi từng dòng.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setModalMode('import')}
            className="px-4 py-2 bg-slate-100 hover:bg-blue-50 text-slate-800 hover:text-blue-900 border border-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>Nhập tệp mẫu</span>
          </button>

          <button
            onClick={() => setModalMode('create')}
            className="px-4 py-2 bg-[#1A56DB] text-white rounded-xl text-xs sm:text-sm font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm câu hỏi mới</span>
          </button>
        </div>
      </div>

      {saveMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{saveMessage}</span>
        </div>
      )}

      {/* MODAL 1: TẠO CÂU HỎI MỚI */}
      {modalMode === 'create' && (
        <form
          onSubmit={e => handleCreateQuestion(e, 'draft')}
          className="bg-white border border-blue-300 rounded-2xl p-6 shadow-md space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#1A56DB]" />
              <span>Biên soạn câu hỏi mới</span>
            </h3>
            <button
              type="button"
              onClick={() => setModalMode('none')}
              className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Mã câu hỏi:</label>
              <input
                type="text"
                required
                value={code}
                onChange={e => setCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Môn học:</label>
              <select
                value={subjectCode}
                onChange={e => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                {THCS_SUBJECTS.map(s => (
                  <option key={s.code} value={s.code}>{s.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Khối lớp:</label>
              <select
                value={grade}
                onChange={e => setGrade(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                {[6, 7, 8, 9].map(g => (
                  <option key={g} value={g}>Lớp {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1">Dạng bài:</label>
              <select
                value={questionType}
                onChange={e => setQuestionType(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
              >
                <option value="abcd">Trắc nghiệm (ABCD)</option>
                <option value="true_false">Đúng / Sai</option>
                <option value="short">Trả lời ngắn</option>
                <option value="essay">Tự luận</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Mức độ tư duy:</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
              >
                <option value="biet">Biết (Nhận biết)</option>
                <option value="hieu">Hiểu (Thông hiểu)</option>
                <option value="van_dung">Vận dụng</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">Điểm số câu:</label>
              <input
                type="number"
                step="0.25"
                min="0.25"
                max="10"
                value={points}
                onChange={e => setPoints(Number(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>

            <div className="sm:col-span-4">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Nội dung câu hỏi: <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                placeholder="Nhập nội dung đề bài, tình huống câu hỏi..."
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
              />
            </div>

            {/* Nếu là dạng ABCD: hiển thị 4 ô lựa chọn */}
            {questionType === 'abcd' && (
              <div className="sm:col-span-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Lựa chọn A:</label>
                  <input
                    type="text"
                    required
                    value={optA}
                    onChange={e => setOptA(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Lựa chọn B:</label>
                  <input
                    type="text"
                    required
                    value={optB}
                    onChange={e => setOptB(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Lựa chọn C:</label>
                  <input
                    type="text"
                    required
                    value={optC}
                    onChange={e => setOptC(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-bold text-blue-900 mb-1">Lựa chọn D:</label>
                  <input
                    type="text"
                    required
                    value={optD}
                    onChange={e => setOptD(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Đáp án đúng: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={questionType === 'abcd' ? 'A (hoặc B, C, D)' : 'Nội dung đáp án đúng...'}
                value={correctAnswer}
                onChange={e => setCorrectAnswer(e.target.value)}
                className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold rounded-lg"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 uppercase mb-1">
                Giải thích đáp án:
              </label>
              <input
                type="text"
                placeholder="Giải thích tại sao đáp án này đúng để hỗ trợ học sinh ôn tập..."
                value={explanation}
                onChange={e => setExplanation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setModalMode('none')}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-white border border-blue-300 text-blue-900 rounded-xl text-xs font-bold hover:bg-blue-50"
            >
              Lưu bản nháp
            </button>
            <button
              type="button"
              onClick={e => handleCreateQuestion(e as any, 'pending')}
              className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 shadow-xs"
            >
              Lưu &amp; Gửi thẩm định
            </button>
          </div>
        </form>
      )}

      {/* MODAL 2: NHẬP TỆP MẪU THEO DÒNG CÓ BÁO LỖI */}
      {modalMode === 'import' && (
        <div className="bg-white border border-emerald-300 rounded-2xl p-6 shadow-md space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
              <span>Nhập câu hỏi theo định dạng mẫu chuẩn</span>
            </h3>
            <button
              onClick={() => setModalMode('none')}
              className="text-xs text-slate-500 hover:text-slate-800"
            >
              Đóng
            </button>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
            <div className="font-bold text-slate-800">Quy tắc định dạng mỗi dòng (Ngăn cách bằng ký tự |):</div>
            <code className="block bg-white p-2 rounded border border-slate-200 font-mono text-[11px] text-blue-900">
              Dạng câu | Mức độ | Mã câu | Nội dung câu hỏi | Đáp án đúng | Giải thích | Điểm
            </code>
            <div className="text-[11px] text-slate-500">
              * Dạng câu: abcd, true_false, short, essay • Mức độ: biet, hieu, van_dung
            </div>
          </div>

          <textarea
            rows={6}
            placeholder={`Ví dụ mẫu:\nabcd | biet | TH6_CD1_B1_09 | Thiết bị nào là vật mang tin? | Thẻ nhớ | Thẻ nhớ lưu trữ dữ liệu số | 2.5\nshort | hieu | TH6_CD1_B1_10 | Điền từ: Văn bản, số liệu trong máy tính gọi là ... | dữ liệu | Dữ liệu là hình thức thể hiện thông tin | 2.5`}
            value={csvText}
            onChange={e => setCsvText(e.target.value)}
            className="w-full p-3 font-mono text-xs bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={handleValidateCsv}
              className="px-4 py-2 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Kiểm tra cú pháp từng dòng
            </button>

            {previewImportItems.length > 0 && (
              <button
                onClick={handleExecuteImport}
                className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition shadow-xs cursor-pointer"
              >
                Nhập {previewImportItems.length} câu hợp lệ vào ngân hàng
              </button>
            )}
          </div>

          {/* Báo lỗi theo dòng */}
          {importErrors.length > 0 && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-1 text-xs text-rose-800">
              <div className="font-bold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Phát hiện lỗi cú pháp ({importErrors.length} lỗi):</span>
              </div>
              <ul className="list-disc pl-5 space-y-0.5">
                {importErrors.map((err, idx) => (
                  <li key={idx}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Xem trước các dòng hợp lệ */}
          {previewImportItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-200">
              <div className="text-xs font-bold text-emerald-800">
                ✓ Đã phân tích hợp lệ {previewImportItems.length} câu hỏi sẵn sàng nhập:
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1 text-xs font-mono">
                {previewImportItems.map((item, idx) => (
                  <div key={idx} className="p-2 bg-emerald-50/50 rounded border border-emerald-100 flex justify-between">
                    <span>[{item.questionType.toUpperCase()}] {item.code}: {item.prompt}</span>
                    <strong className="text-emerald-900">Đ/A: {item.correctAnswer}</strong>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* BỘ LỌC DANH SÁCH CÂU HỎI */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Môn:</span>
            <select
              value={filterSubject}
              onChange={e => setFilterSubject(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="ALL">Tất cả môn</option>
              {THCS_SUBJECTS.map(s => (
                <option key={s.code} value={s.code}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Mức độ:</span>
            <select
              value={filterDifficulty}
              onChange={e => setFilterDifficulty(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="ALL">Tất cả mức độ</option>
              <option value="biet">Biết</option>
              <option value="hieu">Hiểu</option>
              <option value="van_dung">Vận dụng</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Dạng:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="ALL">Tất cả dạng</option>
              <option value="abcd">Trắc nghiệm</option>
              <option value="true_false">Đúng / Sai</option>
              <option value="short">Trả lời ngắn</option>
              <option value="essay">Tự luận</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-bold text-slate-700">Trạng thái:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg font-semibold"
            >
              <option value="ALL">Tất cả</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="draft">Bản nháp</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500 font-semibold">
          Tổng cộng: <strong>{filteredQuestions.length}</strong> câu
        </div>
      </div>

      {/* DANH SÁCH CÂU HỎI */}
      <div className="space-y-3">
        {filteredQuestions.length === 0 ? (
          <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
            Không tìm thấy câu hỏi nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredQuestions.map(q => (
            <div
              key={q.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    {q.code}
                  </span>
                  <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                    {q.subjectCode.toUpperCase()} • Lớp {q.grade}
                  </span>
                  <span className="text-xs font-semibold text-purple-800 bg-purple-50 px-2 py-0.5 rounded">
                    {q.questionType.toUpperCase()}
                  </span>
                  <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded">
                    Mức độ: {q.difficulty === 'biet' ? 'Biết' : q.difficulty === 'hieu' ? 'Hiểu' : 'Vận dụng'}
                  </span>
                </div>

                <div>
                  {q.status === 'approved' ? (
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      ● Đã duyệt
                    </span>
                  ) : q.status === 'pending' ? (
                    <span className="text-[11px] font-bold text-blue-900 bg-blue-100 px-2.5 py-0.5 rounded-full">
                      ● Chờ duyệt
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      ● Bản nháp
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {q.prompt}
              </div>

              {q.options && q.options.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {q.options.map(opt => (
                    <div
                      key={opt.key}
                      className={`p-1.5 rounded ${
                        opt.key === q.correctAnswer
                          ? 'bg-emerald-100 text-emerald-900 font-bold border border-emerald-200'
                          : ''
                      }`}
                    >
                      <strong>{opt.key}.</strong> {opt.text}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100 gap-2">
                <div>
                  Đáp án chuẩn: <strong className="text-emerald-800">{q.correctAnswer}</strong> • Điểm: <strong>{q.points}</strong>
                </div>

                <div className="flex items-center gap-2">
                  {q.status === 'draft' && (
                    <button
                      onClick={() => {
                        teacherDataService.submitQuestionForReview(q.id);
                        refreshList();
                      }}
                      className="px-3 py-1 bg-[#1A56DB] text-white rounded-lg font-bold text-xs hover:bg-blue-700"
                    >
                      Gửi duyệt
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
