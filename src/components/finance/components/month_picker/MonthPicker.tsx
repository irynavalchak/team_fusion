import React from 'react';
import {Calendar as CalendarIcon} from 'lucide-react';
import {Calendar} from 'components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from 'components/ui/popover';
import {Button} from 'components/ui/button';

import {useAppSelector, useAppDispatch} from 'redux_state/hooks';
import {setActiveMonth} from 'redux_state/reducers/financialSlice';

import {formatMonthYear} from 'helpers/dateHelper';

const MonthPicker: React.FC = () => {
  const dispatch = useAppDispatch();

  const activeMonth = useAppSelector(state => state.financial.activeMonth);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatMonthYear(activeMonth)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={activeMonth}
          onSelect={date => {
            if (date) {
              dispatch(setActiveMonth(date));
            }
          }}
          initialFocus
          defaultMonth={activeMonth}
          showOutsideDays={false}
          fromDate={new Date(2024, 0)}
          toDate={new Date(2025, 11)}
        />
      </PopoverContent>
    </Popover>
  );
};

export default MonthPicker;
