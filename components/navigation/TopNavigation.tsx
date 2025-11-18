"use client";

import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "./LanguageSelector";
import UserMenu from "./UserMenu";
import MainMenu from "./MainMenu";
import ThemeToggle from "@/components/ThemeToggle";

/**
 * 頂部導覽列 (A 區)
 * 
 * 符合規格：2.1 全域 UI 框架
 * - 左側：品牌 Logo + 系統名稱
 * - 中間：主選單（直向展開下拉選單）
 * - 右側：語系選擇 + 使用者下拉選單 + 題示的主題切換
 */
export default function TopNavigation() {
  return (
    <nav className="
      w-full
      bg-white dark:bg-gray-800
      border-b border-gray-200 dark:border-gray-700
      shadow-sm
      transition-colors duration-300
    ">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* 左側：品牌 Logo + 系統名稱 */}
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-3">
            <Image
              src="/CROWN-Logo.png"
              alt="CROWN Logo"
              width={40}
              height={40}
              className="object-contain"
            />
            <span className="
              text-lg font-semibold
              text-gray-900 dark:text-white
              hidden sm:inline
            ">
              文件倉儲管理系統
            </span>
          </Link>
        </div>

        {/* 中間：主選單（直向展開下拉選單） */}
        <div className="flex-1 flex items-center justify-center">
          <MainMenu />
        </div>

        {/* 右側：語系選擇 + 主題切換 + 使用者下拉選單 */}
        <div className="flex items-center gap-3">
          <LanguageSelector />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </nav>
  );
}

