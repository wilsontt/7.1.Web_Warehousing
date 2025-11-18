/**
 * 認證 Mock 服務
 * 
 * 用於開發和測試環境，提供測試帳號登入功能
 * 符合規格：2.文件倉儲管理系統 Warehouse Management System 設計規範v2.0.md
 * - 測試帳號：admin (管理員)、manager (主管)、user (一般使用者)
 * 
 * 建立日期: 2025/11/15
 * 最後更新: 2025/11/15
 */

import type { LoginRequest, LoginResponse, UserInfo } from "@/types/auth";

/**
 * 測試帳號資料
 * 
 * 帳號資訊請參考：docs/TEST_ACCOUNTS.md
 */
const TEST_ACCOUNTS = {
  admin: {
    password: "Admin@123",
    user: {
      id: "1",
      username: "admin",
      name: "系統管理員",
      roles: ["admin"],
      permissions: ["*"],
    },
  },
  manager: {
    password: "Manager@123",
    user: {
      id: "2",
      username: "manager",
      name: "主管",
      roles: ["manager"],
      permissions: [
        "basic-operations",
        "routine-operations",
        "inventory-operations",
        "customer-operations",
        "relocation-operations",
        "audit-operations",
        "warehouse-admin-operations",
      ],
    },
  },
  user: {
    password: "User@123",
    user: {
      id: "3",
      username: "user",
      name: "一般使用者",
      roles: ["user"],
      permissions: ["basic-operations", "routine-operations", "inventory-operations:read"],
    },
  },
} as const;

/**
 * 模擬登入錯誤計數（僅用於開發環境）
 * 實際環境應由後端管理
 */
const loginAttempts: Record<string, number> = {};
const LOCKOUT_THRESHOLD = 6;

/**
 * Mock 登入 API
 * 
 * 僅在開發環境使用，實際環境應呼叫真實的後端 API
 */
export async function mockLogin(
  username: string,
  password: string
): Promise<LoginResponse> {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 300));

  const account = TEST_ACCOUNTS[username as keyof typeof TEST_ACCOUNTS];

  // 檢查帳號是否存在
  if (!account) {
    // 增加錯誤計數
    loginAttempts[username] = (loginAttempts[username] || 0) + 1;
    
    return {
      success: false,
      message: "您輸入的帳號或密碼不正確，請重新輸入。",
      errorCount: loginAttempts[username],
      isLocked: loginAttempts[username] >= LOCKOUT_THRESHOLD,
    };
  }

  // 檢查密碼是否正確
  if (password !== account.password) {
    // 增加錯誤計數
    loginAttempts[username] = (loginAttempts[username] || 0) + 1;
    const isLocked = loginAttempts[username] >= LOCKOUT_THRESHOLD;

    return {
      success: false,
      message: isLocked
        ? "您已連續輸入錯誤達 6 次，帳號已被鎖定。請與管理人員聯繫。"
        : "您輸入的帳號或密碼不正確，請重新輸入。",
      errorCount: loginAttempts[username],
      isLocked,
    };
  }

  // 登入成功，清除錯誤計數
  delete loginAttempts[username];

  // 產生模擬 Token
  const token = `mock-token-${username}-${Date.now()}`;
  const refreshToken = `mock-refresh-token-${username}-${Date.now()}`;

  return {
    success: true,
    token,
    refreshToken,
    user: {
      ...account.user,
      roles: [...account.user.roles],
      permissions: [...account.user.permissions],
    },
    requires2FA: false, // 測試環境預設不需要 2FA
  };
}

/**
 * 重置登入錯誤計數（用於測試）
 */
export function resetLoginAttempts(username?: string): void {
  if (username) {
    delete loginAttempts[username];
  } else {
    Object.keys(loginAttempts).forEach((key) => {
      delete loginAttempts[key];
    });
  }
}

/**
 * 取得測試帳號列表（用於文件顯示）
 */
export function getTestAccounts(): Array<{
  username: string;
  password: string;
  role: string;
  permissions: string[];
}> {
  return Object.entries(TEST_ACCOUNTS).map(([username, account]) => ({
    username,
    password: account.password,
    role: account.user.roles[0],
    permissions: [...account.user.permissions],
  }));
}

