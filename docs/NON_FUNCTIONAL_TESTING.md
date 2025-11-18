# 非功能測試指南 (Non-Functional Testing Guide)

**建立日期**: 2025/11/15  
**最後更新**: 2025/11/15

## 概述

本文件說明如何執行非功能測試，包括效能、安全、無障礙和 Lighthouse 測試。

## 測試類型

### 1. 效能測試

**目標**：
- Dashboard 資料載入時間 ≤ 2 秒
- 左側列表篩選與資料切換需在 500ms 內完成

**執行方式**：
```bash
npm test -- __tests__/non-functional/performance.test.ts
```

**測試內容**：
- Dashboard API 回應時間
- 資料載入時間驗證
- 效能基準測試

---

### 2. 無障礙測試 (WCAG AA)

**目標**：
- 符合 WCAG AA 標準
- 支援鍵盤操作
- 適當的 ARIA 標籤

**執行方式**：
```bash
npm test -- __tests__/non-functional/accessibility.test.tsx
```

**測試內容**：
- 表單欄位標籤
- 鍵盤導覽
- ARIA 屬性
- 顏色對比度
- Focus 狀態

**手動檢查項目**：
- 使用鍵盤（Tab、Enter、Space）可以完成所有操作
- 螢幕閱讀器可以正確讀取內容
- 顏色對比度符合 WCAG AA 標準（4.5:1）

---

### 3. 安全測試

**目標**：
- XSS 防護
- CSRF 防護
- Session Timeout
- 敏感資料保護

**執行方式**：
```bash
npm test -- __tests__/non-functional/security.test.ts
```

**測試內容**：
- XSS 攻擊防護
- CSRF Token 管理
- Session 管理
- 敏感資料檢查
- 錯誤訊息安全性
- HTTPS 檢查

---

### 4. Lighthouse 測試

**目標**：
- Performance: ≥ 90
- Accessibility: ≥ 90
- Best Practices: ≥ 90
- SEO: ≥ 90

**執行方式**：

#### 方法 1: 使用 Chrome DevTools

1. 啟動開發伺服器：
   ```bash
   npm run dev
   ```

2. 開啟 Chrome 瀏覽器，訪問 `http://localhost:3000/login`

3. 開啟 Chrome DevTools (F12)

4. 切換到 "Lighthouse" 標籤

5. 選擇要測試的類別：
   - Performance
   - Accessibility
   - Best Practices
   - SEO

6. 點擊 "Generate report"

7. 檢查分數是否達到目標（≥ 90）

#### 方法 2: 使用 Lighthouse CI（需要安裝）

```bash
# 安裝 Lighthouse CI
npm install -g @lhci/cli

# 執行測試
lhci autorun
```

#### 方法 3: 使用 Node.js 腳本（需要安裝依賴）

```bash
# 安裝依賴
npm install --save-dev lighthouse chrome-launcher

# 執行腳本
node scripts/run-lighthouse.js
```

**檢查項目**：

**Performance**：
- First Contentful Paint (FCP) < 1.8s
- Largest Contentful Paint (LCP) < 2.5s
- Total Blocking Time (TBT) < 200ms
- Cumulative Layout Shift (CLS) < 0.1

**Accessibility**：
- 所有圖片有 alt 屬性
- 所有表單欄位有 label
- 顏色對比度符合標準
- 鍵盤導覽功能正常
- ARIA 標籤正確

**Best Practices**：
- 使用 HTTPS
- 沒有 console 錯誤
- 圖片格式適當
- 沒有過時的 API

**SEO**：
- 有 meta 描述
- 有適當的標題
- 有結構化資料

---

## 執行所有非功能測試

```bash
# 執行所有非功能測試
npm test -- __tests__/non-functional/

# 執行特定測試
npm test -- __tests__/non-functional/performance.test.ts
npm test -- __tests__/non-functional/accessibility.test.tsx
npm test -- __tests__/non-functional/security.test.ts
```

---

## 測試報告

### 自動化測試報告

執行測試後，Jest 會產生測試報告：

```bash
npm test -- __tests__/non-functional/ --coverage
```

### Lighthouse 報告

Lighthouse 測試會產生 HTML 報告，儲存在：
- `lighthouse-report.html`（如果使用腳本）
- Chrome DevTools 中直接顯示

---

## 持續整合 (CI)

### GitHub Actions 範例

```yaml
name: Non-Functional Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm test -- __tests__/non-functional/
      - run: npm run build
      - uses: treosh/lighthouse-ci-action@v7
        with:
          urls: |
            http://localhost:3000/login
            http://localhost:3000/dashboard
          uploadArtifacts: true
```

---

## 測試檢查清單

### 效能測試
- [ ] Dashboard 載入時間 < 2 秒
- [ ] API 回應時間符合規範
- [ ] 頁面切換流暢

### 無障礙測試
- [ ] 所有表單欄位有 label
- [ ] 鍵盤可以完成所有操作
- [ ] ARIA 標籤正確
- [ ] 顏色對比度符合標準
- [ ] Focus 狀態明顯
 - [ ] 深/淺色對比達 AA；DataTable 列 hover/selected 在兩種主題下皆可清楚辨識（2025/11/16）

### 安全測試
- [ ] XSS 防護有效
- [ ] CSRF Token 正確處理
- [ ] Session 管理正確
- [ ] 敏感資料不暴露
- [ ] 錯誤訊息不透露敏感資訊

### Lighthouse 測試
- [ ] Performance ≥ 90
- [ ] Accessibility ≥ 90
- [ ] Best Practices ≥ 90
- [ ] SEO ≥ 90

---

## 相關文件

- [測試指南](./TESTING_GUIDE.md)
- [問題排除指南](./TROUBLESHOOTING.md)
- [設計指南](./DESIGN_GUIDELINES.md)

---

**最後更新**: 2025/11/16

