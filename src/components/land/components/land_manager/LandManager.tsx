'use client';

import {useState, useEffect} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {Folder} from 'lucide-react';

import {Button} from 'components/ui/button';
import {ScrollArea} from 'components/ui/scroll-area';
import {Textarea} from 'components/ui/textarea';

import styles from './LandManager.module.css';
import ImageCarousel from '../image_carousel/ImageCarousel';

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
      const response = await axios.get('/api/land_manager/folder_content', {
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
      const response = await axios.post('/api/land_manager/save_md', {
        path: `${selectedFolder}/content.md`,
        content: fileContent
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
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {!selectedFolder && selectedFolder !== '' && <div className={styles.emptySection}>Select a folder</div>}
        {selectedFolder && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <div className={styles.header}>
                <Folder className="h-6 w-6" />
                <h2 className={styles.title}>{selectedFolder.split('/').pop()}</h2>
              </div>
            </div>
            <div className={`${styles.sectionContent} ${isEditing ? styles.editingContent : ''}`}>
              <div className={styles.imageSection}>
                <ImageCarousel images={images} basePath={`/land/${selectedFolder}`} />
              </div>
              <div className={`${styles.mdContent} ${isEditing ? styles.editingMdContent : ''}`}>
                {isEditing ? (
                  <Textarea
                    className={styles.editor}
                    value={fileContent}
                    onChange={e => setFileContent(e.target.value)}
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
                    <Button className={styles.button} onClick={() => setIsEditing(true)}>
                      Edit
                    </Button>
                  ) : (
                    <>
                      <Button className={styles.button} onClick={handleSave}>
                        Save Changes
                      </Button>
                      <Button className={styles.button} onClick={() => setIsEditing(false)}>
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
        <div className={styles.rootTitle}>Land</div>
        <div className={styles.fileTree}>
          {typeof structure === 'object' && !Array.isArray(structure) ? renderStructure(structure) : null}
        </div>
      </ScrollArea>
    </div>
  );
}
