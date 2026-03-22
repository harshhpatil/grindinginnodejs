const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const Album = require("./models/Album");
const albumRoutes = require("./routes/albums");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/music_player";

app.use(cors());
app.use(express.json());

app.use("/audio", express.static(path.join(__dirname, "audio")));
app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/albums", albumRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Music Player API is running" });
});

async function seedAlbumsIfEmpty() {
  const total = await Album.countDocuments();

  if (total > 0) return;

  await Album.insertMany([
    {
      album: "Morning Vibes",
      singer: "Aarav",
      cover: "/images/morning-vibes.jpg",
      songs: [
        { title: "Sunrise", file: "/audio/sunrise.mp3" },
        { title: "Coffee Time", file: "/audio/coffee-time.mp3" }
      ]
    },
    {
      album: "Night Chill",
      singer: "Meera",
      cover: "/images/night-chill.jpg",
      songs: [
        { title: "Moonlight", file: "/audio/moonlight.mp3" },
        { title: "Late Walk", file: "/audio/late-walk.mp3" }
      ]
    }
  ]);

  console.log("Seeded sample albums. Add matching files in /server/images and /server/audio.");
}

async function startServer() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    await seedAlbumsIfEmpty();

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
