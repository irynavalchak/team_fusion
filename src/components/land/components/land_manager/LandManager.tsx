'use client';

import {useState, useEffect} from 'react';
import axios from 'axios';
import {Folder} from 'lucide-react';

import ManagerWrapper from 'components/manager_wrapper/ManagerWrapper';

import styles from './LandManager.module.css';

type FolderStructure = {
  [key: string]: FolderStructure | string[] | null;
};

interface LandManagerProps {
  initialStructure: FolderStructure;
}

export default function LandManager({initialStructure}: LandManagerProps) {
  const [structure, setStructure] = useState(initialStructure.land || {});
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (selectedFolder) {
      fetchFolderContent(selectedFolder);
    }
  }, [selectedFolder]);

  const fetchFolderContent = async (folderPath: string) => {
    try {
      const response = await axios.get('/api/land_manager', {
        params: {path: folderPath}
      });

      const {mdContent, images} = response.data;

      if (mdContent) {
        setFileContent(mdContent);
      } else {
        setFileContent('');
      }

      setImages(images);
    } catch (error) {
      console.error('Error fetching folder content:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedFolder) return;

    try {
      const response = await axios.post('/api/save_file_md', {
        path: `${selectedFolder}/content.md`,
        content: fileContent,
        folder: 'land'
      });

      if (response.status === 200) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  const handleFolderSelect = (folderPath: string) => {
    setSelectedFolder(folderPath);
    setIsEditing(false);
  };

  const renderStructure = (data: FolderStructure, parentPath = '') => {
    return Object.entries(data).map(([key, value]) => {
      if (typeof value === 'object' && !Array.isArray(value)) {
        const folderPath = parentPath ? `${parentPath}/${key}` : key;
        const isSelected = selectedFolder === folderPath;

        return (
          <div
            key={folderPath}
            className={`${styles.folderItem} ${isSelected ? styles.selectedFolder : ''}`}
            onClick={() => handleFolderSelect(folderPath)}>
            <div className={styles.folderContent}>
              <div className={styles.folderIcon}>
                <Folder className="h-4 w-4" />
              </div>
              <span className={styles.folderName}>{key}</span>
            </div>
          </div>
        );
      }
      return null;
    });
  };

  return (
    <ManagerWrapper
      selectedItem={selectedFolder}
      fileContent={fileContent}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      onCancel={() => setIsEditing(false)}
      onContentChange={setFileContent}
      title="Land"
      images={images}
      basePath={`/land/${selectedFolder}`}>
      <div className={styles.fileTree}>
        {typeof structure === 'object' && !Array.isArray(structure) ? renderStructure(structure) : null}
      </div>
    </ManagerWrapper>
  );
}
