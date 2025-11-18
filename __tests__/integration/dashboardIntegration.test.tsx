import { render, screen, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { getDashboardData } from "@/lib/api/dashboard";

// Mock dashboard API
jest.mock("@/lib/api/dashboard");
jest.mock("@/lib/api/auth", () => ({
  getUserInfo: jest.fn(() => ({
    id: "1",
    username: "testuser",
    name: "Test User",
    roles: ["admin"],
    permissions: ["*"],
  })),
}));

// Mock Next.js router
const mockPush = jest.fn();
const mockReplace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: mockReplace,
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("Dashboard 整合測試", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該載入 Dashboard 資料", async () => {
    const mockData = {
      taskOverview: {
        incompleteOrders: 5,
        pendingShipments: 2,
        pendingAudits: 3,
      },
      warehouseInventory: {
        totalBoxes: 1250,
        usageRate: 75.5,
        abnormalCount: 1,
      },
      notifications: [],
      warehouses: [],
      vehicleStatuses: [],
      top10Overdue: [],
      top10Storage: [],
      chartData: {
        labels: [],
        values: [],
      },
    };

    (getDashboardData as jest.Mock).mockResolvedValue(mockData);

    render(<DashboardPage />);

    // 應該顯示載入中
    expect(screen.getByText("載入中...")).toBeInTheDocument();

    // 等待資料載入完成
    await waitFor(() => {
      expect(screen.getByText("今日任務總覽")).toBeInTheDocument();
    });

    // 驗證資料已載入
    expect(getDashboardData).toHaveBeenCalledTimes(1);
  });

  it("應該在 2 秒內載入 Dashboard 資料", async () => {
    const mockData = {
      taskOverview: {
        incompleteOrders: 5,
        pendingShipments: 2,
        pendingAudits: 3,
      },
      warehouseInventory: {
        totalBoxes: 1250,
        usageRate: 75.5,
        abnormalCount: 1,
      },
      notifications: [],
      warehouses: [],
      vehicleStatuses: [],
      top10Overdue: [],
      top10Storage: [],
      chartData: {
        labels: [],
        values: [],
      },
    };

    // 模擬快速回應（< 500ms）
    (getDashboardData as jest.Mock).mockImplementation(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(mockData), 100);
        })
    );

    const startTime = Date.now();
    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("今日任務總覽")).toBeInTheDocument();
    });

    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(2000); // 應該在 2 秒內完成
  });

  it("應該顯示錯誤訊息當載入失敗時", async () => {
    (getDashboardData as jest.Mock).mockRejectedValue(
      new Error("無法載入資料")
    );

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText(/錯誤：/)).toBeInTheDocument();
      expect(screen.getByText(/無法載入資料/)).toBeInTheDocument();
    });
  });

  it("應該顯示 Dashboard Widgets", async () => {
    const mockData = {
      taskOverview: {
        incompleteOrders: 5,
        pendingShipments: 2,
        pendingAudits: 3,
      },
      warehouseInventory: {
        totalBoxes: 1250,
        usageRate: 75.5,
        abnormalCount: 1,
      },
      notifications: [
        {
          id: "1",
          type: "announcement" as const,
          title: "測試通知",
          message: "測試通知內容",
          timestamp: new Date().toISOString(),
          read: false,
        },
      ],
      warehouses: [],
      vehicleStatuses: [],
      top10Overdue: [],
      top10Storage: [],
      chartData: {
        labels: [],
        values: [],
      },
    };

    (getDashboardData as jest.Mock).mockResolvedValue(mockData);

    render(<DashboardPage />);

    await waitFor(() => {
      expect(screen.getByText("今日任務總覽")).toBeInTheDocument();
      expect(screen.getByText("倉庫即時庫存概況")).toBeInTheDocument();
      expect(screen.getByText("最新通知")).toBeInTheDocument();
    });

    // 驗證資料顯示
    expect(screen.getByText("5")).toBeInTheDocument(); // incompleteOrders
    // 驗證倉庫庫存資料（使用 toLocaleString 可能顯示為 "1,250"）
    const container = document.body;
    expect(container.textContent).toMatch(/1[,\s]?250|1250/); // totalBoxes (可能格式化為 1,250)
  });
});

