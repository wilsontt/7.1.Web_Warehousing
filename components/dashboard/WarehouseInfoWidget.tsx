"use client";

import type { WarehouseInfo } from "@/lib/mocks/dashboardMock";

interface WarehouseInfoWidgetProps {
  warehouses: WarehouseInfo[];
}

/**
 * 倉庫資訊 Widget
 * 
 * 符合規格：2.4 Dashboard
 * - 依角色顯示（一般使用者：所屬倉庫，管理者：全部倉庫）
 * - 各倉庫箱子可存放數量 / 已存放數量 / 借出數量
 * - 各倉庫今日工作狀態
 */
export default function WarehouseInfoWidget({
  warehouses,
}: WarehouseInfoWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        倉庫資訊
      </h2>
      <div className="space-y-4">
        {warehouses.map((warehouse) => (
          <div
            key={warehouse.id}
            className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {warehouse.name}
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded ${
                  warehouse.todayStatus === "正常"
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {warehouse.todayStatus}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-600 dark:text-gray-400">可存放</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {warehouse.capacity}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">已存放</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {warehouse.used}
                </p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-gray-400">借出</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {warehouse.borrowed}
                </p>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(warehouse.used / warehouse.capacity) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

