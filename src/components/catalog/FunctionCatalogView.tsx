/**
 * Function Catalog View - Danh mục 78 chức năng đặc tả THCS 1.0
 * 6 Nhóm: HS01–HS21, GV01–GV15, KT01–KT16, TC01–TC10, QT01–QT10, NC01–NC06
 * Phạm vi: Lớp 6–9, tất cả các môn THCS
 */

import React, { useMemo } from 'react';
import { 
  SMART_EDU_78_FUNCTIONS, 
  SMART_EDU_GROUPS, 
  FunctionItem 
} from '../../types/smartEduData';
import { useNavigation } from '../../contexts/NavigationContext';

export const FunctionCatalogView: React.FC = () => {
  const { 
    activeSection, 
    setActiveSection, 
    searchQuery, 
    setSearchQuery,
    selectedGrade,
    selectedSubject,
    navigateToFunction 
  } = useNavigation();

  const filteredFunctions = useMemo(() => {
    return SMART_EDU_78_FUNCTIONS.filter((fn: FunctionItem) => {
      const matchSection = activeSection === 'ALL' || fn.groupId === activeSection;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = q === '' ||
        fn.code.toLowerCase().includes(q) ||
        fn.title.toLowerCase().includes(q) ||
        fn.dauVao.toLowerCase().includes(q) ||
        fn.xuLi.toLowerCase().includes(q) ||
        fn.dauRa.toLowerCase().includes(q);
      return matchSection && matchSearch;
    });
  }, [activeSection, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Banner giới thiệu nền tảng */}
      <div className="bg-white border border-slate-200 p-6 rounded">
        <div className="text-xs font-semibold text-blue-900 mb-1 uppercase">
          Đặc tả chức năng 1.0 · Bản đề xuất trình duyệt (09/11/2026)
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS
        </h1>
        <p className="text-slate-600 text-sm max-w-4xl leading-relaxed">
          Phạm vi áp dụng cho học sinh và giáo viên <strong>lớp 6, 7, 8, 9</strong> và tất cả các môn THCS.
          Toàn bộ hệ thống gồm <strong>78 chức năng chuẩn hóa</strong> chia thành 6 nhóm nghiệp vụ sư phạm
          và tham chiếu trên <strong>13 bảng ảnh thiết kế giao diện</strong>.
        </p>

        {/* Thẻ chỉ số 6 nhóm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5 pt-5 border-t border-slate-200 text-xs">
          {SMART_EDU_GROUPS.map(g => (
            <div
              key={g.id}
              onClick={() => setActiveSection(g.id)}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                activeSection === g.id
                  ? 'bg-blue-50 border-blue-300 text-blue-950 font-semibold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div className="text-xs text-slate-500 font-mono">{g.range}</div>
              <div className="font-bold text-sm mt-0.5">{g.name}</div>
              <div className="text-xs text-blue-800 mt-1 tabular-nums">
                {g.functions.length} chức năng
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Thanh tìm kiếm & chuyển nhóm nhanh */}
      <div className="bg-white border border-slate-200 p-4 rounded flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-96">
          <input
            type="text"
            placeholder="Tìm theo mã (HS01, GV03, KT05...), tên chức năng..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 w-full md:w-auto justify-between md:justify-end">
          <div>
            Đang lọc: <strong>{activeSection === 'ALL' ? 'Tất cả 6 nhóm' : activeSection}</strong>
            {selectedGrade !== 'ALL' && <span> · Lớp {selectedGrade}</span>}
            {selectedSubject !== 'ALL' && <span> · Môn: {selectedSubject}</span>}
          </div>
          <span className="tabular-nums font-semibold text-blue-900 bg-slate-100 px-2 py-1 rounded">
            {filteredFunctions.length} / 78 chức năng
          </span>
        </div>
      </div>

      {/* Bảng danh sách 78 chức năng */}
      <div className="bg-white border border-slate-200 rounded overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-700">
                <th className="py-3 px-3.5 w-16 text-center">Mã</th>
                <th className="py-3 px-3.5 w-32">Nhóm</th>
                <th className="py-3 px-4">Tên chức năng</th>
                <th className="py-3 px-3.5 w-24 text-center">Bảng ảnh</th>
                <th className="py-3 px-4 hidden md:table-cell">Đầu vào</th>
                <th className="py-3 px-3.5 w-36 text-center">Trạng thái</th>
                <th className="py-3 px-3 w-24 text-center">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredFunctions.map((fn: FunctionItem) => (
                <tr
                  key={fn.code}
                  className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                  onClick={() => navigateToFunction(fn)}
                >
                  <td className="py-3 px-3.5 text-center font-mono font-bold text-blue-900 text-xs">
                    {fn.code}
                  </td>
                  <td className="py-3 px-3.5 text-xs text-slate-600 font-medium">
                    {fn.groupName}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-900 hover:text-blue-900">
                      {fn.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                      {fn.xuLi}
                    </div>
                  </td>
                  <td className="py-3 px-3.5 text-center text-xs font-mono text-slate-600">
                    Bảng {fn.board}
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-500 hidden md:table-cell line-clamp-2">
                    {fn.dauVao}
                  </td>
                  <td className="py-3 px-3.5 text-center">
                    <span className="text-xs text-rose-700 font-semibold block">
                      Chưa triển khai
                    </span>
                    <span className="text-[11px] text-slate-400">
                      (Vô hiệu hóa)
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigateToFunction(fn);
                      }}
                      className="px-2.5 py-1 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200"
                    >
                      Xem trang
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
