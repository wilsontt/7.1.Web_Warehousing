"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, getUserInfo } from "@/lib/api/auth";

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // 是否需要登入（預設 true）
  redirectTo?: string; // 未登入時導向的路徑（預設 /login）
}

/**
 * 路由保護元件（Authentication Guard）
 * 
 * 符合規格：2.3 登入與身分驗證
 * - 實作登入狀態檢查
 * - 未登入時導向 /login
 * - 整合至 Dashboard 與其他需要保護的路由
 */
export default function AuthGuard({
  children,
  requireAuth = true,
  redirectTo = "/login",
}: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = getToken();
      const userInfo = getUserInfo();

      if (requireAuth) {
        // 需要登入
        if (!token || !userInfo) {
          // 未登入，導向登入頁
          // 儲存當前路徑，以便登入後返回
          const returnUrl = pathname !== redirectTo ? pathname : undefined;
          if (returnUrl) {
            sessionStorage.setItem("returnUrl", returnUrl);
          }
          router.push(redirectTo);
          return;
        }
      } else {
        // 不需要登入（例如登入頁）
        if (token && userInfo) {
          // 已登入，導向 Dashboard
          router.push("/dashboard");
          return;
        }
      }

      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [requireAuth, redirectTo, router, pathname]);

  // 檢查中顯示載入狀態
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  // 已通過驗證，顯示子元件
  if (isAuthenticated || !requireAuth) {
    return <>{children}</>;
  }

  // 未通過驗證，不顯示任何內容（會導向登入頁）
  return null;
}

