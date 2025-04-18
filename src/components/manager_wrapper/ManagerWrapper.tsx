import {ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import LANGUAGE from 'constants/language';

import {Button} from 'components/ui/button';
import {ScrollArea} from 'components/ui/scroll-area';
import {Textarea} from 'components/ui/textarea';

import ImageCarousel from 'components/land/components/image_carousel/ImageCarousel';
import Confirmation from 'components/common/Confirmation/Confirmation';

import styles from './ManagerWrapper.module.css';

interface Props {
  children: ReactNode;
  selectedItem: string | null;
  selectedLanguage: string;
  selectedContent: string;
  isEditing: boolean;
  onEdit: () => void;
  onSave: () => void;
  isSaving: boolean;
  onCancel: () => void;
  onContentChange: (content: string) => void;
  title: string;
  images?: string[];
  basePath?: string;
  shareButton?: React.ReactNode;
  copyContentButton?: React.ReactNode;
  languageSelector?: React.ReactNode;
  isReadOnly?: boolean;
  cancelDelete?: () => void;
  onDelete?: () => void;
  isConfirmationOpen?: boolean;
  handleDeleteDocumentContent?: () => void;
}

function ManagerWrapper({
  children,
  selectedItem,
  selectedLanguage,
  selectedContent,
  isEditing,
  onEdit,
  onSave,
  isSaving,
  onCancel,
  onContentChange,
  title,
  images,
  basePath,
  shareButton,
  copyContentButton,
  languageSelector,
  isReadOnly,
  cancelDelete,
  onDelete,
  isConfirmationOpen,
  handleDeleteDocumentContent
}: Props) {
  const pathName = usePathname();
  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {!selectedItem && selectedItem !== '' && (
          <div className={styles.emptySection}>Select a {title.toLowerCase()}</div>
        )}
        {selectedItem && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.title}>{selectedItem.split('/').pop()}</h2>
              <div className={styles.actionButtons}>
                {languageSelector && <div className={styles.languageSelector}>{languageSelector}</div>}
                {copyContentButton && <div className={styles.copyIcon}>{copyContentButton}</div>}
                {!isReadOnly && shareButton && <div className={styles.shareIcon}>{shareButton}</div>}
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
                    value={selectedContent}
                    onChange={e => onContentChange(e.target.value)}
                  />
                ) : (
                  <ScrollArea className={styles.contentArea}>
                    <div className={styles.markdownContent}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{selectedContent}</ReactMarkdown>
                    </div>
                  </ScrollArea>
                )}
                {!isReadOnly && (
                  <div className={styles.buttonContainer}>
                    {!isEditing ? (
                      <>
                        {pathName === '/documents' && selectedLanguage !== LANGUAGE.EN && (
                          <button className={styles.buttonDelete} onClick={handleDeleteDocumentContent}>
                            Delete
                          </button>
                        )}
                        <button className={styles.buttonEdit} onClick={onEdit}>
                          Edit
                        </button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" className={styles.button} onClick={onCancel}>
                          Cancel
                        </Button>
                        <Button className={styles.button} disabled={isSaving} onClick={onSave}>
                          Save Changes
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!isReadOnly && (
        <ScrollArea className={styles.rightPanel}>
          <div className={styles.rootTitle}>{title}</div>
          <div className={styles.fileTree}>{children}</div>
        </ScrollArea>
      )}

      <Confirmation
        isOpen={isConfirmationOpen || false}
        message="Are you sure you want to delete this content?"
        onConfirm={onDelete ?? (() => {})}
        onCancel={cancelDelete ?? (() => {})}
      />
    </div>
  );
}

export default ManagerWrapper;
