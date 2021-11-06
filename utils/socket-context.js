import React, { createContext } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("localhost:4000");

export const SocketContext = createContext(socket);
