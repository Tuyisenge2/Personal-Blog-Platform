import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import googleReducer from "./slices/googleSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    google: googleReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
