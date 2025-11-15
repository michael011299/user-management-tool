import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("renders children", () => {
    render(<Card>Test content</Card>);
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("renders with title", () => {
    render(<Card title='Card Title'>Content</Card>);
    expect(screen.getByText("Card Title")).toBeInTheDocument();
  });

  it("renders with subtitle", () => {
    render(<Card subtitle='Card subtitle'>Content</Card>);
    expect(screen.getByText("Card subtitle")).toBeInTheDocument();
  });

  it("renders with action button", () => {
    render(<Card action={<button>Action</button>}>Content</Card>);
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(<Card className='custom-class'>Content</Card>);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
