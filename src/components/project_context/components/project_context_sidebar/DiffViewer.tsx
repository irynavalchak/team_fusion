'use client';

import React, {useMemo} from 'react';
import * as DMP from 'diff-match-patch';
import styles from './diffViewer.module.css';

interface DiffViewerProps {
  originalText: string;
  modifiedText: string;
}

interface DiffChunk {
  operation: number; // -1 = delete, 0 = equal, 1 = insert
  text: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({originalText, modifiedText}) => {
  const diffChunks: DiffChunk[] = useMemo(() => {
    const diffMatchPatch = new DMP.diff_match_patch();
    const diffs = diffMatchPatch.diff_main(originalText, modifiedText);
    diffMatchPatch.diff_cleanupSemantic(diffs);

    return diffs.map(([operation, text]: [number, string]) => ({
      operation,
      text
    }));
  }, [originalText, modifiedText]);

  const renderChunk = (chunk: DiffChunk, index: number) => {
    const {operation, text} = chunk;

    // Preserve line breaks and whitespace
    const lines = text.split('\n');

    return lines.map((line, lineIndex) => {
      const key = `${index}-${lineIndex}`;
      const isLastLine = lineIndex === lines.length - 1;

      if (operation === 0) {
        // Unchanged text
        return (
          <span key={key} className={styles.unchanged}>
            {line}
            {!isLastLine && <br />}
          </span>
        );
      } else if (operation === 1) {
        // Added text
        return (
          <span key={key} className={styles.added}>
            {line}
            {!isLastLine && <br />}
          </span>
        );
      } else {
        // Deleted text
        return (
          <span key={key} className={styles.deleted}>
            {line}
            {!isLastLine && <br />}
          </span>
        );
      }
    });
  };

  const stats = useMemo(() => {
    const added = diffChunks.filter(chunk => chunk.operation === 1).reduce((acc, chunk) => acc + chunk.text.length, 0);
    const deleted = diffChunks
      .filter(chunk => chunk.operation === -1)
      .reduce((acc, chunk) => acc + chunk.text.length, 0);
    const unchanged = diffChunks
      .filter(chunk => chunk.operation === 0)
      .reduce((acc, chunk) => acc + chunk.text.length, 0);

    return {added, deleted, unchanged};
  }, [diffChunks]);

  if (originalText === modifiedText) {
    return (
      <div className={styles.noDifferences}>
        <p className="text-muted text-center">
          <strong>No changes detected</strong>
        </p>
      </div>
    );
  }

  return (
    <div className={styles.diffContainer}>
      {/* Stats header */}
      <div className={styles.diffStats}>
        <div className="d-flex gap-3 text-sm">
          <span className={styles.addedStat}>
            <strong>+{stats.added}</strong> characters added
          </span>
          <span className={styles.deletedStat}>
            <strong>-{stats.deleted}</strong> characters removed
          </span>
          <span className="text-muted">
            <strong>{stats.unchanged}</strong> unchanged
          </span>
        </div>
      </div>

      {/* Diff content */}
      <div className={styles.diffContent}>
        <div className={styles.diffText}>{diffChunks.map((chunk, index) => renderChunk(chunk, index))}</div>
      </div>
    </div>
  );
};

export default DiffViewer;
