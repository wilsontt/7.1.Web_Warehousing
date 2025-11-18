import { getUserInfo, getToken } from "@/lib/api/auth";

// 直接使用 fetch，因為稽核日誌可能需要在沒有 Token 的情況下記錄
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// 稽核事件類型
export type AuditEventType =
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILED"
  | "LOGIN_LOCKED"
  | "LOGOUT"
  | "2FA_SEND"
  | "2FA_VERIFY_SUCCESS"
  | "2FA_VERIFY_FAILED"
  | "AUTO_LOGOUT"
  | "SESSION_EXTENDED";

// 稽核事件資料
export interface AuditEvent {
  eventType: AuditEventType;
  userId?: string;
  username?: string;
  ipAddress?: string;
  userAgent?: string;
  details?: Record<string, any>;
  errorCount?: number;
  isLocked?: boolean;
  trackingId?: string;
}

/**
 * 取得使用者 IP 地址（簡化版，實際應由後端處理）
 */
function getClientIP(): string {
  // 實際 IP 應由後端從請求標頭中取得
  // 前端只能取得相對資訊
  return typeof window !== "undefined" ? window.location.hostname : "unknown";
}

/**
 * 產生追蹤 ID
 */
function generateTrackingId(): string {
  return `TRK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * 記錄稽核事件
 */
export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    const userInfo = getUserInfo();
    const token = getToken();

    // 如果沒有 Token，可能是登入前的操作，不記錄
    if (!token && !["LOGIN_SUCCESS", "LOGIN_FAILED", "LOGIN_LOCKED"].includes(event.eventType)) {
      return;
    }

    const auditData = {
      ...event,
      userId: event.userId || userInfo?.id,
      username: event.username || userInfo?.username,
      ipAddress: event.ipAddress || getClientIP(),
      userAgent: typeof window !== "undefined" ? window.navigator.userAgent : "unknown",
      timestamp: new Date().toISOString(),
      trackingId: event.trackingId || generateTrackingId(),
    };

    // 開發環境且沒有設定 API URL 時，跳過真實 API 呼叫
    if (process.env.NODE_ENV === "development" && !process.env.NEXT_PUBLIC_API_URL) {
      // 僅記錄到 console，不阻塞主要功能
      console.log("Audit Event (Mock):", auditData);
      return;
    }

    // 發送到後端稽核 API（生產環境或已設定 API URL）
    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      // 添加超時處理，避免請求卡住
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 秒超時

      try {
        await fetch(`${API_BASE_URL}/audit/log`, {
          method: "POST",
          headers,
          body: JSON.stringify(auditData),
          signal: controller.signal,
        });
      } finally {
        clearTimeout(timeoutId);
      }
    } catch (error) {
      // 如果 API 失敗，至少記錄到 console（生產環境應使用日誌服務）
      // 不拋出錯誤，避免影響主要功能
      if (error instanceof Error && error.name === "AbortError") {
        console.warn("Audit log request timeout:", auditData);
      } else {
        console.log("Audit Event (API failed, logged to console):", auditData);
      }
    }
  } catch (error) {
    // 稽核日誌失敗不應影響主要功能
    console.error("Failed to log audit event:", error);
  }
}

/**
 * 記錄登入成功事件
 */
export async function logLoginSuccess(username: string, trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "LOGIN_SUCCESS",
    username,
    trackingId,
  });
}

/**
 * 記錄登入失敗事件
 */
export async function logLoginFailed(
  username: string,
  errorCount: number,
  trackingId?: string
): Promise<void> {
  await logAuditEvent({
    eventType: "LOGIN_FAILED",
    username,
    errorCount,
    trackingId,
  });
}

/**
 * 記錄帳號鎖定事件
 */
export async function logLoginLocked(username: string, trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "LOGIN_LOCKED",
    username,
    isLocked: true,
    trackingId,
  });
}

/**
 * 記錄登出事件
 */
export async function logLogout(trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "LOGOUT",
    trackingId,
  });
}

/**
 * 記錄 2FA 發送事件
 */
export async function log2FASend(method: "sms" | "email", trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "2FA_SEND",
    details: { method },
    trackingId,
  });
}

/**
 * 記錄 2FA 驗證成功事件
 */
export async function log2FAVerifySuccess(trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "2FA_VERIFY_SUCCESS",
    trackingId,
  });
}

/**
 * 記錄 2FA 驗證失敗事件
 */
export async function log2FAVerifyFailed(
  remainingAttempts: number,
  trackingId?: string
): Promise<void> {
  await logAuditEvent({
    eventType: "2FA_VERIFY_FAILED",
    details: { remainingAttempts },
    trackingId,
  });
}

/**
 * 記錄自動登出事件
 */
export async function logAutoLogout(trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "AUTO_LOGOUT",
    trackingId,
  });
}

/**
 * 記錄會話延長事件
 */
export async function logSessionExtended(trackingId?: string): Promise<void> {
  await logAuditEvent({
    eventType: "SESSION_EXTENDED",
    trackingId,
  });
}

