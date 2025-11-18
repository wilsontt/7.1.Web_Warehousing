"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/validations/loginSchema";
import { login, AuthError } from "@/lib/api/auth";
import {
  logLoginSuccess,
  logLoginFailed,
  logLoginLocked,
} from "@/lib/services/auditService";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorCount, setErrorCount] = useState<number | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const router = useRouter();

  // 整合 React Hook Form 與 Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur", // 在失去焦點時驗證
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // 監聽表單值變化，用於判斷是否應該禁用按鈕
  const username = watch("username");
  const password = watch("password");
  
  // 欄位為空時禁用登入按鈕，或帳號鎖定時禁用
  const isFormEmpty = !username?.trim() || !password?.trim();
  const shouldDisableSubmit = isSubmitting || isFormEmpty || isLocked;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: LoginFormData) => {
    // 清除之前的錯誤訊息
    setErrorMessage(null);
    setErrorCount(null);
    setIsLocked(false);

    // 安全檢查：確保密碼不在前端儲存
    // 密碼僅在記憶體中，提交後立即清除（由 React Hook Form 管理）

    try {
      // 串接登入 API
      const response = await login(data.username, data.password);

      // 處理登入成功回應
      if (response.success) {
        // 記錄登入成功事件（非阻塞，失敗不影響登入流程）
        logLoginSuccess(data.username).catch((err) => {
          console.warn("Failed to log login success event:", err);
        });

        // 處理需要 2FA 的情況
        if (response.requires2FA) {
          // 導向 2FA 頁面
          router.push("/login/2fa");
          return;
        }

        // 登入成功，導向 Dashboard
        // 使用者會話和權限資訊已由 API 回應攔截器自動儲存
        
        // 檢查是否有返回 URL（從 sessionStorage）
        const returnUrl = sessionStorage.getItem("returnUrl");
        if (returnUrl) {
          sessionStorage.removeItem("returnUrl");
          router.push(returnUrl);
        } else {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      // 處理登入失敗回應
      if (error instanceof AuthError) {
        // 處理帳號鎖定情況
        if (error.isLocked) {
          setIsLocked(true);
          setErrorMessage(
            "您已連續輸入錯誤達 6 次，帳號已被鎖定。請與管理人員聯繫。"
          );
          // 記錄帳號鎖定事件（非阻塞）
          logLoginLocked(data.username).catch((err) => {
            console.warn("Failed to log login locked event:", err);
          });
          return;
        }

        // 顯示統一錯誤訊息
        const message =
          error.message ||
          "您輸入的帳號或密碼不正確，請重新輸入。";
        setErrorMessage(message);

        // 顯示錯誤次數（如果有）
        if (error.errorCount !== undefined) {
          setErrorCount(error.errorCount);
          // 記錄登入失敗事件（非阻塞）
          logLoginFailed(data.username, error.errorCount).catch((err) => {
            console.warn("Failed to log login failed event:", err);
          });
        } else {
          // 記錄登入失敗事件（沒有錯誤次數，非阻塞）
          logLoginFailed(data.username, 0).catch((err) => {
            console.warn("Failed to log login failed event:", err);
          });
        }
      } else {
        // 其他錯誤（網路錯誤等）
        setErrorMessage("登入時發生錯誤，請稍後再試。");
      }
    }
  };

  const handleCancel = () => {
    reset();
  };

  // 處理鍵盤操作
  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    // Enter 鍵提交（由 HTML form 預設處理，此處僅作註記）
    // Tab 鍵導覽（由瀏覽器預設處理）
    if (e.key === "Enter" && e.target instanceof HTMLInputElement) {
      // 如果在輸入框中按下 Enter，表單會自動提交
      // 這裡可以添加額外的邏輯（如驗證）如果需要
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      onKeyDown={handleKeyDown}
      className="space-y-6"
      noValidate // 關閉瀏覽器預設驗證，使用我們的 Zod 驗證
    >
      {/* 帳號輸入欄位 */}
      <div>
        <label
          htmlFor="username"
          className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
        >
          帳號
        </label>
        <input
          id="username"
          type="text"
          {...register("username")}
          className={`
            w-full
            px-4 py-3
            border rounded-button
            bg-white dark:bg-gray-700
            text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500
            focus:outline-none focus:ring-2 focus:border-transparent
            transition-colors duration-200
            ${
              errors.username
                ? "border-red-500 focus:ring-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
            }
          `}
          placeholder="請輸入帳號"
          autoComplete="username"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {errors.username.message}
          </p>
        )}
      </div>

      {/* 密碼輸入欄位 */}
      <div>
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700 dark:text-gray-100 mb-2"
        >
          密碼
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`
              w-full
              px-4 py-3 pr-12
              border rounded-button
              bg-white dark:bg-gray-700
              text-gray-900 dark:text-gray-100
              placeholder-gray-400 dark:placeholder-gray-500
              focus:outline-none focus:ring-2 focus:border-transparent
              transition-colors duration-200
              ${
                errors.password
                  ? "border-red-500 focus:ring-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-primary-500"
              }
            `}
            placeholder="請輸入密碼"
            autoComplete="current-password"
          />
          {/* 密碼顯示/隱藏切換按鈕 */}
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="
              absolute
              right-3
              top-1/2
              -translate-y-1/2
              p-2
            text-gray-500 dark:text-gray-300
            hover:text-gray-700 dark:hover:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded
              transition-colors duration-200
            "
            aria-label={showPassword ? "隱藏密碼" : "顯示密碼"}
            title={showPassword ? "隱藏密碼" : "顯示密碼"}
          >
            {showPassword ? (
              // 眼睛閉合圖示（隱藏）
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                />
              </svg>
            ) : (
              // 眼睛開啟圖示（顯示）
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-300">
            {errors.password.message}
          </p>
        )}
      </div>

      {/* 錯誤訊息顯示 */}
      {errorMessage && (
        <div
          className={`
            p-4 rounded-lg
            ${
              isLocked
                ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                : "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
            }
          `}
        >
          <p
            className={`
              text-sm font-medium
              ${
                isLocked
                  ? "text-red-800 dark:text-red-100"
                  : "text-yellow-800 dark:text-yellow-100"
              }
            `}
          >
            {errorMessage}
          </p>
          {errorCount !== null && errorCount > 0 && !isLocked && (
            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-200">
              錯誤次數：{errorCount} 次
            </p>
          )}
        </div>
      )}

      {/* 按鈕區塊 */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        {/* 登入按鈕（Primary） */}
        {/* 欄位為空時禁用登入按鈕，符合規格 2.2 驗收條件 */}
        <button
          type="submit"
          disabled={shouldDisableSubmit}
          className="
            flex-1
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
          {isSubmitting ? "登入中..." : "登入"}
        </button>

        {/* 取消按鈕（Secondary，選用） */}
        <button
          type="button"
          onClick={handleCancel}
          className="
            px-6 py-3
            bg-gray-100 dark:bg-gray-700
            hover:bg-gray-200 dark:hover:bg-gray-600
            text-gray-700 dark:text-gray-200
            font-medium
            rounded-button
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            transition-colors duration-200
            min-h-[44px]
          "
        >
          取消
        </button>
      </div>
    </form>
  );
}

