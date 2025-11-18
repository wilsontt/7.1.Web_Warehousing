"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo, logout } from "@/lib/api/auth";
import type { UserInfo } from "@/types/auth";

/**
 * 使用者下拉選單
 * 
 * 符合規格：2.1 全域 UI 框架
 * - 顯示已登入的「帳號名稱」
 * - 下拉內容包含：登入帳號、電腦 IP、登入時間、密碼變更、登出
 */
export default function UserMenu() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [clientIP, setClientIP] = useState<string>("");
  const [loginTime, setLoginTime] = useState<string>("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 載入使用者資訊
  useEffect(() => {
    const loadUserInfo = () => {
      const info = getUserInfo();
      if (info) {
        setUserInfo(info);
        const storedLoginTime = localStorage.getItem("login_time");
        if (storedLoginTime) {
          setLoginTime(storedLoginTime);
        }
        setClientIP("取得中...");
      }
    };

    loadUserInfo();
  }, []);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch (error) {
      console.error("登出失敗:", error);
      router.push("/login");
    }
  };

  const handleChangePassword = () => {
    setIsOpen(false);
    alert("密碼變更功能待實作");
  };

  // 未登入時，顯示登入入口按鈕（仍維持樣式一致）
  if (!userInfo) {
    return (
      <button
        onClick={() => router.push("/login")}
        className="
          flex items-center gap-2
          px-3 py-2
          rounded-button
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          text-sm font-medium
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          transition-colors duration-200
        "
        aria-label="登入"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="hidden sm:inline">登入</span>
      </button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-3 py-2
          rounded-button
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          text-sm font-medium
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          transition-colors duration-200
        "
        aria-label="使用者選單"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
        <span className="hidden sm:inline">{userInfo.username}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2
          w-64
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg
          shadow-lg
          overflow-hidden
          z-50
        ">
          {/* 使用者資訊區塊 */}
          <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
            <div className="text-sm font-medium text-gray-900 dark:text-white">
              {userInfo.username}
            </div>
            {userInfo.email && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {userInfo.email}
              </div>
            )}
          </div>

          {/* 詳細資訊 */}
          <div className="px-4 py-2 space-y-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex justify-between">
              <span>登入帳號：</span>
              <span className="font-medium">{userInfo.username}</span>
            </div>
            <div className="flex justify-between">
              <span>電腦 IP：</span>
              <span className="font-medium">{clientIP}</span>
            </div>
            {loginTime && (
              <div className="flex justify-between">
                <span>登入時間：</span>
                <span className="font-medium">{loginTime}</span>
              </div>
            )}
          </div>

          {/* 操作按鈕 */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleChangePassword}
              className="
                w-full
                px-4 py-2
                text-left
                text-sm
                text-gray-700 dark:text-gray-200
                hover:bg-gray-50 dark:hover:bg-gray-700
                transition-colors duration-200
              "
            >
              密碼變更
            </button>
            <button
              onClick={handleLogout}
              className="
                w-full
                px-4 py-2
                text-left
                text-sm
                text-red-600 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-900/20
                transition-colors duration-200
              "
            >
              登出
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

