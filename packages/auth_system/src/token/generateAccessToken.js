import jwt from "jsonwebtoken";

export function generateAccessToken(payload, secret, expiresIn = "15m") {
  if (!payload || !secret) {
    throw new Error(
      "payload and secret are required to generate an access token.",
    );
  }

  return jwt.sign(payload, secret, { expiresIn });
}