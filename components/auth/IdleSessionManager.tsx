"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { useIdleTimer } from "@/hooks/useIdleTimer";
import { getToken, clearAuthData } from "@/lib/api/auth";
import { logAutoLogout } from "@/lib/services/auditService";
import AutoLogoutModal from "./AutoLogoutModal";

interface IdleSessionManagerProps {
  timeout?: number; // 閒置時間（毫秒），預設 30 分鐘
  warningTime?: number; // 警告時間（毫秒），預設 1 分鐘
  hasUnsavedData?: boolean;
}

export default function IdleSessionManager({
  timeout = 30 * 60 * 1000, // 30 分鐘
  warningTime = 60 * 1000, // 1 分鐘
  hasUnsavedData = false,
}: IdleSessionManagerProps) {
  const pathname = usePathname();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(warningTime);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 檢查是否已登入（有 Token 且不在登入頁面）
  useEffect(() => {
    const token = getToken();
    const isLoginPage = pathname?.startsWith("/login");
    setIsAuthenticated(!!token && !isLoginPage);
  }, [pathname]);

  const handleIdle = () => {
    // 自動登出：先清除認證再導向登入，避免被導回 Dashboard
    try {
      logAutoLogout().catch(() => {});
    } catch (_) {}
    clearAuthData();
    window.location.href = "/login";
  };

  const handleWarning = (time: number) => {
    setRemainingTime(time);
    setShowWarning(true);
  };

  const handleExtend = () => {
    setShowWarning(false);
    // 重置計時器會由 useIdleTimer 自動處理
  };

  const handleLogout = () => {
    setShowWarning(false);
  };

  useIdleTimer({
    timeout,
    onIdle: handleIdle,
    onWarning: handleWarning,
    warningTime,
    enabled: isAuthenticated, // 只在已登入時啟用
  });

  if (!isAuthenticated) return null;

  return (
    <AutoLogoutModal
      isOpen={showWarning}
      remainingTime={remainingTime}
      onExtend={handleExtend}
      onLogout={handleLogout}
      hasUnsavedData={hasUnsavedData}
    />
  );
}

