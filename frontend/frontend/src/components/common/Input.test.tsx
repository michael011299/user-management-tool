import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

describe("Input", () => {
  it("renders with label", () => {
    render(<Input label='Email' />);
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("shows required asterisk", () => {
    render(<Input label='Email' required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Input error='This field is required' />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Input helperText='Enter your email' />);
    expect(screen.getByText("Enter your email")).toBeInTheDocument();
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();
    render(<Input />);
    const input = screen.getByRole("textbox");

    await user.type(input, "test@example.com");
    expect(input).toHaveValue("test@example.com");
  });

  it("renders with icon", () => {
    render(<Input icon={<span data-testid='test-icon'>📧</span>} />);
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("applies error styling", () => {
    render(<Input error='Error' />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveClass("border-danger-500");
  });
});
