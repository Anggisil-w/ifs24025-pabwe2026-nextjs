import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/states/reducer";
import userReducer from "@/features/users/states/reducer";
import postReducer from "@/features/posts/states/reducer";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    posts: postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;