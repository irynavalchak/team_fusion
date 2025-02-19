'use client';

import {ReactNode} from 'react';
import {Button} from 'components/ui/button';
import {ScrollArea} from 'components/ui/scroll-area';
import {Textarea} from 'components/ui/textarea';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import ImageCarousel from 'components/land/components/image_carousel/ImageCarousel';

import styles from './ManagerWrapper.module.css';

interface ManagerWrapperProps {
  children: ReactNode;
  selectedItem: string | null;
  fileContent: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onContentChange: (content: string) => void;
  title: string;
  images?: string[];
  basePath?: string;
}

export default function ManagerWrapper({
  children,
  selectedItem,
  fileContent,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onContentChange,
  title,
  images,
  basePath
}: ManagerWrapperProps) {
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {!selectedItem && selectedItem !== '' && (
          <div className={styles.emptySection}>Select a {title.toLowerCase()}</div>
        )}
        {selectedItem && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.header}>
                <h2 className={styles.title}>{selectedItem.split('/').pop()}</h2>
              </div>
            </div>
            <div className={`${styles.sectionContent} ${isEditing ? styles.editingContent : ''}`}>
              {images && basePath && (
                <div className={styles.imageSection}>
                  <ImageCarousel images={images} basePath={basePath} />
                </div>
              )}
              <div className={`${styles.mdContent} ${isEditing ? styles.editingMdContent : ''}`}>
                {isEditing ? (
                  <Textarea
                    className={styles.editor}
                    value={fileContent}
                    onChange={e => onContentChange(e.target.value)}
                  />
                ) : (
                  <ScrollArea className={styles.contentArea}>
                    <div className={styles.markdownContent}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{fileContent}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                )}
                <div className={styles.buttonContainer}>
                  {!isEditing ? (
                    <Button className={styles.button} onClick={onEdit}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button className={styles.button} onClick={onSave}>
                        Save Changes
                      </Button>
                      <Button className={styles.button} onClick={onCancel}>
                        Cancel
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ScrollArea className={styles.rightPanel}>
        <div className={styles.rootTitle}>{title}</div>
        <div className={styles.fileTree}>{children}</div>
      </ScrollArea>
    </div>
  );
}
