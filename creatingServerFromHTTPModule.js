import { createServer } from "node:http"; // importing the create server function from the http module

// defining the port and the hostname
const hostname = "127.0.0.1";
const port = 3000;

// creating a server
const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hellow World..!!");
});

// running the server
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
