import {createSlice} from "@reduxjs/toolkit"

const initialState = {
    userData:{
        userId:""
    },
    profileData:[],
    cartItems:[],
}

export const userDetailsSlice = createSlice({
    name: 'user',
    initialState,
    reducers:{
        setUserDetails: (state, action) => {
            state.userData = action.payload
        },
        setProfileData: (state, action) => {
            state.profileData = action.payload
        },
        setCartItems:(state,action) => {
            state.cartItems = action.payload
        }
    }
})

export const {setUserDetails,setProfileData,setCartItems} = userDetailsSlice.actions

export default userDetailsSlice.reducer