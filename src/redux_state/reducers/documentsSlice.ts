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
    addNewDocument(state, action: PayloadAction<{id: number; title: string; tagPath: string}>) {
      const newDocument: UserDocument = {
        id: action.payload.id,
        title: action.payload.title,
        tagPath: action.payload.tagPath,
        createdAt: new Date().toString(),
        updatedAt: new Date().toString(),
        createdBy: null,
        lastModifiedBy: null,
        documentContents: []
      };
      state.documents.push(newDocument);
    },
    addNewDocumentContent(state, action: PayloadAction<{documentId: number; languageCode: string; content: string}>) {
      const document = state.documents.find(doc => doc.id === action.payload.documentId);
      if (document) {
        const newContent: UserDocumentContent = {
          id: document.id,
          languageCode: action.payload.languageCode,
          content: action.payload.content,
          createdAt: new Date().toString(),
          updatedAt: new Date().toString()
        };
        document.documentContents.push(newContent);
        document.updatedAt = new Date().toString();
      }
    },
    updateDocumentContent(state, action: PayloadAction<{documentId: number; languageCode: string; content: string}>) {
      const document = state.documents.find(doc => doc.id === action.payload.documentId);
      if (document) {
        const contentIndex = document.documentContents.findIndex(
          content => content.languageCode === action.payload.languageCode
        );
        if (contentIndex !== -1) {
          document.documentContents[contentIndex].content = action.payload.content;
          document.documentContents[contentIndex].updatedAt = new Date().toString();
          document.updatedAt = new Date().toString();
        }
      }
    },
    updateDocument(state, action: PayloadAction<{documentId: number; lastModifiedBy: number}>) {
      const document = state.documents.find(doc => doc.id === action.payload.documentId);
      if (document) {
        document.updatedAt = new Date().toString();
        document.lastModifiedBy = action.payload.lastModifiedBy;
      }
    },
    deleteDocumentContent(state, action: PayloadAction<{documentId: number; contentId: number}>) {
      const {documentId, contentId} = action.payload;
      const document = state.documents.find(doc => doc.id === documentId);
      if (document) {
        document.documentContents = document.documentContents.filter(content => content.id !== contentId);
      }
    }
  }
});

export const {
  setDocuments,
  addNewDocument,
  addNewDocumentContent,
  updateDocumentContent,
  updateDocument,
  deleteDocumentContent
} = documentsSlice.actions;

export default documentsSlice.reducer;
