'use client';

import React, {FC, useState, useMemo} from 'react';
import {toast} from 'react-toastify';
import useLoadingProjectContext from './hooks/useLoadingProjectContext';
import {ProjectContextBlock} from 'typings/projectContext';
import ProjectContextSidebar from './components/project_context_sidebar';
import ProjectContextNavigation from './components/ProjectContextNavigation';
import NewBlockModal from './components/NewBlockModal';

const ProjectContextPage: FC = () => {
  const {contextBlocks, isLoading, selectedProjectId, error, refetch} = useLoadingProjectContext();
  const [selectedBlock, setSelectedBlock] = useState<ProjectContextBlock | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isCopyingContext, setIsCopyingContext] = useState(false);

  // Prepare combined context content for copying
  const combinedContext = useMemo(() => {
    if (!contextBlocks || contextBlocks.length === 0) {
      return '';
    }

    return contextBlocks
      .map(block => {
        const header = `# ${block.title}`;
        const pathInfo = block.path ? `**Path:** ${block.path}` : '';
        const tagsInfo = block.tags && block.tags.length > 0 ? `**Tags:** ${block.tags.join(', ')}` : '';
        const metadata = [pathInfo, tagsInfo].filter(Boolean).join('\n');
        const content = block.content || '';

        return [header, metadata, '', content].filter(Boolean).join('\n');
      })
      .join('\n\n---\n\n');
  }, [contextBlocks]);

  const handleBlockSelect = (block: ProjectContextBlock) => {
    setSelectedBlock(block);
  };

  const handleNewBlockClick = () => {
    setIsModalOpen(true);
  };

  const handleCreateBlock = async (title: string, path: string, content: string) => {
    setIsCreating(true);
    try {
      // TODO: Implement API call for creating new block
      console.log('Creating new block:', {title, path, content, projectId: selectedProjectId});

      // Placeholder for now - just show success message
      toast.success('Block creation will be implemented soon!');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating block:', error);
      toast.error('Failed to create block');
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
            <ProjectContextSidebar selectedBlock={selectedBlock} onBlockUpdate={handleBlockUpdate} />
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
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateBlock}
        isCreating={isCreating}
      />
    </div>
  );
};

export default ProjectContextPage;
