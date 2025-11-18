"use client";

import type { Top10Item } from "@/lib/mocks/dashboardMock";

interface Top10ListWidgetProps {
  title: string;
  data: Top10Item[];
}

/**
 * Top 10 列表 Widget
 * 
 * 符合規格：2.4 Dashboard
 * - 各倉庫依客戶統計逾時未銷毀數量 (Top 10 list)
 * - 依客戶統計存倉數量 (箱/件 Top 10 list)
 */
export default function Top10ListWidget({
  title,
  data,
}: Top10ListWidgetProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      <div className="space-y-2">
        {data.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded">
                {index + 1}
              </span>
              <span className="text-sm text-gray-900 dark:text-white">
                {item.name}
              </span>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {item.value.toLocaleString()} {item.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

