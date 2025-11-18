"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { send2FACode, verify2FACode, AuthError } from "@/lib/api/auth";
import {
  log2FASend,
  log2FAVerifySuccess,
  log2FAVerifyFailed,
} from "@/lib/services/auditService";

type Method = "sms" | "email";

export default function TwoFactorAuth() {
  const router = useRouter();
  const [method, setMethod] = useState<Method>("sms");
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [resendCountdown, setResendCountdown] = useState(0);
  const [expiryCountdown, setExpiryCountdown] = useState(300); // 5 分鐘
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 自動發送驗證碼
  useEffect(() => {
    const sendInitialCode = async () => {
      setIsSending(true);
      setErrorMessage(null);
      setRemainingAttempts(null);
      setCode(["", "", "", "", "", ""]);
      setExpiryCountdown(300);

      try {
        await send2FACode(method);
        setResendCountdown(60);
      } catch (error) {
        if (error instanceof AuthError) {
          setErrorMessage(error.message || "發送驗證碼失敗，請稍後再試");
        } else {
          setErrorMessage("發送驗證碼時發生錯誤，請稍後再試");
        }
      } finally {
        setIsSending(false);
      }
    };
    sendInitialCode();
  }, [method]);

  // 倒數計時器
  useEffect(() => {
    if (resendCountdown > 0) {
      const timer = setTimeout(() => setResendCountdown(resendCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  useEffect(() => {
    if (expiryCountdown > 0) {
      const timer = setTimeout(() => setExpiryCountdown(expiryCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [expiryCountdown]);

  const handleSendCode = async () => {
    setIsSending(true);
    setErrorMessage(null);
    setRemainingAttempts(null);
    setCode(["", "", "", "", "", ""]);
    setExpiryCountdown(300); // 重置倒數計時器

    try {
      await send2FACode(method);
      setResendCountdown(60); // 60 秒後才能重新發送
      // 記錄 2FA 發送事件
      await log2FASend(method);
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message || "發送驗證碼失敗，請稍後再試");
      } else {
        setErrorMessage("發送驗證碼時發生錯誤，請稍後再試");
      }
    } finally {
      setIsSending(false);
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    // 只允許數字
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // 自動聚焦到下一個輸入框
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // 處理退格鍵
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // 處理 Enter 鍵提交
    if (e.key === "Enter" && code.every((c) => c !== "")) {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newCode = pastedData.split("").slice(0, 6);
      setCode(newCode);
      // 聚焦到最後一個輸入框
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join("");
    if (codeString.length !== 6) {
      setErrorMessage("請輸入完整的 6 位數驗證碼");
      return;
    }

    setIsVerifying(true);
    setErrorMessage(null);

    try {
      const response = await verify2FACode(codeString);

      if (response.success) {
        // 記錄 2FA 驗證成功事件
        await log2FAVerifySuccess();
        // 2FA 成功，導向 Dashboard
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof AuthError) {
        setErrorMessage(error.message || "驗證碼錯誤，請重新輸入");

        // 處理剩餘嘗試次數（從錯誤回應中取得，需要後端支援）
        // 這裡假設錯誤訊息或錯誤物件中包含 remainingAttempts
        // 實際應根據後端 API 回應調整
        const attempts = remainingAttempts !== null ? remainingAttempts : 0;
        // 記錄 2FA 驗證失敗事件
        await log2FAVerifyFailed(attempts);
      } else {
        setErrorMessage("驗證時發生錯誤，請稍後再試");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            二階段驗證
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            請選擇驗證方式並輸入驗證碼
          </p>

          {/* 選擇驗證方式 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              驗證方式
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setMethod("sms")}
                className={`
                  flex-1 px-4 py-3 rounded-button border transition-colors
                  ${
                    method === "sms"
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }
                `}
              >
                簡訊
              </button>
              <button
                type="button"
                onClick={() => setMethod("email")}
                className={`
                  flex-1 px-4 py-3 rounded-button border transition-colors
                  ${
                    method === "email"
                      ? "bg-primary-50 dark:bg-primary-900/20 border-primary-500 text-primary-700 dark:text-primary-300"
                      : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }
                `}
              >
                電子郵件
              </button>
            </div>
          </div>

          {/* 驗證碼輸入 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              驗證碼（6 位數）
            </label>
            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`
                    w-12 h-14 text-center text-2xl font-bold
                    border rounded-button
                    bg-white dark:bg-gray-700
                    text-gray-900 dark:text-gray-100
                    focus:outline-none focus:ring-2 focus:ring-primary-500
                    transition-colors
                    ${
                      errorMessage
                        ? "border-red-500 dark:border-red-500"
                        : "border-gray-300 dark:border-gray-600"
                    }
                  `}
                />
              ))}
            </div>
            {expiryCountdown > 0 && (
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                驗證碼有效期限：{formatTime(expiryCountdown)}
              </p>
            )}
          </div>

          {/* 錯誤訊息 */}
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                {errorMessage}
              </p>
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                  剩餘嘗試次數：{remainingAttempts} 次
                </p>
              )}
            </div>
          )}

          {/* 按鈕區塊 */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={handleVerify}
              disabled={isVerifying || code.some((c) => !c)}
              className="
                w-full
                px-6 py-3
                bg-primary-600 hover:bg-primary-700
                text-white
                font-medium
                rounded-button
                focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[44px]
              "
            >
              {isVerifying ? "驗證中..." : "驗證"}
            </button>

            <button
              type="button"
              onClick={handleSendCode}
              disabled={isSending || resendCountdown > 0}
              className="
                w-full
                px-6 py-3
                bg-gray-100 dark:bg-gray-700
                hover:bg-gray-200 dark:hover:bg-gray-600
                text-gray-700 dark:text-gray-200
                font-medium
                rounded-button
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                transition-colors duration-200
                disabled:opacity-50 disabled:cursor-not-allowed
                min-h-[44px]
              "
            >
              {isSending
                ? "發送中..."
                : resendCountdown > 0
                ? `重新發送 (${resendCountdown}秒)`
                : "重新發送驗證碼"}
            </button>

            <button
              type="button"
              onClick={() => router.back()}
              className="
                w-full
                px-6 py-3
                text-gray-600 dark:text-gray-400
                hover:text-gray-800 dark:hover:text-gray-200
                font-medium
                focus:outline-none
                transition-colors duration-200
              "
            >
              返回登入
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

