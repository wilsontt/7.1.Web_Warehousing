"use client";

import type { TaskOverview } from "@/lib/mocks/dashboardMock";

interface TaskOverviewWidgetProps {
  data: TaskOverview;
}

/**
 * 今日任務總覽 Widget
 * 
 * 符合規格：2.4 Dashboard
 * - 未完成單據數
 * - 待出貨數
 * - 待稽核數
 */
export default function TaskOverviewWidget({
  data,
}: TaskOverviewWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        今日任務總覽
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            未完成單據
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.incompleteOrders}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            待出貨數
          </span>
          <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {data.pendingShipments}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            待稽核數
          </span>
          <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
            {data.pendingAudits}
          </span>
        </div>
      </div>
    </div>
  );
}

