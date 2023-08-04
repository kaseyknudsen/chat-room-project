//we have access to socket because of the script tag in the chat.html file

const chatForm = document.getElementById("chat-form");

const socket = io();
//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //getting the msg text from the id in the input element
  const msg = e.target.elements.msg.value;
  console.log(msg);
  //emit message to server
  socket.emit("chatMessage", msg);
});

//output message to DOM
const outputMessage = (message) => {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="text">
   ${message}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
};
