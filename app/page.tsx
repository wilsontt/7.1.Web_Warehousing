"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/login");
    }, 5000);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-10 bg-white dark:bg-gray-900 transition-colors">
      <main className="flex flex-col items-center justify-center text-center border border-gray-200 dark:border-gray-700 rounded-lg px-8 py-10 bg-white/70 dark:bg-gray-800/60 backdrop-blur">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">文件倉儲管理系統</h1>
        <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">歡迎使用文件倉儲管理系統</p>
        <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">5 秒後將自動導向登入頁面…</p>
      </main>
    </div>
  );
}

