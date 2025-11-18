import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ThemeToggle from "@/components/ThemeToggle";
import { ThemeProvider } from "@/contexts/ThemeContext";

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe("ThemeToggle", () => {
  beforeEach(() => {
    global.localStorageMock.getItem.mockReturnValue(null);
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });

  it("應該渲染主題切換按鈕", () => {
    renderWithTheme(<ThemeToggle />);
    expect(screen.getByLabelText("切換主題")).toBeInTheDocument();
  });

  it("應該能夠切換主題", async () => {
    const user = userEvent.setup();
    renderWithTheme(<ThemeToggle />);

    const toggleButton = screen.getByLabelText("切換主題");
    expect(toggleButton).toBeInTheDocument();

    await user.click(toggleButton);
    // 主題應該已經切換
    expect(global.localStorageMock.setItem).toHaveBeenCalled();
  });
});

