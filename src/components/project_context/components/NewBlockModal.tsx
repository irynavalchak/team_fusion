'use client';

import React, {useState} from 'react';
import {Button} from 'components/ui/button';
import {Input} from 'components/ui/input';
import {Textarea} from 'components/ui/textarea';
import {Dialog, DialogContent, DialogHeader, DialogTitle} from 'components/ui/dialog';
import {ProjectContextBlock} from 'typings/projectContext';

interface NewBlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (title: string, path: string, content: string) => void;
  isCreating: boolean;
  existingBlocks?: ProjectContextBlock[];
}

const NewBlockModal: React.FC<NewBlockModalProps> = ({isOpen, onClose, onCreate, isCreating, existingBlocks = []}) => {
  const [title, setTitle] = useState('');
  const [path, setPath] = useState('');
  const [content, setContent] = useState('');
  const [pathError, setPathError] = useState('');

  // Validation for path format
  const validatePath = (pathValue: string): string => {
    if (!pathValue.trim()) {
      return 'Path is required';
    }

    // Check if path matches the required format: overview/project_overview or just overview
    const pathRegex = /^[a-z0-9_]+(?:\/[a-z0-9_]+)*$/;
    if (!pathRegex.test(pathValue.trim())) {
      return 'Path must be in format like "overview" or "overview/project_overview" (lowercase, underscores, slashes only)';
    }

    // Check if path is unique
    const isPathExists = existingBlocks.some(block => block.path === pathValue.trim());
    if (isPathExists) {
      return 'This path already exists. Please choose a different path.';
    }

    return '';
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = e.target.value;
    setPath(newPath);

    if (newPath.trim()) {
      const error = validatePath(newPath);
      setPathError(error);
    } else {
      setPathError('');
    }
  };

  const handleCreate = () => {
    const pathError = validatePath(path);
    if (pathError) {
      setPathError(pathError);
      return;
    }

    if (path.trim()) {
      // If content is empty, we'll add a placeholder (this will be handled in the parent component)
      onCreate(title.trim() || '', path.trim(), content.trim());
      // Reset form
      setTitle('');
      setPath('');
      setContent('');
      setPathError('');
    }
  };

  const handleClose = () => {
    setTitle('');
    setPath('');
    setContent('');
    setPathError('');
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
            placeholder="Block Title (optional)"
            value={title}
            onChange={e => setTitle(e.target.value)}
            disabled={isCreating}
          />

          <div>
            <Input
              placeholder="Path (e.g., overview/project_overview or overview)"
              value={path}
              onChange={handlePathChange}
              disabled={isCreating}
              className={pathError ? 'border-red-500' : ''}
            />
            {pathError && <p className="text-red-500 text-sm mt-1">{pathError}</p>}
          </div>

          <Textarea
            placeholder="Content (Markdown supported, will use default if empty)"
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={6}
            disabled={isCreating}
          />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={isCreating || !path.trim() || !!pathError}>
              {isCreating ? 'Creating...' : 'Create Block'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewBlockModal;
