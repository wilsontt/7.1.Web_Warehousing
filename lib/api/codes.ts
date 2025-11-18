/**
 * 代碼維護 API 服務
 * 
 * 符合規格：4. API 與資料流程
 * 依據：1.1.代碼維護/規格文件 (SPEC)-1.1.代碼維護.md
 * 
 * 建立日期: 2025/11/15
 * 最後更新: 2025/11/15
 */

import type {
  CodesTreeResponse,
  BatchSaveRequest,
  BatchSaveResponse,
  SearchCodesRequest,
  SearchCodesResponse,
} from "@/lib/types/codes";
import { getToken } from "@/lib/api/auth";
import type { ApiErrorResponse } from "@/lib/types/common";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * 統一的 API 錯誤類別
 */
export class CodesApiError extends Error {
  code?: string;
  statusCode?: number;
  details?: Array<{ field?: string; message: string; code?: string }>;
  trackingId?: string;

  constructor(message: string, error?: ApiErrorResponse) {
    super(message);
    this.name = "CodesApiError";
    this.code = error?.code;
    this.details = error?.details;
    this.trackingId = error?.trackingId;
  }
}

/**
 * 通用 API 請求函數
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({
        code: "UNKNOWN_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
      }));

      throw new CodesApiError(errorData.message || "API 請求失敗", errorData);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof CodesApiError) {
      throw error;
    }
    throw new CodesApiError(
      error instanceof Error ? error.message : "網路錯誤",
      {
        code: "NETWORK_ERROR",
        message: error instanceof Error ? error.message : "網路錯誤",
      }
    );
  }
}

/**
 * 取得三層分類樹狀結構
 * 
 * GET /api/codes/tree
 * 
 * 符合規格：4. API 與資料流程
 */
export async function getCodesTree(): Promise<CodesTreeResponse> {
  // 開發環境：使用 Mock API（當後端 API 不可用時）
  // 實際環境：應移除此條件，直接使用真實 API
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL) {
    const { getMockCodesTree } = await import("@/lib/mocks/codesMock");
    return getMockCodesTree();
  }

  // 真實 API 呼叫
  return apiRequest<CodesTreeResponse>("/codes/tree", {
    method: "GET",
  });
}

/**
 * 批次儲存代碼資料
 * 
 * POST /api/codes/batch
 * 
 * 符合規格：4. API 與資料流程
 */
export async function batchSaveCodes(
  request: BatchSaveRequest
): Promise<BatchSaveResponse> {
  // 開發環境：使用 Mock API（當後端 API 不可用時）
  // 實際環境：應移除此條件，直接使用真實 API
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL) {
    const { mockBatchSaveCodes } = await import("@/lib/mocks/codesMock");
    return mockBatchSaveCodes(request);
  }

  // 真實 API 呼叫
  return apiRequest<BatchSaveResponse>("/codes/batch", {
    method: "POST",
    body: JSON.stringify(request),
  });
}

/**
 * 查詢代碼資料
 * 
 * GET /api/codes/search
 * 
 * 符合規格：4. API 與資料流程
 */
export async function searchCodes(
  params: SearchCodesRequest
): Promise<SearchCodesResponse> {
  // 開發環境：使用 Mock API（當後端 API 不可用時）
  // 實際環境：應移除此條件，直接使用真實 API
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL) {
    const { mockSearchCodes } = await import("@/lib/mocks/codesMock");
    return mockSearchCodes(params);
  }

  // 真實 API 呼叫
  const queryParams = new URLSearchParams();
  if (params.keyword) queryParams.append("keyword", params.keyword);
  if (params.majorCatNo) queryParams.append("majorCatNo", params.majorCatNo);
  if (params.midCatCode) queryParams.append("midCatCode", params.midCatCode);
  if (params.page) queryParams.append("page", params.page.toString());
  if (params.pageSize) queryParams.append("pageSize", params.pageSize.toString());

  const queryString = queryParams.toString();
  const endpoint = `/codes/search${queryString ? `?${queryString}` : ""}`;

  return apiRequest<SearchCodesResponse>(endpoint, {
    method: "GET",
  });
}

