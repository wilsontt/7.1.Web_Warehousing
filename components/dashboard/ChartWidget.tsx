"use client";

import type { ChartData } from "@/lib/mocks/dashboardMock";

interface ChartWidgetProps {
  data: ChartData;
}

/**
 * 長條圖趨勢 Widget
 * 
 * 符合規格：2.4 Dashboard
 * - 指定(客戶-部門-組別-成本中心)＋(日期範圍)＋(工作項目-工作原因) → 長條圖趨勢
 * 
 * 目前使用簡單的長條圖顯示，未來可整合 Chart.js 或 Recharts
 */
export default function ChartWidget({ data }: ChartWidgetProps) {
  const maxValue = Math.max(...data.values, 1);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        趨勢分析
      </h2>
      <div className="space-y-3">
        {data.labels.map((label, index) => {
          const value = data.values[index];
          const percentage = (value / maxValue) * 100;

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">{label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {value}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-primary-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

