import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MainMenu from "@/components/navigation/MainMenu";
import { getFilteredMenus } from "@/lib/services/menuService";
import { getUserInfo } from "@/lib/api/auth";

// Mock dependencies
jest.mock("@/lib/services/menuService");
jest.mock("@/lib/api/auth");

// Mock Next.js router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  usePathname: () => "/dashboard",
}));

describe("E2E: 主選單點擊與頁面切換", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該能夠點擊主選單項目並導航", async () => {
    const user = userEvent.setup();

    const menus = [
      {
        id: "basic-operations",
        label: "基本作業",
        items: [
          {
            id: "code-operations",
            label: "代碼作業",
            children: [
              {
                id: "basic-code-maintenance",
                label: "基本代碼維護",
                path: "/basic-operations/code/basic",
              },
            ],
          },
        ],
      },
    ];

    (getUserInfo as jest.Mock).mockReturnValue({
      id: "1",
      username: "admin",
      name: "管理員",
      roles: ["admin"],
      permissions: ["*"],
    });

    (getFilteredMenus as jest.Mock).mockReturnValue(menus);

    render(<MainMenu />);

    await waitFor(() => {
      expect(screen.getByText("基本作業")).toBeInTheDocument();
    });

    // 點擊主選單
    const menuButton = screen.getByText("基本作業");
    await user.click(menuButton);

    // 應該展開下拉選單
    await waitFor(() => {
      expect(screen.getByText("代碼作業")).toBeInTheDocument();
    });
  });

  it("應該能夠切換不同的主選單", async () => {
    const user = userEvent.setup();

    const menus = [
      {
        id: "basic-operations",
        label: "基本作業",
        items: [
          {
            id: "code-operations",
            label: "代碼作業",
            path: "/basic-operations/code",
          },
        ],
      },
      {
        id: "routine-operations",
        label: "例行作業",
        items: [
          {
            id: "customer-notification",
            label: "客戶工作通知單",
            path: "/routine-operations/customer-notification",
          },
        ],
      },
    ];

    (getUserInfo as jest.Mock).mockReturnValue({
      id: "1",
      username: "admin",
      name: "管理員",
      roles: ["admin"],
      permissions: ["*"],
    });

    (getFilteredMenus as jest.Mock).mockReturnValue(menus);

    render(<MainMenu />);

    await waitFor(() => {
      expect(screen.getByText("基本作業")).toBeInTheDocument();
      expect(screen.getByText("例行作業")).toBeInTheDocument();
    });

    // 點擊第一個選單
    const firstMenu = screen.getByText("基本作業");
    await user.click(firstMenu);

    await waitFor(() => {
      expect(screen.getByText("代碼作業")).toBeInTheDocument();
    });

    // 點擊第二個選單（應該關閉第一個，展開第二個）
    const secondMenu = screen.getByText("例行作業");
    await user.click(secondMenu);

    await waitFor(() => {
      expect(screen.getByText("客戶工作通知單")).toBeInTheDocument();
    });
  });
});

