'use client';

import {useState, useEffect} from 'react';
import axios from 'axios';
import {File, Folder} from 'lucide-react';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from 'components/ui/accordion';
import ManagerWrapper from 'components/manager_wrapper/ManagerWrapper';

import styles from './DocumentsManager.module.css';

type FolderStructure = {
  [key: string]: FolderStructure | string[] | null;
};

interface DirectoryStructure {
  [key: string]: DirectoryStructure | string[];
}

export default function DocumentsManager({initialStructure}: {initialStructure: DirectoryStructure}) {
  const [structure, setStructure] = useState(initialStructure);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);

  useEffect(() => {
    if (selectedFile) {
      fetchFileContent(selectedFile);
    }
  }, [selectedFile]);

  const fetchFileContent = async (filePath: string) => {
    try {
      const response = await axios.get('/api/documents_manager', {
        params: {path: filePath}
      });
      setFileContent(response.data.content || '');
    } catch (error) {
      console.error('Error fetching file:', error);
      setFileContent('Error loading file content.');
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;
    try {
      const response = await axios.post('/api/save_file_md', {
        path: selectedFile,
        content: fileContent,
        folder: 'documents'
      });
      if (response.status === 200) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleFileSelect = (filePath: string) => {
    setSelectedFile(filePath);
    setActiveItem(filePath);
  };

  const toggleFolder = () => {
    setSelectedFile(null);
    setFileContent('');
  };

  const renderStructure = (data: FolderStructure, parentPath = '') => {
    return Object.entries(data).map(([key, content]) => {
      const currentPath = parentPath ? `${parentPath}/${key}` : key;
      if (typeof content === 'object' && content !== null && !Array.isArray(content)) {
        return (
          <Accordion type="single" collapsible key={currentPath}>
            <AccordionItem value={currentPath}>
              <AccordionTrigger className={styles.folderItem} onClick={() => toggleFolder()}>
                <Folder className="h-4 w-4 mr-2" />
                {key}
              </AccordionTrigger>
              <AccordionContent>{renderStructure(content as FolderStructure, currentPath)}</AccordionContent>
            </AccordionItem>
          </Accordion>
        );
      } else if (Array.isArray(content)) {
        return content.map((file: string) => {
          const filePath = `${parentPath}/${file}`;
          const isActive = activeItem === filePath;
          return (
            <div
              key={filePath}
              className={`${styles.fileItem} ${isActive ? styles.selectedFile : ''}`}
              onClick={() => handleFileSelect(filePath)}>
              <File className="h-4 w-4 mr-2" />
              <span>{file}</span>
            </div>
          );
        });
      }
      return null;
    });
  };

  return (
    <ManagerWrapper
      selectedItem={selectedFile}
      fileContent={fileContent}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      onContentChange={setFileContent}
      title="Documents">
      {typeof structure === 'object' && !Array.isArray(structure) ? renderStructure(structure) : null}
    </ManagerWrapper>
  );
}
