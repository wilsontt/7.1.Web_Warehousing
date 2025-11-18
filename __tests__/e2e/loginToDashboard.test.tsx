import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";
import DashboardPage from "@/app/dashboard/page";
import { getDashboardData } from "@/lib/api/dashboard";
import { login } from "@/lib/api/auth";

// Mock dependencies
jest.mock("@/lib/api/dashboard");
jest.mock("@/lib/api/auth", () => ({
  login: jest.fn(),
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

describe("E2E: 登入到 Dashboard 完整流程", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorageMock.getItem.mockReturnValue(null);
    global.localStorageMock.setItem.mockClear();
  });

  it("應該完成從登入到 Dashboard 的完整流程", async () => {
    const user = userEvent.setup();

    // Mock successful login
    (login as jest.Mock).mockResolvedValue({
      success: true,
      token: "mock-token",
      user: {
        id: "1",
        username: "testuser",
        name: "Test User",
        roles: ["admin"],
        permissions: ["*"],
      },
    });

    // Mock dashboard data
    const mockDashboardData = {
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

    (getDashboardData as jest.Mock).mockResolvedValue(mockDashboardData);

    // Step 1: 渲染登入表單
    const { unmount: unmountLogin } = render(<LoginForm />);

    // Step 2: 輸入帳號密碼
    const usernameInput = screen.getByLabelText("帳號");
    const passwordInput = screen.getByLabelText("密碼");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    // Step 3: 點擊登入
    const loginButton = screen.getByRole("button", { name: "登入" });
    await user.click(loginButton);

    // Step 4: 驗證登入 API 被呼叫
    await waitFor(() => {
      expect(login).toHaveBeenCalled();
    });

    // Step 5: 驗證導向 Dashboard
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/dashboard");
    });

    // Step 6: 卸載登入表單，渲染 Dashboard
    unmountLogin();
    render(<DashboardPage />);

    // Step 7: 驗證 Dashboard 載入
    await waitFor(() => {
      expect(screen.getByText("今日任務總覽")).toBeInTheDocument();
    });

    // Step 8: 驗證 Dashboard 資料已載入
    expect(getDashboardData).toHaveBeenCalled();
    expect(screen.getByText("倉庫即時庫存概況")).toBeInTheDocument();
  });
});

