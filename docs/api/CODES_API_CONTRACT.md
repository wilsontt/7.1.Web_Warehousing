# 代碼維護 API 契約文件

**版本**: 1.0  
**建立日期**: 2025/11/15  
**依據規格**: `1.1.代碼維護/規格文件 (SPEC)-1.1.代碼維護.md` (v1.2)  
**依據憲章**: v2.1.0

---

## 概述

本文件定義了「代碼維護」模組的 API 契約，用於前端與後端開發的介面規範。

### API 基礎資訊

- **Base URL**: `/api/codes`
- **認證方式**: Bearer Token (JWT)
- **內容類型**: `application/json`
- **字元編碼**: UTF-8

### 權限要求

所有 API 端點都需要：
- 有效的 JWT Token
- 「代碼維護」權限（RBAC）

---

## API 端點

### 1. GET /api/codes/tree

取得完整的三層分類樹狀結構。

#### 請求

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters**: 無

#### 回應

**成功回應 (200 OK)**:
```json
{
  "majorCategories": [
    {
      "majorCatId": 1,
      "majorCatNo": "001",
      "majorCatName": "文件類型",
      "createdBy": "admin",
      "createdDate": "20251115100000",
      "modifiedBy": "admin",
      "modifiedDate": "20251115100000",
      "lockVer": 1,
      "createdTime": "2025-11-15T10:00:00Z",
      "updatedTime": "2025-11-15T10:00:00Z"
    }
  ],
  "midCategories": [
    {
      "midCatId": 1,
      "majorCatId": 1,
      "majorCatNo": "001",
      "midCatCode": "001",
      "codeDesc": "合約文件",
      "value1": 0,
      "value2": 0,
      "remark": "",
      "createdBy": "admin",
      "createdDate": "20251115100000",
      "modifiedBy": "admin",
      "modifiedDate": "20251115100000",
      "lockVer": 1,
      "createdTime": "2025-11-15T10:00:00Z",
      "updatedTime": "2025-11-15T10:00:00Z"
    }
  ],
  "subCategories": [
    {
      "id": 1,
      "midCatId": 1,
      "majorCatNo": "001",
      "midCatCode": "001",
      "subcatCode": "001",
      "codeDesc": "正式合約",
      "remark": "",
      "createdBy": "admin",
      "createdDate": "20251115100000",
      "modifiedBy": "admin",
      "modifiedDate": "20251115100000",
      "lockVer": 1,
      "createdTime": "2025-11-15T10:00:00Z",
      "updatedTime": "2025-11-15T10:00:00Z"
    }
  ]
}
```

**錯誤回應 (401 Unauthorized)**:
```json
{
  "code": "UNAUTHORIZED",
  "message": "您沒有權限執行此操作",
  "trackingId": "TRK-1234567890-abc123"
}
```

**錯誤回應 (403 Forbidden)**:
```json
{
  "code": "FORBIDDEN",
  "message": "您沒有「代碼維護」權限",
  "trackingId": "TRK-1234567890-abc123"
}
```

**效能要求**: 回應時間 ≤ 1.5 秒（測試基準：1000 筆大分類及其子項）

---

### 2. POST /api/codes/batch

批次儲存（新增、修改、刪除）代碼資料。

#### 請求

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body**:
```json
{
  "creates": [
    {
      "majorCatNo": "002",
      "majorCatName": "新大分類",
      "createdBy": "admin"
    },
    {
      "majorCatNo": "001",
      "midCatCode": "002",
      "codeDesc": "新中分類",
      "createdBy": "admin"
    }
  ],
  "updates": [
    {
      "majorCatId": 1,
      "lockVer": 1,
      "majorCatName": "修改後的名稱"
    }
  ],
  "deletes": [
    {
      "majorCatId": 2,
      "lockVer": 1,
      "type": "major"
    },
    {
      "midCatId": 5,
      "lockVer": 2,
      "type": "mid"
    },
    {
      "id": 10,
      "lockVer": 1,
      "type": "sub"
    }
  ]
}
```

#### 回應

**成功回應 (200 OK)**:
```json
{
  "success": true,
  "trackingId": "TRK-1234567890-abc123",
  "message": "批次儲存成功"
}
```

**部分失敗回應 (207 Multi-Status)**:
```json
{
  "success": false,
  "trackingId": "TRK-1234567890-abc123",
  "message": "部分操作失敗",
  "errors": [
    {
      "field": "majorCatNo",
      "message": "大分類編碼已存在",
      "code": "DUPLICATE_KEY"
    }
  ],
  "failedItems": [
    {
      "type": "create",
      "index": 0,
      "error": "大分類編碼已存在"
    }
  ]
}
```

**驗證錯誤回應 (400 Bad Request)**:
```json
{
  "code": "VALIDATION_ERROR",
  "message": "資料驗證失敗",
  "details": [
    {
      "field": "majorCatNo",
      "message": "大分類編碼為必填欄位",
      "code": "REQUIRED"
    },
    {
      "field": "majorCatNo",
      "message": "大分類編碼長度必須為 3 字元",
      "code": "LENGTH_INVALID"
    }
  ],
  "trackingId": "TRK-1234567890-abc123"
}
```

**業務邏輯錯誤回應 (400 Bad Request)**:
```json
{
  "code": "BUSINESS_RULE_VIOLATION",
  "message": "無法刪除仍有子分類的資料",
  "details": [
    {
      "field": "majorCatId",
      "message": "大分類「001」仍有中分類資料，無法刪除",
      "code": "HAS_CHILDREN"
    }
  ],
  "trackingId": "TRK-1234567890-abc123"
}
```

**樂觀鎖定錯誤回應 (409 Conflict)**:
```json
{
  "code": "OPTIMISTIC_LOCK_CONFLICT",
  "message": "資料已被其他使用者修改，請重新載入後再試",
  "details": [
    {
      "field": "majorCatId",
      "message": "版本號不符，資料可能已被修改",
      "code": "LOCK_VERSION_MISMATCH"
    }
  ],
  "trackingId": "TRK-1234567890-abc123"
}
```

**交易要求**:
- 所有操作必須在單一資料庫交易中執行
- 任何一項失敗，全部回滾（Rollback）
- 成功後才提交（Commit）

**效能要求**: 批次儲存操作 ≤ 2 秒完成並回傳結果

**稽核要求**: 所有操作必須寫入稽核日誌，包含：
- 操作人員
- 操作時間
- IP 位址
- 操作類型（新增/修改/刪除）
- 分類鍵值
- 異動前後差異（修改時）
- 追蹤 ID

---

### 3. GET /api/codes/search

查詢代碼資料。

#### 請求

**Headers**:
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters**:
- `keyword` (string, optional): 關鍵字（搜尋代號、名稱、說明）
- `majorCatNo` (string, optional): 大分類編碼（篩選條件）
- `midCatCode` (string, optional): 中分類編碼（篩選條件）
- `page` (number, optional): 頁碼（從 1 開始，預設 1）
- `pageSize` (number, optional): 每頁筆數（預設 20，最大 100）

**範例**:
```
GET /api/codes/search?keyword=合約&majorCatNo=001&page=1&pageSize=20
```

#### 回應

**成功回應 (200 OK)**:
```json
{
  "results": [
    {
      "type": "major",
      "major": {
        "majorCatId": 1,
        "majorCatNo": "001",
        "majorCatName": "文件類型"
      },
      "matchedFields": ["majorCatName"]
    },
    {
      "type": "mid",
      "mid": {
        "midCatId": 1,
        "majorCatNo": "001",
        "midCatCode": "001",
        "codeDesc": "合約文件"
      },
      "matchedFields": ["codeDesc"]
    }
  ],
  "total": 15,
  "page": 1,
  "pageSize": 20,
  "totalPages": 1
}
```

**錯誤回應**: 與其他 API 相同

---

## 錯誤碼定義

| 錯誤碼 | HTTP 狀態碼 | 說明 |
|--------|------------|------|
| `UNAUTHORIZED` | 401 | 未提供或無效的 Token |
| `FORBIDDEN` | 403 | 沒有「代碼維護」權限 |
| `VALIDATION_ERROR` | 400 | 資料驗證失敗 |
| `BUSINESS_RULE_VIOLATION` | 400 | 違反業務規則（如：刪除有子項的資料） |
| `OPTIMISTIC_LOCK_CONFLICT` | 409 | 樂觀鎖定衝突 |
| `DUPLICATE_KEY` | 400 | 唯一鍵重複 |
| `NOT_FOUND` | 404 | 資料不存在 |
| `INTERNAL_SERVER_ERROR` | 500 | 伺服器內部錯誤 |

---

## 資料驗證規則

### 大分類 (MajorCategory)

| 欄位 | 必填 | 長度限制 | 格式 | 唯一性 |
|------|------|---------|------|--------|
| `majorCatNo` | ✅ | 3 字元 | 字串 | 是 |
| `majorCatName` | ✅ | 最大 120 字元 | 字串 | 否 |

### 中分類 (MidCategory)

| 欄位 | 必填 | 長度限制 | 格式 | 唯一性 |
|------|------|---------|------|--------|
| `majorCatNo` | ✅ | 3 字元 | 字串 | 與 `midCatCode` 組成唯一鍵 |
| `midCatCode` | ✅ | 3 字元 | 字串 | 與 `majorCatNo` 組成唯一鍵 |
| `codeDesc` | ✅ | 最大 120 字元 | 字串 | 否 |
| `value1` | ❌ | - | 數字 | 否 |
| `value2` | ❌ | - | 數字 | 否 |
| `remark` | ❌ | 最大 240 字元 | 字串 | 否 |

### 細分類 (SubCategory)

| 欄位 | 必填 | 長度限制 | 格式 | 唯一性 |
|------|------|---------|------|--------|
| `majorCatNo` | ✅ | 3 字元 | 字串 | 與 `midCatCode` + `subcatCode` 組成唯一鍵 |
| `midCatCode` | ✅ | 3 字元 | 字串 | 與 `majorCatNo` + `subcatCode` 組成唯一鍵 |
| `subcatCode` | ✅ | 3 字元 | 字串 | 與 `majorCatNo` + `midCatCode` 組成唯一鍵 |
| `codeDesc` | ✅ | 最大 120 字元 | 字串 | 否 |
| `remark` | ❌ | 最大 240 字元 | 字串 | 否 |

---

## 業務規則

1. **刪除限制**:
   - 無法刪除仍有中分類的大分類
   - 無法刪除仍有細分類的中分類

2. **鍵值欄位不可修改**:
   - `majorCatNo` 建立後不可修改
   - `midCatCode` 建立後不可修改
   - `subcatCode` 建立後不可修改

3. **樂觀鎖定**:
   - 所有更新操作必須提供 `lockVer`
   - 版本號不符時回傳 409 Conflict

4. **稽核日誌**:
   - 所有 CUD 操作必須記錄稽核日誌
   - 包含異動前後差異（修改時）

---

## 型別定義

所有型別定義請參考：`lib/types/codes.ts`

---

## 變更記錄

| 版本 | 日期 | 變更內容 | 變更人 |
|------|------|---------|--------|
| 1.0 | 2025/11/15 | 初始版本 | IT 工程師 |

---

**文件版本**: 1.0  
**最後更新**: 2025/11/15

