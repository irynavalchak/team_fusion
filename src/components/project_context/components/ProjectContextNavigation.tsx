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
      block => block.title.toLowerCase().includes(query) || block.path.toLowerCase().includes(query)
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
            <div className="list-group list-group-flush">
              {filteredBlocks.map((block, index) => (
                <button
                  key={block.id}
                  type="button"
                  className={`list-group-item list-group-item-action p-2 border-0 ${
                    selectedBlock?.id === block.id ? 'bg-light border-start border-primary border-3' : 'hover-bg-light'
                  } ${index > 0 ? 'mt-2' : ''}`}
                  style={{
                    backgroundColor: selectedBlock?.id === block.id ? '#f8f9fa' : 'transparent',
                    borderLeft: selectedBlock?.id === block.id ? '3px solid #0d6efd' : 'none'
                  }}
                  onClick={() => onBlockSelect(block)}>
                  <div className="w-100">
                    <h6 className={`mb-1 small ${selectedBlock?.id === block.id ? 'text-primary fw-semibold' : ''}`}>
                      {block.title}
                    </h6>
                    <p className="mb-1" style={{fontSize: '0.75rem'}}>
                      <code className={selectedBlock?.id === block.id ? 'text-primary' : 'text-muted'}>
                        {block.path}
                      </code>
                    </p>
                    {block.tags.length > 0 && (
                      <div className="mt-1">
                        {block.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className={`badge me-1 ${
                              selectedBlock?.id === block.id
                                ? 'bg-primary bg-opacity-10 text-primary'
                                : 'bg-light text-dark'
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
                    <small className="text-muted d-block mt-1" style={{fontSize: '0.7rem'}}>
                      {new Date(block.updatedAt).toLocaleDateString()}
                    </small>
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
