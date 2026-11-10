/**
 * TechSpecDrawer - Tài liệu kỹ thuật nội bộ (Lưu vết 78 mã chức năng, 13 bảng & CSDL)
 * Mục đích:
 * - Bảo toàn thông tin truy vết kỹ thuật cho chuyên gia/thẩm định viên
 * - KHÔNG đưa lên menu sử dụng chính của học sinh và giáo viên
 */

import React, { useState } from 'react';
import { useNavigation } from '../../contexts/NavigationContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  SMART_EDU_GROUPS,
  SMART_EDU_78_FUNCTIONS,
  OFFICIAL_DB_TABLES,
  UI_BOARD_DESIGNS
} from '../../types/smartEduData';
import { X, Database, Shield, Layout, FileText, CheckCircle2 } from 'lucide-react';

export const TechSpecDrawer: React.FC = () => {
  const { isTechSpecOpen, setIsTechSpecOpen } = useNavigation();
  const { rpcAccess, subjectsTest, testSubjectsQuery } = useAuth();

  const [activeTab, setActiveTab] = useState<'functions' | 'boards' | 'database'>('functions');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  if (!isTechSpecOpen) return null;

  const filteredFunctions = selectedGroup === 'ALL'
    ? SMART_EDU_78_FUNCTIONS
    : SMART_EDU_78_FUNCTIONS.filter(f => f.groupId === selectedGroup);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 font-serif">
      <div className="bg-white w-full max-w-3xl h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header Drawer */}
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <div className="text-xs font-bold text-blue-900 uppercase">
              Tài liệu kỹ thuật nội bộ · Nghiệm thu
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Đối Soát 78 Chức Năng, 13 Bảng &amp; CSDL Nền
            </h2>
          </div>
          <button
            onClick={() => setIsTechSpecOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trạng thái kết nối nhanh */}
        <div className="bg-blue-50/70 p-3 border-b border-blue-200 text-xs flex flex-wrap items-center justify-between gap-3 text-slate-700">
          <div>
            RPC <code className="font-mono text-blue-900">current_access()</code>:
            {rpcAccess.data ? (
              <span className="text-emerald-700 font-semibold ml-1">
                ✓ Hoạt động ({rpcAccess.data.roles.join(', ')})
              </span>
            ) : (
              <span className="text-slate-500 ml-1">Chưa gọi</span>
            )}
          </div>
          <div>
            CSDL <code className="font-mono text-blue-900">public.subjects</code>:
            {subjectsTest.success ? (
              <span className="text-emerald-700 font-semibold ml-1">
                ✓ {subjectsTest.count} môn active
              </span>
            ) : subjectsTest.error ? (
              <span className="text-rose-700 font-semibold ml-1">✗ {subjectsTest.error}</span>
            ) : (
              <button
                onClick={testSubjectsQuery}
                className="ml-1 text-blue-800 underline font-semibold"
              >
                Kiểm tra ngay
              </button>
            )}
          </div>
        </div>

        {/* 3 Tab: 78 Chức năng / 13 Bảng / CSDL */}
        <div className="flex border-b border-slate-200 bg-white text-xs font-semibold">
          <button
            onClick={() => setActiveTab('functions')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'functions'
                ? 'border-blue-900 text-blue-900 font-bold bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>78 Chức năng ({SMART_EDU_78_FUNCTIONS.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('boards')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'boards'
                ? 'border-blue-900 text-blue-900 font-bold bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>13 Bảng ảnh giao diện</span>
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-2.5 px-4 border-b-2 flex items-center gap-1.5 transition ${
              activeTab === 'database'
                ? 'border-blue-900 text-blue-900 font-bold bg-blue-50/30'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>CSDL (21 public + 5 private)</span>
          </button>
        </div>

        {/* Thân Drawer cuộn */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === 'functions' && (
            <div className="space-y-4">
              {/* Bộ lọc 6 nhóm */}
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => setSelectedGroup('ALL')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                    selectedGroup === 'ALL'
                      ? 'bg-blue-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Tất cả (78)
                </button>
                {SMART_EDU_GROUPS.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGroup(g.id)}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold ${
                      selectedGroup === g.id
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {g.name} ({g.functions.length})
                  </button>
                ))}
              </div>

              {/* Danh sách 78 mã chức năng */}
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl bg-white overflow-hidden">
                {filteredFunctions.map((fn) => (
                  <div key={fn.code} className="p-3 hover:bg-slate-50/60 transition space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-blue-900 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                          {fn.code}
                        </span>
                        <span className="font-bold text-slate-900">{fn.title}</span>
                      </div>
                      <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        Chưa triển khai
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 grid grid-cols-2 gap-2 pt-0.5">
                      <div><strong>Bảng:</strong> {fn.board}</div>
                      <div><strong>Nhóm:</strong> {fn.groupName}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'boards' && (
            <div className="space-y-3">
              {UI_BOARD_DESIGNS.map((b) => (
                <div key={b.boardNumber} className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-1">
                  <div className="flex items-center justify-between font-bold text-slate-900 text-sm">
                    <span>Bảng {b.boardNumber}: {b.name}</span>
                    <span className="font-mono text-xs text-blue-900">{b.functionRange}</span>
                  </div>
                  {b.notes && (
                    <div className="text-slate-500 text-[11px] italic">{b.notes}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'database' && (
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">21 Bảng Schema Public:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OFFICIAL_DB_TABLES.publicTables.map((t) => (
                    <div key={t.name} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                      <span className="font-mono font-bold text-blue-900 block">{t.name}</span>
                      <span className="text-[11px] text-slate-600">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200">
                <h4 className="font-bold text-rose-900 mb-2">5 Bảng Schema Private (Bảo mật backend):</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {OFFICIAL_DB_TABLES.privateTables.map((t) => (
                    <div key={t.name} className="p-2.5 bg-rose-50/50 border border-rose-200 rounded-lg">
                      <span className="font-mono font-bold text-rose-900 block">{t.name}</span>
                      <span className="text-[11px] text-slate-600">{t.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Drawer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>Phiên bản 1.0 THCS (09/11/2026)</span>
          <button
            onClick={() => setIsTechSpecOpen(false)}
            className="px-3 py-1 bg-slate-200 hover:bg-slate-300 rounded font-semibold text-slate-700"
          >
            Đóng tài liệu
          </button>
        </div>
      </div>
    </div>
  );
};
