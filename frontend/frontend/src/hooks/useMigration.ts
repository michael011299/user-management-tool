import { useState } from "react";
import { migrationService } from "../services/migration.service";
import { FormData, MigrationResult, FindResult } from "../types";

export const useMigration = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MigrationResult | null>(null);
  const [findResult, setFindResult] = useState<FindResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const migrate = async (data: FormData) => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await migrationService.migrate(data);
      setResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Migration failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const find = async (data: Partial<FormData>) => {
    setLoading(true);
    setError(null);
    setFindResult(null);

    try {
      const response = await migrationService.find(data);
      setFindResult(response);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Find failed";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setFindResult(null);
    setError(null);
  };

  return {
    loading,
    result,
    findResult,
    error,
    migrate,
    find,
    reset,
  };
};
