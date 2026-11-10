/**
 * Schema & UI Boards Controller
 * Cơ sở dữ liệu nền: 001_nen_tang.sql (21 bảng public, 5 bảng private) & 002_danh_muc.sql
 * Thiết kế giao diện: 13 bảng ảnh giao diện
 */

import { ServerRequest, ServerResponse } from '../types';
import { OFFICIAL_DB_TABLES, UI_BOARDS, THCS_SUBJECTS, THCS_GRADES } from '../../../src/types/smartEduData';

export async function handleGetDatabaseSchema(req: ServerRequest): Promise<ServerResponse> {
  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    data: {
      platform: 'Smart EDU – Nền tảng học tập tương tác và hỗ trợ kiểm tra, đánh giá cấp THCS',
      scope: {
        grades: THCS_GRADES,
        subjectsCount: THCS_SUBJECTS.length,
        subjects: THCS_SUBJECTS
      },
      databaseStructure: {
        foundationSql: '001_nen_tang.sql',
        categorySql: '002_danh_muc.sql',
        publicTablesCount: OFFICIAL_DB_TABLES.publicTables.length,
        publicTables: OFFICIAL_DB_TABLES.publicTables,
        privateTablesCount: OFFICIAL_DB_TABLES.privateTables.length,
        privateTables: OFFICIAL_DB_TABLES.privateTables
      },
      uiDesignBoards: {
        totalBoards: UI_BOARDS.length,
        boards: UI_BOARDS
      }
    }
  };
}
