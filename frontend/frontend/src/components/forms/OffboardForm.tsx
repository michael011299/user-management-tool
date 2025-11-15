import React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { AccountInputs } from "./AccountInputs";
import { FiUserX, FiShield } from "react-icons/fi";
import { FormData } from "../../types";

export interface OffboardFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export const OffboardForm: React.FC<OffboardFormProps> = ({
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
      <div className='bg-gradient-to-r from-red-50 to-pink-50 rounded-xl p-6 space-y-4'>
        <div className='flex items-center gap-2 mb-4'>
          <FiUserX className='w-5 h-5 text-red-600' />
          <h3 className='text-lg font-semibold text-gray-800'>Offboard Client</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Client Name'
            placeholder='e.g., Defunct Company'
            value={formData.clientName}
            onChange={(e) => onChange("clientName", e.target.value)}
            error={errors.clientName}
            required
          />

          <Input
            label='Offboard Account Email'
            type='email'
            placeholder='offboard@agency.com'
            value={formData.offboardEmail}
            onChange={(e) => onChange("offboardEmail", e.target.value)}
            error={errors.offboardEmail}
            icon={<FiShield />}
            required
            helperText='This account will maintain access after offboarding'
          />
        </div>
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
        <Button type='submit' variant='danger' size='lg' isLoading={loading} icon={<FiUserX />} className='flex-1'>
          Offboard Client
        </Button>

        <Button type='button' variant='secondary' size='lg' onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </form>
  );
};
