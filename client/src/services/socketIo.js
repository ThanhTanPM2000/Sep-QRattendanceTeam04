import React from "react";
import { io } from "socket.io-client";

// export const socket = io(`https://vlu-qrcode-server.herokuapp.com`);
export const socket = io(`http://localhost:3900`);

export const SocketContext = React.createContext();
