import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";

describe("登入流程整合測試", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorageMock.getItem.mockReturnValue(null);
  });

  it("應該完成登入成功流程（不含 2FA）", async () => {
    const user = userEvent.setup();
    const mockRouter = require("next/navigation").useRouter();

    // Mock successful login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            success: true,
            token: "mock-token",
            user: { id: "1", username: "testuser", name: "Test User", roles: [], permissions: [] },
          }),
      })
    ) as jest.Mock;

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號");
    const passwordInput = screen.getByLabelText("密碼");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    const loginButton = screen.getByRole("button", { name: "登入" });
    await user.click(loginButton);

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    });
  });

  it("應該顯示登入失敗錯誤訊息", async () => {
    const user = userEvent.setup();

    // Mock failed login response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () =>
          Promise.resolve({
            message: "您輸入的帳號或密碼不正確，請重新輸入。",
            errorCount: 1,
          }),
      })
    ) as jest.Mock;

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號");
    const passwordInput = screen.getByLabelText("密碼");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "wrongpassword");

    const loginButton = screen.getByRole("button", { name: "登入" });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/您輸入的帳號或密碼不正確/)).toBeInTheDocument();
    });
  });

  it("應該顯示帳號鎖定訊息", async () => {
    const user = userEvent.setup();

    // Mock locked account response
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 403,
        json: () =>
          Promise.resolve({
            message: "帳號已鎖定",
            isLocked: true,
          }),
      })
    ) as jest.Mock;

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號");
    const passwordInput = screen.getByLabelText("密碼");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    const loginButton = screen.getByRole("button", { name: "登入" });
    await user.click(loginButton);

    await waitFor(() => {
      expect(screen.getByText(/帳號已被鎖定/)).toBeInTheDocument();
      expect(loginButton).toBeDisabled();
    });
  });
});

