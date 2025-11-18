import { render, screen, fireEvent } from "@testing-library/react";
import Toolbar, { type ToolbarButton, STANDARD_TOOLBAR_BUTTONS } from "@/components/toolbar/Toolbar";

describe("Toolbar", () => {
  it("應該渲染所有按鈕", () => {
    const buttons: ToolbarButton[] = [
      { id: "btn1", label: "按鈕 1", onClick: jest.fn() },
      { id: "btn2", label: "按鈕 2", onClick: jest.fn() },
    ];

    render(<Toolbar buttons={buttons} />);

    expect(screen.getByText("按鈕 1")).toBeInTheDocument();
    expect(screen.getByText("按鈕 2")).toBeInTheDocument();
  });

  it("應該處理按鈕點擊", () => {
    const handleClick = jest.fn();
    const buttons: ToolbarButton[] = [
      { id: "btn1", label: "按鈕 1", onClick: handleClick },
    ];

    render(<Toolbar buttons={buttons} />);

    const button = screen.getByText("按鈕 1");
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("應該禁用按鈕", () => {
    const buttons: ToolbarButton[] = [
      { id: "btn1", label: "按鈕 1", onClick: jest.fn(), disabled: true },
    ];

    render(<Toolbar buttons={buttons} />);

    const button = screen.getByText("按鈕 1").closest("button");
    expect(button).toBeDisabled();
  });

  it("應該支援不同按鈕變體", () => {
    const buttons: ToolbarButton[] = [
      { id: "btn1", label: "主要", onClick: jest.fn(), variant: "primary" },
      { id: "btn2", label: "次要", onClick: jest.fn(), variant: "secondary" },
      { id: "btn3", label: "危險", onClick: jest.fn(), variant: "danger" },
    ];

    render(<Toolbar buttons={buttons} />);

    expect(screen.getByText("主要")).toBeInTheDocument();
    expect(screen.getByText("次要")).toBeInTheDocument();
    expect(screen.getByText("危險")).toBeInTheDocument();
  });
});

