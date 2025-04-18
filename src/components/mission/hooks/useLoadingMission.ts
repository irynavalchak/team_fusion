import {useEffect, useState} from 'react';
import {useAppDispatch} from 'redux_state/hooks';
import {setSelectedMission} from 'redux_state/reducers/projectsSlice';
import {getMissionById} from 'services/apiService';
import {Mission as ApiMission} from 'typings/project';

type MissionStatus = 'todo' | 'doing' | 'review' | 'done';
interface ReduxMission {
  id: string;
  name: string;
  status: MissionStatus;
  createdAt: string;
  tasks: {
    id: string;
    title: string;
    description: string;
    status: MissionStatus;
    createdAt: string;
  }[];
}

const useLoadingMission = (projectId: string, missionId: string) => {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMission = async () => {
      setIsLoading(true);

      try {
        const apiMission = await getMissionById(projectId, missionId);

        if (apiMission) {
          const mission: ReduxMission = {
            id: apiMission.id,
            name: apiMission.name,
            status: apiMission.status as MissionStatus,
            createdAt: apiMission.createdAt,
            tasks: apiMission.tasks.map(task => ({
              id: task.id,
              title: task.title,
              description: task.description,
              status: task.status as MissionStatus,
              createdAt: task.createdAt
            }))
          };
          dispatch(setSelectedMission(mission));
        } else {
          dispatch(setSelectedMission(null));
        }
      } catch (error) {
        console.error('Error fetching mission:', error);
        dispatch(setSelectedMission(null));
      }

      setIsLoading(false);
    };

    fetchMission();
  }, [dispatch, projectId, missionId]);

  return {isLoading};
};

export default useLoadingMission;
