// ============================================
// SRC/COMPONENTS/FORMS/MIGRATIONFORM.TEST.TSX
// ============================================
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MigrationForm } from "./MigrationForm";
import { FormData } from "../../types";

describe("MigrationForm", () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  const defaultFormData: FormData = {
    clientName: "",
    moveType: "migration",
    newEmail: "",
    offboardEmail: "",
    gaAccountId: "",
    gtmAccountId: "",
    gtmContainerId: "",
  };

  const defaultProps = {
    formData: defaultFormData,
    onChange: mockOnChange,
    onSubmit: mockOnSubmit,
    onReset: mockOnReset,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form fields", () => {
    render(<MigrationForm {...defaultProps} />);

    expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/New User Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Google Analytics Account ID/i)).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    render(<MigrationForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole("button", { name: /Migrate User/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("calls onChange when fields are updated", async () => {
    const user = userEvent.setup();
    render(<MigrationForm {...defaultProps} />);

    const clientNameInput = screen.getByLabelText(/Client Name/i);
    await user.type(clientNameInput, "Test");

    expect(mockOnChange).toHaveBeenCalledWith("clientName", "Test");
  });

  it("calls onReset when reset button is clicked", () => {
    render(<MigrationForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });

  it("disables submit button when loading", () => {
    render(<MigrationForm {...defaultProps} loading />);

    expect(screen.getByRole("button", { name: /Migrate User/i })).toBeDisabled();
  });

  it("displays validation errors", () => {
    const errors = {
      clientName: "Client name is required",
      newEmail: "Invalid email format",
    };

    render(<MigrationForm {...defaultProps} errors={errors} />);

    expect(screen.getByText("Client name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email format")).toBeInTheDocument();
  });

  it("shows loading state", () => {
    render(<MigrationForm {...defaultProps} loading />);

    expect(screen.getByRole("button", { name: /Migrate User/i })).toHaveClass("disabled:opacity-50");
  });
});
