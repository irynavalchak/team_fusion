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
    <>
      {Object.entries(node).map(([key, value]) => {
        const currentPath = path ? `${path}/${key}` : key;
        const isOpen = openPaths.includes(key); // Перевіряємо, чи має бути папка відкрита

        if (value && typeof value === 'object' && !('id' in value)) {
          return (
            <Accordion type="single" collapsible key={currentPath} defaultValue={isOpen ? currentPath : undefined}>
              <AccordionItem value={currentPath}>
                <AccordionTrigger className={styles.folderItem}>
                  <Folder className="h-6 w-6 mr-2" />
                  {key}
                </AccordionTrigger>
                <AccordionContent>
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
              <File className="h-4 w-4 mr-2" />
              <span>{doc.title}</span>
            </div>
          );
        }
        return null;
      })}
    </>
  );
};

export default DocumentsTree;
