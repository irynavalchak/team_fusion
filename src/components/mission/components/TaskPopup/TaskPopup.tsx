import React, {useState} from 'react';

import {Button} from 'components/ui/button';
import {Textarea} from 'components/ui/textarea';
import {Input} from 'components/ui/input';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from 'components/ui/dialog';

import styles from './TaskPopup.module.css';

interface TaskPopupProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  taskId: string | null;
  taskTitle: string;
  taskDescription: string;
  setTaskTitle: (title: string) => void;
  setTaskDescription: (description: string) => void;
  onSave: () => void;
}

const TaskPopup: React.FC<TaskPopupProps> = ({
  isOpen,
  onClose,
  missionId,
  taskId,
  taskTitle,
  taskDescription,
  setTaskTitle,
  setTaskDescription,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{taskId ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        </DialogHeader>

        {/* Поле для введення заголовку завдання */}
        <Input
          placeholder="Enter task title"
          value={taskTitle}
          onChange={e => setTaskTitle(e.target.value)}
          className={styles.inputField}
        />

        {/* Поле для введення опису завдання */}
        <Textarea
          placeholder="Enter task description"
          value={taskDescription}
          onChange={e => setTaskDescription(e.target.value)}
          rows={4}
          className={styles.textareaField}
        />

        <div className={styles.modalFooter}>
          <Button onClick={onSave}>{taskId ? 'Save Changes' : 'Save'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TaskPopup;
