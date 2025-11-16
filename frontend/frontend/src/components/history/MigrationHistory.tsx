import React, { useState } from "react";
import { useHistory } from "../../hooks/useHistory";
import { MigrationCard } from "./MigrationCard";
import { Spinner } from "../common/Spinner";
import { Alert } from "../common/Alert";
import { Button } from "../common/Button";
import { Input } from "../common/Input";
import { FiRefreshCw, FiSearch } from "react-icons/fi";

export const MigrationHistory: React.FC = () => {
  const { data, loading, error, refetch } = useHistory();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = data.filter((migration) => {
    const search = searchTerm.toLowerCase();
    return (
      migration.client_name.toLowerCase().includes(search) ||
      migration.new_email?.toLowerCase().includes(search) ||
      migration.old_email?.toLowerCase().includes(search) ||
      migration.move_id.toString().includes(search)
    );
  });

  if (loading && data.length === 0) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <Spinner size='lg' />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant='danger' title='Error Loading History'>
        <p>{error}</p>
        <Button onClick={refetch} variant='primary' size='sm' className='mt-3'>
          Retry
        </Button>
      </Alert>
    );
  }

  return (
    <div className='space-y-6'>
      <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
        <div>
          <h2 className='text-3xl font-bold text-gray-900'>Migration History</h2>
          <p className='text-sm text-gray-600 mt-1'>{data.length} total migrations</p>
        </div>
        <Button
          onClick={refetch}
          variant='secondary'
          icon={<FiRefreshCw className={loading ? "animate-spin" : ""} />}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow-md p-4'>
        <Input
          placeholder='Search by client name, email, or move ID...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<FiSearch />}
        />
      </div>

      {filteredData.length === 0 ? (
        <Alert variant='info' title='No Results Found'>
          <p>{searchTerm ? `No migrations found matching "${searchTerm}"` : "No migration history available."}</p>
        </Alert>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredData.map((migration) => (
            <MigrationCard key={migration.move_id} migration={migration} />
          ))}
        </div>
      )}
    </div>
  );
};
