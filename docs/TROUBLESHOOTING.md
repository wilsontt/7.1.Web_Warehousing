# 問題排除指南 (Troubleshooting Guide)

**建立日期**: 2025/11/15  
**最後更新**: 2025/11/15

## 常見問題與解決方案

### 問題 1: 登入時卡在「登入中...」狀態

**症狀**：
- 點擊登入按鈕後，按鈕顯示「登入中...」但沒有反應
- 瀏覽器開發者工具的 Network 標籤顯示對 `http://localhost:3001/api/audit/log` 的請求

**原因**：
- 系統嘗試呼叫後端稽核日誌 API，但後端服務未運行
- 請求可能因為 CORS 或網路錯誤而卡住

**解決方案**：

1. **確認環境變數設定**：
   - 確保 `.env.local` 中**沒有**設定 `NEXT_PUBLIC_API_URL`
   - 這樣系統會自動使用 Mock 服務，跳過真實 API 呼叫

2. **清除瀏覽器快取**：
   ```javascript
   // 在瀏覽器 Console 中執行
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

3. **重新啟動開發伺服器**：
   ```bash
   # 停止當前伺服器（Ctrl+C）
   npm run dev
   ```

**已修復**：
- ✅ 稽核日誌服務在開發環境且沒有 API URL 時會自動跳過真實 API 呼叫
- ✅ 所有稽核日誌呼叫改為非阻塞，不會影響登入流程
- ✅ 添加了 5 秒超時處理，避免請求卡住

---

### 問題 2: 登入成功後沒有導向 Dashboard

**症狀**：
- 輸入正確帳號密碼後，沒有自動導向 Dashboard
- 瀏覽器控制台可能有錯誤訊息

**檢查項目**：

1. **檢查 localStorage**：
   ```javascript
   // 在瀏覽器 Console 中執行
   console.log('Token:', localStorage.getItem('auth_token'));
   console.log('User Info:', localStorage.getItem('user_info'));
   ```

2. **檢查路由保護**：
   - 確認 `app/dashboard/layout.tsx` 中的 `AuthGuard` 是否正確運作
   - 檢查是否有 JavaScript 錯誤

3. **手動導向測試**：
   ```javascript
   // 在瀏覽器 Console 中執行
   window.location.href = '/dashboard';
   ```

**解決方案**：
- 清除 localStorage 和 sessionStorage
- 重新登入
- 檢查瀏覽器控制台的錯誤訊息

---

### 問題 3: Dashboard 顯示「載入中...」但沒有內容

**症狀**：
- 登入成功後進入 Dashboard
- 頁面顯示「載入中...」但一直沒有載入完成

**檢查項目**：

1. **檢查 Dashboard API**：
   - 確認 `lib/api/dashboard.ts` 是否正確使用 Mock 資料
   - 檢查瀏覽器 Network 標籤是否有錯誤請求

2. **檢查 Mock 資料**：
   - 確認 `lib/mocks/dashboardMock.ts` 是否正確匯出資料

**解決方案**：
- 檢查瀏覽器控制台的錯誤訊息
- 確認 Mock 服務是否正確載入
- 重新載入頁面

---

### 問題 4: 圖片尺寸警告

**症狀**：
- 瀏覽器控制台顯示圖片尺寸警告：
  ```
  Image with src "/CROWN-Logo.png" has either width or height modified, but not the other.
  ```

**解決方案**：
- ✅ 已修復：在 `app/login/page.tsx` 中添加了 `style={{ width: "auto", height: "auto" }}`
- 重新載入頁面，警告應該會消失

---

### 問題 5: Mock 服務沒有啟用

**症狀**：
- 登入時仍然嘗試呼叫真實 API
- 瀏覽器 Network 標籤顯示對 `http://localhost:3001/api` 的請求

**檢查項目**：

1. **確認環境變數**：
   ```bash
   # 檢查 .env.local 檔案
   cat .env.local
   ```
   
   確保**沒有**以下設定：
   ```bash
   # NEXT_PUBLIC_API_URL=http://localhost:3001/api  # 應該註解掉或刪除
   ```

2. **確認 Node 環境**：
   - 確保 `process.env.NODE_ENV === "development"`
   - 開發伺服器應該以 `npm run dev` 啟動

**解決方案**：
- 移除或註解 `.env.local` 中的 `NEXT_PUBLIC_API_URL`
- 重新啟動開發伺服器

---

### 問題 6: 測試帳號無法登入

**症狀**：
- 使用測試帳號登入時顯示錯誤訊息
- 即使帳號密碼正確也無法登入

**檢查項目**：

1. **確認帳號密碼**：
   - 管理員：`admin` / `Admin@123`
   - 主管：`manager` / `Manager@123`
   - 一般使用者：`user` / `User@123`

2. **檢查 Mock 服務**：
   - 確認 `lib/mocks/authMock.ts` 是否正確載入
   - 檢查瀏覽器控制台是否有錯誤

**解決方案**：
- 確認帳號密碼正確（注意大小寫）
- 檢查瀏覽器控制台的錯誤訊息
- 清除 localStorage 後重新嘗試

---

## 快速診斷步驟

### 步驟 1: 檢查環境設定

```bash
# 確認沒有設定 API URL
echo $NEXT_PUBLIC_API_URL
# 應該沒有輸出或為空
```

### 步驟 2: 檢查開發伺服器

```bash
# 確認開發伺服器正在運行
curl http://localhost:3000
# 應該返回 HTML 內容
```

### 步驟 3: 檢查瀏覽器狀態

在瀏覽器 Console 中執行：

```javascript
// 檢查認證狀態
const token = localStorage.getItem('auth_token');
const userInfo = localStorage.getItem('user_info');

console.log('Token:', token ? '存在' : '不存在');
console.log('User Info:', userInfo ? JSON.parse(userInfo) : '不存在');

// 檢查環境變數（僅在開發環境可用）
console.log('NODE_ENV:', process.env.NODE_ENV);
```

### 步驟 4: 清除所有狀態

```javascript
// 在瀏覽器 Console 中執行
localStorage.clear();
sessionStorage.clear();
location.reload();
```

---

## 聯絡支援

如果以上方法都無法解決問題，請：

1. 檢查瀏覽器控制台的完整錯誤訊息
2. 檢查 Network 標籤中的所有請求狀態
3. 記錄問題發生的步驟
4. 聯繫開發團隊

---

**最後更新**: 2025/11/15

