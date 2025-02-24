import React from 'react';
import {useRouter} from 'next/navigation';

import {Draggable} from '@hello-pangea/dnd';
import ProjectPopover from 'components/common/ProjectPopover/ProjectPopover';
import {ArrowRight} from 'lucide-react';

import UserIcon from 'components/common/UserIcon/UserIcon';

import styles from './MissionCard.module.css';

interface MissionCardProps {
  mission: {
    id: string;
    name: string;
  };
  projectId: string;
  index: number;
  onEdit: (projectId: string, missionId: string) => void;
  onDelete: (projectId: string, missionId: string) => void;
  users: {id: string; name: string}[];
}

const MissionCard: React.FC<MissionCardProps> = ({mission, projectId, index, onEdit, onDelete, users}) => {
  const router = useRouter();

  const renderUserIcon = () => {
    return (
      <div className={styles.missionFooter}>
        <div className={styles.userIconsContainer}>
          {users.map(user => (
            <UserIcon key={user.id} name={user.name} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <Draggable key={mission.id} draggableId={mission.id.toString()} index={index}>
      {provided => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={styles.mission}>
          <div className={styles.missionHeader}>
            <ProjectPopover
              onEdit={() => onEdit(projectId, mission.id)}
              onDelete={() => onDelete(projectId, mission.id)}
            />

            <span className={styles.missionName}>{mission.name}</span>

            <button className={styles.missionArrow} onClick={() => router.push(`/projects/${projectId}/${mission.id}`)}>
              <ArrowRight size={16} />
            </button>
          </div>

          {users && users.length > 0 ? renderUserIcon() : null}
        </div>
      )}
    </Draggable>
  );
};

export default MissionCard;
