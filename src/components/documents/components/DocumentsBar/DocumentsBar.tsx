'use client';

import React from 'react';

import {Button} from 'components/ui/button';
import {Plus} from 'lucide-react';

import Loader from 'components/common/Loader/Loader';

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
  const allLanguagesTranslated = selectedDocument?.documentContents.length === 3;

  return (
    <div className={styles.languageWrapper}>
      <Button variant="link" onClick={onCreateNewDocument} className={styles.newButton}>
        <Plus className="h-4 w-4" />
        New
      </Button>
      {!selectedDocument ? null : allLanguagesTranslated ? (
        <div className={styles.languageSelector}>
          <select value={selectedLanguage} onChange={e => onLanguageChange(e.target.value)}>
            {selectedDocument?.documentContents.map(content => (
              <option key={content.languageCode} value={content.languageCode}>
                {content.languageCode.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default DocumentsBar;
