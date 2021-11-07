import React, { createContext, useEffect, useState } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient(process.env.SERVER_URL || "localhost:4000");

export const SocketContext = createContext(socket);

export const useSocketConnection = () => {
  const [connected, setConnected] = useState(false);

  const printConnection = () => {
    console.log(
      "Socket Server is",
      socket.connected ? "connected" : "disconnected"
    );
  };

  useEffect(() => {
    socket.on("connect", () => {
      printConnection();
      setConnected(socket.connected);
    });

    socket.on("disconnect", () => {
      printConnection();
      setConnected(socket.connected);
    });
  }, []);

  return connected;
};
