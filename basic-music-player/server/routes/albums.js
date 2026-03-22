const express = require("express");
const Album = require("../models/Album");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const albums = await Album.find().lean();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch albums" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const album = await Album.findById(req.params.id).lean();

    if (!album) {
      return res.status(404).json({ message: "Album not found" });
    }

    res.json(album);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch album" });
  }
});

module.exports = router;
