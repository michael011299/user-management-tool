import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Test Badge</Badge>);
    expect(screen.getByText("Test Badge")).toBeInTheDocument();
  });

  it("applies success variant styles", () => {
    render(<Badge variant='success'>Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge).toHaveClass("bg-success-100", "text-success-700");
  });

  it("applies danger variant styles", () => {
    render(<Badge variant='danger'>Danger</Badge>);
    const badge = screen.getByText("Danger");
    expect(badge).toHaveClass("bg-danger-100", "text-danger-700");
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<Badge size='sm'>Small</Badge>);
    expect(screen.getByText("Small")).toHaveClass("text-xs", "px-2", "py-0.5");

    rerender(<Badge size='lg'>Large</Badge>);
    expect(screen.getByText("Large")).toHaveClass("text-base", "px-3", "py-1.5");
  });

  it("applies custom className", () => {
    render(<Badge className='custom-badge'>Custom</Badge>);
    expect(screen.getByText("Custom")).toHaveClass("custom-badge");
  });
});
