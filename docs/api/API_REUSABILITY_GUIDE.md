# API 可重用性指南

**版本**: 1.0  
**建立日期**: 2025/11/15

---

## 問題與解決方案

### 問題

如果每個作業模組都需要建立 API 契約文件，會不會造成重複工作？

**答案**: 不會！我們已經建立了標準化的解決方案。

---

## 解決方案架構

### 1. 共用型別定義 (`lib/types/common.ts`)

**目的**: 定義所有模組共用的型別，避免重複定義。

**包含的共用型別**:
- ✅ `ApiErrorResponse` - 標準錯誤回應
- ✅ `PaginatedResponse<T>` - 標準分頁回應
- ✅ `BatchOperationResponse` - 標準批次操作回應
- ✅ `BaseEntity` - 標準資料模型基礎欄位
- ✅ `BaseQueryParams` - 標準查詢參數
- ✅ `ValidationError` / `ValidationResult` - 驗證錯誤
- ✅ `PendingStatus` / `EntityWithStatus<T>` - 前端狀態管理

**使用方式**:
```typescript
import type {
  BaseEntity,
  PaginatedResponse,
  BatchOperationResponse,
} from "@/lib/types/common";

// 定義模組特定型別
export interface Customer extends BaseEntity {
  name: string;
  email: string;
}

// 使用共用型別
export type CustomerListResponse = PaginatedResponse<Customer>;
```

---

### 2. API 契約文件模板 (`docs/api/API_CONTRACT_TEMPLATE.md`)

**目的**: 提供標準化的 API 契約文件模板。

**使用方式**:
1. 複製模板
2. 替換佔位符
3. 填寫模組特定內容

**優點**:
- 保持文件結構一致性
- 減少重複工作
- 確保所有模組都有完整的文件

---

### 3. API 設計標準 (`docs/api/API_STANDARDS.md`)

**目的**: 定義整個專案的 API 設計標準。

**內容**:
- 命名規範
- 標準端點模式
- 錯誤處理標準
- 認證與授權
- 效能要求
- 文件要求

**優點**:
- 確保所有 API 遵循相同標準
- 新開發者可以快速了解規範
- 減少設計決策時間

---

## 建立新模組 API 的標準流程

### Step 1: 建立型別定義（5-10 分鐘）

```typescript
// lib/types/customers.ts
import type { BaseEntity, PaginatedResponse } from "@/lib/types/common";

// 1. 定義模組特定型別（繼承 BaseEntity）
export interface Customer extends BaseEntity {
  name: string;
  email: string;
  phone?: string;
}

// 2. 使用共用型別定義 API 回應
export type CustomerListResponse = PaginatedResponse<Customer>;
export type CustomerBatchResponse = BatchOperationResponse;
```

**時間**: 5-10 分鐘（只需定義模組特定欄位）

---

### Step 2: 建立 API 契約文件（15-20 分鐘）

```bash
# 1. 複製模板
cp docs/api/API_CONTRACT_TEMPLATE.md docs/api/CUSTOMERS_API_CONTRACT.md

# 2. 填寫內容
# - 替換 [模組名稱] → 客戶維護
# - 替換 [API 路徑] → /api/customers
# - 填寫 API 端點說明
# - 填寫驗證規則
```

**時間**: 15-20 分鐘（大部分是複製貼上和替換）

---

### Step 3: 建立 OpenAPI 規格（20-30 分鐘）

```bash
# 1. 參考範例
# 參考 docs/api/codes-api.yaml

# 2. 建立新檔案
# docs/api/customers-api.yaml

# 3. 複製結構，修改內容
# - 修改 paths
# - 修改 schemas
# - 保持結構一致
```

**時間**: 20-30 分鐘（大部分是複製和修改）

---

### Step 4: 建立 API 服務（10-15 分鐘）

```typescript
// lib/api/customers.ts
import type { Customer, CustomerListResponse } from "@/lib/types/customers";
import type { BaseQueryParams } from "@/lib/types/common";

export async function getCustomers(
  params?: BaseQueryParams
): Promise<CustomerListResponse> {
  // 實作...
}
```

**時間**: 10-15 分鐘（使用標準模式）

---

## 總時間估算

| 步驟 | 時間 | 說明 |
|------|------|------|
| 型別定義 | 5-10 分鐘 | 只需定義模組特定欄位 |
| API 契約文件 | 15-20 分鐘 | 使用模板，大部分是替換 |
| OpenAPI 規格 | 20-30 分鐘 | 參考範例，複製結構 |
| API 服務 | 10-15 分鐘 | 使用標準模式 |
| **總計** | **50-75 分鐘** | **約 1-1.5 小時** |

**對比**: 如果沒有標準化，每個模組可能需要 3-4 小時。

---

## 實際範例對比

### 沒有標準化（舊方式）

每個模組都需要：
- ❌ 重複定義錯誤回應格式
- ❌ 重複定義分頁回應格式
- ❌ 重複定義批次操作格式
- ❌ 重複定義基礎欄位
- ❌ 每次都要思考 API 設計

**時間**: 每個模組 3-4 小時

---

### 有標準化（新方式）

每個模組只需要：
- ✅ 定義模組特定欄位（繼承 BaseEntity）
- ✅ 使用共用型別（PaginatedResponse, BatchOperationResponse）
- ✅ 使用模板建立文件
- ✅ 參考範例建立 OpenAPI 規格

**時間**: 每個模組 1-1.5 小時

**節省時間**: 約 50-60%

---

## 共用型別使用範例

### 範例 1: 客戶維護模組

```typescript
// lib/types/customers.ts
import type { BaseEntity, PaginatedResponse } from "@/lib/types/common";

export interface Customer extends BaseEntity {
  name: string;
  email: string;
}

export type CustomerListResponse = PaginatedResponse<Customer>;
```

### 範例 2: 倉庫維護模組

```typescript
// lib/types/warehouses.ts
import type { BaseEntity, PaginatedResponse } from "@/lib/types/common";

export interface Warehouse extends BaseEntity {
  name: string;
  address: string;
  capacity: number;
}

export type WarehouseListResponse = PaginatedResponse<Warehouse>;
```

### 範例 3: 員工維護模組

```typescript
// lib/types/employees.ts
import type { BaseEntity, PaginatedResponse } from "@/lib/types/common";

export interface Employee extends BaseEntity {
  name: string;
  department: string;
  position: string;
}

export type EmployeeListResponse = PaginatedResponse<Employee>;
```

**觀察**: 所有模組都使用相同的模式，只是欄位不同！

---

## 檢查清單

建立新模組 API 時，請確認：

- [ ] 使用 `lib/types/common.ts` 中的共用型別
- [ ] 模組型別繼承 `BaseEntity`
- [ ] 使用 `PaginatedResponse<T>` 定義列表回應
- [ ] 使用 `BatchOperationResponse` 定義批次操作回應
- [ ] 使用 `API_CONTRACT_TEMPLATE.md` 建立契約文件
- [ ] 參考 `codes-api.yaml` 建立 OpenAPI 規格
- [ ] 遵循 `API_STANDARDS.md` 中的設計標準

---

## 維護與更新

### 當需要新增共用型別時

1. 在 `lib/types/common.ts` 中新增
2. 更新 `API_STANDARDS.md` 說明使用方式
3. 更新所有使用該型別的模組（如果需要）

### 當需要修改標準時

1. 在 `API_STANDARDS.md` 中更新標準
2. 更新 `API_CONTRACT_TEMPLATE.md`（如果需要）
3. 通知所有開發者
4. 逐步更新現有模組（如果需要）

---

## 結論

### 優點總結

1. ✅ **減少重複工作**: 共用型別和模板大幅減少重複定義
2. ✅ **保持一致性**: 所有模組遵循相同標準
3. ✅ **提高效率**: 建立新模組 API 只需 1-1.5 小時
4. ✅ **易於維護**: 修改標準只需更新一處
5. ✅ **降低錯誤**: 標準化減少設計錯誤

### 實際效益

- **時間節省**: 每個模組節省 50-60% 時間
- **一致性**: 所有 API 遵循相同模式
- **可維護性**: 共用型別易於維護和更新
- **可擴展性**: 新模組可以快速建立

---

## 相關文件

- [API 設計標準](./API_STANDARDS.md)
- [API 契約模板](./API_CONTRACT_TEMPLATE.md)
- [共用型別定義](../../lib/types/common.ts)
- [代碼維護 API 範例](./CODES_API_CONTRACT.md)

---

**文件版本**: 1.0  
**最後更新**: 2025/11/15

