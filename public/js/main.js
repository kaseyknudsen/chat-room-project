//we have access to socket because of the script tag in the chat.html file

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");

//get username and room from URL using Qs library
//ignoreQueryPrefix: true...will leave out the symbols
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
//join chatroom
socket.emit("joinRoom", { username, room });

socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  //scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //getting the msg text from the id in the input element
  const msg = e.target.elements.msg.value;
  //emit message to server
  socket.emit("chatMessage", msg);
  //clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});
//output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.userName} <span>${message.time}</span></p>
  <p class="text">
   ${message.text}</p>`;

  document.querySelector(".chat-messages").appendChild(div);
};
