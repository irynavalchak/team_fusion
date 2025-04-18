'use client';

import React from 'react';
import {useRouter} from 'next/navigation';
import {Folder, File} from 'lucide-react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from 'components/ui/accordion';

import styles from './DocumentsTree.module.css';

interface TreeNode {
  [key: string]: TreeNode | UserDocument;
}

interface DocumentsTreeProps {
  node: TreeNode;
  path?: string;
  activeItem: number | null;
  openPaths: string[];
  onDocumentSelect: (document: UserDocument) => void;
}

const DocumentsTree: React.FC<DocumentsTreeProps> = ({node, path = '', activeItem, openPaths, onDocumentSelect}) => {
  const router = useRouter();

  return (
    <div className={styles.treeContainer}>
      {Object.entries(node).map(([key, value]) => {
        const currentPath = path ? `${path}/${key}` : key;
        const isOpen = openPaths.includes(key);

        if (value && typeof value === 'object' && !('id' in value)) {
          // This is a folder
          return (
            <Accordion
              type="single"
              collapsible
              key={currentPath}
              defaultValue={isOpen ? currentPath : undefined}
              className={styles.folderAccordion}>
              <AccordionItem value={currentPath} className={styles.folderAccordionItem}>
                <AccordionTrigger className={styles.folderItem}>
                  <div className={styles.folderContent}>
                    <Folder className="h-5 w-5 shrink-0" />
                    <span className={styles.folderName} title={key}>
                      {key}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className={styles.nestedContent}>
                  <DocumentsTree
                    node={value as TreeNode}
                    path={currentPath}
                    activeItem={activeItem}
                    openPaths={openPaths}
                    onDocumentSelect={onDocumentSelect}
                  />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        } else if ('id' in value) {
          // This is a document
          const doc = value as UserDocument;
          const isActive = activeItem === doc.id;
          return (
            <div
              key={doc.id}
              className={`${styles.fileItem} ${isActive ? styles.selectedFile : ''}`}
              onClick={() => {
                onDocumentSelect(doc);
                router.push(`/documents?id=${doc.id}`);
              }}>
              <File className="h-4 w-4 shrink-0" />
              <span className={styles.fileName} title={doc.title}>
                {doc.title}
              </span>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default DocumentsTree;
