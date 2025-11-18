# API 文件目錄

**建立日期**: 2025/11/15

---

## 概述

本目錄包含所有模組的 API 契約文件和 OpenAPI 規格。

---

## 文件結構

```
docs/api/
├── README.md                    # 本文件
├── API_STANDARDS.md            # API 設計標準與最佳實踐
├── API_CONTRACT_TEMPLATE.md    # API 契約文件模板
├── CODES_API_CONTRACT.md       # 代碼維護 API 契約（範例）
└── codes-api.yaml              # 代碼維護 OpenAPI 規格（範例）
```

---

## 使用指南

### 建立新模組的 API 文件

1. **複製模板**:
   ```bash
   cp docs/api/API_CONTRACT_TEMPLATE.md docs/api/[模組名稱]_API_CONTRACT.md
   ```

2. **填寫內容**:
   - 替換所有佔位符
   - 根據模組需求調整內容
   - 保持結構一致性

3. **建立 OpenAPI 規格**:
   - 參考 `codes-api.yaml` 作為範例
   - 建立 `[模組名稱]-api.yaml`
   - 使用標準的 Schema 定義

4. **建立型別定義**:
   - 在 `lib/types/[模組名稱].ts` 定義型別
   - 使用 `lib/types/common.ts` 中的共用型別

---

## 文件清單

### 標準文件

| 檔案 | 說明 | 狀態 |
|------|------|------|
| `API_STANDARDS.md` | API 設計標準與最佳實踐 | ✅ 已完成 |
| `API_CONTRACT_TEMPLATE.md` | API 契約文件模板 | ✅ 已完成 |

### 模組 API 文件

| 模組 | 契約文件 | OpenAPI 規格 | 狀態 |
|------|---------|-------------|------|
| 代碼維護 | `CODES_API_CONTRACT.md` | `codes-api.yaml` | ✅ 已完成 |
| [其他模組] | - | - | 待建立 |

---

## 相關資源

- **共用型別**: `lib/types/common.ts`
- **模組型別**: `lib/types/[模組名稱].ts`
- **API 服務**: `lib/api/[模組名稱].ts`

---

## 更新記錄

| 日期 | 變更內容 | 變更人 |
|------|---------|--------|
| 2025/11/15 | 建立 API 文件目錄和標準 | IT 工程師 |

---

**最後更新**: 2025/11/15

