"use client";

import { useState, useRef, useEffect, ReactNode } from "react";

interface ThreeColumnLayoutProps {
  leftPanel: ReactNode; // B1 左側列表（大分類）
  middlePanel: ReactNode; // B2 中間列表（中分類）
  rightPanel: ReactNode; // B3 右側列表（細分類）
  defaultLeftSize?: number; // 預設左側寬度百分比（預設 22%）
  defaultMiddleSize?: number; // 預設中間寬度百分比（預設 39%）
  minSize?: number; // 最小寬度百分比（預設 18%）
  maxSize?: number; // 最大寬度百分比（預設 35%）
}

/**
 * ThreeColumnLayout 元件
 * 
 * 符合規格：3.1 UI 佈局 – 三欄式連動介面
 * - B1 左側列表：預設寬 22%，min 18%，max 35%，可拖曳調整
 * - B2 中間列表：預設寬 39%，可拖曳調整
 * - B3 右側列表：預設寬 39%，佔據剩餘空間
 * - 支援兩個拖曳手把（B1-B2 之間，B2-B3 之間）
 * - 支援響應式佈局
 */
export default function ThreeColumnLayout({
  leftPanel,
  middlePanel,
  rightPanel,
  defaultLeftSize = 22,
  defaultMiddleSize = 39,
  minSize = 18,
  maxSize = 35,
}: ThreeColumnLayoutProps) {
  const [leftSize, setLeftSize] = useState(defaultLeftSize);
  const [middleSize, setMiddleSize] = useState(defaultMiddleSize);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeStartX = useRef<number>(0);
  const resizeStartLeftSize = useRef<number>(defaultLeftSize);
  const resizeStartMiddleSize = useRef<number>(defaultMiddleSize);

  // 計算右側寬度（剩餘空間）
  const rightSize = 100 - leftSize - middleSize;

  // 開始拖曳左側手把（B1-B2 之間）
  const handleLeftMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingLeft(true);
    resizeStartX.current = e.clientX;
    resizeStartLeftSize.current = leftSize;
    document.addEventListener("mousemove", handleLeftMouseMove);
    document.addEventListener("mouseup", handleLeftMouseUp);
  };

  // 拖曳左側手把中
  const handleLeftMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !isResizingLeft) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - resizeStartX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;
    const newLeftSize = resizeStartLeftSize.current + deltaPercent;

    // 限制在 min 和 max 之間
    const clampedLeftSize = Math.max(minSize, Math.min(maxSize, newLeftSize));
    
    // 確保中間欄位不會太小（至少保留 20%）
    const minMiddleSize = 20;
    const maxLeftSize = 100 - minMiddleSize - (100 - leftSize - middleSize);
    const finalLeftSize = Math.min(clampedLeftSize, maxLeftSize);
    
    setLeftSize(finalLeftSize);
  };

  // 結束拖曳左側手把
  const handleLeftMouseUp = () => {
    setIsResizingLeft(false);
    document.removeEventListener("mousemove", handleLeftMouseMove);
    document.removeEventListener("mouseup", handleLeftMouseUp);
  };

  // 開始拖曳右側手把（B2-B3 之間）
  const handleRightMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizingRight(true);
    resizeStartX.current = e.clientX;
    resizeStartMiddleSize.current = middleSize;
    document.addEventListener("mousemove", handleRightMouseMove);
    document.addEventListener("mouseup", handleRightMouseUp);
  };

  // 拖曳右側手把中
  const handleRightMouseMove = (e: MouseEvent) => {
    if (!containerRef.current || !isResizingRight) return;

    const containerWidth = containerRef.current.offsetWidth;
    const deltaX = e.clientX - resizeStartX.current;
    const deltaPercent = (deltaX / containerWidth) * 100;
    const newMiddleSize = resizeStartMiddleSize.current + deltaPercent;

    // 確保中間欄位不會太小（至少保留 20%）
    const minMiddleSize = 20;
    const clampedMiddleSize = Math.max(minMiddleSize, newMiddleSize);
    
    // 確保右側欄位不會太小（至少保留 20%）
    const minRightSize = 20;
    const maxMiddleSize = 100 - leftSize - minRightSize;
    const finalMiddleSize = Math.min(clampedMiddleSize, maxMiddleSize);
    
    setMiddleSize(finalMiddleSize);
  };

  // 結束拖曳右側手把
  const handleRightMouseUp = () => {
    setIsResizingRight(false);
    document.removeEventListener("mousemove", handleRightMouseMove);
    document.removeEventListener("mouseup", handleRightMouseUp);
  };

  // 清理事件監聽器
  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleLeftMouseMove);
      document.removeEventListener("mouseup", handleLeftMouseUp);
      document.removeEventListener("mousemove", handleRightMouseMove);
      document.removeEventListener("mouseup", handleRightMouseUp);
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
        className="flex-shrink-0 overflow-hidden border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 bg-white dark:bg-gray-900"
        style={{ width: `${leftSize}%` }}
      >
        {leftPanel}
      </div>

      {/* 左側拖曳手把（B1-B2 之間） */}
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
        onMouseDown={handleLeftMouseDown}
      >
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

      {/* B2 中間列表 */}
      <div
        className="flex-shrink-0 overflow-hidden border-r border-gray-200 dark:border-gray-700 transition-colors duration-300 bg-white dark:bg-gray-900"
        style={{ width: `${middleSize}%` }}
      >
        {middlePanel}
      </div>

      {/* 右側拖曳手把（B2-B3 之間） */}
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
        onMouseDown={handleRightMouseDown}
      >
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

      {/* B3 右側列表 */}
      <div className="flex-1 overflow-hidden bg-white dark:bg-gray-900">
        {rightPanel}
      </div>
    </div>
  );
}

