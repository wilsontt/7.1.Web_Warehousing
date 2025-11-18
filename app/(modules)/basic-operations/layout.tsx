import ABLayout from "@/components/layouts/ABLayout";
import TopNavigation from "@/components/navigation/TopNavigation";
import AuthGuard from "@/components/auth/AuthGuard";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function BasicOperationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <PermissionGuard requiredPermission="basic-operations" redirectTo="/dashboard">
        <ABLayout header={<TopNavigation />}>{children}</ABLayout>
      </PermissionGuard>
    </AuthGuard>
  );
}
