'use client';

import React, {useState, useEffect} from 'react';

import axios from 'axios';
import {File, Folder, Plus} from 'lucide-react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from 'components/ui/accordion';
import {Button} from '../ui/button';

import {useAppSelector, useAppDispatch} from 'redux_state/hooks';
import {updateDocumentContent, addNewDocument} from 'redux_state/reducers/documentsSlice';

import ManagerWrapper from 'components/manager_wrapper/ManagerWrapper';
import useLoadingDocuments from './hooks/useLoadingDocuments';
import Loader from '../common/Loader/Loader';
import NewDocumentPopup from './components/NewDocumentPopup/NewDocumentPopup';

import styles from './DocumentsPage.module.css';

interface TreeNode {
  [key: string]: TreeNode | UserDocument;
}

const DocumentsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Стан для відкриття попапу

  const documents = useAppSelector(state => state.documents.documents);
  const {isLoadingDocuments} = useLoadingDocuments();

  useEffect(() => {
    if (selectedDocument) {
      const content = selectedDocument.contents.find(c => c.languageCode === selectedLanguage);
      setFileContent(content ? content.content : '');
    }
  }, [selectedDocument, selectedLanguage]);

  const handleSave = async () => {
    if (!selectedDocument) return;

    try {
      const response = await axios.post('/api/save_document', {
        id: selectedDocument.id,
        language_code: selectedLanguage,
        content: fileContent,
        last_modified_by: 'current-user-uuid'
      });

      if (response.status === 200) {
        setIsEditing(false);
        dispatch(
          updateDocumentContent({
            id: selectedDocument.id,
            languageCode: selectedLanguage,
            content: fileContent
          })
        );
      }
    } catch (error) {
      console.error('Error saving document:', error);
    }
  };

  const handleDocumentSelect = (document: UserDocument) => {
    setSelectedDocument(document);
    setActiveItem(document.id);
    setSelectedLanguage('en'); //default to English
  };

  const handleCreateNewDocument = () => {
    setIsPopupOpen(true); // Відкриваємо попап
  };

  const handleSaveNewDocument = (title: string, tagPath: string, content: string) => {
    const newDocument: UserDocument = {
      id: crypto.randomUUID(), // Генеруємо унікальний ID
      title,
      tagPath,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user-uuid', // Замінити на реальний ID користувача
      lastModifiedBy: 'current-user-uuid',
      contents: [
        {
          languageCode: 'en', // Мова за замовчуванням
          content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
    };

    // Додаємо новий документ в Redux
    dispatch(addNewDocument(newDocument));

    // Закриваємо попап
    setIsPopupOpen(false);
  };

  const buildTree = (docs: UserDocument[]): TreeNode => {
    const tree: TreeNode = {};
    docs?.forEach(doc => {
      const parts = doc.tagPath.split('/');
      let currentLevel = tree;
      parts.forEach((part, index) => {
        if (index === parts.length - 1) {
          currentLevel[part] = doc;
        } else {
          if (!currentLevel[part]) {
            currentLevel[part] = {};
          }
          currentLevel = currentLevel[part] as TreeNode;
        }
      });
    });
    return tree;
  };

  const renderTree = (node: TreeNode, path: string = '') => {
    return Object.entries(node).map(([key, value]) => {
      const currentPath = path ? `${path}/${key}` : key;
      if (value && typeof value === 'object' && !('id' in value)) {
        return (
          <Accordion type="single" collapsible key={currentPath}>
            <AccordionItem value={currentPath}>
              <AccordionTrigger className={styles.folderItem}>
                <Folder className="h-4 w-4 mr-2" />
                {key}
              </AccordionTrigger>
              <AccordionContent>{renderTree(value as TreeNode, currentPath)}</AccordionContent>
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
            onClick={() => handleDocumentSelect(doc)}>
            <File className="h-4 w-4 mr-2" />
            <span>{doc.title}</span>
          </div>
        );
      }
      return null;
    });
  };

  const renderDocumentsBar = () => {
    return (
      <>
        <div className={styles.languageWrapper}>
          <Button variant="link" onClick={handleCreateNewDocument} className={styles.newButton}>
            <Plus className="h-4 w-4" />
            New
          </Button>
          {selectedDocument && (
            <div className={styles.languageSelector}>
              <select value={selectedLanguage} onChange={e => setSelectedLanguage(e.target.value)}>
                {selectedDocument.contents.map(content => (
                  <option key={content.languageCode} value={content.languageCode}>
                    {content.languageCode.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
        {documents.length === 0 && <Loader />}
      </>
    );
  };

  const tree = buildTree(documents);

  return (
    <ManagerWrapper
      selectedItem={selectedDocument?.title || null}
      fileContent={fileContent}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      onContentChange={setFileContent}
      title="Documents">
      {renderDocumentsBar()}
      {renderTree(tree)}

      <NewDocumentPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} onSave={handleSaveNewDocument} />
    </ManagerWrapper>
  );
};

export default DocumentsPage;
