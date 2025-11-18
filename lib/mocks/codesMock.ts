/**
 * 代碼維護 Mock 資料
 * 
 * 符合規格：1.1.代碼維護/規格文件 (SPEC)-1.1.代碼維護.md
 * 用於開發和測試環境，提供測試資料
 * 
 * 建立日期: 2025/11/15
 * 最後更新: 2025/11/15
 */

import type {
  MajorCategory,
  MidCategory,
  SubCategory,
  CodesTreeResponse,
  BatchSaveRequest,
  BatchSaveResponse,
  SearchCodesRequest,
  SearchCodesResponse,
  SearchCodeResult,
} from "@/lib/types/codes";

/**
 * Mock 資料儲存（模擬資料庫）
 * 在實際環境中，這些資料應由後端資料庫提供
 */
let mockMajorCategories: MajorCategory[] = [];
let mockMidCategories: MidCategory[] = [];
let mockSubCategories: SubCategory[] = [];

/**
 * 初始化 Mock 資料
 * 產生符合契約的測試資料
 */
function initializeMockData(): void {
  const now = new Date();
  const timestamp = now.toISOString();
  const dateStr = now.toISOString().replace(/[-:T.]/g, "").slice(0, 14);

  mockMajorCategories = [];
  mockMidCategories = [];
  mockSubCategories = [];

  // 目標：大分類 50 個（001..050）
  // 每個大分類下：中分類 20 個（001..020）
  // 每個中分類下：細分類 10 個（001..010）
  let majorId = 0;
  let midId = 0;
  let subId = 0;

  for (let m = 1; m <= 50; m++) {
    majorId++;
    const majorNo = String(m).padStart(3, "0");

    mockMajorCategories.push({
      majorCatId: majorId,
      id: majorId,
      majorCatNo: majorNo,
      majorCatName: `大分類-${majorNo}`,
      createdBy: "admin",
      createdDate: dateStr,
      modifiedBy: "admin",
      modifiedDate: dateStr,
      lockVer: 1,
      createdTime: timestamp,
      updatedTime: timestamp,
    });

    for (let d = 1; d <= 20; d++) {
      midId++;
      const midCode = String(d).padStart(3, "0");

      mockMidCategories.push({
        midCatId: midId,
        majorCatId: majorId,
        majorCatNo: majorNo,
        midCatCode: midCode,
        codeDesc: `中分類-${majorNo}-${midCode}`,
        value1: 0,
        value2: 0,
        remark: "",
        createdBy: "admin",
        createdDate: dateStr,
        modifiedBy: "admin",
        modifiedDate: dateStr,
        lockVer: 1,
        createdTime: timestamp,
        updatedTime: timestamp,
      });

      for (let s = 1; s <= 10; s++) {
        subId++;
        const subCode = String(s).padStart(3, "0");

        mockSubCategories.push({
          id: subId,
          midCatId: midId,
          majorCatNo: majorNo,
          midCatCode: midCode,
          subcatCode: subCode,
          codeDesc: `細分類-${majorNo}-${midCode}-${subCode}`,
          remark: "",
          createdBy: "admin",
          createdDate: dateStr,
          modifiedBy: "admin",
          modifiedDate: dateStr,
          lockVer: 1,
          createdTime: timestamp,
          updatedTime: timestamp,
        });
      }
    }
  }
}

// 初始化資料
initializeMockData();

/**
 * 產生追蹤 ID（用於稽核）
 */
function generateTrackingId(): string {
  return `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 格式化日期為 YYYYMMDDHHmmss
 */
function formatDate(date: Date): string {
  return date.toISOString().replace(/[-:T.]/g, "").slice(0, 14);
}

/**
 * Mock: 取得三層分類樹狀結構
 * 
 * 符合 API: GET /api/codes/tree
 */
export async function getMockCodesTree(): Promise<CodesTreeResponse> {
  // 模擬 API 延遲（< 1.5 秒）
  await new Promise((resolve) => setTimeout(resolve, 300));

  return {
    majorCategories: [...mockMajorCategories],
    midCategories: [...mockMidCategories],
    subCategories: [...mockSubCategories],
  };
}

/**
 * Mock: 批次儲存代碼資料
 * 
 * 符合 API: POST /api/codes/batch
 */
export async function mockBatchSaveCodes(
  request: BatchSaveRequest
): Promise<BatchSaveResponse> {
  // 模擬 API 延遲（< 2 秒）
  await new Promise((resolve) => setTimeout(resolve, 500));

  const trackingId = generateTrackingId();
  const now = new Date();
  const timestamp = now.toISOString();
  const dateStr = formatDate(now);
  const errors: Array<{ field?: string; message: string; code?: string }> = [];
  const failedItems: Array<{
    type: "create" | "update" | "delete";
    index: number | string;
    error: string;
  }> = [];

  // 處理新增
  for (let i = 0; i < request.creates.length; i++) {
    const create = request.creates[i];
    try {
      // 驗證必填欄位
      if ("majorCatNo" in create && !create.majorCatNo) {
        errors.push({
          field: "majorCatNo",
          message: "大分類編碼為必填欄位",
          code: "REQUIRED",
        });
        failedItems.push({
          type: "create",
          index: i,
          error: "大分類編碼為必填欄位",
        });
        continue;
      }

      // 模擬新增邏輯
      if ("majorCatNo" in create && "majorCatName" in create) {
        // 新增大分類
        const newId = Math.max(...mockMajorCategories.map((c) => c.majorCatId), 0) + 1;
        const newMajor: MajorCategory = {
          majorCatId: newId,
          id: newId,
          majorCatNo: create.majorCatNo,
          majorCatName: create.majorCatName,
          createdBy: create.createdBy || "admin",
          createdDate: dateStr,
          modifiedBy: create.createdBy || "admin",
          modifiedDate: dateStr,
          lockVer: 1,
          createdTime: timestamp,
          updatedTime: timestamp,
        };
        mockMajorCategories.push(newMajor);
      } else if ("midCatCode" in create && "codeDesc" in create) {
        // 新增中分類
        const newId = Math.max(...mockMidCategories.map((c) => c.midCatId), 0) + 1;
        const majorCat = mockMajorCategories.find(
          (m) => m.majorCatNo === create.majorCatNo
        );
        if (!majorCat) {
          errors.push({
            field: "majorCatNo",
            message: "大分類不存在",
            code: "NOT_FOUND",
          });
          failedItems.push({
            type: "create",
            index: i,
            error: "大分類不存在",
          });
          continue;
        }
        const newMid: MidCategory = {
          midCatId: newId,
          majorCatId: majorCat.majorCatId,
          majorCatNo: create.majorCatNo,
          midCatCode: create.midCatCode,
          codeDesc: create.codeDesc,
          value1: "value1" in create ? create.value1 : undefined,
          value2: "value2" in create ? create.value2 : undefined,
          remark: "remark" in create ? create.remark : undefined,
          createdBy: create.createdBy || "admin",
          createdDate: dateStr,
          modifiedBy: create.createdBy || "admin",
          modifiedDate: dateStr,
          lockVer: 1,
          createdTime: timestamp,
          updatedTime: timestamp,
        };
        mockMidCategories.push(newMid);
      } else if ("subcatCode" in create && "codeDesc" in create) {
        // 新增細分類
        const subCreate = create as Omit<SubCategory, "id" | "midCatId" | "lockVer" | "createdTime" | "updatedTime">;
        if (!subCreate.majorCatNo || !subCreate.midCatCode) {
          errors.push({
            field: "majorCatNo",
            message: "大分類編碼與中分類編碼為必填欄位",
            code: "REQUIRED",
          });
          failedItems.push({
            type: "create",
            index: i,
            error: "大分類編碼與中分類編碼為必填欄位",
          });
          continue;
        }
        const newId = Math.max(...mockSubCategories.map((c) => c.id), 0) + 1;
        const midCat = mockMidCategories.find(
          (m) =>
            m.majorCatNo === subCreate.majorCatNo &&
            m.midCatCode === subCreate.midCatCode
        );
        if (!midCat) {
          errors.push({
            field: "midCatCode",
            message: "中分類不存在",
            code: "NOT_FOUND",
          });
          failedItems.push({
            type: "create",
            index: i,
            error: "中分類不存在",
          });
          continue;
        }
        const newSub: SubCategory = {
          id: newId,
          midCatId: midCat.midCatId,
          majorCatNo: subCreate.majorCatNo,
          midCatCode: subCreate.midCatCode,
          subcatCode: subCreate.subcatCode,
          codeDesc: subCreate.codeDesc,
          remark: subCreate.remark,
          createdBy: subCreate.createdBy || "admin",
          createdDate: dateStr,
          modifiedBy: subCreate.createdBy || "admin",
          modifiedDate: dateStr,
          lockVer: 1,
          createdTime: timestamp,
          updatedTime: timestamp,
        };
        mockSubCategories.push(newSub);
      }
    } catch (error) {
      failedItems.push({
        type: "create",
        index: i,
        error: error instanceof Error ? error.message : "未知錯誤",
      });
    }
  }

  // 處理修改
  for (let i = 0; i < request.updates.length; i++) {
    const update = request.updates[i];
    try {
      if ("majorCatId" in update) {
        // 修改大分類
        const index = mockMajorCategories.findIndex(
          (m) => m.majorCatId === update.majorCatId
        );
        if (index === -1) {
          errors.push({
            field: "majorCatId",
            message: "大分類不存在",
            code: "NOT_FOUND",
          });
          failedItems.push({
            type: "update",
            index: update.majorCatId?.toString() || "unknown",
            error: "大分類不存在",
          });
          continue;
        }
        const existing = mockMajorCategories[index];
        if (existing.lockVer !== update.lockVer) {
          errors.push({
            field: "lockVer",
            message: "版本號不符，資料可能已被修改",
            code: "OPTIMISTIC_LOCK_CONFLICT",
          });
          failedItems.push({
            type: "update",
            index: update.majorCatId?.toString() || "unknown",
            error: "版本號不符",
          });
          continue;
        }
        mockMajorCategories[index] = {
          ...existing,
          ...update,
          lockVer: (existing.lockVer || 1) + 1,
          modifiedDate: dateStr,
          updatedTime: timestamp,
        };
      } else if ("midCatId" in update) {
        // 修改中分類
        const index = mockMidCategories.findIndex(
          (m) => m.midCatId === update.midCatId
        );
        if (index === -1) {
          errors.push({
            field: "midCatId",
            message: "中分類不存在",
            code: "NOT_FOUND",
          });
          failedItems.push({
            type: "update",
            index: update.midCatId?.toString() || "unknown",
            error: "中分類不存在",
          });
          continue;
        }
        const existing = mockMidCategories[index];
        if (existing.lockVer !== update.lockVer) {
          errors.push({
            field: "lockVer",
            message: "版本號不符，資料可能已被修改",
            code: "OPTIMISTIC_LOCK_CONFLICT",
          });
          failedItems.push({
            type: "update",
            index: update.midCatId?.toString() || "unknown",
            error: "版本號不符",
          });
          continue;
        }
        mockMidCategories[index] = {
          ...existing,
          ...update,
          lockVer: (existing.lockVer || 1) + 1,
          modifiedDate: dateStr,
          updatedTime: timestamp,
        };
      } else if ("id" in update) {
        // 修改細分類
        const index = mockSubCategories.findIndex((s) => s.id === update.id);
        if (index === -1) {
          errors.push({
            field: "id",
            message: "細分類不存在",
            code: "NOT_FOUND",
          });
          failedItems.push({
            type: "update",
            index: update.id?.toString() || "unknown",
            error: "細分類不存在",
          });
          continue;
        }
        const existing = mockSubCategories[index];
        if (existing.lockVer !== update.lockVer) {
          errors.push({
            field: "lockVer",
            message: "版本號不符，資料可能已被修改",
            code: "OPTIMISTIC_LOCK_CONFLICT",
          });
          failedItems.push({
            type: "update",
            index: update.id?.toString() || "unknown",
            error: "版本號不符",
          });
          continue;
        }
        mockSubCategories[index] = {
          ...existing,
          ...update,
          lockVer: (existing.lockVer || 1) + 1,
          modifiedDate: dateStr,
          updatedTime: timestamp,
        };
      }
    } catch (error) {
      failedItems.push({
        type: "update",
        index: "id" in update ? (update.id?.toString() || "unknown") : "majorCatId" in update ? (update.majorCatId?.toString() || "unknown") : "midCatId" in update ? (update.midCatId?.toString() || "unknown") : "unknown",
        error: error instanceof Error ? error.message : "未知錯誤",
      });
    }
  }

  // 處理刪除
  for (let i = 0; i < request.deletes.length; i++) {
    const deleteItem = request.deletes[i];
    try {
      if (deleteItem.type === "major") {
        // 檢查是否有子分類
        const majorCat = mockMajorCategories.find(
          (mc) => mc.majorCatId === deleteItem.majorCatId
        );
        if (!majorCat) {
          errors.push({
            field: "majorCatId",
            message: "大分類不存在",
            code: "NOT_FOUND",
          });
          failedItems.push({
            type: "delete",
            index: deleteItem.majorCatId,
            error: "大分類不存在",
          });
          continue;
        }
        const hasChildren = mockMidCategories.some(
          (m) => m.majorCatNo === majorCat.majorCatNo
        );
        if (hasChildren) {
          errors.push({
            field: "majorCatId",
            message: "大分類仍有中分類資料，無法刪除",
            code: "HAS_CHILDREN",
          });
          failedItems.push({
            type: "delete",
            index: deleteItem.majorCatId,
            error: "仍有子分類資料",
          });
          continue;
        }
        const index = mockMajorCategories.findIndex(
          (m) => m.majorCatId === deleteItem.majorCatId
        );
        if (index !== -1) {
          mockMajorCategories.splice(index, 1);
        }
      } else if (deleteItem.type === "mid") {
        // 檢查是否有子分類
        const midCat = mockMidCategories.find((m) => m.midCatId === deleteItem.midCatId);
        if (midCat) {
          const hasChildren = mockSubCategories.some(
            (s) =>
              s.majorCatNo === midCat.majorCatNo &&
              s.midCatCode === midCat.midCatCode
          );
          if (hasChildren) {
            errors.push({
              field: "midCatId",
              message: "中分類仍有細分類資料，無法刪除",
              code: "HAS_CHILDREN",
            });
            failedItems.push({
              type: "delete",
              index: deleteItem.midCatId,
              error: "仍有細分類資料",
            });
            continue;
          }
        }
        const index = mockMidCategories.findIndex(
          (m) => m.midCatId === deleteItem.midCatId
        );
        if (index !== -1) {
          mockMidCategories.splice(index, 1);
        }
      } else if (deleteItem.type === "sub") {
        const index = mockSubCategories.findIndex((s) => s.id === deleteItem.id);
        if (index !== -1) {
          mockSubCategories.splice(index, 1);
        }
      }
    } catch (error) {
      failedItems.push({
        type: "delete",
        index: deleteItem.type === "major" ? deleteItem.majorCatId : deleteItem.type === "mid" ? deleteItem.midCatId : deleteItem.id,
        error: error instanceof Error ? error.message : "未知錯誤",
      });
    }
  }

  // 如果有錯誤，回傳部分失敗
  if (errors.length > 0 || failedItems.length > 0) {
    return {
      success: false,
      trackingId,
      message: "部分操作失敗",
      errors,
      failedItems,
    };
  }

  // 全部成功
  return {
    success: true,
    trackingId,
    message: "批次儲存成功",
  };
}

/**
 * Mock: 查詢代碼資料
 * 
 * 符合 API: GET /api/codes/search
 */
export async function mockSearchCodes(
  params: SearchCodesRequest
): Promise<SearchCodesResponse> {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 200));

  const keyword = params.keyword?.toLowerCase() || "";
  const majorCatNo = params.majorCatNo;
  const midCatCode = params.midCatCode;
  const page = params.page || 1;
  const pageSize = params.pageSize || 20;

  const results: SearchCodeResult[] = [];

  for (const major of mockMajorCategories) {
    if (majorCatNo && major.majorCatNo !== majorCatNo) continue;
    const matchedFields: string[] = [];
    if (keyword && (major.majorCatNo.toLowerCase().includes(keyword) || major.majorCatName.toLowerCase().includes(keyword))) {
      if (major.majorCatNo.toLowerCase().includes(keyword)) matchedFields.push("majorCatNo");
      if (major.majorCatName.toLowerCase().includes(keyword)) matchedFields.push("majorCatName");
      results.push({ type: "major", major, matchedFields });
    }
  }

  for (const mid of mockMidCategories) {
    if (majorCatNo && mid.majorCatNo !== majorCatNo) continue;
    if (midCatCode && mid.midCatCode !== midCatCode) continue;
    const matchedFields: string[] = [];
    if (keyword && (mid.midCatCode.toLowerCase().includes(keyword) || mid.codeDesc.toLowerCase().includes(keyword))) {
      if (mid.midCatCode.toLowerCase().includes(keyword)) matchedFields.push("midCatCode");
      if (mid.codeDesc.toLowerCase().includes(keyword)) matchedFields.push("codeDesc");
      results.push({ type: "mid", mid, matchedFields });
    }
  }

  for (const sub of mockSubCategories) {
    if (majorCatNo && sub.majorCatNo !== majorCatNo) continue;
    if (midCatCode && sub.midCatCode !== midCatCode) continue;
    const matchedFields: string[] = [];
    if (keyword && (sub.subcatCode.toLowerCase().includes(keyword) || sub.codeDesc.toLowerCase().includes(keyword))) {
      if (sub.subcatCode.toLowerCase().includes(keyword)) matchedFields.push("subcatCode");
      if (sub.codeDesc.toLowerCase().includes(keyword)) matchedFields.push("codeDesc");
      results.push({ type: "sub", sub, matchedFields });
    }
  }

  const total = results.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedResults = results.slice(startIndex, endIndex);

  return {
    results: paginatedResults,
    data: paginatedResults,
    total,
    page,
    pageSize,
    totalPages,
  };
}

/**
 * 重置 Mock 資料（用於測試）
 */
export function resetMockData(): void {
  initializeMockData();
}

