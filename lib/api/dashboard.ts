import type { DashboardData } from "@/lib/mocks/dashboardMock";
import { generateMockDashboardData } from "@/lib/mocks/dashboardMock";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

/**
 * Dashboard API 服務
 * 
 * 符合規格：2.4 Dashboard
 */

/**
 * 取得 Dashboard 資料
 * 
 * 目前使用 Mock 資料，未來可替換為真實 API
 */
export async function getDashboardData(): Promise<DashboardData> {
  // TODO: 未來替換為真實 API
  // const response = await fetch(`${API_BASE_URL}/dashboard`, {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer ${getToken()}`,
  //   },
  // });
  // if (!response.ok) {
  //   throw new Error("Failed to fetch dashboard data");
  // }
  // return response.json();

  // 目前使用 Mock 資料
  return new Promise((resolve) => {
    // 模擬 API 延遲（< 2 秒）
    setTimeout(() => {
      resolve(generateMockDashboardData());
    }, 500);
  });
}

