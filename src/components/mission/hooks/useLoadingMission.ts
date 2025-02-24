import {useEffect, useState} from 'react';
import {useAppDispatch} from 'redux_state/hooks';
import {setSelectedMission} from 'redux_state/reducers/projectsSlice';
import {getMissionById} from 'services/apiService';

const useLoadingMission = (projectId: string, missionId: string) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMission = async () => {
      setIsLoading(true);

      try {
        const mission = await getMissionById(projectId, missionId);
        dispatch(setSelectedMission(mission));
      } catch (error) {
        console.error('Error fetching projects:', error);
      }

      setIsLoading(false);
    };

    fetchMission();
  }, [dispatch, projectId, missionId]);

  return {isLoading};
};

export default useLoadingMission;
