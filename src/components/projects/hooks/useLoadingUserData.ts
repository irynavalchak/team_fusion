import {useEffect, useState} from 'react';
import {useAppDispatch} from 'redux_state/hooks';
import {setUserData} from 'redux_state/reducers/projectsSlice';
import {getUserData} from 'services/apiService';

const useLoadingUserData = () => {
  const dispatch = useAppDispatch();
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(true);

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUserData(true);

      try {
        const userData = await getUserData();
        if (userData) {
          dispatch(setUserData(userData));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }

      setIsLoadingUserData(false);
    };

    fetchUsers();
  }, [dispatch]);

  return {isLoadingUserData};
};

export default useLoadingUserData;
