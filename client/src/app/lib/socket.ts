import { io } from "socket.io-client";

const socket = io("https://chat-app-backend-on00.onrender.com"); // Your backend server URL

export default socket;

