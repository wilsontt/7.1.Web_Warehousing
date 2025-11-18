# 組件使用指南 (Component Usage Guide)

**版本**: 1.0  
**最後更新**: 2025/11/15

## 目錄

1. [A/B Layout](#ab-layout)
2. [ResizableLayout](#resizablelayout)
3. [DataTable](#datatable)
4. [Toolbar](#toolbar)
5. [StatusBar](#statusbar)
6. [Breadcrumbs](#breadcrumbs)
7. [TopNavigation](#topnavigation)
8. [MainMenu](#mainmenu)
9. [AuthGuard](#authguard)

---

## A/B Layout

### 用途

提供系統的主要頁面框架，包含：
- A 區：頂部導覽列（sticky header）
- B 區：主要內容區

### 使用範例

```tsx
import ABLayout from "@/components/layouts/ABLayout";
import TopNavigation from "@/components/navigation/TopNavigation";

export default function MyPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <ABLayout header={<TopNavigation />}>
      {children}
    </ABLayout>
  );
}
```

### 注意事項

- A 區會固定在頁面頂端（`position: sticky`）
- B 區佔據剩餘空間，可滾動

---

## ResizableLayout

### 用途

提供可調整寬度的左右分割佈局，用於 Master-Detail 頁面。

### 使用範例

```tsx
import ResizableLayout from "@/components/layouts/ResizableLayout";

<ResizableLayout
  leftPanel={<LeftContent />}
  rightPanel={<RightContent />}
  defaultLeftSize={25}
  minLeftSize={18}
  maxLeftSize={30}
/>
```

### 詳細說明

請參考 [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md#resizablelayout-使用方式)

---

## DataTable

### 用途

標準化的資料表格元件，支援分頁、排序、搜尋等功能。

### 使用範例

```tsx
import DataTable, { type Column } from "@/components/data/DataTable";

const columns: Column<MyData>[] = [
  { key: "id", label: "ID", sortable: true },
  { key: "name", label: "名稱", sortable: true },
];

<DataTable
  data={data}
  columns={columns}
  pageSize={20}
  onRowClick={(row, index) => handleSelect(row)}
/>
```

### 詳細說明

#### 分頁資訊 infoMode（2025/11/16）
- `full`：顯示「X - Y 筆，共 Z 筆」
- `compact`：顯示「X–Y/Z」，並自動加上 `title` 顯示完整字串
- `auto`：依容器寬度自動切換 full/compact（內建 ResizeObserver）
- 內建「項次」欄，顯示 1-based 連續序號（跨頁連續）

請參考 [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md#datatable-使用方式)

---

## Toolbar

### 用途

標準化的工具列元件，提供統一的按鈕樣式和行為。

### 使用範例

```tsx
import Toolbar, { type ToolbarButton, STANDARD_TOOLBAR_BUTTONS } from "@/components/toolbar/Toolbar";

const buttons: ToolbarButton[] = [
  {
    id: STANDARD_TOOLBAR_BUTTONS.ADD,
    label: "新增",
    onClick: handleAdd,
    variant: "primary",
  },
  {
    id: STANDARD_TOOLBAR_BUTTONS.EDIT,
    label: "修改",
    onClick: handleEdit,
    disabled: !selectedRow,
  },
];

<Toolbar buttons={buttons} />
```

### 詳細說明

請參考 [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md#toolbar-使用方式)

---

## StatusBar

### 用途

顯示資料的新增和修改資訊。

### 使用範例

```tsx
import StatusBar from "@/components/status/StatusBar";

<StatusBar
  createdBy="張三"
        createdAt="2025/11/15 10:30:00"
        updatedBy="李四"
        updatedAt="2025/11/15 14:20:00"
/>
```

### 詳細說明

請參考 [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md#狀態列使用方式)

---

## Breadcrumbs

### 用途

顯示頁面的導覽路徑。

### 使用範例

```tsx
import Breadcrumbs, { type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

const breadcrumbs: BreadcrumbItem[] = [
  { label: "基本作業", href: "/basic-operations" },
  { label: "客戶資料維護", href: "/basic-operations/customer" },
  { label: "客戶基本資料維護" }, // 當前頁面
];

<Breadcrumbs items={breadcrumbs} />
```

### 詳細說明

請參考 [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md#breadcrumbs-使用方式)

---

## TopNavigation

### 用途

頂部導覽列（A 區），包含 Logo、主選單、語系選擇、使用者選單。

### 使用範例

```tsx
import TopNavigation from "@/components/navigation/TopNavigation";

// 通常在 layout.tsx 中使用
<TopNavigation />
```

### 注意事項

- 已整合 MainMenu、LanguageSelector、UserMenu
- 自動根據使用者權限顯示選單

---

## MainMenu

### 用途

主選單（直向展開下拉選單），顯示八大作業選單。

### 使用範例

```tsx
import MainMenu from "@/components/navigation/MainMenu";

// 已在 TopNavigation 中整合，通常不需要單獨使用
<MainMenu />
```

### 注意事項

- 自動根據使用者權限過濾選單項目
- 使用 `menuService.getFilteredMenus()` 取得過濾後的選單

---

## AuthGuard

### 用途

路由保護元件，確保只有登入使用者才能存取受保護的頁面。

### 使用範例

```tsx
import AuthGuard from "@/components/auth/AuthGuard";

// 保護需要登入的頁面
<AuthGuard requireAuth={true}>
  <ProtectedContent />
</AuthGuard>

// 保護登入頁（已登入時導向 Dashboard）
<AuthGuard requireAuth={false}>
  <LoginPage />
</AuthGuard>
```

### 參數說明

| 參數 | 類型 | 預設值 | 說明 |
|------|------|--------|------|
| `requireAuth` | `boolean` | `true` | 是否需要登入 |
| `redirectTo` | `string` | `"/login"` | 未登入時導向的路徑 |

### 注意事項

- 未登入使用者訪問受保護頁面時，會儲存當前 URL 到 `sessionStorage`
- 登入成功後會自動返回原本要訪問的頁面

---

## 完整頁面範例

請參考 `templates/MasterDetailPageTemplate.tsx` 查看完整的 Master-Detail 頁面實作範例。

---

## 相關檔案

- `DESIGN_GUIDELINES.md` - 詳細的設計指南
- `templates/MasterDetailPageTemplate.tsx` - 標準頁面模板
- `lib/config/dataTableConfig.ts` - DataTable 配置常數

---

## 更新記錄

- **v1.0** (2025/11/15): 初始版本

