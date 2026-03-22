const mongoose = require("mongoose");

const songSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    file: { type: String, required: true }
  },
  { _id: false }
);

const albumSchema = new mongoose.Schema(
  {
    album: { type: String, required: true },
    singer: { type: String, required: true },
    cover: { type: String, required: true },
    songs: { type: [songSchema], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Album", albumSchema);
