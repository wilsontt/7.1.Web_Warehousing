import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginForm from "@/components/LoginForm";

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    global.localStorageMock.getItem.mockReturnValue(null);
  });

  it("應該渲染登入表單", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText("帳號")).toBeInTheDocument();
    expect(screen.getByLabelText("密碼")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "登入" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "取消" })).toBeInTheDocument();
  });

  it("應該顯示驗證錯誤訊息（帳號為空）", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText("密碼");
    await user.type(passwordInput, "password123");

    const loginButton = screen.getByRole("button", { name: "登入" });
    await user.click(loginButton);

    // 觸發驗證（失去焦點）
    const usernameInput = screen.getByLabelText("帳號");
    await user.click(usernameInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/帳號為必填欄位/)).toBeInTheDocument();
    });
  });

  it("應該顯示驗證錯誤訊息（密碼為空）", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號");
    await user.type(usernameInput, "testuser");

    const loginButton = screen.getByRole("button", { name: "登入" });
    // 登入按鈕應該被禁用（因為密碼為空）
    expect(loginButton).toBeDisabled();

    const passwordInput = screen.getByLabelText("密碼");
    await user.click(passwordInput);
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/密碼為必填欄位/)).toBeInTheDocument();
    });
  });

  it("應該切換密碼顯示/隱藏", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const passwordInput = screen.getByLabelText("密碼") as HTMLInputElement;
    await user.type(passwordInput, "password123");

    expect(passwordInput.type).toBe("password");

    const toggleButton = screen.getByLabelText("顯示密碼");
    await user.click(toggleButton);

    expect(passwordInput.type).toBe("text");

    await user.click(screen.getByLabelText("隱藏密碼"));
    expect(passwordInput.type).toBe("password");
  });

  it("應該在欄位為空時禁用登入按鈕", () => {
    render(<LoginForm />);
    const loginButton = screen.getByRole("button", { name: "登入" });
    expect(loginButton).toBeDisabled();
  });

  it("應該在輸入帳號和密碼後啟用登入按鈕", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號");
    const passwordInput = screen.getByLabelText("密碼");
    const loginButton = screen.getByRole("button", { name: "登入" });

    expect(loginButton).toBeDisabled();

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    await waitFor(() => {
      expect(loginButton).not.toBeDisabled();
    });
  });

  it("應該在提交時顯示 Loading 狀態", async () => {
    const user = userEvent.setup();
    // Mock fetch for login API (使用延遲以測試 loading 狀態)
    global.fetch = jest.fn(
      () =>
        new Promise((resolve) =>
          setTimeout(
            () =>
              resolve({
                ok: false,
                json: () => Promise.resolve({ message: "登入失敗" }),
              } as Response),
            100
          )
        )
    ) as jest.Mock;

    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號");
    const passwordInput = screen.getByLabelText("密碼");

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    const loginButton = screen.getByRole("button", { name: "登入" });
    await user.click(loginButton);

    // 在提交過程中按鈕應該被禁用
    await waitFor(() => {
      const button = screen.getByRole("button", { name: /登入/ });
      expect(button).toBeDisabled();
    });
  });

  it("應該在點擊取消時清空表單", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    const usernameInput = screen.getByLabelText("帳號") as HTMLInputElement;
    const passwordInput = screen.getByLabelText("密碼") as HTMLInputElement;

    await user.type(usernameInput, "testuser");
    await user.type(passwordInput, "password123");

    expect(usernameInput.value).toBe("testuser");
    expect(passwordInput.value).toBe("password123");

    const cancelButton = screen.getByRole("button", { name: "取消" });
    await user.click(cancelButton);

    expect(usernameInput.value).toBe("");
    expect(passwordInput.value).toBe("");
  });
});

