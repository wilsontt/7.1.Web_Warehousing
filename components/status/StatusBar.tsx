"use client";

interface StatusBarProps {
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  className?: string;
}

/**
 * 狀態列元件
 * 
 * 符合規格：2.2 共用元件與資料表格行為
 * - 左右兩邊顯示：
 *   - 左側：新增人員：[姓名] YYYY/MM/DD HH:MM:SS
 *   - 右側：上次修改：[姓名] YYYY/MM/DD HH:MM:SS
 * - 支援深色模式
 */
export default function StatusBar({
  createdBy,
  createdAt,
  updatedBy,
  updatedAt,
  className = "",
}: StatusBarProps) {
  const formatDateTime = (dateTime?: string) => {
    if (!dateTime) return "";
    try {
      const date = new Date(dateTime);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
    } catch {
      return dateTime;
    }
  };

  return (
    <div
      className={`
        flex items-center justify-between
        px-4 py-2
        border-t border-gray-200 dark:border-gray-700
        bg-gray-50 dark:bg-gray-800
        text-xs text-gray-600 dark:text-gray-400
        ${className}
      `}
    >
      {/* 左側：新增人員 */}
      <div>
        {createdBy && createdAt ? (
          <span>
            新增人員：<span className="font-medium">{createdBy}</span>{" "}
            {formatDateTime(createdAt)}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">無新增記錄</span>
        )}
      </div>

      {/* 右側：上次修改 */}
      <div>
        {updatedBy && updatedAt ? (
          <span>
            上次修改：<span className="font-medium">{updatedBy}</span>{" "}
            {formatDateTime(updatedAt)}
          </span>
        ) : (
          <span className="text-gray-400 dark:text-gray-500">無修改記錄</span>
        )}
      </div>
    </div>
  );
}

