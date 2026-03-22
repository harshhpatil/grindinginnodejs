import jwt from "jsonwebtoken";
import crypto from "node:crypto";

if (!process.env.ACCESS_SECRET || !process.env.REFRESH_SECRET) {
  console.log(
    "access_token or refresh_token variable not recived from the .env file",
  );
  process.exit(1);
}

export const generateAccessToken = async (user) => {
  return jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.ACCESS_SECRET,
    { expiresIn: "15m" },
  );
};

export const generateRefreshToken = async (user) => {
  const tokenId = crypto.randomUUID();

  const refreshToken = jwt.sign(
    {
      id: user._id,
      tokenId,
    },
    process.env.REFRESH_SECRET,
    { expiresIn: "7d" },
  );

  return { refreshToken, tokenId };
};
