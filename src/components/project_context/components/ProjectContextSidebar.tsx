'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {ProjectContextBlock} from 'typings/projectContext';
import styles from './ProjectContextSidebar.module.css';

interface ProjectContextSidebarProps {
  selectedBlock: ProjectContextBlock | null;
}

const ProjectContextSidebar: React.FC<ProjectContextSidebarProps> = ({selectedBlock}) => {
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
    <div className="h-100 p-4">
      <div className="card h-100">
        <div className="card-header">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h4 className="mb-1">{selectedBlock.title}</h4>
              <small className="text-muted">
                <strong>Path:</strong> <code>{selectedBlock.path}</code>
              </small>
              <br />
              <small className="text-muted">
                <strong>Updated:</strong> {new Date(selectedBlock.updatedAt).toLocaleDateString()}
              </small>
            </div>
            {selectedBlock.tags.length > 0 && (
              <div className="d-flex flex-wrap gap-1">
                {selectedBlock.tags.map((tag, index) => (
                  <span key={index} className="badge bg-secondary">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card-body overflow-auto">
          <div className="bg-light rounded p-3" style={{minHeight: '200px'}}>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectContextSidebar;
