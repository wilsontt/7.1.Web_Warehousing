import { validateSensitiveDataProtection, sanitizeInput } from "@/lib/security/securityCheck";

describe("安全測試", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorageMock.clear();
  });

  describe("敏感資訊遮蔽", () => {
    it("應該檢測到密碼儲存", () => {
      global.localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "password") return "stored-password";
        return null;
      });

      const result = validateSensitiveDataProtection();
      expect(result.passwordInStorage).toBe(true);
    });

    it("應該檢測到 Token 儲存", () => {
      global.localStorageMock.getItem.mockImplementation((key: string) => {
        if (key === "auth_token") return "mock-token";
        return null;
      });

      const result = validateSensitiveDataProtection();
      expect(result.tokenInStorage).toBe(true);
    });

    it("應該在沒有敏感資訊時通過檢查", () => {
      global.localStorageMock.getItem.mockReturnValue(null);

      const result = validateSensitiveDataProtection();
      expect(result.passwordInStorage).toBe(false);
    });
  });

  describe("XSS 防護", () => {
    it("應該清理 HTML 標籤", () => {
      const maliciousInput = "<script>alert('XSS')</script>";
      const sanitized = sanitizeInput(maliciousInput);
      expect(sanitized).not.toContain("<script>");
      expect(sanitized).toContain("&lt;script&gt;");
    });

    it("應該清理引號", () => {
      const input = 'test"quotes\'here';
      const sanitized = sanitizeInput(input);
      expect(sanitized).toContain("&quot;");
      expect(sanitized).toContain("&#x27;");
    });
  });

  describe("Session Fixation 防護", () => {
    it("應該在登入前清除舊的認證資料", async () => {
      // 設置舊的 Token
      global.localStorageMock.getItem.mockReturnValue("old-token");

      // 模擬登入函數
      const { clearAuthData } = require("@/lib/api/auth");

      // 登入前應該清除
      clearAuthData();
      expect(global.localStorageMock.removeItem).toHaveBeenCalledWith("auth_token");
      expect(global.localStorageMock.removeItem).toHaveBeenCalledWith("refresh_token");
      expect(global.localStorageMock.removeItem).toHaveBeenCalledWith("user_info");
    });
  });
});

