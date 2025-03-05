import {useEffect, useRef} from 'react';
import axios from 'axios';
import {toast} from 'react-toastify';

import {useAppDispatch} from 'redux_state/hooks';
import {addNewDocumentContent, updateDocumentContent} from 'redux_state/reducers/documentsSlice';

import LANGUAGE from 'constants/language';

const REQUIRED_LANGUAGES = [LANGUAGE.EN, LANGUAGE.TH, LANGUAGE.RU];

function useAutoTranslate(selectedDocument: UserDocument | null) {
  const dispatch = useAppDispatch();
  const isTranslating = useRef(false);

  useEffect(() => {
    const translateMissingLanguages = async (doc: UserDocument) => {
      if (isTranslating.current) return;
      isTranslating.current = true;

      const existingLanguages = doc.documentContents.map(content => content.languageCode);
      const missingLanguages = REQUIRED_LANGUAGES.filter(lang => !existingLanguages.includes(lang));

      if (missingLanguages.length > 0) {
        const sourceContent = doc.documentContents.find(content => content.languageCode === LANGUAGE.EN)?.content || '';

        for (const lang of missingLanguages) {
          try {
            const translateResponse = await axios.post('/api/ai_assistant', {
              mode: 'translate',
              context: sourceContent,
              sourceLanguage: LANGUAGE.EN,
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

// Функция для перевода и обновления контента после редактирования
export const translateAndSaveAllLanguages = async (
  documentId: number,
  sourceLang: string,
  updatedContent: string,
  dispatch: any
) => {
  const targetLanguages = REQUIRED_LANGUAGES.filter(lang => lang !== sourceLang);

  for (const lang of targetLanguages) {
    try {
      const translateResponse = await axios.post('/api/ai_assistant', {
        mode: 'translate',
        context: updatedContent,
        sourceLanguage: sourceLang,
        targetLanguage: lang
      });

      const translatedContent = translateResponse.data.text;

      await axios.put('/api/documents/update_document_content', {
        document_id: documentId,
        language_code: lang,
        content: translatedContent
      });

      dispatch(
        updateDocumentContent({
          documentId,
          languageCode: lang,
          content: translatedContent
        })
      );
    } catch (error) {
      console.error(`Error translating and updating content to ${lang.toUpperCase()}:`, error);
    }
  }
};

export default useAutoTranslate;
