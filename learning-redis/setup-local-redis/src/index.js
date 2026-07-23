import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();

// creating redis client
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  const reply = await redis.ping();
  res.json({ redis: reply });
});

app.get("/mongo", async (req, res) => {
  const url = await mongoose.connect(
    process.env.MONGO_URL || "mongodb://localhost:27018/learning_mongo-redis",
  );

  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(url);
  }

  res.json({ mongo: "connected", mongo_db: mongoose.connection.name });
});
  
app.listen(3000, () => {
  console.log("server is running on port 3000.");
});
