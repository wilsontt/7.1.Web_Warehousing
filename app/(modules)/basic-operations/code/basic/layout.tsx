import AuthGuard from "@/components/auth/AuthGuard";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CodesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <PermissionGuard
        requiredPermission="basic-operations"
        redirectTo="/dashboard"
        fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                權限不足
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                您沒有代碼維護的權限，請聯繫系統管理員。
              </p>
            </div>
          </div>
        }
      >
        {children}
      </PermissionGuard>
    </AuthGuard>
  );
}
