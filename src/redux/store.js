import { configureStore, combineReducers } from "@reduxjs/toolkit";
import userDetailReducer from "./reducers/userDetailsSlice.js";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import notificationReducer from "./reducers/notificationsSlice.js";
import messagesReducer from "./reducers/messagesSlice.js";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  userDetailReducer,
  notificationReducer,
  messagesReducer,
});

const persistedreducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedreducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistedStore = persistStore(store);
