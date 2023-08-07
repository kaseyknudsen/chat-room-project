const express = require("express");
const app = express();
const path = require("path");
//we need to access this directly in order to use socket.io
const http = require("http");
const server = http.createServer(app);
//set static folder
const socketio = require("socket.io");
const io = socketio(server);
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeavesChat,
  getRoomUsers,
} = require("./utils/users");

//this is how the backend can access the front end. Set static folder.
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatcord Bot";
//run when a client connects
//it's listening for an event, which in this case is connection
io.on("connection", (socket) => {
  console.log("new web socket connection...");
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    socket.join(user.room);
    //this will emit the message to main.js
    //emits to the single client thats connecting
    //welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));
    //broadcast when a user connects
    //this will notify everyone except the user that is connecting
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the room`)
      );

    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //this is to all clients in general
  //   io.emit();

  //listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  //runs when a client disconnects
  socket.on("disconnect", () => {
    const user = userLeavesChat(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat`)
      );
      //send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
