'use client';

import React, {useState} from 'react';

import {DragDropContext, Droppable, DropResult} from '@hello-pangea/dnd';
import {Card, CardContent, CardHeader, CardTitle} from 'components/ui/card';
import {Plus} from 'lucide-react';

import {useAppSelector, useAppDispatch} from 'redux_state/hooks';
import {
  updateProjectName,
  updateMission,
  addMission,
  deleteMission,
  reorderMissions,
  moveMission
} from 'redux_state/reducers/projectsSlice';

import useLoadingProjects from './hooks/useLoadingProjects';
import useLoadingUserData from './hooks/useLoadingUserData';

import MissionPopup from './components/MissionPopup/MissionPopup';
import MissionCard from './components/MissionCard/MissionCard';
import Confirmation from '../common/Confirmation/Confirmation';

import styles from './ProjectsPage.module.css';

const ProjectsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [isMissionModalOpen, setIsMissionModalOpen] = useState(false);
  const [missionName, setMissionName] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [missionToDelete, setMissionToDelete] = useState<{projectId: string; missionId: string} | null>(null);

  const projects = useAppSelector(state => state.projects.projects);
  const userData = useAppSelector(state => state.projects.userData);
  const missionUsers: MissionUser[] | null = userData && userData?.missionUsers;
  const users: User[] | null = userData && userData?.users;

  const {isLoadingProjects} = useLoadingProjects();
  const {isLoadingUserData} = useLoadingUserData();

  const handleProjectNameDoubleClick = (project: Project) => {
    setEditingProjectId(project.id);
    setNewProjectName(project.name);
  };

  const handleProjectNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewProjectName(event.target.value);
  };

  const handleProjectNameBlur = (projectId: string) => {
    if (newProjectName.trim() && newProjectName !== projects.find(p => p.id === projectId)?.name) {
      dispatch(updateProjectName({projectId: projectId, name: newProjectName.trim()}));
    }
    setEditingProjectId(null);
    setNewProjectName('');
  };

  const onDragEnd = (result: DropResult) => {
    const {source, destination} = result;
    if (!destination) return;

    if (source.droppableId === destination.droppableId) {
      dispatch(
        reorderMissions({
          projectId: source.droppableId,
          startIndex: source.index,
          endIndex: destination.index
        })
      );
    } else {
      dispatch(
        moveMission({
          sourceProjectId: source.droppableId,
          destinationProjectId: destination.droppableId,
          startIndex: source.index,
          endIndex: destination.index
        })
      );
    }
  };

  const openMissionModal = (projectId: string, missionId?: string) => {
    setSelectedProjectId(projectId);
    setSelectedMissionId(missionId || null);

    if (missionId) {
      const project = projects.find(proj => proj.id === projectId);
      const mission = project?.missions.find(mis => mis.id === missionId);
      if (mission) setMissionName(mission.name);
    } else {
      setMissionName('');
    }

    setIsMissionModalOpen(true);
  };

  const closeMissionModal = () => {
    setIsMissionModalOpen(false);
    setMissionName('');
    setSelectedProjectId(null);
    setSelectedMissionId(null);
  };

  const handleSaveMission = (missionName: string) => {
    if (!missionName.trim() || selectedProjectId === null) return;

    if (selectedMissionId !== null) {
      dispatch(
        updateMission({
          projectId: selectedProjectId,
          missionId: selectedMissionId,
          name: missionName
        })
      );
    } else {
      dispatch(
        addMission({
          projectId: selectedProjectId,
          name: missionName
        })
      );
    }

    closeMissionModal();
  };

  // Функція для відкриття попапу підтвердження
  const handleDeleteMission = (projectId: string, missionId: string) => {
    setMissionToDelete({projectId, missionId});
    setIsConfirmationOpen(true);
  };

  // Функція для підтвердження видалення
  const confirmDelete = () => {
    if (missionToDelete) {
      dispatch(
        deleteMission({
          projectId: missionToDelete.projectId,
          missionId: missionToDelete.missionId
        })
      );
      setMissionToDelete(null);
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setMissionToDelete(null);
    setIsConfirmationOpen(false);
  };

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.columns}>
          {projects?.map(project => (
            <Droppable key={project.id} droppableId={project.id.toString()}>
              {provided => (
                <Card {...provided.droppableProps} ref={provided.innerRef} className={styles.column}>
                  <CardHeader className={styles.projectHeader}>
                    <CardTitle onDoubleClick={() => handleProjectNameDoubleClick(project)}>
                      {editingProjectId === project.id ? (
                        <input
                          value={newProjectName}
                          onChange={handleProjectNameChange}
                          onBlur={() => handleProjectNameBlur(project.id)}
                          autoFocus
                        />
                      ) : (
                        project.name
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={styles.missionsContainer}>
                    {project.missions.map((mission, index) => (
                      <MissionCard
                        key={mission.id}
                        mission={mission}
                        projectId={project.id}
                        index={index}
                        onEdit={openMissionModal}
                        onDelete={handleDeleteMission}
                        users={(missionUsers?.filter(mu => mu.missionId === mission.id) || []).map(mu => ({
                          id: mu.userId,
                          name: users?.find(u => u.id === mu.userId)?.name || 'Unknown'
                        }))}
                      />
                    ))}
                    {provided.placeholder}
                  </CardContent>
                  <div className={styles.addMissionButtonContainer}>
                    <button className={styles.addMissionButton} onClick={() => openMissionModal(project.id)}>
                      <Plus size={16} /> Add Mission
                    </button>
                  </div>
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <MissionPopup
        isOpen={isMissionModalOpen}
        onClose={closeMissionModal}
        missionId={selectedMissionId}
        missionName={missionName}
        setMissionName={setMissionName}
        onSave={handleSaveMission}
      />

      <Confirmation
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this mission?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default ProjectsPage;
