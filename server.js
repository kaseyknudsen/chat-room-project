const express = require("express");
const app = express();
const path = require("path");
//we need to access this directly in order to use socket.io
const http = require("http");
const server = http.createServer(app);
//set static folder
const socketio = require("socket.io");
const io = socketio(server);

//this is how the backend can access the front end. Set static folder.
app.use(express.static(path.join(__dirname, "public")));

//run when a client connects
io.on("connection", (socket) => {
  console.log("new web socket connection...");
});
const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));
 