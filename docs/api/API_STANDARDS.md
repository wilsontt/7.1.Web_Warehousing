# API 設計標準與最佳實踐

**版本**: 1.0  
**建立日期**: 2025/11/15  
**依據憲章**: v2.1.0

---

## 概述

本文件定義了整個專案的 API 設計標準，確保所有模組的 API 保持一致性、可維護性和可擴展性。
> API 設計標準 (docs/api/API_STANDARDS.md)
> 定義整個專案的 API 設計標準：
> ・ 命名規範
> ・ 標準端點模式
> ・ 錯誤處理標準
> ・ 建立新模組的步驟
---

## 核心原則

### 1. 一致性 (Consistency)

所有 API 應遵循相同的設計模式：
- 統一的錯誤回應格式
- 統一的認證方式
- 統一的命名規範
- 統一的資料格式

### 2. 可重用性 (Reusability)

使用共用的型別定義和工具：
- 使用 `lib/types/common.ts` 中的共用型別
- 使用標準的 API 請求/回應格式
- 避免重複定義相同的結構

### 3. 型別安全 (Type Safety)

所有 API 都應有完整的 TypeScript 型別定義：
- 使用 `lib/types/[模組名稱].ts` 定義模組特定型別
- 使用 `lib/types/common.ts` 中的共用型別
- 確保前後端型別一致

---

## API 設計規範

### 命名規範

#### URL 路徑
- 使用小寫字母和連字號（kebab-case）
- 使用複數名詞表示資源集合
- 範例：`/api/codes/tree`, `/api/customers/search`

#### 端點命名
- 使用動詞表示操作：`get`, `create`, `update`, `delete`, `search`
- 使用名詞表示資源：`codes`, `customers`, `warehouses`
- 範例：`GET /api/codes/tree`, `POST /api/codes/batch`

### 標準端點模式

#### 1. 查詢列表 (List/Query)

```
GET /api/{resource}
GET /api/{resource}/search
```

**查詢參數**:
- `keyword` (string, optional): 關鍵字搜尋
- `page` (number, optional): 頁碼（從 1 開始）
- `pageSize` (number, optional): 每頁筆數
- `sortBy` (string, optional): 排序欄位
- `sortOrder` (asc|desc, optional): 排序方向

**回應格式**: `PaginatedResponse<T>`

#### 2. 取得單一資源 (Get Single)

```
GET /api/{resource}/{id}
```

**回應格式**: 資源物件

#### 3. 建立資源 (Create)

```
POST /api/{resource}
```

**請求格式**: 資源物件（不含 id）

**回應格式**: 建立的資源物件

#### 4. 更新資源 (Update)

```
PUT /api/{resource}/{id}
PATCH /api/{resource}/{id}
```

**請求格式**: 部分資源物件（需包含 lockVer）

**回應格式**: 更新的資源物件

#### 5. 刪除資源 (Delete)

```
DELETE /api/{resource}/{id}
```

**請求格式**: `{ id: number, lockVer: number }`

**回應格式**: `{ success: boolean, message: string }`

#### 6. 批次操作 (Batch)

```
POST /api/{resource}/batch
```

**請求格式**: `BatchOperationRequest<T>`

**回應格式**: `BatchOperationResponse`

---

## 錯誤處理標準

### 錯誤回應格式

所有錯誤都應使用 `ApiErrorResponse` 格式：

```typescript
{
  code: string;           // 錯誤代碼
  message: string;       // 錯誤訊息（正體中文）
  details?: Array<{      // 詳細錯誤資訊
    field?: string;
    message: string;
    code?: string;
  }>;
  trackingId?: string;   // 追蹤 ID
}
```

### 標準錯誤碼

| 錯誤碼 | HTTP 狀態碼 | 說明 | 使用情境 |
|--------|------------|------|---------|
| `UNAUTHORIZED` | 401 | 未提供或無效的 Token | 認證失敗 |
| `FORBIDDEN` | 403 | 沒有權限 | 權限不足 |
| `VALIDATION_ERROR` | 400 | 資料驗證失敗 | 欄位驗證錯誤 |
| `BUSINESS_RULE_VIOLATION` | 400 | 違反業務規則 | 業務邏輯錯誤 |
| `OPTIMISTIC_LOCK_CONFLICT` | 409 | 樂觀鎖定衝突 | 版本號不符 |
| `DUPLICATE_KEY` | 400 | 唯一鍵重複 | 重複資料 |
| `NOT_FOUND` | 404 | 資料不存在 | 資源不存在 |
| `INTERNAL_SERVER_ERROR` | 500 | 伺服器內部錯誤 | 系統錯誤 |

---

## 認證與授權

### 認證方式

所有 API 都應使用 Bearer Token 認證：

```
Authorization: Bearer {jwt_token}
```

### 權限檢查

所有 API 都應實作 RBAC 權限檢查：
- 檢查 Token 有效性
- 檢查使用者權限
- 記錄操作日誌

---

## 資料驗證

### 前端驗證

- 使用 Zod 或類似工具進行表單驗證
- 錯誤訊息使用正體中文
- 即時驗證使用者輸入

### 後端驗證

- 驗證所有必填欄位
- 驗證資料格式和長度
- 驗證業務規則
- 回傳詳細的驗證錯誤

---

## 效能要求

### 回應時間

根據憲章 P9 要求：
- 查詢 API: ≤ 2 秒（正常負載）
- 批次操作: ≤ 2 秒
- 單一資源操作: ≤ 1 秒

### 分頁

所有列表查詢都應支援分頁：
- 預設每頁 20 筆
- 最大每頁 100 筆
- 回傳總筆數和總頁數

---

## 文件要求

### 每個模組應提供

1. **API 契約文件** (`docs/api/[模組名稱]_API_CONTRACT.md`)
   - 使用 `API_CONTRACT_TEMPLATE.md` 作為模板
   - 詳細說明所有 API 端點
   - 包含請求/回應範例

2. **OpenAPI 規格** (`docs/api/[模組名稱]-api.yaml`)
   - 符合 OpenAPI 3.0 標準
   - 可用於自動生成文件
   - 可用於生成 Mock Server

3. **TypeScript 型別** (`lib/types/[模組名稱].ts`)
   - 完整的型別定義
   - 使用共用型別（`lib/types/common.ts`）
   - 確保型別安全

---

## 建立新模組 API 的步驟

### Step 1: 建立型別定義

1. 在 `lib/types/[模組名稱].ts` 定義模組特定型別
2. 使用 `lib/types/common.ts` 中的共用型別
3. 參考 `lib/types/codes.ts` 作為範例

### Step 2: 建立 API 契約文件

1. 複製 `docs/api/API_CONTRACT_TEMPLATE.md`
2. 重新命名為 `docs/api/[模組名稱]_API_CONTRACT.md`
3. 填寫所有佔位符和內容

### Step 3: 建立 OpenAPI 規格

1. 參考 `docs/api/codes-api.yaml` 作為範例
2. 建立 `docs/api/[模組名稱]-api.yaml`
3. 使用標準的 Schema 定義

### Step 4: 建立 API 服務

1. 在 `lib/api/[模組名稱].ts` 建立 API 服務
2. 使用標準的錯誤處理
3. 支援 Mock 模式（開發環境）

---

## 共用型別使用指南

### 使用共用型別

```typescript
import type {
  ApiErrorResponse,
  PaginatedResponse,
  BatchOperationRequest,
  BatchOperationResponse,
  BaseEntity,
} from "@/lib/types/common";

// 定義模組特定型別
export interface Customer extends BaseEntity {
  name: string;
  email: string;
}

// 使用共用型別
export type CustomerListResponse = PaginatedResponse<Customer>;
export type CustomerBatchRequest = BatchOperationRequest<Customer>;
export type CustomerBatchResponse = BatchOperationResponse;
```

### 避免重複定義

❌ **錯誤**: 每個模組都定義自己的錯誤回應格式
```typescript
// 不要這樣做
interface MyModuleError {
  code: string;
  message: string;
}
```

✅ **正確**: 使用共用型別
```typescript
import type { ApiErrorResponse } from "@/lib/types/common";
```

---

## 範例：建立新模組 API

### 範例：客戶維護模組

1. **型別定義** (`lib/types/customers.ts`):
```typescript
import type { BaseEntity, PaginatedResponse } from "@/lib/types/common";

export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
}

export type CustomerListResponse = PaginatedResponse<Customer>;
```

2. **API 契約文件** (`docs/api/CUSTOMERS_API_CONTRACT.md`):
   - 使用模板填寫內容

3. **OpenAPI 規格** (`docs/api/customers-api.yaml`):
   - 參考 codes-api.yaml 結構

4. **API 服務** (`lib/api/customers.ts`):
```typescript
import type { Customer, CustomerListResponse } from "@/lib/types/customers";
import type { PaginatedResponse } from "@/lib/types/common";

export async function getCustomers(
  params?: BaseQueryParams
): Promise<CustomerListResponse> {
  // 實作...
}
```

---

## 檢查清單

建立新模組 API 時，請確認：

- [ ] 使用 `lib/types/common.ts` 中的共用型別
- [ ] 遵循標準的 API 命名規範
- [ ] 使用標準的錯誤回應格式
- [ ] 實作 RBAC 權限檢查
- [ ] 提供完整的 API 契約文件
- [ ] 提供 OpenAPI 規格文件
- [ ] 支援 Mock 模式（開發環境）
- [ ] 符合效能要求
- [ ] 錯誤訊息使用正體中文

---

## 相關文件

- [API 契約模板](./API_CONTRACT_TEMPLATE.md)
- [代碼維護 API 契約範例](./CODES_API_CONTRACT.md)
- [共用型別定義](../../lib/types/common.ts)

---

**文件版本**: 1.0  
**最後更新**: 2025/11/15

