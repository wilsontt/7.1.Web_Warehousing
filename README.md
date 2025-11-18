# 文件倉儲管理系統

文件倉儲管理系統 Web 版本

## 技術堆疊

根據專案憲章 P11 技術堆疊要求：

- **前端 UI/UX**: Next.js 14+ / React 18+ / TypeScript / Tailwind CSS
- **表單驗證**: React Hook Form + Zod
- **狀態管理**: Redux Toolkit
- **後端 API**: ASP.NET Core 8+ / C# 12 (待實作)
- **資料庫**: MS SQL Server 2022+ (待實作)

## 開發環境設定

### 必要條件

- Node.js 18.0 或更高版本
- npm 或 yarn

### 安裝依賴

```bash
npm install
```

### 環境變數設定

複製 `.env.example` 為 `.env.local` 並設定環境變數：

```bash
cp .env.example .env.local
```

### 啟動開發伺服器

```bash
npm run dev
```

開啟 [http://localhost:3000](http://localhost:3000) 查看結果。

### 其他指令

```bash
# 建置生產版本
npm run build

# 啟動生產伺服器
npm start

# 執行 ESLint
npm run lint

# 格式化程式碼
npm run format
```

## 專案結構

```
├── app/              # Next.js App Router 頁面和路由
├── components/       # React 元件
├── lib/             # 工具函數和 API 服務
├── types/           # TypeScript 型別定義
├── hooks/           # 自訂 React Hooks
├── contexts/        # React Context
├── services/        # 業務邏輯服務
└── public/          # 靜態資源
```

## 開發規範

本專案遵循「規格驅動開發 (SDD)」流程：

1. Phase 1: 規格 (SPEC)
2. Phase 2: 計畫 (PLAN)
3. Phase 3: 執行 (Tasks)
4. Phase 4: 執行 (EXECUTE)
5. Phase 5: 驗收 (REVIEW)

詳細規範請參閱：
- [專案憲章](./standards/1.專案憲章%20Project%20Constitution：文件倉儲管理系統.md)
- [設計規範](./standards/2.文件倉儲管理系統%20Warehouse%20Management%20System%20設計規範v2.0.md)
- [SDD 工作流程](./standards/3.規格驅動開發%20(SDD)%20工作流程.md)

## 授權

版權所有 © 2025

