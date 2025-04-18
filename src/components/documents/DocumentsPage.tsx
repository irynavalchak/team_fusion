'use client';

import React, {useState, useEffect} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import axios from 'axios';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import {toast} from 'react-toastify';
import {Share2, Clipboard} from 'lucide-react';

import {useAppSelector, useAppDispatch} from 'redux_state/hooks';
import {
  addNewDocument,
  addNewDocumentContent,
  updateDocumentContent,
  deleteDocumentContent
} from 'redux_state/reducers/documentsSlice';

import {buildTree} from 'utils/buildTree';
import {documentPath} from 'utils/documentPath';
import {encryptId, decryptId} from 'utils/encryption';

import useLoadingDocuments from './hooks/useLoadingDocuments';
import useAutoTranslate, {translateAndSaveAllLanguages} from './hooks/useAutoTranslate';
import useLoadDocumentFromUrl from './hooks/useLoadDocumentFromUrl';

import LANGUAGE from 'constants/language';

import ManagerWrapper from 'components/manager_wrapper/ManagerWrapper';
import NewDocumentPopup from './components/NewDocumentPopup/NewDocumentPopup';
import DocumentsBar from './components/DocumentsBar/DocumentsBar';
import DocumentsTree from './components/DocumentsTree/DocumentsTree';
import Loader from '../common/Loader/Loader';

const DocumentsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const encryptedDocumentIdFromUrl = searchParams.get('id');
  const encryptedContentIdFromUrl = searchParams.get('contentId');
  const isEncrypted = encryptedDocumentIdFromUrl && !/^\d+$/.test(encryptedDocumentIdFromUrl);
  const documentIdFromUrl = isEncrypted
    ? decryptId(encryptedDocumentIdFromUrl)
    : (encryptedDocumentIdFromUrl && parseInt(encryptedDocumentIdFromUrl, 10)) || null;

  const [selectedDocument, setSelectedDocument] = useState<UserDocument | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(LANGUAGE.EN);
  const [selectedContent, setSelectedContent] = useState<string>('');
  const [selectedContentId, setSelectedContentId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [activeItem, setActiveItem] = useState<number | null>(documentIdFromUrl);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isCreatingDocument, setIsCreatingDocument] = useState(false);
  const [newDocumentId, setNewDocumentId] = useState<number | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);

  const documents = useAppSelector(state => state.documents.documents);
  const {isLoadingDocuments} = useLoadingDocuments();

  useLoadDocumentFromUrl(
    !!isEncrypted,
    encryptedDocumentIdFromUrl,
    encryptedContentIdFromUrl,
    documents,
    setSelectedDocument,
    setActiveItem,
    setIsReadOnly,
    setSelectedContentId,
    setSelectedLanguage
  );

  useAutoTranslate(selectedDocument);

  useEffect(() => {
    if (newDocumentId !== null) {
      router.push('/documents');
    }
  }, [newDocumentId, router]);

  useEffect(() => {
    if (selectedDocument) {
      const updatedDocument = documents.find(doc => doc.id === selectedDocument.id);
      if (updatedDocument) {
        setSelectedDocument(updatedDocument);
      }
    }
  }, [documents, selectedDocument]);

  useEffect(() => {
    if (selectedDocument) {
      const selectedContent =
        selectedDocument.documentContents.find(c => c.languageCode === selectedLanguage) ||
        selectedDocument.documentContents[0];

      if (selectedContent) {
        setSelectedContent(selectedContent.content);
        setSelectedContentId(selectedContent.id);
      }
    }
  }, [selectedDocument, selectedLanguage]);

  const handleDocumentSelect = (document: UserDocument) => {
    setSelectedDocument(document);
    setActiveItem(document.id);
    setSelectedLanguage(LANGUAGE.EN);

    const englishContent = document.documentContents.find(c => c.languageCode === LANGUAGE.EN);

    if (englishContent) {
      setSelectedContentId(englishContent.id);
      router.push(`/documents?id=${document.id}&contentId=${englishContent.id}`);
    }
  };

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    const selectedContent = selectedDocument?.documentContents.find(c => c.languageCode === language);
    if (selectedContent && selectedDocument) {
      setSelectedContentId(selectedContent.id);
      router.push(`/documents?id=${selectedDocument.id}&contentId=${selectedContent.id}`);
    }
  };

  const handleOpenNewDocumentPopup = () => {
    setIsPopupOpen(true);
  };

  const handleCreateNewDocument = async (title: string, tagPath: string) => {
    setIsCreatingDocument(true);
    try {
      const response = await axios.post('/api/documents/create_document', {
        title,
        tag_path: tagPath,
        created_by: null,
        last_modified_by: null,
        draft: true
      });
      const documentId = response.data.insert_knowledge_base_documents_one.id;
      if (response.status === 200 && documentId) {
        setNewDocumentId(documentId);
        dispatch(addNewDocument({id: documentId, title, tagPath}));
      }
    } catch (error) {
      console.error('Error creating document:', error);
    } finally {
      setIsCreatingDocument(false);
    }
  };

  const handleSaveNewDocumentContent = async (language: string, content: string) => {
    if (!newDocumentId) return;
    try {
      await axios.post('/api/documents/create_document_content', {
        document_id: newDocumentId,
        language_code: language,
        content
      });
      dispatch(addNewDocumentContent({documentId: newDocumentId, languageCode: language, content}));
      setIsPopupOpen(false);
      setNewDocumentId(null);
    } catch (error) {
      console.error('Error saving document content:', error);
    }
  };

  const handleSave = async () => {
    if (!selectedDocument) return;

    try {
      setIsSaving(true);

      // Обновляем основной язык
      await axios.put('/api/documents/update_document_content', {
        document_id: selectedDocument.id,
        language_code: selectedLanguage,
        content: selectedContent
      });

      dispatch(
        updateDocumentContent({
          documentId: selectedDocument.id,
          languageCode: selectedLanguage,
          content: selectedContent
        })
      );

      // Перевод и обновление других языков
      await translateAndSaveAllLanguages(selectedDocument.id, selectedLanguage, selectedContent, dispatch);

      setIsEditing(false);
      setIsSaving(false);
      toast.success('Document updated and translated successfully!');
    } catch (error) {
      console.error('Error updating document content:', error);
      toast.error('Failed to update document.');
    } finally {
      setIsSaving(false);
    }
  };

  const tree = buildTree(documents);
  const path = documentIdFromUrl ? documentPath(documentIdFromUrl, tree) : [];

  const handleCopyLink = () => {
    if (selectedDocument && selectedContentId) {
      const encryptedDocumentId = encryptId(selectedDocument.id);
      const encryptedContentId = encryptId(selectedContentId);
      const link = `${window.location.origin}/documents?id=${encryptedDocumentId}&contentId=${encryptedContentId}`;
      navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleCopyContent = () => {
    if (selectedContent) {
      toast.success('Content copied to clipboard!');
    }
  };

  const cancelDelete = () => {
    setIsConfirmationOpen(false);
  };

  const handleDeleteDocumentContent = () => {
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedDocument) return;

    try {
      const response = await axios.delete('/api/documents/delete_document_content', {
        data: {
          id: selectedContentId
        }
      });

      if (response.status === 200 && selectedContentId) {
        dispatch(
          deleteDocumentContent({
            documentId: selectedDocument.id,
            contentId: selectedContentId
          })
        );

        setIsEditing(false);
        setSelectedContent('');
        setSelectedContentId(null);

        toast.success('Content deleted successfully!');
        setIsConfirmationOpen(false);
      }
    } catch (error) {
      console.error('Error deleting document content:', error);
      toast.error('Failed to delete content.');
    }
  };

  return (
    <ManagerWrapper
      selectedItem={selectedDocument?.title || null}
      selectedContent={selectedContent}
      selectedLanguage={selectedLanguage}
      isEditing={isEditing}
      onEdit={() => setIsEditing(true)}
      onSave={handleSave}
      isSaving={isSaving}
      onCancel={() => setIsEditing(false)}
      onContentChange={setSelectedContent}
      title="Documents"
      isReadOnly={isReadOnly}
      isConfirmationOpen={isConfirmationOpen}
      cancelDelete={cancelDelete}
      onDelete={confirmDelete}
      handleDeleteDocumentContent={handleDeleteDocumentContent}
      copyContentButton={
        <CopyToClipboard text={selectedContent || ''}>
          <button onClick={handleCopyContent} style={{cursor: 'pointer'}}>
            <span role="img" aria-label="copy content">
              <Clipboard size={30} />
            </span>
          </button>
        </CopyToClipboard>
      }
      shareButton={
        <CopyToClipboard
          text={`${window.location.origin}/documents?id=${encryptId(selectedDocument?.id || 0)}&contentId=${selectedContentId && encryptId(selectedContentId)}`}>
          <button onClick={handleCopyLink} style={{cursor: 'pointer'}}>
            <span role="img" aria-label="share">
              <Share2 size={30} />
            </span>
          </button>
        </CopyToClipboard>
      }>
      <DocumentsBar
        onCreateNewDocument={handleOpenNewDocumentPopup}
        selectedDocument={selectedDocument}
        selectedLanguage={selectedLanguage}
        onLanguageChange={handleLanguageChange}
      />
      <DocumentsTree
        node={tree}
        activeItem={activeItem}
        openPaths={path || []}
        onDocumentSelect={handleDocumentSelect}
      />
      {documents.length === 0 && <Loader />}
      <NewDocumentPopup
        isOpen={isPopupOpen}
        onClose={() => {
          setIsPopupOpen(false);
          setNewDocumentId(null);
        }}
        onCreate={handleCreateNewDocument}
        isCreating={isCreatingDocument}
        documentId={newDocumentId}
        onSaveContent={handleSaveNewDocumentContent}
      />
    </ManagerWrapper>
  );
};

export default DocumentsPage;
