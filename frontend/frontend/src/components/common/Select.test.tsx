import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./Select";

describe("Select", () => {
  const options = [
    { value: "option1", label: "Option 1" },
    { value: "option2", label: "Option 2" },
    { value: "option3", label: "Option 3" },
  ];

  it("renders with options", () => {
    render(<Select options={options} />);

    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Option 1")).toBeInTheDocument();
    expect(screen.getByText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Option 3")).toBeInTheDocument();
  });

  it("renders with label", () => {
    render(<Select label='Choose Option' options={options} />);
    expect(screen.getByText("Choose Option")).toBeInTheDocument();
  });

  it("shows required asterisk", () => {
    render(<Select label='Choose Option' options={options} required />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("displays error message", () => {
    render(<Select options={options} error='This field is required' />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("displays helper text", () => {
    render(<Select options={options} helperText='Choose wisely' />);
    expect(screen.getByText("Choose wisely")).toBeInTheDocument();
  });

  it("accepts user selection", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();

    render(<Select options={options} onChange={handleChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "option2");

    expect(handleChange).toHaveBeenCalled();
  });

  it("applies error styling", () => {
    render(<Select options={options} error='Error' />);
    const select = screen.getByRole("combobox");
    expect(select).toHaveClass("border-danger-500");
  });
});
