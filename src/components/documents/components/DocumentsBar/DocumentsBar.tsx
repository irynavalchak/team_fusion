'use client';

import React from 'react';

import {Button} from 'components/ui/button';
import {Plus} from 'lucide-react';

import styles from './DocumentsBar.module.css';

interface DocumentsBarProps {
  onCreateNewDocument: () => void;
  selectedDocument: UserDocument | null;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
}

const DocumentsBar: React.FC<DocumentsBarProps> = ({
  onCreateNewDocument,
  selectedDocument,
  selectedLanguage,
  onLanguageChange
}) => {
  return (
    <div className={styles.actionWrapper}>
      <Button variant="link" onClick={onCreateNewDocument} className={styles.newButton}>
        <Plus className="h-4 w-4" />
        New
      </Button>
    </div>
  );
};

export default DocumentsBar;
