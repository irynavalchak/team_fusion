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

export default function DocumentsManager({initialStructure}: DirectoryStructure) {
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

      const {content} = response.data;

      if (content) {
        setFileContent(content);
      } else {
        setFileContent('');
      }
    } catch (error) {
      console.error('Error fetching file:', error);
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

  const handleFileSelect = (folder: string, file: string) => {
    const filePath = folder === '/' ? file : `${folder}/${file}`;
    setSelectedFile(filePath);
    setActiveItem(filePath);
  };

  const renderStructure = (data: FolderStructure) => {
    return Object.entries(data).map(([folder, files]) => (
      <Accordion type="single" collapsible key={folder}>
        <AccordionItem value={folder}>
          <AccordionTrigger className={styles.folderItem}>
            <Folder className="h-4 w-4 mr-2" />
            {folder === '/' ? 'Root' : folder}
          </AccordionTrigger>
          <AccordionContent>
            {Array.isArray(files) &&
              files.map((file: string) => {
                const filePath = folder === '/' ? file : `${folder}/${file}`;
                const isActive = activeItem === filePath;

                return (
                  <div
                    key={file}
                    className={`${styles.fileItem} ${isActive ? styles.selectedFile : ''}`}
                    onClick={() => handleFileSelect(folder, file)}>
                    <File className="h-4 w-4 mr-2" />
                    <span>{file}</span>
                  </div>
                );
              })}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    ));
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
