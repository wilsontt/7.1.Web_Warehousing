"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import {
  TABLE_CLASSES,
  DEFAULT_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
} from "@/lib/config/dataTableConfig";

export interface Column<T> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T, index: number) => React.ReactNode;
  width?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  onRowClick?: (row: T, index: number) => void;
  selectedRowIndex?: number | null;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  emptyMessage?: string;
  /** 分頁資訊顯示模式：full => X - Y 筆，共 Z 筆；compact => X–Y/Z；auto => 依寬度自動切換 */
  infoMode?: "full" | "compact" | "auto";
}

type SortDirection = "asc" | "desc" | null;

/**
 * DataTable 元件
 * 
 * 符合規格：2.2 共用元件與資料表格行為
 * - 分頁功能（預設每頁 20 筆，可選 5/10/20/50/100 筆）
 * - 排序功能（表頭點擊排序）
 * - 搜尋/篩選功能（搜尋框統一寬度 `w-40`）
 * - Sticky Header（表頭固定）
 * - 隔行變色（Zebra-striping）
 * - 選取高亮（Highlight）
 * - 表格樣式：表頭 h-10 px-3，內容 py-2 px-3，完整邊框，whitespace-nowrap，overflow-auto
 */
export default function DataTable<T extends Record<string, any>>({
  data,
  columns,
  pageSize = DEFAULT_PAGE_SIZE,
  onPageSizeChange,
  onRowClick,
  selectedRowIndex = null,
  searchable = true,
  searchPlaceholder = "搜尋...",
  onSearch,
  emptyMessage = "無資料",
  infoMode = "full",
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [internalPageSize, setInternalPageSize] = useState<number>(pageSize);
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gotoInput, setGotoInput] = useState<string>(String(1));
  const [autoCompact, setAutoCompact] = useState<boolean>(false);
  const paginationRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<HTMLDivElement>(null);

  // keep internal page size synced when parent prop changes
  useEffect(() => {
    setInternalPageSize(pageSize ?? DEFAULT_PAGE_SIZE);
    setCurrentPage(1);
    setGotoInput("1");
  }, [pageSize]);

  // 自動模式：依容器寬度切換 compact
  useEffect(() => {
    if (infoMode !== "auto") return;
    const container = paginationRef.current;
    if (!container) return;

    const evaluate = () => {
      const infoWidth = infoRef.current?.getBoundingClientRect().width ?? 0;
      const controlsWidth = controlsRef.current?.getBoundingClientRect().width ?? 0;
      const containerWidth = container.clientWidth;
      // 預留 16px 的安全空間避免貼邊
      setAutoCompact(infoWidth + controlsWidth + 16 > containerWidth);
    };

    // 初次計算
    evaluate();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => evaluate()) : null;
    ro?.observe(container);
    // 視窗縮放保險
    window.addEventListener("resize", evaluate);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", evaluate);
    };
  }, [infoMode, internalPageSize, currentPage, searchQuery]);

  // 搜尋過濾
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data;
    }

    if (onSearch) {
      // 如果提供了自訂搜尋函數，使用它
      return data.filter((row) => {
        // 這裡可以根據實際需求調整搜尋邏輯
        return onSearch(searchQuery);
      });
    }

    // 預設搜尋：在所有欄位中搜尋
    const query = searchQuery.toLowerCase();
    return data.filter((row) =>
      columns.some((col) => {
        const value = row[col.key];
        return value?.toString().toLowerCase().includes(query);
      })
    );
  }, [data, searchQuery, columns, onSearch]);

  // 排序
  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return filteredData;
    }

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];

      if (aValue === bValue) return 0;

      const comparison = aValue < bValue ? -1 : 1;
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return sorted;
  }, [filteredData, sortColumn, sortDirection]);

  // 分頁
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * internalPageSize;
    const endIndex = startIndex + internalPageSize;
    return sortedData.slice(startIndex, endIndex);
  }, [sortedData, currentPage, internalPageSize]);

  const totalPages = Math.max(1, Math.ceil(sortedData.length / internalPageSize));

  // 處理排序
  const handleSort = (columnKey: string) => {
    const column = columns.find((col) => col.key === columnKey);
    if (!column?.sortable) return;

    if (sortColumn === columnKey) {
      // 切換排序方向
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortColumn(null);
        setSortDirection(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // 處理搜尋
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // 重置到第一頁
  };

  // 處理分頁大小變更
  const handlePageSizeChange = (newSize: number) => {
    const size = Number.isNaN(newSize) ? DEFAULT_PAGE_SIZE : newSize;
    setInternalPageSize(size);
    setCurrentPage(1);
    onPageSizeChange?.(size);
  };

  // 取得排序圖示
  const getSortIcon = (columnKey: string) => {
    if (sortColumn !== columnKey) {
      return (
        <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }

    if (sortDirection === "asc") {
      return (
        <svg className="w-4 h-4 ml-1 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      );
    }

    return (
      <svg className="w-4 h-4 ml-1 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900">
      {/* 搜尋框 */}
      {searchable && (
        <div className="flex items-center gap-4 px-2 py-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={TABLE_CLASSES.searchInput}
          />
          {searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label="清除搜尋"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      )}

      {/* 表格容器 */}
      <div className={TABLE_CLASSES.wrapper}>
        <table className={TABLE_CLASSES.table}>
          {/* 表頭 */}
          <thead className={TABLE_CLASSES.thead}>
            <tr>
              {/* 項次欄 */}
              <th
                className={`
                  ${TABLE_CLASSES.th}
                `}
                style={{ width: "64px" }}
              >
                項次
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`
                    ${TABLE_CLASSES.th}
                    ${column.sortable ? TABLE_CLASSES.thSortable : ""}
                  `}
                  style={column.width ? { width: column.width } : undefined}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* 表身 */}
          <tbody className={TABLE_CLASSES.tbody}>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="py-8 text-center text-gray-500 dark:text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, index) => {
                const globalIndex = (currentPage - 1) * internalPageSize + index;
                const isEven = globalIndex % 2 === 0;
                const isSelected = selectedRowIndex === globalIndex;

                return (
                  <tr
                    key={globalIndex}
                    className={`group ${TABLE_CLASSES.tr} ${isEven ? TABLE_CLASSES.trEven : TABLE_CLASSES.trOdd} ${isSelected ? TABLE_CLASSES.trSelected : ""} ${onRowClick ? "cursor-pointer" : ""}`}
                    data-row
                    aria-selected={isSelected}
                    onClick={() => onRowClick?.(row, globalIndex)}
                  >
                    {/* 項次欄（1-based） */}
                    <td className={`${TABLE_CLASSES.td} text-center border-l-4 border-transparent group-hover:border-primary-400 dark:group-hover:border-primary-500`}>
                      {globalIndex + 1}
                    </td>
                    {columns.map((column) => {
                      const value = row[column.key];
                      return (
                <td key={column.key} className={TABLE_CLASSES.td}>
                          {column.render
                            ? column.render(value, row, globalIndex)
                            : value?.toString() || ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 分頁控制 */}
      <div className={TABLE_CLASSES.pagination} ref={paginationRef}>
        <div className={`${TABLE_CLASSES.paginationInfo} whitespace-nowrap`} ref={infoRef}>
          {infoMode === "compact" || (infoMode === "auto" && autoCompact) ? (
            <span
              title={`${(currentPage - 1) * internalPageSize + 1} - ${Math.min(
                currentPage * internalPageSize,
                sortedData.length
              )} 筆，共 ${sortedData.length} 筆`}
            >
              {(currentPage - 1) * internalPageSize + 1}–{Math.min(
                currentPage * internalPageSize,
                sortedData.length
              )}
              /{sortedData.length}
            </span>
          ) : (
            <span>
              {(currentPage - 1) * internalPageSize + 1} -{" "}
              {Math.min(currentPage * internalPageSize, sortedData.length)} 筆，共{" "}
              {sortedData.length} 筆
            </span>
          )}
        </div>

        <div className={TABLE_CLASSES.paginationControls} ref={controlsRef}>
          {/* 每頁顯示筆數選擇 */}
          <select
            value={internalPageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}
            className={TABLE_CLASSES.paginationSelect}
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size} 筆
              </option>
            ))}
          </select>

          {/* 第一頁 */}
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className={TABLE_CLASSES.paginationButton}
            aria-label="第一頁"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 17l-5-5 5-5M18 19V5" />
            </svg>
          </button>
          {/* 上一頁 */}
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={TABLE_CLASSES.paginationButton}
            aria-label="上一頁"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* 跳至第幾頁 */}
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={totalPages}
              value={gotoInput}
              onChange={(e) => setGotoInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = Number(gotoInput);
                  if (!Number.isNaN(v)) {
                    const clamped = Math.min(Math.max(1, Math.floor(v)), totalPages);
                    setCurrentPage(clamped);
                  }
                }
              }}
              onBlur={() => {
                const v = Number(gotoInput);
                if (!Number.isNaN(v)) {
                  const clamped = Math.min(Math.max(1, Math.floor(v)), totalPages);
                  setCurrentPage(clamped);
                } else {
                  setGotoInput(String(currentPage));
                }
              }}
              className="w-16 px-2 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="跳至頁碼"
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">/ {totalPages}</span>
          </div>

          {/* 當前頁數 Badge */}
          <span className="ml-2 px-3 py-1 text-sm rounded-full bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 border border-primary-200 dark:border-primary-800">
            第 {currentPage} / {totalPages} 頁
          </span>

          {/* 下一頁 */}
          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={TABLE_CLASSES.paginationButton}
            aria-label="下一頁"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          {/* 最後一頁 */}
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className={TABLE_CLASSES.paginationButton}
            aria-label="最後一頁"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l5 7-5 7M6 5v14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

