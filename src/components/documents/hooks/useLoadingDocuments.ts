import {useEffect, useState} from 'react';
import {useAppDispatch} from 'redux_state/hooks';
import {setDocuments} from 'redux_state/reducers/documentsSlice';
import {getAllDocuments} from 'services/apiService';

const useLoadingDocuments = () => {
  const dispatch = useAppDispatch();
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(true);

  useEffect(() => {
    const fetchDocuments = async () => {
      setIsLoadingDocuments(true);

      try {
        const documents = await getAllDocuments();
        dispatch(setDocuments(documents));
      } catch (error) {
        console.error('Error fetching documents:', error);
      }

      setIsLoadingDocuments(false);
    };

    fetchDocuments();
  }, [dispatch]);

  return {isLoadingDocuments};
};

export default useLoadingDocuments;
