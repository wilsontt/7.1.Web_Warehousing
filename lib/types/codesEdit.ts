/**
 * 代碼維護編輯相關型別
 * 
 * 用於追蹤待新增、修改、刪除的資料
 * 
 * 建立日期: 2025/11/15
 * 最後更新: 2025/11/15
 */

import type { MajorCategory, MidCategory, SubCategory } from "./codes";

/**
 * 編輯狀態標記
 */
export type EditStatus = "pendingCreate" | "pendingUpdate" | "pendingDelete" | null;

/**
 * 帶編輯狀態的大分類
 */
export interface MajorCategoryWithEdit extends MajorCategory {
  _editStatus?: EditStatus;
  _tempId?: string; // 臨時 ID（用於 pendingCreate）
}

/**
 * 帶編輯狀態的中分類
 */
export interface MidCategoryWithEdit extends MidCategory {
  _editStatus?: EditStatus;
  _tempId?: string; // 臨時 ID（用於 pendingCreate）
}

/**
 * 帶編輯狀態的細分類
 */
export interface SubCategoryWithEdit extends SubCategory {
  _editStatus?: EditStatus;
  _tempId?: string; // 臨時 ID（用於 pendingCreate）
}

/**
 * 編輯中的儲存格資訊
 */
export interface EditingCell {
  rowIndex: number;
  columnKey: string;
  type: "major" | "mid" | "sub";
}

