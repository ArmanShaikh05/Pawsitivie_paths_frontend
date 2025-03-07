import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { GlobalContext } from "@/context/GlobalContext";
import { SocketContext } from "@/context/SocketContext";

const useAuth = () => {
  return useContext(AuthContext);
};

const useGlobalVariables = () => {
  return useContext(GlobalContext);
};

const useSocket = () => {
  return useContext(SocketContext);
};

export { useAuth, useGlobalVariables,useSocket };
