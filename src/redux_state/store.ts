import {configureStore} from '@reduxjs/toolkit';

import financialSlice from './reducers/financialSlice';
import projectsSlice from './reducers/projectsSlice';
import documentsSlice from './reducers/documentsSlice';
import projectContextSlice from './reducers/projectContextSlice';

export const store = configureStore({
  reducer: {
    financial: financialSlice,
    projects: projectsSlice,
    documents: documentsSlice,
    projectContext: projectContextSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
