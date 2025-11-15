// ============================================
// SRC/COMPONENTS/FORMS/MIGRATIONFORM.TSX
// ============================================
import React from "react";
import { Input } from "../common/Input";
import { Button } from "../common/Button";
import { AccountInputs } from "./AccountInputs";
import { FiUser, FiArrowRight } from "react-icons/fi";
import { FormData } from "../../types";

export interface MigrationFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  loading?: boolean;
  errors?: Record<string, string>;
}

export const MigrationForm: React.FC<MigrationFormProps> = ({
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
      <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 space-y-4'>
        <div className='flex items-center gap-2 mb-4'>
          <FiUser className='w-5 h-5 text-indigo-600' />
          <h3 className='text-lg font-semibold text-gray-800'>Client & User Information</h3>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <Input
            label='Client Name'
            placeholder='e.g., Acme Corporation'
            value={formData.clientName}
            onChange={(e) => onChange("clientName", e.target.value)}
            error={errors.clientName}
            required
          />

          <Input
            label='New User Email'
            type='email'
            placeholder='newuser@example.com'
            value={formData.newEmail}
            onChange={(e) => onChange("newEmail", e.target.value)}
            error={errors.newEmail}
            icon={<FiUser />}
            required
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
        <Button
          type='submit'
          variant='primary'
          size='lg'
          isLoading={loading}
          icon={<FiArrowRight />}
          className='flex-1'
        >
          Migrate User
        </Button>

        <Button type='button' variant='secondary' size='lg' onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </div>
    </form>
  );
};
