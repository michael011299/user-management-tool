import { useState, useEffect } from "react";
import { migrationService } from "../services/migration.service";
import { MigrationRecord } from "../types";

export const useHistory = (limit = 50) => {
  const [data, setData] = useState<MigrationRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);

    try {
      const records = await migrationService.getHistory(limit);
      setData(records);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch history";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [limit]);

  return {
    data,
    loading,
    error,
    refetch: fetchHistory,
  };
};
