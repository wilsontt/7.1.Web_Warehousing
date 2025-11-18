"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { logout, clearAuthData } from "@/lib/api/auth";
import { logAutoLogout, logSessionExtended } from "@/lib/services/auditService";

interface AutoLogoutModalProps {
  isOpen: boolean;
  remainingTime: number; // 剩餘時間（毫秒）
  onExtend: () => void;
  onLogout: () => void;
  hasUnsavedData?: boolean;
}

export default function AutoLogoutModal({
  isOpen,
  remainingTime,
  onExtend,
  onLogout,
  hasUnsavedData = false,
}: AutoLogoutModalProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(Math.ceil(remainingTime / 1000));

  // 每次開啟或剩餘時間更新時重設倒數
  useEffect(() => {
    if (!isOpen) return;
    setCountdown(Math.ceil(remainingTime / 1000));
  }, [isOpen, remainingTime]);

  // 每秒遞減倒數，歸零自動登出
  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    if (countdown === 0) {
      void handleLogout();
    }
  }, [countdown, isOpen]);

  const handleLogout = async () => {
    try {
      await logAutoLogout();
      await logout();
    } catch (error) {
      console.error("登出失敗:", error);
    } finally {
      clearAuthData();
      router.push("/login");
      onLogout();
    }
  };

  const handleExtend = async () => {
    await logSessionExtended();
    onExtend();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
          會話即將過期
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          您已經 {Math.floor(countdown / 60)} 分 {countdown % 60} 秒沒有操作，系統將在 {countdown} 秒後自動登出。
        </p>

        {hasUnsavedData && (
          <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              ⚠️ 您有未儲存的資料，登出後可能遺失。
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleExtend}
            className="
              flex-1
              px-4 py-2
              bg-primary-600 hover:bg-primary-700
              text-white
              font-medium
              rounded-button
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              transition-colors duration-200
            "
          >
            延長會話（30 分鐘）
          </button>
          <button
            onClick={handleLogout}
            className="
              px-4 py-2
              bg-gray-100 dark:bg-gray-700
              hover:bg-gray-200 dark:hover:bg-gray-600
              text-gray-700 dark:text-gray-200
              font-medium
              rounded-button
              focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              transition-colors duration-200
            "
          >
            立即登出
          </button>
        </div>
      </div>
    </div>
  );
}

