import { createSlice } from "@reduxjs/toolkit";


initialState = {
    isOpen: false,
    price: null,
    desc: null,
    title: null
}

const modalSlice = createSlice({
    name: "modal",
    initialState,
    reducers: {
        openModal: (state, { payload}) => {
            state.price = payload.price;
            state.desc = payload.desc;
            state.title = payload.title;
            state.isOpen = true;
        },
        closeModal: (state ) => { 
            state.price = null;
            state.desc = null;
            state.title = null;
            state.isOpen = false; 
        },
        
    }
})

export const { openModal, closeModal } = modalSlice.actions 
export default modalSlice.reducer;