import {useEffect, useState} from 'react';
import {useAppDispatch} from 'redux_state/hooks';
import {setProjects} from 'redux_state/reducers/projectsSlice';
import {getProjects} from 'services/apiService';

const useLoadingProjects = () => {
  const dispatch = useAppDispatch();
  const [isLoadingProjects, setIsLoadingProjects] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoadingProjects(true);

      try {
        const projects = await getProjects();
        dispatch(setProjects(projects));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }

      setIsLoadingProjects(false);
    };

    fetchProjects();
  }, [dispatch]);

  return {isLoadingProjects};
};

export default useLoadingProjects;
