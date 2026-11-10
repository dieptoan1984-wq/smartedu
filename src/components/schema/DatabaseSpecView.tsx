/**
 * Database Spec View - Cơ sở dữ liệu nền tảng theo 001_nen_tang.sql & 002_danh_muc.sql
 * Gồm 21 bảng public và 5 bảng private.
 * Làm rõ: "13 bảng" là 13 bảng ảnh thiết kế giao diện, KHÔNG phải 13 bảng CSDL.
 */

import React, { useState } from 'react';
import { OFFICIAL_DB_TABLES, THCS_SUBJECTS, THCS_GRADES } from '../../types/smartEduData';

export const DatabaseSpecView: React.FC = () => {
  const [activeSchemaTab, setActiveSchemaTab] = useState<'public' | 'private'>('public');

  return (
    <div className="space-y-6">
      {/* Thông tin căn cứ */}
      <div className="bg-white border border-slate-200 p-6 rounded">
        <div className="text-xs font-semibold text-blue-900 mb-1 uppercase">
          Căn cứ Kỹ thuật Cơ sở Dữ liệu
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Cơ Sở Dữ Liệu Nền Tảng (001_nen_tang.sql & 002_danh_muc.sql)
        </h1>
        <p className="text-slate-600 text-sm max-w-4xl leading-relaxed">
          Cơ sở dữ liệu nền tảng đã được khởi tạo chuẩn gồm <strong>21 bảng public</strong> và <strong>5 bảng private</strong>.
          Khung dữ liệu phục vụ tất cả các môn học THCS (Khối 6, 7, 8, 9).
          <br />
          <strong className="text-blue-950 font-semibold">
            Đính chính quan trọng: "13 bảng" trong tài liệu nghiệm thu là 13 bảng ảnh thiết kế giao diện (UI Mockups),
            KHÔNG phải 13 bảng cơ sở dữ liệu.
          </strong>
        </p>

        {/* Khung số lượng */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-200 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">Bảng Public:</span>
            <strong className="text-xl text-slate-900 tabular-nums">21 Bảng</strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Bảng Private (Bảo mật):</span>
            <strong className="text-xl text-rose-800 tabular-nums">5 Bảng</strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Môn học THCS:</span>
            <strong className="text-xl text-blue-900 tabular-nums">12 Môn</strong>
          </div>
          <div>
            <span className="text-xs text-slate-500 block">Khối lớp THCS:</span>
            <strong className="text-xl text-emerald-800 tabular-nums">Lớp 6, 7, 8, 9</strong>
          </div>
        </div>
      </div>

      {/* Tabs chọn xem Bảng Public hoặc Bảng Private */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSchemaTab('public')}
          className={`px-4 py-2 text-sm font-semibold rounded transition-colors ${
            activeSchemaTab === 'public'
              ? 'bg-blue-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          21 Bảng Public (Schema public)
        </button>
        <button
          onClick={() => setActiveSchemaTab('private')}
          className={`px-4 py-2 text-sm font-semibold rounded transition-colors ${
            activeSchemaTab === 'private'
              ? 'bg-rose-900 text-white'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          5 Bảng Private (Schema private - Bảo vệ backend)
        </button>
      </div>

      {/* Danh sách bảng theo tab */}
      <div className="bg-white border border-slate-200 rounded p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">
          {activeSchemaTab === 'public'
            ? 'Danh mục 21 Bảng Public (001_nen_tang.sql)'
            : 'Danh mục 5 Bảng Private (Không expose ra PostgREST Client)'}
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600">
                <th className="py-2.5 px-3 w-12 text-center">STT</th>
                <th className="py-2.5 px-4 font-mono w-60">Tên bảng SQL</th>
                <th className="py-2.5 px-4">Mô tả nghiệp vụ sư phạm THCS</th>
                <th className="py-2.5 px-3 w-36 text-center">Quy tắc bảo mật</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(activeSchemaTab === 'public'
                ? OFFICIAL_DB_TABLES.publicTables
                : OFFICIAL_DB_TABLES.privateTables
              ).map((t, idx) => (
                <tr key={t.name} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 text-center text-xs text-slate-400 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-bold text-blue-900 text-xs">
                    {t.name}
                  </td>
                  <td className="py-2.5 px-4 text-slate-700 text-xs leading-relaxed">
                    {t.desc}
                  </td>
                  <td className="py-2.5 px-3 text-center text-xs">
                    {activeSchemaTab === 'public' ? (
                      <span className="text-slate-600">RLS select</span>
                    ) : (
                      <span className="text-rose-800 font-semibold">Service Role only</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Danh mục 12 Môn học THCS theo 002_danh_muc.sql */}
      <div className="bg-white border border-slate-200 rounded p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Danh Mục 12 Môn Học THCS (Theo 002_danh_muc.sql)
        </h2>
        <p className="text-xs text-slate-600 mb-4">
          Áp dụng đồng bộ cho cả 4 khối lớp THCS (Lớp 6, 7, 8, 9). Bộ sách giáo khoa ưu tiên ban đầu: Kết nối tri thức với cuộc sống (KNTT).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {THCS_SUBJECTS.map((s, idx) => (
            <div key={s.code} className="p-3 bg-slate-50 border border-slate-200 rounded">
              <span className="text-slate-400 font-mono block">#{String(idx + 1).padStart(2, '0')} · {s.code}</span>
              <strong className="text-sm text-slate-900 block mt-1">{s.name}</strong>
              <span className="text-[11px] text-slate-500 mt-1 block">Khối 6, 7, 8, 9 (KNTT)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
