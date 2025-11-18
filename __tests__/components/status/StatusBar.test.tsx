import { render, screen } from "@testing-library/react";
import StatusBar from "@/components/status/StatusBar";

describe("StatusBar", () => {
  it("應該顯示新增和修改資訊", () => {
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

  it("應該處理 ISO 格式日期", () => {
    const { container } = render(
      <StatusBar
        createdBy="張三"
        createdAt="2025-11-15T10:30:00.000Z"
        updatedBy="李四"
        updatedAt="2025-11-15T14:20:00.000Z"
      />
    );

    expect(container.textContent).toContain("新增人員：");
    expect(container.textContent).toContain("張三");
    expect(container.textContent).toContain("上次修改：");
    expect(container.textContent).toContain("李四");
  });

  it("沒有資料時應該顯示預設訊息", () => {
    render(<StatusBar />);

    expect(screen.getByText("無新增記錄")).toBeInTheDocument();
    expect(screen.getByText("無修改記錄")).toBeInTheDocument();
  });

  it("應該只顯示新增資訊", () => {
    const { container } = render(
      <StatusBar
        createdBy="張三"
        createdAt="2025/11/15 10:30:00"
      />
    );

    expect(container.textContent).toContain("新增人員：");
    expect(container.textContent).toContain("張三");
    expect(screen.getByText("無修改記錄")).toBeInTheDocument();
  });
});

