import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  messagesData: {},
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    updateMessageData: (state, action) => {
        const { chatId, message } = action.payload;
        if (!state.messagesData[chatId]) {
          state.messagesData[chatId] = [];
        }
        state.messagesData[chatId].push(message);
    },

    clearMessages: (state, action) => {
      delete state.messagesData[action.payload.chatId];
    },
  },
});

export const { updateMessageData, clearMessages } = messagesSlice.actions;

export default messagesSlice.reducer;
