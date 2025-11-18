import ABLayout from "@/components/layouts/ABLayout";
import TopNavigation from "@/components/navigation/TopNavigation";
import AuthGuard from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard requireAuth={true}>
      <ABLayout header={<TopNavigation />}>
        {children}
      </ABLayout>
    </AuthGuard>
  );
}

