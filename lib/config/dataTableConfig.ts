/**
 * DataTable 標準化配置
 * 
 * 符合規格：2.6 左側邊欄標準化計畫
 * 用於確保整個專案中 DataTable 組件的一致性
 */

// 分頁選項
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50, 100] as const;
export const DEFAULT_PAGE_SIZE = 20;

// 表格樣式類別
export const TABLE_CLASSES = {
  // 容器
  wrapper: "w-full h-full overflow-auto border-0 rounded-none bg-white dark:bg-gray-900",
  
  // 表格
  table: "min-w-full divide-y divide-gray-200 dark:divide-gray-700",
  
  // 表頭
  thead: "bg-gray-50 dark:bg-gray-800",
  th: "h-10 px-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider sticky top-0 bg-gray-50 dark:bg-gray-800 z-10 border-b border-gray-200 dark:border-gray-700",
  thSortable: "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 select-none",
  
  // 表身
  tbody: "bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700",
  // 更明顯的 hover/選取效果
  tr: "transition-all duration-150 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:ring-2 hover:ring-primary-500 hover:shadow-sm",
  trEven: "bg-white dark:bg-gray-900",
  trOdd: "bg-gray-100 dark:bg-gray-800/60",
  trSelected: "bg-primary-100 dark:bg-primary-900/50 ring-2 ring-primary-500",
  td: "py-2 px-3 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700",
  
  // 搜尋框
  searchInput: "w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
  
  // 分頁
  pagination: "flex items-center justify-between px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
  paginationInfo: "text-sm text-gray-700 dark:text-gray-300",
  paginationControls: "flex items-center gap-2",
  paginationButton: "px-2.5 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full shadow-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
  paginationButtonActive: "bg-primary-600 text-white border-primary-600 hover:bg-primary-700 shadow-md",
  paginationSelect: "px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500",
} as const;

// 顏色配置
export const COLORS = {
  primary: {
    light: "primary-50",
    DEFAULT: "primary-600",
    dark: "primary-700",
  },
  border: {
    light: "gray-200",
    dark: "gray-700",
  },
  background: {
    light: "white",
    dark: "gray-900",
  },
  text: {
    light: "gray-900",
    dark: "gray-100",
  },
} as const;

// 間距配置
export const SPACING = {
  cellPadding: {
    horizontal: "px-3",
    vertical: "py-2",
  },
  headerPadding: {
    horizontal: "px-3",
    vertical: "h-10",
  },
} as const;

// 字體配置
export const TYPOGRAPHY = {
  header: "text-xs font-medium uppercase tracking-wider",
  body: "text-sm",
} as const;

