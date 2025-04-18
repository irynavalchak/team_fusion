'use client';

import React from 'react';

import {Button} from 'components/ui/button';
import {Plus} from 'lucide-react';

import styles from './DocumentsBar.module.css';

interface Props {
  onCreateNewDocument: () => void;
}

const DocumentsBar: React.FC<Props> = ({onCreateNewDocument}) => {
  return (
    <div className={styles.actionWrapper}>
      <Button variant="link" onClick={onCreateNewDocument} className={styles.newButton}>
        <Plus className="h-5 w-5 mr-2" />
        New Document
      </Button>
    </div>
  );
};

export default DocumentsBar;
