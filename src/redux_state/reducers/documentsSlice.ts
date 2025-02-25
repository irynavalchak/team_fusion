import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';

export interface DocumentsState {
  documents: UserDocument[];
}

const initialState: DocumentsState = {
  documents: []
};

export const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    setDocuments: (state, action: PayloadAction<UserDocument[]>) => {
      state.documents = action.payload;
    },
    addNewDocument(state, action: PayloadAction<UserDocument>) {
      state.documents.push(action.payload);
    },
    updateDocumentContent(
      state,
      action: PayloadAction<{
        id: string;
        languageCode: string;
        content: string;
      }>
    ) {
      const {id, languageCode, content} = action.payload;

      const document = state.documents.find(doc => doc.id === id);

      if (document) {
        const contentIndex = document.contents.findIndex((c: UserDocumentContent) => c.languageCode === languageCode);

        if (contentIndex !== -1) {
          document.contents[contentIndex].content = content;
          document.contents[contentIndex].updatedAt = new Date().toISOString();
        } else {
          document.contents.push({
            languageCode: languageCode,
            content,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }

        document.updatedAt = new Date().toISOString();
      }
    }
  }
});

export const {setDocuments, addNewDocument, updateDocumentContent} = documentsSlice.actions;

export default documentsSlice.reducer;
