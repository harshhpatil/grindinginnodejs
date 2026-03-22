// creating a websocket connection using node.js native websocket client
const socket = new WebSocket("ws://localhost:3000");

// socket on connection
socket.addEventListener("open", (event) => {
  console.log("WebSocket connection established!");
  // Sends a message to the WebSocket server.
  socket.send("Hello Server!");
});

// socket on message
socket.addEventListener("message", (event) => {
  console.log("Message from the server: ", event.data);
});

// socket on close
socket.addEventListener("close", (event) => {
  console.log("Websocket connection closed: ", event.code, event.reason);
});

// socket on error
socket.addEventListener("error", (err) => {
  console.error("websocket error: ", err);
});
