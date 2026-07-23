import express from "express";
import http from "http";
import { Server } from "socket.io";
import Redis from "ioredis";

const app = express();

// raw http server which is needed by socket.io to attach its persistent pipeline to
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// setting up the redis publish/subscribe client
const pubClient = new Redis({ host: "localhost", port: 6379 });
const subClient = new Redis({ host: "localhost", port: 6379 });

// letting subClient subscribe to the "CHAT_CHANNEL" channel
subClient.subscribe("CHAT_CHANNEL", (err, count) => {
  if (err) {
    console.error("redis subscription error: ", err);
  }
  console.log(`successfully subscribed to ${count} channel(s).`);
});

// whenever redis recieves a message from any server boardcast it to our local connected clients
subClient.on("message", (channel, message) => {
  if (channel === "CHAT_CHANNEL") {
    const parsedData = JSON.parse(message);
    console.log("redis delivered message from channel", parsedData);

    io.emit("chat-message", parsedData);
  }
});

// whenever a client connects to our server
io.on("connection", (socket) => {
  // printing the socket id of the user who just connected to the server
  console.log("user connected with id: ", socket.id);

  socket.on("chat-message", async (data) => {
    console.log("message from the client: ", socket.id, "publishing to redis ");
    
    await pubClient.publish("CHAT_CHANNEL", JSON.stringify(data));
  });

  // printing the socket id of the user who just disconnected from the server
  socket.on("disconnect", () => {
    console.log("user disconnected with id: ", socket.id);
  });
});

// spinning up the server
server.listen(3001, () => {
  console.log("listening on port 3001");
});
