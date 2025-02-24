import React from 'react';
import {Popover, PopoverTrigger, PopoverContent} from 'components/ui/popover';
import {Edit, Trash, MoreVertical} from 'lucide-react';

import styles from './ProjectPopover.module.css';

interface ProjectPopoverProps {
  onEdit: () => void;
  onDelete: () => void;
}

const ProjectPopover: React.FC<ProjectPopoverProps> = ({onEdit, onDelete}) => {
  return (
    <Popover>
      <PopoverTrigger>
        <div className={styles.popoverDots}>
          <MoreVertical size={16} />
        </div>
      </PopoverTrigger>
      <PopoverContent className={styles.popoverContent}>
        <button className={styles.popoverButton} onClick={onEdit}>
          <Edit size={14} />
          <span className={styles.popoverText}>Edit</span>
        </button>
        <button className={styles.popoverButton} onClick={onDelete}>
          <Trash size={14} />
          <span className={styles.popoverText}>Delete</span>
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default ProjectPopover;
