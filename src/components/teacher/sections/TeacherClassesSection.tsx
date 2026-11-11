/**
 * Smart EDU THCS - Giáo viên: Mục 2. Lớp học của tôi (TeacherClassesSection)
 * Quản lí lớp học THCS:
 * - Tạo lớp học mới (Tên, Khối 6-9, Năm học)
 * - Quản lí danh sách học sinh (Thêm học sinh có email)
 * - Xem danh sách bài tập đã giao cho lớp
 * - Lưu trữ lớp (archived = true) - Bảo tồn toàn bộ lịch sử học tập
 */

import React, { useState } from 'react';
import { useNavigation } from '../../../contexts/NavigationContext';
import {
  teacherDataService,
  TeacherClassItem
} from '../../../services/teacherDataService';
import {
  Users,
  Plus,
  Archive,
  RotateCcw,
  UserPlus,
  ClipboardList,
  CheckCircle2,
  Calendar,
  GraduationCap,
  Sparkles,
  ChevronRight,
  Search
} from 'lucide-react';

export const TeacherClassesSection: React.FC = () => {
  const { setTeacherSection } = useNavigation();

  const [classes, setClasses] = useState<TeacherClassItem[]>(() => teacherDataService.getClasses());
  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [filterArchived, setFilterArchived] = useState<boolean>(false);
  const [isCreatingClass, setIsCreatingClass] = useState<boolean>(false);

  // Form tạo lớp mới
  const [newClassName, setNewClassName] = useState('');
  const [newGrade, setNewGrade] = useState<number>(6);
  const [newSchoolYear, setNewSchoolYear] = useState('2026–2027');

  // Form thêm học sinh vào lớp
  const [isAddingStudent, setIsAddingStudent] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');

  const refreshClasses = () => {
    setClasses(teacherDataService.getClasses());
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      alert('Vui lòng nhập tên lớp.');
      return;
    }

    const created = teacherDataService.createClass({
      name: newClassName.trim(),
      grade: Number(newGrade),
      schoolYear: newSchoolYear
    });

    setNewClassName('');
    setIsCreatingClass(false);
    refreshClasses();
    setSelectedClassId(created.id);
  };

  const handleArchiveToggle = (clsId: string, currentArchived: boolean) => {
    if (window.confirm(currentArchived ? 'Khôi phục lớp học này về danh sách hoạt động?' : 'Lưu trữ lớp học này? Lịch sử điểm và bài nộp vẫn được bảo toàn nguyên vẹn.')) {
      teacherDataService.archiveClass(clsId, !currentArchived);
      refreshClasses();
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim() || !selectedClassId) return;

    teacherDataService.addStudentToClass(selectedClassId, newStudentName.trim(), newStudentEmail.trim() || undefined);
    setNewStudentName('');
    setNewStudentEmail('');
    setIsAddingStudent(false);
    refreshClasses();
  };

  const displayedClasses = classes.filter(c => c.archived === filterArchived);
  const currentClass = classes.find(c => c.id === selectedClassId) || displayedClasses[0];

  const assignments = teacherDataService.getAssignments();
  const classAssignments = currentClass ? assignments.filter(a => a.classId === currentClass.id) : [];

  return (
    <div className="space-y-6 font-serif">
      {/* Tiêu đề & nút tạo lớp */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-[#1A56DB] uppercase">
            Mục 2 · Quản lý lớp học phụ trách
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Lớp học của tôi
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Tạo lớp, quản lí thành viên học sinh và theo dõi các nhiệm vụ học tập được giao cho từng lớp.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingClass(!isCreatingClass)}
          className="px-5 py-2.5 bg-[#1A56DB] text-white font-semibold text-sm rounded-xl hover:bg-blue-700 transition flex items-center gap-2 shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tạo lớp học mới</span>
        </button>
      </div>

      {/* FORM TẠO LỚP MỚI */}
      {isCreatingClass && (
        <form
          onSubmit={handleCreateClass}
          className="bg-blue-50/70 border border-blue-200 rounded-2xl p-5 shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between pb-3 border-b border-blue-200">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1A56DB]" />
              <span>Tạo lớp học mới (Cấp THCS)</span>
            </h3>
            <span className="text-[11px] text-blue-900 font-semibold bg-blue-100 px-2 py-0.5 rounded">
              Lớp 6–9
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Tên lớp học: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="Ví dụ: Lớp 6A3 – Tin học"
                value={newClassName}
                onChange={e => setNewClassName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Khối lớp:
              </label>
              <select
                value={newGrade}
                onChange={e => setNewGrade(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              >
                {[6, 7, 8, 9].map(g => (
                  <option key={g} value={g}>Lớp {g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Năm học:
              </label>
              <input
                type="text"
                required
                value={newSchoolYear}
                onChange={e => setNewSchoolYear(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl focus:outline-hidden focus:border-[#1A56DB]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsCreatingClass(false)}
              className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition shadow-xs cursor-pointer"
            >
              Lưu lớp học
            </button>
          </div>
        </form>
      )}

      {/* BỐ CỤC 2 CỘT: DANH SÁCH LỚP BÊN TRÁI & CHI TIẾT THÀNH VIÊN/BÀI GIAO BÊN PHẢI */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* CỘT 1: Danh sách các lớp (4 cột) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <span className="font-bold text-sm text-slate-800">Danh sách lớp</span>
              <div className="flex items-center gap-1 text-xs">
                <button
                  onClick={() => setFilterArchived(false)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    !filterArchived ? 'bg-[#1A56DB] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Đang dạy
                </button>
                <button
                  onClick={() => setFilterArchived(true)}
                  className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                    filterArchived ? 'bg-[#1A56DB] text-white' : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Lưu trữ
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {displayedClasses.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  {filterArchived ? 'Không có lớp học nào trong kho lưu trữ.' : 'Chưa có lớp học nào. Hãy nhấn "+ Tạo lớp học mới".'}
                </div>
              ) : (
                displayedClasses.map(cls => {
                  const isSelected = cls.id === currentClass?.id;
                  return (
                    <div
                      key={cls.id}
                      onClick={() => setSelectedClassId(cls.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-blue-50/70 border-blue-400 ring-1 ring-blue-400'
                          : 'bg-white border-slate-200 hover:border-blue-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="font-bold text-sm text-slate-900">{cls.name}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-2">
                          <span>Khối {cls.grade}</span>
                          <span>•</span>
                          <span>{cls.studentCount} học sinh</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* CỘT 2: Chi tiết lớp được chọn (8 cột) */}
        <div className="lg:col-span-8">
          {currentClass ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
              {/* Header chi tiết lớp */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                      Khối lớp {currentClass.grade} THCS
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      Năm học: {currentClass.schoolYear}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
                    {currentClass.name}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleArchiveToggle(currentClass.id, currentClass.archived)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    {currentClass.archived ? (
                      <>
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Khôi phục lớp</span>
                      </>
                    ) : (
                      <>
                        <Archive className="w-3.5 h-3.5 text-slate-500" />
                        <span>Lưu trữ lớp</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => setTeacherSection('assignments')}
                    className="px-4 py-1.5 bg-[#1A56DB] text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Giao bài cho lớp này</span>
                  </button>
                </div>
              </div>

              {/* Danh sách học sinh trong lớp */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#1A56DB]" />
                    <span>Danh sách học sinh ({currentClass.students.length} em)</span>
                  </h3>

                  <button
                    onClick={() => setIsAddingStudent(!isAddingStudent)}
                    className="px-3 py-1 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>+ Thêm học sinh</span>
                  </button>
                </div>

                {isAddingStudent && (
                  <form
                    onSubmit={handleAddStudent}
                    className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Họ và tên học sinh: <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ví dụ: Nguyễn Văn An"
                          value={newStudentName}
                          onChange={e => setNewStudentName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 uppercase mb-1">
                          Email (nếu có):
                        </label>
                        <input
                          type="email"
                          placeholder="an.nv@thcs.edu.vn"
                          value={newStudentEmail}
                          onChange={e => setNewStudentEmail(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingStudent(false)}
                        className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded"
                      >
                        Đóng
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1 bg-[#1A56DB] text-white rounded text-xs font-bold hover:bg-blue-700"
                      >
                        Lưu vào danh sách
                      </button>
                    </div>
                  </form>
                )}

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 text-slate-600">
                        <th className="py-2.5 px-3 font-bold">STT</th>
                        <th className="py-2.5 px-3 font-bold">Họ và tên</th>
                        <th className="py-2.5 px-3 font-bold">Tài khoản Email</th>
                        <th className="py-2.5 px-3 font-bold text-right">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {currentClass.students.map((st, idx) => (
                        <tr key={st.id} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-3 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">{st.name}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono">{st.email || '—'}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                              Đang học
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Danh sách nhiệm vụ đã giao cho lớp */}
              <div className="space-y-3 pt-4 border-t border-slate-200">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-[#1A56DB]" />
                  <span>Bài tập &amp; Nhiệm vụ đã giao ({classAssignments.length})</span>
                </h3>

                {classAssignments.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs text-slate-500">
                    Hiện chưa giao bài kiểm tra nào cho lớp này. Hãy nhấn nút "Giao bài cho lớp này" ở góc trên.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {classAssignments.map(asg => (
                      <div
                        key={asg.id}
                        className="p-3.5 bg-blue-50/30 border border-blue-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-sm text-slate-900">{asg.title}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Thời lượng: {asg.durationMinutes} phút • Hạn nộp: {new Date(asg.dueAt).toLocaleDateString('vi-VN')}
                          </div>
                        </div>
                        <button
                          onClick={() => setTeacherSection('grading')}
                          className="px-3 py-1 bg-blue-50 text-blue-900 hover:bg-blue-100 border border-blue-200 rounded-lg font-bold"
                        >
                          Xem bài nộp
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 bg-white border border-slate-200 rounded-2xl text-center text-slate-400">
              Chọn một lớp ở cột bên trái để quản lý
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
