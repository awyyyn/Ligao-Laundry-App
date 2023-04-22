import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../features/userSlice";
import modalSlice from "../features/modalSlice";
import uxSlice from "../features/uxSlice";

export const store = configureStore({
    reducer: {
        user: userSlice,
        modal: modalSlice,
        ux: uxSlice
    }
})