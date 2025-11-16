import { renderHook, act, waitFor } from "@testing-library/react";
import { useApi } from "./useApi";

describe("useApi", () => {
  it("initializes with default state", () => {
    const { result } = renderHook(() => useApi<string>());

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("handles successful API call", async () => {
    const { result } = renderHook(() => useApi<string>());
    const mockApiCall = jest.fn().mockResolvedValue("success");

    await act(async () => {
      await result.current.execute(mockApiCall);
    });

    await waitFor(() => {
      expect(result.current.data).toBe("success");
      expect(result.current.loading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  it("handles API error", async () => {
    const { result } = renderHook(() => useApi<string>());
    const mockApiCall = jest.fn().mockRejectedValue(new Error("API Error"));

    await act(async () => {
      try {
        await result.current.execute(mockApiCall);
      } catch (err) {
        // Expected
      }
    });

    await waitFor(() => {
      expect(result.current.error).toBe("API Error");
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBeNull();
    });
  });

  it("resets state", () => {
    const { result } = renderHook(() => useApi<string>());

    act(() => {
      result.current.reset();
    });

    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });
});
