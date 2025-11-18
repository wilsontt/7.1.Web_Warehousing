"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface ResizableLayoutProps {
  leftPanel: ReactNode; // B1 左側列表
  rightPanel: ReactNode; // B2 右側詳細區
  defaultLeftSize?: number; // 預設左側寬度百分比（預設 25%）
  minLeftSize?: number; // 最小左側寬度百分比（預設 18%）
  maxLeftSize?: number; // 最大左側寬度百分比（預設 30%）
}

/**
 * ResizableLayout 元件
 * 
 * 符合規格：2.1 全域 UI 框架（B 區 Master-Detail 佈局）
 * - B1 左側列表：預設寬 25%，min 18%，max 30%，可拖曳調整
 * - B2 右側詳細區：佔據剩餘空間
 * - 支援響應式佈局（平板模式）
 */
export default function ResizableLayout({
  leftPanel,
  rightPanel,
  defaultLeftSize = 25,
  minLeftSize = 18,
  maxLeftSize = 30,
}: ResizableLayoutProps) {
  const [leftSize, setLeftSize] = useState(defaultLeftSize);
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartSize = useRef<number>(defaultLeftSize);

  // 開始拖曳調整
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartSize.current = leftSize;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  // 拖曳中
  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !isResizing) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - resizeStartX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;
    const newSize = resizeStartSize.current + deltaPercent;

    // 限制在 min 和 max 之間
    const clampedSize = Math.max(minLeftSize, Math.min(maxLeftSize, newSize));
    setLeftSize(clampedSize);
  };

  // 結束拖曳
  const handleMouseUp = () => {
    setIsResizing(false);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  // 清理事件監聽器
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex h-full w-full overflow-hidden"
    >
      {/* B1 左側列表 */}
      <div
        className="flex-shrink-0 overflow-auto border-r border-gray-200 dark:border-gray-700 transition-colors duration-300"
        style={{ width: `${leftSize}%` }}
      >
        {leftPanel}
      </div>

      {/* 拖曳手把 */}
      <div
        className="
          w-1
          bg-gray-200 dark:bg-gray-700
          hover:bg-primary-500 dark:hover:bg-primary-400
          cursor-col-resize
          transition-colors duration-200
          flex-shrink-0
          relative
          group
        "
        onMouseDown={handleMouseDown}
      >
        {/* 拖曳指示器 */}
        <div className="
          absolute
          inset-y-0
          left-1/2
          -translate-x-1/2
          w-1
          bg-primary-500 dark:bg-primary-400
          opacity-0
          group-hover:opacity-100
          transition-opacity duration-200
        " />
      </div>

      {/* B2 右側詳細區 */}
      <div className="flex-1 overflow-auto">
        {rightPanel}
      </div>
    </div>
  );
}

