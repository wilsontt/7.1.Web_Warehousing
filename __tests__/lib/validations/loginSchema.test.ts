import { loginSchema } from "@/lib/validations/loginSchema";

describe("loginSchema", () => {
  it("應該驗證有效的登入資料", () => {
    const validData = {
      username: "testuser",
      password: "password123",
    };

    const result = loginSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.username).toBe("testuser");
      expect(result.data.password).toBe("password123");
    }
  });

  it("應該拒絕空的帳號", () => {
    const invalidData = {
      username: "",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("應該拒絕空的密碼", () => {
    const invalidData = {
      username: "testuser",
      password: "",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("應該拒絕只有空白字元的帳號", () => {
    const invalidData = {
      username: "   ",
      password: "password123",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("應該拒絕只有空白字元的密碼", () => {
    const invalidData = {
      username: "testuser",
      password: "   ",
    };

    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

