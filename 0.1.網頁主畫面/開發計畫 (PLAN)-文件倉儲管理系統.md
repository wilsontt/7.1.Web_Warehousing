# 開發計畫 (PLAN): 文件倉儲管理系統（全域 UI & 架構）
**版本**: 1.0  
**狀態**: [草稿]  
**負責人**: [IT 工程師 (您)]  
**依據規格**: `規格文件 (SPEC)-文件倉儲管理系統.md` (v1.0)  
**依據憲章**: v2.1.0

## 1. 目標與交付物 (Objectives & Deliverables)
- 建立符合全域規格的 UI 框架（A/B 佈局、主選單、Toolbar、狀態列等）。
- 建立共用元件套件：DataTable、Breadcrumbs、狀態列、ResizableLayout、深色模式控制。
- 完成登入與 Dashboard 的基礎流程串接，提供範例模組 (如 `基本作業` 範例頁) 作為模板。
- 提供完整文件：UI 指南 (`DESIGN_GUIDELINES.md`)、`DataTableConfig`、API 規格草案、測試報告。

## 2. 里程碑 (Milestones)
| 里程碑 | 說明 | 產出物 | 預計時間 |
| --- | --- | --- | --- |
| M1 | 規格核對與設計草圖 | Wireframe、Style Guide、主選單資訊架構 | W1 |
| M2 | UI 框架實作 | A/B Layout、主選單、深色模式切換、語系選單 | W2 |
| M3 | 共用元件完成 | ResizableLayout、DataTable、Toolbar、狀態列、Breadcrumbs | W3 |
| M4 | 登入 & Dashboard 串接 | 登入流程 + 2FA Stub、Dashboard 假資料範例 | W4 |
| M5 | 測試與文件 | 單元/整合測試報告、DESIGN_GUIDELINES、憲章檢查 | W5 |

## 3. 工作分解 (Work Breakdown Structure)
1. **需求與設計確認**
   - 重新檢視 SPEC、主選單八大作業、左側邊欄標準化要求。
   - 設計視覺稿（淺色/深色模式、桌面/平板）。
   - 設定 Logo `CROWN-Logo.png` 的位置、尺寸與安全距離。
2. **UI 框架與導覽**
   - 實作 A/B Layout Component，支援 sticky header 與內容滾動。
   - 建立主選單資料結構，依角色權限動態顯示項目。
   - 語系切換與使用者資訊下拉選單（帳號、IP、登入時間…）。
3. **共用元件**
   - ResizableLayout：設定預設/最小/最大寬度並提供拖曳手把。
   - DataTable：分頁、排序、搜尋/篩選、Sticky Header、`overflow-auto`、欄位樣式。
   - Toolbar：統一定義按鈕狀態、圖示、快捷鍵。
   - 狀態列與 Breadcrumbs 元件。
   - 深色模式切換（偵測 OS + 手動偏好儲存）。
4. **登入與 Dashboard 範例**
   - 登入表單、錯誤計數、鎖定提示、2FA 介面（stub）。
   - Dashboard widgets（任務總覽、庫存概況、Top 10 Chart）以 mock API 呈現。
   - 建立 `基本作業/代碼作業` 範例頁面展示 Master-Detail 佈局。
5. **文件與標準**
   - 撰寫 `DESIGN_GUIDELINES.md`，收錄佈局、元件使用方式。
   - 建立 `DataTableConfig.ts` 或同等設定檔。
   - 更新 `OpenAPI` 草案以支援登入/2FA/Dashboard API。
6. **測試與品質保證**
   - 單元測試：Layout、Menu、DataTable、深色模式等。
   - 整合測試：登入流程、主選單權限、Dashboard 資料載入時間。
   - Lighthouse/無障礙檢測、效能 Profiling。

## 4. 資源配置 (Resources & Roles)
| 角色 | 職責 |
| --- | --- |
| UI/UX 設計師 | 視覺稿、無障礙檢查、深色模式設計 |
| 前端工程師 (2) | Layout/共用元件實作、登入/Dashboard 範例、狀態管理 |
| 後端工程師 | IdP/OIDC 設定、登入 API、Dashboard 資料 API、稽核紀錄 |
| QA 工程師 | 撰寫與執行測試案例、Lighthouse/安全測試 |
| DevOps | 環境設定、日誌/監控整合、部署流程支援 |

## 5. 時程與依賴 (Schedule & Dependencies)
- **外部依賴**：IdP/2FA 服務、RBAC 資料表、Dashboard 指標定義。
- **內部依賴**：憲章核准、登錄模組資產、Tailwind/React 技術堆疊確認。
- 預估時程 5 週，視資源可調整。

## 6. 風險與緩解 (Risks & Mitigations)
| 風險 | 影響 | 緩解方案 |
| --- | --- | --- |
| 共用元件要求頻繁變更 | 延遲整體 UI 定案 | 先鎖定 MVP 範圍，未來改進透過版本控制 |
| IdP/2FA 串接延誤 | 登入流程無法完整驗證 | 先使用 Mock Service，與基礎架構團隊排程整合 |
| 深色模式設計不一致 | 使用者體驗受影響 | 設計審查、色票與對比度檢測自動化 |
| Dashboard 指標資料未準備 | 無法驗證效能 | 以假資料／模擬 API，並設立資料提供時程 |
| 稽核與日誌缺漏 | 不符憲章 P2 | 提前與稽核模組對接、測試覆蓋稽核流程 |

## 7. 測試計畫 (Testing Plan)
- **單元測試**：Layout 位置、Menu 權限、DataTable 功能、深色模式 Toggle。
- **整合測試**：登入 + 2FA + RBAC、Dashboard 資料載入 (<2 秒)、主選單導覽與頁面狀態保持。
- **E2E 測試**：從登入到操作範例模組（如代碼維護），確認 Toolbar 與狀態列互動。
- **非功能測試**：Lighthouse 90+、無障礙 (WCAG AA)、安全測試 (XSS/CSRF/Session Timeout)、效能 Profiling。

## 9. 主題一致性修補（新增 2025/11/16）
- 任務：補齊 TopNavigation、主選單面板、內容區、表格/分頁、Dialog 的 `dark:` 樣式與對比。
- DoD：切換主題時上述區塊背景/字色/邊框/hover/selected 同步更新；主題 E2E 測試通過；DataTable 分頁資訊在 full/compact/auto 下皆可讀不折行。
## 8. 憲章遵循檢查 (Constitution Check)
- **P1**：計畫以模組化與共用元件確保簡潔一致。  
- **P2**：涵蓋登入安全、RBAC、2FA、稽核。  
- **P3**：對應 SPEC 驗收條件並規劃測試。  
- **P4**：里程碑可逐步交付（UI → 元件 → 流程 → 測試）。  
- **P5**：所有文案、文件以正體中文撰寫。  
- **P7**：列出測試計畫與品質檢查。  
- **P8**：維護統一 UI/UX、顯式儲存流程。  
- **P9**：設定主要效能門檻。  
- **P10–P13**：配合模組化單體、資料治理與可觀測性要求。  
- **H1–H3**：版本 1.0 草稿，修訂需透過 PR 更新版本。

