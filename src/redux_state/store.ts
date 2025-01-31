import {configureStore} from '@reduxjs/toolkit';

import financialSlice from './reducers/financialSlice';

export const store = configureStore({
  reducer: {
    financial: financialSlice
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
