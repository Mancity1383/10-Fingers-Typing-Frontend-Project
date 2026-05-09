import { configureStore } from "@reduxjs/toolkit";
import keyboardReducer from "../features/keyboardSlice";
import userProgressReducer from "../features/userDataSlice"

export const store = configureStore({
    reducer: {
        keyboard: keyboardReducer,
        userData : userProgressReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
