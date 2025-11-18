import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import IdleSessionManager from "@/components/auth/IdleSessionManager";

export const metadata: Metadata = {
  title: "文件倉儲管理系統",
  description: "文件倉儲管理系統 Web 版本",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <IdleSessionManager />
        </ThemeProvider>
      </body>
    </html>
  );
}

