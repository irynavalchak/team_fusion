import {useEffect, useCallback} from 'react';

import {useAppDispatch, useAppSelector} from 'redux_state/hooks';
import {setTransactions} from 'redux_state/reducers/financialSlice';

import {formatDate, getStartOfMonth, getEndOfMonth} from 'helpers/dateHelper';

import {getMonthlyTransactions} from 'services/apiService';

const useMonthlyTransactions = () => {
  const dispatch = useAppDispatch();

  const activeMonth = useAppSelector(state => state.financial.activeMonth);
  const activeOrganization = useAppSelector(state => state.financial.activeOrganization);

  const fetchTransactions = useCallback(async () => {
    const start = getStartOfMonth(activeMonth);
    const end = getEndOfMonth(activeMonth);

    const formattedStartDate = formatDate(start);
    const formattedEndDate = formatDate(end);

    const transactions = await getMonthlyTransactions(activeOrganization, formattedStartDate, formattedEndDate);

    dispatch(setTransactions(transactions));
  }, [activeMonth, activeOrganization, dispatch]);

  useEffect(() => {
    if (activeMonth && activeOrganization !== '') {
      fetchTransactions();
    }
  }, [activeMonth, activeOrganization, fetchTransactions]);
};

export default useMonthlyTransactions;
