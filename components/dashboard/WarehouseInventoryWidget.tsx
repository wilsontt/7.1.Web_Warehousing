"use client";

import type { WarehouseInventory } from "@/lib/mocks/dashboardMock";

interface WarehouseInventoryWidgetProps {
  data: WarehouseInventory;
}

/**
 * 倉庫即時庫存概況 Widget
 * 
 * 符合規格：2.4 Dashboard
 * - 總箱數
 * - 使用率
 * - 異常數
 */
export default function WarehouseInventoryWidget({
  data,
}: WarehouseInventoryWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        倉庫即時庫存概況
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            總箱數
          </span>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {data.totalBoxes.toLocaleString()}
          </span>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              使用率
            </span>
            <span className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.usageRate}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-primary-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${data.usageRate}%` }}
            />
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            異常數
          </span>
          <span
            className={`text-2xl font-bold ${
              data.abnormalCount > 0
                ? "text-red-600 dark:text-red-400"
                : "text-gray-900 dark:text-white"
            }`}
          >
            {data.abnormalCount}
          </span>
        </div>
      </div>
    </div>
  );
}

