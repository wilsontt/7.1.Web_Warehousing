"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "@/lib/api/dashboard";
import type { DashboardData } from "@/lib/mocks/dashboardMock";
import TaskOverviewWidget from "@/components/dashboard/TaskOverviewWidget";
import WarehouseInventoryWidget from "@/components/dashboard/WarehouseInventoryWidget";
import NotificationsWidget from "@/components/dashboard/NotificationsWidget";
import WarehouseInfoWidget from "@/components/dashboard/WarehouseInfoWidget";
import VehicleStatusWidget from "@/components/dashboard/VehicleStatusWidget";
import Top10ListWidget from "@/components/dashboard/Top10ListWidget";
import ChartWidget from "@/components/dashboard/ChartWidget";

/**
 * Dashboard 頁面
 * 
 * 符合規格：2.4 Dashboard
 * - 上半部：今日任務總覽、倉庫即時庫存概況、最新通知
 * - 下半部：倉庫資訊、車輛派送狀況、Top 10 列表、長條圖趨勢
 */
export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        setData(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "載入資料失敗");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600 dark:text-red-400">錯誤：{error}</div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      {/* 上半部：三個主要 Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <TaskOverviewWidget data={data.taskOverview} />
        <WarehouseInventoryWidget data={data.warehouseInventory} />
        <NotificationsWidget data={data.notifications} />
      </div>

      {/* 下半部：詳細資訊 Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左側欄 */}
        <div className="space-y-6">
          <WarehouseInfoWidget warehouses={data.warehouses} />
          <VehicleStatusWidget vehicles={data.vehicleStatuses} />
        </div>

        {/* 右側欄 */}
        <div className="space-y-6">
          <Top10ListWidget
            title="逾時未銷毀數量 Top 10"
            data={data.top10Overdue}
          />
          <Top10ListWidget
            title="存倉數量 Top 10"
            data={data.top10Storage}
          />
          <ChartWidget data={data.chartData} />
        </div>
      </div>
    </div>
  );
}
