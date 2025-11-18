import { render, screen } from "@testing-library/react";
import ABLayout from "@/components/layouts/ABLayout";

describe("ABLayout", () => {
  it("應該渲染子元件", () => {
    render(
      <ABLayout>
        <div>測試內容</div>
      </ABLayout>
    );

    expect(screen.getByText("測試內容")).toBeInTheDocument();
  });

  it("應該渲染 header（A 區）", () => {
    render(
      <ABLayout header={<div>頂部導覽列</div>}>
        <div>主要內容</div>
      </ABLayout>
    );

    expect(screen.getByText("頂部導覽列")).toBeInTheDocument();
    expect(screen.getByText("主要內容")).toBeInTheDocument();
  });

  it("header 應該有 sticky 樣式", () => {
    const { container } = render(
      <ABLayout header={<div>頂部導覽列</div>}>
        <div>主要內容</div>
      </ABLayout>
    );

    const header = container.querySelector("header");
    expect(header).toHaveClass("sticky", "top-0", "z-50");
  });

  it("main 應該有 flex-1 和 overflow-auto 樣式", () => {
    const { container } = render(
      <ABLayout>
        <div>主要內容</div>
      </ABLayout>
    );

    const main = container.querySelector("main");
    expect(main).toHaveClass("flex-1", "overflow-auto");
  });
});

