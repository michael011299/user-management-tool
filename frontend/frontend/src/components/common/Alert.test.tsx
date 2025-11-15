import { render, screen, fireEvent } from "@testing-library/react";
import { Alert } from "./Alert";

describe("Alert", () => {
  it("renders children", () => {
    render(<Alert>Alert message</Alert>);
    expect(screen.getByText("Alert message")).toBeInTheDocument();
  });

  it("renders with title", () => {
    render(<Alert title='Alert Title'>Message</Alert>);
    expect(screen.getByText("Alert Title")).toBeInTheDocument();
  });

  it("applies correct variant styles", () => {
    const { container } = render(<Alert variant='success'>Success</Alert>);
    expect(container.firstChild).toHaveClass("bg-success-50", "border-success-500");
  });

  it("renders close button when onClose is provided", () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Message</Alert>);
    expect(screen.getByLabelText("Close alert")).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", () => {
    const handleClose = jest.fn();
    render(<Alert onClose={handleClose}>Message</Alert>);
    fireEvent.click(screen.getByLabelText("Close alert"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("has alert role", () => {
    render(<Alert>Message</Alert>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
