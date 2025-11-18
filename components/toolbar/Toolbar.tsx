"use client";

import { ReactNode } from "react";

export interface ToolbarButton {
  id: string;
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  shortcut?: string;
}

interface ToolbarProps {
  buttons: ToolbarButton[];
  className?: string;
}

/**
 * Toolbar 元件
 * 
 * 符合規格：2.2 共用元件與資料表格行為
 * - 標準按鈕：新增、修改、查詢、列印、確認、取消、停用/封存
 * - 按鈕狀態管理（動態啟用/禁用）
 * - 按鈕行為標準化
 */
export default function Toolbar({ buttons, className = "" }: ToolbarProps) {
  const getButtonStyles = (variant: ToolbarButton["variant"] = "secondary") => {
    const baseStyles =
      "px-4 py-2 rounded-button font-medium text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] flex items-center gap-2";

    switch (variant) {
      case "primary":
        return `${baseStyles} bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500`;
      case "danger":
        return `${baseStyles} bg-red-600 hover:bg-red-700 text-white focus:ring-red-500`;
      default:
        return `${baseStyles} bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 focus:ring-gray-500`;
    }
  };

  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {buttons.map((button) => (
        <button
          key={button.id}
          onClick={button.onClick}
          disabled={button.disabled}
          aria-disabled={button.disabled}
          className={getButtonStyles(button.variant)}
          title={button.shortcut ? `${button.label} (${button.shortcut})` : button.label}
        >
          {button.icon && <span>{button.icon}</span>}
          <span>{button.label}</span>
        </button>
      ))}
    </div>
  );
}

/**
 * 標準 Toolbar 按鈕定義
 * 
 * 符合規格：2.2 共用元件與資料表格行為
 * - 查詢 → 切換搜尋/篩選面板
 * - 新增 → 清空表單進入新增模式
 * - 修改 → 切換為編輯模式
 * - 停用 → 對資料進行非刪除的停用標記
 * - 刪除 → 只允許未被引用資料
 * - 複製 → 以當前資料為模板建立新表單
 */
export const STANDARD_TOOLBAR_BUTTONS = {
  QUERY: "query",
  ADD: "add",
  EDIT: "edit",
  DELETE: "delete",
  DISABLE: "disable",
  COPY: "copy",
  PRINT: "print",
  CONFIRM: "confirm",
  CANCEL: "cancel",
} as const;

