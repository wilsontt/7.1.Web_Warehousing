# 設計指南 (Design Guidelines)

**版本**: 1.0  
**最後更新**: 2025/11/15  
**依據規範**: `standards/2.文件倉儲管理系統 Warehouse Management System 設計規範v2.0.md`

## 目錄

1. [左側邊欄標準](#左側邊欄標準)
2. [ResizableLayout 使用方式](#resizablelayout-使用方式)
3. [DataTable 使用方式](#datatable-使用方式)
4. [Toolbar 使用方式](#toolbar-使用方式)
5. [狀態列使用方式](#狀態列使用方式)
6. [Breadcrumbs 使用方式](#breadcrumbs-使用方式)
7. [最佳實踐](#最佳實踐)

---

## 左側邊欄標準

### 標準配置

所有需要左右分割佈局的頁面統一使用 `ResizableLayout` 元件，廢棄 `MainLayout` 的 `leftPanel` 用法。

**標準參數**：
- 預設寬度：25%（規格文件）或 22%（開發計畫，以規格文件為準）
- 最小寬度：18%
- 最大寬度：30%（規格文件）或 35%（開發計畫，以規格文件為準）

### 使用原則

- 所有左右分割頁面必須使用 `ResizableLayout`
- 左側列表區（B1）用於顯示資料列表
- 右側詳細區（B2）用於顯示選取資料的詳細內容
- 支援拖曳調整寬度，提供良好的使用者體驗

---

## ResizableLayout 使用方式

### 基本用法

```tsx
import ResizableLayout from "@/components/layouts/ResizableLayout";

export default function MyPage() {
  return (
    <ResizableLayout
      leftPanel={
        <div>
          {/* B1 左側列表內容 */}
        </div>
      }
      rightPanel={
        <div>
          {/* B2 右側詳細內容 */}
        </div>
      }
      defaultLeftSize={25}  // 預設 25%
      minLeftSize={18}      // 最小 18%
      maxLeftSize={30}      // 最大 30%
    />
  );
}
```

### 參數說明

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `leftPanel` | `ReactNode` | 必填 | B1 左側列表區內容 |
| `rightPanel` | `ReactNode` | 必填 | B2 右側詳細區內容 |
| `defaultLeftSize` | `number` | `25` | 預設左側寬度百分比 |
| `minLeftSize` | `number` | `18` | 最小左側寬度百分比 |
| `maxLeftSize` | `number` | `30` | 最大左側寬度百分比 |

### 注意事項

- 左側面板應包含資料列表和搜尋/篩選功能
- 右側面板應包含詳細資料表單和工具列
- 拖曳手把位於左右面板之間，提供視覺反饋

---

## DataTable 使用方式

### 基本用法

```tsx
import DataTable, { type Column } from "@/components/data/DataTable";

interface MyData {
  id: string;
  name: string;
  status: string;
}

export default function MyDataTable() {
  const data: MyData[] = [
    { id: "1", name: "項目 1", status: "啟用" },
    { id: "2", name: "項目 2", status: "停用" },
  ];

  const columns: Column<MyData>[] = [
    {
      key: "id",
      label: "ID",
      sortable: true,
    },
    {
      key: "name",
      label: "名稱",
      sortable: true,
    },
    {
      key: "status",
      label: "狀態",
      render: (value) => (
        <span className={value === "啟用" ? "text-green-600" : "text-red-600"}>
          {value}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      data={data}
      columns={columns}
      pageSize={20}
      searchable={true}
      searchPlaceholder="搜尋..."
      onRowClick={(row, index) => {
        console.log("選取:", row, index);
      }}
    />
  );
}
```

### 參數說明

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `data` | `T[]` | 必填 | 表格資料陣列 |
| `columns` | `Column<T>[]` | 必填 | 欄位定義陣列 |
| `pageSize` | `number` | `20` | 每頁顯示筆數 |
| `onPageSizeChange` | `(size: number) => void` | 選填 | 分頁大小變更回調 |
| `onRowClick` | `(row: T, index: number) => void` | 選填 | 列點擊回調 |
| `selectedRowIndex` | `number \| null` | `null` | 選取的列索引 |
| `searchable` | `boolean` | `true` | 是否顯示搜尋框 |
| `searchPlaceholder` | `string` | `"搜尋..."` | 搜尋框提示文字 |
| `onSearch` | `(query: string) => void` | 選填 | 自訂搜尋函數 |
| `emptyMessage` | `string` | `"無資料"` | 空資料訊息 |

### Column 定義

```tsx
interface Column<T> {
  key: string;                    // 資料欄位鍵名
  label: string;                  // 欄位標籤
  sortable?: boolean;              // 是否可排序
  render?: (value: any, row: T, index: number) => React.ReactNode;  // 自訂渲染函數
  width?: string;                 // 欄位寬度（CSS 值）
}
```

### 樣式標準

- 表頭行高：`h-10 px-3`
- 內容行高：`py-2 px-3`
- 單元格完整邊框
- 內容不自動折行（`whitespace-nowrap`）
- 容器 `overflow-auto`，必要時顯示水平捲軸
- 搜尋框統一寬度：`w-40` (160px)
- Sticky Header（表頭固定）
- 隔行變色（Zebra-striping）
- 選取高亮（Highlight）

### 分頁選項

預設每頁 20 筆，可選：5、10、20、50、100 筆。

---

## Toolbar 使用方式

### 基本用法

```tsx
import Toolbar, { type ToolbarButton, STANDARD_TOOLBAR_BUTTONS } from "@/components/toolbar/Toolbar";

export default function MyToolbar() {
  const buttons: ToolbarButton[] = [
    {
      id: STANDARD_TOOLBAR_BUTTONS.QUERY,
      label: "查詢",
      onClick: () => {
        // 切換搜尋/篩選面板
      },
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.ADD,
      label: "新增",
      onClick: () => {
        // 清空表單進入新增模式
      },
      variant: "primary",
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.EDIT,
      label: "修改",
      onClick: () => {
        // 切換為編輯模式
      },
      disabled: !selectedRow,
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.DELETE,
      label: "刪除",
      onClick: () => {
        // 刪除資料（僅限未被引用資料）
      },
      variant: "danger",
      disabled: !selectedRow || isReferenced,
    },
  ];

  return <Toolbar buttons={buttons} />;
}
```

### 按鈕行為標準

| 按鈕 | 行為 | 說明 |
|------|------|------|
| 查詢 | 切換搜尋/篩選面板 | 顯示/隱藏搜尋或篩選功能 |
| 新增 | 清空表單進入新增模式 | 重置表單，準備新增資料 |
| 修改 | 切換為編輯模式 | 將表單切換為可編輯狀態 |
| 停用 | 對資料進行非刪除的停用標記 | 保留資料但標記為停用 |
| 刪除 | 只允許未被引用資料 | 檢查資料是否被引用，僅允許刪除未被引用的資料 |
| 複製 | 以當前資料為模板建立新表單 | 複製當前資料到新表單 |

### 按鈕變體

- `primary`: 主要按鈕（藍色背景）
- `secondary`: 次要按鈕（灰色背景，預設）
- `danger`: 危險按鈕（紅色背景，用於刪除等操作）

### 按鈕狀態

- `disabled`: 根據資料狀態動態啟用/禁用
- 例如：沒有選取資料時禁用「修改」、「刪除」按鈕

---

## 狀態列使用方式

### 基本用法

```tsx
import StatusBar from "@/components/status/StatusBar";

export default function MyPage() {
  return (
    <div>
      {/* 表單內容 */}
      
      <StatusBar
        createdBy="張三"
        createdAt="2025/11/15 10:30:00"
        updatedBy="李四"
        updatedAt="2025/11/15 14:20:00"
      />
    </div>
  );
}
```

### 參數說明

| 參數 | 類型 | 說明 |
|------|------|------|
| `createdBy` | `string` | 新增人員姓名 |
| `createdAt` | `string` | 新增時間（ISO 格式或 YYYY/MM/DD HH:MM:SS） |
| `updatedBy` | `string` | 上次修改人員姓名 |
| `updatedAt` | `string` | 上次修改時間（ISO 格式或 YYYY/MM/DD HH:MM:SS） |
| `className` | `string` | 自訂 CSS 類別 |

### 顯示格式

- 左側：`新增人員：[姓名] YYYY/MM/DD HH:MM:SS`
- 右側：`上次修改：[姓名] YYYY/MM/DD HH:MM:SS`

### 使用位置

- 標準設定頁面：底部需有狀態列
- 若頁面再分上下區，則各區底部皆需有狀態列

---

## Breadcrumbs 使用方式

### 基本用法

```tsx
import Breadcrumbs, { type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

export default function MyPage() {
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "基本作業", href: "/basic-operations" },
    { label: "客戶資料維護", href: "/basic-operations/customer" },
    { label: "客戶基本資料維護" },  // 當前頁面，不提供 href
  ];

  return <Breadcrumbs items={breadcrumbs} />;
}
```

### 參數說明

| 參數 | 類型 | 說明 |
|------|------|------|
| `items` | `BreadcrumbItem[]` | 麵包屑項目陣列 |

### BreadcrumbItem 定義

```tsx
interface BreadcrumbItem {
  label: string;    // 顯示文字
  href?: string;    // 連結路徑（選填，最後一項通常不提供）
}
```

### 顯示格式

完整導覽路徑：`基本作業 > 客戶資料維護 > 客戶基本資料維護`

- 中間項目可點擊導覽（有 `href` 時）
- 最後一項為當前頁面，不可點擊

---

## 最佳實踐

### 1. 頁面佈局結構

```tsx
// 標準 Master-Detail 頁面結構
export default function MyMasterDetailPage() {
  return (
    <ResizableLayout
      leftPanel={
        <div className="h-full flex flex-col">
          {/* 搜尋/篩選區 */}
          <div className="p-4 border-b">
            {/* 搜尋框 */}
          </div>
          
          {/* 資料列表 */}
          <div className="flex-1 overflow-auto">
            <DataTable data={data} columns={columns} />
          </div>
        </div>
      }
      rightPanel={
        <div className="h-full flex flex-col">
          {/* B2-1 工具列 */}
          <div className="p-4 border-b flex items-center justify-between">
            <Breadcrumbs items={breadcrumbs} />
            <Toolbar buttons={toolbarButtons} />
          </div>
          
          {/* B2-2 資料內容區 */}
          <div className="flex-1 overflow-auto p-6">
            {/* 表單內容 */}
          </div>
          
          {/* 狀態列 */}
          <StatusBar
            createdBy={data.createdBy}
            createdAt={data.createdAt}
            updatedBy={data.updatedBy}
            updatedAt={data.updatedAt}
          />
        </div>
      }
    />
  );
}
```

### 2. 資料狀態管理

- 使用 React Hook Form 管理表單狀態
- 使用 Redux Toolkit 管理全域狀態（如選取的資料列）
- 確保按鈕狀態與資料狀態同步

### 3. 權限控制

- 根據使用者角色動態顯示/隱藏按鈕
- 使用 `menuService.getFilteredMenus()` 過濾選單
- 在 API 層面也要進行權限驗證

### 4. 深色模式支援

- 所有元件已整合深色模式支援
- 使用 Tailwind CSS 的 `dark:` 前綴
- 確保對比度符合無障礙標準

### 5. 響應式設計

- 桌面：完整 Master-Detail 佈局
- 平板：支援漢堡選單，必要時調整佈局
- 使用 Tailwind CSS 響應式類別（`sm:`, `md:`, `lg:`）

### 6. 效能優化

- 大量資料使用分頁顯示
- 使用 `useMemo` 和 `useCallback` 優化渲染
- 避免不必要的重新渲染

### 7. 錯誤處理

- 所有 API 呼叫都要有錯誤處理
- 顯示使用者友善的錯誤訊息
- 記錄錯誤到稽核日誌

### 8. 無障礙設計

- 使用語義化 HTML
- 提供 ARIA 標籤
- 確保鍵盤操作支援
- 確保對比度符合 WCAG AA 標準

---

## 相關檔案

- `components/layouts/ResizableLayout.tsx` - ResizableLayout 元件實作
- `components/data/DataTable.tsx` - DataTable 元件實作
- `components/toolbar/Toolbar.tsx` - Toolbar 元件實作
- `components/status/StatusBar.tsx` - 狀態列元件實作
- `components/navigation/Breadcrumbs.tsx` - Breadcrumbs 元件實作
- `lib/config/dataTableConfig.ts` - DataTable 標準化配置

---

## 更新記錄

- **v1.0** (2025/11/15): 初始版本，記錄所有共用元件的使用方式

