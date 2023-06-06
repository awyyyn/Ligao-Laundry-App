import { createSlice } from "@reduxjs/toolkit";


initialState = {
    isLoading: false,
    isLoadingUi: false, 
    resetPassModal: false,
    editName: false,
    editEmail: false,
    editPhone: false,
    editAddress: false,
    notify: {
        label: '',
        isOpen: false,
        color: '',
        top: 0
    },
    emailCodeModal: {
        email: '',
        isOpen: false
    },
    messageBadge: 0
}

const uxSlice = createSlice({
    name: 'ux',
    initialState,
    reducers: {
        setLoadingTrue: (state) => {
            state.isLoading = true
        },
        setLoadingFalse: (state) => {
            state.isLoading = false
        },
        setVisibleModalPass: (state) => {
            state.resetPassModal = true
        },
        setHideModalPass: (state) => {
            state.resetPassModal = false
        },
        showEditModal: () => {
            state.editProfModal = true
        },
        hideEditModal: (state) => {
            state.editProfModal = false
        },
        toggleNotify: (state, { payload } ) => {
            state.notify.isOpen = payload.isOpen
            state.notify.label = payload.label
            state.notify.color = payload.color 
            state.notify.top = payload.top
        },
        closeAllToggle: (state) => {
            state.editEmail = false
            state.editPhone = false
            state.editAddress = false
            state.editName = false
        },
        toggleEditName: (state) => {
            state.editEmail = false
            state.editPhone = false
            state.editAddress = false
            state.editName = !state.editName
        },
        toggleEditEmail: (state) => {
            state.editAddress = false
            state.editPhone = false
            state.editName = false
            state.editEmail = !state.editEmail
        },
        toggleEditPhone: (state) => {
            state.editEmail = false
            state.editName = false
            state.editAddress = false
            state.editPhone = !state.editPhone
        },
        toggleEditAddress: (state) => {
            state.editEmail = false
            state.editName = false
            state.editPhone = false
            state.editAddress = !state.editAddress
        },
        toggleIsLoading: (state, { payload }) => {
            state.isLoadingUi = payload.toggle
        },
        closeNotify: (state) => {
            state.notify.isOpen = false
        },
        emailCodeModal: (state, { payload: { isOpen, email} }) => {
            state.emailCodeModal.email = email
            state.emailCodeModal.isOpen = isOpen
        },
        toggleMessageBadge: (state, {payload}) => {
            state.messageBadge = payload.badge
        }
    }
})


export const { 
    setLoadingFalse, 
    setLoadingTrue, 
    setHideModalPass, 
    setVisibleModalPass,
    showEditModal,
    hideEditModal ,
    toggleNotify, 
    toggleEditName,
    toggleEditEmail,
    toggleEditAddress,
    toggleEditPhone,
    toggleIsLoading,
    closeNotify,
    emailCodeModal,
    closeAllToggle,
    toggleMessageBadge
} = uxSlice.actions;
export default uxSlice.reducer