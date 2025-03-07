import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    notificationData:[],
    notificationCount:0
}

export const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers:{
        setNotificationData:(state,action)=>{
            state.notificationData = action.payload
        },

        addNewNotifications: (state, action) => {
            state.notificationData.push(action.payload)
            state.notificationCount += 1
        },
        clearNotifications: (state) => {
            state.notificationCount = 0
        },
    }
})

export const {addNewNotifications, clearNotifications,setNotificationData} = notificationSlice.actions

export default notificationSlice.reducer