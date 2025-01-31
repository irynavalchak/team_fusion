import {useEffect, useState} from 'react';

import {useAppDispatch} from 'redux_state/hooks';
import {setOrganizations, setAccounts, setTransactionCategories} from 'redux_state/reducers/financialSlice';

import {getOrganizations, getAccounts, getTransactionCategories} from 'services/apiService';

const useLoadInitialData = () => {
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDishes = async () => {
      setIsLoading(true);

      const accounts = await getAccounts();
      dispatch(setAccounts(accounts));

      const organizations = await getOrganizations();
      dispatch(setOrganizations(organizations));

      const transactionCategories = await getTransactionCategories();
      dispatch(setTransactionCategories(transactionCategories));

      setIsLoading(false);
    };

    fetchDishes();
  }, []);

  return {isLoading};
};

export default useLoadInitialData;
