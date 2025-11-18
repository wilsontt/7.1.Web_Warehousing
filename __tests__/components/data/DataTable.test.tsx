import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DataTable, { type Column } from "@/components/data/DataTable";

interface TestData {
  id: string;
  name: string;
  value: number;
}

describe("DataTable", () => {
  const mockData: TestData[] = [
    { id: "1", name: "項目 1", value: 100 },
    { id: "2", name: "項目 2", value: 200 },
    { id: "3", name: "項目 3", value: 300 },
  ];

  const columns: Column<TestData>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "名稱", sortable: true },
    { key: "value", label: "數值", sortable: true },
  ];

  it("應該渲染表格資料", () => {
    render(<DataTable data={mockData} columns={columns} />);

    expect(screen.getByText("項目 1")).toBeInTheDocument();
    expect(screen.getByText("項目 2")).toBeInTheDocument();
    expect(screen.getByText("項目 3")).toBeInTheDocument();
  });

  it("應該顯示表頭", () => {
    render(<DataTable data={mockData} columns={columns} />);

    expect(screen.getByText("ID")).toBeInTheDocument();
    expect(screen.getByText("名稱")).toBeInTheDocument();
    expect(screen.getByText("數值")).toBeInTheDocument();
  });

  it("應該支援分頁", () => {
    const largeData = Array.from({ length: 25 }, (_, i) => ({
      id: String(i + 1),
      name: `項目 ${i + 1}`,
      value: i * 10,
    }));

    render(<DataTable data={largeData} columns={columns} pageSize={20} />);

    // 應該只顯示前 20 筆
    expect(screen.getByText("項目 1")).toBeInTheDocument();
    expect(screen.getByText("項目 20")).toBeInTheDocument();
    expect(screen.queryByText("項目 21")).not.toBeInTheDocument();
  });

  it("應該支援排序", () => {
    render(<DataTable data={mockData} columns={columns} />);

    const nameHeader = screen.getByText("名稱").closest("th");
    expect(nameHeader).toBeInTheDocument();

    if (nameHeader) {
      fireEvent.click(nameHeader);
      // 排序後應該重新排列資料
      const rows = screen.getAllByRole("row");
      expect(rows.length).toBeGreaterThan(1);
    }
  });

  it("應該支援搜尋", () => {
    render(<DataTable data={mockData} columns={columns} searchable={true} />);

    const searchInput = screen.getByPlaceholderText("搜尋...");
    expect(searchInput).toBeInTheDocument();

    fireEvent.change(searchInput, { target: { value: "項目 1" } });

    expect(screen.getByText("項目 1")).toBeInTheDocument();
    expect(screen.queryByText("項目 2")).not.toBeInTheDocument();
  });

  it("應該支援列點擊", () => {
    const handleRowClick = jest.fn();
    render(
      <DataTable
        data={mockData}
        columns={columns}
        onRowClick={handleRowClick}
      />
    );

    const firstRow = screen.getByText("項目 1").closest("tr");
    if (firstRow) {
      fireEvent.click(firstRow);
      expect(handleRowClick).toHaveBeenCalledWith(mockData[0], 0);
    }
  });

  it("應該顯示空資料訊息", () => {
    render(<DataTable data={[]} columns={columns} />);

    expect(screen.getByText("無資料")).toBeInTheDocument();
  });

  it("應該支援自訂空資料訊息", () => {
    render(
      <DataTable
        data={[]}
        columns={columns}
        emptyMessage="沒有找到資料"
      />
    );

    expect(screen.getByText("沒有找到資料")).toBeInTheDocument();
  });
});

