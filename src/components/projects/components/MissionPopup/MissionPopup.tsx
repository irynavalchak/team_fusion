import React, {useState} from 'react';

import {Button} from 'components/ui/button';
import {Textarea} from 'components/ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from 'components/ui/dialog';

import styles from './MissionPopup.module.css';

interface MissionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  missionId: string | null;
  missionName: string;
  setMissionName: (name: string) => void;
  onSave: (name: string) => void;
}

const MissionPopup: React.FC<MissionPopupProps> = ({
  isOpen,
  onClose,
  missionId,
  missionName: missionContent,
  onSave,
  setMissionName: setMissionContent
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{missionId ? 'Edit Mission' : 'Add New Mission'}</DialogTitle>
        </DialogHeader>
        <Textarea
          placeholder="Enter mission content"
          value={missionContent}
          onChange={e => setMissionContent(e.target.value)}
          rows={4}
        />
        <div className={styles.modalFooter}>
          <Button onClick={() => onSave(missionContent)}>{missionId ? 'Save Changes' : 'Save'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionPopup;
