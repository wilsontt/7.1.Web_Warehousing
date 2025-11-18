/**
 * 共用 API 型別定義
 * 
 * 本檔案定義了所有模組共用的 API 型別，
 * 避免重複定義，保持一致性。
 * 1. 共用型別定義 (lib/types/common.ts)
 *    包含所有模組共用的型別：
 *    BaseEntity - 標準資料模型基礎欄位（id, lockVer, createdBy, createdTime 等）
 *    PaginatedResponse<T> - 標準分頁回應
 *    BatchOperationResponse - 標準批次操作回應
 *    ApiErrorResponse - 標準錯誤回應
 *    BaseQueryParams - 標準查詢參數
 *    ValidationError / ValidationResult - 驗證錯誤
 *    EntityWithStatus<T> - 前端狀態管理
 */

// ============================================
// 標準 API 回應型別
// ============================================

/**
 * 標準 API 錯誤回應
 * 所有 API 錯誤都應遵循此格式
 */
export interface ApiErrorResponse {
  /** 錯誤代碼 */
  code: string;
  /** 錯誤訊息（正體中文） */
  message: string;
  /** 詳細錯誤資訊 */
  details?: Array<{
    /** 錯誤欄位 */
    field?: string;
    /** 錯誤訊息 */
    message: string;
    /** 錯誤代碼 */
    code?: string;
  }>;
  /** 追蹤 ID（用於稽核和除錯） */
  trackingId?: string;
}

/**
 * 標準分頁回應
 * 所有分頁查詢 API 都應使用此格式
 */
export interface PaginatedResponse<T> {
  /** 資料列表 */
  data: T[];
  /** 總筆數 */
  total: number;
  /** 目前頁碼（從 1 開始） */
  page: number;
  /** 每頁筆數 */
  pageSize: number;
  /** 總頁數 */
  totalPages: number;
}

/**
 * 標準批次操作回應
 * 所有批次操作 API 都應使用此格式
 */
export interface BatchOperationResponse {
  /** 是否成功 */
  success: boolean;
  /** 追蹤 ID（用於稽核） */
  trackingId: string;
  /** 成功訊息 */
  message?: string;
  /** 錯誤訊息列表 */
  errors?: Array<{
    /** 錯誤欄位 */
    field?: string;
    /** 錯誤訊息 */
    message: string;
    /** 錯誤代碼 */
    code?: string;
  }>;
  /** 失敗的項目（如果有部分失敗） */
  failedItems?: Array<{
    /** 項目類型 */
    type: "create" | "update" | "delete";
    /** 項目索引或 ID */
    index: number | string;
    /** 錯誤訊息 */
    error: string;
  }>;
}

// ============================================
// 標準查詢參數
// ============================================

/**
 * 標準查詢參數
 * 所有查詢 API 都應支援這些參數
 */
export interface BaseQueryParams {
  /** 關鍵字（通用搜尋） */
  keyword?: string;
  /** 頁碼（從 1 開始） */
  page?: number;
  /** 每頁筆數 */
  pageSize?: number;
  /** 排序欄位 */
  sortBy?: string;
  /** 排序方向 */
  sortOrder?: "asc" | "desc";
}

// ============================================
// 標準 CRUD 操作型別
// ============================================

/**
 * 標準建立請求
 * 用於批次操作中的 creates 陣列
 */
export type CreateRequest<T> = Omit<
  T,
  | "id"
  | "createdTime"
  | "updatedTime"
  | "lockVer"
  | "createdBy"
  | "createdDate"
  | "modifiedBy"
  | "modifiedDate"
> & {
  /** 建檔人員（可選，通常由後端自動填入） */
  createdBy?: string;
};

/**
 * 標準更新請求
 * 用於批次操作中的 updates 陣列
 */
export type UpdateRequest<T> = 
  Partial<T> & {
    /** ID（必填） */
    id?: T extends { id: infer I } ? I : never;
    /** 鎖定版本（必填） */
    lockVer?: T extends { lockVer: infer L } ? L : never;
    /** 修改人員（可選，通常由後端自動填入） */
    modifiedBy?: string;
  };

/**
 * 標準刪除請求
 * 用於批次操作中的 deletes 陣列
 */
export interface DeleteRequest {
  /** 資料 ID */
  id: number;
  /** 鎖定版本（樂觀鎖定） */
  lockVer: number;
  /** 資料類型（用於識別是哪種資料） */
  type: string;
}

/**
 * 標準批次操作請求
 * 所有批次操作 API 都應使用此格式
 */
export interface BatchOperationRequest<T extends { id?: number | string; lockVer?: number }> {
  /** 待新增的資料 */
  creates: CreateRequest<T>[];
  /** 待修改的資料 */
  updates: UpdateRequest<T>[];
  /** 待刪除的資料 */
  deletes: DeleteRequest[];
}

// ============================================
// 標準資料模型基礎型別
// ============================================

/**
 * 標準資料模型基礎欄位
 * 所有資料模型都應包含這些欄位
 */
export interface BaseEntity {
  /** 資料 ID */
  id: number;
  /** 鎖定版本（樂觀鎖定） */
  lockVer?: number;
  /** 建檔人員 */
  createdBy?: string;
  /** 建檔日期（格式：YYYYMMDDHHmmss） */
  createdDate?: string;
  /** 修改人員 */
  modifiedBy?: string;
  /** 修改日期（格式：YYYYMMDDHHmmss） */
  modifiedDate?: string;
  /** 建立時間（ISO 8601） */
  createdTime?: string;
  /** 更新時間（ISO 8601） */
  updatedTime?: string;
}

// ============================================
// 標準驗證錯誤型別
// ============================================

/**
 * 欄位驗證錯誤
 */
export interface ValidationError {
  /** 欄位名稱 */
  field: string;
  /** 錯誤訊息 */
  message: string;
  /** 錯誤代碼 */
  code: string;
}

/**
 * 表單驗證結果
 */
export interface ValidationResult {
  /** 是否有效 */
  isValid: boolean;
  /** 錯誤列表 */
  errors: ValidationError[];
}

// ============================================
// 標準前端狀態管理型別
// ============================================

/**
 * 待處理狀態標記
 */
export type PendingStatus = "pendingCreate" | "pendingUpdate" | "pendingDelete" | null;

/**
 * 帶有待處理狀態的資料模型
 */
export type EntityWithStatus<T> = T & {
  /** 待處理狀態 */
  _status?: PendingStatus;
  /** 是否為新增（尚未儲存） */
  _isNew?: boolean;
};

// ============================================
// 標準 API 請求配置
// ============================================

/**
 * API 請求配置
 */
export interface ApiRequestConfig {
  /** 請求方法 */
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  /** 請求路徑 */
  path: string;
  /** 請求參數（Query String） */
  params?: Record<string, any>;
  /** 請求主體（Request Body） */
  body?: any;
  /** 是否需要認證 */
  requiresAuth?: boolean;
  /** 自訂標頭 */
  headers?: Record<string, string>;
}

// ============================================
// 標準 API 回應包裝
// ============================================

/**
 * API 回應包裝
 * 用於統一處理 API 回應
 */
export type ApiResponse<T> = T | ApiErrorResponse;

/**
 * 檢查是否為錯誤回應
 */
export function isErrorResponse(
  response: any
): response is ApiErrorResponse {
  return response && typeof response === "object" && "code" in response && "message" in response;
}

