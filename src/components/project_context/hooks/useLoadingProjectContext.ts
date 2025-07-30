import {useEffect, useState, useCallback} from 'react';
import {useAppDispatch, useAppSelector} from 'redux_state/hooks';
import {setProjectContextBlocks, setIsLoading, setSelectedProjectId} from 'redux_state/reducers/projectContextSlice';
import {getProjectContextBlocks} from 'services/apiService';

const useLoadingProjectContext = () => {
  const dispatch = useAppDispatch();
  const {contextBlocks, isLoading, selectedProjectId} = useAppSelector(state => state.projectContext);
  const [error, setError] = useState<string | null>(null);

  const fetchProjectContextBlocks = useCallback(
    async (projectId: number) => {
      try {
        dispatch(setIsLoading(true));
        dispatch(setSelectedProjectId(projectId));
        setError(null);

        const contextData = await getProjectContextBlocks(projectId);
        dispatch(setProjectContextBlocks(contextData));
      } catch (err) {
        console.error('Error fetching project context blocks:', err);
        setError(err instanceof Error ? err.message : 'Failed to load project context');
        dispatch(setProjectContextBlocks([]));
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch]
  );

  // Auto-load project context when component mounts
  useEffect(() => {
    const savedProjectId = localStorage.getItem('selectedProjectId');
    if (savedProjectId) {
      const projectId = parseInt(savedProjectId, 10);
      if (!isNaN(projectId) && projectId !== selectedProjectId) {
        fetchProjectContextBlocks(projectId);
      }
    }
  }, [fetchProjectContextBlocks, selectedProjectId]);

  return {
    contextBlocks,
    isLoading,
    selectedProjectId,
    error,
    refetch: () => selectedProjectId && fetchProjectContextBlocks(selectedProjectId)
  };
};

export default useLoadingProjectContext;
