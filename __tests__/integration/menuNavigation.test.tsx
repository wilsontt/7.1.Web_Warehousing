import { render, screen, waitFor } from "@testing-library/react";
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

describe("主選單導覽整合測試", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("應該根據使用者角色顯示對應的選單", async () => {
    const adminMenus = [
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
      {
        id: "system-administration",
        label: "系統管理作業",
        items: [],
      },
    ];

    (getUserInfo as jest.Mock).mockReturnValue({
      id: "1",
      username: "admin",
      name: "管理員",
      roles: ["admin"],
      permissions: ["*"],
    });

    (getFilteredMenus as jest.Mock).mockReturnValue(adminMenus);

    render(<MainMenu />);

    await waitFor(() => {
      expect(screen.getByText("基本作業")).toBeInTheDocument();
      expect(screen.getByText("系統管理作業")).toBeInTheDocument();
    });
  });

  it("一般使用者不應該看到系統管理選單", async () => {
    const userMenus = [
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
      id: "2",
      username: "user",
      name: "一般使用者",
      roles: ["user"],
      permissions: ["basic-operations"],
    });

    (getFilteredMenus as jest.Mock).mockReturnValue(userMenus);

    render(<MainMenu />);

    await waitFor(() => {
      expect(screen.getByText("基本作業")).toBeInTheDocument();
      expect(screen.queryByText("系統管理作業")).not.toBeInTheDocument();
    });
  });

  it("應該保持選單狀態（展開/收合）", async () => {
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

    // 點擊選單應該展開下拉選單
    const menuButton = screen.getByText("基本作業");
    menuButton.click();

    await waitFor(() => {
      expect(screen.getByText("代碼作業")).toBeInTheDocument();
    });
  });
});

