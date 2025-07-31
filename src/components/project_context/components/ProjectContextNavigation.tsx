'use client';

import React, {useState, useMemo} from 'react';
import {Plus, Search} from 'lucide-react';
import {ProjectContextBlock} from 'typings/projectContext';
import {Button} from 'components/ui/button';
import {Input} from 'components/ui/input';

interface ProjectContextNavigationProps {
  contextBlocks: ProjectContextBlock[];
  selectedBlock: ProjectContextBlock | null;
  onBlockSelect: (block: ProjectContextBlock) => void;
  onNewBlockClick: () => void;
  isLoading: boolean;
}

const ProjectContextNavigation: React.FC<ProjectContextNavigationProps> = ({
  contextBlocks,
  selectedBlock,
  onBlockSelect,
  onNewBlockClick,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter blocks based on search query
  const filteredBlocks = useMemo(() => {
    if (!searchQuery.trim()) {
      return contextBlocks;
    }

    const query = searchQuery.toLowerCase();
    return contextBlocks.filter(
      block => block.title?.toLowerCase().includes(query) || false || block.path.toLowerCase().includes(query)
    );
  }, [contextBlocks, searchQuery]);

  return (
    <div className="h-100 p-3 border-start">
      {/* Search and Add Button */}
      <div className="mb-3">
        <div className="position-relative mb-2">
          <Search className="position-absolute top-50 start-0 translate-middle-y ms-2" size={16} />
          <Input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="ps-4 py-1"
            style={{fontSize: '0.9rem'}}
          />
        </div>

        <Button onClick={onNewBlockClick} className="w-100 py-1" size="sm" disabled={isLoading}>
          <Plus size={14} className="me-1" />
          New Block
        </Button>
      </div>

      {/* Blocks List */}
      <div className="border-top pt-3">
        <h6 className="mb-2 small">Blocks ({filteredBlocks.length})</h6>

        <div className="card border-0 shadow-sm">
          {isLoading ? (
            <div className="card-body text-center py-3">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted small mb-0">Loading...</p>
            </div>
          ) : filteredBlocks.length === 0 ? (
            <div className="card-body text-center text-muted small py-3">
              {searchQuery ? 'No matches' : 'No blocks found'}
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {filteredBlocks.map(block => (
                <button
                  key={block.id}
                  type="button"
                  className={`card border-0 shadow-sm p-3 text-start ${
                    selectedBlock?.id === block.id ? 'border-primary border-2' : ''
                  }`}
                  style={{
                    backgroundColor: selectedBlock?.id === block.id ? '#f8f9fa' : 'white',
                    borderLeft: selectedBlock?.id === block.id ? '4px solid #0d6efd' : 'none',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={e => {
                    if (selectedBlock?.id !== block.id) {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedBlock?.id !== block.id) {
                      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }
                  }}
                  onClick={() => onBlockSelect(block)}>
                  <div className="w-100">
                    {/* Header with title and date */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6
                        className={`mb-0 flex-grow-1 me-2 ${selectedBlock?.id === block.id ? 'text-primary fw-semibold' : 'text-dark fw-medium'}`}>
                        {block.title || block.path}
                      </h6>
                      <small className="text-muted text-nowrap" style={{fontSize: '0.7rem'}}>
                        {new Date(block.updatedAt).toLocaleDateString()}
                      </small>
                    </div>

                    {/* Path */}
                    <p className="mb-2" style={{fontSize: '0.75rem'}}>
                      <code
                        className={`${selectedBlock?.id === block.id ? 'text-primary' : 'text-muted'} bg-light px-2 py-1 rounded`}>
                        {block.path}
                      </code>
                    </p>

                    {/* Tags */}
                    {block.tags.length > 0 && (
                      <div className="mb-2">
                        {block.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className={`badge me-1 ${
                              selectedBlock?.id === block.id
                                ? 'bg-primary bg-opacity-15 text-primary border border-primary border-opacity-25'
                                : 'bg-light text-dark border'
                            }`}
                            style={{fontSize: '0.65rem'}}>
                            {tag}
                          </span>
                        ))}
                        {block.tags.length > 2 && (
                          <span className="text-muted" style={{fontSize: '0.7rem'}}>
                            +{block.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Content preview */}
                    {block.content && (
                      <p className="text-muted mb-0" style={{fontSize: '0.7rem', lineHeight: 1.4}}>
                        {block.content.length > 100 ? `${block.content.substring(0, 100)}...` : block.content}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectContextNavigation;
