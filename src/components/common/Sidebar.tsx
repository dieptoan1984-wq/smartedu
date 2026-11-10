/**
 * Smart EDU THCS Sidebar - Điều hướng 6 nhóm chức năng và bộ lọc môn/lớp
 * Phạm vi: Lớp 6, 7, 8, 9 và tất cả các môn THCS
 */

import React from 'react';
import { 
  SMART_EDU_GROUPS, 
  SMART_EDU_78_FUNCTIONS, 
  THCS_GRADES, 
  THCS_SUBJECTS 
} from '../../types/smartEduData';
import { useNavigation, MainNavSection } from '../../contexts/NavigationContext';

export const Sidebar: React.FC = () => {
  const { 
    activeSection, 
    setActiveSection, 
    setActiveTab, 
    setSelectedFunction,
    selectedGrade, 
    setSelectedGrade,
    selectedSubject, 
    setSelectedSubject,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useNavigation();

  const handleSelectSection = (section: MainNavSection) => {
    setActiveSection(section);
    setActiveTab('catalog');
    setSelectedFunction(null);
    setIsMobileMenuOpen(false);
  };

  const content = (
    <div className="p-5 space-y-6">
      {/* Khối 1: 6 Nhóm chức năng chính */}
      <div>
        <div className="text-xs font-bold text-slate-500 uppercase mb-2">
          6 Nhóm Nghiệp Vụ (78 Mã)
        </div>
        <nav className="space-y-1">
          <button
            onClick={() => handleSelectSection('ALL')}
            className={`w-full text-left px-3.5 py-2.5 rounded text-sm transition-colors flex items-center justify-between ${
              activeSection === 'ALL'
                ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span>Tất cả 78 chức năng</span>
            <span className="text-xs tabular-nums text-slate-500">
              {SMART_EDU_78_FUNCTIONS.length}
            </span>
          </button>

          {SMART_EDU_GROUPS.map((group) => {
            const isSelected = activeSection === group.id;
            return (
              <button
                key={group.id}
                onClick={() => handleSelectSection(group.id as MainNavSection)}
                className={`w-full text-left px-3.5 py-2.5 rounded text-sm transition-colors flex items-center justify-between ${
                  isSelected
                    ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="font-medium text-slate-900">{group.name}</div>
                  <div className="text-xs text-slate-500 font-mono">{group.range}</div>
                </div>
                <span className="text-xs tabular-nums text-slate-500 shrink-0">
                  {group.functions.length}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Khối 2: Bộ lọc Khối lớp (Chỉ Lớp 6, 7, 8, 9) */}
      <div className="pt-4 border-t border-slate-200">
        <div className="text-xs font-bold text-slate-500 uppercase mb-2">
          Phạm vi khối lớp (THCS)
        </div>
        <div className="grid grid-cols-5 gap-1 text-xs">
          <button
            onClick={() => setSelectedGrade('ALL')}
            className={`py-1.5 px-2 rounded font-semibold text-center transition-colors ${
              selectedGrade === 'ALL'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tất cả
          </button>
          {THCS_GRADES.map(grade => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(grade)}
              className={`py-1.5 px-2 rounded font-semibold text-center transition-colors ${
                selectedGrade === grade
                  ? 'bg-blue-900 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Lớp {grade}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-500 mt-1">
          * Đã loại bỏ hoàn toàn khối 10–12.
        </div>
      </div>

      {/* Khối 3: Bộ lọc 12 Môn học THCS */}
      <div className="pt-4 border-t border-slate-200">
        <div className="text-xs font-bold text-slate-500 uppercase mb-2">
          12 Môn học THCS
        </div>
        <div className="max-h-48 overflow-y-auto space-y-1 text-xs pr-1">
          <button
            onClick={() => setSelectedSubject('ALL')}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
              selectedSubject === 'ALL'
                ? 'bg-blue-100 text-blue-900 font-bold'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tất cả môn học
          </button>
          {THCS_SUBJECTS.map(subj => (
            <button
              key={subj.code}
              onClick={() => setSelectedSubject(subj.code)}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors truncate ${
                selectedSubject === subj.code
                  ? 'bg-blue-100 text-blue-900 font-bold'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {subj.name}
            </button>
          ))}
        </div>
      </div>

      {/* Khối 4: Thông tin phiên bản & Căn cứ */}
      <div className="pt-4 border-t border-slate-200 text-xs text-slate-500 space-y-1">
        <div className="font-bold text-slate-700">Nguyên tắc bản sửa:</div>
        <div>• Căn cứ: 001_nen_tang.sql & 002_danh_muc.sql</div>
        <div>• 13 bảng là ảnh giao diện, không phải số bảng DB</div>
        <div>• Chức năng chưa làm ghi "Chưa triển khai"</div>
        <div>• Không tạo kết quả thành công giả</div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 bg-white border-r border-slate-200 shrink-0 self-stretch">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-black/40" 
            onClick={() => setIsMobileMenuOpen(false)} 
          />
          <div className="relative bg-white w-80 max-w-full h-full overflow-y-auto z-10 shadow-xl">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <span className="font-bold text-blue-900">Trình Đơn Smart EDU THCS</span>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
};
