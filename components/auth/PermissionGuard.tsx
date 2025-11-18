"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUserInfo } from "@/lib/api/auth";

interface PermissionGuardProps {
  children: React.ReactNode;
  requiredPermission: string | string[]; // 需要的權限（可以是單一權限或權限陣列）
  redirectTo?: string; // 未授權時導向的路徑（預設 /dashboard）
  fallback?: React.ReactNode; // 未授權時顯示的內容（可選）
}

/**
 * 權限保護元件（Permission Guard）
 * 
 * 符合規格：5. 非功能性需求（安全）
 * - 實作權限檢查
 * - 未授權時導向指定頁面或顯示 fallback
 * - 支援單一權限或多個權限（任一滿足即可）
 */
export default function PermissionGuard({
  children,
  requiredPermission,
  redirectTo = "/dashboard",
  fallback,
}: PermissionGuardProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    const checkPermission = () => {
      const userInfo = getUserInfo();
      
      if (!userInfo) {
        // 未登入，導向登入頁
        router.push("/login");
        return;
      }

      const permissions = userInfo.permissions || [];
      const requiredPermissions = Array.isArray(requiredPermission)
        ? requiredPermission
        : [requiredPermission];

      // 檢查是否有管理員權限（* 表示所有權限）
      if (permissions.includes("*")) {
        setHasPermission(true);
        setIsChecking(false);
        return;
      }

      // 檢查是否有任一所需權限
      const hasRequiredPermission = requiredPermissions.some((perm) =>
        permissions.includes(perm)
      );

      if (hasRequiredPermission) {
        setHasPermission(true);
      } else {
        // 未授權
        if (fallback) {
          // 顯示 fallback 內容
          setHasPermission(false);
        } else {
          // 導向指定頁面
          router.push(redirectTo);
        }
      }

      setIsChecking(false);
    };

    checkPermission();
  }, [requiredPermission, redirectTo, router, fallback]);

  // 檢查中顯示載入狀態
  if (isChecking) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600 dark:text-gray-400">載入中...</div>
      </div>
    );
  }

  // 已通過權限檢查，顯示子元件
  if (hasPermission) {
    return <>{children}</>;
  }

  // 未通過權限檢查，顯示 fallback 或 null（會導向其他頁面）
  if (fallback) {
    return <>{fallback}</>;
  }

  return null;
}

