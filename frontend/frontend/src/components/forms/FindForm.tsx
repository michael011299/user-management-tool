import React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { AccountInputs } from "./AccountInputs";
import { FiSearch } from "react-icons/fi";
import { FormData } from "../../types";

export interface FindFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export const FindForm: React.FC<FindFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onReset,
  loading = false,
  errors = {},
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      <div className='bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-6 space-y-4'>
        <div className='flex items-center gap-2 mb-4'>
          <FiSearch className='w-5 h-5 text-blue-600' />
          <h3 className='text-lg font-semibold text-gray-800'>Search Criteria</h3>
        </div>

        <Input
          label='Client Name'
          placeholder='e.g., Acme Corporation'
          value={formData.clientName}
          onChange={(e) => onChange("clientName", e.target.value)}
          error={errors.clientName}
          helperText='Optional - helps identify the correct account'
        />
      </div>

      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6'>
        <AccountInputs
          gaAccountId={formData.gaAccountId}
          gtmAccountId={formData.gtmAccountId}
          gtmContainerId={formData.gtmContainerId}
          onChange={onChange}
          errors={errors}
        />
      </div>

      <div className='flex gap-4'>
        <Button type='submit' variant='primary' size='lg' isLoading={loading} icon={<FiSearch />} className='flex-1'>
          Find Account
        </Button>

        <Button type='button' variant='secondary' size='lg' onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </form>
  );
};
