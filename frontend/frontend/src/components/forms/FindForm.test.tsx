import { render, screen, fireEvent } from "@testing-library/react";
import { FindForm } from "./FindForm";
import { FormData } from "../../types";

describe("FindForm", () => {
  const mockOnChange = jest.fn();
  const mockOnSubmit = jest.fn();
  const mockOnReset = jest.fn();

  const defaultFormData: FormData = {
    clientName: "",
    moveType: "find",
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

  it("renders find-specific UI", () => {
    render(<FindForm {...defaultProps} />);

    expect(screen.getByText("Search Criteria")).toBeInTheDocument();
    expect(screen.getByText(/Optional - helps identify the correct account/i)).toBeInTheDocument();
  });

  it("shows Find Account button", () => {
    render(<FindForm {...defaultProps} />);

    expect(screen.getByRole("button", { name: /Find Account/i })).toBeInTheDocument();
  });

  it("calls onSubmit when form is submitted", () => {
    render(<FindForm {...defaultProps} />);

    fireEvent.submit(screen.getByRole("button", { name: /Find Account/i }));

    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it("renders client name as optional field", () => {
    render(<FindForm {...defaultProps} />);

    const clientNameInput = screen.getByLabelText(/Client Name/i);
    expect(clientNameInput).not.toBeRequired();
  });

  it("calls onReset when reset is clicked", () => {
    render(<FindForm {...defaultProps} />);

    fireEvent.click(screen.getByRole("button", { name: /Reset/i }));

    expect(mockOnReset).toHaveBeenCalledTimes(1);
  });
});
