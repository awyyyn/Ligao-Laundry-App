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
    notifications: [],
    unReadNotif: 0
};



const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setSession(state, { payload }) {
            state.session = payload
        }, 
        setUser(state, { payload }) {
            // console.log('slice data: ', payload)
            state.user.address = payload[0].address;
            state.user.name = payload[0].name;
            state.user.email = payload[0].email;
            state.user.phone = payload[0].phone; 
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
        }
    }
})

export const { setSession, setUser, removeUser, setMessages, setNotificaitons, setUnReadNotif } = userSlice.actions; 
export default userSlice.reducer