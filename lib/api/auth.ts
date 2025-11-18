import type {
  LoginRequest,
  LoginResponse,
  ApiError,
  TwoFactorAuthRequest,
  TwoFactorAuthVerifyRequest,
  TwoFactorAuthResponse,
} from "@/types/auth";
import { getStoredCSRFToken } from "@/lib/security/csrf";

// API Base URL（從環境變數讀取）
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Token 儲存鍵名
const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const USER_INFO_KEY = "user_info";

/**
 * 統一的 API 錯誤類別
 */
export class AuthError extends Error {
  code?: string;
  errorCount?: number;
  isLocked?: boolean;
  statusCode?: number;

  constructor(message: string, options?: ApiError) {
    super(message);
    this.name = "AuthError";
    this.code = options?.code;
    this.errorCount = options?.errorCount;
    this.isLocked = options?.isLocked;
    this.statusCode = options?.statusCode;
  }
}

/**
 * 通用 API 請求函數
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // 請求攔截器：加入 Token 和 CSRF Token
  const token = getToken();
  const csrfToken = getStoredCSRFToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // 加入 CSRF Token（如果存在）
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 回應攔截器：處理 Token 儲存和錯誤
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new AuthError(errorData.message || "請求失敗", {
        message: errorData.message || "請求失敗",
        code: errorData.code,
        errorCount: errorData.errorCount,
        isLocked: errorData.isLocked,
        statusCode: response.status,
      });
    }

    const data = await response.json();
    return data as T;
  } catch (error) {
    if (error instanceof AuthError) {
      throw error;
    }
    // 網路錯誤或其他錯誤
    throw new AuthError("網路連線錯誤，請檢查您的網路設定", {
      statusCode: 0,
    });
  }
}

/**
 * 登入 API
 * Session Fixation 防護：每次登入都清除舊的認證資料
 */
export async function login(
  username: string,
  password: string
): Promise<LoginResponse> {
  // Session Fixation 防護：清除舊的認證資料
  clearAuthData();

  // 開發環境：使用 Mock API（當後端 API 不可用時）
  // 實際環境：應移除此條件，直接使用真實 API
  if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL) {
    const { mockLogin } = await import("@/lib/mocks/authMock");
    const response = await mockLogin(username, password);

    // 回應攔截器：處理 Token 儲存
    if (response.success && response.token) {
      setToken(response.token);
      if (response.refreshToken) {
        setRefreshToken(response.refreshToken);
      }
      if (response.user) {
        setUserInfo(response.user);
      }
    }

    return response;
  }

  // 生產環境：使用真實 API
  const response = await apiRequest<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ username, password } as LoginRequest),
  });

  // 回應攔截器：處理 Token 儲存
  if (response.success && response.token) {
    setToken(response.token);
    if (response.refreshToken) {
      setRefreshToken(response.refreshToken);
    }
    if (response.user) {
      setUserInfo(response.user);
    }
  }

  // 安全：密碼不應在記憶體中保留
  // password 參數會在函數結束後自動清除

  return response;
}

/**
 * 登出 API
 */
export async function logout(): Promise<void> {
  try {
    await apiRequest("/auth/logout", {
      method: "POST",
    });
  } catch (error) {
    // 即使 API 失敗也要清除本地 Token
    console.error("登出 API 失敗:", error);
  } finally {
    // 清除本地儲存的 Token 和使用者資訊
    clearAuthData();
  }
}

/**
 * 發送 2FA 驗證碼
 */
export async function send2FACode(
  method: "sms" | "email"
): Promise<TwoFactorAuthResponse> {
  return apiRequest<TwoFactorAuthResponse>("/auth/2fa/send", {
    method: "POST",
    body: JSON.stringify({ method } as TwoFactorAuthRequest),
  });
}

/**
 * 驗證 2FA 驗證碼
 */
export async function verify2FACode(
  code: string
): Promise<TwoFactorAuthResponse> {
  try {
    const response = await apiRequest<TwoFactorAuthResponse>("/auth/2fa/verify", {
      method: "POST",
      body: JSON.stringify({ code } as TwoFactorAuthVerifyRequest),
    });

    // 回應攔截器：處理 Token 儲存
    if (response.success && response.token) {
      setToken(response.token);
      // 從 localStorage 讀取使用者資訊（如果有的話）
      const userInfo = getUserInfo();
      if (userInfo) {
        setUserInfo(userInfo);
      }
    }

    return response;
  } catch (error) {
    // 處理驗證失敗，包含 remainingAttempts
    if (error instanceof AuthError) {
      // 如果 API 回傳包含 remainingAttempts，需要從錯誤回應中提取
      // 這裡假設錯誤回應格式包含 remainingAttempts
      throw error;
    }
    throw error;
  }
}

/**
 * 檢查 Token 是否有效
 */
export async function verifyToken(): Promise<boolean> {
  try {
    await apiRequest("/auth/verify", {
      method: "GET",
    });
    return true;
  } catch {
    return false;
  }
}

// Token 管理函數

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getUserInfo() {
  if (typeof window === "undefined") return null;
  const userInfo = localStorage.getItem(USER_INFO_KEY);
  return userInfo ? JSON.parse(userInfo) : null;
}

export function setUserInfo(userInfo: any): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
}

export function clearAuthData(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
}

