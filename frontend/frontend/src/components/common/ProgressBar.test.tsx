import { render, screen } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("renders with correct aria attributes", () => {
    render(<ProgressBar value={50} max={100} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveAttribute("aria-valuenow", "50");
    expect(progressBar).toHaveAttribute("aria-valuemax", "100");
  });

  it("calculates percentage correctly", () => {
    render(<ProgressBar value={75} max={100} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle({ width: "75%" });
  });

  it("shows label when showLabel is true", () => {
    render(<ProgressBar value={50} max={100} showLabel />);
    expect(screen.getByText("50 / 100 (50%)")).toBeInTheDocument();
  });

  it("applies variant color", () => {
    render(<ProgressBar value={50} variant='danger' />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveClass("bg-danger-500");
  });

  it("caps percentage at 100%", () => {
    render(<ProgressBar value={150} max={100} />);
    const progressBar = screen.getByRole("progressbar");
    expect(progressBar).toHaveStyle({ width: "100%" });
  });
});
