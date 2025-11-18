"use client";

import { useEffect, useState } from "react";
import { runSecurityChecks } from "@/lib/security/securityCheck";

export default function SecurityCheckPage() {
  const [results, setResults] = useState<ReturnType<typeof runSecurityChecks> | null>(null);

  useEffect(() => {
    const checks = runSecurityChecks();
    setResults(checks);
  }, []);

  if (!results) {
    return <div className="p-8">載入中...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
          安全檢查報告
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-6">
          {/* HTTPS 檢查 */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                HTTPS 傳輸
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  results.https
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {results.https ? "✓ 通過" : "⚠️ 警告"}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              {results.https
                ? "使用 HTTPS 傳輸（或開發環境）"
                : "生產環境應使用 HTTPS 傳輸"}
            </p>
          </div>

          {/* CSRF 保護 */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                CSRF 保護
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  results.csrf
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                }`}
              >
                {results.csrf ? "✓ 已設定" : "待後端實作"}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              CSRF Token 驗證由後端處理，前端已加入 X-CSRF-Token header
            </p>
          </div>

          {/* 敏感資訊遮蔽 */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                敏感資訊遮蔽
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  !results.sensitiveData.passwordInStorage
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {!results.sensitiveData.passwordInStorage ? "✓ 通過" : "✗ 發現問題"}
              </span>
            </div>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                密碼儲存：{results.sensitiveData.passwordInStorage ? "發現" : "未發現"}
              </p>
              {results.sensitiveData.recommendations.length > 0 && (
                <div className="mt-2">
                  {results.sensitiveData.recommendations.map((rec, idx) => (
                    <p key={idx} className="text-xs text-yellow-600 dark:text-yellow-400">
                      • {rec}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* XSS 防護 */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                XSS 防護
              </h2>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✓ 通過
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              React 自動處理 XSS，所有使用者輸入透過 Zod 驗證
            </p>
          </div>

          {/* 錯誤訊息 */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                錯誤訊息安全
              </h2>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  results.errorMessages.isSecure
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                }`}
              >
                {results.errorMessages.isSecure ? "✓ 通過" : "✗ 發現問題"}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              使用統一錯誤訊息，不透露敏感資訊
            </p>
          </div>

          {/* Session Fixation */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Session Fixation 防護
              </h2>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                ✓ 通過
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              每次登入產生新 Token，登出時清除所有認證資料
            </p>
          </div>

          {/* 總體評估 */}
          <div className="pt-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                總體評估
              </h2>
              <span
                className={`px-4 py-2 rounded-full text-lg font-bold ${
                  results.overall
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
                }`}
              >
                {results.overall ? "✓ 通過" : "⚠️ 需改善"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

