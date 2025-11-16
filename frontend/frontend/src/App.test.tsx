import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { useMigration } from "./hooks/useMigration";

jest.mock("./hooks/useMigration");

describe("App", () => {
  const mockUseMigration = useMigration as jest.MockedFunction<typeof useMigration>;

  beforeEach(() => {
    mockUseMigration.mockReturnValue({
      loading: false,
      result: null,
      findResult: null,
      error: null,
      migrate: jest.fn(),
      find: jest.fn(),
      reset: jest.fn(),
    });
  });

  it("renders the application", () => {
    render(<App />);
    expect(screen.getByText("User Management Operations")).toBeInTheDocument();
  });

  it("switches between tabs", () => {
    render(<App />);

    fireEvent.click(screen.getByText("Capacity"));
    expect(screen.getByText("Capacity Dashboard")).toBeInTheDocument();

    fireEvent.click(screen.getByText("History"));
    expect(screen.getByText("Migration History")).toBeInTheDocument();
  });

  it("switches between operation types", () => {
    render(<App />);

    const offboardButton = screen.getAllByText("Offboard")[0];
    fireEvent.click(offboardButton);
    expect(screen.getByLabelText(/Offboard Account Email/i)).toBeInTheDocument();
  });
});
