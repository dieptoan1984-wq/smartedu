/**
 * Smart EDU THCS - Giáo viên: Mục 6. Bộ hồ sơ kiểm tra chuẩn (TeacherTestDossierSection)
 * Quy trình trọn bộ 5 bước theo Thông tư Bộ GD&ĐT cấp THCS:
 * Bước 1: Ma trận đề kiểm tra (Phân bố mức độ Biết - Hiểu - Vận dụng và tỷ lệ %)
 * Bước 2: Bản đặc tả câu hỏi (Yêu cầu cần đạt - YCCĐ, dạng câu, số câu)
 * Bước 3: Đề kiểm tra chuẩn (Trắc nghiệm khách quan & Tự luận)
 * Bước 4: Đáp án chuẩn
 * Bước 5: Hướng dẫn chấm & Rubric biểu điểm
 * 
 * Tính năng nổi bật:
 * - Kiểm tra tự động tổng điểm (10 điểm) và tỷ lệ %
 * - Xuất tệp thật: Tạo tệp tài liệu văn bản chuẩn (.doc / .html) tải về máy tính để in ấn hoặc nộp tổ chuyên môn
 */

import React, { useState } from 'react';
import { THCS_SUBJECTS } from '../../../types/smartEduData';
import {
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  FileDown,
  Printer,
  Sparkles,
  Layers,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export const TeacherTestDossierSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(1);

  // Cấu hình hồ sơ
  const [subjectCode, setSubjectCode] = useState('tin_hoc');
  const [grade, setGrade] = useState<number>(6);
  const [term, setTerm] = useState('Giữa học kỳ I');
  const [timeMinutes, setTimeMinutes] = useState(45);
  const [schoolYear, setSchoolYear] = useState('2026–2027');

  // Tỉ lệ % mức độ do giáo viên thiết lập (Tổng = 100%)
  const [bietPct, setBietPct] = useState(40); // 4.0 điểm
  const [hieuPct, setHieuPct] = useState(30); // 3.0 điểm
  const [vanDungPct, setVanDungPct] = useState(30); // 3.0 điểm

  const totalPct = Number(bietPct) + Number(hieuPct) + Number(vanDungPct);
  const isPctValid = totalPct === 100;

  const currentSubjectName = THCS_SUBJECTS.find(s => s.code === subjectCode)?.name || 'Tin học';

  // Xuất file thật tải về máy tính (Định dạng Word/HTML chuẩn)
  const handleExportFullDossier = () => {
    if (!isPctValid) {
      alert('Tỉ lệ phần trăm các mức độ chưa tròn 100%. Vui lòng điều chỉnh lại cấu hình ma trận.');
      return;
    }

    const dossierHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>BỘ HỒ SƠ KIỂM TRA ${currentSubjectName.toUpperCase()} ${grade} - ${term.toUpperCase()}</title>
  <style>
    body { font-family: "Times New Roman", Times, serif; font-size: 14pt; line-height: 1.5; color: #000; margin: 40px; }
    .header-table { width: 100%; margin-bottom: 25px; border-collapse: collapse; }
    .header-table td { text-align: center; vertical-align: top; }
    h1 { font-size: 16pt; font-weight: bold; text-align: center; margin: 20px 0 10px 0; }
    h2 { font-size: 14pt; font-weight: bold; margin-top: 25px; border-bottom: 1.5pt solid #000; padding-bottom: 4px; }
    table.data-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    table.data-table th, table.data-table td { border: 1pt solid #000; padding: 6px 10px; font-size: 12pt; }
    table.data-table th { background: #f2f2f2; text-align: center; }
    .footer { margin-top: 40px; width: 100%; border-collapse: collapse; }
    .footer td { text-align: center; vertical-align: top; width: 50%; }
  </style>
</head>
<body>
  <table class="header-table">
    <tr>
      <td style="width: 45%;">
        <strong>TRƯỜNG THCS SMART EDU</strong><br>
        TỔ CHUYÊN MÔN: ${currentSubjectName.toUpperCase()}
      </td>
      <td style="width: 55%;">
        <strong>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</strong><br>
        <em>Độc lập – Tự do – Hạnh phúc</em><br>
        -------------------------
      </td>
    </tr>
  </table>

  <h1>BỘ HỒ SƠ KIỂM TRA ĐÁNH GIÁ ĐỊNH KỲ<br>MÔN: ${currentSubjectName.toUpperCase()} – KHỐI ${grade}<br>NĂM HỌC ${schoolYear}</h1>
  <div style="text-align: center; font-style: italic; margin-bottom: 20px;">Thời gian làm bài: ${timeMinutes} phút • Thời điểm: ${term}</div>

  <h2>PHẦN 1: MA TRẬN ĐỀ KIỂM TRA</h2>
  <p>Tổng điểm: 10.0 điểm. Tỉ lệ: Nhận biết (${bietPct}%) – Thông hiểu (${hieuPct}%) – Vận dụng (${vanDungPct}%).</p>
  <table class="data-table">
    <tr>
      <th rowspan="2">TT</th>
      <th rowspan="2">Chương / Chủ đề</th>
      <th colspan="2">Nhận biết (${bietPct}%)</th>
      <th colspan="2">Thông hiểu (${hieuPct}%)</th>
      <th colspan="2">Vận dụng (${vanDungPct}%)</th>
      <th rowspan="2">Tổng số câu</th>
      <th rowspan="2">Tổng điểm</th>
    </tr>
    <tr>
      <th>TNKQ</th><th>TL</th>
      <th>TNKQ</th><th>TL</th>
      <th>TNKQ</th><th>TL</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Chủ đề 1: Máy tính và cộng đồng (Thông tin và dữ liệu)</td>
      <td>4</td><td>0</td>
      <td>2</td><td>0</td>
      <td>0</td><td>1</td>
      <td>7 câu</td>
      <td>6.0 điểm</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Chủ đề 2: Mạng máy tính và Internet</td>
      <td>2</td><td>0</td>
      <td>2</td><td>0</td>
      <td>0</td><td>1</td>
      <td>5 câu</td>
      <td>4.0 điểm</td>
    </tr>
    <tr style="font-weight: bold; background: #fafafa;">
      <td colspan="2" style="text-align: center;">TỔNG CỘNG</td>
      <td colspan="2">${bietPct / 10} điểm (${bietPct}%)</td>
      <td colspan="2">${hieuPct / 10} điểm (${hieuPct}%)</td>
      <td colspan="2">${vanDungPct / 10} điểm (${vanDungPct}%)</td>
      <td>12 câu</td>
      <td>10.0 điểm</td>
    </tr>
  </table>

  <h2>PHẦN 2: BẢN ĐẶC TẢ ĐỀ KIỂM TRA</h2>
  <table class="data-table">
    <tr>
      <th>TT</th>
      <th>Chủ đề</th>
      <th>Yêu cầu cần đạt (YCCĐ)</th>
      <th>Mức độ</th>
      <th>Số câu / Hình thức</th>
    </tr>
    <tr>
      <td>1</td>
      <td>Thông tin và dữ liệu</td>
      <td>Nhận biết được sự khác nhau giữa thông tin và dữ liệu. Nhận biết được vật mang tin trong đời sống.</td>
      <td>Nhận biết</td>
      <td>4 câu TNKQ</td>
    </tr>
    <tr>
      <td>2</td>
      <td>Xử lí thông tin</td>
      <td>Nêu được các bước cơ bản trong quá trình xử lí thông tin của máy tính.</td>
      <td>Thông hiểu</td>
      <td>2 câu TNKQ</td>
    </tr>
    <tr>
      <td>3</td>
      <td>Ứng dụng thực tế</td>
      <td>Nêu ví dụ thực tế về việc con người thu nhận thông tin và đưa ra quyết định hành động tương ứng.</td>
      <td>Vận dụng</td>
      <td>1 câu Tự luận</td>
    </tr>
  </table>

  <h2>PHẦN 3: ĐỀ KIỂM TRA CHÍNH THỨC</h2>
  <p><strong>A. PHẦN TRẮC NGHIỆM KHÁCH QUAN (7.0 điểm)</strong></p>
  <p><strong>Câu 1:</strong> Vật mang tin là gì trong các định nghĩa sau?<br>
  A. Phương tiện dùng để lưu trữ và truyền đạt thông tin (như sách, báo, đĩa cứng, thẻ nhớ).<br>
  B. Những gì con người cảm nhận được bằng trực giác.<br>
  C. Chỉ riêng các thiết bị điện tử có kết nối Internet.<br>
  D. Mọi âm thanh phát ra trong tự nhiên.</p>

  <p><strong>Câu 2:</strong> Bản tin dự báo thời tiết thông báo: "Chiều nay có mưa dông". Dòng chữ này đối với em là gì?<br>
  A. Là dữ liệu văn bản; khi em hiểu trời mưa để chuẩn bị áo mưa thì nó là thông tin.<br>
  B. Không phải là thông tin hay dữ liệu.<br>
  C. Là vật mang tin.<br>
  D. Chỉ là dữ liệu âm thanh.</p>

  <p><strong>B. PHẦN TỰ LUẬN (3.0 điểm)</strong></p>
  <p><strong>Câu 3 (3.0 điểm):</strong> Em hãy nêu một ví dụ thực tế trong cuộc sống hàng ngày mà em đã tiếp nhận thông tin và đưa ra quyết định hành động tương ứng. Phân tích rõ đâu là vật mang tin, dữ liệu và thông tin trong ví dụ đó.</p>

  <h2>PHẦN 4 & 5: ĐÁP ÁN VÀ HƯỚNG DẪN CHẤM (RUBRIC)</h2>
  <table class="data-table">
    <tr>
      <th>Câu</th>
      <th>Đáp án / Hướng dẫn chấm</th>
      <th>Điểm</th>
    </tr>
    <tr>
      <td>Câu 1</td>
      <td>Đáp án: <strong>A</strong></td>
      <td>1.0 đ</td>
    </tr>
    <tr>
      <td>Câu 2</td>
      <td>Đáp án: <strong>A</strong></td>
      <td>1.0 đ</td>
    </tr>
    <tr>
      <td>Câu 3 (Tự luận)</td>
      <td>
        - Nêu đúng ví dụ thực tế logic, có ý nghĩa (1.0 đ)<br>
        - Chỉ rõ đúng vật mang tin và dữ liệu tiếp nhận (1.0 đ)<br>
        - Phân tích được thông tin rút ra và quyết định hành động (1.0 đ)
      </td>
      <td>3.0 đ</td>
    </tr>
  </table>

  <table class="footer">
    <tr>
      <td>
        <strong>XÁC NHẬN CỦA TỔ TRƯỞNG CHUYÊN MÔN</strong><br>
        <em>(Ký và ghi rõ họ tên)</em><br><br><br><br>
      </td>
      <td>
        <em>Ngày ...... tháng ...... năm 2026</em><br>
        <strong>GIÁO VIÊN BIÊN SOẠN</strong><br>
        <em>(Ký và ghi rõ họ tên)</em><br><br><br><br>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const blob = new Blob([dossierHtml], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Ho_So_Kiem_Tra_${subjectCode}_Lop_${grade}_${term.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & Nút xuất file */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 6 · Thiết kế trọn bộ hồ sơ kiểm tra
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Bộ hồ sơ kiểm tra THCS
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Thiết kế đầy đủ 5 thành phần theo tiêu chuẩn Bộ GD&ĐT: Ma trận, Bản đặc tả, Đề kiểm tra, Đáp án, Hướng dẫn chấm.
          </p>
        </div>

        <button
          onClick={handleExportFullDossier}
          className="px-5 py-2.5 bg-[#1A56DB] text-white font-bold text-sm rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <FileDown className="w-4 h-4" />
          <span>Xuất tệp hồ sơ (.doc chuẩn in ấn)</span>
        </button>
      </div>

      {/* CẤU HÌNH MA TRẬN & TỈ LỆ % */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="font-bold text-base text-slate-900 flex items-center gap-2">
            <span>⚙️</span>
            <span>Cấu hình thông số hồ sơ &amp; Tỉ lệ mức độ tư duy</span>
          </h2>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold">Tổng tỉ lệ:</span>
            <span className={`px-2 py-0.5 rounded font-bold ${isPctValid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
              {totalPct}% {isPctValid ? '✓ Đạt chuẩn' : '✗ Chưa đúng 100%'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Môn học:</label>
            <select
              value={subjectCode}
              onChange={e => setSubjectCode(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            >
              {[6, 7, 8, 9].map(g => (
                <option key={g} value={g}>Lớp {g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Thời điểm:</label>
            <select
              value={term}
              onChange={e => setTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            >
              <option value="Giữa học kỳ I">Giữa học kỳ I</option>
              <option value="Cuối học kỳ I">Cuối học kỳ I</option>
              <option value="Giữa học kỳ II">Giữa học kỳ II</option>
              <option value="Cuối học kỳ II">Cuối học kỳ II</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Thời lượng:</label>
            <input
              type="number"
              value={timeMinutes}
              onChange={e => setTimeMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1">Năm học:</label>
            <input
              type="text"
              value={schoolYear}
              onChange={e => setSchoolYear(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg font-semibold"
            />
          </div>

          <div className="sm:col-span-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="block font-bold text-blue-900 mb-1">1. Tỉ lệ Biết (Nhận biết) %:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={bietPct}
                onChange={e => setBietPct(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-blue-900"
              />
              <span className="text-[11px] text-slate-500">= {(bietPct / 10).toFixed(1)} điểm</span>
            </div>

            <div>
              <label className="block font-bold text-purple-900 mb-1">2. Tỉ lệ Hiểu (Thông hiểu) %:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={hieuPct}
                onChange={e => setHieuPct(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-purple-900"
              />
              <span className="text-[11px] text-slate-500">= {(hieuPct / 10).toFixed(1)} điểm</span>
            </div>

            <div>
              <label className="block font-bold text-emerald-900 mb-1">3. Tỉ lệ Vận dụng %:</label>
              <input
                type="number"
                min="0"
                max="100"
                value={vanDungPct}
                onChange={e => setVanDungPct(Number(e.target.value))}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-lg font-bold text-emerald-900"
              />
              <span className="text-[11px] text-slate-500">= {(vanDungPct / 10).toFixed(1)} điểm</span>
            </div>
          </div>
        </div>
      </div>

      {/* THANH ĐIỀU HƯỚNG 5 BƯỚC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-3 shadow-xs flex items-center justify-between gap-1 overflow-x-auto text-xs">
        {[
          { step: 1, label: '1. Ma trận đề' },
          { step: 2, label: '2. Bản đặc tả' },
          { step: 3, label: '3. Đề kiểm tra' },
          { step: 4, label: '4. Đáp án' },
          { step: 5, label: '5. Hướng dẫn chấm' }
        ].map(item => (
          <button
            key={item.step}
            onClick={() => setActiveStep(item.step)}
            className={`px-4 py-2 rounded-xl font-bold transition cursor-pointer whitespace-nowrap ${
              activeStep === item.step
                ? 'bg-[#1A56DB] text-white shadow-2xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* NỘI DUNG TỪNG BƯỚC */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        {/* BƯỚC 1: MA TRẬN */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Bảng 1: Ma trận đề kiểm tra đánh giá định kỳ</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-center text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 border border-slate-300 font-bold">
                    <th className="p-2 border border-slate-300" rowSpan={2}>Chương / Chủ đề</th>
                    <th className="p-2 border border-slate-300" colSpan={2}>Nhận biết ({bietPct}%)</th>
                    <th className="p-2 border border-slate-300" colSpan={2}>Thông hiểu ({hieuPct}%)</th>
                    <th className="p-2 border border-slate-300" colSpan={2}>Vận dụng ({vanDungPct}%)</th>
                    <th className="p-2 border border-slate-300" rowSpan={2}>Tổng câu</th>
                    <th className="p-2 border border-slate-300" rowSpan={2}>Tổng điểm</th>
                  </tr>
                  <tr className="bg-slate-50 border border-slate-300 font-semibold">
                    <th className="p-1.5 border border-slate-300">TNKQ</th>
                    <th className="p-1.5 border border-slate-300">TL</th>
                    <th className="p-1.5 border border-slate-300">TNKQ</th>
                    <th className="p-1.5 border border-slate-300">TL</th>
                    <th className="p-1.5 border border-slate-300">TNKQ</th>
                    <th className="p-1.5 border border-slate-300">TL</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-300 text-left font-semibold">Chủ đề 1: Máy tính và cộng đồng (Thông tin &amp; Dữ liệu)</td>
                    <td className="p-2 border border-slate-300">4</td>
                    <td className="p-2 border border-slate-300">0</td>
                    <td className="p-2 border border-slate-300">2</td>
                    <td className="p-2 border border-slate-300">0</td>
                    <td className="p-2 border border-slate-300">0</td>
                    <td className="p-2 border border-slate-300">1</td>
                    <td className="p-2 border border-slate-300 font-bold">7 câu</td>
                    <td className="p-2 border border-slate-300 font-bold text-blue-900">6.0 điểm</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 text-left font-semibold">Chủ đề 2: Mạng máy tính và Internet</td>
                    <td className="p-2 border border-slate-300">2</td>
                    <td className="p-2 border border-slate-300">0</td>
                    <td className="p-2 border border-slate-300">2</td>
                    <td className="p-2 border border-slate-300">0</td>
                    <td className="p-2 border border-slate-300">0</td>
                    <td className="p-2 border border-slate-300">1</td>
                    <td className="p-2 border border-slate-300 font-bold">5 câu</td>
                    <td className="p-2 border border-slate-300 font-bold text-blue-900">4.0 điểm</td>
                  </tr>
                  <tr className="bg-blue-50/60 font-bold">
                    <td className="p-2 border border-slate-300 text-left">TỔNG CỘNG</td>
                    <td className="p-2 border border-slate-300" colSpan={2}>{(bietPct / 10).toFixed(1)} điểm ({bietPct}%)</td>
                    <td className="p-2 border border-slate-300" colSpan={2}>{(hieuPct / 10).toFixed(1)} điểm ({hieuPct}%)</td>
                    <td className="p-2 border border-slate-300" colSpan={2}>{(vanDungPct / 10).toFixed(1)} điểm ({vanDungPct}%)</td>
                    <td className="p-2 border border-slate-300">12 câu</td>
                    <td className="p-2 border border-slate-300 text-blue-900">10.0 điểm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BƯỚC 2: BẢN ĐẶC TẢ */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Bảng 2: Bản đặc tả câu hỏi theo Yêu cầu cần đạt (YCCĐ)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse border border-slate-300">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-2 border border-slate-300">Chủ đề</th>
                    <th className="p-2 border border-slate-300">Yêu cầu cần đạt</th>
                    <th className="p-2 border border-slate-300">Mức độ</th>
                    <th className="p-2 border border-slate-300">Số câu &amp; Dạng thức</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border border-slate-300 font-semibold">Thông tin và dữ liệu</td>
                    <td className="p-2 border border-slate-300">Nhận biết được vật mang tin, phân biệt thông tin và dữ liệu trong ngữ cảnh thực tế.</td>
                    <td className="p-2 border border-slate-300 text-blue-900 font-bold">Nhận biết</td>
                    <td className="p-2 border border-slate-300">4 câu TNKQ (ABCD)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-semibold">Xử lí thông tin</td>
                    <td className="p-2 border border-slate-300">Giải thích được cách con người và máy tính thu nhận, xử lí thông tin.</td>
                    <td className="p-2 border border-slate-300 text-purple-900 font-bold">Thông hiểu</td>
                    <td className="p-2 border border-slate-300">2 câu TNKQ (Đúng/Sai &amp; Điền khuyết)</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-semibold">Ứng dụng thực tiễn</td>
                    <td className="p-2 border border-slate-300">Vận dụng được kiến thức để lấy ví dụ và giải quyết tình huống hàng ngày.</td>
                    <td className="p-2 border border-slate-300 text-emerald-900 font-bold">Vận dụng</td>
                    <td className="p-2 border border-slate-300">1 câu Tự luận (3.0 điểm)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* BƯỚC 3: ĐỀ KIỂM TRA */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">Đề kiểm tra chính thức (Thời gian: {timeMinutes} phút)</h3>
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 text-xs leading-relaxed">
              <div className="font-bold text-slate-800 text-sm">I. PHẦN TRẮC NGHIỆM (7.0 ĐIỂM)</div>
              <div>
                <strong>Câu 1:</strong> Vật mang tin là gì trong các định nghĩa sau?<br />
                A. Phương tiện dùng để lưu trữ và truyền đạt thông tin.<br />
                B. Những gì con người cảm nhận được bằng trực giác.<br />
                C. Thiết bị điện tử có kết nối mạng.<br />
                D. Mọi âm thanh phát ra trong tự nhiên.
              </div>
              <div>
                <strong>Câu 2:</strong> Bản tin dự báo thời tiết thông báo "Chiều nay có mưa". Dòng chữ này đối với em là gì?<br />
                A. Là dữ liệu; khi hiểu để mang áo mưa thì trở thành thông tin.<br />
                B. Không phải dữ liệu hay thông tin.<br />
                C. Là vật mang tin.
              </div>

              <div className="font-bold text-slate-800 text-sm pt-2 border-t border-slate-200">II. PHẦN TỰ LUẬN (3.0 ĐIỂM)</div>
              <div>
                <strong>Câu 3:</strong> Em hãy nêu một ví dụ thực tế trong cuộc sống hàng ngày mà em đã tiếp nhận thông tin và đưa ra quyết định hành động tương ứng.
              </div>
            </div>
          </div>
        )}

        {/* BƯỚC 4 & 5: ĐÁP ÁN & HƯỚNG DẪN CHẤM */}
        {(activeStep === 4 || activeStep === 5) && (
          <div className="space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {activeStep === 4 ? 'Đáp án chuẩn' : 'Hướng dẫn chấm & Rubric biểu điểm chi tiết'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-300">
                <thead className="bg-slate-100 font-bold">
                  <tr>
                    <th className="p-2 border border-slate-300">Câu</th>
                    <th className="p-2 border border-slate-300">Nội dung đáp án &amp; Tiêu chí chấm</th>
                    <th className="p-2 border border-slate-300 text-right">Điểm số</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 border border-slate-300 font-bold">Câu 1</td>
                    <td className="p-2 border border-slate-300">Đáp án đúng: <strong>A</strong></td>
                    <td className="p-2 border border-slate-300 text-right font-bold">1.0 đ</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-bold">Câu 2</td>
                    <td className="p-2 border border-slate-300">Đáp án đúng: <strong>A</strong></td>
                    <td className="p-2 border border-slate-300 text-right font-bold">1.0 đ</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300 font-bold">Câu 3 (Tự luận)</td>
                    <td className="p-2 border border-slate-300 space-y-0.5">
                      <div>- Nêu được ví dụ thực tế chuẩn xác, logic (1.0 đ)</div>
                      <div>- Phân biệt rõ ràng đâu là vật mang tin và dữ liệu (1.0 đ)</div>
                      <div>- Nêu được ý nghĩa thông tin và quyết định hành động tương ứng (1.0 đ)</div>
                    </td>
                    <td className="p-2 border border-slate-300 text-right font-bold">3.0 đ</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
