import React from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import styles from './UserIcon.module.css';

interface UserIconProps {
  name: string;
}

const UserIcon: React.FC<UserIconProps> = ({name}) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div className={styles.userIcon}>
            <span>{initials}</span>
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content className={styles.tooltipContent} side="top" align="center">
          {name}
          <Tooltip.Arrow className={styles.tooltipArrow} />
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default UserIcon;
