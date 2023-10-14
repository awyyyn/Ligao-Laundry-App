import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    session: null,
    user: {
        name: '',
        address: '',
        phone: '',
        email: ''
    },
    messages: [],
    unreadMessage: 0,
    notifications: [],
    unReadNotif: 0,
    laundries: [],
    // laundriesLength: 0
};



const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSession(state, { payload }) {
            console.log(payload, 'SESSIOn')
            state.session = payload
        }, 
        setUser(state, { payload }) {
            console.log('slice data: ', payload)
            state.user.address = payload[0]?.address ? payload[0]?.address : '';
            state.user.name = payload[0]?.name ? payload[0]?.name : '';
            state.user.email = payload[0]?.email ? payload[0]?.email : '';
            state.user.phone = payload[0]?.phone ? payload[0]?.phone : ''; 
        },
        removeUser(state) {
            state.user.address = '' 
            state.user.name = ''
            state.user.email = ''
            state.user.phone  = ''
        },
        // setName: (state, { payload }) => {
        //     state.user.name = payload.name
        // }
        setMessages: (state, { payload }) => { 
            // console.log("PAYLOAD: ", payload)
            state.messages = payload
        },
        setNotificaitons: (state, { payload }) => {
            state.notifications = payload
        },
        setUnReadNotif: (state, { payload }) => {
            state.unReadNotif = payload
        },
        setLaundries: (state, {payload}) => {
            state.laundries = payload
        },
        setUnreadMessages: (state, { payload }) => {
            state.unreadMessage = payload;
        }
    }
})

export const { setSession, setUser, removeUser, setMessages, setNotificaitons, setUnReadNotif, setLaundries, setUnreadMessages } = userSlice.actions; 
export default userSlice.reducer