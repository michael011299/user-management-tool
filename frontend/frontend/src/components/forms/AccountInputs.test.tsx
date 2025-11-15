// ============================================
// SRC/COMPONENTS/FORMS/ACCOUNTINPUTS.TEST.TSX
// ============================================
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AccountInputs } from "./AccountInputs";

describe("AccountInputs", () => {
  const mockOnChange = jest.fn();

  const defaultProps = {
    gaAccountId: "",
    gtmAccountId: "",
    gtmContainerId: "",
    onChange: mockOnChange,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it("renders all input fields", () => {
    render(<AccountInputs {...defaultProps} />);

    expect(screen.getByLabelText(/Google Analytics Account ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GTM Account ID/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GTM Container ID/i)).toBeInTheDocument();
  });

  it("displays error messages", () => {
    const errors = {
      gaAccountId: "Account ID is required",
      gtmAccountId: "Invalid format",
    };

    render(<AccountInputs {...defaultProps} errors={errors} />);

    expect(screen.getByText("Account ID is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid format")).toBeInTheDocument();
  });

  it("calls onChange when GA Account ID changes", async () => {
    const user = userEvent.setup();
    render(<AccountInputs {...defaultProps} />);

    const input = screen.getByLabelText(/Google Analytics Account ID/i);
    await user.type(input, "123456");

    expect(mockOnChange).toHaveBeenCalledWith("gaAccountId", "123456");
  });

  it("calls onChange when GTM Account ID changes", async () => {
    const user = userEvent.setup();
    render(<AccountInputs {...defaultProps} />);

    const input = screen.getByLabelText(/GTM Account ID/i);
    await user.type(input, "789012");

    expect(mockOnChange).toHaveBeenCalledWith("gtmAccountId", "789012");
  });

  it("displays helper text", () => {
    render(<AccountInputs {...defaultProps} />);

    expect(screen.getByText("At least one account ID is required")).toBeInTheDocument();
    expect(screen.getByText("Optional")).toBeInTheDocument();
  });
});
