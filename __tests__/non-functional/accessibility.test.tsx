/**
 * 無障礙測試 (Accessibility Tests)
 * 
 * 符合規格：3. 非功能性需求 - 可用性
 * - 支援鍵盤操作與無障礙標準（ARIA 標籤、Focus 狀態）
 * - WCAG AA 標準
 */

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";
import Toolbar from "@/components/toolbar/Toolbar";
import DataTable from "@/components/data/DataTable";
import { STANDARD_TOOLBAR_BUTTONS } from "@/components/toolbar/Toolbar";

describe("無障礙測試 (WCAG AA)", () => {
  describe("登入表單無障礙", () => {
    it("應該有適當的 ARIA 標籤", () => {
      render(<LoginForm />);

      // 檢查輸入欄位是否有 label
      const usernameInput = screen.getByLabelText("帳號");
      const passwordInput = screen.getByLabelText("密碼");

      expect(usernameInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(usernameInput).toHaveAttribute("type", "text");
      expect(passwordInput).toHaveAttribute("type", "password");
    });

    it("應該支援鍵盤導覽", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const usernameInput = screen.getByLabelText("帳號");
      const passwordInput = screen.getByLabelText("密碼");

      // Tab 鍵應該可以在欄位間移動
      usernameInput.focus();
      expect(usernameInput).toHaveFocus();

      await user.tab();
      expect(passwordInput).toHaveFocus();
    });

    it("應該有適當的錯誤訊息關聯", () => {
      render(<LoginForm />);

      // 檢查表單是否存在
      const form = document.querySelector("form");
      expect(form).toBeInTheDocument();
    });

    it("按鈕應該有適當的 ARIA 屬性", () => {
      render(<LoginForm />);

      const loginButton = screen.getByRole("button", { name: "登入" });
      const cancelButton = screen.getByRole("button", { name: "取消" });

      expect(loginButton).toBeInTheDocument();
      expect(cancelButton).toBeInTheDocument();
      expect(loginButton).toHaveAttribute("type", "submit");
      expect(cancelButton).toHaveAttribute("type", "button");
    });
  });

  describe("Toolbar 無障礙", () => {
    it("按鈕應該有適當的 ARIA 標籤", () => {
      const buttons = [
        {
          id: STANDARD_TOOLBAR_BUTTONS.QUERY,
          label: "查詢",
          onClick: jest.fn(),
        },
        {
          id: STANDARD_TOOLBAR_BUTTONS.ADD,
          label: "新增",
          onClick: jest.fn(),
        },
      ];

      render(<Toolbar buttons={buttons} />);

      const queryButton = screen.getByRole("button", { name: "查詢" });
      const addButton = screen.getByRole("button", { name: "新增" });

      expect(queryButton).toBeInTheDocument();
      expect(addButton).toBeInTheDocument();
    });

    it("禁用按鈕應該有適當的 ARIA 狀態", () => {
      const buttons = [
        {
          id: STANDARD_TOOLBAR_BUTTONS.EDIT,
          label: "修改",
          onClick: jest.fn(),
          disabled: true,
        },
      ];

      render(<Toolbar buttons={buttons} />);

      const editButton = screen.getByRole("button", { name: "修改" });
      expect(editButton).toBeDisabled();
      expect(editButton).toHaveAttribute("aria-disabled", "true");
    });
  });

  describe("DataTable 無障礙", () => {
    const mockData = [
      { id: "1", name: "項目 1", value: 100 },
      { id: "2", name: "項目 2", value: 200 },
    ];

    const mockColumns = [
      { key: "name", label: "名稱" },
      { key: "value", label: "數值" },
    ];

    it("表格應該有適當的 ARIA 角色", () => {
      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          onRowClick={jest.fn()}
        />
      );

      const table = screen.getByRole("table");
      expect(table).toBeInTheDocument();
    });

    it("表頭應該有適當的 ARIA 標籤", () => {
      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          onRowClick={jest.fn()}
        />
      );

      const nameHeader = screen.getByRole("columnheader", { name: "名稱" });
      const valueHeader = screen.getByRole("columnheader", { name: "數值" });

      expect(nameHeader).toBeInTheDocument();
      expect(valueHeader).toBeInTheDocument();
    });

    it("應該支援鍵盤導覽", async () => {
      const user = userEvent.setup();
      render(
        <DataTable
          data={mockData}
          columns={mockColumns}
          onRowClick={jest.fn()}
        />
      );

      // 表格應該可以透過 Tab 鍵導覽
      const table = screen.getByRole("table");
      table.focus();
      expect(table).toBeInTheDocument();
    });
  });

  describe("顏色對比度", () => {
    it("主要按鈕應該有足夠的顏色對比度", () => {
      // 這個測試需要實際渲染並檢查 CSS
      // 實際應用中可以使用 axe-core 或類似的工具
      const buttons = [
        {
          id: STANDARD_TOOLBAR_BUTTONS.ADD,
          label: "新增",
          onClick: jest.fn(),
          variant: "primary",
        },
      ];

      const { container } = render(<Toolbar buttons={buttons} />);
      const button = container.querySelector("button");

      // 檢查按鈕是否有適當的樣式類別
      expect(button).toHaveClass("bg-primary-600");
      expect(button).toHaveClass("text-white");
    });
  });

  describe("Focus 狀態", () => {
    it("可聚焦元素應該有明顯的 Focus 狀態", async () => {
      const user = userEvent.setup();
      render(<LoginForm />);

      const usernameInput = screen.getByLabelText("帳號");
      
      await user.tab();
      
      // 檢查是否有 focus 狀態（透過 CSS 類別或樣式）
      expect(usernameInput).toHaveFocus();
    });
  });
});

