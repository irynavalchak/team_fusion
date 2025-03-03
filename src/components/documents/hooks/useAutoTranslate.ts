import {useEffect, useRef} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';

import {useAppDispatch} from 'redux_state/hooks';
import {addNewDocumentContent} from 'redux_state/reducers/documentsSlice';

function useAutoTranslate(selectedDocument: UserDocument | null) {
  const dispatch = useAppDispatch();
  const isTranslating = useRef(false);

  useEffect(() => {
    const translateMissingLanguages = async (doc: UserDocument) => {
      if (isTranslating.current) return;
      isTranslating.current = true;

      const requiredLanguages = ['en', 'th', 'ru'];
      const existingLanguages = doc.documentContents.map(content => content.languageCode);
      const missingLanguages = requiredLanguages.filter(lang => !existingLanguages.includes(lang));

      if (missingLanguages.length > 0) {
        const sourceContent = doc.documentContents.find(content => content.languageCode === 'en')?.content || '';

        for (const lang of missingLanguages) {
          try {
            if (!doc.documentContents.some(content => content.languageCode === lang)) {
              const translateResponse = await axios.post('/api/ai_assistant', {
                mode: 'translate',
                context: sourceContent,
                sourceLanguage: 'en',
                targetLanguage: lang
              });

              const translatedContent = translateResponse.data.text;

              const updateResponse = await axios.post('/api/documents/create_document_content', {
                document_id: doc.id,
                language_code: lang,
                content: translatedContent
              });

              if (updateResponse.status !== 200) {
                console.error('Error updating translated document content in DB:', updateResponse);
              }

              dispatch(
                addNewDocumentContent({
                  documentId: doc.id,
                  languageCode: lang,
                  content: translatedContent
                })
              );
              toast.success(`Content translated to ${lang.toUpperCase()} successfully!`);
            }
          } catch (error) {
            console.error(`Error translating content to ${lang.toUpperCase()}:`, error);
          }
        }
      }

      isTranslating.current = false;
    };

    if (selectedDocument && !isTranslating.current) {
      translateMissingLanguages(selectedDocument);
    }
  }, [selectedDocument, dispatch]);
}

export default useAutoTranslate;
