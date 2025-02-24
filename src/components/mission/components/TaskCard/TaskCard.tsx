'use client';

import React from 'react';
import {Draggable} from '@hello-pangea/dnd';
import ProjectPopover from 'components/common/ProjectPopover/ProjectPopover';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
  };
  index: number;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({task, index, onEdit, onDelete}) => {
  return (
    <Draggable key={task.id} draggableId={task.id} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={styles.taskCard}>
          <ProjectPopover onEdit={() => onEdit(task.id)} onDelete={() => onDelete(task.id)} />

          <div className={styles.taskContent}>
            <div className={styles.taskTitle}>{task.title}</div>
            <div className={styles.taskDescription}>{task.description}</div>
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
