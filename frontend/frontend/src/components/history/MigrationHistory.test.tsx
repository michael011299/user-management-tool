import { render, screen } from "@testing-library/react";
import { MigrationHistory } from "./MigrationHistory";
import { useHistory } from "../../hooks/useHistory";

jest.mock("../../hooks/useHistory");

describe("MigrationHistory", () => {
  const mockUseHistory = useHistory as jest.MockedFunction<typeof useHistory>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("displays loading state", () => {
    mockUseHistory.mockReturnValue({
      data: [],
      loading: true,
      error: null,
      refetch: jest.fn(),
    });

    render(<MigrationHistory />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("displays error state", () => {
    mockUseHistory.mockReturnValue({
      data: [],
      loading: false,
      error: "Failed to load",
      refetch: jest.fn(),
    });

    render(<MigrationHistory />);
    expect(screen.getByText("Failed to load")).toBeInTheDocument();
  });

  it("displays migration data", () => {
    const mockData = [
      {
        move_id: 1,
        client_name: "Test Client",
        move_type: "migration" as const,
        new_email: "test@test.com",
        status: "completed" as const,
        created_at: "2024-11-15T10:00:00Z",
      },
    ];

    mockUseHistory.mockReturnValue({
      data: mockData,
      loading: false,
      error: null,
      refetch: jest.fn(),
    });

    render(<MigrationHistory />);
    expect(screen.getByText("Test Client")).toBeInTheDocument();
  });
});
