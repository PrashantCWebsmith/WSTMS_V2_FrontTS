import React from 'react';
import Select, { type Props as SelectProps } from 'react-select';
import { cn } from '@/utils/cn';

interface SearchableSelectProps extends Omit<SelectProps, 'onChange' | 'value'> {
  label?: string;
  error?: string;
  value?: any;
  onChange?: (value: any) => void;
  options: { value: string | number; label: string }[];
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  error,
  options,
  value,
  onChange,
  className,
  ...props
}) => {
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: '0.75rem',
      borderColor: error ? '#EF4444' : state.isFocused ? '#3B82F6' : '#E5E7EB',
      boxShadow: state.isFocused ? (error ? '0 0 0 4px rgba(239, 68, 68, 0.1)' : '0 0 0 4px rgba(59, 130, 246, 0.1)') : 'none',
      '&:hover': {
        borderColor: error ? '#EF4444' : state.isFocused ? '#3B82F6' : '#D1D5DB',
      },
      padding: '2px 4px',
      fontSize: '0.875rem',
      transition: 'all 0.2s ease',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      fontSize: '0.875rem',
      padding: '8px 12px',
      '&:active': {
        backgroundColor: '#DBEAFE',
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9CA3AF',
    }),
  };

  const selectedOption = options.find(opt => opt.value === value) || null;

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="text-sm font-semibold text-gray-700 ml-0.5">
          {label}
        </label>
      )}
      <Select
        styles={{
          ...customStyles,
          menuPortal: (base) => ({ ...base, zIndex: 9999 })
        }}
        menuPortalTarget={document.body}
        options={options}
        value={selectedOption}
        onChange={(option: any) => onChange?.(option ? option.value : null)}
        className={cn("react-select-container", className)}
        classNamePrefix="react-select"
        isSearchable
        {...props}
      />
      {error && (
        <p className="text-xs text-red-500 ml-1 font-medium">
          {error}
        </p>
      )}
    </div>
  );
};
