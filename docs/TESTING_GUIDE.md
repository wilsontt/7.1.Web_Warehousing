# 測試指南 (Testing Guide)

**建立日期**: 2025/11/15  
**最後更新**: 2025/11/15

## 快速開始

本指南說明如何測試系統的登入功能和 Dashboard 頁面。

## 前置準備

### 1. 啟動開發伺服器

```bash
npm run dev
```

開發伺服器會啟動在 `http://localhost:3000`

### 2. 確認環境設定

確保您**沒有**設定 `NEXT_PUBLIC_API_URL` 環境變數，這樣系統會自動使用 Mock 認證服務。

如果您的 `.env.local` 中有設定 `NEXT_PUBLIC_API_URL`，請暫時移除或註解掉：

```bash
# NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## 測試步驟

### 步驟 1: 訪問登入頁面

1. 開啟瀏覽器，訪問：`http://localhost:3000/login`
2. 您應該會看到登入表單，包含：
   - 系統 Logo
   - 「文件倉儲管理系統」標題
   - 帳號輸入欄位
   - 密碼輸入欄位（帶有顯示/隱藏切換）
   - 登入按鈕
   - 取消按鈕
   - 右上角的深色模式切換器

### 步驟 2: 使用測試帳號登入

#### 測試帳號 1: 管理員 (Admin)

| 項目 | 值 |
|------|-----|
| 帳號 | `admin` |
| 密碼 | `Admin@123` |

**預期結果**：
- ✅ 登入成功
- ✅ 自動導向 `/dashboard`
- ✅ 顯示 Dashboard 頁面
- ✅ 頂部導覽列顯示「admin」使用者選單
- ✅ 可以看到所有主選單項目（包含系統管理作業）

#### 測試帳號 2: 主管 (Manager)

| 項目 | 值 |
|------|-----|
| 帳號 | `manager` |
| 密碼 | `Manager@123` |

**預期結果**：
- ✅ 登入成功
- ✅ 自動導向 `/dashboard`
- ✅ 顯示 Dashboard 頁面
- ✅ 頂部導覽列顯示「manager」使用者選單
- ✅ 可以看到大部分主選單項目（不包含系統管理作業）

#### 測試帳號 3: 一般使用者 (User)

| 項目 | 值 |
|------|-----|
| 帳號 | `user` |
| 密碼 | `User@123` |

**預期結果**：
- ✅ 登入成功
- ✅ 自動導向 `/dashboard`
- ✅ 顯示 Dashboard 頁面
- ✅ 頂部導覽列顯示「user」使用者選單
- ✅ 只能看到基本作業相關的主選單項目

### 步驟 3: 驗證 Dashboard 功能

登入成功後，您應該能夠：

1. **看到 Dashboard 頁面內容**：
   - 上半部：今日任務總覽、倉庫即時庫存概況、最新通知
   - 下半部：倉庫資訊、車輛派送狀況、Top 10 列表、長條圖趨勢

2. **使用頂部導覽列**：
   - 左側：系統 Logo 和名稱（可點擊返回 Dashboard）
   - 中間：主選單（根據使用者權限顯示）
   - 右側：語系選擇器、使用者選單

3. **測試使用者選單**：
   - 點擊右上角的使用者名稱
   - 應該看到下拉選單，包含：
     - 使用者資訊（帳號、IP、登入時間）
     - 變更密碼選項
     - 登出選項

4. **測試登出功能**：
   - 點擊使用者選單中的「登出」
   - 應該自動導向登入頁面
   - 再次訪問 `/dashboard` 應該會被導向回登入頁面

### 步驟 4: 測試錯誤處理

#### 測試錯誤密碼

1. 使用正確帳號但錯誤密碼（例如：`admin` / `WrongPassword123`）
2. **預期結果**：
   - ❌ 顯示錯誤訊息：「您輸入的帳號或密碼不正確，請重新輸入。」
   - ✅ 顯示錯誤次數（例如：錯誤 1 次）

#### 測試帳號鎖定

1. 連續輸入錯誤密碼 6 次
2. **預期結果**：
   - ❌ 顯示鎖定訊息：「您已連續輸入錯誤達 6 次，帳號已被鎖定。請與管理人員聯繫。」
   - ✅ 登入按鈕被禁用
   - ✅ 無法繼續嘗試登入

**注意**：在 Mock 服務中，錯誤計數會持續累積，直到登入成功才會重置。若要重置錯誤計數，請重新載入頁面（Mock 服務的錯誤計數儲存在記憶體中）。

#### 測試不存在的帳號

1. 使用不存在的帳號（例如：`nonexistent` / `Password123`）
2. **預期結果**：
   - ❌ 顯示錯誤訊息：「您輸入的帳號或密碼不正確，請重新輸入。」
   - ✅ 不會透露帳號是否存在（安全考量）

## 常見問題

### Q1: 登入後沒有導向 Dashboard？

**檢查項目**：
1. 確認瀏覽器控制台是否有錯誤訊息
2. 確認 `lib/api/auth.ts` 中的 Mock 服務是否正確啟用
3. 檢查 `localStorage` 中是否有 `auth_token` 和 `user_info`

**解決方法**：
- 清除瀏覽器的 `localStorage` 和 `sessionStorage`
- 重新載入頁面
- 再次嘗試登入

### Q2: Dashboard 顯示「載入中...」但沒有內容？

**檢查項目**：
1. 確認 `lib/mocks/dashboardMock.ts` 是否正確載入
2. 檢查瀏覽器控制台的錯誤訊息
3. 確認網路請求是否成功

**解決方法**：
- 檢查瀏覽器開發者工具的 Network 標籤
- 確認沒有 CORS 或其他網路錯誤

### Q3: 無法看到主選單？

**檢查項目**：
1. 確認使用者資訊是否正確儲存
2. 檢查 `lib/services/menuService.ts` 的權限過濾邏輯
3. 確認使用者角色和權限是否正確

**解決方法**：
- 檢查 `localStorage` 中的 `user_info`
- 確認使用者角色是否正確（admin、manager、user）

### Q4: Mock 服務沒有啟用？

**檢查項目**：
1. 確認 `process.env.NODE_ENV === "development"`
2. 確認 `process.env.NEXT_PUBLIC_API_URL` 未設定或為空

**解決方法**：
- 檢查 `.env.local` 檔案
- 確認沒有設定 `NEXT_PUBLIC_API_URL`
- 重新啟動開發伺服器

## 開發者工具檢查

### 檢查 localStorage

開啟瀏覽器開發者工具（F12），在 Console 中執行：

```javascript
// 檢查 Token
console.log('Token:', localStorage.getItem('auth_token'));

// 檢查使用者資訊
console.log('User Info:', localStorage.getItem('user_info'));

// 檢查 Refresh Token
console.log('Refresh Token:', localStorage.getItem('refresh_token'));
```

### 檢查登入狀態

在 Console 中執行：

```javascript
// 檢查是否有有效的認證資訊
const token = localStorage.getItem('auth_token');
const userInfo = localStorage.getItem('user_info');

if (token && userInfo) {
  console.log('✅ 已登入');
  console.log('使用者資訊:', JSON.parse(userInfo));
} else {
  console.log('❌ 未登入');
}
```

### 清除認證資訊

如果需要清除認證資訊重新測試：

```javascript
// 清除所有認證相關的 localStorage
localStorage.removeItem('auth_token');
localStorage.removeItem('refresh_token');
localStorage.removeItem('user_info');
sessionStorage.removeItem('returnUrl');

// 重新載入頁面
window.location.reload();
```

## 測試檢查清單

- [ ] 可以訪問登入頁面
- [ ] 可以使用 admin 帳號登入
- [ ] 登入後自動導向 Dashboard
- [ ] Dashboard 顯示所有 Widgets
- [ ] 頂部導覽列正常顯示
- [ ] 主選單根據權限正確顯示
- [ ] 使用者選單功能正常
- [ ] 登出功能正常
- [ ] 錯誤密碼顯示正確錯誤訊息
- [ ] 帳號鎖定功能正常
- [ ] 未登入時訪問 Dashboard 會導向登入頁
- [ ] 主題切換：深/淺色下 TopNavigation、MainMenu 面板、主要內容、DataTable、Dialog、分頁列皆正確換色
- [ ] DataTable 分頁資訊在 full/compact/auto 模式下顯示正確（窄寬時不折行）

## 相關文件

- [測試帳號清單](./TEST_ACCOUNTS.md)
- [設計指南](./DESIGN_GUIDELINES.md)
- [組件使用指南](./COMPONENT_USAGE.md)

---

**最後更新**: 2025/11/16

