// 認證相關型別定義

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  token?: string;
  refreshToken?: string;
  user?: UserInfo;
  requires2FA?: boolean;
  errorCount?: number;
  isLocked?: boolean;
  message?: string;
}

export interface UserInfo {
  id: string;
  username: string;
  name: string;
  email?: string;
  roles: string[];
  permissions: string[];
}

export interface ApiError {
  message?: string;
  code?: string;
  errorCount?: number;
  isLocked?: boolean;
  statusCode?: number;
}

export interface TwoFactorAuthRequest {
  method: "sms" | "email";
}

export interface TwoFactorAuthVerifyRequest {
  code: string;
  token?: string;
}

export interface TwoFactorAuthResponse {
  success: boolean;
  token?: string;
  message?: string;
  remainingAttempts?: number;
}

