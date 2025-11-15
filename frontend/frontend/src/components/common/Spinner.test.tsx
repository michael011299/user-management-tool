import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders", () => {
    render(<Spinner />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("applies correct size classes", () => {
    const { rerender } = render(<Spinner size='sm' />);
    expect(screen.getByLabelText("Loading")).toHaveClass("h-4", "w-4");

    rerender(<Spinner size='lg' />);
    expect(screen.getByLabelText("Loading")).toHaveClass("h-12", "w-12");
  });

  it("applies custom className", () => {
    render(<Spinner className='custom-spinner' />);
    expect(screen.getByLabelText("Loading")).toHaveClass("custom-spinner");
  });

  it("has animation class", () => {
    render(<Spinner />);
    expect(screen.getByLabelText("Loading")).toHaveClass("animate-spin");
  });
});
