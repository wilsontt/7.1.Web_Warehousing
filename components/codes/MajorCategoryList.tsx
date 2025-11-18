"use client";

import { useMemo, useState } from "react";
import DataTable, { type Column } from "@/components/data/DataTable";
import type { MajorCategory } from "@/lib/types/codes";
import type { MajorCategoryWithEdit, EditingCell } from "@/lib/types/codesEdit";

interface MajorCategoryListProps {
  /** 大分類資料 */
  data: MajorCategoryWithEdit[];
  /** 選取的列索引 */
  selectedIndex?: number | null;
  /** 選取列的回調 */
  onRowSelect?: (category: MajorCategory, index: number) => void;
  /** 是否載入中 */
  isLoading?: boolean;
  /** 更新資料回調（用於儲存格編輯） */
  onDataChange?: (index: number, field: string, value: string) => void;
}

/**
 * 大分類列表元件
 * 
 * 符合規格：3.1 UI 佈局 – 三欄式連動介面（B1 欄）
 * - 顯示欄位：大分類編碼 (majorCatNo)、大分類名稱 (majorCatName)
 * - 隔行變色、選取高亮、欄位內容不折行、固定表頭、水平捲軸
 * - 點選後觸發中分類篩選
 */
export default function MajorCategoryList({
  data,
  selectedIndex = null,
  onRowSelect,
  isLoading = false,
  onDataChange,
}: MajorCategoryListProps) {
  const [editingCell, setEditingCell] = useState<EditingCell | null>(null);

  // 定義欄位
  const columns: Column<MajorCategoryWithEdit>[] = useMemo(
    () => [
      {
        key: "majorCatNo",
        label: "大分類編碼",
        sortable: true,
        width: "120px",
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "majorCatNo";
          const isPendingCreate = row._editStatus === "pendingCreate";
          const isPendingDelete = row._editStatus === "pendingDelete";
          const isPendingUpdate = row._editStatus === "pendingUpdate";
          const canEdit = isPendingCreate; // 只有 pendingCreate 時可以編輯鍵值欄位

          if (isEditing && canEdit) {
            return (
              <input
                type="text"
                value={value || ""}
                onChange={(e) => {
                  onDataChange?.(index, "majorCatNo", e.target.value);
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
                isPendingUpdate ? "bg-yellow-50 dark:bg-yellow-900/20" : ""
              } ${canEdit ? "cursor-pointer" : ""}`}
              onClick={() => {
                if (canEdit) {
                  setEditingCell({ rowIndex: index, columnKey: "majorCatNo", type: "major" });
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
        key: "majorCatName",
        label: "大分類名稱",
        sortable: true,
        render: (value, row, index) => {
          const isEditing =
            editingCell?.rowIndex === index && editingCell?.columnKey === "majorCatName";
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
                  onDataChange?.(index, "majorCatName", e.target.value);
                  // 標記為 pendingUpdate（如果不是 pendingCreate）
                  if (!isPendingCreate && row._editStatus !== "pendingUpdate") {
                    // 這個邏輯會在父元件處理
                  }
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
                  setEditingCell({ rowIndex: index, columnKey: "majorCatName", type: "major" });
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
  const handleRowClick = (row: MajorCategory, index: number) => {
    onRowSelect?.(row, index);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          大分類
        </h2>
      </div>
      <div className="flex-1 overflow-auto p-0">
        <DataTable
          data={data}
          columns={columns}
          onRowClick={handleRowClick}
          selectedRowIndex={selectedIndex}
          searchable={true}
          searchPlaceholder="搜尋大分類..."
          emptyMessage="無大分類資料"
          infoMode="compact"
        />
      </div>
    </div>
  );
}

