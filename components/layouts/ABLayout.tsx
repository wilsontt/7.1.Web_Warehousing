"use client";

import { ReactNode } from "react";

interface ABLayoutProps {
  children: ReactNode;
  header?: ReactNode; // A 區：頂部導覽列
}

/**
 * A/B Layout 框架
 * 
 * A 區：頂部導覽列（position: sticky，固定於頁面頂端）
 * B 區：主要內容區（佔據 A 區下方的所有空間）
 * 
 * 符合規格：2.1 全域 UI 框架
 */
export default function ABLayout({ children, header }: ABLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* A 區：頂部導覽列 */}
      {header && (
        <header className="sticky top-0 z-50 flex-shrink-0">
          {header}
        </header>
      )}

      {/* B 區：主要內容區 */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

