"use client";

/**
 * Master-Detail 頁面標準模板
 * 
 * 符合規格：2.1 全域 UI 框架、2.6 左側邊欄標準化計畫
 * 
 * 使用方式：
 * 1. 複製此檔案到你的頁面目錄
 * 2. 根據實際需求修改資料結構和 API 呼叫
 * 3. 實作表單驗證和提交邏輯
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ResizableLayout from "@/components/layouts/ResizableLayout";
import DataTable, { type Column } from "@/components/data/DataTable";
import Toolbar, { type ToolbarButton, STANDARD_TOOLBAR_BUTTONS } from "@/components/toolbar/Toolbar";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/navigation/Breadcrumbs";
import StatusBar from "@/components/status/StatusBar";

// 範例資料結構
interface ExampleData {
  id: string;
  code: string;
  name: string;
  status: "啟用" | "停用";
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
}

// 表單驗證 Schema（使用 Zod）
const formSchema = z.object({
  code: z.string().min(1, "代碼為必填欄位"),
  name: z.string().min(1, "名稱為必填欄位"),
  status: z.enum(["啟用", "停用"]),
});

type FormData = z.infer<typeof formSchema>;

export default function MasterDetailPageTemplate() {
  // 狀態管理
  const [data, setData] = useState<ExampleData[]>([]);
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // React Hook Form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      status: "啟用",
    },
  });

  // 載入資料（範例）
  useEffect(() => {
    // TODO: 替換為實際 API 呼叫
    const loadData = async () => {
      setIsLoading(true);
      try {
        // const response = await fetch("/api/example");
        // const result = await response.json();
        // setData(result);
        
        // 範例資料
        setData([
          { id: "1", code: "001", name: "範例項目 1", status: "啟用" },
          { id: "2", code: "002", name: "範例項目 2", status: "停用" },
        ]);
      } catch (error) {
        console.error("載入資料失敗:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // DataTable 欄位定義
  const columns: Column<ExampleData>[] = [
    {
      key: "code",
      label: "代碼",
      sortable: true,
    },
    {
      key: "name",
      label: "名稱",
      sortable: true,
    },
    {
      key: "status",
      label: "狀態",
      render: (value) => (
        <span
          className={
            value === "啟用"
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }
        >
          {value}
        </span>
      ),
    },
  ];

  // 處理列選取
  const handleRowClick = (row: ExampleData, index: number) => {
    setSelectedRowIndex(index);
    setIsEditMode(false);
    // 載入選取資料到表單
    reset({
      code: row.code,
      name: row.name,
      status: row.status,
    });
  };

  // 處理表單提交
  const onSubmit = async (formData: FormData) => {
    try {
      if (isEditMode) {
        // TODO: 更新 API
        // await updateData(selectedRowIndex, formData);
        console.log("更新資料:", formData);
      } else {
        // TODO: 新增 API
        // await createData(formData);
        console.log("新增資料:", formData);
      }
      // 重新載入資料
      // await loadData();
    } catch (error) {
      console.error("儲存失敗:", error);
    }
  };

  // Toolbar 按鈕定義
  const toolbarButtons: ToolbarButton[] = [
    {
      id: STANDARD_TOOLBAR_BUTTONS.QUERY,
      label: "查詢",
      onClick: () => {
        // TODO: 切換搜尋/篩選面板
        console.log("查詢");
      },
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.ADD,
      label: "新增",
      onClick: () => {
        reset({ code: "", name: "", status: "啟用" });
        setIsEditMode(false);
        setSelectedRowIndex(null);
      },
      variant: "primary",
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.EDIT,
      label: "修改",
      onClick: () => {
        setIsEditMode(true);
      },
      disabled: selectedRowIndex === null,
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.DELETE,
      label: "刪除",
      onClick: async () => {
        if (selectedRowIndex !== null && confirm("確定要刪除嗎？")) {
          // TODO: 刪除 API
          // await deleteData(data[selectedRowIndex].id);
          console.log("刪除資料");
        }
      },
      variant: "danger",
      disabled: selectedRowIndex === null,
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.CONFIRM,
      label: "確認",
      onClick: handleSubmit(onSubmit),
      variant: "primary",
      disabled: !isEditMode && selectedRowIndex === null,
    },
    {
      id: STANDARD_TOOLBAR_BUTTONS.CANCEL,
      label: "取消",
      onClick: () => {
        reset();
        setIsEditMode(false);
      },
      disabled: !isEditMode && selectedRowIndex === null,
    },
  ];

  // Breadcrumbs 定義
  const breadcrumbs: BreadcrumbItem[] = [
    { label: "基本作業", href: "/basic-operations" },
    { label: "範例功能", href: "/basic-operations/example" },
    { label: "範例頁面" }, // 當前頁面
  ];

  // 取得選取的資料（用於狀態列）
  const selectedData = selectedRowIndex !== null ? data[selectedRowIndex] : null;

  return (
    <ResizableLayout
      leftPanel={
        <div className="h-full flex flex-col">
          {/* 搜尋/篩選區 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <input
              type="text"
              placeholder="搜尋..."
              className="w-40 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* 資料列表 */}
          <div className="flex-1 overflow-auto">
            <DataTable
              data={data}
              columns={columns}
              selectedRowIndex={selectedRowIndex}
              onRowClick={handleRowClick}
              searchable={false} // 已在左側面板提供搜尋框
            />
          </div>
        </div>
      }
      rightPanel={
        <div className="h-full flex flex-col">
          {/* B2-1 工具列 */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <Breadcrumbs items={breadcrumbs} />
            <Toolbar buttons={toolbarButtons} />
          </div>

          {/* B2-2 資料內容區 */}
          <div className="flex-1 overflow-auto p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  代碼 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("code")}
                  type="text"
                  disabled={!isEditMode && selectedRowIndex === null}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.code.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  名稱 <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  disabled={!isEditMode && selectedRowIndex === null}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  狀態
                </label>
                <select
                  {...register("status")}
                  disabled={!isEditMode && selectedRowIndex === null}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-button bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:bg-gray-100 dark:disabled:bg-gray-800"
                >
                  <option value="啟用">啟用</option>
                  <option value="停用">停用</option>
                </select>
              </div>
            </form>
          </div>

          {/* 狀態列 */}
          {selectedData && (
            <StatusBar
              createdBy={selectedData.createdBy}
              createdAt={selectedData.createdAt}
              updatedBy={selectedData.updatedBy}
              updatedAt={selectedData.updatedAt}
            />
          )}
        </div>
      }
    />
  );
}

