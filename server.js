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

//this is how the backend can access the front end. Set static folder.
app.use(express.static(path.join(__dirname, "public")));

const botName = "Chatcord Bot";
//run when a client connects
//it's listening for an event, which in this case is connection
io.on("connection", (socket) => {
  console.log("new web socket connection...");
  //this will emit the message to main.js
  //emits to the single client thats connecting
  //welcome curent user
  socket.emit("message", formatMessage(botName, "Welcome to ChatCord"));
  //broadcast when a user connects
  //this will notify everyone except the user that is connecting
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "Welcome to ChatCord")
  );
  //this is to all clients in general

  //runs when a client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "Welcome to ChatCord"));
  });
  //   io.emit();

  //listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
