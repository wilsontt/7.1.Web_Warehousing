"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import LoginForm from "@/components/LoginForm";

// 動態載入 ThemeToggle 以避免 SSR 問題
const ThemeToggle = dynamic(() => import("@/components/ThemeToggle"), {
  ssr: false,
});

export default function LoginPage() {
  return (
    <div className="login-container px-4 sm:px-6 lg:px-8">
      {/* 深色模式切換按鈕 */}
      <ThemeToggle />
      
      <div className="max-w-md w-full space-y-8">
        {/* Logo 與標題區塊 */}
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/CROWN-Logo.png"
              alt="CROWN Logo"
              width={150}
              height={150}
              priority
              className="object-contain"
              style={{ width: "auto", height: "auto" }}
            />
          </div>
          
          {/* 系統標題 */}
          <h1 className="text-3xl font-bold text-gray-900 dark:!text-white mb-2">
            文件倉儲管理系統
          </h1>
          <p className="text-sm text-gray-600 dark:!text-gray-200">
            Warehouse Management System
          </p>
        </div>

        {/* 登入表單容器 */}
        {/* 設計規範：淺色底、淡淺水藍色線條、圓角按鈕 */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-300">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

