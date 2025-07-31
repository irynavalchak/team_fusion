'use client';

import React, {FC, useState, useEffect} from 'react';
import {toast} from 'react-toastify';
import useLoadingProjectContext from './hooks/useLoadingProjectContext';
import useCombinedContext from './hooks/useCombinedContext';
import {ProjectContextBlock} from 'typings/projectContext';
import ProjectContextSidebar from './components/project_context_sidebar';
import ProjectContextNavigation from './components/ProjectContextNavigation';
import NewBlockModal from './components/NewBlockModal';
import {useCurrentUser} from 'hooks/useCurrentUser';

const ProjectContextPage: FC = () => {
  const {contextBlocks, isLoading, selectedProjectId, error, refetch} = useLoadingProjectContext();
  const {getCurrentUserId} = useCurrentUser();
  const [selectedBlock, setSelectedBlock] = useState<ProjectContextBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCopyingContext, setIsCopyingContext] = useState(false);
  const [newlyCreatedPath, setNewlyCreatedPath] = useState<string | null>(null);

  // Auto-select newly created block when contextBlocks are updated
  useEffect(() => {
    if (newlyCreatedPath && contextBlocks && contextBlocks.length > 0) {
      const createdBlock = contextBlocks.find(block => block.path === newlyCreatedPath);
      if (createdBlock) {
        setSelectedBlock(createdBlock);
        setNewlyCreatedPath(null); // Clear the flag
      }
    }
  }, [contextBlocks, newlyCreatedPath]);

  // Use combined context hook (excluding prompts for general context)
  const {combinedContext} = useCombinedContext(contextBlocks, {includePrompts: false});

  const handleBlockSelect = (block: ProjectContextBlock) => {
    setSelectedBlock(block);
    // Clear the auto-select flag if user manually selects a block
    setNewlyCreatedPath(null);
  };

  const handleNewBlockClick = () => {
    setIsModalOpen(true);
  };

  const handleCreateBlock = async (title: string, path: string, content: string) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/project-context', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          project_id: selectedProjectId,
          path,
          content,
          title: title || null,
          updated_by: getCurrentUserId()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create block');
      }

      await response.json(); // Consume the response

      toast.success('Context block created successfully!');
      setIsModalOpen(false);

      // Set the path to auto-select when data is updated
      setNewlyCreatedPath(path);

      // Refresh the context blocks to get the latest data
      await refetch();
    } catch (error) {
      console.error('Error creating block:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create block');
      // Clear the auto-select flag on error
      setNewlyCreatedPath(null);
    } finally {
      setIsCreating(false);
    }
  };

  const handleBlockUpdate = (updatedBlock: ProjectContextBlock) => {
    // Update the selected block if it's the one being updated
    if (selectedBlock && selectedBlock.id === updatedBlock.id) {
      setSelectedBlock(updatedBlock);
    }

    // Optionally refresh the context blocks to get the latest data
    // This ensures the navigation panel shows updated information
    refetch();
  };

  const handleBlockDelete = (deletedBlockId: string) => {
    // Clear the selected block if it's the one being deleted
    if (selectedBlock && selectedBlock.id === deletedBlockId) {
      setSelectedBlock(null);
    }

    // Refresh the context blocks to get the latest data
    // This ensures the deleted block is removed from the navigation panel
    refetch();
  };

  const handleCopyProjectContext = async () => {
    if (!combinedContext.trim()) {
      toast.warning('No context available to copy');
      return;
    }

    setIsCopyingContext(true);
    try {
      await navigator.clipboard.writeText(combinedContext);
      toast.success('Project context copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy context:', error);
      toast.error('Failed to copy context to clipboard');
    } finally {
      setIsCopyingContext(false);
    }
  };

  return (
    <div className="container-fluid h-100" style={{minHeight: '100vh'}}>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center py-3 border-bottom">
        <h1 className="mb-0">Project Context</h1>
        {selectedProjectId && (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleCopyProjectContext}
              disabled={isCopyingContext || isLoading || !contextBlocks?.length}
              title="Copy all project context to clipboard">
              {isCopyingContext ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Copying...
                </>
              ) : (
                <>
                  <i className="bi bi-clipboard me-2"></i>
                  Copy Context
                </>
              )}
            </button>
            <button type="button" className="btn btn-outline-secondary" onClick={refetch} disabled={isLoading}>
              {isLoading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        )}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-danger mx-3 mt-3" role="alert">
          Error: {error}
        </div>
      )}

      {/* No Project Selected */}
      {!selectedProjectId && !isLoading && (
        <div className="alert alert-warning mx-3 mt-3" role="alert">
          No project selected. Please select a project from the dashboard first.
        </div>
      )}

      {/* Main Content */}
      {selectedProjectId && (
        <div className="row g-0 h-100">
          {/* Left Content Panel (80%) */}
          <div className="col-8" style={{height: 'calc(100vh - 100px)'}}>
            <ProjectContextSidebar
              selectedBlock={selectedBlock}
              onBlockUpdate={handleBlockUpdate}
              onBlockDelete={handleBlockDelete}
              contextBlocks={contextBlocks}
            />
          </div>

          {/* Right Navigation Panel (20%) */}
          <div className="col-4" style={{height: 'calc(100vh - 100px)'}}>
            <ProjectContextNavigation
              contextBlocks={contextBlocks}
              selectedBlock={selectedBlock}
              onBlockSelect={handleBlockSelect}
              onNewBlockClick={handleNewBlockClick}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}

      {/* New Block Modal */}
      <NewBlockModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNewlyCreatedPath(null); // Clear auto-select flag on modal close
        }}
        onCreate={handleCreateBlock}
        isCreating={isCreating}
        existingBlocks={contextBlocks || []}
      />
    </div>
  );
};

export default ProjectContextPage;
