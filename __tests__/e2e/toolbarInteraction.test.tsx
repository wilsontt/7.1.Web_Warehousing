import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Toolbar, { type ToolbarButton, STANDARD_TOOLBAR_BUTTONS } from "@/components/toolbar/Toolbar";
import StatusBar from "@/components/status/StatusBar";

describe("E2E: Toolbar 按鈕互動測試", () => {
  it("應該處理 Toolbar 按鈕點擊互動", async () => {
    const user = userEvent.setup();
    const handleQuery = jest.fn();
    const handleAdd = jest.fn();
    const handleEdit = jest.fn();
    const handleDelete = jest.fn();

    const buttons: ToolbarButton[] = [
      {
        id: STANDARD_TOOLBAR_BUTTONS.QUERY,
        label: "查詢",
        onClick: handleQuery,
      },
      {
        id: STANDARD_TOOLBAR_BUTTONS.ADD,
        label: "新增",
        onClick: handleAdd,
        variant: "primary",
      },
      {
        id: STANDARD_TOOLBAR_BUTTONS.EDIT,
        label: "修改",
        onClick: handleEdit,
        disabled: false,
      },
      {
        id: STANDARD_TOOLBAR_BUTTONS.DELETE,
        label: "刪除",
        onClick: handleDelete,
        variant: "danger",
        disabled: false,
      },
    ];

    render(<Toolbar buttons={buttons} />);

    // 點擊查詢按鈕
    const queryButton = screen.getByText("查詢");
    await user.click(queryButton);
    expect(handleQuery).toHaveBeenCalledTimes(1);

    // 點擊新增按鈕
    const addButton = screen.getByText("新增");
    await user.click(addButton);
    expect(handleAdd).toHaveBeenCalledTimes(1);

    // 點擊修改按鈕
    const editButton = screen.getByText("修改");
    await user.click(editButton);
    expect(handleEdit).toHaveBeenCalledTimes(1);

    // 點擊刪除按鈕
    const deleteButton = screen.getByText("刪除");
    await user.click(deleteButton);
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it("應該根據狀態動態啟用/禁用按鈕", () => {
    const buttons: ToolbarButton[] = [
      {
        id: STANDARD_TOOLBAR_BUTTONS.ADD,
        label: "新增",
        onClick: jest.fn(),
        variant: "primary",
      },
      {
        id: STANDARD_TOOLBAR_BUTTONS.EDIT,
        label: "修改",
        onClick: jest.fn(),
        disabled: true, // 沒有選取資料時禁用
      },
      {
        id: STANDARD_TOOLBAR_BUTTONS.DELETE,
        label: "刪除",
        onClick: jest.fn(),
        variant: "danger",
        disabled: true, // 沒有選取資料時禁用
      },
    ];

    render(<Toolbar buttons={buttons} />);

    const addButton = screen.getByText("新增").closest("button");
    const editButton = screen.getByText("修改").closest("button");
    const deleteButton = screen.getByText("刪除").closest("button");

    expect(addButton).not.toBeDisabled();
    expect(editButton).toBeDisabled();
    expect(deleteButton).toBeDisabled();
  });
});

describe("E2E: 狀態列顯示測試", () => {
  it("應該正確顯示狀態列資訊", () => {
    render(
      <StatusBar
        createdBy="張三"
        createdAt="2025/11/15 10:30:00"
        updatedBy="李四"
        updatedAt="2025/11/15 14:20:00"
      />
    );

    const { container } = render(
      <StatusBar
        createdBy="張三"
        createdAt="2025/11/15 10:30:00"
        updatedBy="李四"
        updatedAt="2025/11/15 14:20:00"
      />
    );

    expect(container.textContent).toContain("新增人員：");
    expect(container.textContent).toContain("張三");
    expect(container.textContent).toContain("上次修改：");
    expect(container.textContent).toContain("李四");
    expect(container.textContent).toContain("2025/11/15 10:30:00");
    expect(container.textContent).toContain("2025/11/15 14:20:00");
  });

  it("應該在沒有資料時顯示預設訊息", () => {
    render(<StatusBar />);

    expect(screen.getByText("無新增記錄")).toBeInTheDocument();
    expect(screen.getByText("無修改記錄")).toBeInTheDocument();
  });
});

