/**
 * CSRF 保護工具
 * 用於產生和驗證 CSRF Token
 */

/**
 * 產生 CSRF Token（用於表單提交）
 */
export function generateCSRFToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

/**
 * 驗證 CSRF Token
 */
export function verifyCSRFToken(token: string, storedToken: string | null): boolean {
  if (!storedToken) return false;
  return token === storedToken;
}

/**
 * 儲存 CSRF Token（使用 sessionStorage，頁面關閉後清除）
 */
export function storeCSRFToken(token: string): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem("csrf_token", token);
}

/**
 * 取得儲存的 CSRF Token
 */
export function getStoredCSRFToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem("csrf_token");
}

/**
 * 清除 CSRF Token
 */
export function clearCSRFToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem("csrf_token");
}

