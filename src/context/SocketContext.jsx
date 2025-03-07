/* eslint-disable react/prop-types */
import { createContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const userId = useSelector((state) => state.userDetailReducer.userData._id);
  // const userId = "1234567890"; 

  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER);
    setSocket(newSocket);

    newSocket.emit("userOnline", userId);

    newSocket.on("updateUserStatus", ({ usersOnline }) => {
      setOnlineUsers(usersOnline);
    });

    newSocket.emit("joinRoom", userId);

    return () => {
      newSocket.disconnect();
    };
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
