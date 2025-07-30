import {createSlice} from '@reduxjs/toolkit';
import type {PayloadAction} from '@reduxjs/toolkit';
import {ProjectContextBlock} from '@/typings/projectContext';

export interface ProjectContextState {
  contextBlocks: ProjectContextBlock[];
  isLoading: boolean;
  selectedProjectId: number | null;
}

const initialState: ProjectContextState = {
  contextBlocks: [],
  isLoading: false,
  selectedProjectId: null
};

export const projectContextSlice = createSlice({
  name: 'projectContext',
  initialState,
  reducers: {
    setProjectContextBlocks: (state, action: PayloadAction<ProjectContextBlock[]>) => {
      state.contextBlocks = action.payload;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setSelectedProjectId: (state, action: PayloadAction<number | null>) => {
      state.selectedProjectId = action.payload;
    },
    clearProjectContextBlocks: state => {
      state.contextBlocks = [];
      state.selectedProjectId = null;
    }
  }
});

export const {setProjectContextBlocks, setIsLoading, setSelectedProjectId, clearProjectContextBlocks} =
  projectContextSlice.actions;

export default projectContextSlice.reducer;
