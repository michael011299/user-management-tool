import { render, screen } from "@testing-library/react";
import { MigrationCard } from "./MigrationCard";
import { MigrationRecord } from "../../types";

describe("MigrationCard", () => {
  const mockMigration: MigrationRecord = {
    move_id: 1,
    client_name: "Test Client",
    move_type: "migration",
    new_email: "new@test.com",
    old_email: "old@test.com",
    status: "completed",
    created_at: "2024-11-15T10:00:00Z",
    ga_account_id: "123456",
    gtm_account_id: "789012",
  };

  it("renders migration details", () => {
    render(<MigrationCard migration={mockMigration} />);

    expect(screen.getByText("Test Client")).toBeInTheDocument();
    expect(screen.getByText("new@test.com")).toBeInTheDocument();
    expect(screen.getByText("old@test.com")).toBeInTheDocument();
  });

  it("displays status badge", () => {
    render(<MigrationCard migration={mockMigration} />);
    expect(screen.getByText("Completed")).toBeInTheDocument();
  });

  it("shows account IDs", () => {
    render(<MigrationCard migration={mockMigration} />);
    expect(screen.getByText("123456")).toBeInTheDocument();
    expect(screen.getByText("789012")).toBeInTheDocument();
  });
});
