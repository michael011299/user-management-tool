import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders with children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies primary variant by default", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-primary-600");
  });

  it("applies correct variant class", () => {
    render(<Button variant='danger'>Delete</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("bg-danger-500");
  });

  it("handles click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("shows loading spinner when isLoading is true", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(document.querySelector(".animate-spin")).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("renders with icon", () => {
    render(<Button icon={<span data-testid='icon'>🔥</span>}>With Icon</Button>);
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("applies size classes correctly", () => {
    const { rerender } = render(<Button size='sm'>Small</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-3 py-1.5");

    rerender(<Button size='lg'>Large</Button>);
    expect(screen.getByRole("button")).toHaveClass("px-6 py-3");
  });
});
