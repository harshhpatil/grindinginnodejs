import express from "express";
import { createClient } from "redis";

const app = express();
const PORT = 3000;

// creating redis client
const redisClient = createClient();

// handling redis client error
redisClient.on("error", (err) => console.error("redis client error", err));

// function to make redis client connection
async function connectRedisClient() {
  try {
    await redisClient.connect();
    console.log("redis client connected");
  } catch (err) {
    console.error("redis clinet connection error", err);
  }
}

// function to make fake db calls
function databaseCalls() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        users: ["harsh", "john", "doe"],
        generatedAt: new Date(),
      });
    }, 3000);
  });
}

// creating the route to get the data
app.get("/users", async (req, res) => {
  try {
    const cachedKey = "users_data";
    const cachedData = await redisClient.get(cachedKey);

    // getting the data from the cache if it exits
    if (cachedData) {
      console.log("data from cache");
      return res.json(JSON.parse(cachedData));
    }

    // fetching from the database
    console.log("fetching data from the database");
    const data = databaseCalls();

    // setting the cache data with an expiration time of 120 seconds
    await redisClient.set(cachedKey, JSON.stringify(data), {
      EX: 10,
    });

    res.json(data); // returning the data
  } catch (err) {
    console.error("error fetching data", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// starting the server
async function startServer() {
  await connectRedisClient();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();