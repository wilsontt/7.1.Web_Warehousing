"use client";

import { ReactNode } from "react";
import Toolbar, { type ToolbarButton } from "@/components/toolbar/Toolbar";

interface CodesToolbarProps {
  /** 是否有未儲存變更 */
  hasUnsavedChanges?: boolean;
  /** 是否已選取大分類 */
  hasSelectedMajor?: boolean;
  /** 是否已選取中分類 */
  hasSelectedMid?: boolean;
  /** 是否有選取的列（用於刪除） */
  hasSelectedRow?: boolean;
  /** 是否有待新增的列（禁止重複新增） */
  hasPendingCreate?: boolean;
  /** 新增大分類回調 */
  onAddMajor?: () => void;
  /** 新增中分類回調 */
  onAddMid?: () => void;
  /** 新增細分類回調 */
  onAddSub?: () => void;
  /** 刪除回調 */
  onDelete?: () => void;
  /** 查詢回調 */
  onQuery?: () => void;
  /** 列印回調 */
  onPrint?: () => void;
  /** 儲存回調 */
  onSave?: () => void;
  /** 取消回調 */
  onCancel?: () => void;
  /** 自訂 className */
  className?: string;
}

/**
 * 代碼維護工具列元件
 * 
 * 符合規格：3.1 UI 佈局 – 三欄式連動介面（B2-1 工具列）
 * - 按鈕：新增大分類 / 新增中分類 / 新增細分類 / 刪除 / 查詢 / 列印 / 儲存 / 取消
 * - 按鈕狀態管理（依資料狀態動態啟用/禁用）
 * - 未儲存變更時，「儲存」、「取消」需高亮
 * - 顯示「有未儲存變更」提示
 */
export default function CodesToolbar({
  hasUnsavedChanges = false,
  hasSelectedMajor = false,
  hasSelectedMid = false,
  hasSelectedRow = false,
  hasPendingCreate = false,
  onAddMajor,
  onAddMid,
  onAddSub,
  onDelete,
  onQuery,
  onPrint,
  onSave,
  onCancel,
  className = "",
}: CodesToolbarProps) {
  // 簡單的圖示（使用 Unicode 符號，未來可替換為 SVG 圖示）
  const icons = {
    add: "+",
    delete: "×",
    query: "🔍",
    print: "🖨",
    save: "💾",
    cancel: "✕",
  };

  // 建立按鈕陣列
  const buttons: ToolbarButton[] = [
    {
      id: "add-major",
      label: "新增大分類",
      icon: icons.add,
      onClick: onAddMajor || (() => {}),
      disabled: hasPendingCreate, // 禁止在已有未儲存列時重複新增
      variant: "secondary",
    },
    {
      id: "add-mid",
      label: "新增中分類",
      icon: icons.add,
      onClick: onAddMid || (() => {}),
      disabled: !hasSelectedMajor || hasPendingCreate, // 必須先選取大分類，且禁止重複新增
      variant: "secondary",
    },
    {
      id: "add-sub",
      label: "新增細分類",
      icon: icons.add,
      onClick: onAddSub || (() => {}),
      disabled: !hasSelectedMid || hasPendingCreate, // 必須先選取中分類，且禁止重複新增
      variant: "secondary",
    },
    {
      id: "delete",
      label: "刪除",
      icon: icons.delete,
      onClick: onDelete || (() => {}),
      disabled: !hasSelectedRow, // 必須先選取列
      variant: "danger",
    },
    {
      id: "query",
      label: "查詢",
      icon: icons.query,
      onClick: onQuery || (() => {}),
      variant: "secondary",
    },
    {
      id: "print",
      label: "列印",
      icon: icons.print,
      onClick: onPrint || (() => {}),
      variant: "secondary",
    },
    {
      id: "save",
      label: "儲存",
      icon: icons.save,
      onClick: onSave || (() => {}),
      disabled: !hasUnsavedChanges, // 沒有未儲存變更時禁用
      variant: hasUnsavedChanges ? "primary" : "secondary", // 有未儲存變更時高亮
    },
    {
      id: "cancel",
      label: "取消",
      icon: icons.cancel,
      onClick: onCancel || (() => {}),
      disabled: !hasUnsavedChanges, // 沒有未儲存變更時禁用
      variant: hasUnsavedChanges ? "primary" : "secondary", // 有未儲存變更時高亮
    },
  ];

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* 工具列 */}
      <Toolbar buttons={buttons} />

      {/* 未儲存變更提示 */}
      {hasUnsavedChanges && (
        <div className="flex items-center gap-2 px-4 py-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md text-sm text-yellow-800 dark:text-yellow-200">
          <span className="font-medium">⚠️</span>
          <span>您有未儲存的變更，請記得儲存或取消。</span>
        </div>
      )}
    </div>
  );
}

