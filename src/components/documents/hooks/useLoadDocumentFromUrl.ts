import {useEffect} from 'react';
import {decryptId} from '../../../utils/encryption';

function useLoadDocumentFromUrl(
  isEncrypted: boolean,
  encryptedDocumentIdFromUrl: string | null,
  encryptedContentIdFromUrl: string | null,
  documents: UserDocument[],
  setSelectedDocument: React.Dispatch<React.SetStateAction<UserDocument | null>>,
  setActiveItem: React.Dispatch<React.SetStateAction<number | null>>,
  setIsReadOnly: React.Dispatch<React.SetStateAction<boolean>>,
  setSelectedContentId: React.Dispatch<React.SetStateAction<number | null>>,
  setSelectedLanguage: React.Dispatch<React.SetStateAction<string>>
) {
  useEffect(() => {
    if (!isEncrypted || !encryptedDocumentIdFromUrl || documents.length === 0) return;

    try {
      const decryptedDocumentId = decryptId(encryptedDocumentIdFromUrl);

      if (typeof decryptedDocumentId !== 'number' || isNaN(decryptedDocumentId)) {
        console.error('Invalid decrypted document ID:', decryptedDocumentId);
        return;
      }

      const doc = documents.find(d => d.id === decryptedDocumentId);

      if (!doc) {
        console.error('Document not found for ID:', decryptedDocumentId);
        return;
      }

      setSelectedDocument(doc);
      setActiveItem(doc.id);
      setIsReadOnly(true);

      if (encryptedContentIdFromUrl) {
        const decryptedContentId = decryptId(encryptedContentIdFromUrl);

        if (typeof decryptedContentId !== 'number' || isNaN(decryptedContentId)) {
          console.error('Invalid decrypted content ID:', decryptedContentId);
          return;
        }

        const content = doc.documentContents.find(c => c.id === decryptedContentId);
        if (content) {
          setSelectedContentId(content.id);
          setSelectedLanguage(content.languageCode);
        }
      }
    } catch (error) {
      console.error('Error decrypting ID:', error);
    }
  }, [
    isEncrypted,
    encryptedDocumentIdFromUrl,
    encryptedContentIdFromUrl,
    documents,
    setSelectedDocument,
    setActiveItem,
    setIsReadOnly,
    setSelectedContentId,
    setSelectedLanguage
  ]);
}

export default useLoadDocumentFromUrl;
