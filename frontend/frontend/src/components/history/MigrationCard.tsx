import React from "react";
import { MigrationRecord } from "../../types";
import { Badge } from "../common/Badge";
import { formatDate } from "../../utils/formatters";
import { FiUser, FiArrowRight, FiCalendar, FiCheckCircle, FiXCircle, FiClock } from "react-icons/fi";

export interface MigrationCardProps {
  migration: MigrationRecord;
}

export const MigrationCard: React.FC<MigrationCardProps> = ({ migration }) => {
  const getStatusVariant = () => {
    if (migration.status === "completed") return "success";
    if (migration.status === "failed") return "danger";
    return "warning";
  };

  const getStatusIcon = () => {
    if (migration.status === "completed") return <FiCheckCircle className='w-4 h-4' />;
    if (migration.status === "failed") return <FiXCircle className='w-4 h-4' />;
    return <FiClock className='w-4 h-4' />;
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-5 hover:shadow-lg transition-shadow'>
      <div className='flex items-start justify-between mb-4'>
        <div>
          <h3 className='font-bold text-lg text-gray-900'>{migration.client_name}</h3>
          <p className='text-sm text-gray-500'>Move ID: #{migration.move_id}</p>
        </div>
        <Badge variant={getStatusVariant()} size='md'>
          <span className='flex items-center gap-1'>
            {getStatusIcon()}
            {migration.status.charAt(0).toUpperCase() + migration.status.slice(1)}
          </span>
        </Badge>
      </div>

      <div className='space-y-3'>
        <div className='flex items-center gap-2 text-sm'>
          <span className='font-semibold text-gray-700 min-w-[100px]'>Type:</span>
          <Badge variant='info' size='sm'>
            {migration.move_type}
          </Badge>
        </div>

        {migration.move_type === "migration" && (
          <div className='flex items-center gap-2 text-sm'>
            <FiUser className='w-4 h-4 text-gray-400' />
            <span className='text-gray-600 truncate'>{migration.old_email || "N/A"}</span>
            <FiArrowRight className='w-4 h-4 text-gray-400 flex-shrink-0' />
            <span className='text-gray-900 truncate font-medium'>{migration.new_email}</span>
          </div>
        )}

        {migration.move_type === "offboard" && (
          <div className='flex items-center gap-2 text-sm'>
            <FiUser className='w-4 h-4 text-gray-400' />
            <span className='text-gray-600'>Offboarded to:</span>
            <span className='text-gray-900 font-medium truncate'>{migration.offboard_email}</span>
          </div>
        )}

        {migration.agency_account_used && (
          <div className='flex items-center gap-2 text-sm'>
            <span className='font-semibold text-gray-700 min-w-[100px]'>Agency Account:</span>
            <span className='text-gray-600 truncate'>{migration.agency_account_used}</span>
          </div>
        )}

        <div className='grid grid-cols-2 gap-2 text-sm pt-2 border-t border-gray-200'>
          {migration.ga_account_id && (
            <div>
              <span className='font-semibold text-gray-700'>GA ID:</span>
              <span className='text-gray-600 ml-2'>{migration.ga_account_id}</span>
            </div>
          )}
          {migration.gtm_account_id && (
            <div>
              <span className='font-semibold text-gray-700'>GTM ID:</span>
              <span className='text-gray-600 ml-2'>{migration.gtm_account_id}</span>
            </div>
          )}
        </div>

        <div className='flex items-center gap-2 text-xs text-gray-500 pt-2'>
          <FiCalendar className='w-3 h-3' />
          <span>{formatDate(migration.created_at)}</span>
        </div>
      </div>
    </div>
  );
};
