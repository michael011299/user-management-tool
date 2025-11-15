import { render, screen, fireEvent } from "@testing-library/react";
import { OffboardForm } from "./OffboardForm";
import { FormData } from "../../types";

describe("OffboardForm", () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  const defaultFormData: FormData = {
    clientName: "",
    moveType: "offboard",
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

  it("renders offboard-specific fields", () => {
    render(<OffboardForm {...defaultProps} />);

    expect(screen.getByLabelText(/Client Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Offboard Account Email/i)).toBeInTheDocument();
    expect(screen.getByText(/This account will maintain access/i)).toBeInTheDocument();
  });

  it("shows danger variant for submit button", () => {
    render(<OffboardForm {...defaultProps} />);

    const button = screen.getByRole("button", { name: /Offboard Client/i });
    expect(button).toHaveClass("bg-danger-500");
  });

  it("calls onSubmit when form is submitted", () => {
    render(<OffboardForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole("button", { name: /Offboard Client/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("displays helper text for offboard email", () => {
    render(<OffboardForm {...defaultProps} />);

    expect(screen.getByText(/This account will maintain access after offboarding/i)).toBeInTheDocument();
  });

  it("disables buttons when loading", () => {
    render(<OffboardForm {...defaultProps} loading />);

    expect(screen.getByRole("button", { name: /Offboard Client/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Reset/i })).toBeDisabled();
  });
});
