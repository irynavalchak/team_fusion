'use client';

import {useState, useEffect} from 'react';
import axios from 'axios';
import {marked} from 'marked';
import {File, Folder} from 'lucide-react';

import {Button} from 'components/ui/button';
import {ScrollArea} from 'components/ui/scroll-area';
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from 'components/ui/accordion';
import {Textarea} from 'components/ui/textarea';

import styles from './FileManager.module.css';

interface FileManagerProps {
  initialStructure: Record<string, string[]>;
}

export default function FileManager({initialStructure}: FileManagerProps) {
  const [structure, setStructure] = useState(initialStructure);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      fetchFileContent(selectedFile);
    }
  }, [selectedFile]);

  const parseMarkdown = async (markdownText: string): Promise<string> => {
    return await marked(markdownText);
  };

  const fetchFileContent = async (filePath: string) => {
    try {
      const response = await axios.get('/api/files_manager', {
        params: {path: filePath}
      });

      const contentFormatted = await parseMarkdown(response.data.content);
      setFileContent(contentFormatted);
    } catch (error) {
      console.error('Error fetching file:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    try {
      const response = await axios.post('/api/files_manager', {
        path: selectedFile,
        content: fileContent
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
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftPanel}>
        {selectedFile && (
          <>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="content">
                <AccordionTrigger style={{fontSize: '180px'}}>
                  <div className={styles.header}>
                    <File className="h-6 w-6" />
                    <h2 className={styles.title}>{selectedFile.split('/').pop()}</h2>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {isEditing ? (
                    <Textarea
                      className={styles.editor}
                      value={fileContent}
                      onChange={e => setFileContent(e.target.value)}
                    />
                  ) : (
                    <ScrollArea className={styles.contentArea}>
                      <div className="content" dangerouslySetInnerHTML={{__html: fileContent}} />
                    </ScrollArea>
                  )}
                  <div className={styles.buttonContainer}>
                    {!isEditing ? (
                      <Button onClick={() => setIsEditing(true)}>Edit</Button>
                    ) : (
                      <>
                        <Button onClick={handleSave}>Save Changes</Button>
                        <Button onClick={() => setIsEditing(false)}>Cancel</Button>
                      </>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </>
        )}
      </div>
      <ScrollArea className={styles.rightPanel}>
        <div className={styles.fileTree}>
          {Object.entries(structure).map(([folder, files]) => (
            <Accordion type="single" collapsible key={folder}>
              <AccordionItem value={folder}>
                <AccordionTrigger className={styles.folderItem}>
                  <Folder className="h-4 w-4 mr-2" />
                  {folder === '/' ? 'Root' : folder}
                </AccordionTrigger>
                <AccordionContent>
                  {files.map(file => (
                    <div key={file} className={styles.fileItem} onClick={() => handleFileSelect(folder, file)}>
                      <File className="h-4 w-4 mr-2" />
                      <span>{file}</span>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
