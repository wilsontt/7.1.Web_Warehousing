import { render, screen, fireEvent } from "@testing-library/react";
import ResizableLayout from "@/components/layouts/ResizableLayout";

describe("ResizableLayout", () => {
  it("應該渲染左右面板", () => {
    render(
      <ResizableLayout
        leftPanel={<div>左側面板</div>}
        rightPanel={<div>右側面板</div>}
      />
    );

    expect(screen.getByText("左側面板")).toBeInTheDocument();
    expect(screen.getByText("右側面板")).toBeInTheDocument();
  });

  it("應該使用預設寬度 25%", () => {
    const { container } = render(
      <ResizableLayout
        leftPanel={<div>左側</div>}
        rightPanel={<div>右側</div>}
      />
    );

    const leftPanel = container.querySelector('[style*="width"]');
    expect(leftPanel).toHaveStyle({ width: "25%" });
  });

  it("應該使用自訂寬度", () => {
    const { container } = render(
      <ResizableLayout
        leftPanel={<div>左側</div>}
        rightPanel={<div>右側</div>}
        defaultLeftSize={30}
      />
    );

    const leftPanel = container.querySelector('[style*="width"]');
    expect(leftPanel).toHaveStyle({ width: "30%" });
  });

  it("應該顯示拖曳手把", () => {
    const { container } = render(
      <ResizableLayout
        leftPanel={<div>左側</div>}
        rightPanel={<div>右側</div>}
      />
    );

    const resizeHandle = container.querySelector('[class*="cursor-col-resize"]');
    expect(resizeHandle).toBeInTheDocument();
  });
});

