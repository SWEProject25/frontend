'use client';

import React from 'react';
import { SelectField } from '@/components/ui/SelectField';
import { MONTHS, DAYS, YEARS } from '@/components/ui/forms/constants';

export type DatePickerValue = {
  month?: string;
  day?: string;
  year?: string;
};

type DatePickerProps = {
  value?: DatePickerValue;
  onChange: (v: DatePickerValue) => void;
  /** optional aria / test id prefix */
  idPrefix?: string;
  className?: string;
  fullWidth?: boolean;
};

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  idPrefix = 'birth',
  className,
  fullWidth = false,
}) => {
  const month = value?.month ?? '';
  const day = value?.day ?? '';
  const year = value?.year ?? '';

  const handleMonth = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ month: e.target.value, day, year });

  const handleDay = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ month, day: e.target.value, year });

  const handleYear = (e: React.ChangeEvent<HTMLSelectElement>) =>
    onChange({ month, day, year: e.target.value });

  const monthClass = fullWidth ? 'w-1/2' : 'w-36';
  const dayClass = fullWidth ? 'w-2/10' : 'w-28';
  const yearClass = fullWidth ? 'w-3/10' : 'w-32';

  return (
    <div className={'flex items-center gap-3 ' + (className ?? '')}>
      <SelectField
        label="Month"
        name={`${idPrefix}Month`}
        options={MONTHS}
        value={month}
        onChange={handleMonth}
        data-testid={`${idPrefix}-month`}
        wrapperClassName={monthClass}
        fullWidth={fullWidth}
      />

      <SelectField
        label="Day"
        name={`${idPrefix}Day`}
        options={DAYS}
        value={day}
        onChange={handleDay}
        data-testid={`${idPrefix}-day`}
        wrapperClassName={dayClass}
        fullWidth={fullWidth}
      />

      <SelectField
        label="Year"
        name={`${idPrefix}Year`}
        options={YEARS}
        value={year}
        onChange={handleYear}
        data-testid={`${idPrefix}-year`}
        wrapperClassName={yearClass}
        fullWidth={fullWidth}
      />
    </div>
  );
};

export default DatePicker;
