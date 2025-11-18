"use client";

import { ReactNode } from "react";

interface ConfirmDialogProps {
  /** 是否顯示 */
  isOpen: boolean;
  /** 標題 */
  title: string;
  /** 訊息內容 */
  message: string | ReactNode;
  /** 確認按鈕文字 */
  confirmText?: string;
  /** 取消按鈕文字 */
  cancelText?: string;
  /** 確認按鈕樣式 */
  confirmVariant?: "primary" | "danger";
  /** 確認回調 */
  onConfirm: () => void;
  /** 取消回調 */
  onCancel: () => void;
}

/**
 * 確認對話框元件
 * 
 * 符合規格：3.2 連動邏輯 – 層級篩選
 * - 用於未儲存變更確認
 * - 用於刪除確認
 * - 用於取消操作確認
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "確認",
  cancelText = "取消",
  confirmVariant = "primary",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmButtonClass =
    confirmVariant === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500"
      : "bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
        <div className="text-gray-700 dark:text-gray-300 mb-6">
          {message}
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${confirmButtonClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

