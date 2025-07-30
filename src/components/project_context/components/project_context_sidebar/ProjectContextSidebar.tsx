'use client';

import React, {useState, useEffect} from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {FiEdit3, FiSave, FiX} from 'react-icons/fi';
import {Clipboard} from 'lucide-react';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {toast} from 'react-toastify';
import {ProjectContextBlock} from 'typings/projectContext';
import {updateProjectContextBlock} from 'services/apiService';
import {useCurrentUser} from 'hooks/useCurrentUser';
import styles from './projectContextSidebar.module.css';

interface ProjectContextSidebarProps {
  selectedBlock: ProjectContextBlock | null;
  onBlockUpdate?: (updatedBlock: ProjectContextBlock) => void;
}

const ProjectContextSidebar: React.FC<ProjectContextSidebarProps> = ({selectedBlock, onBlockUpdate}) => {
  const {requireAuth} = useCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset editing state when selected block changes
  useEffect(() => {
    if (selectedBlock) {
      setEditContent(selectedBlock.content);
      setIsEditing(false);
      setHasChanges(false);
    }
  }, [selectedBlock]);

  // Track changes in content
  useEffect(() => {
    if (selectedBlock && editContent !== selectedBlock.content) {
      setHasChanges(true);
    } else {
      setHasChanges(false);
    }
  }, [editContent, selectedBlock]);

  const handleEditToggle = () => {
    if (isEditing && hasChanges) {
      // Ask for confirmation if there are unsaved changes
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setEditContent(selectedBlock?.content || '');
        setIsEditing(false);
        setHasChanges(false);
      }
    } else {
      setIsEditing(!isEditing);
      if (!isEditing && selectedBlock) {
        setEditContent(selectedBlock.content);
      }
    }
  };

  const handleUpdate = async () => {
    if (!selectedBlock || !hasChanges) return;

    setIsUpdating(true);
    try {
      const userId = requireAuth(); // Will throw if not authenticated
      const updatedBlock = await updateProjectContextBlock(selectedBlock.id, editContent, userId);

      if (updatedBlock) {
        // Update the block with new data
        const newBlock = {
          ...selectedBlock,
          content: editContent,
          updatedAt: new Date().toISOString()
        };

        onBlockUpdate?.(newBlock);
        setIsEditing(false);
        setHasChanges(false);
        toast.success('Context block updated successfully!');
      }
    } catch (error) {
      console.error('Error updating block:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update context block';
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyContent = () => {
    if (selectedBlock?.content) {
      toast.success('Context copied to clipboard!');
    }
  };

  if (!selectedBlock) {
    return (
      <div className="h-100 d-flex align-items-center justify-content-center">
        <div className="text-center text-muted">
          <p>Select a context block to view its content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 d-flex flex-column">
      {/* Header section */}
      <div className="d-flex justify-content-between align-items-start p-3 border-bottom">
        <div className="flex-grow-1">
          <h4 className="mb-1">{selectedBlock.title}</h4>
          <small className="text-muted">
            <strong>Path:</strong> <code>{selectedBlock.path}</code>
          </small>
          <br />
          <small className="text-muted">
            <strong>Updated:</strong> {new Date(selectedBlock.updatedAt).toLocaleDateString()}
          </small>
          {selectedBlock.tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mt-1">
              {selectedBlock.tags.map((tag, index) => (
                <span key={index} className="badge bg-secondary">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="d-flex align-items-center gap-2 ms-3">
          {isEditing && hasChanges && (
            <button
              type="button"
              className={`btn btn-success btn-sm ${styles.actionButton}`}
              onClick={handleUpdate}
              disabled={isUpdating}
              title={isUpdating ? 'Saving changes...' : 'Save changes'}>
              <FiSave size={16} />
            </button>
          )}

          <CopyToClipboard text={selectedBlock.content || ''}>
            <button
              type="button"
              className={`btn btn-outline-secondary btn-sm ${styles.actionButton}`}
              onClick={handleCopyContent}
              title="Copy context to clipboard">
              <Clipboard size={16} />
            </button>
          </CopyToClipboard>

          <button
            type="button"
            className={`btn btn-sm ${isEditing ? 'btn-outline-secondary' : 'btn-outline-primary'} ${styles.actionButton}`}
            onClick={handleEditToggle}
            disabled={isUpdating}
            title={isEditing ? 'Cancel editing' : 'Edit content'}>
            {isEditing ? <FiX size={16} /> : <FiEdit3 size={16} />}
          </button>
        </div>
      </div>

      {/* Content section - takes all remaining space */}
      <div className="flex-grow-1 overflow-auto p-3">
        {isEditing ? (
          <textarea
            className={`form-control h-100 ${styles.textareaEdit}`}
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            placeholder="Enter markdown content..."
            disabled={isUpdating}
          />
        ) : (
          <div className={styles.markdownContent}>
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {selectedBlock.content
                // Восстанавливаем переносы строк для markdown
                .replace(/  ## /g, '\n\n## ') // Заголовки H2
                .replace(/  ### /g, '\n\n### ') // Заголовки H3
                .replace(/  # /g, '\n\n# ') // Заголовки H1 (если есть в середине)
                .replace(/  - /g, '\n- ') // Списки
                .replace(/  \d+\. /g, '\n$&') // Нумерованные списки
                .trim()}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectContextSidebar;
