// import { Server } from "socket.io";
// import Message from "../models/Message.js";
// import { messageRateLimiter } from "./redis.js";

// export const socketHandler = (server) => {
//   const io = new Server(server, { cors: { origin: "*" } }); // creating socket.io server

//   io.on("connection", (socket) => { // connect event
//     console.log("User connected:", socket.id);

//     Message.find().sort({ createdAt: -1 }).limit(20).then((msgs) => {
//       socket.emit("chat_history", msgs.reverse());   // send last 20 messages on connect
//     });

//     socket.on("send_message", async (data) => {   // message sending event
//       const username = data.username || socket.id;  

//       try {
//         await messageRateLimiter.consume(username);
//         const newMsg = new Message({ username: data.username, text: data.text });
//         await newMsg.save();
//         io.emit("receive_message", newMsg);
//       } catch (err) {
//         socket.emit("rate_limit_exceeded", { message: "You're sending messages too quickly." });
//       }
//     });

//     socket.on("disconnect", () => console.log("User disconnected:", socket.id));
//   });
// };


import { Server } from "socket.io";
import Message from "../models/Message.js";

export const socketHandler = (server) => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    Message.find().sort({ createdAt: -1 }).limit(20).then((msgs) => {
      socket.emit("chat_history", msgs.reverse());
    });

    socket.on("send_message", async (data) => {
      const username = data.username || socket.id;

      const newMsg = new Message({ username: data.username, text: data.text });
      await newMsg.save();
      io.emit("receive_message", newMsg);
    });

    socket.on("disconnect", () => console.log("User disconnected:", socket.id));
  });
};
