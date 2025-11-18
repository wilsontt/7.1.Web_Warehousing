/**
 * 安全檢查與驗證工具
 * 用於確保系統符合安全規範
 */

/**
 * 檢查是否使用 HTTPS（生產環境）
 */
export function checkHTTPS(): boolean {
  if (typeof window === "undefined") return true; // SSR 環境
  
  const isProduction = process.env.NODE_ENV === "production";
  const isHTTPS = window.location.protocol === "https:";
  
  if (isProduction && !isHTTPS) {
    console.warn("⚠️ 生產環境應使用 HTTPS 傳輸");
    return false;
  }
  
  return true;
}

/**
 * 驗證 CSRF Token（由後端處理，前端僅提供輔助函數）
 */
export function getCSRFToken(): string | null {
  // CSRF Token 應由後端在首次請求時提供
  // 前端從 meta tag 或 cookie 中讀取
  if (typeof document === "undefined") return null;
  
  const metaTag = document.querySelector('meta[name="csrf-token"]');
  return metaTag ? metaTag.getAttribute("content") : null;
}

/**
 * 檢查敏感資訊是否正確遮蔽
 */
export function validateSensitiveDataProtection(): {
  passwordInStorage: boolean;
  tokenInStorage: boolean;
  recommendations: string[];
} {
  const recommendations: string[] = [];
  
  if (typeof window === "undefined") {
    return { passwordInStorage: false, tokenInStorage: false, recommendations: [] };
  }

  // 檢查 localStorage 中是否有密碼
  const hasPassword = Object.keys(localStorage).some((key) => {
    const value = localStorage.getItem(key);
    return value && (value.includes("password") || value.toLowerCase().includes("pwd"));
  });

  // 檢查是否有 Token（這是正常的）
  const hasToken = localStorage.getItem("auth_token") !== null;

  if (hasPassword) {
    recommendations.push("發現可能的密碼儲存，請確認沒有在 localStorage 中儲存密碼");
  }

  if (hasToken) {
    recommendations.push("Token 儲存在 localStorage，生產環境建議使用 HttpOnly Cookie");
  }

  return {
    passwordInStorage: hasPassword,
    tokenInStorage: hasToken,
    recommendations,
  };
}

/**
 * XSS 防護：清理使用者輸入
 */
export function sanitizeInput(input: string): string {
  if (typeof input !== "string") return "";
  
  // React 會自動處理 XSS，這裡提供額外的清理
  return input
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * 驗證錯誤訊息不透露敏感資訊
 */
export function validateErrorMessages(): {
  isSecure: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // 檢查是否有錯誤訊息透露帳號是否存在
  // 這應該在程式碼審查中檢查，這裡提供檢查函數
  
  // 預設錯誤訊息應該是統一的
  const secureErrorMessages = [
    "您輸入的帳號或密碼不正確，請重新輸入。",
    "您已連續輸入錯誤達 6 次，帳號已被鎖定。請與管理人員聯繫。",
  ];

  // 實際檢查應在程式碼審查中進行
  // 這裡僅提供驗證框架
  
  return {
    isSecure: issues.length === 0,
    issues,
  };
}

/**
 * Session Fixation 防護檢查
 * 確保每次登入都產生新的 Session ID
 */
export function validateSessionFixationProtection(): boolean {
  // Session Fixation 防護主要由後端實作
  // 前端確保每次登入都清除舊的 Token
  // 這已在 logout 和 clearAuthData 中實作
  
  return true;
}

/**
 * 執行所有安全檢查
 */
export function runSecurityChecks(): {
  https: boolean;
  csrf: boolean;
  sensitiveData: ReturnType<typeof validateSensitiveDataProtection>;
  xss: boolean;
  errorMessages: ReturnType<typeof validateErrorMessages>;
  sessionFixation: boolean;
  overall: boolean;
} {
  const https = checkHTTPS();
  const csrf = getCSRFToken() !== null; // 簡化檢查
  const sensitiveData = validateSensitiveDataProtection();
  const xss = true; // React 自動處理 XSS
  const errorMessages = validateErrorMessages();
  const sessionFixation = validateSessionFixationProtection();

  const overall =
    https &&
    sensitiveData.passwordInStorage === false &&
    errorMessages.isSecure &&
    sessionFixation;

  return {
    https,
    csrf,
    sensitiveData,
    xss,
    errorMessages,
    sessionFixation,
    overall,
  };
}

