/**
 * 代碼維護 API 型別定義
 * 
 * 符合規格：4. API 與資料流程
 * 依據：1.1.代碼維護/規格文件 (SPEC)-1.1.代碼維護.md
 * 
 * 本檔案定義了代碼維護模組的所有 TypeScript 型別，
 * 用於前端與後端 API 的型別安全。
 * 
 * 注意：本檔案使用 lib/types/common.ts 中的共用型別，
 * 避免重複定義，保持一致性。
 */

import type {
  BaseEntity,
  PaginatedResponse,
  BatchOperationRequest,
  BatchOperationResponse,
  ApiErrorResponse,
  ValidationError,
  ValidationResult,
  EntityWithStatus,
  PendingStatus,
} from "@/lib/types/common";

// ============================================
// 基礎型別定義
// ============================================

/**
 * 大分類 (CDF)
 */
export interface MajorCategory extends BaseEntity {
  /** 大分類序號 (id) - 對應 BaseEntity.id */
  majorCatId: number;
  /** 大分類編碼 (CDF00) - 3 字元，唯一 */
  majorCatNo: string;
  /** 大分類名稱 (CDF01) - 最大 120 字元 */
  majorCatName: string;
  /** 建檔人員 (CRE_USERID) */
  createdBy?: string;
  /** 建檔日期 (CRE_DTIME) - 格式：YYYYMMDDHHmmss */
  createdDate?: string;
  /** 修改人員 (UPD_USERID) */
  modifiedBy?: string;
  /** 修改日期 (UPD_DTIME) - 格式：YYYYMMDDHHmmss */
  modifiedDate?: string;
  // 注意：lockVer, createdTime, updatedTime 等欄位已由 BaseEntity 提供
}

/**
 * 中分類 (CDS)
 */
export interface MidCategory {
  /** 中分類序號 (id) */
  midCatId: number;
  /** 大分類序號 (cdf_id) */
  majorCatId: number;
  /** 大分類編碼 (CDF00) - FK */
  majorCatNo: string;
  /** 中分類編碼 (CDS00) - 3 字元，與 majorCatNo 組成唯一鍵 */
  midCatCode: string;
  /** 編碼說明 (CDS01) - 最大 120 字元 */
  codeDesc: string;
  /** 數值1 (CDS02) */
  value1?: number;
  /** 數值2 (CDS03) */
  value2?: number;
  /** 備註 (CDS04) - 最大 240 字元 */
  remark?: string;
  /** 建檔人員 (CRE_USERID) */
  createdBy?: string;
  /** 建檔日期 (CRE_DTIME) */
  createdDate?: string;
  /** 修改人員 (UPD_USERID) */
  modifiedBy?: string;
  /** 修改日期 (UPD_DTIME) */
  modifiedDate?: string;
  /** 鎖定版本 (lock_version) */
  lockVer?: number;
  /** 建立時間 (created_at) */
  createdTime?: string;
  /** 更新時間 (updated_at) */
  updatedTime?: string;
}

/**
 * 細分類 (CDT)
 */
export interface SubCategory {
  /** 細分類序號 (id) */
  id: number;
  /** 中分類序號 (cds_id) */
  midCatId: number;
  /** 大分類編碼 (CDF00) - FK */
  majorCatNo: string;
  /** 中分類編碼 (CDS00) - FK */
  midCatCode: string;
  /** 細分類編碼 (CDT00) - 3 字元，與 majorCatNo + midCatCode 組成唯一鍵 */
  subcatCode: string;
  /** 編碼說明 (CDT01) - 最大 120 字元 */
  codeDesc: string;
  /** 備註 (CDT02) - 最大 240 字元 */
  remark?: string;
  /** 建檔人員 (CRE_USERID) */
  createdBy?: string;
  /** 建檔日期 (CRE_DTIME) */
  createdDate?: string;
  /** 修改人員 (UPD_USERID) */
  modifiedBy?: string;
  /** 修改日期 (UPD_DTIME) */
  modifiedDate?: string;
  /** 鎖定版本 (lock_version) */
  lockVer?: number;
  /** 建立時間 (created_at) */
  createdTime?: string;
  /** 更新時間 (updated_at) */
  updatedTime?: string;
}

// ============================================
// API 請求/回應型別
// ============================================

/**
 * GET /api/codes/tree 回應
 * 取得完整的三層分類樹狀結構
 */
export interface CodesTreeResponse {
  /** 大分類列表 */
  majorCategories: MajorCategory[];
  /** 中分類列表（依 majorCatNo 分組） */
  midCategories: MidCategory[];
  /** 細分類列表（依 majorCatNo + midCatCode 分組） */
  subCategories: SubCategory[];
}

/**
 * POST /api/codes/batch 請求
 * 批次儲存（新增、修改、刪除）
 * 
 * 注意：使用共用型別 BatchOperationRequest，但需要特殊處理三種不同的分類類型
 */
export interface BatchSaveRequest {
  /** 待新增的資料 */
  creates: Array<
    | Omit<MajorCategory, "majorCatId" | "lockVer" | "createdTime" | "updatedTime" | "id">
    | Omit<MidCategory, "midCatId" | "majorCatId" | "lockVer" | "createdTime" | "updatedTime" | "id">
    | Omit<SubCategory, "id" | "midCatId" | "lockVer" | "createdTime" | "updatedTime">
  >;
  /** 待修改的資料（需包含 id 和 lockVer） */
  updates: Array<
    | (Pick<MajorCategory, "majorCatId" | "lockVer"> & Partial<MajorCategory>)
    | (Pick<MidCategory, "midCatId" | "lockVer"> & Partial<MidCategory>)
    | (Pick<SubCategory, "id" | "lockVer"> & Partial<SubCategory>)
  >;
  /** 待刪除的資料（只需 id 和 lockVer） */
  deletes: Array<
    | { majorCatId: number; lockVer: number; type: "major" }
    | { midCatId: number; lockVer: number; type: "mid" }
    | { id: number; lockVer: number; type: "sub" }
  >;
}

/**
 * POST /api/codes/batch 回應
 * 
 * 使用共用型別 BatchOperationResponse
 */
export type BatchSaveResponse = BatchOperationResponse;

/**
 * GET /api/codes/search 請求參數
 */
export interface SearchCodesRequest {
  /** 關鍵字（搜尋代號、名稱、說明） */
  keyword?: string;
  /** 大分類編碼（篩選條件） */
  majorCatNo?: string;
  /** 中分類編碼（篩選條件） */
  midCatCode?: string;
  /** 頁碼（從 1 開始） */
  page?: number;
  /** 每頁筆數 */
  pageSize?: number;
}

/**
 * 搜尋結果項目
 */
export interface SearchCodeResult {
  /** 類型 */
  type: "major" | "mid" | "sub";
  /** 大分類資料 */
  major?: MajorCategory;
  /** 中分類資料 */
  mid?: MidCategory;
  /** 細分類資料 */
  sub?: SubCategory;
  /** 匹配的欄位 */
  matchedFields: string[];
}

/**
 * GET /api/codes/search 回應
 * 
 * 使用共用型別 PaginatedResponse
 */
export interface SearchCodesResponse extends PaginatedResponse<SearchCodeResult> {
  /** 搜尋結果（已包含在 PaginatedResponse 的 data 中） */
  results: SearchCodeResult[];
}

// ============================================
// 錯誤回應型別
// ============================================

/**
 * API 錯誤回應
 * 
 * 使用共用型別 ApiErrorResponse（已從 common.ts 匯入）
 */
export type { ApiErrorResponse } from "@/lib/types/common";

// ============================================
// 前端狀態管理型別
// ============================================

/**
 * 待處理狀態標記
 * 
 * 使用共用型別 PendingStatus（已從 common.ts 匯入）
 */
export type { PendingStatus } from "@/lib/types/common";

/**
 * 帶有待處理狀態的大分類
 */
export type MajorCategoryWithStatus = EntityWithStatus<MajorCategory>;

/**
 * 帶有待處理狀態的中分類
 */
export type MidCategoryWithStatus = EntityWithStatus<MidCategory>;

/**
 * 帶有待處理狀態的細分類
 */
export type SubCategoryWithStatus = EntityWithStatus<SubCategory>;

// ============================================
// 驗證錯誤型別
// ============================================

/**
 * 欄位驗證錯誤
 * 
 * 使用共用型別 ValidationError（已從 common.ts 匯入）
 */
export type { ValidationError, ValidationResult } from "@/lib/types/common";

