import mongoose from "mongoose";

// defining the refreshtoken schema
const refreshTokenSchema = mongoose.Schema(
  {
    tokenId: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

// exporting the refreshtoken schema
export default mongoose.model("RefreshToken", refreshTokenSchema);
