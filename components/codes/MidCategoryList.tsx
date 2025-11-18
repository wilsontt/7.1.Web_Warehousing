"use client";

import { useMemo, useState } from "react";
import DataTable, { type Column } from "@/components/data/DataTable";
import type { MidCategory } from "@/lib/types/codes";
import type { MidCategoryWithEdit, EditingCell } from "@/lib/types/codesEdit";

interface MidCategoryListProps {
  /** 中分類資料 */
  data: MidCategoryWithEdit[];
  /** 選取的列索引 */
  selectedIndex?: number | null;
  /** 選取列的回調 */
  onRowSelect?: (category: MidCategory, index: number) => void;
  /** 是否載入中 */
  isLoading?: boolean;
  /** 是否已選取大分類 */
  hasSelectedMajor?: boolean;
  /** 更新資料回調（用於儲存格編輯） */
  onDataChange?: (index: number, field: string, value: string | number) => void;
}

/**
 * 中分類列表元件
 * 
 * 符合規格：3.1 UI 佈局 – 三欄式連動介面（B2 欄）
 * - 顯示欄位：中分類編碼 (midCatCode)、編碼說明 (codeDesc)、數值1 (value1)、數值2 (value2)、備註 (remark)
 * - 隔行變色、選取高亮、欄位內容不折行、固定表頭、水平捲軸
 * - 點選後觸發細分類篩選
 * - 根據選取的大分類自動篩選（只顯示相同 majorCatNo）
 */
export default function MidCategoryList({
  data,
  selectedIndex = null,
  onRowSelect,
  isLoading = false,
  hasSelectedMajor = false,
  onDataChange,
}: MidCategoryListProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  // 定義欄位
  const columns: Column<MidCategoryWithEdit>[] = useMemo(
    () => [
      {
        key: "midCatCode",
        label: "中分類編碼",
        sortable: true,
        width: "120px",
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "midCatCode";
          const isPendingCreate = row._editStatus === "pendingCreate";
          const isPendingDelete = row._editStatus === "pendingDelete";
          const canEdit = isPendingCreate; // 只有 pendingCreate 時可以編輯鍵值欄位

          if (isEditing && canEdit) {
            return (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => {
                  onDataChange?.(index, "midCatCode", e.target.value);
                }}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingCell(null);
                  }
                }}
                maxLength={3}
                className="w-full px-2 py-1 border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            );
          }

          return (
            <div
              className={`${isPendingDelete ? "line-through text-gray-400" : ""} ${
                canEdit ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (canEdit) {
                  setEditingCell({ rowIndex: index, columnKey: "midCatCode", type: "mid" });
                }
              }}
              title={canEdit ? "點擊編輯" : "鍵值欄位建立後不可修改"}
            >
              {value || ""}
            </div>
          );
        },
      },
      {
        key: "codeDesc",
        label: "編碼說明",
        sortable: true,
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "codeDesc";
          const isPendingDelete = row._editStatus === "pendingDelete";
          const isPendingUpdate = row._editStatus === "pendingUpdate";
          const isPendingCreate = row._editStatus === "pendingCreate";
          const canEdit = isPendingCreate || isPendingUpdate;

          if (isEditing && canEdit) {
            return (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => {
                  onDataChange?.(index, "codeDesc", e.target.value);
                }}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingCell(null);
                  }
                }}
                maxLength={120}
                className="w-full px-2 py-1 border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            );
          }

          return (
            <div
              className={`${isPendingDelete ? "line-through text-gray-400" : ""} ${
                isPendingUpdate || isPendingCreate ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              } ${canEdit ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (canEdit) {
                  setEditingCell({ rowIndex: index, columnKey: "codeDesc", type: "mid" });
                }
              }}
              title={canEdit ? "點擊編輯" : ""}
            >
              {value || ""}
            </div>
          );
        },
      },
      {
        key: "value1",
        label: "數值1",
        sortable: true,
        width: "100px",
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "value1";
          const isPendingDelete = row._editStatus === "pendingDelete";
          const isPendingUpdate = row._editStatus === "pendingUpdate";
          const isPendingCreate = row._editStatus === "pendingCreate";
          const canEdit = isPendingCreate || isPendingUpdate;

          if (isEditing && canEdit) {
            return (
              <input
                type="number"
                value={value !== undefined && value !== null ? value.toString() : ""}
                onChange={(e) => {
                  const numValue = e.target.value === "" ? undefined : Number(e.target.value);
                  onDataChange?.(index, "value1", numValue as number);
                }}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingCell(null);
                  }
                }}
                className="w-full px-2 py-1 border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            );
          }

          return (
            <div
              className={`${isPendingDelete ? "line-through text-gray-400" : ""} ${
                isPendingUpdate || isPendingCreate ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              } ${canEdit ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (canEdit) {
                  setEditingCell({ rowIndex: index, columnKey: "value1", type: "mid" });
                }
              }}
              title={canEdit ? "點擊編輯" : ""}
            >
              {value !== undefined && value !== null ? value.toString() : ""}
            </div>
          );
        },
      },
      {
        key: "value2",
        label: "數值2",
        sortable: true,
        width: "100px",
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "value2";
          const isPendingDelete = row._editStatus === "pendingDelete";
          const isPendingUpdate = row._editStatus === "pendingUpdate";
          const isPendingCreate = row._editStatus === "pendingCreate";
          const canEdit = isPendingCreate || isPendingUpdate;

          if (isEditing && canEdit) {
            return (
              <input
                type="number"
                value={value !== undefined && value !== null ? value.toString() : ""}
                onChange={(e) => {
                  const numValue = e.target.value === "" ? undefined : Number(e.target.value);
                  onDataChange?.(index, "value2", numValue as number);
                }}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingCell(null);
                  }
                }}
                className="w-full px-2 py-1 border border-primary-500 rounded"
                autoFocus
              />
            );
          }

          return (
            <div
              className={`${isPendingDelete ? "line-through text-gray-400" : ""} ${
                isPendingUpdate || isPendingCreate ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              } ${canEdit ? " cursor-pointer" : ""}`}
              onClick={() => {
                if (canEdit) {
                  setEditingCell({ rowIndex: index, columnKey: "value2", type: "mid" });
                }
              }}
              title={canEdit ? "點擊編輯" : ""}
            >
              {value !== undefined && value !== null ? value.toString() : ""}
            </div>
          );
        },
      },
      {
        key: "remark",
        label: "備註",
        sortable: false,
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "remark";
          const isPendingDelete = row._editStatus === "pendingDelete";
          const isPendingUpdate = row._editStatus === "pendingUpdate";
          const isPendingCreate = row._editStatus === "pendingCreate";
          const canEdit = isPendingCreate || isPendingUpdate;

          if (isEditing && canEdit) {
            return (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => {
                  onDataChange?.(index, "remark", e.target.value);
                }}
                onBlur={() => setEditingCell(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    setEditingCell(null);
                  }
                }}
                maxLength={240}
                className="w-full px-2 py-1 border border-primary-500 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
                autoFocus
              />
            );
          }

          return (
            <div
              className={`${isPendingDelete ? "line-through text-gray-400" : ""} ${
                isPendingUpdate || isPendingCreate ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              } ${canEdit ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (canEdit) {
                  setEditingCell({ rowIndex: index, columnKey: "remark", type: "mid" });
                }
              }}
              title={canEdit ? "點擊編輯" : ""}
            >
              {value || ""}
            </div>
          );
        },
      },
    ],
    [editingCell, onDataChange]
  );

  // 處理列點選
  const handleRowClick = (row: MidCategory, index: number) => {
    onRowSelect?.(row, index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  if (!hasSelectedMajor) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            中分類
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500 dark:text-gray-400 text-center">
            <p>請先選取大分類</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          中分類
        </h2>
      </div>
      <div className="flex-1 overflow-auto p-0">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={handleRowClick}
          selectedRowIndex={selectedIndex}
          searchable={true}
          searchPlaceholder="搜尋中分類..."
          emptyMessage="無中分類資料"
        />
      </div>
    </div>
  );
}

