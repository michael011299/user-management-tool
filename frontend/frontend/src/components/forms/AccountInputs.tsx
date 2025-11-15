import React from "react";
import { Input } from "../common/Input";
import { FiDatabase } from "react-icons/fi";

export interface AccountInputsProps {
  gaAccountId: string;
  gtmAccountId: string;
  gtmContainerId: string;
  onChange: (field: string, value: string) => void;
  errors?: Record<string, string>;
}

export const AccountInputs: React.FC<AccountInputsProps> = ({
  gaAccountId,
  gtmAccountId,
  gtmContainerId,
  onChange,
  errors = {},
}) => {
  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2 mb-4'>
        <FiDatabase className='w-5 h-5 text-primary-600' />
        <h3 className='text-lg font-semibold text-gray-800'>Account Information</h3>
      </div>

      <Input
        label='Google Analytics Account ID'
        placeholder='e.g., 123456789'
        value={gaAccountId}
        onChange={(e) => onChange("gaAccountId", e.target.value)}
        error={errors.gaAccountId}
        helperText='At least one account ID is required'
      />

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <Input
          label='GTM Account ID'
          placeholder='e.g., 987654321'
          value={gtmAccountId}
          onChange={(e) => onChange("gtmAccountId", e.target.value)}
          error={errors.gtmAccountId}
        />

        <Input
          label='GTM Container ID'
          placeholder='e.g., 111222333'
          value={gtmContainerId}
          onChange={(e) => onChange("gtmContainerId", e.target.value)}
          helperText='Optional'
        />
      </div>
    </div>
  );
};
