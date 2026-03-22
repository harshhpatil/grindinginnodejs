import { createServer } from "node:http";
import { WebSocketServer } from "ws";

const hostname = "127.0.0.1";
const port = 3000;

// creating a standard http server
const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hellow World..!!");
});

// creating a websocket server
const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  console.log("client connected to the websocket successfully");

  ws.on("message", (data) => {
    console.log("Recieved data from the client: %s", data);
    ws.send(
      "Hello there..!! the websocket connection was established successfully.",
    );
  });
});

// starting both the servers
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
  console.log(`WebSocket server is ready at ws://${hostname}:${port}`);
});
