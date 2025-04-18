'use client';

import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/navigation';
import {Plus, ArrowLeft} from 'lucide-react';
import {DragDropContext, Droppable, DropResult} from '@hello-pangea/dnd';

import {useAppSelector, useAppDispatch} from 'redux_state/hooks';
import {deleteTask} from 'redux_state/reducers/projectsSlice';

import {Card, CardContent, CardHeader, CardTitle} from 'components/ui/card';

import useLoadingMission from './hooks/useLoadingMission';
import TaskPopup from './components/TaskPopup/TaskPopup';
import Loader from 'components/common/Loader/Loader';
import TaskCard from './components/TaskCard/TaskCard';
import Confirmation from '../common/Confirmation/Confirmation';

import styles from './MissionPage.module.css';
import {Task as ApiTask} from 'typings/project';

// Define the internal Task type with strict status values
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'doing' | 'review' | 'done';
  createdAt: string;
}

interface MissionPageProps {
  projectId: string;
  missionId: string;
}

const MissionPage: React.FC<MissionPageProps> = ({projectId, missionId}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const selectedMission = useAppSelector(state => state.projects.selectedMission);

  const [tasks, setTasks] = useState<Task[]>([]);

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  const {isLoading} = useLoadingMission(projectId, missionId);

  const statusColumns = ['todo', 'doing', 'review', 'done'] as const;

  useEffect(() => {
    if (selectedMission) {
      // Convert API tasks to our internal Task type with strict status
      const convertedTasks: Task[] = selectedMission.tasks.map(apiTask => ({
        id: apiTask.id,
        title: apiTask.title,
        description: apiTask.description,
        status: apiTask.status as 'todo' | 'doing' | 'review' | 'done',
        createdAt: apiTask.createdAt
      }));

      setTasks(convertedTasks);
    }
  }, [selectedMission]);

  const onDragEnd = (result: DropResult) => {
    const {source, destination} = result;
    if (!destination) return;

    const task = tasks.find(task => task.id === result.draggableId);
    if (task) {
      const newStatus = destination.droppableId as Task['status'];
      const updatedTask = {...task, status: newStatus};

      setTasks(prevTasks => prevTasks.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    }
  };

  const openTaskPopup = (taskId: string | null) => {
    setSelectedTaskId(taskId);
    if (taskId) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        setTaskTitle(task.title);
        setTaskDescription(task.description);
      }
    } else {
      setTaskTitle('');
      setTaskDescription('');
    }
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDescription('');
    setSelectedTaskId(null);
  };

  const handleSaveTask = () => {
    if (!taskTitle.trim()) return;

    setTasks(prevTasks => {
      if (selectedTaskId) {
        return prevTasks.map(t =>
          t.id === selectedTaskId ? {...t, title: taskTitle, description: taskDescription} : t
        );
      } else {
        const newTask: Task = {
          id: Date.now().toString(),
          title: taskTitle,
          description: taskDescription,
          status: 'todo',
          createdAt: new Date().toISOString()
        };
        return [...prevTasks, newTask];
      }
    });

    closeTaskModal();
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete));
      setTaskToDelete(null);
    }
    setIsConfirmationOpen(false);
  };

  const cancelDelete = () => {
    setTaskToDelete(null);
    setIsConfirmationOpen(false);
  };

  return (
    <div className={styles.container}>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.columns}>
          {statusColumns.map(status => (
            <Droppable key={status} droppableId={status}>
              {provided => (
                <Card {...provided.droppableProps} ref={provided.innerRef} className={styles.column}>
                  <CardHeader>
                    {status === 'todo' ? (
                      <div className={styles.missionHeader}>
                        <button className={styles.missionArrow} onClick={() => router.push('/projects')}>
                          <ArrowLeft size={16} />
                        </button>
                        <h1>MISSION:</h1>
                      </div>
                    ) : null}
                    <CardTitle>
                      {status === 'todo' ? (
                        <div className={styles.missionTitle}>
                          {selectedMission?.name ? selectedMission?.name : <Loader />}
                        </div>
                      ) : (
                        <div className={styles.missionHeader}>{status.toUpperCase()}</div>
                      )}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className={styles.missionsContainer}>
                    {tasks
                      .filter(task => task.status === status)
                      .map((task, index) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={index}
                          onEdit={openTaskPopup}
                          onDelete={handleDeleteTask}
                        />
                      ))}
                    {provided.placeholder}
                  </CardContent>

                  {status === 'todo' && (
                    <div className={styles.addMissionButtonContainer}>
                      <button className={styles.addMissionButton} onClick={() => openTaskPopup(null)}>
                        <Plus size={16} /> Add Task
                      </button>
                    </div>
                  )}
                </Card>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      <TaskPopup
        isOpen={isTaskModalOpen}
        onClose={closeTaskModal}
        taskId={selectedTaskId}
        taskTitle={taskTitle}
        taskDescription={taskDescription}
        setTaskTitle={setTaskTitle}
        setTaskDescription={setTaskDescription}
        onSave={handleSaveTask}
      />

      <Confirmation
        isOpen={isConfirmationOpen}
        message="Are you sure you want to delete this task?"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default MissionPage;
