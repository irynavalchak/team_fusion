import React from 'react';
import {Button} from 'components/ui/button';
import {Input} from 'components/ui/input';
import {Textarea} from 'components/ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from 'components/ui/dialog';

import styles from './NewDocumentPopup.module.css';

interface NewDocumentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (title: string, tagPath: string, content: string) => void;
}

const NewDocumentPopup: React.FC<NewDocumentPopupProps> = ({isOpen, onClose, onSave}) => {
  const [title, setTitle] = React.useState('');
  const [tagPath, setTagPath] = React.useState('');
  const [content, setContent] = React.useState('');

  const handleSave = () => {
    onSave(title, tagPath, content);
    onClose();
  };

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
        />
        <Input
          placeholder="Tag Path (e.g., orbios/devs/documents)"
          value={tagPath}
          onChange={e => setTagPath(e.target.value)}
          className={styles.inputField}
        />
        <Textarea
          placeholder="Enter document content"
          value={content}
          onChange={e => setContent(e.target.value)}
          rows={4}
          className={styles.textareaField}
        />
        <div className={styles.modalFooter}>
          <Button onClick={handleSave}>Create</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewDocumentPopup;
