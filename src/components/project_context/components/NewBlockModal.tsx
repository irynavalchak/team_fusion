'use client';

import React, {useState} from 'react';
import {Button} from 'components/ui/button';
import {Input} from 'components/ui/input';
import {Textarea} from 'components/ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from 'components/ui/dialog';

interface NewBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, path: string, content: string) => void;
  isCreating: boolean;
}

const NewBlockModal: React.FC<NewBlockModalProps> = ({isOpen, onClose, onCreate, isCreating}) => {
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');
  const [content, setContent] = useState('');

  const handleCreate = () => {
    if (title.trim() && path.trim() && content.trim()) {
      onCreate(title, path, content);
      // Reset form
      setTitle('');
      setPath('');
      setContent('');
    }
  };

  const handleClose = () => {
    setTitle('');
    setPath('');
    setContent('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Context Block</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            placeholder="Block Title"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isCreating}
          />

          <Input
            placeholder="Path (e.g., features/auth/login)"
            value={path}
            onChange={e => setPath(e.target.value)}
            disabled={isCreating}
          />

          <Textarea
            placeholder="Content (Markdown supported)"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            disabled={isCreating}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating || !title.trim() || !path.trim() || !content.trim()}>
              {isCreating ? 'Creating...' : 'Create Block'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewBlockModal;
