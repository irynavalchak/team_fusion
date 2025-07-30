'use client';

import React, {FC} from 'react';
import useLoadingProjectContext from './hooks/useLoadingProjectContext';

const ProjectContextPage: FC = () => {
  const {contextBlocks, isLoading, selectedProjectId, error, refetch} = useLoadingProjectContext();

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Project Context</h1>
        {selectedProjectId && (
          <button type="button" className="btn btn-secondary" onClick={refetch} disabled={isLoading}>
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
      )}

      {!selectedProjectId && !isLoading && (
        <div className="alert alert-warning" role="alert">
          No project selected. Please select a project from the dashboard first.
        </div>
      )}

      {selectedProjectId && (
        <div className="card">
          <div className="card-header">
            <h5>Project ID: {selectedProjectId}</h5>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="text-center">
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading project context blocks...</p>
              </div>
            ) : (
              <>
                <h6>Context Blocks ({contextBlocks.length})</h6>
                {contextBlocks.length === 0 ? (
                  <p className="text-muted">No context blocks found for this project.</p>
                ) : (
                  <div className="row">
                    {contextBlocks.map(block => (
                      <div key={block.id} className="col-md-4 col-sm-6 mb-3">
                        <div className="card border-light h-100">
                          <div className="card-body">
                            <h6 className="card-title">{block.title}</h6>
                            <p className="card-text">
                              <small className="text-muted">ID: </small>
                              <code className="small">{block.id}</code>
                            </p>
                            <p className="card-text">
                              <small className="text-muted">Path: </small>
                              <span className="badge bg-light text-dark">{block.path}</span>
                            </p>
                            {block.tags.length > 0 && (
                              <div className="mt-2">
                                {block.tags.map((tag, index) => (
                                  <span key={index} className="badge bg-secondary me-1">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectContextPage;
