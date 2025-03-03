'use client';

import React, {useState} from 'react';

import {Button} from 'components/ui/button';
import {Input} from 'components/ui/input';
import {Textarea} from 'components/ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from 'components/ui/dialog';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from 'components/ui/select';

import Loader from 'components/common/Loader/Loader';

import styles from './NewDocumentPopup.module.css';

interface NewDocumentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, tagPath: string) => void;
  isCreating: boolean;
  documentId: number | null;
  onSaveContent: (language: string, content: string) => void;
}

const NewDocumentPopup: React.FC<NewDocumentPopupProps> = ({
  isOpen,
  onClose,
  onCreate,
  isCreating,
  documentId,
  onSaveContent
}) => {
  const [title, setTitle] = useState('');
  const [tagPath, setTagPath] = useState('');
  const [language, setLanguage] = useState('en');
  const [content, setContent] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Document</DialogTitle>
        </DialogHeader>

        <Input
          placeholder="Document Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={styles.inputField}
          disabled={!!documentId}
        />
        <Input
          placeholder="Tag Path (e.g., orbios/devs/documents)"
          value={tagPath}
          onChange={e => setTagPath(e.target.value)}
          className={styles.inputField}
          disabled={!!documentId}
        />

        {!documentId ? (
          <div className={styles.modalFooter}>
            <Button onClick={() => onCreate(title, tagPath)} disabled={isCreating}>
              {isCreating ? <Loader /> : 'Create Document'}
            </Button>
          </div>
        ) : (
          <>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className={styles.inputField}>
                <SelectValue placeholder="Select Language" />
              </SelectTrigger>
              <SelectContent>
                {/* Currently only English is added as the original language */}
                <SelectItem value="en">English</SelectItem>
                {/* <SelectItem value="ru">Russian</SelectItem> */}
                {/* <SelectItem value="th">Thai</SelectItem> */}
              </SelectContent>
            </Select>

            <Textarea
              placeholder="Enter document content"
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={4}
              className={styles.textareaField}
            />
            <div className={styles.modalFooter}>
              <Button onClick={() => onSaveContent(language, content)}>Save Content</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentPopup;
