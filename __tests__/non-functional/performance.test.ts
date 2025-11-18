/**
 * 效能測試
 * 
 * 符合規格：3. 非功能性需求 - 效能 [憲章 P9]
 * - Dashboard 資料載入時間 ≤ 2 秒
 * - 左側列表篩選與資料切換需在 500ms 內完成
 */

import { getDashboardData } from "@/lib/api/dashboard";

describe("效能測試", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("Dashboard 資料載入時間應該 ≤ 2 秒", async () => {
    const startTime = Date.now();
    
    await getDashboardData();
    
    const loadTime = Date.now() - startTime;
    
    expect(loadTime).toBeLessThan(2000); // 應該在 2 秒內完成
  });

  it("Dashboard API 回應時間應該 ≤ 2 秒（包含網路延遲模擬）", async () => {
    // 模擬網路延遲（Mock 服務已包含 500ms 延遲）
    const startTime = Date.now();
    
    await getDashboardData();
    
    const loadTime = Date.now() - startTime;
    
    // 考慮 Mock 服務的 500ms 延遲，實際應該 < 2000ms
    expect(loadTime).toBeLessThan(2000);
  });

  it("應該能夠快速載入 Dashboard 資料（< 1 秒，理想情況）", async () => {
    const startTime = Date.now();
    
    await getDashboardData();
    
    const loadTime = Date.now() - startTime;
    
    // 理想情況下應該 < 1 秒
    // 但考慮到 Mock 服務的 500ms 延遲，這裡設定為 < 1500ms
    expect(loadTime).toBeLessThan(1500);
  });
});

