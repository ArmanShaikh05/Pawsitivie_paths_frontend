import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import "./styles/app.scss";
// import {Toaster} from "react-hot-toast"
import { Toaster } from "@/components/ui/toaster";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistedStore, store } from "./redux/store.js";
import Loader from "./components/Loader/Loader.jsx";
import { GlobalContextProvider } from "./context/GlobalContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { TooltipProvider } from "./components/ui/tooltip.jsx";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={<Loader />} persistor={persistedStore}>
      <SocketProvider>
        <GlobalContextProvider>
          <AuthContextProvider>
            <TooltipProvider>
              <Toaster />
              <App />
            </TooltipProvider>
          </AuthContextProvider>
        </GlobalContextProvider>
      </SocketProvider>
    </PersistGate>
  </Provider>
);
