import { render, screen } from "@testing-library/react";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("應該渲染所有項目", () => {
    const items: BreadcrumbItem[] = [
      { label: "首頁", href: "/" },
      { label: "基本作業", href: "/basic" },
      { label: "當前頁面" },
    ];

    render(<Breadcrumbs items={items} />);

    expect(screen.getByText("首頁")).toBeInTheDocument();
    expect(screen.getByText("基本作業")).toBeInTheDocument();
    expect(screen.getByText("當前頁面")).toBeInTheDocument();
  });

  it("應該顯示分隔符號", () => {
    const items: BreadcrumbItem[] = [
      { label: "首頁", href: "/" },
      { label: "當前頁面" },
    ];

    const { container } = render(<Breadcrumbs items={items} />);

    // 應該有分隔符號（SVG 圖示）
    const separators = container.querySelectorAll("svg");
    expect(separators.length).toBeGreaterThan(0);
  });

  it("最後一項不應該有連結", () => {
    const items: BreadcrumbItem[] = [
      { label: "首頁", href: "/" },
      { label: "當前頁面" },
    ];

    render(<Breadcrumbs items={items} />);

    const lastItem = screen.getByText("當前頁面");
    expect(lastItem.tagName).not.toBe("A");
  });

  it("空陣列時不應該渲染", () => {
    const { container } = render(<Breadcrumbs items={[]} />);

    expect(container.firstChild).toBeNull();
  });
});

